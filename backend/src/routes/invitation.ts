import { Router } from 'express';
import { prisma } from '../index';
import { authenticate } from '../middleware/auth';
import { AuthRequest } from '../types';
import { matchStudentToProject, getStudentProfileData, getProjectData } from '../services/matchingEngine';

const router = Router();

router.get('/received', authenticate, async (req: AuthRequest, res) => {
  try {
    const invitations = await prisma.invitation.findMany({
      where: { receiverId: req.user!.userId },
      include: {
        project: {
          include: {
            creator: { select: { id: true, name: true } },
            skills: { include: { skill: true } },
            roles: { include: { role: true } },
            interests: { include: { interest: true } },
            members: true,
          },
        },
        sender: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(invitations);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/sent', authenticate, async (req: AuthRequest, res) => {
  try {
    const invitations = await prisma.invitation.findMany({
      where: { senderId: req.user!.userId },
      include: {
        project: { select: { id: true, title: true } },
        receiver: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(invitations);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { projectId, receiverId, message } = req.body;

    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    if (project.creatorId !== req.user!.userId) return res.status(403).json({ error: 'Not authorized' });

    const existing = await prisma.invitation.findUnique({
      where: { projectId_receiverId: { projectId, receiverId } },
    });
    if (existing) return res.status(400).json({ error: 'Invitation already sent' });

    const profile = await getStudentProfileData(receiverId);
    const projectData = await getProjectData(projectId);

    let matchScore = null;
    if (profile && projectData) {
      const result = matchStudentToProject(
        projectData.skills.map((s) => s.skill.name),
        projectData.interests.map((i) => i.interest.name),
        projectData.roles.map((r) => r.role.name),
        projectData.experienceLevel ?? undefined,
        projectData.availability ?? undefined,
        profile.skills.map((s) => s.skill.name),
        profile.interests.map((i) => i.interest.name),
        profile.preferredRoles.map((r) => r.role.name),
        profile.experience ?? undefined,
        profile.availability ?? undefined,
      );
      matchScore = result.overallMatch;
    }

    const invitation = await prisma.invitation.create({
      data: {
        projectId,
        senderId: req.user!.userId,
        receiverId,
        message,
        matchScore,
      },
      include: {
        project: { select: { id: true, title: true } },
        receiver: { select: { id: true, name: true } },
      },
    });

    await prisma.notification.create({
      data: {
        userId: receiverId,
        type: 'INVITATION_RECEIVED',
        title: 'New Project Invitation',
        message: `You have been invited to join "${project.title}"`,
        link: `/invitations`,
      },
    });

    res.status(201).json(invitation);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id/accept', authenticate, async (req: AuthRequest, res) => {
  try {
    const invitation = await prisma.invitation.findUnique({ where: { id: req.params.id } });
    if (!invitation) return res.status(404).json({ error: 'Invitation not found' });
    if (invitation.receiverId !== req.user!.userId) return res.status(403).json({ error: 'Not authorized' });
    if (invitation.status !== 'pending') return res.status(400).json({ error: 'Invitation already processed' });

    const updated = await prisma.invitation.update({
      where: { id: req.params.id },
      data: { status: 'accepted' },
    });

    const existingMember = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId: invitation.projectId, userId: invitation.receiverId } },
    });

    if (!existingMember) {
      await prisma.projectMember.create({
        data: {
          projectId: invitation.projectId,
          userId: invitation.receiverId,
        },
      });
    }

    const project = await prisma.project.findUnique({ where: { id: invitation.projectId } });
    if (project) {
      await prisma.notification.create({
        data: {
          userId: project.creatorId,
          type: 'INVITATION_ACCEPTED',
          title: 'Invitation Accepted',
          message: `Your invitation was accepted for "${project.title}"`,
          link: `/projects/${project.id}`,
        },
      });
    }

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id/decline', authenticate, async (req: AuthRequest, res) => {
  try {
    const invitation = await prisma.invitation.findUnique({ where: { id: req.params.id } });
    if (!invitation) return res.status(404).json({ error: 'Invitation not found' });
    if (invitation.receiverId !== req.user!.userId) return res.status(403).json({ error: 'Not authorized' });

    const updated = await prisma.invitation.update({
      where: { id: req.params.id },
      data: { status: 'declined' },
    });

    const project = await prisma.project.findUnique({ where: { id: invitation.projectId } });
    if (project) {
      await prisma.notification.create({
        data: {
          userId: project.creatorId,
          type: 'INVITATION_DECLINED',
          title: 'Invitation Declined',
          message: `Your invitation was declined for "${project.title}"`,
          link: `/projects/${project.id}`,
        },
      });
    }

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

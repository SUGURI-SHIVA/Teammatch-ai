import { Router } from 'express';
import { prisma } from '../index';
import { authenticate } from '../middleware/auth';
import { AuthRequest } from '../types';
import { matchStudentToProject, getStudentProfileData, getProjectData } from '../services/matchingEngine';

const router = Router();

router.get('/project/:projectId', authenticate, async (req: AuthRequest, res) => {
  try {
    const requests = await prisma.joinRequest.findMany({
      where: { projectId: req.params.projectId },
      include: {
        student: {
          select: { id: true, name: true, email: true },
        },
        project: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(requests);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/my', authenticate, async (req: AuthRequest, res) => {
  try {
    const requests = await prisma.joinRequest.findMany({
      where: { studentId: req.user!.userId },
      include: {
        project: {
          include: {
            creator: { select: { id: true, name: true } },
            skills: { include: { skill: true } },
            roles: { include: { role: true } },
            members: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(requests);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { projectId, message } = req.body;

    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const existing = await prisma.joinRequest.findUnique({
      where: { projectId_studentId: { projectId, studentId: req.user!.userId } },
    });
    if (existing) return res.status(400).json({ error: 'Request already sent' });

    const existingMember = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId: req.user!.userId } },
    });
    if (existingMember) return res.status(400).json({ error: 'Already a member' });

    const profile = await getStudentProfileData(req.user!.userId);
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

    const request = await prisma.joinRequest.create({
      data: {
        projectId,
        studentId: req.user!.userId,
        message,
        matchScore,
      },
      include: {
        student: { select: { id: true, name: true } },
        project: { select: { id: true, title: true } },
      },
    });

    await prisma.notification.create({
      data: {
        userId: project.creatorId,
        type: 'JOIN_REQUEST_RECEIVED',
        title: 'New Join Request',
        message: `A student wants to join "${project.title}"`,
        link: `/projects/${project.id}/requests`,
      },
    });

    res.status(201).json(request);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id/accept', authenticate, async (req: AuthRequest, res) => {
  try {
    const joinRequest = await prisma.joinRequest.findUnique({ where: { id: req.params.id } });
    if (!joinRequest) return res.status(404).json({ error: 'Request not found' });

    const project = await prisma.project.findUnique({ where: { id: joinRequest.projectId } });
    if (!project || project.creatorId !== req.user!.userId) return res.status(403).json({ error: 'Not authorized' });
    if (joinRequest.status !== 'pending') return res.status(400).json({ error: 'Request already processed' });

    const updated = await prisma.joinRequest.update({
      where: { id: req.params.id },
      data: { status: 'accepted', reviewerId: req.user!.userId },
    });

    const existingMember = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId: joinRequest.projectId, userId: joinRequest.studentId } },
    });

    if (!existingMember) {
      await prisma.projectMember.create({
        data: {
          projectId: joinRequest.projectId,
          userId: joinRequest.studentId,
        },
      });
    }

    await prisma.notification.create({
      data: {
        userId: joinRequest.studentId,
        type: 'JOIN_REQUEST_ACCEPTED',
        title: 'Request Accepted',
        message: `Your request to join "${project.title}" was accepted!`,
        link: `/projects/${project.id}`,
      },
    });

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id/reject', authenticate, async (req: AuthRequest, res) => {
  try {
    const joinRequest = await prisma.joinRequest.findUnique({ where: { id: req.params.id } });
    if (!joinRequest) return res.status(404).json({ error: 'Request not found' });

    const project = await prisma.project.findUnique({ where: { id: joinRequest.projectId } });
    if (!project || project.creatorId !== req.user!.userId) return res.status(403).json({ error: 'Not authorized' });

    const updated = await prisma.joinRequest.update({
      where: { id: req.params.id },
      data: { status: 'rejected', reviewerId: req.user!.userId },
    });

    await prisma.notification.create({
      data: {
        userId: joinRequest.studentId,
        type: 'JOIN_REQUEST_REJECTED',
        title: 'Request Rejected',
        message: `Your request to join "${project.title}" was not accepted`,
        link: `/projects/${project.id}`,
      },
    });

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

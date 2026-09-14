import { Router } from 'express';
import { prisma } from '../index';
import { authenticate } from '../middleware/auth';
import { AuthRequest } from '../types';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: { status: 'open' },
      include: {
        creator: { select: { id: true, name: true } },
        skills: { include: { skill: true } },
        roles: { include: { role: true } },
        interests: { include: { interest: true } },
        members: {
          include: {
            user: { select: { id: true, name: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(projects);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/my', authenticate, async (req: AuthRequest, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: { creatorId: req.user!.userId },
      include: {
        skills: { include: { skill: true } },
        roles: { include: { role: true } },
        interests: { include: { interest: true } },
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
        },
        invitations: { where: { status: 'pending' } },
        joinRequests: { where: { status: 'pending' } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(projects);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/member', authenticate, async (req: AuthRequest, res) => {
  try {
    const memberships = await prisma.projectMember.findMany({
      where: { userId: req.user!.userId },
      include: {
        project: {
          include: {
            creator: { select: { id: true, name: true } },
            skills: { include: { skill: true } },
            roles: { include: { role: true } },
            members: {
              include: {
                user: { select: { id: true, name: true } },
              },
            },
          },
        },
      },
    });
    res.json(memberships.map((m) => m.project));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { title, description, domain, teamSize, experienceLevel, availability, otherRequirements, skills, roles, interests } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        domain,
        creatorId: req.user!.userId,
        teamSize: teamSize || 4,
        experienceLevel,
        availability,
        otherRequirements,
        skills: {
          create: await Promise.all(
            (skills || []).map(async (skillName: string) => {
              const skill = await prisma.skill.upsert({
                where: { name: skillName },
                update: {},
                create: { name: skillName },
              });
              return { skillId: skill.id, required: true };
            })
          ),
        },
        roles: {
          create: await Promise.all(
            (roles || []).map(async (roleName: string) => {
              const role = await prisma.role.upsert({
                where: { name: roleName },
                update: {},
                create: { name: roleName },
              });
              return { roleId: role.id, count: 1 };
            })
          ),
        },
        interests: {
          create: await Promise.all(
            (interests || []).map(async (name: string) => {
              const interest = await prisma.interest.upsert({
                where: { name },
                update: {},
                create: { name },
              });
              return { interestId: interest.id };
            })
          ),
        },
      },
      include: {
        skills: { include: { skill: true } },
        roles: { include: { role: true } },
        interests: { include: { interest: true } },
      },
    });

    res.status(201).json(project);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
      include: {
        creator: { select: { id: true, name: true, email: true } },
        skills: { include: { skill: true } },
        roles: { include: { role: true } },
        interests: { include: { interest: true } },
        members: {
          include: { user: { select: { id: true, name: true } } },
        },
      },
    });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const project = await prisma.project.findUnique({ where: { id: req.params.id } });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    if (project.creatorId !== req.user!.userId) return res.status(403).json({ error: 'Not authorized' });

    const updated = await prisma.project.update({
      where: { id: req.params.id },
      data: { ...req.body },
      include: {
        skills: { include: { skill: true } },
        roles: { include: { role: true } },
        interests: { include: { interest: true } },
      },
    });
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const project = await prisma.project.findUnique({ where: { id: req.params.id } });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    if (project.creatorId !== req.user!.userId) return res.status(403).json({ error: 'Not authorized' });

    await prisma.project.delete({ where: { id: req.params.id } });
    res.json({ message: 'Project deleted' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

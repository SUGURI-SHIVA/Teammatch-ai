import { Router } from 'express';
import { prisma } from '../index';
import { authenticate } from '../middleware/auth';
import { AuthRequest } from '../types';

const router = Router();

router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const profile = await prisma.studentProfile.findUnique({
      where: { userId: req.user!.userId },
      include: {
        skills: { include: { skill: true } },
        interests: { include: { interest: true } },
        preferredRoles: { include: { role: true } },
        learningGoals: true,
        previousProjects: true,
      },
    });
    res.json(profile);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { college, department, year, experience, availability, bio, skills, interests, preferredRoles, learningGoals, previousProjects } = req.body;

    const existing = await prisma.studentProfile.findUnique({ where: { userId: req.user!.userId } });

    if (existing) {
      await prisma.studentSkill.deleteMany({ where: { profileId: existing.id } });
      await prisma.studentInterest.deleteMany({ where: { profileId: existing.id } });
      await prisma.studentRole.deleteMany({ where: { profileId: existing.id } });
      await prisma.learningGoal.deleteMany({ where: { profileId: existing.id } });
      await prisma.previousProject.deleteMany({ where: { profileId: existing.id } });

      const profile = await prisma.studentProfile.update({
        where: { userId: req.user!.userId },
        data: {
          college, department, year, experience, availability, bio,
          skills: {
            create: await Promise.all(
              (skills || []).map(async (s: any) => {
                const skillName = typeof s === 'string' ? s : s.name;
                const level = typeof s === 'string' ? 'Intermediate' : s.level || 'Intermediate';
                const skill = await prisma.skill.upsert({
                  where: { name: skillName },
                  update: {},
                  create: { name: skillName },
                });
                return { skillId: skill.id, level };
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
          preferredRoles: {
            create: await Promise.all(
              (preferredRoles || []).map(async (name: string) => {
                const role = await prisma.role.upsert({
                  where: { name },
                  update: {},
                  create: { name },
                });
                return { roleId: role.id };
              })
            ),
          },
          learningGoals: {
            create: (Array.isArray(learningGoals) ? learningGoals : (learningGoals ? [learningGoals] : [])).map((skill: string) => ({ skill })),
          },
          previousProjects: {
            create: (previousProjects || []).map((p: any) => ({
              name: p.name, description: p.description, skills: p.skills, url: p.url,
            })),
          },
        },
        include: {
          skills: { include: { skill: true } },
          interests: { include: { interest: true } },
          preferredRoles: { include: { role: true } },
          learningGoals: true,
          previousProjects: true,
        },
      });
      return res.json(profile);
    }

    const profile = await prisma.studentProfile.create({
      data: {
        userId: req.user!.userId,
        college, department, year, experience, availability, bio,
        skills: {
          create: await Promise.all(
            (skills || []).map(async (s: any) => {
              const skillName = typeof s === 'string' ? s : s.name;
              const level = typeof s === 'string' ? 'Intermediate' : s.level || 'Intermediate';
              const skill = await prisma.skill.upsert({
                where: { name: skillName },
                update: {},
                create: { name: skillName },
              });
              return { skillId: skill.id, level };
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
        preferredRoles: {
          create: await Promise.all(
            (preferredRoles || []).map(async (name: string) => {
              const role = await prisma.role.upsert({
                where: { name },
                update: {},
                create: { name },
              });
              return { roleId: role.id };
            })
          ),
        },
        learningGoals: {
          create: (Array.isArray(learningGoals) ? learningGoals : (learningGoals ? [learningGoals] : [])).map((skill: string) => ({ skill })),
        },
        previousProjects: {
          create: (previousProjects || []).map((p: any) => ({
            name: p.name, description: p.description, skills: p.skills, url: p.url,
          })),
        },
      },
      include: {
        skills: { include: { skill: true } },
        interests: { include: { interest: true } },
        preferredRoles: { include: { role: true } },
        learningGoals: true,
        previousProjects: true,
      },
    });

    res.status(201).json(profile);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/all', async (req, res) => {
  try {
    const profiles = await prisma.studentProfile.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        skills: { include: { skill: true } },
        interests: { include: { interest: true } },
        preferredRoles: { include: { role: true } },
        learningGoals: true,
      },
    });
    res.json(profiles);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:userId', async (req, res) => {
  try {
    const profile = await prisma.studentProfile.findUnique({
      where: { userId: req.params.userId },
      include: {
        user: { select: { id: true, name: true, email: true } },
        skills: { include: { skill: true } },
        interests: { include: { interest: true } },
        preferredRoles: { include: { role: true } },
        learningGoals: true,
        previousProjects: true,
      },
    });
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    res.json(profile);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

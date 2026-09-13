import { Router } from 'express';
import { prisma } from '../index';
import { authenticate } from '../middleware/auth';
import { AuthRequest } from '../types';
import { matchStudentToProject, getStudentProfileData, getProjectData } from '../services/matchingEngine';

const router = Router();

router.get('/projects', authenticate, async (req: AuthRequest, res) => {
  try {
    const profile = await getStudentProfileData(req.user!.userId);
    if (!profile) {
      const projects = await prisma.project.findMany({
        where: { status: 'open' },
        include: {
          creator: { select: { id: true, name: true } },
          skills: { include: { skill: true } },
          roles: { include: { role: true } },
          interests: { include: { interest: true } },
          members: true,
        },
        orderBy: { createdAt: 'desc' },
      });
      return res.json(projects.map((p) => ({ ...p, matchScore: null, reasons: [] })));
    }

    const projects = await prisma.project.findMany({
      where: { status: 'open' },
      include: {
        creator: { select: { id: true, name: true } },
        skills: { include: { skill: true } },
        roles: { include: { role: true } },
        interests: { include: { interest: true } },
        members: true,
      },
    });

    const studentSkills = profile.skills.map((s) => s.skill.name);
    const studentInterests = profile.interests.map((i) => i.interest.name);
    const studentRoles = profile.preferredRoles.map((r) => r.role.name);

    const scored = projects.map((project) => {
      const projectSkills = project.skills.map((s) => s.skill.name);
      const projectInterests = project.interests.map((i) => i.interest.name);
      const projectRoles = project.roles.map((r) => r.role.name);

      const match = matchStudentToProject(
        projectSkills, projectInterests, projectRoles, project.experienceLevel ?? undefined, project.availability ?? undefined,
        studentSkills, studentInterests, studentRoles, profile.experience ?? undefined, profile.availability ?? undefined
      );

      return {
        ...project,
        matchScore: match.overallMatch,
        skillMatch: match.skillMatch,
        interestMatch: match.interestMatch,
        roleMatch: match.roleMatch,
        experienceMatch: match.experienceMatch,
        availabilityMatch: match.availabilityMatch,
        reasons: match.reasons,
      };
    });

    scored.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    res.json(scored);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/students/:projectId', async (req, res) => {
  try {
    const project = await getProjectData(req.params.projectId);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const profiles = await prisma.studentProfile.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        skills: { include: { skill: true } },
        interests: { include: { interest: true } },
        preferredRoles: { include: { role: true } },
        learningGoals: true,
      },
    });

    const projectSkills = project.skills.map((s) => s.skill.name);
    const projectInterests = project.interests.map((i) => i.interest.name);
    const projectRoles = project.roles.map((r) => r.role.name);
    const memberUserIds = project.members.map((m) => m.userId);

    const scored = profiles
      .filter((p) => !memberUserIds.includes(p.userId))
      .map((profile) => {
        const studentSkills = profile.skills.map((s) => s.skill.name);
        const studentInterests = profile.interests.map((i) => i.interest.name);
        const studentRoles = profile.preferredRoles.map((r) => r.role.name);

        const match = matchStudentToProject(
          projectSkills, projectInterests, projectRoles, project.experienceLevel ?? undefined, project.availability ?? undefined,
          studentSkills, studentInterests, studentRoles, profile.experience ?? undefined, profile.availability ?? undefined
        );

        return {
          ...profile,
          matchScore: match.overallMatch,
          skillMatch: match.skillMatch,
          interestMatch: match.interestMatch,
          roleMatch: match.roleMatch,
          experienceMatch: match.experienceMatch,
          availabilityMatch: match.availabilityMatch,
          reasons: match.reasons,
        };
      });

    scored.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    res.json(scored);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/team-coverage/:projectId', async (req, res) => {
  try {
    const project = await getProjectData(req.params.projectId);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const requiredSkills = project.skills.map((s) => s.skill.name.toLowerCase());
    const memberProfiles = await prisma.studentProfile.findMany({
      where: {
        userId: { in: project.members.map((m) => m.userId) },
      },
      include: {
        skills: { include: { skill: true } },
      },
    });

    const coveredSkills = new Set<string>();
    const skillCounts = new Map<string, number>();

    for (const member of memberProfiles) {
      for (const s of member.skills) {
        const name = s.skill.name.toLowerCase();
        coveredSkills.add(name);
        skillCounts.set(name, (skillCounts.get(name) || 0) + 1);
      }
    }

    const missingSkills = requiredSkills.filter((s) => !coveredSkills.has(s));
    const duplicateSkills = Array.from(skillCounts.entries())
      .filter(([_, count]) => count > 1)
      .map(([skill, count]) => ({ skill, count }));

    const coverage = requiredSkills.length > 0
      ? Math.round(((requiredSkills.length - missingSkills.length) / requiredSkills.length) * 100)
      : 100;

    res.json({
      coverage,
      coveredSkills: Array.from(coveredSkills),
      missingSkills,
      duplicateSkills,
      teamSize: project.members.length,
      requiredTeamSize: project.teamSize,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

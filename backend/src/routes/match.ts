import { Router } from 'express';
import { prisma } from '../index';
import { authenticate } from '../middleware/auth';
import { AuthRequest } from '../types';
import { matchStudentToProject, getStudentProfileData, getProjectData } from '../services/matchingEngine';

const router = Router();

router.get('/student-project/:studentId/:projectId', async (req, res) => {
  try {
    const { studentId, projectId } = req.params;

    const profile = await getStudentProfileData(studentId);
    if (!profile) return res.status(404).json({ error: 'Student profile not found' });

    const project = await getProjectData(projectId);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const projectSkills = project.skills.map((s) => s.skill.name);
    const projectInterests = project.interests.map((i) => i.interest.name);
    const projectRoles = project.roles.map((r) => r.role.name);

    const studentSkills = profile.skills.map((s) => s.skill.name);
    const studentInterests = profile.interests.map((i) => i.interest.name);
    const studentRoles = profile.preferredRoles.map((r) => r.role.name);

    const result = matchStudentToProject(
      projectSkills, projectInterests, projectRoles, project.experienceLevel ?? undefined, project.availability ?? undefined,
      studentSkills, studentInterests, studentRoles, profile.experience ?? undefined, profile.availability ?? undefined
    );

    res.json({
      studentId,
      projectId,
      ...result,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

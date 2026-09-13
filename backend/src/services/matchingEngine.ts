import { prisma } from '../index';
import { MatchResult } from '../types';

const SKILL_ALIASES: Record<string, string[]> = {
  'javascript': ['js', 'ecmascript', 'es6', 'es2015'],
  'typescript': ['ts'],
  'react': ['reactjs', 'react.js'],
  'vue': ['vuejs', 'vue.js', 'vue3'],
  'angular': ['angularjs'],
  'node': ['nodejs', 'node.js', 'node js'],
  'python': ['py'],
  'machine learning': ['ml', 'machinelearning'],
  'deep learning': ['dl', 'deeplearning'],
  'artificial intelligence': ['ai', 'artificial intelligence'],
  'html': ['html5'],
  'css': ['css3'],
  'c sharp': ['c#', 'csharp', 'cs'],
  'c plus plus': ['c++', 'cpp'],
  'object oriented programming': ['oop', 'object-oriented'],
  'sql': ['mysql', 'postgresql', 'sqlite'],
  'mongodb': ['mongo'],
  'aws': ['amazon web services'],
  'gcp': ['google cloud platform', 'google cloud'],
  'docker': ['containerization', 'containers'],
  'kubernetes': ['k8s'],
  'git': ['github', 'gitlab', 'version control'],
  'flutter': ['dart', 'flutter dart'],
  'react native': ['rn'],
  'ui ux': ['ui/ux', 'ui-ux', 'user interface', 'user experience', 'ux/ui', 'figma'],
  'nlp': ['natural language processing'],
  'computer vision': ['cv', 'image processing'],
  'data science': ['dataanalysis', 'data analysis'],
  'cybersecurity': ['cyber security', 'information security', 'infosec'],
  'blockchain': ['web3', 'solidity', 'ethereum'],
  'iot': ['internet of things'],
};

function normalizeSkill(skill: string): string {
  const lower = skill.toLowerCase().trim();
  for (const [canonical, aliases] of Object.entries(SKILL_ALIASES)) {
    if (canonical === lower || aliases.includes(lower)) {
      return canonical;
    }
  }
  return lower;
}

function calculateSkillMatch(projectSkills: string[], studentSkills: string[]): { score: number; matched: string[] } {
  const normalizedProject = projectSkills.map(normalizeSkill);
  const normalizedStudent = studentSkills.map(normalizeSkill);

  const matched: string[] = [];
  let matchCount = 0;

  for (const ps of normalizedProject) {
    if (normalizedStudent.includes(ps)) {
      matchCount++;
      matched.push(ps);
    }
  }

  const score = normalizedProject.length > 0 ? (matchCount / normalizedProject.length) * 100 : 0;
  return { score: Math.round(score), matched };
}

function calculateInterestMatch(projectInterests: string[], studentInterests: string[]): { score: number; matched: string[] } {
  const normalizedProject = projectInterests.map((i) => i.toLowerCase().trim());
  const normalizedStudent = studentInterests.map((i) => i.toLowerCase().trim());

  const matched: string[] = [];
  let matchCount = 0;

  for (const pi of normalizedProject) {
    if (normalizedStudent.includes(pi)) {
      matchCount++;
      matched.push(pi);
    }
  }

  const score = normalizedProject.length > 0 ? (matchCount / normalizedProject.length) * 100 : 0;
  return { score: Math.round(score), matched };
}

function calculateRoleMatch(projectRoles: string[], studentRoles: string[]): { score: number; matched: string[] } {
  const normalizedProject = projectRoles.map((r) => r.toLowerCase().trim());
  const normalizedStudent = studentRoles.map((r) => r.toLowerCase().trim());

  const matched: string[] = [];
  let matchCount = 0;

  for (const pr of normalizedProject) {
    if (normalizedStudent.includes(pr)) {
      matchCount++;
      matched.push(pr);
    }
  }

  const score = normalizedProject.length > 0 ? (matchCount / normalizedProject.length) * 100 : 0;
  return { score: Math.round(score), matched };
}

function calculateExperienceMatch(projectLevel?: string, studentLevel?: string): number {
  if (!projectLevel || !studentLevel) return 70;

  const levels: Record<string, number> = {
    beginner: 1,
    intermediate: 2,
    advanced: 3,
  };

  const pLevel = levels[projectLevel.toLowerCase()] || 2;
  const sLevel = levels[studentLevel.toLowerCase()] || 2;

  const diff = Math.abs(pLevel - sLevel);
  if (diff === 0) return 100;
  if (diff === 1) return 70;
  return 40;
}

function calculateAvailabilityMatch(projectAvailability?: string, studentAvailability?: string): number {
  if (!projectAvailability || !studentAvailability) return 70;

  const pDays = projectAvailability.toLowerCase();
  const sDays = studentAvailability.toLowerCase();

  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  let matchCount = 0;
  let totalRequired = 0;

  for (const day of daysOfWeek) {
    if (pDays.includes(day)) {
      totalRequired++;
      if (sDays.includes(day)) {
        matchCount++;
      }
    }
  }

  return totalRequired > 0 ? Math.round((matchCount / totalRequired) * 100) : 70;
}

export function buildReasons(
  matchedSkills: string[],
  matchedInterests: string[],
  matchedRoles: string[],
  skillScore: number,
  interestScore: number,
  roleScore: number
): string[] {
  const reasons: string[] = [];

  if (matchedSkills.length > 0) {
    reasons.push(`${matchedSkills.slice(0, 3).join(', ')} skill${matchedSkills.length > 1 ? 's' : ''} match project requirements`);
  }
  if (skillScore < 50 && matchedSkills.length === 0) {
    reasons.push('Limited skill overlap with project requirements');
  }
  if (matchedInterests.length > 0) {
    reasons.push(`Interested in ${matchedInterests.slice(0, 2).join(' and ')}`);
  }
  if (matchedRoles.length > 0) {
    reasons.push(`Preferred role${matchedRoles.length > 1 ? 's' : ''}: ${matchedRoles.join(', ')}`);
  }

  return reasons;
}

export function matchStudentToProject(
  projectSkills: string[],
  projectInterests: string[],
  projectRoles: string[],
  projectExperience?: string,
  projectAvailability?: string,
  studentSkills: string[] = [],
  studentInterests: string[] = [],
  studentRoles: string[] = [],
  studentExperience?: string,
  studentAvailability?: string,
): MatchResult {
  const { score: skillMatch, matched: matchedSkills } = calculateSkillMatch(projectSkills, studentSkills);
  const { score: interestMatch, matched: matchedInterests } = calculateInterestMatch(projectInterests, studentInterests);
  const { score: roleMatch, matched: matchedRoles } = calculateRoleMatch(projectRoles, studentRoles);
  const experienceMatch = calculateExperienceMatch(projectExperience, studentExperience);
  const availabilityMatch = calculateAvailabilityMatch(projectAvailability, studentAvailability);

  const overallMatch = Math.round(
    skillMatch * 0.4 +
    interestMatch * 0.2 +
    roleMatch * 0.15 +
    experienceMatch * 0.1 +
    availabilityMatch * 0.1 +
    (matchedInterests.length > 0 ? 5 : 0)
  );

  const reasons = buildReasons(matchedSkills, matchedInterests, matchedRoles, skillMatch, interestMatch, roleMatch);

  return {
    overallMatch: Math.min(100, overallMatch),
    skillMatch,
    interestMatch,
    roleMatch,
    experienceMatch,
    availabilityMatch,
    reasons,
  };
}

export async function getStudentProfileData(userId: string) {
  const profile = await prisma.studentProfile.findUnique({
    where: { userId },
    include: {
      skills: { include: { skill: true } },
      interests: { include: { interest: true } },
      preferredRoles: { include: { role: true } },
      learningGoals: true,
    },
  });
  return profile;
}

export async function getProjectData(projectId: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      skills: { include: { skill: true } },
      roles: { include: { role: true } },
      interests: { include: { interest: true } },
      members: true,
    },
  });
  return project;
}

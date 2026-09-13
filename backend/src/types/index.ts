import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: JwtPayload & { userId: string; email: string; role: string };
}

export interface CreateProjectInput {
  title: string;
  description: string;
  domain?: string;
  teamSize?: number;
  experienceLevel?: string;
  availability?: string;
  otherRequirements?: string;
  skills: string[];
  roles: string[];
  interests: string[];
}

export interface CreateProfileInput {
  college?: string;
  department?: string;
  year?: string;
  experience?: string;
  availability?: string;
  bio?: string;
  skills: { name: string; level?: string }[];
  interests: string[];
  preferredRoles: string[];
  learningGoals: string[];
  previousProjects: { name: string; description?: string; skills?: string; url?: string }[];
}

export interface MatchResult {
  overallMatch: number;
  skillMatch: number;
  interestMatch: number;
  roleMatch: number;
  experienceMatch: number;
  availabilityMatch: number;
  reasons: string[];
}

export interface TeamCoverage {
  coverage: number;
  coveredSkills: string[];
  missingSkills: string[];
  duplicateSkills: { skill: string; count: number }[];
}

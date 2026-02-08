// types/project.d.ts
import type { ApiResponse } from './api';

export type User = {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type ProjectMemberRole = 'OWNER' | 'ADMIN' | 'MEMBER';

type ProjectMember = {
  id: string;
  user: {
    id: string;
    name: string;
    email?: string;
  };
};

export type Project = {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  owner: User;
  members: ProjectMember[];
  createdAt: string;
  updatedAt: string;
  _count: {
    tasks: number;
  };
};

// GET /projects
export type ProjectsResponse = ApiResponse<{
  projects: Project[];
}>;

// GET /projects/:id
export type ProjectResponse = ApiResponse<{
  project: Project;
}>;

export type UpdateProjectPayload = {
  name: string;
  description: string;
  contributorIds?: string[];
};

export type CreateProjectPayload = {
  name: string;
  description: string;
  contributors: string[];
};

export interface Role {
  id: number;
  name: string;
  description: string;
  permissions: Permission[];
  createdAt: Date;
}

export interface Permission {
  id: number;
  name: string;
  description: string;
}

export interface CreateRoleDto {
  name: string;
  description: string;
  permissions: number[];
}

export interface UpdateRoleDto {
  name?: string;
  description?: string;
  permissions?: number[];
}
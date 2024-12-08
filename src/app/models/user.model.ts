export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  roleId: number;
  roleName: string;
  active: boolean;
  createdAt: Date;
  lastLogin?: Date;
  token?: string;
}

export interface CreateUserDto {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  roleId: number;
  password: string;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  roleId?: number;
  active?: boolean;
  roleName?: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}
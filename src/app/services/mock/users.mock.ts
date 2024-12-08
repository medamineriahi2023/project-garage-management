import { User } from '../../models/user.model';
import { MOCK_ROLES } from './roles.mock';

export const MOCK_USERS: User[] = [
  {
    id: 1,
    username: 'admin',
    firstName: 'System',
    lastName: 'Administrator',
    email: 'admin@example.com',
    roleId: 1,
    roleName: 'Admin',
    active: true,
    createdAt: new Date('2023-01-01'),
    lastLogin: new Date()
  },
  {
    id: 2,
    username: 'manager',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    roleId: 2,
    roleName: 'Manager',
    active: true,
    createdAt: new Date('2023-01-01'),
    lastLogin: new Date()
  },
  {
    id: 3,
    username: 'tech1',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    roleId: 3,
    roleName: 'Technician',
    active: true,
    createdAt: new Date('2023-01-01'),
    lastLogin: new Date()
  }
];
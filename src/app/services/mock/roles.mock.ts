import { Role } from '../../models/role.model';
import { MOCK_PERMISSIONS } from './permissions.mock';

export const MOCK_ROLES: Role[] = [
  {
    id: 1,
    name: 'Admin',
    description: 'Full system access',
    permissions: MOCK_PERMISSIONS,
    createdAt: new Date('2023-01-01')
  },
  {
    id: 2,
    name: 'Manager',
    description: 'Manage daily operations',
    permissions: MOCK_PERMISSIONS.filter(p => p.name !== 'MANAGE_ROLES'),
    createdAt: new Date('2023-01-01')
  },
  {
    id: 3,
    name: 'Technician',
    description: 'Handle maintenance and stock',
    permissions: MOCK_PERMISSIONS.filter(p => 
      ['VIEW_DASHBOARD', 'MANAGE_MAINTENANCE', 'MANAGE_STOCK'].includes(p.name)
    ),
    createdAt: new Date('2023-01-01')
  }
];
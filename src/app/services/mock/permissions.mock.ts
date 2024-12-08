import { Permission } from '../../models/role.model';

export const MOCK_PERMISSIONS: Permission[] = [
  { id: 1, name: 'VIEW_DASHBOARD', description: 'View dashboard statistics' },
  { id: 2, name: 'MANAGE_USERS', description: 'Create, update, and delete users' },
  { id: 3, name: 'MANAGE_ROLES', description: 'Create, update, and delete roles' },
  { id: 4, name: 'MANAGE_SERVICES', description: 'Manage service offerings' },
  { id: 5, name: 'MANAGE_STOCK', description: 'Manage inventory stock' },
  { id: 6, name: 'MANAGE_MAINTENANCE', description: 'Manage maintenance records' },
  { id: 7, name: 'VIEW_REPORTS', description: 'View system reports' },
  { id: 8, name: 'EXPORT_DATA', description: 'Export system data' }
];
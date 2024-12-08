import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Role, CreateRoleDto, UpdateRoleDto, Permission } from '../models/role.model';
import { MOCK_ROLES } from './mock/roles.mock';
import { MOCK_PERMISSIONS } from './mock/permissions.mock';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private roles: Role[] = [...MOCK_ROLES];
  private lastId = this.roles.length;

  getRoles(): Observable<Role[]> {
    return of([...this.roles]).pipe(delay(500));
  }

  getRoleById(id: number): Observable<Role> {
    // Handle case where id is 0 or undefined
    if (!id) {
      return of({
        id: 0,
        name: 'Guest',
        description: 'Default guest role',
        permissions: [],
        createdAt: new Date()
      });
    }

    const role = this.roles.find(r => r.id === id);
    if (!role) {
      // Return a default role instead of throwing an error
      return of({
        id: 0,
        name: 'Guest',
        description: 'Default guest role',
        permissions: [],
        createdAt: new Date()
      });
    }
    
    return of(role).pipe(delay(500));
  }

  getPermissions(): Observable<Permission[]> {
    return of([...MOCK_PERMISSIONS]).pipe(delay(500));
  }

  createRole(dto: CreateRoleDto): Observable<Role> {
    const existingRole = this.roles.find(r => r.name === dto.name);
    if (existingRole) {
      return throwError(() => new Error('Role name already exists'));
    }

    const permissions = MOCK_PERMISSIONS.filter(p => dto.permissions.includes(p.id));
    const newRole: Role = {
      id: ++this.lastId,
      name: dto.name,
      description: dto.description,
      permissions,
      createdAt: new Date()
    };

    this.roles.push(newRole);
    return of(newRole).pipe(delay(500));
  }

  updateRole(id: number, dto: UpdateRoleDto): Observable<Role> {
    const index = this.roles.findIndex(r => r.id === id);
    if (index === -1) {
      return throwError(() => new Error('Role not found'));
    }

    if (dto.name) {
      const existingRole = this.roles.find(r => r.name === dto.name && r.id !== id);
      if (existingRole) {
        return throwError(() => new Error('Role name already exists'));
      }
    }

    let permissions = this.roles[index].permissions;
    if (dto.permissions) {
      permissions = MOCK_PERMISSIONS.filter(p => dto.permissions?.includes(p.id));
    }

    const updatedRole = {
      ...this.roles[index],
      ...dto,
      permissions
    };

    this.roles[index] = updatedRole;
    return of(updatedRole).pipe(delay(500));
  }

  deleteRole(id: number): Observable<void> {
    const index = this.roles.findIndex(r => r.id === id);
    if (index === -1) {
      return throwError(() => new Error('Role not found'));
    }

    this.roles.splice(index, 1);
    return of(void 0).pipe(delay(500));
  }
}
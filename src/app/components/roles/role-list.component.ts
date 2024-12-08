import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Role, CreateRoleDto, UpdateRoleDto, Permission } from '../../models/role.model';
import { RoleService } from '../../services/role.service';
import { RoleFormComponent } from './role-form/role-form.component';

@Component({
  selector: 'app-role-list',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    TooltipModule,
    TagModule,
    ToastModule,
    ConfirmDialogModule,
    RoleFormComponent
  ],
  providers: [MessageService, ConfirmationService],
  template: `
    <p-toast></p-toast>
    <p-confirmDialog></p-confirmDialog>
    
    <div class="card">
      <div class="flex justify-content-between align-items-center mb-4">
        <h2 class="text-2xl font-semibold text-primary m-0">
          <i class="pi pi-users mr-2"></i>Role Management
        </h2>
        <button pButton label="Add Role" 
                icon="pi pi-plus"
                (click)="showRoleDialog()"></button>
      </div>

      <p-table [value]="roles"
               [loading]="loading"
               styleClass="p-datatable-gridlines">
        <ng-template pTemplate="header">
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Permissions</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-role>
          <tr>
            <td>{{role.name}}</td>
            <td>{{role.description}}</td>
            <td>
              <div class="flex flex-wrap gap-2">
                <p-tag *ngFor="let permission of role.permissions"
                       [value]="permission.name"
                       severity="info">
                </p-tag>
              </div>
            </td>
            <td>{{role.createdAt | date:'medium'}}</td>
            <td>
              <button pButton icon="pi pi-pencil"
                      class="p-button-rounded p-button-text"
                      (click)="editRole(role)"
                      [disabled]="role.name === 'Admin'"
                      pTooltip="Edit Role"></button>
              <button pButton icon="pi pi-trash"
                      class="p-button-rounded p-button-text p-button-danger"
                      (click)="confirmDelete(role)"
                      [disabled]="role.name === 'Admin'"
                      pTooltip="Delete Role"></button>
            </td>
          </tr>
        </ng-template>
      </p-table>
    </div>

    <app-role-form
      [(visible)]="displayRoleDialog"
      [permissions]="permissions"
      [editMode]="editMode"
      [role]="selectedRole"
      (save)="saveRole($event)"
      (cancel)="hideRoleDialog()">
    </app-role-form>
  `
})
export class RoleListComponent implements OnInit {
  roles: Role[] = [];
  permissions: Permission[] = [];
  loading = true;
  displayRoleDialog = false;
  editMode = false;
  selectedRole?: Role;

  constructor(
    private roleService: RoleService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadRoles();
    this.loadPermissions();
  }

  loadRoles() {
    this.loading = true;
    this.roleService.getRoles().subscribe({
      next: (roles) => {
        this.roles = roles;
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load roles'
        });
        this.loading = false;
      }
    });
  }

  loadPermissions() {
    this.roleService.getPermissions().subscribe({
      next: (permissions) => {
        this.permissions = permissions;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load permissions'
        });
      }
    });
  }

  showRoleDialog() {
    this.editMode = false;
    this.selectedRole = undefined;
    this.displayRoleDialog = true;
  }

  hideRoleDialog() {
    this.displayRoleDialog = false;
    this.selectedRole = undefined;
  }

  editRole(role: Role) {
    this.editMode = true;
    this.selectedRole = role;
    this.displayRoleDialog = true;
  }

  saveRole(roleData: CreateRoleDto | UpdateRoleDto) {
    if (this.editMode && this.selectedRole) {
      this.roleService.updateRole(this.selectedRole.id, roleData as UpdateRoleDto).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Role updated successfully'
          });
          this.loadRoles();
          this.hideRoleDialog();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update role'
          });
        }
      });
    } else {
      this.roleService.createRole(roleData as CreateRoleDto).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Role created successfully'
          });
          this.loadRoles();
          this.hideRoleDialog();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to create role'
          });
        }
      });
    }
  }

  confirmDelete(role: Role) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete the role "${role.name}"?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteRole(role);
      }
    });
  }

  deleteRole(role: Role) {
    this.roleService.deleteRole(role.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Role deleted successfully'
        });
        this.loadRoles();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete role'
        });
      }
    });
  }
}
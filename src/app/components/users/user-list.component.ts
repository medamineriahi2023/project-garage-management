import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { User, CreateUserDto, UpdateUserDto } from '../../models/user.model';
import { Role } from '../../models/role.model';
import { UserService } from '../../services/user.service';
import { RoleService } from '../../services/role.service';
import { UserFormComponent } from './user-form/user-form.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    TooltipModule,
    TagModule,
    ToastModule,
    ConfirmDialogModule,
    UserFormComponent
  ],
  providers: [MessageService, ConfirmationService],
  template: `
    <p-toast></p-toast>
    <p-confirmDialog></p-confirmDialog>
    
    <div class="card">
      <div class="flex justify-content-between align-items-center mb-4">
        <h2 class="text-2xl font-semibold text-primary m-0">
          <i class="pi pi-users mr-2"></i>User Management
        </h2>
        <button pButton label="Add User" 
                icon="pi pi-plus"
                (click)="showUserDialog()"></button>
      </div>

      <p-table [value]="users"
               [loading]="loading"
               styleClass="p-datatable-gridlines">
        <ng-template pTemplate="header">
          <tr>
            <th>Username</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Last Login</th>
            <th>Actions</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-user>
          <tr>
            <td>{{user.username}}</td>
            <td>{{user.firstName}} {{user.lastName}}</td>
            <td>{{user.email}}</td>
            <td>{{user.roleName}}</td>
            <td>
              <p-tag [severity]="user.active ? 'success' : 'danger'"
                     [value]="user.active ? 'Active' : 'Inactive'">
              </p-tag>
            </td>
            <td>{{user.lastLogin | date:'medium'}}</td>
            <td>
              <button pButton icon="pi pi-pencil"
                      class="p-button-rounded p-button-text"
                      (click)="editUser(user)"
                      pTooltip="Edit User"></button>
              <button pButton icon="pi pi-trash"
                      class="p-button-rounded p-button-text p-button-danger"
                      (click)="confirmDelete(user)"
                      [disabled]="user.username === 'admin'"
                      pTooltip="Delete User"></button>
            </td>
          </tr>
        </ng-template>
      </p-table>
    </div>

    <app-user-form
      [(visible)]="displayUserDialog"
      [roles]="roles"
      [editMode]="editMode"
      [user]="selectedUser"
      (save)="saveUser($event)"
      (cancel)="hideUserDialog()">
    </app-user-form>
  `
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  roles: Role[] = [];
  loading = true;
  displayUserDialog = false;
  editMode = false;
  selectedUser?: User;

  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadUsers();
    this.loadRoles();
  }

  loadUsers() {
    this.loading = true;
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load users'
        });
        this.loading = false;
      }
    });
  }

  loadRoles() {
    this.roleService.getRoles().subscribe({
      next: (roles) => {
        this.roles = roles;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load roles'
        });
      }
    });
  }

  showUserDialog() {
    this.editMode = false;
    this.selectedUser = undefined;
    this.displayUserDialog = true;
  }

  hideUserDialog() {
    this.displayUserDialog = false;
    this.selectedUser = undefined;
  }

  editUser(user: User) {
    this.editMode = true;
    this.selectedUser = user;
    this.displayUserDialog = true;
  }

  saveUser(userData: CreateUserDto | UpdateUserDto) {
    if (this.editMode && this.selectedUser) {
      this.userService.updateUser(this.selectedUser.id, userData as UpdateUserDto).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'User updated successfully'
          });
          this.loadUsers();
          this.hideUserDialog();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update user'
          });
        }
      });
    } else {
      this.userService.createUser(userData as CreateUserDto).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'User created successfully'
          });
          this.loadUsers();
          this.hideUserDialog();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to create user'
          });
        }
      });
    }
  }

  confirmDelete(user: User) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${user.firstName} ${user.lastName}?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteUser(user);
      }
    });
  }

  deleteUser(user: User) {
    this.userService.deleteUser(user.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'User deleted successfully'
        });
        this.loadUsers();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete user'
        });
      }
    });
  }
}
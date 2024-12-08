import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { User, CreateUserDto, UpdateUserDto } from '../../../models/user.model';
import { Role } from '../../../models/role.model';

type FormData = {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  roleId: number;
  password?: string;
};

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    PasswordModule,
    DropdownModule,
    ButtonModule,
    DialogModule
  ],
  template: `
    <p-dialog 
      [header]="editMode ? 'Edit User' : 'Add User'"
      [(visible)]="visible"
      [style]="{width: '450px'}"
      [modal]="true"
      styleClass="p-fluid">
      
      <div class="flex flex-column gap-3 pt-3">
        <div class="field">
          <label for="username" class="font-medium">Username</label>
          <input pInputText id="username"
                 [(ngModel)]="formData.username"
                 [disabled]="editMode"
                 class="w-full">
        </div>

        <div class="field">
          <label for="firstName" class="font-medium">First Name</label>
          <input pInputText id="firstName"
                 [(ngModel)]="formData.firstName"
                 class="w-full">
        </div>

        <div class="field">
          <label for="lastName" class="font-medium">Last Name</label>
          <input pInputText id="lastName"
                 [(ngModel)]="formData.lastName"
                 class="w-full">
        </div>

        <div class="field">
          <label for="email" class="font-medium">Email</label>
          <input pInputText id="email"
                 type="email"
                 [(ngModel)]="formData.email"
                 class="w-full">
        </div>

        <div class="field">
          <label for="role" class="font-medium">Role</label>
          <p-dropdown id="role"
                     [options]="roles"
                     [(ngModel)]="formData.roleId"
                     optionLabel="name"
                     optionValue="id"
                     [placeholder]="'Select a role'"
                     class="w-full">
          </p-dropdown>
        </div>

        <div class="field" *ngIf="!editMode">
          <label for="password" class="font-medium">Password</label>
          <p-password id="password"
                     [(ngModel)]="formData.password"
                     [toggleMask]="true"
                     styleClass="w-full">
          </p-password>
        </div>
      </div>

      <ng-template pTemplate="footer">
        <button pButton label="Cancel" (click)="onCancel()" class="p-button-text"></button>
        <button pButton label="Save" (click)="onSave()" [disabled]="!isValid()"></button>
      </ng-template>
    </p-dialog>
  `
})
export class UserFormComponent {
  @Input() visible: boolean = false;
  @Input() roles: Role[] = [];
  @Input() editMode: boolean = false;
  @Input() user?: User;
  
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<CreateUserDto | UpdateUserDto>();
  @Output() cancel = new EventEmitter<void>();

  formData: FormData = this.getEmptyForm();

  private getEmptyForm(): FormData {
    return {
      username: '',
      firstName: '',
      lastName: '',
      email: '',
      roleId: 0,
      password: ''
    };
  }

  ngOnChanges() {
    if (this.user && this.editMode) {
      this.formData = {
        username: this.user.username,
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        email: this.user.email,
        roleId: this.user.roleId
      };
    } else {
      this.resetForm();
    }
  }

  resetForm() {
    this.formData = this.getEmptyForm();
  }

  isValid(): boolean {
    if (this.editMode) {
      return !!(
        this.formData.firstName &&
        this.formData.lastName &&
        this.formData.email &&
        this.formData.roleId
      );
    }

    return !!(
      this.formData.username &&
      this.formData.firstName &&
      this.formData.lastName &&
      this.formData.email &&
      this.formData.roleId &&
      this.formData.password
    );
  }

  onSave() {
    if (this.isValid()) {
      if (this.editMode) {
        const updateData: UpdateUserDto = {
          firstName: this.formData.firstName,
          lastName: this.formData.lastName,
          email: this.formData.email,
          roleId: this.formData.roleId
        };
        this.save.emit(updateData);
      } else {
        const createData: CreateUserDto = {
          username: this.formData.username,
          firstName: this.formData.firstName,
          lastName: this.formData.lastName,
          email: this.formData.email,
          roleId: this.formData.roleId,
          password: this.formData.password!
        };
        this.save.emit(createData);
      }
      this.resetForm();
    }
  }

  onCancel() {
    this.cancel.emit();
    this.resetForm();
  }
}
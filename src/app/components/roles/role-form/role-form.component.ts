import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { Role, Permission, CreateRoleDto, UpdateRoleDto } from '../../../models/role.model';

@Component({
  selector: 'app-role-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    InputTextareaModule,
    MultiSelectModule,
    ButtonModule,
    DialogModule
  ],
  template: `
    <p-dialog 
      [header]="editMode ? 'Edit Role' : 'Add Role'"
      [(visible)]="visible"
      [style]="{width: '500px'}"
      [modal]="true"
      styleClass="p-fluid">
      
      <div class="flex flex-column gap-3 pt-3">
        <div class="field">
          <label for="name" class="font-medium">Role Name</label>
          <input pInputText id="name"
                 [(ngModel)]="formData.name"
                 [disabled]="editMode && role?.name === 'Admin'"
                 class="w-full">
        </div>

        <div class="field">
          <label for="description" class="font-medium">Description</label>
          <textarea pInputTextarea id="description"
                    [(ngModel)]="formData.description"
                    [rows]="3"
                    class="w-full">
          </textarea>
        </div>

        <div class="field">
          <label for="permissions" class="font-medium">Permissions</label>
          <p-multiSelect id="permissions"
                        [options]="permissions"
                        [(ngModel)]="selectedPermissions"
                        [disabled]="editMode && role?.name === 'Admin'"
                        optionLabel="name"
                        optionValue="id"
                        [placeholder]="'Select permissions'"
                        class="w-full">
            <ng-template let-permission pTemplate="item">
              <div class="flex flex-column">
                <span>{{permission.name}}</span>
                <small class="text-gray-500">{{permission.description}}</small>
              </div>
            </ng-template>
          </p-multiSelect>
        </div>
      </div>

      <ng-template pTemplate="footer">
        <button pButton label="Cancel" (click)="onCancel()" class="p-button-text"></button>
        <button pButton label="Save" (click)="onSave()" [disabled]="!isValid()"></button>
      </ng-template>
    </p-dialog>
  `
})
export class RoleFormComponent {
  @Input() visible: boolean = false;
  @Input() permissions: Permission[] = [];
  @Input() editMode: boolean = false;
  @Input() role?: Role;
  
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<CreateRoleDto | UpdateRoleDto>();
  @Output() cancel = new EventEmitter<void>();

  formData: CreateRoleDto = {
    name: '',
    description: '',
    permissions: []
  };

  selectedPermissions: number[] = [];

  ngOnChanges() {
    if (this.role && this.editMode) {
      this.formData = {
        name: this.role.name,
        description: this.role.description,
        permissions: this.role.permissions.map(p => p.id)
      };
      this.selectedPermissions = this.role.permissions.map(p => p.id);
    } else {
      this.resetForm();
    }
  }

  resetForm() {
    this.formData = {
      name: '',
      description: '',
      permissions: []
    };
    this.selectedPermissions = [];
  }

  isValid(): boolean {
    return !!(
      this.formData.name &&
      this.formData.description &&
      this.selectedPermissions.length > 0
    );
  }

  onSave() {
    if (this.isValid()) {
      const data = {
        ...this.formData,
        permissions: this.selectedPermissions
      };
      this.save.emit(data);
      this.resetForm();
    }
  }

  onCancel() {
    this.cancel.emit();
    this.resetForm();
  }
}
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule],
  template: `
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
      <div class="flex flex-column align-items-center justify-content-center">
        <div class="flex flex-column align-items-center gap-4">
          <div class="text-900 font-bold text-4xl">403 - Unauthorized</div>
          <div class="text-600 text-xl">You don't have permission to access this resource</div>
          <button pButton label="Go to Dashboard" routerLink="/dashboard" class="p-button-primary"></button>
        </div>
      </div>
    </div>
  `
})
export class UnauthorizedComponent {}
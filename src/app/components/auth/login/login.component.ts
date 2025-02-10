import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { AuthService } from '../../../services/auth/auth.service';
import { LayoutService } from '../../../services/layout.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    PasswordModule,
    ToastModule,
    CardModule
  ],
  providers: [MessageService],
  template: `
    <p-toast></p-toast>
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
      <p-card styleClass="shadow-2 w-30rem">
        <div class="text-center mb-5">
          <div class="text-900 text-3xl font-medium mb-3">Welcome Back</div>
          <span class="text-600 font-medium">Sign in to continue</span><br>
          <span class="text-blue-500 font-small">login with admin/admin</span>
        </div>

        <div class="flex flex-column gap-3">
          <div class="flex flex-column gap-2">
            <label for="username" class="text-900 font-medium">Username</label>
            <input 
              id="username" 
              type="text" 
              pInputText 
              [(ngModel)]="username" 
              class="w-full"
              placeholder="Enter your username">
          </div>

          <div class="flex flex-column gap-2">
            <label for="password" class="text-900 font-medium">Password</label>
            <p-password 
              id="password" 
              [(ngModel)]="password" 
              [feedback]="false"
              [toggleMask]="true"
              placeholder="Enter your password"
              styleClass="w-full">
            </p-password>
          </div>

          <button 
            pButton 
            label="Sign In" 
            class="w-full p-3 text-xl" 
            (click)="onLogin()">
          </button>
        </div>
      </p-card>
    </div>
  `,
  styles: [`
  ::ng-deep .p-password input {
  width: 100% !important;
}
  `]
})
export class LoginComponent implements OnInit {
  username: string = 'admin';
  password: string = 'admin';

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService,
    private layoutService: LayoutService
  ) {}

  ngOnInit() {
    // Ensure header is hidden on login page
    this.layoutService.setHeaderVisibility(false);
  }

  onLogin() {
    if (!this.username || !this.password) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please enter both username and password'
      });
      return;
    }

    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Invalid username or password'
        });
      }
    });
  }
}

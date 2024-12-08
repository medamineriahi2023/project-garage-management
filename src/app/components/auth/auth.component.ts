import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <ng-container *ngIf="currentUser$ | async as user; else loginTemplate">
      <router-outlet></router-outlet>
    </ng-container>
    <ng-template #loginTemplate>
      <app-login></app-login>
    </ng-template>
  `
})
export class AuthComponent implements OnInit {
  currentUser$ = this.authService.currentUser$;

  constructor(private authService: AuthService) {}

  ngOnInit() {}
}
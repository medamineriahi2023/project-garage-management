import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { RouterModule, Routes, provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Subscription } from 'rxjs';
import { DashboardComponent } from './app/components/dashboard/dashboard.component';
import { ServicesComponent } from './app/components/services/services.component';
import { StockComponent } from './app/components/stock/stock.component';
import { MaintenanceComponent } from './app/components/maintenance/maintenance.component';
import { StockMovementComponent } from './app/components/stock/stock-movement.component';
import { UserListComponent } from './app/components/users/user-list.component';
import { RoleListComponent } from './app/components/roles/role-list.component';
import { LoginComponent } from './app/components/auth/login/login.component';
import { UnauthorizedComponent } from './app/components/auth/unauthorized/unauthorized.component';
import { HeaderComponent } from './app/components/navigation/header.component';
import { LanguageService } from './app/services/language.service';
import { LayoutService } from './app/services/layout.service';
import { PermissionGuard } from './app/services/auth/permission.guard';
import { AuthGuard } from './app/services/auth/auth.guard';
import { AuthInterceptor } from './app/services/auth/auth.interceptor';
import { ErrorHandlingService } from './app/services/error-handling.service';
import { AuthService } from './app/services/auth/auth.service';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'unauthorized', component: UnauthorizedComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: { permission: 'VIEW_DASHBOARD' }
  },
  { 
    path: 'services', 
    component: ServicesComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: { permission: 'MANAGE_SERVICES' }
  },
  { 
    path: 'stock', 
    component: StockComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: { permission: 'MANAGE_STOCK' }
  },
  { 
    path: 'maintenance', 
    component: MaintenanceComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: { permission: 'MANAGE_MAINTENANCE' }
  },
  { 
    path: 'stock-movement', 
    component: StockMovementComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: { permission: 'MANAGE_STOCK' }
  },
  { 
    path: 'users', 
    component: UserListComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: { permission: 'MANAGE_USERS' }
  },
  { 
    path: 'roles', 
    component: RoleListComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: { permission: 'MANAGE_ROLES' }
  }
];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    ToastModule,
    HeaderComponent
  ],
  template: `
    <p-toast></p-toast>
    <div class="layout-wrapper" [dir]="currentLang === 'ar' ? 'rtl' : 'ltr'">
      <app-header *ngIf="showHeader"></app-header>
      <div class="layout-content" [class.no-header]="!showHeader">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    .layout-content.no-header {
      padding-top: 0;
    }
  `]
})
export class App implements OnDestroy {
  currentLang: 'fr' | 'ar' = 'fr';
  showHeader = true;
  private layoutSubscription: Subscription;

  constructor(
    private languageService: LanguageService,
    private layoutService: LayoutService
  ) {
    this.languageService.currentLang$.subscribe(lang => {
      this.currentLang = lang;
    });

    this.layoutSubscription = this.layoutService.showHeader$.subscribe(
      show => this.showHeader = show
    );
  }

  ngOnDestroy() {
    this.layoutSubscription?.unsubscribe();
  }
}

bootstrapApplication(App, {
  providers: [
    provideAnimations(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([AuthInterceptor])),
    MessageService,
    LanguageService,
    LayoutService,
    ErrorHandlingService,
    AuthService
  ]
});
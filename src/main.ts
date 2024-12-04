import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { RouterModule, Routes, provideRouter } from '@angular/router';
import { DashboardComponent } from './app/components/dashboard/dashboard.component';
import { ServicesComponent } from './app/components/services/services.component';
import { StockComponent } from './app/components/stock/stock.component';
import { MaintenanceComponent } from './app/components/maintenance/maintenance.component';
import { StockMovementComponent } from './app/components/stock/stock-movement.component';
import { NotificationBellComponent } from './app/components/notifications/notification-bell.component';
import { FR } from './app/i18n/fr';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'stock', component: StockComponent },
  { path: 'maintenance', component: MaintenanceComponent },
  { path: 'stock-movement', component: StockMovementComponent }
];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, NotificationBellComponent],
  template: `
    <div class="layout-wrapper">
      <div class="layout-topbar">
        <div class="flex align-items-center gap-2">
          <i class="pi pi-car text-2xl"></i>
          <span class="text-2xl font-semibold">{{i18n.navigation.title}}</span>
        </div>
        <div class="flex gap-3 align-items-center">
          <a routerLink="/dashboard" routerLinkActive="active-link" class="topbar-link">
            <i class="pi pi-chart-line mr-2"></i>{{i18n.navigation.dashboard}}
          </a>
          <a routerLink="/services" routerLinkActive="active-link" class="topbar-link">
            <i class="pi pi-cog mr-2"></i>{{i18n.navigation.services}}
          </a>
          <a routerLink="/stock" routerLinkActive="active-link" class="topbar-link">
            <i class="pi pi-box mr-2"></i>{{i18n.navigation.stock}}
          </a>
          <a routerLink="/maintenance" routerLinkActive="active-link" class="topbar-link">
            <i class="pi pi-wrench mr-2"></i>{{i18n.navigation.maintenance}}
          </a>
          <a routerLink="/stock-movement" routerLinkActive="active-link" class="topbar-link">
            <i class="pi pi-history mr-2"></i>{{i18n.navigation.stockMovement}}
          </a>
          <app-notification-bell></app-notification-bell>
        </div>
      </div>
      <div class="layout-content">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    .topbar-link {
      color: white;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      transition: background-color 0.2s;
      display: flex;
      align-items: center;
    }
    .topbar-link:hover {
      background-color: rgba(255,255,255,0.1);
    }
    .active-link {
      background-color: rgba(255,255,255,0.2);
    }
  `]
})
export class App {
  i18n = FR;
}

bootstrapApplication(App, {
  providers: [
    provideAnimations(),
    provideRouter(routes)
  ]
});
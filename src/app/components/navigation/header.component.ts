import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { Subscription, combineLatest } from 'rxjs';
import { NavItemComponent } from './nav-item.component';
import { NotificationBellComponent } from '../notifications/notification-bell.component';
import { LanguageSelectorComponent } from '../language-selector/language-selector.component';
import { AuthService } from '../../services/auth/auth.service';
import { NavigationService } from '../../services/navigation/navigation.service';
import { LanguageService } from '../../services/language.service';
import { User } from '../../models/user.model';
import { NavigationItem } from '../../models/navigation.model';
import { Translations } from '../../models/translations.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    TooltipModule,
    NavItemComponent,
    NotificationBellComponent,
    LanguageSelectorComponent
  ],
  template: `
    <div class="layout-topbar" *ngIf="currentUser">
      <div class="flex align-items-center gap-2">
        <i class="pi pi-car text-2xl"></i>
        <span class="text-2xl font-semibold">{{i18n.navigation.title}}</span>
      </div>
      <div class="flex gap-3 align-items-center">
        <app-nav-item *ngFor="let item of navigationItems"
                     [item]="item"
                     [label]="getNavigationLabel(item.label)">
        </app-nav-item>
        <app-notification-bell></app-notification-bell>
        <app-language-selector></app-language-selector>
        <button pButton 
                icon="pi pi-sign-out" 
                class="p-button-text p-button-rounded p-button-plain" 
                (click)="onLogout()"
                pTooltip="Logout">
        </button>
      </div>
    </div>
  `
})
export class HeaderComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  navigationItems: NavigationItem[] = [];
  i18n!: Translations;
  
  private subscriptions: Subscription[] = [];

  constructor(
    private authService: AuthService,
    private navigationService: NavigationService,
    private languageService: LanguageService
  ) {
    this.i18n = this.languageService.getTranslations();
  }

  ngOnInit() {
    const subscription = combineLatest([
      this.authService.currentUser$,
      this.navigationService.getVisibleNavigationItems(),
      this.languageService.currentLang$
    ]).subscribe({
      next: ([user, navItems]) => {
        this.currentUser = user;
        this.navigationItems = navItems;
        this.i18n = this.languageService.getTranslations();
      },
      error: (error) => {
        console.error('Error in header component:', error);
        this.currentUser = null;
        this.navigationItems = [];
      }
    });

    this.subscriptions.push(subscription);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  getNavigationLabel(key: string): string {
    return this.i18n.navigation[key] || key;
  }

  onLogout() {
    this.authService.logout();
  }
}
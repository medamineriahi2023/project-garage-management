import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { TooltipModule } from 'primeng/tooltip';
import { NotificationService, StockNotification } from '../../services/notification.service';

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [
    CommonModule,
    OverlayPanelModule,
    ButtonModule,
    BadgeModule,
    TooltipModule
  ],
  template: `
    <div class="notification-bell">
      <button pButton 
              class="p-button-text p-button-rounded p-button-plain notification-button" 
              icon="pi pi-bell"
              (click)="op.toggle($event)"
              [style]="getBellStyle()"
              *ngIf="unreadCount > 0">
        <span class="notification-badge">{{unreadCount}}</span>
      </button>
      <button pButton 
              class="p-button-text p-button-rounded p-button-plain" 
              icon="pi pi-bell"
              (click)="op.toggle($event)"
              [style]="{ color: 'white' }"
              *ngIf="unreadCount === 0">
      </button>
    </div>

    <p-overlayPanel #op>
      <div class="notifications-panel">
        <div class="notifications-header">
          <h3 class="text-lg font-semibold m-0">Notifications</h3>
          <div class="flex gap-2">
            <button pButton 
                    class="p-button-text p-button-sm"
                    icon="pi pi-check"
                    (click)="markAllAsRead()"
                    [disabled]="!hasUnread"
                    pTooltip="Marquer tout comme lu">
            </button>
            <button pButton 
                    class="p-button-text p-button-sm"
                    icon="pi pi-trash"
                    (click)="clearAllNotifications()"
                    [disabled]="!hasNotifications"
                    pTooltip="Effacer tout">
            </button>
          </div>
        </div>
        
        <div class="notifications-list" *ngIf="hasNotifications">
          <div *ngFor="let notification of notifications" 
               class="notification-item"
               [class.unread]="!notification.read">
            <div class="notification-content">
              <i class="pi pi-exclamation-triangle text-yellow-600 mr-2"></i>
              <div class="flex-grow-1">
                <p class="m-0 font-semibold">{{notification.message}}</p>
                <small class="text-gray-500">{{notification.date | date:'dd/MM/yyyy HH:mm'}}</small>
              </div>
              <button pButton 
                      class="p-button-text p-button-rounded p-button-sm"
                      icon="pi pi-times"
                      (click)="clearNotification(notification.id)">
              </button>
            </div>
          </div>
        </div>
        
        <div class="notifications-empty" *ngIf="!hasNotifications">
          <p class="text-gray-500 text-center m-0">Aucune notification</p>
        </div>
      </div>
    </p-overlayPanel>
  `,
  styles: [`
    .notifications-panel {
      min-width: 300px;
      max-width: 400px;
    }
    
    .notifications-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem;
      border-bottom: 1px solid var(--surface-border);
    }
    
    .notifications-list {
      max-height: 300px;
      overflow-y: auto;
    }
    
    .notification-item {
      padding: 0.75rem;
      border-bottom: 1px solid var(--surface-border);
    }
    
    .notification-item:last-child {
      border-bottom: none;
    }
    
    .notification-item.unread {
      background-color: var(--primary-50);
    }
    
    .notification-content {
      display: flex;
      align-items: flex-start;
      gap: 0.5rem;
    }
    
    .notifications-empty {
      padding: 1rem;
    }

    .notification-button {
      position: relative;
    }

    .notification-badge {
      position: absolute;
      top: -8px;
      right: -8px;
      background-color: var(--red-500);
      color: white;
      border-radius: 50%;
      padding: 2px 6px;
      font-size: 12px;
      min-width: 20px;
      text-align: center;
    }
  `]
})
export class NotificationBellComponent implements OnInit {
  notifications: StockNotification[] = [];
  unreadCount = 0;

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.notificationService.getNotifications().subscribe(notifications => {
      this.notifications = notifications;
      this.unreadCount = notifications.filter(n => !n.read).length;
    });
  }

  getBellStyle() {
    return {
      color: this.hasLowStockItems() ? 'var(--red-500)' : 'white'
    };
  }

  hasLowStockItems(): boolean {
    return this.notifications.some(notification => 
      notification.stockItem.currentQuantity <= notification.stockItem.minQuantity
    );
  }

  get hasNotifications(): boolean {
    return this.notifications.length > 0;
  }

  get hasUnread(): boolean {
    return this.unreadCount > 0;
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead();
  }

  clearNotification(id: number): void {
    this.notificationService.clearNotification(id);
  }

  clearAllNotifications(): void {
    this.notificationService.clearAllNotifications();
  }
}
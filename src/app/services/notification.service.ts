import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StockItem } from '../models/stock-item.model';

export interface StockNotification {
  id: number;
  stockItem: StockItem;
  message: string;
  date: Date;
  read: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications = new BehaviorSubject<StockNotification[]>([]);
  private lastNotificationId = 0;

  getNotifications(): Observable<StockNotification[]> {
    return this.notifications.asObservable();
  }

  addNotification(stockItem: StockItem): void {
    const notification: StockNotification = {
      id: ++this.lastNotificationId,
      stockItem,
      message: `Le stock de ${stockItem.name} est bas (${stockItem.currentQuantity}/${stockItem.minQuantity})`,
      date: new Date(),
      read: false
    };

    const currentNotifications = this.notifications.getValue();
    // Check if notification for this item already exists
    const existingIndex = currentNotifications.findIndex(n => n.stockItem.id === stockItem.id);
    
    if (existingIndex === -1) {
      this.notifications.next([notification, ...currentNotifications]);
    } else {
      // Update existing notification
      currentNotifications[existingIndex] = notification;
      this.notifications.next([...currentNotifications]);
    }
  }

  markAsRead(notificationId: number): void {
    const currentNotifications = this.notifications.getValue();
    const updatedNotifications = currentNotifications.map(notification => 
      notification.id === notificationId 
        ? { ...notification, read: true }
        : notification
    );
    this.notifications.next(updatedNotifications);
  }

  markAllAsRead(): void {
    const currentNotifications = this.notifications.getValue();
    const updatedNotifications = currentNotifications.map(notification => 
      ({ ...notification, read: true })
    );
    this.notifications.next(updatedNotifications);
  }

  clearNotification(notificationId: number): void {
    const currentNotifications = this.notifications.getValue();
    this.notifications.next(
      currentNotifications.filter(notification => notification.id !== notificationId)
    );
  }

  clearAllNotifications(): void {
    this.notifications.next([]);
  }
}
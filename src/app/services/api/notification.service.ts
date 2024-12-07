import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { Notification } from '../../models/notification.model';
import { PageRequest, PageResponse } from '../../models/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationApiService extends BaseApiService {
  private endpoint = '/notifications';

  getNotifications(pageRequest: PageRequest): Observable<PageResponse<Notification>> {
    return this.getWithPagination<Notification>(this.endpoint, pageRequest);
  }

  markAsRead(id: number): Observable<void> {
    return this.put<void>(`${this.endpoint}/${id}/read`, {});
  }

  markAllAsRead(): Observable<void> {
    return this.put<void>(`${this.endpoint}/mark-all-read`, {});
  }

  deleteNotification(id: number): Observable<void> {
    return this.delete(`${this.endpoint}/${id}`);
  }

  deleteAllNotifications(): Observable<void> {
    return this.delete(`${this.endpoint}`);
  }
}
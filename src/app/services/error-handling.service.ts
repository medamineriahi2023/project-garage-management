import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlingService {
  constructor(private messageService: MessageService) {}

  handleError(error: any, customMessage?: string): void {
    console.error('Application Error:', error);
    
    const message = customMessage || this.getErrorMessage(error);
    
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message,
      life: 5000
    });
  }

  private getErrorMessage(error: any): string {
    if (error.status === 401) {
      return 'Session expired. Please log in again.';
    }
    if (error.status === 403) {
      return 'You do not have permission to perform this action.';
    }
    if (error.status === 404) {
      return 'The requested resource was not found.';
    }
    if (error.status >= 500) {
      return 'A server error occurred. Please try again later.';
    }
    
    return error.message || 'An unexpected error occurred.';
  }
}
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [class]="'badge ' + getStatusClass()">
      {{label}}
    </span>
  `,
  styles: [`
    .badge {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.875rem;
      font-weight: 500;
    }
    
    .badge-success {
      background-color: var(--green-500);
      color: white;
    }
    
    .badge-warning {
      background-color: var(--yellow-500);
      color: white;
    }
    
    .badge-danger {
      background-color: var(--red-500);
      color: white;
    }
  `]
})
export class StatusBadgeComponent {
  @Input() status: 'success' | 'warning' | 'danger' = 'success';
  @Input() label: string = '';

  getStatusClass(): string {
    return `badge-${this.status}`;
  }
}
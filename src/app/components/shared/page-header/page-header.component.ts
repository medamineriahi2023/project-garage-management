import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  template: `
    <div class="flex justify-content-between align-items-center mb-4">
      <h2 class="text-2xl font-semibold text-primary m-0">
        <i [class]="'pi ' + icon + ' mr-2'" *ngIf="icon"></i>{{title}}
      </h2>
      <button pButton 
              [label]="buttonLabel"
              icon="pi pi-plus"
              (click)="onButtonClick.emit()"
              *ngIf="buttonLabel">
      </button>
    </div>
  `
})
export class PageHeaderComponent {
  @Input() title: string = '';
  @Input() icon: string = '';
  @Input() buttonLabel?: string;
  @Input() onButtonClick = new EventEmitter<void>();
}
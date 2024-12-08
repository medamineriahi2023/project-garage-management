import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-nav-link',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <a [routerLink]="route" 
       routerLinkActive="active-link" 
       class="topbar-link">
      <i [class]="'pi ' + icon + ' mr-2'"></i>
      {{label}}
    </a>
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
export class NavLinkComponent {
  @Input() route!: string;
  @Input() icon!: string;
  @Input() label!: string;
}
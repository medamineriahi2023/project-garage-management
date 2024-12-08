import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { NavigationItem } from '../../models/navigation.model';

@Component({
  selector: 'app-nav-item',
  standalone: true,
  imports: [CommonModule, RouterModule, TooltipModule],
  template: `
    <a [routerLink]="item.route" 
       routerLinkActive="active-link" 
       class="topbar-link"
       [pTooltip]="tooltipText">
      <i [class]="'pi ' + item.icon + ' mr-2'"></i>
      <span>{{label}}</span>
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
export class NavItemComponent {
  @Input() item!: NavigationItem;
  @Input() label!: string;
  @Input() tooltipText: string = '';
}
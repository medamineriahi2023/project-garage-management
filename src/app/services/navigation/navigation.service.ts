import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';
import { NavigationItem } from '../../models/navigation.model';
import { AuthService } from '../auth/auth.service';
import { RoleService } from '../role.service';
import { Permission } from '../../models/role.model';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private navigationItems: NavigationItem[] = [
    { route: '/dashboard', icon: 'pi-chart-line', label: 'dashboard', permission: 'VIEW_DASHBOARD', order: 1 },
    { route: '/services', icon: 'pi-cog', label: 'services', permission: 'MANAGE_SERVICES', order: 2 },
    { route: '/stock', icon: 'pi-box', label: 'stock', permission: 'MANAGE_STOCK', order: 3 },
    { route: '/maintenance', icon: 'pi-wrench', label: 'maintenance', permission: 'MANAGE_MAINTENANCE', order: 4 },
    { route: '/stock-movement', icon: 'pi-history', label: 'stockMovement', permission: 'MANAGE_STOCK', order: 5 },
    { route: '/users', icon: 'pi-users', label: 'users', permission: 'MANAGE_USERS', order: 6 },
    { route: '/roles', icon: 'pi-shield', label: 'roles', permission: 'MANAGE_ROLES', order: 7 }
  ];

  private userPermissions = new BehaviorSubject<Set<string>>(new Set());
  private visibleNavItems = new BehaviorSubject<NavigationItem[]>([]);

  constructor(
    private authService: AuthService,
    private roleService: RoleService
  ) {
    this.initializeNavigation();
  }

  private initializeNavigation(): void {
    // Subscribe to user changes
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.roleService.getRoleById(user.roleId).subscribe({
          next: (role) => {
            const permissions = new Set(role.permissions.map(p => p.name));
            this.userPermissions.next(permissions);
            this.updateVisibleNavItems();
          },
          error: (error) => {
            console.error('Failed to load user permissions:', error);
            this.userPermissions.next(new Set());
            this.updateVisibleNavItems();
          }
        });
      } else {
        this.userPermissions.next(new Set());
        this.updateVisibleNavItems();
      }
    });
  }

  private updateVisibleNavItems(): void {
    const permissions = this.userPermissions.getValue();
    const visibleItems = this.navigationItems
      .filter(item => permissions.has(item.permission))
      .sort((a, b) => a.order - b.order);
    
    this.visibleNavItems.next(visibleItems);
  }

  getVisibleNavigationItems(): Observable<NavigationItem[]> {
    return this.visibleNavItems.asObservable();
  }

  hasPermission(permission: string): boolean {
    return this.userPermissions.getValue().has(permission);
  }
}
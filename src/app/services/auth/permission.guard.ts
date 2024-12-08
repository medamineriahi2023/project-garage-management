import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { NavigationService } from '../navigation/navigation.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionGuard implements CanActivate {
  constructor(
    private navigationService: NavigationService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const requiredPermission = route.data['permission'];
    
    if (!requiredPermission) {
      return true;
    }

    const hasPermission = this.navigationService.hasPermission(requiredPermission);
    
    if (!hasPermission) {
      this.router.navigate(['/unauthorized']);
      return false;
    }
    
    return true;
  }
}
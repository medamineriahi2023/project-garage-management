import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  private showHeaderSubject = new BehaviorSubject<boolean>(true);
  showHeader$ = this.showHeaderSubject.asObservable();

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Hide header on login and unauthorized pages
        const hideHeaderOn = ['/login', '/unauthorized'];
        this.showHeaderSubject.next(!hideHeaderOn.includes(event.url));
      }
    });
  }

  setHeaderVisibility(show: boolean) {
    this.showHeaderSubject.next(show);
  }
}
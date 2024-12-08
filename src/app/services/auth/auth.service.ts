import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, map, catchError } from 'rxjs';
import { User } from '../../models/user.model';
import { UserService } from '../user.service';
import { ErrorHandlingService } from '../error-handling.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private userService: UserService,
    private errorHandling: ErrorHandlingService,
    private router: Router
  ) {
    this.loadInitialUser();
  }

  private loadInitialUser() {
    this.userService.getUserById(1).subscribe({
      next: (user) => this.currentUserSubject.next(user),
      error: (error) => {
        this.currentUserSubject.next(null);
        this.errorHandling.handleError(error, 'Failed to load user session');
      }
    });
  }

  login(username: string, password: string): Observable<User> {
    return this.userService.login(username, password).pipe(
      map(response => {
        const user = { ...response.user, token: response.token };
        this.currentUserSubject.next(user);
        return user;
      }),
      catchError(error => {
        this.errorHandling.handleError(error, 'Login failed');
        throw error;
      })
    );
  }

  logout() {
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
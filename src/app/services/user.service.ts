import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { User, CreateUserDto, UpdateUserDto, LoginResponse } from '../models/user.model';
import { MOCK_USERS } from './mock/users.mock';
import { MOCK_ROLES } from './mock/roles.mock';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: User[] = [...MOCK_USERS];
  private lastId = this.users.length;

  getUsers(): Observable<User[]> {
    return of([...this.users]).pipe(delay(500));
  }

  getUserById(id: number): Observable<User> {
    const user = this.users.find(u => u.id === id);
    return user ? of(user).pipe(delay(500)) : throwError(() => new Error('User not found'));
  }

  login(username: string, password: string): Observable<LoginResponse> {
    // In a real app, this would validate against a backend
    const user = this.users.find(u => u.username === username);
    
    if (user) {
      // Simulate token generation
      const token = 'mock-jwt-token-' + Math.random().toString(36).substr(2);
      return of({
        user: { ...user, token },
        token
      }).pipe(delay(500));
    }
    
    return throwError(() => new Error('Invalid credentials'));
  }

  createUser(dto: CreateUserDto): Observable<User> {
    const role = MOCK_ROLES.find(r => r.id === dto.roleId);
    if (!role) {
      return throwError(() => new Error('Invalid role'));
    }

    const existingUser = this.users.find(u => 
      u.username === dto.username || u.email === dto.email
    );
    if (existingUser) {
      return throwError(() => new Error('Username or email already exists'));
    }

    const newUser: User = {
      id: ++this.lastId,
      ...dto,
      roleName: role.name,
      active: true,
      createdAt: new Date(),
      lastLogin: undefined
    };

    this.users.push(newUser);
    return of(newUser).pipe(delay(500));
  }

  updateUser(id: number, dto: UpdateUserDto): Observable<User> {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) {
      return throwError(() => new Error('User not found'));
    }

    let updateData = { ...dto };

    if (dto.roleId) {
      const role = MOCK_ROLES.find(r => r.id === dto.roleId);
      if (!role) {
        return throwError(() => new Error('Invalid role'));
      }
      updateData.roleName = role.name;
    }

    const updatedUser = { ...this.users[index], ...updateData };
    this.users[index] = updatedUser;
    return of(updatedUser).pipe(delay(500));
  }

  deleteUser(id: number): Observable<void> {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) {
      return throwError(() => new Error('User not found'));
    }

    this.users.splice(index, 1);
    return of(void 0).pipe(delay(500));
  }

  searchUsers(query: string): Observable<User[]> {
    const lowercaseQuery = query.toLowerCase();
    return of(this.users.filter(user =>
      user.username.toLowerCase().includes(lowercaseQuery) ||
      user.firstName.toLowerCase().includes(lowercaseQuery) ||
      user.lastName.toLowerCase().includes(lowercaseQuery) ||
      user.email.toLowerCase().includes(lowercaseQuery)
    )).pipe(delay(500));
  }
}
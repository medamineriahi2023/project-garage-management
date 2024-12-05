import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loading-container">
      <div class="loading-spinner">
        <div class="spinner"></div>
      </div>
      <p class="loading-text">Chargement en cours...</p>
    </div>
  `,
  styles: [`
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 400px;
    }

    .loading-spinner {
      position: relative;
      width: 60px;
      height: 60px;
    }

    .spinner {
      position: absolute;
      border: 4px solid #f3f3f3;
      border-top: 4px solid var(--primary-color);
      border-radius: 50%;
      width: 100%;
      height: 100%;
      animation: spin 1s linear infinite;
    }

    .loading-text {
      margin-top: 1rem;
      color: var(--text-color-secondary);
      font-size: 1.1rem;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `]
})
export class LoadingComponent {}
import { Injectable } from '@angular/core';
import { Observable, map, combineLatest } from 'rxjs';
import { MockDataService } from './mock-data.service';
import { Maintenance } from '../models/maintenance.model';
import { StockMovement, MovementType, MovementSource } from '../models/stock-movement.model';
import { StockItem } from '../models/stock-item.model';

export interface DashboardData {
  summary: {
    revenue: number;
    revenueChange: number;
    expenses: number;
    expensesChange: number;
    profit: number;
    profitChange: number;
    maintenanceCount: number;
    maintenanceCountChange: number;
  };
  revenueExpensesChart: any;
  profitChart: any;
  servicesChart: any;
  stockChart: any;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(private mockDataService: MockDataService) {}

  private filterDataByPeriod<T extends { date: Date }>(data: T[], period: string): T[] {
    const now = new Date();
    const startDate = new Date(now);

    switch (period) {
      case 'day':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    return data.filter(item => new Date(item.date) >= startDate);
  }

  private generateTimeLabels(period: string): string[] {
    const now = new Date();
    const labels: string[] = [];

    switch (period) {
      case 'day':
        for (let i = 0; i < 24; i++) {
          labels.push(`${i}h`);
        }
        break;
      case 'week':
        for (let i = 6; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          labels.push(date.toLocaleDateString('fr-FR', { weekday: 'short' }));
        }
        break;
      case 'month':
        for (let i = 29; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          labels.push(date.getDate().toString());
        }
        break;
      case 'year':
        for (let i = 11; i >= 0; i--) {
          const date = new Date(now);
          date.setMonth(date.getMonth() - i);
          labels.push(date.toLocaleDateString('fr-FR', { month: 'short' }));
        }
        break;
    }

    return labels;
  }

  private calculateChange(current: number, previous: number): number {
    if (previous === 0) return 100;
    return Number(((current - previous) / previous * 100).toFixed(1));
  }

  getDashboardData(period: string): Observable<DashboardData> {
    return combineLatest([
      this.mockDataService.getMaintenances(),
      this.mockDataService.getStockMovements(),
      this.mockDataService.getStockItems()
    ]).pipe(
      map(([maintenances, movements, stockItems]) => {
        const filteredMaintenances = this.filterDataByPeriod(maintenances, period);
        const filteredMovements = this.filterDataByPeriod(movements, period);
        
        const previousMaintenances = this.filterDataByPeriod(
          maintenances.filter(m => new Date(m.date) < new Date(filteredMaintenances[0]?.date || new Date())),
          period
        );
        const previousMovements = this.filterDataByPeriod(
          movements.filter(m => new Date(m.date) < new Date(filteredMovements[0]?.date || new Date())),
          period
        );

        // Calculer les revenus des maintenances
        const revenue = filteredMaintenances.reduce((sum: number, m: Maintenance) => sum + m.finalPrice, 0);
        const previousRevenue = previousMaintenances.reduce((sum: number, m: Maintenance) => sum + m.finalPrice, 0);
        
        // Calculer les dépenses (maintenances + achats de stock)
        const maintenanceExpenses = filteredMaintenances.reduce((sum: number, m: Maintenance) => 
          sum + m.equipmentUsed.reduce((total: number, item: StockItem) => total + item.unitPrice, 0), 0);
        
        const stockPurchaseExpenses = filteredMovements
          .filter(m => m.type === MovementType.IN && m.source === MovementSource.PURCHASE)
          .reduce((sum: number, m: StockMovement) => sum + m.totalPrice, 0);
        
        const expenses = maintenanceExpenses + stockPurchaseExpenses;

        const previousMaintenanceExpenses = previousMaintenances.reduce((sum: number, m: Maintenance) => 
          sum + m.equipmentUsed.reduce((total: number, item: StockItem) => total + item.unitPrice, 0), 0);
        
        const previousStockPurchaseExpenses = previousMovements
          .filter(m => m.type === MovementType.IN && m.source === MovementSource.PURCHASE)
          .reduce((sum: number, m: StockMovement) => sum + m.totalPrice, 0);
        
        const previousExpenses = previousMaintenanceExpenses + previousStockPurchaseExpenses;

        const profit = revenue - expenses;
        const previousProfit = previousRevenue - previousExpenses;

        // Calculer les statistiques des services
        const serviceStats = maintenances.reduce((acc: {[key: string]: number}, m: Maintenance) => {
          acc[m.serviceName] = (acc[m.serviceName] || 0) + 1;
          return acc;
        }, {});

        const labels = this.generateTimeLabels(period);
        const revenueData = new Array(labels.length).fill(0);
        const expensesData = new Array(labels.length).fill(0);
        const profitData = new Array(labels.length).fill(0);

        // Remplir les données des graphiques
        filteredMaintenances.forEach(maintenance => {
          const date = new Date(maintenance.date);
          let index = this.getTimeIndex(date, period);

          if (index >= 0 && index < labels.length) {
            revenueData[index] += maintenance.finalPrice;
            const maintenanceExpenses = maintenance.equipmentUsed.reduce(
              (sum: number, item: StockItem) => sum + item.unitPrice, 
              0
            );
            expensesData[index] += maintenanceExpenses;
            profitData[index] += maintenance.finalPrice - maintenanceExpenses;
          }
        });

        // Ajouter les dépenses de stock aux graphiques
        filteredMovements
          .filter(m => m.type === MovementType.IN && m.source === MovementSource.PURCHASE)
          .forEach(movement => {
            const date = new Date(movement.date);
            let index = this.getTimeIndex(date, period);

            if (index >= 0 && index < labels.length) {
              expensesData[index] += movement.totalPrice;
              profitData[index] -= movement.totalPrice;
            }
          });

        return {
          summary: {
            revenue,
            revenueChange: this.calculateChange(revenue, previousRevenue),
            expenses,
            expensesChange: this.calculateChange(expenses, previousExpenses),
            profit,
            profitChange: this.calculateChange(profit, previousProfit),
            maintenanceCount: filteredMaintenances.length,
            maintenanceCountChange: this.calculateChange(
              filteredMaintenances.length,
              previousMaintenances.length
            )
          },
          revenueExpensesChart: {
            labels,
            datasets: [
              {
                label: 'Revenus',
                data: revenueData,
                borderColor: '#3B82F6',
                tension: 0.4
              },
              {
                label: 'Dépenses',
                data: expensesData,
                borderColor: '#EC4899',
                tension: 0.4
              }
            ]
          },
          profitChart: {
            labels,
            datasets: [
              {
                label: 'Bénéfice',
                data: profitData,
                backgroundColor: '#22C55E'
              }
            ]
          },
          servicesChart: {
            labels: Object.keys(serviceStats),
            datasets: [
              {
                data: Object.values(serviceStats),
                backgroundColor: ['#3B82F6', '#EC4899', '#22C55E', '#F59E0B']
              }
            ]
          },
          stockChart: {
            labels: stockItems.map(item => item.name),
            datasets: [
              {
                data: stockItems.map(item => item.currentQuantity * item.realPrice),
                backgroundColor: ['#3B82F6', '#EC4899', '#22C55E', '#F59E0B']
              }
            ]
          }
        };
      })
    );
  }

  private getTimeIndex(date: Date, period: string): number {
    const now = new Date();
    
    switch (period) {
      case 'day':
        return date.getHours();
      case 'week':
        return 6 - Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      case 'month':
        return date.getDate() - 1;
      case 'year':
        return date.getMonth();
      default:
        return -1;
    }
  }
}
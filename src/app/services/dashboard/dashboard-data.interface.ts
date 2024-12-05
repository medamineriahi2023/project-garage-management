export interface DashboardSummary {
  revenue: number;
  revenueChange: number;
  expenses: number;
  expensesChange: number;
  profit: number;
  profitChange: number;
  maintenanceCount: number;
  maintenanceCountChange: number;
}

export interface ChartData {
  labels: string[];
  datasets: Array<{
    label?: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string[];
    tension?: number;
  }>;
}

export interface DashboardData {
  summary: DashboardSummary;
  revenueExpensesChart: ChartData;
  profitChart: ChartData;
  servicesChart: ChartData;
  stockChart: ChartData;
}
export interface StockFilters {
  status?: 'LOW_STOCK' | 'IN_STOCK' | 'ALL';
  search?: string;
}

export interface StockMovementFilters {
  startDate?: Date;
  endDate?: Date;
  type?: string;
  source?: string;
}
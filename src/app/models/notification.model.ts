export interface Notification {
  id: number;
  stockItemId: number;
  stockItemName: string;
  message: string;
  date: Date;
  read: boolean;
  currentQuantity: number;
  minQuantity: number;
}

export interface NotificationFilters {
  read?: boolean;
  startDate?: Date;
  endDate?: Date;
}
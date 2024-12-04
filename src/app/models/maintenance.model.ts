import { StockItem } from './stock-item.model';

export interface Maintenance {
  id: number;
  serviceId: number;
  serviceName: string;
  assignedToUserId: number;
  assignedToUserName: string;
  date: Date;
  carRegistrationNumber: string;
  clientName: string;
  equipmentUsed: StockItem[];
  totalPrice: number;
  discount: number;
  finalPrice: number;
  description?: string;
}
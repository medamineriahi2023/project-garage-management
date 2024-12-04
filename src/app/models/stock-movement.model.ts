export enum MovementType {
  IN = 'IN',
  OUT = 'OUT'
}

export enum MovementSource {
  PURCHASE = 'PURCHASE',
  MAINTENANCE = 'MAINTENANCE',
  RETURN = 'RETURN',
  ADJUSTMENT = 'ADJUSTMENT'
}

export interface StockMovement {
  id: number;
  stockItemId: number;
  stockItemName: string;
  quantity: number;
  type: MovementType;
  source: MovementSource;
  reference?: string;
  date: Date;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
}
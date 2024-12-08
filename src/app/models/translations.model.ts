export interface NavigationTranslations {
  title: string;
  dashboard: string;
  services: string;
  stock: string;
  maintenance: string;
  stockMovement: string;
  users: string;
  roles: string;
  [key: string]: string;
}

export interface CommonTranslations {
  id: string;
  date: string;
  actions: string;
  save: string;
  cancel: string;
  delete: string;
  search: string;
  status: string;
}

export interface MaintenanceTranslations {
  title: string;
  addMaintenance: string;
  client: string;
  carRegistration: string;
  assignedTo: string;
  service: string;
  equipmentUsed: string;
  searchPlaceholder: string;
  noRecords: string;
  generatePdf: string;
  discount: string;
  subtotal: string;
  finalPrice: string;
}

export interface ServicesTranslations {
  title: string;
  addService: string;
  serviceName: string;
  servicePrice: string;
}

export interface StockTranslations {
  title: string;
  addStock: string;
  itemName: string;
  currentQuantity: string;
  minQuantity: string;
  unitPrice: string;
  realPrice: string;
  lowStock: string;
  inStock: string;
  filterByStatus: string;
  all: string;
}

export interface StockMovementTranslations {
  title: string;
  addMovement: string;
  item: string;
  type: string;
  source: string;
  quantity: string;
  unitPrice: string;
  totalPrice: string;
  reference: string;
  notes: string;
  in: string;
  out: string;
  selectItem: string;
  selectType: string;
  selectSource: string;
  startDate: string;
  endDate: string;
  filterByType: string;
  filterBySource: string;
  sources: {
    PURCHASE: string;
    MAINTENANCE: string;
    RETURN: string;
    ADJUSTMENT: string;
  };
}

export interface DashboardTranslations {
  title: string;
  revenue: string;
  expenses: string;
  profit: string;
  maintenances: string;
  revenueExpenses: string;
  profitTrend: string;
  topServices: string;
  stockValue: string;
}

export interface Translations {
  common: CommonTranslations;
  navigation: NavigationTranslations;
  dashboard: DashboardTranslations;
  maintenance: MaintenanceTranslations;
  services: ServicesTranslations;
  stock: StockTranslations;
  stockMovement: StockMovementTranslations;
}
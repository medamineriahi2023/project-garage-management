export interface NavigationItem {
  route: string;
  icon: string;
  label: string;
  permission: string;
  order: number;
}

export interface NavigationGroup {
  items: NavigationItem[];
  visible: boolean;
}
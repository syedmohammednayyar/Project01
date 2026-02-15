
export interface KpiData {
  label: string;
  value: string;
  trend?: string;
  trendLabel?: string;
  icon: string;
  color: string;
  bgLight: string;
}

// ERP Model: Store Master
export interface Store {
  id: string;
  name: string;
  location: string;
  type: 'Warehouse' | 'Retail' | 'Repair';
}

// ERP Model: Product Master (NO STOCK HERE)
export interface Product {
  id: string;
  barcode: string; // Should be unique
  name: string;
  brand: string;
  model: string;
  storage: string;
  color: string;
  purchasePrice: number;
  sellingPrice: number;
  minStockLevel: number; // For low stock alerts
  // FIX: Added 'Repair Services' and 'Quick Items' to the category union type.
  category: 'New Phones' | 'Buyback Phones' | 'Accessories' | 'Repair Parts' | 'Repair Services' | 'Quick Items';
  image?: string;
}

// ERP Model: Stock Table (Joins Store and Product)
export interface StoreInventory {
  id: string; // Unique ID for the stock record itself
  storeId: string; // FK -> Store.id
  productId: string; // FK -> Product.id
  quantity: number;
  lastUpdated: string;
}


export interface CartItem extends Product {
  cartQuantity: number;
  itemDiscount: number;
  storeId: string;
}

export interface Transaction {
  slNo: number;
  id: string;
  storeId: string;
  date: string;
  customer: string;
  phone: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  discount: number;
  grandTotal: number;
  cashPaid: number;
  onlinePaid: number;
  change: number;
  gotGift: boolean;
  salesman: string;
  status: 'completed' | 'void' | 'returned';
}

export interface ServiceTicket {
  id: string;
  customer: string;
  device: string;
  problem: string;
  tech: string;
  charges: number;
  status: 'Pending' | 'In Progress' | 'Completed';
  avatar?: string;
}

export interface User {
  id: string;
  name: string;
  role: 'Admin' | 'Staff';
  assignedStoreId?: string; // Critical for store-user view
}

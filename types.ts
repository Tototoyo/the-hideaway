export enum EntityCondition {
  Excellent = 'Excellent',
  Good = 'Good',
  Fair = 'Fair',
  'Needs Repair' = 'Needs Repair',
}

export enum TaskStatus {
  Pending = 'Pending',
  'In Progress' = 'In Progress',
  Completed = 'Completed',
}

export enum BedStatus {
    Ready = 'Ready',
    'Needs Cleaning' = 'Needs Cleaning',
}

export enum Role {
    Admin = 'Admin',
    Staff = 'Staff',
}

export enum PaymentStatus {
  Paid = 'Paid',
  'Deposit Paid' = 'Deposit Paid',
  Unpaid = 'Unpaid',
}

export interface PaymentType {
  id: string;
  name: string;
}

export interface Bed {
    id: string;
    number: number;
    status: BedStatus;
}

export interface Room {
    id:string;
    name: string;
    condition: EntityCondition;
    maintenanceNotes: string;
    beds: Bed[];
}

export interface Asset {
  id:string;
  name: string;
  type: string;
  location: string;
  purchaseDate: string;
  warranty: string;
  supplier: string;
  condition: EntityCondition;
}

// Updated Staff interface with new fields
export interface Staff {
  id: string;
  name: string;
  role: Role;
  salary: number;
  contact: string;
  employeeId: string;
  phone?: string;
  thaiId?: string;
  address?: string;
  emergencyContact?: string;
  birthday?: string;
  idPhotoUrl?: string;
}

// User interface for login credentials
export interface User {
  id: string;
  username: string;
  password: string;
  role: Role;
  staffId?: string; // Optional link to staff record
  isActive: boolean;
  createdAt: string;
}

export interface Shift {
    id:string;
    date: string;
    staffName: string;
    startTime: string;
    endTime: string;
}

export interface Task {
  id: string;
  description: string;
  assignedTo: string;
  dueDate: string;
  status: TaskStatus;
}

export interface UtilityRecord {
    id: string;
    utilityType: string;
    date: string;
    cost: number;
    billImage?: string;
}

export interface Absence {
  id: string;
  staffId: string;
  date: string;
  reason?: string;
}

export interface SalaryAdvance {
  id: string;
  staffId: string;
  date: string;
  amount: number;
  reason?: string;
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  commission?: number;
  type: 'Internal' | 'External';
  companyCost?: number;
}

export interface SpeedBoatTrip {
  id: string;
  route: string;
  company: string;
  price: number;
  cost: number;
  commission?: number;
}

export interface TaxiBoatOption {
  id: string;
  name: 'One Way' | 'Round Trip';
  price: number;
  commission?: number;
}

export interface Extra {
  id: string;
  name: string;
  price: number;
  commission?: number;
}

export interface WalkInGuest {
  id: string;
  guestName: string;
  roomId: string;
  bedNumber?: number;
  checkInDate: string;
  numberOfNights: number;
  pricePerNight: number;
  amountPaid: number;
  paymentMethod: string;
  nationality?: string;
  idNumber?: string;
  notes?: string;
  status: PaymentStatus;
}

export interface AccommodationBooking {
  id: string;
  guestName: string;
  platform: string;
  roomId: string;
  bedNumber?: number;
  checkInDate: string;
  numberOfNights: number;
  totalPrice: number;
  amountPaid: number;
  status: PaymentStatus;
}

export interface Booking {
  id: string;
  itemId: string;
  itemType: 'activity' | 'speedboat' | 'private_tour' | 'extra' | 'taxi_boat';
  itemName: string;
  staffId: string;
  bookingDate: string;
  customerPrice: number;
  numberOfPeople: number;
  discount?: number;
  extras?: Omit<Extra, 'id' | 'commission'>[];
  extrasTotal?: number;
  paymentMethod: string;
  receiptImage?: string;
  fuelCost?: number;
  captainCost?: number;
  itemCost?: number;
  employeeCommission?: number;
  hostelCommission?: number;
}

export interface ExternalSale {
  id: string;
  date: string;
  amount: number;
  description?: string;
}

export interface PlatformPayment {
  id: string;
  date: string;
  platform: string;
  amount: number;
  bookingReference?: string;
}

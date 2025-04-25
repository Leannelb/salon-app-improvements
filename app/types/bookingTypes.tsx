export interface Booking {
  id: string;
  serviceId: string;
  serviceName: string;
  stylistId: string;
  stylistName: string;
  branchId: string;
  branchName: string;
  date: string;
  time: string;
  status: BookingStatus;
  price: number;
}

export type BookingStatus = 'confirmed' | 'completed' | 'cancelled';

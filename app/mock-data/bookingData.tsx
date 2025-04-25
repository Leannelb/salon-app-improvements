import { Booking } from '../types/bookingTypes';

export const mockBookings: Booking[] = [
  {
    id: 'booking-1',
    serviceId: '1',
    serviceName: 'Haircut',
    stylistId: '1',
    stylistName: 'John',
    branchId: 'southside',
    branchName: 'Southside Salon',
    date: '2025-03-15',
    time: '10:00',
    status: 'confirmed',
    price: 35,
  },
  {
    id: 'booking-2',
    serviceId: '2',
    serviceName: 'Coloring',
    stylistId: '2',
    stylistName: 'Sarah',
    branchId: 'northside',
    branchName: 'Northside Studio',
    date: '2025-03-20',
    time: '14:30',
    status: 'confirmed',
    price: 80,
  },
];

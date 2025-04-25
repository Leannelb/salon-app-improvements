import { Service } from '../types/serviceTypes';

export const serviceMockData: Service[] = [
  {
    id: 1,
    name: 'Haircut',
    duration: 30,
    price: 35,
    description: 'Professional haircut tailored to your style preferences',
  },
  {
    id: 2,
    name: 'Coloring',
    duration: 90,
    price: 80,
    description: 'Full color treatment including roots and styling',
  },
  {
    id: 3,
    name: 'Styling',
    duration: 45,
    price: 50,
    description: 'Expert styling for special occasions or everyday looks',
  },
];

// Mock data for services and stylists
export const servicesBookingMockData = [
  { id: '1', name: 'Haircut', price: 35 },
  { id: '2', name: 'Coloring', price: 80 },
  { id: '3', name: 'Styling', price: 50 },
];

export const stylistsMockData = [
  { id: '1', name: 'John' },
  { id: '2', name: 'Sarah' },
  { id: '3', name: 'Michael' },
  { id: '4', name: 'Jessica' },
  { id: 'any', name: 'Any Available Stylist' },
];

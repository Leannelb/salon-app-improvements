import { Branch } from '../types/branchTypes';

export const mockBranches: Branch[] = [
  {
    id: 'southside',
    name: 'Southside Salon',
    address: '18 South Anne Street, Dublin',
    imageUrl: 'https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=500',
    phone: '(01) 847-3492',
    distance: '1.2 miles',
    features: ['Parking Available', 'Wheelchair Accessible'],
  },
  {
    id: 'northside',
    name: 'Northside Studio',
    address: '87 Cromcastle Road, Northside',
    imageUrl: 'https://images.unsplash.com/photo-1470259078422-826894b933aa?w=500',
    phone: '(01) 824-6578',
    distance: '3.5 miles',
    features: ['Wi-Fi', 'Coffee Bar'],
  },
];

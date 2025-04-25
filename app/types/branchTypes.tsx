export interface Branch {
  id: string;
  name: string;
  address: string;
  imageUrl?: string;
  phone: string;
  distance?: string; // Distance from user if location permissions granted
  features?: string[]; // Special features or services at this branch
}

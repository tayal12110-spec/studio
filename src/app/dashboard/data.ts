export type Staff = {
  name: string;
  status: 'Active' | 'Inactive';
  avatar: string;
};

export const staff: Staff[] = [
  { name: 'Amrita Singh Dhillon', status: 'Inactive', avatar: 'A' },
  { name: 'Sunny', status: 'Inactive', avatar: 'S' },
  { name: 'Ramendra Dwivedi', status: 'Inactive', avatar: 'R' },
  { name: 'Sanjay Beg', status: 'Active', avatar: 'S' },
];

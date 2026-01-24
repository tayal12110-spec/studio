export type Employee = {
  id: string; // Firestore document ID
  name: string;
  status: 'Active' | 'Inactive';
  avatar: string;
  phoneNumber?: string;
};

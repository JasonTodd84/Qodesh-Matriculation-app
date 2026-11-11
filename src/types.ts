export type RegistrationStatus = 'New' | 'Contacted' | 'Added to WhatsApp' | 'Completed';

export interface Registration {
  id: string;
  registrationNumber: string;
  createdAt: string;
  status: RegistrationStatus;
  fullName: string;
  preferredName?: string;
  gender: 'Male' | 'Female';
  dateOfBirth: string;
  phone: string;
  altPhone?: string;
  email: string;
  faculty: string;
  program: string;
  level: string;
  hostelOrArea: string;
  hostelBlock?: string;
  hostelLandmark?: string;
  hostelProximity?: string;
  nearbySites?: string;
  roomNumber?: string;
  registeredBy?: string;
  shepherdAssigned?: string;
  adminNotes?: string;
}

export interface HostelInfo {
  name: string;
  landmark: string;
  proximity: string;
  proximityBadge: string;
  proximityLevel: 'very-close' | 'close' | 'moderate';
  nearbySites: string;
  blocks?: string[];
}

export interface FacultyInfo {
  name: string;
  shortName: string;
  programs: string[];
}

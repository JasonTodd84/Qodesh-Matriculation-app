import { FacultyInfo, HostelInfo } from '../types';

export const FACULTIES_AND_PROGRAMS: FacultyInfo[] = [
  {
    name: 'Faculty of Computing and Information Systems (FoCIS)',
    shortName: 'Computing & IT',
    programs: [
      'BSc. Computer Science',
      'BSc. Information Technology',
      'BSc. Software Engineering',
      'BSc. Cyber Security',
      'BSc. Data Science & Analytics',
      'BSc. Mobile Computing',
      'BSc. Network & Systems Administration',
      'Diploma in Information Technology'
    ]
  },
  {
    name: 'Faculty of Engineering (FoE)',
    shortName: 'Engineering',
    programs: [
      'BSc. Telecommunications Engineering',
      'BSc. Computer Engineering',
      'BSc. Electrical and Electronic Engineering',
      'BSc. Renewable Energy Engineering',
      'Diploma in Telecommunications Engineering'
    ]
  },
  {
    name: 'GCTU Business School (GBS)',
    shortName: 'Business School',
    programs: [
      'BSc. Business Administration (Accounting with Computing)',
      'BSc. Business Administration (Banking & Finance)',
      'BSc. Business Administration (Human Resource Management)',
      'BSc. Business Administration (Marketing)',
      'BSc. Business Administration (Management)',
      'BSc. Procurement and Logistics',
      'BSc. Economics',
      'Diploma in Business Administration',
      'Diploma in Public Relations'
    ]
  }
];

export const ALL_PROGRAMS = FACULTIES_AND_PROGRAMS.flatMap((f) => f.programs);

export const ACADEMIC_LEVELS = [
  'Level 100',
  'Level 200',
  'Level 300',
  'Level 400',
  'Diploma'
];

export const GCTU_HOSTELS: HostelInfo[] = [
  {
    name: 'GT MAIN CAMPUS',
    landmark: 'Inside GCTU Campus / Tesano (Main Campus Hostel)',
    proximity: 'On campus (0 mins walk)',
    proximityBadge: 'On Campus',
    proximityLevel: 'very-close',
    nearbySites: 'Main Library, Great Hall, Lecture Theatres, Sports Complex',
    blocks: ['Block A', 'Block B', 'Block C']
  },
  {
    name: 'UNIDAZ HOSTEL',
    landmark: 'Behind GCTU Campus / Off Abeka Road',
    proximity: 'Very close (~3-5 mins walk to campus)',
    proximityBadge: 'Walking distance (< 5 mins)',
    proximityLevel: 'very-close',
    nearbySites: 'GCTU Main Gate, Abeka Junction, Shell Station'
  },
  {
    name: 'DELICIOUS HOSTEL',
    landmark: 'Plateau Street / Near Tesano Baptist',
    proximity: 'Close (~5-7 mins walk to campus)',
    proximityBadge: 'Short walk (5–7 mins)',
    proximityLevel: 'close',
    nearbySites: 'Tesano Club, Plateau Junction, Royal Fiesta'
  },
  {
    name: 'PALACE HOSTEL',
    landmark: 'Tesano Palace / Near Royal Fiesta Hotel',
    proximity: 'Close (~5-8 mins walk to campus)',
    proximityBadge: 'Short walk (5–8 mins)',
    proximityLevel: 'close',
    nearbySites: 'Royal Fiesta Hotel, Tesano Police Station, Avenor link'
  },
  {
    name: 'LEGACY HOSTEL',
    landmark: 'Near Tesano Baptist Church / Abeka Junction',
    proximity: 'Short walk (~6-8 mins to campus)',
    proximityBadge: 'Short walk (6–8 mins)',
    proximityLevel: 'close',
    nearbySites: 'Tesano Baptist Church, Abeka Post Office'
  },
  {
    name: 'EASTERN PINNACLE',
    landmark: 'Near Tesano Sports Club / Off Nsawam Road',
    proximity: 'Short walk (~7-9 mins to campus)',
    proximityBadge: 'Short walk (7–9 mins)',
    proximityLevel: 'close',
    nearbySites: 'Tesano Sports Club, Papaye Tesano'
  },
  {
    name: 'ZACK B HOSTEL',
    landmark: 'Abeka Main Road / Opposite TotalEnergies',
    proximity: 'Close (~4-6 mins walk to campus)',
    proximityBadge: 'Walking distance (4–6 mins)',
    proximityLevel: 'very-close',
    nearbySites: 'TotalEnergies Station, Abeka Market'
  },
  {
    name: 'ZACK B ANNEX HOSTEL',
    landmark: 'Zack B Junction / Near Abeka Post Office',
    proximity: 'Close (~5-7 mins walk to campus)',
    proximityBadge: 'Short walk (5–7 mins)',
    proximityLevel: 'close',
    nearbySites: 'Abeka Post Office, Commercial Bank area'
  },
  {
    name: 'TWINKLE HOSTEL',
    landmark: 'Tesano Residential Enclave / Near Peace FM',
    proximity: 'Short walk (~7-9 mins to campus)',
    proximityBadge: 'Short walk (7–9 mins)',
    proximityLevel: 'close',
    nearbySites: 'Peace FM / Ship House, Tesano Police Depot'
  },
  {
    name: 'ELARION HOSTEL',
    landmark: 'Near Abeka Lapaz Highway Junction',
    proximity: 'Moderate walk / short ride (~10 mins to campus)',
    proximityBadge: 'Moderate distance (~10 mins)',
    proximityLevel: 'moderate',
    nearbySites: 'Lapaz Highway, Las Palmas area'
  },
  {
    name: 'GOLDEN SPOON HOSTEL',
    landmark: 'Near Golden Spoon Restaurant / Tesano Club',
    proximity: 'Short walk (~6-8 mins to campus)',
    proximityBadge: 'Short walk (6–8 mins)',
    proximityLevel: 'close',
    nearbySites: 'Golden Spoon Restaurant, Tesano Gardens'
  },
  {
    name: 'LIZ HOSTEL',
    landmark: 'Off Abeka Road / Behind Police Depot',
    proximity: 'Moderate walk (~8-10 mins to campus)',
    proximityBadge: 'Moderate distance (8–10 mins)',
    proximityLevel: 'moderate',
    nearbySites: 'Police Depot, Abeka Junction'
  },
  {
    name: 'WELBECK HOSTEL',
    landmark: 'Welbeck Street / Tesano Residential',
    proximity: 'Close (~5-7 mins walk to campus)',
    proximityBadge: 'Short walk (5–7 mins)',
    proximityLevel: 'close',
    nearbySites: 'Tesano Residential, GCTU Back Gate'
  },
  {
    name: 'NAFSKEL HOSTEL',
    landmark: 'Near Tesano Main Bypass / GCTU Enclave',
    proximity: 'Very close (~4-6 mins walk to campus)',
    proximityBadge: 'Walking distance (4–6 mins)',
    proximityLevel: 'very-close',
    nearbySites: 'GCTU Campus, Nsawam Road bypass'
  }
];

export const HOSTEL_NAMES = GCTU_HOSTELS.map((h) => h.name);

export const PROXIMITY_OPTIONS = [
  { value: 'Walking distance (< 5 mins)', label: 'Walking distance (< 5 mins to GCTU)' },
  { value: 'Short walk (5–10 mins)', label: 'Short walk (5–10 mins to GCTU)' },
  { value: 'Moderate walk (10–15 mins)', label: 'Moderate distance (10–15 mins)' },
  { value: 'Commuter / Drive (> 15 mins)', label: 'Commuter / Drive needed (> 15 mins)' }
];

export function getHostelByName(name?: string): HostelInfo | undefined {
  if (!name) return undefined;
  return GCTU_HOSTELS.find((h) => h.name.toLowerCase() === name.trim().toLowerCase());
}

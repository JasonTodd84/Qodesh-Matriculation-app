import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  writeBatch
} from 'firebase/firestore';
import { Registration } from '../types';

export const firebaseConfig = {
  projectId: "plucky-period-1pz3c",
  appId: "1:633943506886:web:e8e1710b316294234a3cc7",
  apiKey: "AIzaSyAVoFV78NMWixVhU8317jta9uMPjhHVXEA",
  authDomain: "plucky-period-1pz3c.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-matriculationpho-d3eedfc8-0083-4291-9104-21ead295f2aa",
  storageBucket: "plucky-period-1pz3c.firebasestorage.app",
  messagingSenderId: "633943506886",
  measurementId: "",
  oAuthClientId: "633943506886-74h7n8o3bfm7phl6448hv4jfpa2d00gf.apps.googleusercontent.com",
  recaptchaSiteKey: ""
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

export const STORAGE_KEY = 'qodesh_gctu_matriculation_registrations_clean_v1';

export function getLocalRegistrations(): Registration[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to parse local registrations:', err);
    return [];
  }
}

export function saveLocalRegistrations(list: Registration[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (err) {
    console.error('Failed to save to local cache:', err);
  }
}

export function subscribeToRegistrations(
  onData: (registrations: Registration[]) => void,
  onError?: (err: unknown) => void
): () => void {
  const q = query(collection(db, 'registrations'), orderBy('createdAt', 'desc'));
  return onSnapshot(
    q,
    (snapshot) => {
      const docs: Registration[] = [];
      snapshot.forEach((d) => {
        docs.push(d.data() as Registration);
      });
      saveLocalRegistrations(docs);
      onData(docs);
    },
    (error) => {
      console.warn('Firestore onSnapshot error, falling back to local cache:', error);
      onData(getLocalRegistrations());
      if (onError) onError(error);
    }
  );
}

export async function createRegistration(
  data: Omit<Registration, 'id' | 'registrationNumber' | 'createdAt' | 'status'>,
  currentCount: number = 0
): Promise<Registration> {
  const nextNum = currentCount + 1;
  const padded = String(nextNum).padStart(4, '0');
  const id = `reg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const fullRecord: Registration = {
    ...data,
    id,
    registrationNumber: `QCC-GCTU-${padded}`,
    createdAt: new Date().toISOString(),
    status: 'New'
  };

  try {
    await setDoc(doc(db, 'registrations', id), fullRecord);
  } catch (err) {
    console.error('Error writing to Firestore:', err);
    saveLocalRegistrations([fullRecord, ...getLocalRegistrations()]);
    throw err;
  }

  const local = getLocalRegistrations();
  if (!local.some((r) => r.id === id)) {
    saveLocalRegistrations([fullRecord, ...local]);
  }
  return fullRecord;
}

export async function updateRegistrationRecord(
  id: string,
  updates: Partial<Registration>
): Promise<void> {
  try {
    await updateDoc(doc(db, 'registrations', id), updates);
  } catch (err) {
    console.error('Failed to update in Firestore:', err);
    const updated = getLocalRegistrations().map((r) =>
      r.id === id ? { ...r, ...updates } : r
    );
    saveLocalRegistrations(updated);
    throw err;
  }
}

export async function deleteRegistrationRecord(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'registrations', id));
  } catch (err) {
    console.error('Failed to delete from Firestore:', err);
    const filtered = getLocalRegistrations().filter((r) => r.id !== id);
    saveLocalRegistrations(filtered);
    throw err;
  }
}

export async function clearAllRegistrations(registrations: Registration[]): Promise<void> {
  try {
    const batch = writeBatch(db);
    for (const r of registrations) {
      batch.delete(doc(db, 'registrations', r.id));
    }
    await batch.commit();
    saveLocalRegistrations([]);
  } catch (err) {
    console.error('Failed to clear registrations from Firestore:', err);
    saveLocalRegistrations([]);
    throw err;
  }
}

export function getWhatsAppLink(phone: string, preferredName?: string): string {
  let clean = phone.replace(/[^0-9]/g, '');
  if (clean.startsWith('0') && clean.length === 10) {
    clean = '233' + clean.slice(1);
  }
  const greeting = preferredName
    ? encodeURIComponent(`Hi ${preferredName}! Greetings from Qodesh Campus Church at GCTU! ⛪ Happy Matriculation!`)
    : 'Hi%20there!%20Greetings%20from%20Qodesh%20Campus%20Church%20at%20GCTU!%20%E2%9B%AA';
  return `https://wa.me/${clean}?text=${greeting}`;
}

export function exportRegistrationsToCSV(records: Registration[]): void {
  const headers = [
    'Registration ID',
    'Date & Time',
    'Full Name',
    'Preferred Name',
    'Gender',
    'Date of Birth',
    'Phone Number',
    'Alt Phone',
    'Email',
    'Faculty',
    'Program of Study',
    'Level',
    'Hostel / Residential Area',
    'Hostel Block',
    'Local Landmark',
    'Proximity Indicator',
    'Nearby Sites',
    'Room / Flat',
    'Follow-Up Status',
    'Assigned Shepherd',
    'Admin Notes',
    'Registered By'
  ];

  const sanitize = (val: unknown) =>
    val == null ? '""' : `"${String(val).replace(/"/g, '""')}"`;

  const rows = records.map((r) =>
    [
      sanitize(r.registrationNumber),
      sanitize(new Date(r.createdAt).toLocaleString()),
      sanitize(r.fullName),
      sanitize(r.preferredName || ''),
      sanitize(r.gender),
      sanitize(r.dateOfBirth || ''),
      sanitize(r.phone),
      sanitize(r.altPhone || ''),
      sanitize(r.email),
      sanitize(r.faculty || ''),
      sanitize(r.program),
      sanitize(r.level),
      sanitize(r.hostelOrArea),
      sanitize(r.hostelBlock || ''),
      sanitize(r.hostelLandmark || ''),
      sanitize(r.hostelProximity || ''),
      sanitize(r.nearbySites || ''),
      sanitize(r.roomNumber || ''),
      sanitize(r.status),
      sanitize(r.shepherdAssigned || ''),
      sanitize(r.adminNotes || ''),
      sanitize(r.registeredBy || 'Self')
    ].join(',')
  );

  const csvContent = [headers.map((h) => `"${h}"`).join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('href', url);
  const today = new Date().toISOString().split('T')[0];
  a.setAttribute('download', `qodesh_gctu_matriculation_photoshoot_${today}.csv`);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

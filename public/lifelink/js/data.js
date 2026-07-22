// LifeLink — Seed & LocalStorage Data Layer

const LS_KEYS = {
  USERS: 'lifelink_users',
  DONORS: 'lifelink_donors',
  PATIENTS: 'lifelink_patients',
  REQUESTS: 'lifelink_requests',
  SESSION: 'lifelink_session',
  SEEDED: 'lifelink_seeded_v1',
};

const SEED_DONORS = [
  { id: 'd1', name: 'Rahul Sharma', phone: '9876500001', email: 'rahul@demo.com', bloodGroup: 'O+', city: 'Mumbai', available: true },
  { id: 'd2', name: 'Priya Patel', phone: '9876500002', email: 'priya@demo.com', bloodGroup: 'A+', city: 'Ahmedabad', available: true },
  { id: 'd3', name: 'Arjun Reddy', phone: '9876500003', email: 'arjun@demo.com', bloodGroup: 'B+', city: 'Hyderabad', available: false },
  { id: 'd4', name: 'Sneha Iyer', phone: '9876500004', email: 'sneha@demo.com', bloodGroup: 'AB+', city: 'Chennai', available: true },
  { id: 'd5', name: 'Vikram Singh', phone: '9876500005', email: 'vikram@demo.com', bloodGroup: 'O-', city: 'Delhi', available: true },
  { id: 'd6', name: 'Anjali Nair', phone: '9876500006', email: 'anjali@demo.com', bloodGroup: 'A-', city: 'Bangalore', available: true },
  { id: 'd7', name: 'Karan Mehta', phone: '9876500007', email: 'karan@demo.com', bloodGroup: 'B-', city: 'Pune', available: false },
  { id: 'd8', name: 'Divya Krishnan', phone: '9876500008', email: 'divya@demo.com', bloodGroup: 'AB-', city: 'Kochi', available: true },
  { id: 'd9', name: 'Rohan Gupta', phone: '9876500009', email: 'rohan@demo.com', bloodGroup: 'O+', city: 'Kolkata', available: true },
  { id: 'd10', name: 'Meera Joshi', phone: '9876500010', email: 'meera@demo.com', bloodGroup: 'A+', city: 'Jaipur', available: true },
];

const SEED_PATIENTS = [
  { id: 'p1', name: 'Amit Verma', phone: '9876600001', email: 'amit@demo.com', bloodGroup: 'O+', city: 'Mumbai' },
  { id: 'p2', name: 'Neha Kapoor', phone: '9876600002', email: 'neha@demo.com', bloodGroup: 'B+', city: 'Delhi' },
  { id: 'p3', name: 'Sanjay Rao', phone: '9876600003', email: 'sanjay@demo.com', bloodGroup: 'A+', city: 'Pune' },
  { id: 'p4', name: 'Pooja Shah', phone: '9876600004', email: 'pooja@demo.com', bloodGroup: 'AB+', city: 'Bangalore' },
  { id: 'p5', name: 'Ravi Menon', phone: '9876600005', email: 'ravi@demo.com', bloodGroup: 'O-', city: 'Chennai' },
];

const SEED_REQUESTS = [
  { id: 'r1', patientName: 'Amit Verma', bloodGroup: 'O+', hospital: 'Lilavati Hospital', units: 2, emergency: true, city: 'Mumbai', createdAt: Date.now() - 86400000 },
  { id: 'r2', patientName: 'Neha Kapoor', bloodGroup: 'B+', hospital: 'AIIMS Delhi', units: 1, emergency: false, city: 'Delhi', createdAt: Date.now() - 172800000 },
  { id: 'r3', patientName: 'Sanjay Rao', bloodGroup: 'A+', hospital: 'Ruby Hall Clinic', units: 3, emergency: true, city: 'Pune', createdAt: Date.now() - 3600000 },
  { id: 'r4', patientName: 'Pooja Shah', bloodGroup: 'AB+', hospital: 'Manipal Hospital', units: 1, emergency: false, city: 'Bangalore', createdAt: Date.now() - 43200000 },
  { id: 'r5', patientName: 'Ravi Menon', bloodGroup: 'O-', hospital: 'Apollo Chennai', units: 2, emergency: true, city: 'Chennai', createdAt: Date.now() - 7200000 },
];

const DB = {
  get(key, fallback = []) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
    catch { return fallback; }
  },
  set(key, value) { localStorage.setItem(key, JSON.stringify(value)); },
  push(key, item) {
    const list = DB.get(key, []);
    list.push(item);
    DB.set(key, list);
    return item;
  },
  remove(key, id) {
    const list = DB.get(key, []).filter(x => x.id !== id);
    DB.set(key, list);
  },
  update(key, id, patch) {
    const list = DB.get(key, []).map(x => x.id === id ? { ...x, ...patch } : x);
    DB.set(key, list);
  },
};

function seedIfEmpty() {
  if (localStorage.getItem(LS_KEYS.SEEDED)) return;
  DB.set(LS_KEYS.DONORS, SEED_DONORS);
  DB.set(LS_KEYS.PATIENTS, SEED_PATIENTS);
  DB.set(LS_KEYS.REQUESTS, SEED_REQUESTS);

  // Create login accounts for seed users (password: demo123)
  const users = [];
  SEED_DONORS.forEach(d => users.push({ email: d.email, password: 'demo123', role: 'donor', refId: d.id, name: d.name }));
  SEED_PATIENTS.forEach(p => users.push({ email: p.email, password: 'demo123', role: 'patient', refId: p.id, name: p.name }));
  users.push({ email: 'admin@lifelink.com', password: 'admin123', role: 'admin', refId: null, name: 'Admin' });
  DB.set(LS_KEYS.USERS, users);

  localStorage.setItem(LS_KEYS.SEEDED, '1');
}

if (typeof window !== 'undefined') seedIfEmpty();

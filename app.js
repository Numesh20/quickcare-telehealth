/* ==========================================================================
   QuickCare Telehealth — app.js
   Complete Application Logic
   ========================================================================== */

'use strict';

// ==========================================================================
//  DATA
// ==========================================================================

const DOCTORS = [
  { id: 1, name: 'Dr. Sandya Perera', specialty: 'Cardiology', rating: 4.9, reviews: 1284, fee: 18150, wait: '< 5 min', img: 'https://api.dicebear.com/8.x/avataaars/svg?seed=DrSandya', keywords: ['chest', 'heart', 'cardio', 'palpitation', 'blood pressure'] },
  { id: 2, name: 'Dr. Kamal Jayasinghe', specialty: 'General', rating: 4.7, reviews: 892, fee: 14850, wait: '< 10 min', img: 'https://api.dicebear.com/8.x/avataaars/svg?seed=DrKamal', keywords: ['fever', 'cold', 'cough', 'flu', 'general', 'headache'] },
  { id: 3, name: 'Dr. Niluka Gunawardena', specialty: 'Dermatology', rating: 4.8, reviews: 567, fee: 19800, wait: '< 8 min', img: 'https://api.dicebear.com/8.x/avataaars/svg?seed=DrNiluka', keywords: ['skin', 'rash', 'acne', 'eczema', 'derma'] },
  { id: 4, name: 'Dr. Thilak Fernando', specialty: 'Pediatrics', rating: 4.6, reviews: 734, fee: 16500, wait: '< 12 min', img: 'https://api.dicebear.com/8.x/avataaars/svg?seed=DrThilak', keywords: ['child', 'pediatric', 'baby', 'kid', 'infant'] },
  { id: 5, name: 'Dr. Madhavi Wickramasinghe', specialty: 'Mental Health', rating: 4.9, reviews: 418, fee: 23100, wait: '< 15 min', img: 'https://api.dicebear.com/8.x/avataaars/svg?seed=DrMadhavi', keywords: ['anxiety', 'depression', 'stress', 'mental', 'therapy', 'sleep', 'insomnia'] },
  { id: 6, name: 'Dr. Ruwan Dissanayake', specialty: 'Orthopedics', rating: 4.5, reviews: 329, fee: 21450, wait: '< 20 min', img: 'https://api.dicebear.com/8.x/avataaars/svg?seed=DrRuwan', keywords: ['back', 'joint', 'knee', 'shoulder', 'pain', 'orthopedic', 'sprain'] },
];

const SAMPLE_REVIEWS = {
  1: [
    { user: 'Asanka R.', rating: 5, text: 'Dr. Perera diagnosed my irregular heartbeat immediately. ඉතා ගුණදායක සත්කාර!' },
    { user: 'Malini L.', rating: 5, text: 'Very thorough and knowledgeable. Highly recommend for cardiac concerns.' },
    { user: 'Tharaka B.', rating: 4, text: 'Great consultation. A little rushed at the end but overall excellent.' },
  ],
  2: [{ user: 'Sandamali P.', rating: 5, text: 'Quick and professional. Sorted my fever diagnosis in minutes.' }, { user: 'Rajitha K.', rating: 4, text: 'Good general practitioner. Clear advice.' }],
  3: [{ user: 'Zoysa M.', rating: 5, text: 'Finally cleared up my eczema after seeing 3 other doctors. Dr. Gunawardena is amazing!' }],
  4: [{ user: 'Amaya ගේ දෙමව්පියෝ', rating: 5, text: 'Dr. Fernando was so patient and calm with my anxious toddler. Brilliant.' }],
  5: [{ user: 'Anonymous', rating: 5, text: 'Changed my life. Supportive, non-judgmental, and truly listens.' }],
  6: [{ user: 'Chamara N.', rating: 4, text: 'Good advice on my knee injury. Recommended physio rather than surgery.' }],
};

const HISTORY_ITEMS = [
  { date: 'Aug 22, 2026', doctor: 'Dr. Sandya Perera', specialty: 'Cardiology', diagnosis: 'Stable Angina (I20.8)', rx: 'Atenolol 25mg · 1x daily for 30 days' },
  { date: 'Jul 15, 2026', doctor: 'Dr. Kamal Jayasinghe', specialty: 'General Medicine', diagnosis: 'Viral URI (J06.9)', rx: 'Paracetamol 500mg · 3x daily for 5 days' },
  { date: 'Jun 03, 2026', doctor: 'Dr. Madhavi Wickramasinghe', specialty: 'Mental Health', diagnosis: 'Generalized Anxiety (F41.1)', rx: 'Sertraline 50mg · 1x daily for 30 days' },
];

const KANBAN_DATA = [
  { col: 'todo', id: 'US-09', pts: 5, title: 'HIPAA audit trail logging for all data access', epic: 'Compliance', assignee: 'QA' },
  { col: 'todo', id: 'US-10', pts: 3, title: 'Push notification when doctor accepts appointment', epic: 'Notifications', assignee: 'BE' },
  { col: 'todo', id: 'US-11', pts: 8, title: 'In-app pharmacy prescription fulfillment flow', epic: 'Pharmacy', assignee: 'FE' },
  { col: 'inprogress', id: 'US-05', pts: 8, title: 'Twilio WebRTC video room integration with waiting room', epic: 'Video', assignee: 'BE' },
  { col: 'inprogress', id: 'US-07', pts: 5, title: 'Stripe payment gateway integration + refund flow', epic: 'Payments', assignee: 'FE' },
  { col: 'review', id: 'US-03', pts: 13, title: 'Doctor Rx prescription pad + allergy contraindication engine', epic: 'Clinical', assignee: 'FE' },
  { col: 'review', id: 'US-06', pts: 8, title: 'Patient search with real-time specialty filter + ratings', epic: 'Patient', assignee: 'FE' },
  { col: 'done', id: 'US-01', pts: 5, title: 'Patient registration & KYC onboarding flow', epic: 'Auth', assignee: 'FE' },
  { col: 'done', id: 'US-02', pts: 8, title: 'Doctor profile onboarding, license verification & schedule', epic: 'Doctor', assignee: 'BE' },
  { col: 'done', id: 'US-04', pts: 5, title: 'Agile Kanban board with drag-and-drop story management', epic: 'PM Tools', assignee: 'PM' },
  { col: 'done', id: 'US-08', pts: 8, title: 'Sprint burndown chart + velocity tracker dashboard', epic: 'PM Tools', assignee: 'PM' },
];

const SPRINT_DATA = [
  { label: 'S1', planned: 30, actual: 29 },
  { label: 'S2', planned: 30, actual: 31 },
  { label: 'S3', planned: 30, actual: 30 },
  { label: 'S4', planned: 32, actual: 32 },
];

const RETRO_DATA = {
  well: [
    { text: 'CI/CD pipeline cut deployment time by 70%', author: 'BE Team', votes: 5 },
    { text: 'Planning Poker improved estimation accuracy to 98.4%', author: 'Scrum Master', votes: 8 },
    { text: 'Daily standups kept blockers resolved in < 1 day', author: 'Dev Team', votes: 6 },
  ],
  slow: [
    { text: 'HIPAA documentation review took 2x longer than estimated', author: 'QA Lead', votes: 4 },
    { text: 'Twilio API rate limits caused Sprint 2 delay', author: 'BE Dev', votes: 3 },
  ],
  action: [
    { text: 'Add HIPAA review to Definition of Ready for all compliance stories', author: 'PM', votes: 7 },
    { text: 'Pre-negotiate API rate limit tiers with vendors in Sprint Planning', author: 'PM', votes: 5 },
    { text: 'Run design reviews 1 sprint ahead to reduce UX rework', author: 'UX Designer', votes: 4 },
  ],
};

const BUDGET_ITEMS = [
  { label: 'Engineering (4 Developers)', spend: 23760000, budget: 24750000, color: 'cyan' },
  { label: 'Infrastructure (AWS + Twilio)', spend: 6072000, budget: 6600000, color: 'purple' },
  { label: 'QA & Security Audit', spend: 4620000, budget: 4620000, color: 'green' },
  { label: 'Design & UX', spend: 3960000, budget: 3630000, color: 'amber' },
];

const RAID_ITEMS = [
  { id: 'R-01', type: 'Risk', desc: 'HIPAA non-compliance due to unencrypted PHI at rest', p: 3, i: 5, level: 'high', badge: 'compliance', mitigation: 'AES-256 encryption + pen test in Sprint 2', status: 'Resolved' },
  { id: 'R-02', type: 'Risk', desc: 'Twilio API rate limits blocking video calls at scale', p: 4, i: 4, level: 'high', badge: 'tech', mitigation: 'Renegotiated SLA + circuit breaker pattern', status: 'Resolved' },
  { id: 'R-03', type: 'Issue', desc: 'Lead developer out for 1 week due to illness', p: 5, i: 3, level: 'med', badge: 'scope', mitigation: 'Cross-training; backlog re-prioritized', status: 'Resolved' },
  { id: 'R-04', type: 'Risk', desc: 'Scope creep: client added pharmacy delivery feature', p: 2, i: 3, level: 'low', badge: 'vendor', mitigation: 'Added to backlog for Sprint 5 post-MVP', status: 'Open' },
];

const RACI_ROWS = [
  { task: 'Sprint Planning & Backlog Grooming', pm: 'A', dev: 'R', qa: 'C', ux: 'C', po: 'R' },
  { task: 'HIPAA Compliance Audit', pm: 'A', dev: 'C', qa: 'R', ux: 'I', po: 'I' },
  { task: 'UI/UX Design Approval', pm: 'A', dev: 'C', qa: 'I', ux: 'R', po: 'C' },
  { task: 'API Integration (Twilio + Stripe)', pm: 'I', dev: 'R', qa: 'C', ux: 'I', po: 'A' },
  { task: 'QA Test Execution', pm: 'I', dev: 'C', qa: 'R', ux: 'I', po: 'A' },
  { task: 'Go-Live & App Store Release', pm: 'AR', dev: 'R', qa: 'R', ux: 'C', po: 'A' },
];

const POKER_STORIES = [
  { id: 'US-08', epic: 'Video Consultation', title: 'As a patient, I want to join a secure video call with a licensed doctor in under 15 minutes, with a waiting room and call quality indicator.', desc: 'Acceptance: Given I book a consult, when the doctor accepts, then I can join a Twilio encrypted video room with mic/cam controls.' },
  { id: 'US-11', epic: 'Pharmacy', title: 'As a patient, I want to order my prescribed medications and track real-time delivery on a live map.', desc: 'Acceptance: Given a prescription is issued, when I tap Order, then I can track delivery with driver GPS and receive an OTP.' },
  { id: 'US-03', epic: 'Clinical', title: 'As a doctor, I want to write digital prescriptions with automatic allergy contraindication detection.', desc: 'Acceptance: Given a patient allergy on file, when I prescribe a contraindicated drug, then a blocking alert fires before submission.' },
];

const SCRUM_MEMBERS = [
  { name: 'Numesh (PM)', role: 'IT PM / Scrum Master', icon: 'fa-chart-gantt' },
  { name: 'Eranga (FE)', role: 'Frontend Engineer', icon: 'fa-code' },
  { name: 'Ranjith (BE)', role: 'Backend Engineer', icon: 'fa-server' },
  { name: 'Nadeeka (QA)', role: 'QA Lead', icon: 'fa-shield-check' },
  { name: 'Lahiru (UX)', role: 'UI/UX Designer', icon: 'fa-pen-ruler' },
  { name: 'Priyanka (PO)', role: 'Product Owner', icon: 'fa-star' },
];

const PENICILLIN_DRUGS = ['amoxicillin', 'ampicillin', 'penicillin', 'augmentin', 'amoxil', 'piperacillin', 'flucloxacillin', 'oxacillin'];

const PRESETS = {
  URI: { diagnosis: 'Viral Upper Respiratory Infection (J06.9)', meds: [['Paracetamol', '500mg', '3x daily for 5 days'], ['Cetirizine', '10mg', '1x daily for 7 days'], ['', '', '']] },
  HTN: { diagnosis: 'Essential Hypertension (I10)', meds: [['Amlodipine', '5mg', '1x daily'], ['Ramipril', '5mg', '1x daily'], ['', '', '']] },
  T2D: { diagnosis: 'Type 2 Diabetes Mellitus (E11)', meds: [['Metformin', '500mg', '2x daily with food'], ['Sitagliptin', '100mg', '1x daily'], ['', '', '']] },
  Anxiety: { diagnosis: 'Generalized Anxiety Disorder (F41.1)', meds: [['Sertraline', '50mg', '1x daily for 30 days'], ['Alprazolam', '0.25mg', 'As needed (max 3x daily)'], ['', '', '']] },
  Skin: { diagnosis: 'Skin Infection — Cellulitis (L03.9)', meds: [['Doxycycline', '100mg', '2x daily for 7 days'], ['Mupirocin cream', 'Topical', 'Apply 3x daily for 10 days'], ['', '', '']] },
};

const AI_RESPONSES = {
  fever: { level: 'mod', msg: 'Based on your symptoms, this could be a viral infection or flu. I recommend consulting a General Practitioner. Stay hydrated and monitor temperature.', doc: DOCTORS[1] },
  headache: { level: 'mild', msg: 'Headaches can have many causes — tension, dehydration, or migraine. If this is recurrent or very severe (thunderclap headache), seek immediate care.', doc: DOCTORS[1] },
  'chest pain': { level: 'mod', msg: 'Chest pain requires prompt medical attention. Please consult a Cardiologist immediately. If severe, call emergency services.', doc: DOCTORS[0] },
  'skin rash': { level: 'mild', msg: 'A skin rash may indicate an allergic reaction or infection. A Dermatologist can diagnose and prescribe appropriate treatment.', doc: DOCTORS[2] },
  fatigue: { level: 'mild', msg: 'Persistent fatigue can be caused by anaemia, thyroid issues, or stress. A General Practitioner can run a blood panel to identify causes.', doc: DOCTORS[1] },
  anxiety: { level: 'mod', msg: 'Anxiety symptoms are manageable with proper support. Our Mental Health specialist can provide a safe, confidential consultation.', doc: DOCTORS[4] },
  default: { level: 'mild', msg: 'Thank you for describing your symptoms. Based on your input, I recommend consulting one of our available specialists. Would you like me to find the best match?', doc: DOCTORS[1] },
};

const DOCTOR_CALENDAR = {
  Mon: [{ time: '09:00', type: 'booked', name: 'Janaka R.' }, { time: '10:00', type: 'live', name: 'Mahesh W.' }, { time: '11:00', type: 'booked', name: 'Priyanka N.' }, { time: '14:00', type: 'free' }, { time: '15:00', type: 'free' }],
  Tue: [{ time: '09:00', type: 'free' }, { time: '10:00', type: 'booked', name: 'Eranga T.' }, { time: '11:00', type: 'free' }, { time: '14:00', type: 'booked', name: 'Saman K.' }, { time: '16:00', type: 'free' }],
  Wed: [{ time: '09:00', type: 'booked', name: 'Dinesh C.' }, { time: '10:00', type: 'free' }, { time: '11:00', type: 'booked', name: 'Mala J.' }, { time: '14:00', type: 'free' }, { time: '15:00', type: 'booked', name: 'Nuwan L.' }],
  Thu: [{ time: '09:00', type: 'free' }, { time: '10:00', type: 'free' }, { time: '11:00', type: 'booked', name: 'Sumudu B.' }, { time: '14:00', type: 'free' }, { time: '15:00', type: 'booked', name: 'Chamara M.' }],
  Fri: [{ time: '09:00', type: 'booked', name: 'Lakshmi H.' }, { time: '10:00', type: 'free' }, { time: '11:00', type: 'free' }, { time: '14:00', type: 'booked', name: 'Fathima T.' }, { time: '15:00', type: 'free' }],
};

// ==========================================================================
//  STATE
// ==========================================================================

let state = {
  currentView: 'patient',
  patientScreen: 'search',
  currentSpecialty: 'All',
  selectedSlot: null,
  selectedDoctor: null,
  currentPatientAllergy: 'penicillin',
  selectedStarRating: 0,
  pokerSelectedCard: null,
  pokerRevealed: false,
  currentPokerStory: 0,
  pokerVotes: {},
  retroData: JSON.parse(JSON.stringify(RETRO_DATA)),
  docTab: 'rx',
  pmTab: 'kanban',
  dragCard: null,
  dragCol: null,
  standupActive: false,
  standupMemberIndex: -1,
  standupTimer: null,
  totalStandupTimer: null,
  standupSpeakerSeconds: 120,
  standupTotalSeconds: 0,
  standupDone: new Set(),
  callActive: false,
  callTimer: null,
  callSeconds: 0,
  micOn: true,
  camOn: true,
  chatOpen: false,
  audioOn: true,
  themeLight: false,
  kanbanData: JSON.parse(JSON.stringify(KANBAN_DATA)),
  sprintSelected: 4,
  voiceRecording: false,
  voiceInterval: null,
  aiMessages: [],
  standupLog: [],
  bookingForDoctor: null,
  bookingConfirmedDoctor: null,
};

// ==========================================================================
//  INIT
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  renderDoctorList();
  renderBookingDoctors();
  renderHistoryList();
  renderKanban();
  renderVelocityChart();
  renderBurndown();
  renderPokerDeck();
  renderPokerTeamVotes();
  renderRetroBoard();
  renderBudgetBars();
  renderRAIDTable();
  renderRACITable();
  renderScrumMembers();
  renderDocCalendar();
  setTodayDate();
  updateRiskCalc();
  initAIChat();
  updateSim(null, null, null, true);
});

// ==========================================================================
//  MAIN VIEW SWITCHER
// ==========================================================================

function switchView(view) {
  state.currentView = view;
  document.querySelectorAll('.view-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
  document.getElementById('view-' + view).classList.add('active');
  const tab = document.getElementById('tab-' + view);
  tab.classList.add('active');
  tab.setAttribute('aria-selected', 'true');
}

// ==========================================================================
//  PATIENT APP
// ==========================================================================

function switchPatientScreen(screen) {
  state.patientScreen = screen;
  document.querySelectorAll('.phone-screen').forEach(s => s.classList.add('hidden'));
  document.querySelectorAll('.p-nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('screen-' + screen).classList.remove('hidden');
  document.getElementById('pnav-' + screen).classList.add('active');
}

function renderDoctorList(docs) {
  const list = document.getElementById('doctorList');
  const data = docs || DOCTORS;
  document.getElementById('doctorCount').textContent = data.length + ' Online';
  list.innerHTML = data.map(d => `
    <div class="doc-card">
      <div class="doc-card-top">
        <img src="${d.img}" alt="${d.name}" class="doc-card-img" />
        <div class="doc-meta">
          <h5>${d.name}</h5>
          <span class="doc-specialty">${d.specialty}</span>
          <div class="doc-rating">★ ${d.rating} <span style="color:var(--text-muted);">(${d.reviews.toLocaleString()} reviews)</span></div>
        </div>
        <span style="font-size:10px;color:var(--accent-emerald);">${d.wait}</span>
      </div>
      <div class="doc-card-bottom">
        <span class="doc-fee">Rs. ${d.fee.toLocaleString()}/consult</span>
        <div style="display:flex;gap:6px;">
          <button class="btn-book-sm" style="background:transparent;border:1px solid var(--border-color);color:var(--text-secondary);" onclick="openReviews(${d.id})">Reviews</button>
          <button class="btn-book-sm" onclick="openBooking(${d.id})">Book Now</button>
        </div>
      </div>
    </div>
  `).join('');
}

function renderBookingDoctors() {
  const list = document.getElementById('bookingDoctorList');
  const subset = DOCTORS.slice(0, 3);
  list.innerHTML = subset.map(d => `
    <div class="doc-card">
      <div class="doc-card-top">
        <img src="${d.img}" alt="${d.name}" class="doc-card-img" />
        <div class="doc-meta">
          <h5>${d.name}</h5>
          <span class="doc-specialty">${d.specialty}</span>
          <div class="doc-rating">★ ${d.rating}</div>
        </div>
      </div>
      <div class="doc-card-bottom">
        <span class="doc-fee">Rs. ${d.fee.toLocaleString()}/consult</span>
        <button class="btn-book-sm" onclick="openBooking(${d.id})">Book</button>
      </div>
    </div>
  `).join('');
}

function renderHistoryList() {
  const list = document.getElementById('historyList');
  list.innerHTML = HISTORY_ITEMS.map(h => `
    <div class="history-card">
      <div class="history-header">
        <div>
          <span class="history-date">${h.date}</span>
          <span class="history-diag"><strong>${h.doctor}</strong> · ${h.specialty}</span>
        </div>
        <button class="btn-book-sm" onclick="showInvoice('${h.date}', '${h.doctor}')">Invoice</button>
      </div>
      <div style="font-size:12px;color:var(--text-secondary);">Diagnosis: ${h.diagnosis}</div>
      <div class="history-rx"><i class="fa-solid fa-prescription" style="margin-right:6px;"></i>${h.rx}</div>
    </div>
  `).join('');
}

function filterDoctors() {
  const input = document.getElementById('doctorSearchInput').value.toLowerCase();
  const clearBtn = document.getElementById('searchClearBtn');
  clearBtn.classList.toggle('hidden', !input);
  if (!input) { renderDoctorList(); return; }
  const filtered = DOCTORS.filter(d =>
    d.name.toLowerCase().includes(input) ||
    d.specialty.toLowerCase().includes(input) ||
    d.keywords.some(k => k.includes(input))
  );
  renderDoctorList(filtered);
}

function clearSearch() {
  document.getElementById('doctorSearchInput').value = '';
  document.getElementById('searchClearBtn').classList.add('hidden');
  renderDoctorList();
}

function filterBySpecialty(specialty, el) {
  state.currentSpecialty = specialty;
  document.querySelectorAll('#specialtyChips .chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  if (specialty === 'All') { renderDoctorList(); return; }
  renderDoctorList(DOCTORS.filter(d => d.specialty === specialty));
}

function toggleSymptom(el) {
  el.classList.toggle('active');
}

// ==========================================================================
//  BOOKING MODAL
// ==========================================================================

const SLOTS = ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'];

function openBooking(doctorId) {
  const doc = DOCTORS.find(d => d.id === doctorId);
  state.bookingForDoctor = doc;
  state.selectedSlot = null;
  document.getElementById('bookingDocInfo').innerHTML = `
    <img src="${doc.img}" alt="${doc.name}" />
    <div><h4>${doc.name}</h4><span>${doc.specialty} · ★ ${doc.rating}</span></div>
  `;
  const slotGrid = document.getElementById('bookingSlotGrid');
  slotGrid.innerHTML = SLOTS.map(s => `
    <button class="time-slot" onclick="selectSlot(this, '${s}')">${s}</button>
  `).join('');
  openModal('bookingModal');
}

function selectSlot(el, slot) {
  state.selectedSlot = slot;
  document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('active'));
  el.classList.add('active');
}

function confirmBooking() {
  if (!state.selectedSlot) { showToast('Please select a time slot first', 'info'); return; }
  const doc = state.bookingForDoctor;
  state.bookingConfirmedDoctor = doc;
  closeModal('bookingModal');
  showToast(`Appointment confirmed with ${doc.name} at ${state.selectedSlot}!`, 'success');
  setTimeout(() => showInvoice(new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), doc.name), 800);
}

// ==========================================================================
//  INVOICE MODAL
// ==========================================================================

function showInvoice(date, docName) {
  const id = 'INV-' + Math.floor(Math.random() * 9000 + 1000);
  document.getElementById('invoiceMetaGrid').innerHTML = `
    <div><span class="inv-lbl">Invoice No.</span><strong>${id}</strong></div>
    <div><span class="inv-lbl">Date</span><strong>${date}</strong></div>
    <div><span class="inv-lbl">Patient</span><strong>Alex Johnson</strong></div>
    <div><span class="inv-lbl">Doctor</span><strong>${docName}</strong></div>
  `;
  openModal('invoiceModal');
}

// ==========================================================================
//  REVIEWS MODAL
// ==========================================================================

function openReviews(doctorId) {
  const doc = DOCTORS.find(d => d.id === doctorId);
  state.selectedStarRating = 0;
  document.getElementById('reviewsDocName').textContent = doc.name;
  document.getElementById('reviewsDocRating').textContent = `★ ${doc.rating} · ${doc.reviews.toLocaleString()} consultations`;
  const reviews = SAMPLE_REVIEWS[doctorId] || [];
  document.getElementById('reviewsList').innerHTML = reviews.map(r => `
    <div class="review-item">
      <div class="review-user-row">
        <strong>${r.user}</strong>
        <span>${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</span>
      </div>
      <div class="review-text">${r.text}</div>
    </div>
  `).join('');
  updateStarDisplay(0);
  openModal('reviewsModal');
}

function setStarRating(val) {
  state.selectedStarRating = val;
  updateStarDisplay(val);
}

function updateStarDisplay(val) {
  document.querySelectorAll('#starSelector .star').forEach((s, i) => {
    s.classList.toggle('active', i < val);
  });
}

function submitReview() {
  if (state.selectedStarRating === 0) { showToast('Please select a star rating', 'info'); return; }
  const text = document.getElementById('reviewTextInput').value.trim();
  if (!text) { showToast('Please write a review', 'info'); return; }
  const newItem = document.createElement('div');
  newItem.className = 'review-item';
  newItem.innerHTML = `<div class="review-user-row"><strong>You</strong><span>${'★'.repeat(state.selectedStarRating)}${'☆'.repeat(5 - state.selectedStarRating)}</span></div><div class="review-text">${text}</div>`;
  document.getElementById('reviewsList').prepend(newItem);
  document.getElementById('reviewTextInput').value = '';
  updateStarDisplay(0);
  state.selectedStarRating = 0;
  showToast('Review submitted! Thank you.', 'success');
}

// ==========================================================================
//  VIDEO CALL ROOM
// ==========================================================================

function openVideoRoom() {
  openModal('videoModal');
  startCallTimer();
  requestCameraAccess();
}

function requestCameraAccess() {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then(stream => {
        const v = document.getElementById('patientVideo');
        v.srcObject = stream;
        state.camStream = stream;
      })
      .catch(() => { /* camera not available in this environment */ });
  }
}

function startCallTimer() {
  state.callActive = true;
  state.callSeconds = 0;
  clearInterval(state.callTimer);
  state.callTimer = setInterval(() => {
    state.callSeconds++;
    document.getElementById('callTimerDisplay').textContent = formatTime(state.callSeconds);
  }, 1000);
}

function endCall() {
  clearInterval(state.callTimer);
  state.callActive = false;
  if (state.camStream) { state.camStream.getTracks().forEach(t => t.stop()); state.camStream = null; }
  document.getElementById('patientVideo').srcObject = null;
  document.getElementById('callTimerDisplay').textContent = '00:00';
  closeModal('videoModal');
  showToast('Call ended. Prescription will be sent to your pharmacy.', 'success');
}

function toggleMic() {
  state.micOn = !state.micOn;
  const icon = document.getElementById('micIcon');
  icon.className = state.micOn ? 'fa-solid fa-microphone' : 'fa-solid fa-microphone-slash';
  document.getElementById('micBtn').style.background = state.micOn ? '' : 'rgba(244,63,94,0.3)';
}

function toggleCam() {
  state.camOn = !state.camOn;
  const icon = document.getElementById('camIcon');
  icon.className = state.camOn ? 'fa-solid fa-video' : 'fa-solid fa-video-slash';
  document.getElementById('camBtn').style.background = state.camOn ? '' : 'rgba(244,63,94,0.3)';
  if (state.camStream) {
    state.camStream.getVideoTracks().forEach(t => { t.enabled = state.camOn; });
  }
}

function toggleCallChat() {
  state.chatOpen = !state.chatOpen;
  document.getElementById('chatDrawer').classList.toggle('hidden', !state.chatOpen);
}

function handleCallChatEnter(e) {
  if (e.key === 'Enter') sendCallChat();
}

function sendCallChat() {
  const input = document.getElementById('callChatInput');
  const msg = input.value.trim();
  if (!msg) return;
  const container = document.getElementById('callChatMessages');
  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble patient';
  bubble.textContent = msg;
  container.appendChild(bubble);
  input.value = '';
  container.scrollTop = container.scrollHeight;
  setTimeout(() => {
    const docBubble = document.createElement('div');
    docBubble.className = 'chat-bubble doc';
    docBubble.innerHTML = '<strong>Dr. Chen:</strong> Understood. I\'ll note that in your chart.';
    container.appendChild(docBubble);
    container.scrollTop = container.scrollHeight;
  }, 1500);
}

// ==========================================================================
//  AI SYMPTOM CHECKER
// ==========================================================================

function openAIModal() {
  openModal('aiModal');
}

function initAIChat() {
  addAIMessage('bot', 'Hello! I\'m QuickCare AI Triage. Describe your symptoms and I\'ll recommend the best specialist for you.');
}

function sendAIMessage(quickSym) {
  const input = document.getElementById('aiChatInput');
  const msg = quickSym || input.value.trim();
  if (!msg) return;
  addAIMessage('user', msg);
  if (!quickSym) input.value = '';
  setTimeout(() => {
    const key = Object.keys(AI_RESPONSES).find(k => msg.toLowerCase().includes(k)) || 'default';
    const resp = AI_RESPONSES[key];
    const triageHtml = `
      <div class="ai-triage-card">
        <span class="triage-level-pill ${resp.level}">${resp.level === 'mild' ? 'MILD' : 'MODERATE'} CONCERN</span>
        <p style="font-size:12px;color:var(--text-secondary);margin-top:4px;">${resp.msg}</p>
        <div class="triage-match-box">
          <img src="${resp.doc.img}" alt="${resp.doc.name}" class="triage-doc-img" />
          <div style="flex:1;">
            <div style="font-size:12px;font-weight:700;color:white;">${resp.doc.name}</div>
            <div style="font-size:11px;color:var(--accent-cyan);">${resp.doc.specialty} · ${resp.doc.wait}</div>
          </div>
          <button class="btn-book-sm" style="font-size:10px;" onclick="closeModal('aiModal');openBooking(${resp.doc.id})">Book Now</button>
        </div>
      </div>
    `;
    addAIMessage('bot', 'Based on your symptoms, here\'s my triage assessment:', triageHtml);
  }, 900);
}

function addAIMessage(role, text, extra) {
  const container = document.getElementById('aiChatMessages');
  const row = document.createElement('div');
  row.className = `ai-bubble-row ${role}`;
  const avatar = document.createElement('div');
  avatar.className = 'ai-mini-avatar';
  avatar.innerHTML = role === 'bot' ? '<i class="fa-solid fa-wand-magic-sparkles"></i>' : 'You';
  const bubble = document.createElement('div');
  bubble.className = 'ai-bubble';
  bubble.innerHTML = text + (extra || '');
  row.appendChild(avatar);
  row.appendChild(bubble);
  container.appendChild(row);
  container.scrollTop = container.scrollHeight;
}

// ==========================================================================
//  PHARMACY MODAL
// ==========================================================================

function openPharmacyModal() {
  openModal('pharmacyModal');
}

// ==========================================================================
//  DOCTOR PORTAL
// ==========================================================================

function selectPatient(el, name, complaint, allergy) {
  document.querySelectorAll('.queue-item').forEach(q => q.classList.remove('active-queue'));
  el.classList.add('active-queue');
  state.currentPatientAllergy = allergy;
  document.getElementById('currentPatientLabel').innerHTML = `Current Patient: <strong>${name}</strong> — ${complaint}`;
  const banner = document.getElementById('allergyBanner');
  if (allergy !== 'none') {
    banner.style.display = 'flex';
    banner.querySelector('strong').textContent = `ALLERGY ALERT — ${allergy.charAt(0).toUpperCase() + allergy.slice(1)}`;
    banner.querySelector('small').textContent = `Patient has documented allergy. Avoid all related drug classes.`;
  } else {
    banner.style.display = 'none';
  }
  document.getElementById('contraindicationBanner').classList.add('hidden');
  clearRxForm();
  showToast(`Switched to patient: ${name}`, 'info');
}

function switchDocTab(tab) {
  state.docTab = tab;
  document.querySelectorAll('.doc-tab-btn').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
  const btn = document.getElementById('docTab-' + tab);
  btn.classList.add('active');
  btn.setAttribute('aria-selected', 'true');
  document.getElementById('docContent-rx').style.display = tab === 'rx' ? 'block' : 'none';
  document.getElementById('docContent-calendar').style.display = tab === 'calendar' ? 'block' : 'none';
}

function checkContraindication() {
  const allergy = state.currentPatientAllergy;
  if (allergy === 'none') return;
  const med1 = (document.getElementById('rxMed1').value || '').toLowerCase();
  const med2 = (document.getElementById('rxMed2').value || '').toLowerCase();
  const med3 = (document.getElementById('rxMed3').value || '').toLowerCase();
  const allMeds = [med1, med2, med3];
  const contraFound = allMeds.find(m => m && PENICILLIN_DRUGS.some(d => m.includes(d)));
  const banner = document.getElementById('contraindicationBanner');
  if (contraFound) {
    banner.classList.remove('hidden');
    document.getElementById('contraText').textContent = `"${contraFound.charAt(0).toUpperCase() + contraFound.slice(1)}" is a ${allergy}-class drug — CONTRAINDICATED for this patient.`;
  } else {
    banner.classList.add('hidden');
  }
}

function applyPreset(name) {
  const preset = PRESETS[name];
  if (!preset) return;
  document.getElementById('rxDiagnosis').value = preset.diagnosis;
  preset.meds.forEach((m, i) => {
    const idx = i + 1;
    if (document.getElementById(`rxMed${idx}`)) {
      document.getElementById(`rxMed${idx}`).value = m[0];
      document.getElementById(`rxDose${idx}`).value = m[1];
      document.getElementById(`rxFreq${idx}`).value = m[2];
    }
  });
  checkContraindication();
  showToast(`Preset "${name}" applied`, 'success');
}

function clearRxForm() {
  document.getElementById('rxDiagnosis').value = '';
  document.getElementById('rxNotes').value = '';
  ['1', '2', '3'].forEach(i => {
    document.getElementById('rxMed' + i).value = '';
    document.getElementById('rxDose' + i).value = '';
    document.getElementById('rxFreq' + i).value = '';
  });
  document.getElementById('rxPreviewCard').style.display = 'none';
  document.getElementById('contraindicationBanner').classList.add('hidden');
}

function generateRxPreview() {
  const diag = document.getElementById('rxDiagnosis').value.trim();
  if (!diag) { showToast('Please enter a diagnosis', 'info'); return; }
  const now = new Date();
  document.getElementById('rxPadDate').textContent = now.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  document.getElementById('rxPadId').textContent = 'Rx #QC-' + Math.floor(Math.random() * 90000 + 10000);
  const patient = document.getElementById('rxPatientName').value;
  const meds = [1, 2, 3].map(i => ({
    drug: document.getElementById('rxMed' + i).value,
    dose: document.getElementById('rxDose' + i).value,
    freq: document.getElementById('rxFreq' + i).value,
  })).filter(m => m.drug);
  const notes = document.getElementById('rxNotes').value;
  let body = `<div style="margin-bottom:14px;"><p style="font-size:12px;color:var(--text-muted);">Patient</p><p style="font-size:14px;font-weight:700;color:white;">${patient}</p><p style="font-size:12px;color:var(--accent-cyan);">Diagnosis: ${diag}</p></div>`;
  body += `<div style="border-top:1px dashed #334155;margin:12px 0;"></div>`;
  body += `<p style="font-size:13px;font-weight:700;color:white;margin-bottom:10px;">Rx</p>`;
  meds.forEach((m, i) => {
    body += `<div style="margin-bottom:10px;padding:10px;background:rgba(255,255,255,0.03);border-radius:6px;"><p style="font-size:14px;font-weight:700;color:var(--accent-cyan);">${i + 1}. ${m.drug}</p><p style="font-size:12px;color:var(--text-secondary);">${m.dose} — ${m.freq}</p></div>`;
  });
  if (notes) body += `<div style="margin-top:12px;padding:10px;background:rgba(6,182,212,0.05);border-left:2px solid var(--accent-cyan);border-radius:4px;"><p style="font-size:11px;color:var(--text-muted);">Clinical Notes</p><p style="font-size:12px;color:var(--text-secondary);">${notes}</p></div>`;
  document.getElementById('rxPadBody').innerHTML = body;
  document.getElementById('rxPreviewCard').style.display = 'block';
  document.getElementById('rxPreviewCard').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  showToast('Prescription generated!', 'success');
}

function toggleVoiceDictation() {
  state.voiceRecording = !state.voiceRecording;
  const btn = document.getElementById('voiceBtn');
  if (state.voiceRecording) {
    btn.classList.add('recording');
    btn.innerHTML = '<i class="fa-solid fa-circle-stop"></i> Recording...';
    let counter = 0;
    const phrases = ['Paracetamol 500mg three times daily', 'Amoxicillin 500mg twice daily for 7 days', 'Ibuprofen 400mg as needed'];
    state.voiceInterval = setInterval(() => {
      counter++;
      if (counter === 3) {
        const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
        const notes = document.getElementById('rxNotes');
        notes.value = (notes.value ? notes.value + '\n' : '') + randomPhrase;
        stopVoiceDictation();
        showToast('Voice note transcribed!', 'success');
      }
    }, 1000);
  } else {
    stopVoiceDictation();
  }
}

function stopVoiceDictation() {
  state.voiceRecording = false;
  clearInterval(state.voiceInterval);
  const btn = document.getElementById('voiceBtn');
  btn.classList.remove('recording');
  btn.innerHTML = '<i class="fa-solid fa-microphone"></i> Dictate';
}

function renderDocCalendar() {
  const grid = document.getElementById('docCalendarGrid');
  const days = Object.keys(DOCTOR_CALENDAR);
  const today = 'Mon';
  grid.innerHTML = days.map(day => `
    <div class="calendar-day-col ${day === today ? 'today-col' : ''}">
      <div class="day-head ${day === today ? 'today' : ''}">
        <strong>${day}</strong>
        <span>Sep ${days.indexOf(day) + 1}</span>
      </div>
      <div class="day-slots">
        ${DOCTOR_CALENDAR[day].map(slot => `
          <div class="slot-item ${slot.type}" onclick="handleSlotClick('${day}','${slot.time}','${slot.type}')">
            ${slot.time} ${slot.name ? '— ' + slot.name : slot.type === 'free' ? '(Available)' : ''}
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

function handleSlotClick(day, time, type) {
  if (type === 'free') {
    showToast(`Slot ${time} on ${day} marked as blocked`, 'info');
  } else if (type === 'live') {
    openVideoRoom();
  } else {
    showToast(`Appointment at ${time} on ${day} loaded`, 'info');
  }
}

function setTodayDate() {
  const d = new Date();
  const el = document.getElementById('rxDate');
  if (el) el.value = d.toISOString().split('T')[0];
}

// ==========================================================================
//  IT PM — SUB-TABS
// ==========================================================================

function switchPMTab(tab, el) {
  state.pmTab = tab;
  document.querySelectorAll('.pm-tab-content').forEach(c => c.classList.remove('active'));
  document.querySelectorAll('.pm-subtab').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
  document.getElementById('pmTab-' + tab).classList.add('active');
  el.classList.add('active');
  el.setAttribute('aria-selected', 'true');
}

// ==========================================================================
//  KANBAN BOARD
// ==========================================================================

const COL_CONFIG = [
  { id: 'todo', label: 'To Do', color: '#64748b' },
  { id: 'inprogress', label: 'In Progress', color: '#f59e0b' },
  { id: 'review', label: 'In Review', color: '#6366f1' },
  { id: 'done', label: 'Done', color: '#10b981' },
];

function renderKanban() {
  const board = document.getElementById('kanbanBoard');
  board.innerHTML = COL_CONFIG.map(col => {
    const cards = state.kanbanData.filter(c => c.col === col.id);
    return `
      <div class="kanban-column" id="col-${col.id}" ondragover="event.preventDefault()" ondrop="dropCard(event,'${col.id}')">
        <div class="column-header">
          <span class="col-title" style="color:${col.color}">${col.label}</span>
          <span class="col-count">${cards.length}</span>
        </div>
        <div class="column-cards" id="cards-${col.id}">
          ${cards.map(c => renderKanbanCard(c)).join('')}
        </div>
      </div>
    `;
  }).join('');
}

function renderKanbanCard(c) {
  return `
    <div class="kanban-card" draggable="true" id="kcard-${c.id}"
      ondragstart="dragStart(event,'${c.id}','${c.col}')"
      ondragend="dragEnd(event)">
      <div class="card-top-row">
        <span class="card-id">${c.id}</span>
        <span class="card-pts">${c.pts} pts</span>
      </div>
      <div class="card-title">${c.title}</div>
      <div class="card-bottom-row">
        <span class="card-epic">${c.epic}</span>
        <div class="card-avatar">${c.assignee}</div>
      </div>
    </div>
  `;
}

function dragStart(event, cardId, colId) {
  state.dragCard = cardId;
  state.dragCol = colId;
  event.dataTransfer.effectAllowed = 'move';
  setTimeout(() => { const el = document.getElementById('kcard-' + cardId); if (el) el.style.opacity = '0.4'; }, 0);
}

function dragEnd(event) {
  if (state.dragCard) {
    const el = document.getElementById('kcard-' + state.dragCard);
    if (el) el.style.opacity = '1';
  }
}

function dropCard(event, targetCol) {
  event.preventDefault();
  if (!state.dragCard || state.dragCol === targetCol) return;
  const card = state.kanbanData.find(c => c.id === state.dragCard);
  if (card) {
    card.col = targetCol;
    renderKanban();
    showToast(`${card.id} moved to ${COL_CONFIG.find(c => c.id === targetCol).label}`, 'info');
  }
  state.dragCard = null;
  state.dragCol = null;
}

function exportBacklogCSV() {
  const headers = ['ID', 'Title', 'Epic', 'Story Points', 'Column', 'Assignee'];
  const rows = state.kanbanData.map(c => [c.id, `"${c.title}"`, c.epic, c.pts, c.col, c.assignee]);
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'QuickCare_Backlog.csv';
  a.click();
  URL.revokeObjectURL(url);
  showToast('Backlog exported as QuickCare_Backlog.csv', 'success');
}

// ==========================================================================
//  VELOCITY CHART
// ==========================================================================

function renderVelocityChart() {
  const container = document.getElementById('velocityChart');
  if (!container) return;
  const max = 35;
  container.innerHTML = SPRINT_DATA.map((s, i) => `
    <div class="v-bar-group ${i === state.sprintSelected - 1 ? 'active-sprint-bar' : ''}">
      <div class="v-bars">
        <div class="v-bar planned" style="height:${(s.planned / max) * 180}px;">${s.planned}</div>
        <div class="v-bar actual" style="height:${(s.actual / max) * 180}px;">${s.actual}</div>
      </div>
      <span class="v-label">${s.label}</span>
    </div>
  `).join('');
}

// ==========================================================================
//  BURNDOWN CHART (SVG)
// ==========================================================================

function renderBurndown(sprintNum) {
  const svg = document.getElementById('burndownSvg');
  if (!svg) return;
  const sprints = { 1: { pts: 29, days: 10 }, 2: { pts: 31, days: 10 }, 3: { pts: 30, days: 10 }, 4: { pts: 32, days: 10 } };
  const data = sprints[sprintNum || 4];
  const W = 300, H = 160, pad = 20;
  const ideal = Array.from({ length: 11 }, (_, i) => ({ x: pad + (i / 10) * (W - 2 * pad), y: pad + (1 - i / 10) * (H - 2 * pad) }));
  // Simulate actual burndown (slightly better than ideal)
  const actual = [data.pts, data.pts - 5, data.pts - 11, data.pts - 14, data.pts - 18, data.pts - 22, data.pts - 26, data.pts - 28, data.pts - 30, data.pts - 31, 0].map((v, i) => ({
    x: pad + (i / 10) * (W - 2 * pad),
    y: pad + (Math.max(0, v) / data.pts) * (H - 2 * pad),
  }));
  const idealPath = ideal.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const actualPath = actual.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  svg.innerHTML = `
    <line x1="${pad}" y1="${pad}" x2="${pad}" y2="${H - pad}" stroke="#334155" stroke-width="1"/>
    <line x1="${pad}" y1="${H - pad}" x2="${W - pad}" y2="${H - pad}" stroke="#334155" stroke-width="1"/>
    <path d="${idealPath}" stroke="#64748b" stroke-width="1.5" fill="none" stroke-dasharray="5,4"/>
    <path d="${actualPath}" stroke="#00f2fe" stroke-width="2.5" fill="none"/>
    ${actual.map(p => `<circle cx="${p.x}" cy="${p.y}" r="3" fill="#00f2fe"/>`).join('')}
  `;
}

// ==========================================================================
//  SPRINT SIMULATION
// ==========================================================================

function selectSprint(num, el) {
  state.sprintSelected = num;
  document.querySelectorAll('.sprint-chips .s-chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  renderBurndown(num);
  renderVelocityChart();
}

function updateSim(inputEl, valId, suffix, init) {
  if (!init) {
    document.getElementById(valId).textContent = inputEl.value + suffix;
  }
  const cap = parseInt(document.getElementById('capSlider').value);
  const scope = parseInt(document.getElementById('scopeSlider').value);
  const blocks = parseInt(document.getElementById('blockSlider').value);
  const basePoints = 32;
  const effectivePts = Math.floor((basePoints * (cap / 100)) - scope - (blocks * 2));
  const banner = document.getElementById('simForecastBanner');
  const title = document.getElementById('simForecastTitle');
  const msg = document.getElementById('simForecastMsg');
  const pts = document.getElementById('simForecastPts');
  const icon = document.getElementById('simForecastIcon');
  pts.textContent = Math.max(0, effectivePts) + ' pts';
  if (effectivePts >= 30) {
    banner.className = 'sim-forecast-banner success';
    title.textContent = 'On Track to Complete';
    msg.textContent = `All ${effectivePts} sprint points forecasted to be delivered by end of sprint.`;
    icon.className = 'fa-solid fa-circle-check';
  } else if (effectivePts >= 20) {
    banner.className = 'sim-forecast-banner warning';
    title.textContent = 'At Risk — Scope Review Needed';
    msg.textContent = `Only ${effectivePts} of 32 points forecast to complete. Consider de-scoping lower priority stories.`;
    icon.className = 'fa-solid fa-triangle-exclamation';
  } else {
    banner.className = 'sim-forecast-banner danger';
    title.textContent = 'Sprint Failure Likely';
    msg.textContent = `Only ${Math.max(0, effectivePts)} points forecast. Escalate blockers and reduce scope immediately.`;
    icon.className = 'fa-solid fa-circle-xmark';
  }
}

// ==========================================================================
//  PLANNING POKER
// ==========================================================================

const FIBO = [1, 2, 3, 5, 8, 13, 21];
const TEAM_ROLES = ['Lead Dev', 'FE Eng', 'QA Lead', 'UX Design'];

function renderPokerDeck() {
  const deck = document.getElementById('pokerDeck');
  deck.innerHTML = [...FIBO, '?'].map(v => `
    <div class="p-card ${state.pokerSelectedCard == v ? 'active-card' : ''}" onclick="selectPokerCard(${JSON.stringify(v)})">${v}</div>
  `).join('');
}

function renderPokerTeamVotes() {
  const votes = document.getElementById('pokerTeamVotes');
  const revealed = state.pokerRevealed;
  const myVote = state.pokerSelectedCard;
  votes.innerHTML = [
    { role: 'You (PM)', vote: myVote, isUser: true },
    ...TEAM_ROLES.map(r => ({ role: r, vote: state.pokerVotes[r] || null, isUser: false })),
  ].map(v => `
    <div class="team-vote-box ${v.isUser ? 'user-vote-box' : ''}">
      <span class="vote-role">${v.role}</span>
      <span class="vote-num ${v.isUser ? 'user-vote' : ''}">
        ${revealed ? (v.vote !== null ? v.vote : '?') : (v.vote !== null ? 'Voted' : '--')}
      </span>
    </div>
  `).join('');
}

function selectPokerCard(val) {
  state.pokerSelectedCard = val;
  // Simulate team members voting
  TEAM_ROLES.forEach(r => {
    if (!state.pokerVotes[r]) {
      const weights = [1, 2, 3, 5, 8, 13, 21];
      const pick = weights[Math.floor(Math.random() * weights.length)];
      state.pokerVotes[r] = pick;
    }
  });
  renderPokerDeck();
  renderPokerTeamVotes();
  document.getElementById('pokerStatusTag').textContent = 'You Voted';
  showToast(`You selected ${val} story points`, 'info');
}

function revealPokerVotes() {
  if (state.pokerSelectedCard === null) { showToast('Select a card first', 'info'); return; }
  state.pokerRevealed = true;
  renderPokerTeamVotes();
  document.getElementById('pokerStatusTag').textContent = 'Votes Revealed';
  // Check consensus
  const allVotes = [state.pokerSelectedCard, ...Object.values(state.pokerVotes)].filter(v => v !== null && v !== '?');
  const unique = [...new Set(allVotes)];
  const banner = document.getElementById('pokerConsensusBanner');
  if (unique.length === 1) {
    banner.classList.remove('hidden');
    document.getElementById('pokerConsensusVal').textContent = unique[0];
    showToast(`Consensus! Story estimated at ${unique[0]} points`, 'success');
  } else {
    const avg = Math.round(allVotes.reduce((a, b) => a + Number(b), 0) / allVotes.length);
    banner.classList.remove('hidden');
    banner.querySelector('i').style.color = 'var(--accent-amber)';
    document.getElementById('pokerConsensusMsg').innerHTML = `No consensus. Average: <strong id="pokerConsensusVal">${avg}</strong> pts. Discuss and re-vote.`;
    showToast(`No consensus — average is ${avg} pts. Discuss!`, 'info');
  }
}

function resetPoker() {
  state.pokerSelectedCard = null;
  state.pokerRevealed = false;
  state.pokerVotes = {};
  state.currentPokerStory = (state.currentPokerStory + 1) % POKER_STORIES.length;
  const story = POKER_STORIES[state.currentPokerStory];
  document.getElementById('pokerStoryTitle').textContent = story.title;
  document.getElementById('pokerStoryDesc').textContent = story.desc;
  document.querySelector('.poker-badge').textContent = story.id;
  document.querySelector('.poker-story-meta span:last-child').textContent = 'Epic: ' + story.epic;
  document.getElementById('pokerStatusTag').textContent = 'Voting Open';
  document.getElementById('pokerConsensusBanner').classList.add('hidden');
  renderPokerDeck();
  renderPokerTeamVotes();
}

// ==========================================================================
//  RETROSPECTIVE BOARD
// ==========================================================================

const RETRO_COLS = [
  { key: 'well', label: 'Went Well', cls: 'well-col', icon: 'fa-face-smile', color: 'var(--accent-emerald)' },
  { key: 'slow', label: 'Needs Improvement', cls: 'slow-col', icon: 'fa-face-frown', color: 'var(--accent-rose)' },
  { key: 'action', label: 'Action Items', cls: 'action-col', icon: 'fa-bolt', color: 'var(--accent-indigo)' },
];

function renderRetroBoard() {
  const board = document.getElementById('retroBoard');
  board.innerHTML = RETRO_COLS.map(col => `
    <div class="retro-col ${col.cls}">
      <div class="retro-col-head">
        <span><i class="fa-solid ${col.icon}" style="color:${col.color};margin-right:6px;"></i>${col.label}</span>
        <span class="retro-count">${state.retroData[col.key].length}</span>
      </div>
      <div class="retro-cards">
        ${state.retroData[col.key].map((card, i) => `
          <div class="retro-card">
            <p>${card.text}</p>
            <div class="retro-card-footer">
              <span class="retro-author">${card.author}</span>
              <button class="btn-upvote" onclick="upvoteRetro('${col.key}',${i})">
                <i class="fa-solid fa-thumbs-up"></i> ${card.votes}
              </button>
            </div>
          </div>
        `).join('')}
      </div>
      <div class="add-retro-input-row">
        <input type="text" id="retro-input-${col.key}" placeholder="Add note..." onkeypress="handleRetroEnter(event,'${col.key}')" />
        <button class="btn-sm btn-success" onclick="addRetroCard('${col.key}')" style="padding:6px 10px;">+</button>
      </div>
    </div>
  `).join('');
}

function upvoteRetro(col, idx) {
  state.retroData[col][idx].votes++;
  renderRetroBoard();
}

function handleRetroEnter(e, col) {
  if (e.key === 'Enter') addRetroCard(col);
}

function addRetroCard(col) {
  const input = document.getElementById('retro-input-' + col);
  const text = input.value.trim();
  if (!text) return;
  state.retroData[col].push({ text, author: 'You', votes: 0 });
  renderRetroBoard();
  showToast('Retro note added!', 'success');
}

// ==========================================================================
//  BUDGET TRACKER
// ==========================================================================

function renderBudgetBars() {
  const container = document.getElementById('budgetBars');
  container.innerHTML = BUDGET_ITEMS.map(item => {
    const pct = Math.min(100, Math.round((item.spend / item.budget) * 100));
    return `
      <div class="b-prog-item">
        <div class="b-prog-labels">
          <span>${item.label}</span>
          <span>$${item.spend.toLocaleString()} / $${item.budget.toLocaleString()} (${pct}%)</span>
        </div>
        <div class="b-prog-track">
          <div class="b-prog-fill ${item.color}" style="width:0%" data-target="${pct}%"></div>
        </div>
      </div>
    `;
  }).join('');
  // Animate bars
  requestAnimationFrame(() => {
    document.querySelectorAll('.b-prog-fill').forEach(el => {
      el.style.width = el.dataset.target;
    });
  });
}

// ==========================================================================
//  RAID / RACI
// ==========================================================================

function updateRiskCalc() {
  const p = parseInt(document.getElementById('probSlider').value);
  const i = parseInt(document.getElementById('impactSlider').value);
  document.getElementById('probVal').textContent = p;
  document.getElementById('impactVal').textContent = i;
  const score = p * i;
  document.getElementById('riskScoreNum').textContent = score;
  const badge = document.getElementById('riskScoreBadge');
  if (score >= 15) { badge.className = 'score-badge high'; badge.textContent = 'HIGH'; }
  else if (score >= 8) { badge.className = 'score-badge med'; badge.textContent = 'MEDIUM'; }
  else { badge.className = 'score-badge low'; badge.textContent = 'LOW'; }
}

function renderRAIDTable() {
  const body = document.getElementById('raidTableBody');
  body.innerHTML = RAID_ITEMS.map(r => `
    <tr>
      <td><strong>${r.id}</strong></td>
      <td><span class="badge ${r.badge}">${r.type}</span></td>
      <td style="max-width:220px;">${r.desc}</td>
      <td>${r.p}&times;${r.i} = <strong>${r.p * r.i}</strong></td>
      <td><span class="risk-pill ${r.level}">${r.level.toUpperCase()}</span></td>
      <td style="font-size:12px;color:var(--text-secondary);">${r.mitigation}</td>
      <td><span class="badge-status ${r.status === 'Resolved' ? 'resolved' : ''}">${r.status}</span></td>
    </tr>
  `).join('');
}

function renderRACITable() {
  const body = document.getElementById('raciTableBody');
  const tag = c => {
    const cls = c === 'R' ? 'r' : c === 'A' ? 'a' : c === 'C' ? 'c' : c === 'I' ? 'i' : 'ar';
    return `<span class="raci-tag ${cls}">${c}</span>`;
  };
  body.innerHTML = RACI_ROWS.map(r => `
    <tr>
      <td><strong style="font-size:12px;">${r.task}</strong></td>
      <td>${tag(r.pm)}</td>
      <td>${tag(r.dev)}</td>
      <td>${tag(r.qa)}</td>
      <td>${tag(r.ux)}</td>
      <td>${tag(r.po)}</td>
    </tr>
  `).join('');
}

// ==========================================================================
//  STANDUP RUNNER
// ==========================================================================

function renderScrumMembers() {
  const strip = document.getElementById('scrumMembersStrip');
  strip.innerHTML = SCRUM_MEMBERS.map((m, i) => `
    <div class="member-chip ${state.standupDone.has(i) ? 'done' : ''} ${state.standupMemberIndex === i ? 'active' : ''}" id="member-chip-${i}" onclick="jumpToMember(${i})">
      <i class="fa-solid ${m.icon}"></i> ${m.name}
      ${state.standupDone.has(i) ? '<i class="fa-solid fa-check" style="color:var(--accent-emerald);"></i>' : ''}
    </div>
  `).join('');
}

function startStandup() {
  if (state.standupActive) return;
  state.standupActive = true;
  state.standupTotalSeconds = 0;
  document.getElementById('standupStartBtn').disabled = true;
  document.getElementById('standupNextBtn').disabled = false;
  document.getElementById('standupStatus').textContent = 'Meeting In Progress';
  // Total timer
  state.totalStandupTimer = setInterval(() => {
    state.standupTotalSeconds++;
    document.getElementById('totalClock').textContent = formatTime(state.standupTotalSeconds);
  }, 1000);
  nextSpeaker();
}

function nextSpeaker() {
  state.standupMemberIndex++;
  if (state.standupMemberIndex >= SCRUM_MEMBERS.length) {
    endStandup(); return;
  }
  if (state.standupMemberIndex > 0) {
    state.standupDone.add(state.standupMemberIndex - 1);
  }
  renderScrumMembers();
  const member = SCRUM_MEMBERS[state.standupMemberIndex];
  document.getElementById('spkAvatar').innerHTML = `<i class="fa-solid ${member.icon}"></i>`;
  document.getElementById('spkName').textContent = member.name;
  document.getElementById('spkRole').textContent = member.role;
  document.getElementById('speakingBadge').classList.remove('hidden');
  document.getElementById('q1Input').value = '';
  document.getElementById('q2Input').value = '';
  document.getElementById('q3Input').value = '';
  // Per-speaker timer
  clearInterval(state.standupTimer);
  state.standupSpeakerSeconds = 120;
  document.getElementById('speakerClock').textContent = formatTime(state.standupSpeakerSeconds);
  state.standupTimer = setInterval(() => {
    state.standupSpeakerSeconds--;
    document.getElementById('speakerClock').textContent = formatTime(Math.max(0, state.standupSpeakerSeconds));
    if (state.standupSpeakerSeconds <= 0) { clearInterval(state.standupTimer); showToast(`Time up for ${member.name}!`, 'info'); }
  }, 1000);
}

function endStandup() {
  state.standupActive = false;
  clearInterval(state.standupTimer);
  clearInterval(state.totalStandupTimer);
  state.standupDone.add(state.standupMemberIndex);
  document.getElementById('standupStatus').textContent = `Completed in ${formatTime(state.standupTotalSeconds)}`;
  document.getElementById('speakingBadge').classList.add('hidden');
  document.getElementById('standupNextBtn').disabled = true;
  renderScrumMembers();
  showToast('Standup complete! All blockers logged.', 'success');
}

function resetStandup() {
  clearInterval(state.standupTimer);
  clearInterval(state.totalStandupTimer);
  state.standupActive = false;
  state.standupMemberIndex = -1;
  state.standupDone = new Set();
  state.standupTotalSeconds = 0;
  state.standupSpeakerSeconds = 120;
  document.getElementById('speakerClock').textContent = '02:00';
  document.getElementById('totalClock').textContent = '00:00';
  document.getElementById('standupStatus').textContent = 'Not Started';
  document.getElementById('standupStartBtn').disabled = false;
  document.getElementById('standupNextBtn').disabled = true;
  document.getElementById('speakingBadge').classList.add('hidden');
  document.getElementById('spkName').textContent = 'Select a team member';
  document.getElementById('spkRole').textContent = 'Click Start to begin the standup';
  document.getElementById('q1Input').value = '';
  document.getElementById('q2Input').value = '';
  document.getElementById('q3Input').value = '';
  renderScrumMembers();
}

function jumpToMember(idx) {
  if (!state.standupActive) return;
  state.standupMemberIndex = idx - 1;
  nextSpeaker();
}

function saveStandupNote() {
  const q1 = document.getElementById('q1Input').value.trim();
  const q2 = document.getElementById('q2Input').value.trim();
  const q3 = document.getElementById('q3Input').value.trim();
  const member = state.standupMemberIndex >= 0 ? SCRUM_MEMBERS[state.standupMemberIndex] : null;
  const name = member ? member.name : 'Unknown';
  const log = document.getElementById('standupLogList');
  if (log.querySelector('div[style]')) log.innerHTML = '';
  if (q2) {
    log.innerHTML += `<div class="standup-item-row action"><span class="item-tag action">TODAY</span><span class="item-text">${q2}</span><span class="item-owner">${name}</span></div>`;
  }
  if (q3) {
    log.innerHTML += `<div class="standup-item-row blocker"><span class="item-tag blocker">BLOCKER</span><span class="item-text">${q3}</span><span class="item-owner">${name}</span></div>`;
  }
  showToast('Standup note saved!', 'success');
}

function escalateToRAID() {
  const blocker = document.getElementById('q3Input').value.trim();
  if (!blocker) { showToast('Enter a blocker description first', 'info'); return; }
  const newRisk = { id: 'I-0' + (RAID_ITEMS.length + 1), type: 'Issue', desc: blocker, p: 4, i: 3, level: 'med', badge: 'scope', mitigation: 'Assigned to Scrum Master for resolution', status: 'Open' };
  RAID_ITEMS.push(newRisk);
  renderRAIDTable();
  showToast('Blocker escalated to RAID log!', 'success');
  document.getElementById('q3Input').value = '';
}

// ==========================================================================
//  THEME TOGGLE
// ==========================================================================

function toggleTheme() {
  state.themeLight = !state.themeLight;
  document.body.classList.toggle('light-theme', state.themeLight);
  const icon = document.getElementById('themeIcon');
  icon.className = state.themeLight ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
}

// ==========================================================================
//  AUDIO TOGGLE
// ==========================================================================

function toggleAudio() {
  state.audioOn = !state.audioOn;
  const icon = document.getElementById('audioIcon');
  icon.className = state.audioOn ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark';
}

// ==========================================================================
//  TOAST NOTIFICATIONS
// ==========================================================================

function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const iconMap = { success: 'fa-circle-check', info: 'fa-circle-info', warning: 'fa-triangle-exclamation' };
  toast.innerHTML = `<i class="fa-solid ${iconMap[type] || 'fa-circle-info'}" style="color:${type === 'success' ? 'var(--accent-emerald)' : 'var(--accent-cyan)'}"></i>${message}`;
  container.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(100%)'; toast.style.transition = 'all 0.3s ease'; setTimeout(() => toast.remove(), 300); }, 3500);
}

// ==========================================================================
//  MODAL HELPERS
// ==========================================================================

function openModal(id) {
  document.getElementById(id).classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  document.getElementById(id).classList.add('hidden');
  document.body.style.overflow = '';
}

// Close modals on overlay click
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.add('hidden');
    document.body.style.overflow = '';
    if (e.target.id === 'videoModal') endCall();
  }
});

// Keyboard shortcut: Escape closes modals
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay:not(.hidden)').forEach(m => {
      m.classList.add('hidden');
      document.body.style.overflow = '';
      if (m.id === 'videoModal') endCall();
    });
  }
});

// ==========================================================================
//  UTILITIES
// ==========================================================================

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const s = (totalSeconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

/* ==========================================================================
   QuickCare Telehealth App & IT PM Suite Logic (Upgraded with Step 1)
   ========================================================================== */

// 1. Doctor Database
const doctors = [
  {
    id: 1,
    name: "Dr. Marcus Vance, MD",
    specialty: "General Medicine",
    rating: "4.9 (320 reviews)",
    experience: "12 Yrs Exp",
    fee: "$45.00",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80"
  },
  {
    id: 2,
    name: "Dr. Emily Zhang, MD",
    specialty: "Dermatology",
    rating: "4.8 (210 reviews)",
    experience: "8 Yrs Exp",
    fee: "$55.00",
    image: "https://images.unsplash.com/photo-1594824813583-4a112c2196a6?w=200&auto=format&fit=crop&q=80"
  },
  {
    id: 3,
    name: "Dr. Rajesh Patel, MD",
    specialty: "Pediatrics",
    rating: "4.9 (440 reviews)",
    experience: "15 Yrs Exp",
    fee: "$50.00",
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&auto=format&fit=crop&q=80"
  },
  {
    id: 4,
    name: "Dr. Olivia Bennett, MD",
    specialty: "Cardiology",
    rating: "4.9 (180 reviews)",
    experience: "14 Yrs Exp",
    fee: "$65.00",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&auto=format&fit=crop&q=80"
  }
];

// Doctor Verified Reviews Data
const doctorReviews = {
  1: [
    { name: "Jessica T.", stars: 5, date: "2 days ago", comment: "Dr. Vance was extremely thorough and diagnosed my throat infection quickly. The prescription arrived instantly on my phone." },
    { name: "David K.", stars: 5, date: "1 week ago", comment: "Saved me a 4-hour trip to urgent care! Video quality was crystal clear and no lag." },
    { name: "Amanda L.", stars: 5, date: "2 weeks ago", comment: "Great bedside manner. Very polite, helpful, and knowledgeable." }
  ],
  2: [
    { name: "Robert M.", stars: 5, date: "3 days ago", comment: "Dr. Zhang identified my skin allergy trigger immediately. Prescribed a topical lotion that worked in 24 hours!" }
  ],
  3: [
    { name: "Priya S.", stars: 5, date: "Yesterday", comment: "Wonderful with my 4-year old son. Calmed our fever worries and gave clear dosing advice." }
  ],
  4: [
    { name: "Thomas B.", stars: 5, date: "5 days ago", comment: "Dr. Bennett reviewed my ECG results and explained the heart rate readings very clearly." }
  ]
};

// 2. Initial Kanban Agile Stories
const initialKanbanCards = [
  { id: "US-601", title: "Automated SMS/Push Consultation Reminders (15m before)", epic: "Notifications", pts: 2, status: "backlog", assignee: "MD" },
  { id: "TECH-401", title: "Memory Leak Optimization & WebRTC Bitrate Throttling", epic: "Infrastructure", pts: 5, status: "progress", assignee: "LA" },
  { id: "US-501", title: "Doctor Digital Prescription PDF Generator & Signature", epic: "Prescription", pts: 3, status: "qa", assignee: "QA" },
  { id: "US-101", title: "Patient Registration via Phone OTP Verification", epic: "Auth", pts: 3, status: "done", assignee: "MD" },
  { id: "US-201", title: "Doctor Specialty Filter & Directory Search API", epic: "Discovery", pts: 5, status: "done", assignee: "LA" },
  { id: "US-301", title: "1-on-1 End-to-End Encrypted Video Consultation Call", epic: "Telehealth", pts: 8, status: "done", assignee: "MD" },
  { id: "US-401", title: "Stripe Payment Gateway SDK & In-App Card Checkout", epic: "Payments", pts: 5, status: "done", assignee: "LA" }
];

let kanbanCards = [...initialKanbanCards];
let selectedDoctor = doctors[0];
let selectedReviewStars = 5;
let callTimerInterval = null;
let callSeconds = 0;
let isMicMuted = false;
let isCamOff = false;
let isRealCamActive = false;
let realCamStream = null;
let soundEnabled = true;

// ==========================================================================
// Web Audio API Synthesizer (Zero External Dependencies)
// ==========================================================================

function playChime(type) {
  if (!soundEnabled) return;
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (type === "success") {
      osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, audioCtx.currentTime + 0.1); // E5
      osc.frequency.exponentialRampToValueAtTime(783.99, audioCtx.currentTime + 0.2); // G5
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.5);
    } else if (type === "call") {
      osc.frequency.setValueAtTime(440, audioCtx.currentTime); // A4
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } else if (type === "click") {
      osc.frequency.setValueAtTime(600, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.08);
    }
  } catch (e) {
    console.log("Audio not allowed yet by user interaction");
  }
}

function toggleAudioFx() {
  soundEnabled = !soundEnabled;
  const btn = document.getElementById("audio-toggle-btn");
  btn.innerHTML = soundEnabled ? `<i class="fa-solid fa-volume-high"></i>` : `<i class="fa-solid fa-volume-xmark"></i>`;
  showToast(soundEnabled ? "Sound FX Enabled" : "Sound FX Muted", "info");
}

// Toast Popup Notification Engine
function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `<i class="fa-solid ${type === 'success' ? 'fa-circle-check' : 'fa-circle-info'}"></i> <span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100%)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ==========================================================================
// Initialization & View Switching
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
  renderDoctors("All");
  renderKanban();
  updateRiskScore();
});

function switchView(viewId) {
  document.querySelectorAll(".view-panel").forEach(panel => panel.classList.remove("active"));
  document.querySelectorAll(".nav-tab").forEach(tab => tab.classList.remove("active"));

  document.getElementById(viewId).classList.add("active");

  if (viewId === "patient-view") document.getElementById("tab-patient").classList.add("active");
  if (viewId === "doctor-view") document.getElementById("tab-doctor").classList.add("active");
  if (viewId === "pm-view") document.getElementById("tab-pm").classList.add("active");
  playChime("click");
}

function switchPatientSubTab(tab) {
  document.querySelectorAll(".p-nav-btn").forEach(btn => btn.classList.remove("active"));
  if (tab === "home") {
    document.getElementById("p-sub-home").classList.add("active");
    document.getElementById("patient-sub-home-panel").classList.remove("hidden");
    document.getElementById("patient-sub-history-panel").classList.add("hidden");
  } else {
    document.getElementById("p-sub-history").classList.add("active");
    document.getElementById("patient-sub-home-panel").classList.add("hidden");
    document.getElementById("patient-sub-history-panel").classList.remove("hidden");
  }
}

function switchPmTab(tabId) {
  document.querySelectorAll(".pm-tab-content").forEach(tab => tab.classList.remove("active"));
  document.querySelectorAll(".pm-subtab").forEach(btn => btn.classList.remove("active"));

  document.getElementById(tabId).classList.add("active");
  event.currentTarget.classList.add("active");
  playChime("click");
}

// ==========================================================================
// Patient View Logic (Search, Filters, Booking & Reviews)
// ==========================================================================

function filterSpecialty(specialty) {
  document.querySelectorAll(".specialty-chips .chip").forEach(chip => {
    chip.classList.toggle("active", chip.innerText.includes(specialty) || (specialty === "All" && chip.innerText === "All"));
  });
  renderDoctors(specialty);
}

function renderDoctors(filter) {
  const container = document.getElementById("doctor-list");
  const filtered = filter === "All" ? doctors : doctors.filter(d => d.specialty === filter);
  
  document.getElementById("doc-count").innerText = `${filtered.length} Available Today`;

  container.innerHTML = filtered.map(doc => `
    <div class="doc-card">
      <div class="doc-card-top">
        <img src="${doc.image}" alt="${doc.name}" class="doc-card-img">
        <div class="doc-meta">
          <h5>${doc.name}</h5>
          <span class="doc-specialty">${doc.specialty} • ${doc.experience}</span>
          <div class="doc-rating" onclick="openReviewsModal(${doc.id})" style="cursor: pointer;" title="View Verified Reviews">
            ⭐ ${doc.rating} <span style="font-size: 10px; color: #38bdf8; text-decoration: underline;">(Reviews)</span>
          </div>
        </div>
      </div>
      <div class="doc-card-bottom">
        <span class="doc-fee">${doc.fee} / 15-min call</span>
        <button class="btn-book-sm" onclick="openBookingModal(${doc.id})">Book Consult</button>
      </div>
    </div>
  `).join("");
}

// Real-Time Search Function
function searchDoctors(query) {
  const clean = query.toLowerCase().trim();
  const clearBtn = document.getElementById("search-clear-btn");
  if (clearBtn) clearBtn.classList.toggle("hidden", clean.length === 0);

  const container = document.getElementById("doctor-list");
  const filtered = doctors.filter(d => 
    d.name.toLowerCase().includes(clean) ||
    d.specialty.toLowerCase().includes(clean) ||
    (d.specialty === "General Medicine" && (clean.includes("fever") || clean.includes("flu") || clean.includes("cough") || clean.includes("cold"))) ||
    (d.specialty === "Dermatology" && (clean.includes("skin") || clean.includes("rash") || clean.includes("acne") || clean.includes("itch"))) ||
    (d.specialty === "Cardiology" && (clean.includes("heart") || clean.includes("bp") || clean.includes("chest") || clean.includes("cardio"))) ||
    (d.specialty === "Pediatrics" && (clean.includes("child") || clean.includes("baby") || clean.includes("kid") || clean.includes("infant")))
  );

  document.getElementById("doc-count").innerText = `${filtered.length} Doctors Found`;

  if (filtered.length === 0) {
    container.innerHTML = `<div style="text-align: center; padding: 24px; color: var(--text-muted); font-size: 13px;">No doctors found matching "<strong>${query}</strong>". Try searching "General" or "Skin".</div>`;
    return;
  }

  container.innerHTML = filtered.map(doc => `
    <div class="doc-card">
      <div class="doc-card-top">
        <img src="${doc.image}" alt="${doc.name}" class="doc-card-img">
        <div class="doc-meta">
          <h5>${doc.name}</h5>
          <span class="doc-specialty">${doc.specialty} • ${doc.experience}</span>
          <div class="doc-rating" onclick="openReviewsModal(${doc.id})" style="cursor: pointer;">
            ⭐ ${doc.rating} <span style="font-size: 10px; color: #38bdf8; text-decoration: underline;">(Reviews)</span>
          </div>
        </div>
      </div>
      <div class="doc-card-bottom">
        <span class="doc-fee">${doc.fee} / 15-min call</span>
        <button class="btn-book-sm" onclick="openBookingModal(${doc.id})">Book Consult</button>
      </div>
    </div>
  `).join("");
}

function clearDoctorSearch() {
  document.getElementById("patient-search-bar").value = "";
  searchDoctors("");
}

// Doctor Reviews Modal Logic
function openReviewsModal(doctorId) {
  selectedDoctor = doctors.find(d => d.id === doctorId) || doctors[0];
  document.getElementById("rev-doc-img").src = selectedDoctor.image;
  document.getElementById("rev-doc-name").innerText = selectedDoctor.name;
  document.getElementById("rev-doc-rating").innerText = `⭐ ${selectedDoctor.rating}`;

  const listContainer = document.getElementById("doctor-reviews-list");
  const reviews = doctorReviews[doctorId] || doctorReviews[1];

  listContainer.innerHTML = reviews.map(r => `
    <div class="review-item">
      <div class="review-user-row">
        <strong>${r.name}</strong>
        <span>${"★".repeat(r.stars)}</span>
      </div>
      <div class="review-text">${r.comment}</div>
      <small style="font-size: 10px; color: var(--text-muted);">${r.date} • Verified Consultation</small>
    </div>
  `).join("");

  document.getElementById("reviews-modal").classList.remove("hidden");
  playChime("click");
}

function setReviewRating(stars) {
  selectedReviewStars = stars;
  const starEls = document.querySelectorAll("#star-rating-selector .star");
  starEls.forEach((s, idx) => {
    s.classList.toggle("active", idx < stars);
  });
  playChime("click");
}

function submitPatientReview() {
  const comment = document.getElementById("review-comment-input").value.trim();
  if (!comment) {
    showToast("Please enter a short comment", "info");
    return;
  }

  if (!doctorReviews[selectedDoctor.id]) doctorReviews[selectedDoctor.id] = [];
  doctorReviews[selectedDoctor.id].unshift({
    name: "Sarah Jenkins (You)",
    stars: selectedReviewStars,
    date: "Just now",
    comment: comment
  });

  document.getElementById("review-comment-input").value = "";
  closeModal("reviews-modal");
  playChime("success");
  showToast("Thank you! Your verified rating was submitted.", "success");
}

function openBookingModal(doctorId) {
  selectedDoctor = doctors.find(d => d.id === doctorId) || doctors[0];
  document.getElementById("modal-doc-img").src = selectedDoctor.image;
  document.getElementById("modal-doc-name").innerText = selectedDoctor.name;
  document.getElementById("modal-doc-spec").innerText = selectedDoctor.specialty;
  document.getElementById("modal-base-fee").innerText = selectedDoctor.fee;
  
  const baseNum = parseFloat(selectedDoctor.fee.replace("$", ""));
  document.getElementById("modal-total-fee").innerText = `$${(baseNum + 3.00).toFixed(2)}`;
  document.getElementById("btn-pay-confirm").innerHTML = `<i class="fa-solid fa-lock"></i> Pay $${(baseNum + 3.00).toFixed(2)} & Confirm`;

  document.getElementById("booking-modal").classList.remove("hidden");
  playChime("click");
}

function openInstantBookingModal() {
  openBookingModal(1);
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.add("hidden");
}

function selectSlot(btn) {
  document.querySelectorAll(".time-slot").forEach(s => s.classList.remove("active"));
  btn.classList.add("active");
}

function toggleSymptom(btn) {
  document.querySelectorAll(".sym-tag").forEach(s => s.classList.remove("active"));
  btn.classList.add("active");
}

function processPaymentAndLaunch() {
  const payBtn = document.getElementById("btn-pay-confirm");
  payBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Authorizing with Stripe...`;
  payBtn.disabled = true;

  setTimeout(() => {
    playChime("success");
    payBtn.innerHTML = `<i class="fa-solid fa-check"></i> Payment Approved! Launching Room...`;
    showToast("Payment Authorized via Stripe ($48.00)", "success");
    
    setTimeout(() => {
      closeModal("booking-modal");
      payBtn.disabled = false;
      launchVideoCall(selectedDoctor.name, selectedDoctor.specialty);
    }, 800);
  }, 1200);
}

// Payment Invoice Modal Logic
function openInvoiceModal() {
  document.getElementById("inv-tx-id").innerText = `tx_live_${Math.floor(1000000 + Math.random() * 9000000)}`;
  document.getElementById("inv-date").innerText = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + " • " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  document.getElementById("inv-service-name").innerText = `${selectedDoctor.specialty} Video Call (${selectedDoctor.name})`;
  document.getElementById("inv-base-price").innerText = selectedDoctor.fee;
  
  const baseNum = parseFloat(selectedDoctor.fee.replace("$", ""));
  document.getElementById("inv-total-price").innerText = `$${(baseNum + 3.00).toFixed(2)}`;

  document.getElementById("invoice-modal").classList.remove("hidden");
  playChime("click");
}

// ==========================================================================
// Live Video Call Room Simulation
// ==========================================================================

function launchVideoCall(doctorName, specialty) {
  document.getElementById("call-doc-name").innerText = `${doctorName} (Live Consultation)`;
  document.getElementById("video-modal").classList.remove("hidden");
  playChime("call");
  
  callSeconds = 0;
  clearInterval(callTimerInterval);
  callTimerInterval = setInterval(() => {
    callSeconds++;
    const mins = String(Math.floor(callSeconds / 60)).padStart(2, '0');
    const secs = String(callSeconds % 60).padStart(2, '0');
    document.getElementById("call-timer").innerText = `${mins}:${secs}`;
  }, 1000);
}

function toggleMic() {
  isMicMuted = !isMicMuted;
  const btn = document.getElementById("btn-toggle-mic");
  btn.style.background = isMicMuted ? "#f43f5e" : "";
  btn.innerHTML = isMicMuted ? `<i class="fa-solid fa-microphone-slash"></i>` : `<i class="fa-solid fa-microphone"></i>`;
  showToast(isMicMuted ? "Microphone Muted" : "Microphone Active", "info");
}

function toggleCam() {
  isCamOff = !isCamOff;
  const btn = document.getElementById("btn-toggle-cam");
  btn.style.background = isCamOff ? "#f43f5e" : "";
  btn.innerHTML = isCamOff ? `<i class="fa-solid fa-video-slash"></i>` : `<i class="fa-solid fa-video"></i>`;
  document.getElementById("video-patient-stream").style.opacity = isCamOff ? "0.1" : "1";
}

async function toggleRealWebcam() {
  const videoEl = document.getElementById("webcam-video");
  const imgEl = document.getElementById("video-patient-stream");
  const btn = document.getElementById("btn-real-camera");

  if (!isRealCamActive) {
    try {
      realCamStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      videoEl.srcObject = realCamStream;
      videoEl.classList.remove("hidden");
      imgEl.classList.add("hidden");
      btn.style.background = "#10b981";
      isRealCamActive = true;
      showToast("Live Webcam Connected!", "success");
    } catch (err) {
      showToast("Webcam permission denied or unavailable", "info");
    }
  } else {
    if (realCamStream) {
      realCamStream.getTracks().forEach(t => t.stop());
    }
    videoEl.classList.add("hidden");
    imgEl.classList.remove("hidden");
    btn.style.background = "";
    isRealCamActive = false;
    showToast("Switched to Patient Avatar", "info");
  }
}

function toggleChatDrawer() {
  const drawer = document.getElementById("call-chat-drawer");
  drawer.classList.toggle("hidden");
}

function sendChatMessage(e) {
  e.preventDefault();
  const input = document.getElementById("chat-input-field");
  const msg = input.value.trim();
  if (!msg) return;

  const messagesDiv = document.getElementById("chat-messages");
  
  // Patient Message
  const pBubble = document.createElement("div");
  pBubble.className = "chat-bubble patient";
  pBubble.innerText = msg;
  messagesDiv.appendChild(pBubble);
  input.value = "";
  messagesDiv.scrollTop = messagesDiv.scrollHeight;

  // Automated Doctor Reply
  setTimeout(() => {
    playChime("click");
    const dBubble = document.createElement("div");
    dBubble.className = "chat-bubble doc";
    dBubble.innerHTML = `<strong>Dr. Marcus:</strong> Thank you for that detail. I've noted that in your consultation file.`;
    messagesDiv.appendChild(dBubble);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }, 1000);
}

function endCallAndShowRx() {
  clearInterval(callTimerInterval);
  if (realCamStream) {
    realCamStream.getTracks().forEach(t => t.stop());
  }
  closeModal("video-modal");
  playChime("call");
  showToast("Consultation Finished • Redirected to Doctor Studio", "success");
  switchView("doctor-view");
}

// ==========================================================================
// Doctor Portal & Clinical Safety Logic
// ==========================================================================

function switchDocSubTab(tab) {
  document.querySelectorAll(".doc-tab-btn").forEach(b => b.classList.remove("active"));
  if (tab === "rx") {
    document.getElementById("doc-tab-rx").classList.add("active");
    document.getElementById("doc-subtab-rx-panel").classList.remove("hidden");
    document.getElementById("doc-subtab-calendar-panel").classList.add("hidden");
  } else {
    document.getElementById("doc-tab-calendar").classList.add("active");
    document.getElementById("doc-subtab-rx-panel").classList.add("hidden");
    document.getElementById("doc-subtab-calendar-panel").classList.remove("hidden");
  }
  playChime("click");
}

function checkAllergySafety(medName) {
  const clean = medName.toLowerCase().trim();
  const dangerousMeds = ["amoxicillin", "penicillin", "ampicillin", "augmentin", "amoxil"];
  const isDangerous = dangerousMeds.some(m => clean.includes(m));

  const warnBox = document.getElementById("contraindication-box");
  if (isDangerous) {
    warnBox.classList.remove("hidden");
  } else {
    warnBox.classList.add("hidden");
  }
}

function autoFixAllergySafeMed() {
  document.getElementById("rx-med1").value = "Azithromycin 500mg (Macrolide - Allergy Safe)";
  document.getElementById("rx-dose1").value = "1 Tablet Daily for 3 Days";
  document.getElementById("contraindication-box").classList.add("hidden");
  playChime("success");
  showToast("Switched to Safe Non-Penicillin Antibiotic (Azithromycin)", "success");
}

function toggleCalendarSlot(slotEl) {
  if (slotEl.classList.contains("free")) {
    slotEl.classList.remove("free");
    slotEl.classList.add("booked");
    slotEl.innerText = slotEl.innerText.replace("• Open", "• Reserved (Dr. Marcus)");
    playChime("click");
    showToast("Calendar Slot Locked for Telehealth", "info");
  } else if (slotEl.classList.contains("booked")) {
    slotEl.classList.remove("booked");
    slotEl.classList.add("free");
    slotEl.innerText = slotEl.innerText.replace("• Reserved (Dr. Marcus)", "• Open");
    playChime("click");
    showToast("Calendar Slot Opened to Public", "info");
  }
}

function selectQueuePatient(name, notes) {
  document.getElementById("rx-patient-name").value = name;
  document.getElementById("rx-diagnosis").value = notes;
  
  if (name.includes("Sarah")) {
    document.getElementById("allergy-banner").classList.remove("hidden");
    document.getElementById("rx-med1").value = "Amoxicillin 500mg Capsules";
    checkAllergySafety("Amoxicillin");
  } else {
    document.getElementById("allergy-banner").classList.add("hidden");
    document.getElementById("contraindication-box").classList.add("hidden");
    document.getElementById("rx-med1").value = "Hydrocortisone 1% Topical Cream";
    document.getElementById("rx-dose1").value = "Apply thin layer 2x daily";
  }
  showToast(`Loaded Patient Profile: ${name}`, "info");
}

function generatePrescription(e) {
  e.preventDefault();
  const name = document.getElementById("rx-patient-name").value;
  const date = document.getElementById("rx-date").value;
  const diagnosis = document.getElementById("rx-diagnosis").value;
  const med1 = document.getElementById("rx-med1").value;
  const dose1 = document.getElementById("rx-dose1").value;
  const dur1 = document.getElementById("rx-dur1").value;
  const advice = document.getElementById("rx-advice").value;
  const bp = document.getElementById("vit-bp").value;
  const hr = document.getElementById("vit-hr").value;
  const temp = document.getElementById("vit-temp").value;

  const outputDiv = document.getElementById("rx-details-output");
  outputDiv.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; font-size: 13px;">
      <div><strong>Patient:</strong> ${name}</div>
      <div><strong>Consultation Date:</strong> ${date}</div>
      <div><strong>Vitals:</strong> BP ${bp} • HR ${hr} • Temp ${temp}</div>
      <div><strong>Clinical Status:</strong> Verified Telehealth Review</div>
    </div>
    <div style="margin-bottom: 12px; font-size: 13px;"><strong>Assessment & Diagnosis:</strong> ${diagnosis}</div>
    <div style="background: rgba(255,255,255,0.05); padding: 12px; border-radius: 8px; margin-bottom: 12px; font-size: 13px;">
      <strong>Prescribed Pharmacotherapy:</strong>
      <p style="color: #38bdf8; margin-top: 4px; font-weight: 700;">💊 1. ${med1} — ${dose1} (${dur1})</p>
    </div>
    <div style="font-size: 12px; color: #94a3b8;"><strong>Physician Instructions:</strong> ${advice}</div>
  `;

  document.getElementById("rx-pad-date").innerText = `Date: ${date}`;
  document.getElementById("rx-preview-card").classList.remove("hidden");
  document.getElementById("rx-preview-card").scrollIntoView({ behavior: 'smooth' });
  playChime("success");
  showToast("Digital Rx Generated Successfully", "success");
}

function pushRxToPatientApp() {
  playChime("success");
  showToast("Prescription Pushed to Patient App via Push Notification!", "success");
  document.getElementById("record-count").innerText = "2";
}

function viewHistoricalRx() {
  switchView("doctor-view");
  generatePrescription(new Event("submit"));
}

// ==========================================================================
// IT PM Interactive Agile Tool Suite
// ==========================================================================

function renderKanban() {
  const columns = {
    backlog: document.getElementById("cards-backlog"),
    progress: document.getElementById("cards-progress"),
    qa: document.getElementById("cards-qa"),
    done: document.getElementById("cards-done")
  };

  Object.values(columns).forEach(col => col.innerHTML = "");

  const counts = { backlog: 0, progress: 0, qa: 0, done: 0 };

  kanbanCards.forEach(card => {
    counts[card.status]++;
    const cardEl = document.createElement("div");
    cardEl.className = "kanban-card";
    cardEl.title = "Click to advance sprint status";
    cardEl.onclick = () => advanceCard(card.id);
    cardEl.innerHTML = `
      <div class="card-top-row">
        <span class="card-id">${card.id}</span>
        <span class="card-pts">${card.pts} pts</span>
      </div>
      <div class="card-title">${card.title}</div>
      <div class="card-bottom-row">
        <span class="card-epic"><i class="fa-solid fa-tag"></i> ${card.epic}</span>
        <span class="card-avatar">${card.assignee}</span>
      </div>
    `;
    columns[card.status].appendChild(cardEl);
  });

  document.getElementById("count-backlog").innerText = counts.backlog;
  document.getElementById("count-progress").innerText = counts.progress;
  document.getElementById("count-qa").innerText = counts.qa;
  document.getElementById("count-done").innerText = counts.done;
}

function advanceCard(cardId) {
  const card = kanbanCards.find(c => c.id === cardId);
  if (!card) return;

  const flow = { backlog: "progress", progress: "qa", qa: "done", done: "backlog" };
  const prevStatus = card.status;
  card.status = flow[card.status];
  renderKanban();
  playChime("click");
  showToast(`Moved ${card.id} from ${prevStatus.toUpperCase()} ➔ ${card.status.toUpperCase()}`, "info");
}

function resetKanban() {
  kanbanCards = [...initialKanbanCards];
  renderKanban();
  showToast("Kanban Board Reset to Baseline", "info");
}

function openNewStoryModal() {
  document.getElementById("new-story-modal").classList.remove("hidden");
  playChime("click");
}

function submitNewUserStory(e) {
  e.preventDefault();
  const title = document.getElementById("new-story-title").value;
  const epic = document.getElementById("new-story-epic").value;
  const pts = parseInt(document.getElementById("new-story-pts").value);
  const assignee = document.getElementById("new-story-assignee").value;

  const newId = `US-${Math.floor(100 + Math.random() * 900)}`;
  kanbanCards.unshift({
    id: newId,
    title: title,
    epic: epic,
    pts: pts,
    status: "backlog",
    assignee: assignee
  });

  renderKanban();
  closeModal("new-story-modal");
  document.getElementById("new-story-form").reset();
  playChime("success");
  showToast(`Added Story ${newId} (${pts} pts) to Product Backlog!`, "success");
}

// Interactive Risk Matrix Calculator ($P \times I$)
function updateRiskScore() {
  const p = parseInt(document.getElementById("input-prob").value);
  const i = parseInt(document.getElementById("input-imp").value);
  const score = p * i;

  document.getElementById("lbl-prob").innerText = p;
  document.getElementById("lbl-imp").innerText = i;
  document.getElementById("calc-score-val").innerText = score;

  const badge = document.getElementById("calc-score-badge");
  badge.className = "score-badge";

  if (score >= 15) {
    badge.classList.add("high");
    badge.innerText = "CRITICAL / HIGH RISK";
  } else if (score >= 8) {
    badge.classList.add("med");
    badge.innerText = "MEDIUM RISK";
  } else {
    badge.classList.add("low");
    badge.innerText = "LOW RISK";
  }
}

// ==========================================================================
// Agile Planning Poker Estimation Logic
// ==========================================================================

function castPokerVote(pts) {
  document.querySelectorAll(".poker-cards-deck .p-card").forEach(c => {
    c.classList.toggle("active-card", c.innerText === String(pts));
  });

  document.getElementById("vote-user").innerText = pts === "☕" ? "☕ Break" : `${pts} pts`;

  // Simulated Team Consensus Behavior
  if (pts === 8) {
    document.getElementById("vote-la").innerText = "8 pts";
    document.getElementById("vote-ios").innerText = "8 pts";
    document.getElementById("vote-qa").innerText = "8 pts";
    document.getElementById("poker-consensus-status").innerText = "Consensus: 8 Points";
    document.getElementById("poker-consensus-status").style.borderColor = "#10b981";
    document.getElementById("poker-consensus-status").style.color = "#10b981";
  } else if (pts === "☕") {
    document.getElementById("vote-la").innerText = "5 pts";
    document.getElementById("vote-ios").innerText = "8 pts";
    document.getElementById("vote-qa").innerText = "☕";
    document.getElementById("poker-consensus-status").innerText = "Coffee Break Called";
  } else {
    document.getElementById("vote-la").innerText = `${pts} pts`;
    document.getElementById("vote-ios").innerText = pts > 5 ? `${pts - 2} pts` : `${pts} pts`;
    document.getElementById("vote-qa").innerText = `${pts} pts`;
    document.getElementById("poker-consensus-status").innerText = `Estimating: ${pts} Points`;
  }

  playChime("click");
  showToast(`Voted ${pts} Story Points on US-301 Video Call!`, "success");
}

// ==========================================================================
// Sprint Retrospective Board Logic
// ==========================================================================

function addRetroNote(colType) {
  const input = document.getElementById(`input-retro-${colType}`);
  const text = input.value.trim();
  if (!text) return;

  const container = document.getElementById(`cards-retro-${colType}`);
  const card = document.createElement("div");
  card.className = "retro-card";
  card.innerHTML = `
    <p>${text}</p>
    <div class="retro-card-footer">
      <span class="retro-author">You (IT PM)</span>
      <button class="btn-upvote" onclick="upvoteRetro(this)">👍 <span>1</span></button>
    </div>
  `;

  container.prepend(card);
  input.value = "";

  const countBadge = document.getElementById(`count-retro-${colType}`);
  countBadge.innerText = parseInt(countBadge.innerText) + 1;

  playChime("success");
  showToast("Added Retrospective Sticky Note", "success");
}

function upvoteRetro(btn) {
  const span = btn.querySelector("span");
  span.innerText = parseInt(span.innerText) + 1;
  btn.style.borderColor = "#06b6d4";
  btn.style.color = "#06b6d4";
  playChime("click");
}

function resetRetroBoard() {
  showToast("Retrospective Notes Synced with Jira", "info");
}

// ==========================================================================
// Light / Dark Theme Switcher Logic
// ==========================================================================

let isLightTheme = false;

function toggleTheme() {
  isLightTheme = !isLightTheme;
  document.body.classList.toggle("light-theme", isLightTheme);
  const btn = document.getElementById("theme-toggle-btn");
  btn.innerHTML = isLightTheme ? `<i class="fa-solid fa-sun"></i>` : `<i class="fa-solid fa-moon"></i>`;
  playChime("click");
  showToast(isLightTheme ? "Light Theme Activated" : "Dark Cyber Theme Activated", "info");
}

// ==========================================================================
// One-Click CSV Exporter for Agile Backlog & RAID Register
// ==========================================================================

function exportProjectDataCSV() {
  let csv = "QUICKCARE TELEHEALTH MVP — PROJECT BACKLOG & RAID REGISTER\n\n";
  
  // Section 1: Product Backlog
  csv += "--- AGILE PRODUCT BACKLOG ---\n";
  csv += "Story ID,Epic,Story Title,Story Points,Status,Assignee\n";
  kanbanCards.forEach(c => {
    csv += `"${c.id}","${c.epic}","${c.title.replace(/"/g, '""')}",${c.pts},"${c.status.toUpperCase()}","${c.assignee}"\n`;
  });

  csv += "\n--- RAID RISK REGISTER ---\n";
  csv += "Risk ID,Category,Risk Description,Probability,Impact,Score,Mitigation Strategy,Status\n";
  csv += '"RSK-01","Technical","WebRTC Video Lag on 3G",3,4,12,"Adaptive bitrate & Twilio fallback","RESOLVED"\n';
  csv += '"RSK-02","Compliance","HIPAA Privacy Breach",2,5,10,"End-to-end AES-256 encryption & penetration audit","RESOLVED"\n';
  csv += '"RSK-03","Scope","Automated Insurance Scope Creep",4,4,16,"Defended MVP boundary; shifted to Version 2.0","RESOLVED"\n';
  csv += '"RSK-04","Vendor","Stripe Test API Sandbox Delay",3,3,9,"PM escalated to security team; cleared in 30m","RESOLVED"\n';

  csv += "\n--- FINANCIAL BUDGET SUMMARY ---\n";
  csv += "Category,Approved Baseline,Actual Invoiced,Cost Variance\n";
  csv += '"Engineering & UX Labor","$90,000","$88,200","+$1,800 (Favorable)"\n';
  csv += '"AWS Cloud & APIs","$8,000","$7,400","+$600 (Favorable)"\n';
  csv += '"HIPAA Security Audit","$12,000","$12,000","$0 (On Budget)"\n';
  csv += '"Contingency Reserve","$10,000","$8,800","+$1,200 (Saved)"\n';
  csv += '"TOTAL PROJECT","$120,000","$116,400","+$3,600 (3% Under Budget)"\n';

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `QuickCare_IT_PM_Project_Deliverables_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  playChime("success");
  showToast("Exported QuickCare_IT_PM_Project_Deliverables.csv!", "success");
}

// ==========================================================================
// Agile Sprint Capacity & Burndown Simulation Engine
// ==========================================================================

const sprintBaselines = {
  1: { name: "Sprint 1 (Auth & User Onboarding)", pts: 28, startY: 20 },
  2: { name: "Sprint 2 (Doctor Discovery & Booking)", pts: 30, startY: 20 },
  3: { name: "Sprint 3 (WebRTC Video Room & Stripe)", pts: 33, startY: 20 },
  4: { name: "Sprint 4: Active (Digital Rx & Release)", pts: 29, startY: 20 }
};

let activeSimSprint = 4;

function selectSprintView(sprintNum) {
  activeSimSprint = sprintNum;
  document.querySelectorAll(".s-chip").forEach((c, idx) => {
    c.classList.toggle("active", idx + 1 === sprintNum);
  });

  document.getElementById("burndown-chart-title").innerText = `📉 ${sprintBaselines[sprintNum].name} Burndown`;
  playChime("click");
  updateBurndownSim();
  showToast(`Loaded ${sprintBaselines[sprintNum].name}`, "info");
}

function updateBurndownSim() {
  const devs = parseInt(document.getElementById("sim-range-devs").value);
  const scope = parseInt(document.getElementById("sim-range-scope").value);
  const sick = parseInt(document.getElementById("sim-range-sick").value);

  document.getElementById("sim-val-devs").innerText = `${devs} Devs`;
  document.getElementById("sim-val-scope").innerText = scope > 0 ? `+${scope} pts (Creep)` : scope < 0 ? `${scope} pts (Descoped)` : `0 pts`;
  document.getElementById("sim-val-sick").innerText = `${sick} Days`;

  const basePts = sprintBaselines[activeSimSprint].pts;
  const totalPts = basePts + scope;

  // Calculate daily burn velocity: Base is ~3.0 pts/day with 6 devs
  const effectiveDevCapacity = (devs / 6) * (1 - (sick * 0.08));
  const dailyBurn = (basePts / 10) * effectiveDevCapacity;
  const totalBurnedIn10Days = dailyBurn * 10;
  const spillover = Math.max(0, Math.round(totalPts - totalBurnedIn10Days));
  const completionDay = Math.min(12, (totalPts / dailyBurn)).toFixed(1);

  // Generate SVG polyline points (X: 40 to 400, Y: 20 to 190)
  const xStart = 40, xEnd = 400;
  const yStart = 20, yEnd = 190;
  const yRange = yEnd - yStart;

  const points = [];
  let remaining = totalPts;

  for (let day = 0; day <= 10; day++) {
    const x = xStart + (day / 10) * (xEnd - xStart);
    const dayBurnAmount = (day === 0) ? 0 : dailyBurn * (0.85 + Math.sin(day) * 0.2);
    remaining = Math.max(0, remaining - dayBurnAmount);
    
    // Convert remaining points to Y-coordinate
    const yFraction = 1 - (remaining / totalPts);
    const y = yStart + (yFraction * yRange);
    points.push(`${Math.round(x)},${Math.round(y)}`);
  }

  const polyline = document.getElementById("burndown-polyline");
  if (polyline) polyline.setAttribute("points", points.join(" "));

  // Update Dynamic Forecast Alert Banner
  const banner = document.getElementById("sim-forecast-box");
  const titleEl = document.getElementById("sim-forecast-title");
  const descEl = document.getElementById("sim-forecast-desc");
  const tagEl = document.getElementById("sim-forecast-tag");
  const iconEl = document.getElementById("sim-forecast-icon");

  banner.className = "sim-forecast-banner";

  if (spillover === 0 && completionDay <= 10) {
    banner.classList.add("success");
    iconEl.className = "fa-solid fa-circle-check";
    titleEl.innerText = "SPRINT ON TRACK: 100% Delivery Projected";
    descEl.innerText = `At simulated velocity of ${(dailyBurn).toFixed(1)} pts/day, all ${totalPts} points complete on Day ${completionDay} with zero spillover!`;
    tagEl.innerText = "0 Pt Spillover (Healthy)";
  } else if (spillover <= 4) {
    banner.classList.add("warning");
    iconEl.className = "fa-solid fa-triangle-exclamation";
    titleEl.innerText = `MODERATE RISK: ~${spillover} Story Points At Risk`;
    descEl.innerText = `Velocity dropped due to team capacity constraints. Projected completion: Day ${completionDay}. Recommend fast-tracking QA.`;
    tagEl.innerText = `+${spillover} Pts Spillover (Warning)`;
  } else {
    banner.classList.add("danger");
    iconEl.className = "fa-solid fa-circle-xmark";
    titleEl.innerText = `CRITICAL SPILLOVER: +${spillover} Points Delayed!`;
    descEl.innerText = `Team capacity cannot sustain scope (${totalPts} pts). PM Action: Immediately descope non-essential stories or request developer augmentation!`;
    tagEl.innerText = `+${spillover} Pts Spillover (Critical)`;
  }
}

function resetBurndownSim() {
  document.getElementById("sim-range-devs").value = 6;
  document.getElementById("sim-range-scope").value = 0;
  document.getElementById("sim-range-sick").value = 0;
  updateBurndownSim();
  playChime("click");
  showToast("Reset to Standard 6-Dev Baseline Velocity", "info");
}

// ==========================================================================
// QuickCare AI Clinical Symptom Checker & Smart Doctor Matcher
// ==========================================================================

function openAiTriageModal() {
  document.getElementById("ai-triage-modal").classList.remove("hidden");
  playChime("click");
}

function sendAiQuickSymptom(text) {
  document.getElementById("ai-chat-input").value = text;
  handleAiChatSubmit(new Event("submit"));
}

function handleAiChatSubmit(e) {
  e.preventDefault();
  const input = document.getElementById("ai-chat-input");
  const query = input.value.trim();
  if (!query) return;

  const messagesBox = document.getElementById("ai-chat-messages");

  // Append Patient Message
  const userRow = document.createElement("div");
  userRow.className = "ai-bubble-row user";
  userRow.innerHTML = `<div class="ai-bubble"><p>${query}</p></div>`;
  messagesBox.appendChild(userRow);
  input.value = "";
  messagesBox.scrollTop = messagesBox.scrollHeight;

  // Append Simulated AI Typing Indicator
  const typingRow = document.createElement("div");
  typingRow.className = "ai-bubble-row bot";
  typingRow.id = "ai-typing-indicator";
  typingRow.innerHTML = `
    <div class="ai-mini-avatar"><i class="fa-solid fa-robot"></i></div>
    <div class="ai-bubble"><p><i class="fa-solid fa-spinner fa-spin"></i> Analyzing clinical symptoms & matching specialists...</p></div>
  `;
  messagesBox.appendChild(typingRow);
  messagesBox.scrollTop = messagesBox.scrollHeight;

  setTimeout(() => {
    typingRow.remove();
    processAiResponse(query, messagesBox);
  }, 750);
}

function processAiResponse(query, messagesBox) {
  const clean = query.toLowerCase();
  let matchedDoc = doctors[0]; // Marcus (General)
  let triageLevel = "MILD (Standard Telehealth)";
  let triageClass = "mild";
  let diagnosisNote = "Symptoms suggest acute upper respiratory tract viral infection or seasonal flu.";

  if (clean.includes("skin") || clean.includes("rash") || clean.includes("acne") || clean.includes("itch") || clean.includes("bump")) {
    matchedDoc = doctors[1]; // Emily (Derm)
    triageLevel = "MILD (Topical Assessment Needed)";
    triageClass = "mild";
    diagnosisNote = "Symptoms are consistent with acute contact dermatitis or localized eczema.";
  } else if (clean.includes("child") || clean.includes("baby") || clean.includes("kid") || clean.includes("infant") || clean.includes("toddler") || clean.includes("3-year")) {
    matchedDoc = doctors[2]; // Rajesh (Peds)
    triageLevel = "MODERATE (Pediatric Care)";
    triageClass = "mod";
    diagnosisNote = "Pediatric fever requires weight-based antipyretic dosing and hydration assessment.";
  } else if (clean.includes("heart") || clean.includes("palpitation") || clean.includes("bp") || clean.includes("chest") || clean.includes("pressure")) {
    matchedDoc = doctors[3]; // Bennett (Cardio)
    triageLevel = "MODERATE (Cardiovascular Check)";
    triageClass = "mod";
    diagnosisNote = "Cardiac symptoms warrant clinical telemetry review and ECG assessment.";
  }

  const botRow = document.createElement("div");
  botRow.className = "ai-bubble-row bot";
  botRow.innerHTML = `
    <div class="ai-mini-avatar"><i class="fa-solid fa-robot"></i></div>
    <div class="ai-bubble">
      <p>I've reviewed your symptoms:</p>
      <div class="ai-triage-card">
        <span class="triage-level-pill ${triageClass}">Triage: ${triageLevel}</span>
        <p style="font-size: 11px; color: #94a3b8; margin: 4px 0;"><strong>Assessment:</strong> ${diagnosisNote}</p>
        <div class="triage-match-box">
          <div style="display: flex; align-items: center; gap: 8px;">
            <img src="${matchedDoc.image}" alt="${matchedDoc.name}" class="triage-doc-img">
            <div>
              <strong style="font-size: 11px; color: white; display: block;">${matchedDoc.name}</strong>
              <small style="font-size: 10px; color: #38bdf8;">${matchedDoc.specialty} • ${matchedDoc.fee}</small>
            </div>
          </div>
          <button class="btn-sm btn-success" onclick="closeModal('ai-triage-modal'); openBookingModal(${matchedDoc.id})">
            <i class="fa-solid fa-video"></i> Book Now
          </button>
        </div>
      </div>
      <small style="display: block; font-size: 9px; color: var(--text-muted); margin-top: 6px;">⚠️ AI guidance is for clinical triage & informational purposes only.</small>
    </div>
  `;

  messagesBox.appendChild(botRow);
  messagesBox.scrollTop = messagesBox.scrollHeight;
  playChime("success");
}

// ==========================================================================
// Pharmacy Home Delivery & Live GPS Tracker Simulation
// ==========================================================================

let currentDeliveryStage = 3; // Initial state: On the Way

const deliveryStages = [
  {
    step: 1,
    fillWidth: "0%",
    statusTitle: "Prescription Verified",
    eta: "35 Mins (8:05 PM)",
    markerPos: "translate(30, 130)",
    btnText: "Fast-Forward ➔ Dispense Medicine"
  },
  {
    step: 2,
    fillWidth: "33%",
    statusTitle: "Medication Dispensed & Sealed",
    eta: "28 Mins (7:55 PM)",
    markerPos: "translate(120, 105)",
    btnText: "Fast-Forward ➔ Hand to Courier"
  },
  {
    step: 3,
    fillWidth: "66%",
    statusTitle: "Courier On The Way (Live Map)",
    eta: "14 Mins (7:42 PM)",
    markerPos: "translate(250, 72)",
    btnText: "Fast-Forward ➔ Arrived at Doorstep"
  },
  {
    step: 4,
    fillWidth: "100%",
    statusTitle: "Delivered to Doorstep!",
    eta: "Delivered (Just Now)",
    markerPos: "translate(360, 30)",
    btnText: "Order Again / Reset Demo"
  }
];

function openPharmacyDeliveryModal(medTitle, docInfo, totalFee) {
  if (medTitle) document.getElementById("del-med-title").innerText = medTitle;
  if (docInfo) document.getElementById("del-doc-info").innerText = `Prescribed by ${docInfo}`;
  if (totalFee) document.getElementById("del-total-cost").innerText = totalFee;

  applyDeliveryStage(currentDeliveryStage);
  document.getElementById("pharmacy-modal").classList.remove("hidden");
  playChime("click");
  showToast("Express Pharmacy Order Live Tracker Connected", "info");
}

function advanceDeliveryStage() {
  currentDeliveryStage = (currentDeliveryStage >= 4) ? 1 : currentDeliveryStage + 1;
  applyDeliveryStage(currentDeliveryStage);
  playChime("success");

  if (currentDeliveryStage === 4) {
    showToast("Package Delivered! Handover OTP #4821 Verified.", "success");
    document.getElementById("pharm-home-tag").innerText = "Delivered (Safe Handover)";
    document.getElementById("pharm-home-tag").style.background = "rgba(16, 185, 129, 0.3)";
  } else {
    showToast(`Delivery Advanced: ${deliveryStages[currentDeliveryStage - 1].statusTitle}`, "info");
    document.getElementById("pharm-home-tag").innerText = "Courier On The Way";
  }
}

function applyDeliveryStage(stageNum) {
  const stageData = deliveryStages[stageNum - 1];

  // Update progress bar fill
  document.getElementById("del-progress-fill").style.width = stageData.fillWidth;
  document.getElementById("del-eta-timer").innerHTML = `${stageData.eta}`;
  document.getElementById("btn-advance-del").innerHTML = `<i class="fa-solid fa-forward-step"></i> ${stageData.btnText}`;

  // Update step nodes
  for (let i = 1; i <= 4; i++) {
    const node = document.getElementById(`step-node-${i}`);
    node.className = "del-step";
    if (i < stageNum) {
      node.classList.add("done");
      node.querySelector(".step-circle").innerHTML = `<i class="fa-solid fa-check"></i>`;
    } else if (i === stageNum) {
      node.classList.add("active");
      if (i === 1) node.querySelector(".step-circle").innerHTML = `<i class="fa-solid fa-file-circle-check"></i>`;
      if (i === 2) node.querySelector(".step-circle").innerHTML = `<i class="fa-solid fa-box-archive"></i>`;
      if (i === 3) node.querySelector(".step-circle").innerHTML = `<i class="fa-solid fa-motorcycle"></i>`;
      if (i === 4) node.querySelector(".step-circle").innerHTML = `<i class="fa-solid fa-house-chimney-medical"></i>`;
    } else {
      if (i === 1) node.querySelector(".step-circle").innerHTML = `<i class="fa-solid fa-file-circle-check"></i>`;
      if (i === 2) node.querySelector(".step-circle").innerHTML = `<i class="fa-solid fa-box-archive"></i>`;
      if (i === 3) node.querySelector(".step-circle").innerHTML = `<i class="fa-solid fa-motorcycle"></i>`;
      if (i === 4) node.querySelector(".step-circle").innerHTML = `<i class="fa-solid fa-house-chimney-medical"></i>`;
    }
  }

  // Move GPS courier pin on SVG map
  const marker = document.getElementById("del-courier-marker");
  if (marker) {
    marker.setAttribute("transform", stageData.markerPos);
  }
}

function simulateDriverCall() {
  playChime("call");
  showToast("📞 Calling Driver Carlos Mendez (+1-555-0192)...", "info");
}

function simulateDriverMessage() {
  playChime("click");
  showToast("💬 Carlos Mendez: 'Hi Sarah, I am 3 minutes away from your front porch!'", "success");
}

// ==========================================================================
// 1-Click Clinical Presets & Voice Dictation Logic
// ==========================================================================

const clinicalPresets = {
  flu: {
    name: "Sarah Jenkins",
    diag: "Acute Viral Rhinitis & Upper Respiratory Infection (URI)",
    bp: "120/80 mmHg",
    hr: "76 bpm",
    temp: "99.4 °F",
    med1: "Azithromycin 500mg Tablets (Allergy Safe)",
    dose1: "1 Tablet Daily with meals",
    dur1: "3 Days",
    med2: "Paracetamol 650mg Tablet",
    dose2: "1 Tablet as needed for fever/headache",
    dur2: "5 Days",
    advice: "Maintain strict bed rest for 48 hours, hydrate with electrolyte fluids, and monitor body temperature. Contact clinic if breathing difficulty arises."
  },
  eczema: {
    name: "Michael Chang",
    diag: "Subacute Atopic Dermatitis & Localized Contact Eczema",
    bp: "118/75 mmHg",
    hr: "72 bpm",
    temp: "98.6 °F",
    med1: "Hydrocortisone 1% Topical Ointment",
    dose1: "Apply thin layer to affected skin 2x daily",
    dur1: "7 Days",
    med2: "Cetirizine 10mg Antihistamine",
    dose2: "1 Tablet at bedtime for pruritus",
    dur2: "10 Days",
    advice: "Avoid synthetic soaps and hot water showers. Keep skin moisturized with fragrance-free ceramide lotion within 3 minutes after bathing."
  },
  pediatric: {
    name: "Liam Patel (3 Yrs)",
    diag: "Pediatric Acute Otitis Media & Viral Pyrexia",
    bp: "95/60 mmHg",
    hr: "104 bpm",
    temp: "101.2 °F",
    med1: "Amoxicillin 125mg/5ml Oral Suspension",
    dose1: "5ml by mouth 3x daily",
    dur1: "7 Days",
    med2: "Ibuprofen Pediatric 100mg/5ml Suspension",
    dose2: "3.5ml every 6-8 hours as needed",
    dur2: "3 Days",
    advice: "Administer antibiotic with child meals. Ensure adequate fluid intake with oral rehydration. Schedule pediatric review if fever persists past 48h."
  },
  cardio: {
    name: "Elena Rostova",
    diag: "Essential Hypertension Stage 1 (Maintenance Pharmacotherapy)",
    bp: "136/84 mmHg",
    hr: "68 bpm",
    temp: "98.4 °F",
    med1: "Amlodipine 5mg Daily Tablets",
    dose1: "1 Tablet once daily in morning",
    dur1: "30 Days (Refill)",
    med2: "Telmisartan 40mg Oral Tablets",
    dose2: "1 Tablet once daily with water",
    dur2: "30 Days (Refill)",
    advice: "Maintain low-sodium dietary habits (< 2g/day), engage in 30 mins moderate walking, and record morning blood pressure readings in digital health log."
  }
};

function applyRxPreset(key) {
  if (key === "clear") {
    document.getElementById("rx-patient-name").value = "";
    document.getElementById("rx-diagnosis").value = "";
    document.getElementById("vit-bp").value = "120/80 mmHg";
    document.getElementById("vit-hr").value = "72 bpm";
    document.getElementById("vit-temp").value = "98.6 °F";
    document.getElementById("rx-med1").value = "";
    document.getElementById("rx-dose1").value = "";
    document.getElementById("rx-dur1").value = "";
    document.getElementById("rx-med2").value = "";
    document.getElementById("rx-dose2").value = "";
    document.getElementById("rx-dur2").value = "";
    document.getElementById("rx-advice").value = "";
    document.getElementById("contraindication-box").classList.add("hidden");
    playChime("click");
    showToast("Prescription Form Cleared", "info");
    return;
  }

  const p = clinicalPresets[key];
  if (!p) return;

  document.getElementById("rx-patient-name").value = p.name;
  document.getElementById("rx-diagnosis").value = p.diag;
  document.getElementById("vit-bp").value = p.bp;
  document.getElementById("vit-hr").value = p.hr;
  document.getElementById("vit-temp").value = p.temp;
  document.getElementById("rx-med1").value = p.med1;
  document.getElementById("rx-dose1").value = p.dose1;
  document.getElementById("rx-dur1").value = p.dur1;
  document.getElementById("rx-med2").value = p.med2;
  document.getElementById("rx-dose2").value = p.dose2;
  document.getElementById("rx-dur2").value = p.dur2;
  document.getElementById("rx-advice").value = p.advice;

  // Run allergy safety check on prescribed med
  checkAllergySafety(p.med1);

  playChime("success");
  showToast(`Applied Clinical Preset: ${p.diag.split("&")[0]}`, "success");
}

// Live Speech Recognition / Voice Dictation Studio
let activeSpeechRecognition = null;
let isDictating = false;

function toggleVoiceDictation(targetId, btnEl) {
  const targetEl = document.getElementById(targetId);
  const spanEl = btnEl.querySelector("span");

  // Check if browser supports Web Speech API
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (isDictating) {
    // Stop recording
    if (activeSpeechRecognition) {
      activeSpeechRecognition.stop();
    }
    isDictating = false;
    btnEl.classList.remove("recording");
    spanEl.innerText = targetId.includes("diag") ? "Dictate Notes" : "Dictate Voice Notes";
    playChime("click");
    showToast("Voice Dictation Stopped", "info");
    return;
  }

  if (SpeechRecognition) {
    try {
      activeSpeechRecognition = new SpeechRecognition();
      activeSpeechRecognition.continuous = true;
      activeSpeechRecognition.interimResults = true;
      activeSpeechRecognition.lang = 'en-US';

      activeSpeechRecognition.onstart = () => {
        isDictating = true;
        btnEl.classList.add("recording");
        spanEl.innerText = "🔴 Listening... (Speak)";
        playChime("call");
        showToast("🎙️ Listening... Speak clinical notes clearly into microphone", "info");
      };

      activeSpeechRecognition.onresult = (event) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript.trim()) {
          targetEl.value = transcript;
        }
      };

      activeSpeechRecognition.onerror = (event) => {
        console.log("Speech recognition error:", event.error);
        fallbackDictationSimulation(targetId, btnEl, spanEl);
      };

      activeSpeechRecognition.onend = () => {
        isDictating = false;
        btnEl.classList.remove("recording");
        spanEl.innerText = targetId.includes("diag") ? "Dictate Notes" : "Dictate Voice Notes";
      };

      activeSpeechRecognition.start();
    } catch (err) {
      fallbackDictationSimulation(targetId, btnEl, spanEl);
    }
  } else {
    // Fallback simulation for unsupported environments
    fallbackDictationSimulation(targetId, btnEl, spanEl);
  }
}

function fallbackDictationSimulation(targetId, btnEl, spanEl) {
  isDictating = true;
  btnEl.classList.add("recording");
  spanEl.innerText = "🔴 Transcribing Voice...";
  playChime("call");
  showToast("🎙️ Simulated Speech-to-Text: Dictating clinical findings...", "info");

  setTimeout(() => {
    const targetEl = document.getElementById(targetId);
    if (targetId.includes("diag")) {
      targetEl.value = "Bilateral tonsillar erythema, exudate noted, acute pharyngitis secondary to viral infection.";
    } else {
      targetEl.value = "Patient advised to complete full 3-day course, gargle warm salt water 3 times daily, and maintain isolation for 24 hours.";
    }
    isDictating = false;
    btnEl.classList.remove("recording");
    spanEl.innerText = targetId.includes("diag") ? "Dictate Notes" : "Dictate Voice Notes";
    playChime("success");
    showToast("Transcribed Clinical Voice Note Successfully!", "success");
  }, 1600);
}

// ==========================================================================
// Agile 15-Minute Daily Scrum Standup Runner & Blocker Logger
// ==========================================================================

const scrumTeamMembers = [
  {
    name: "David Kim",
    role: "Lead Architect & Backend Lead",
    avatar: "👨‍💻",
    yest: "Completed US-301 WebRTC bitrate adaptive throttling for low-bandwidth 3G connections.",
    today: "Implementing Stripe webhook tokenization & HIPAA audit log verification.",
    blocker: "External security team delay on Stripe sandbox API keys.",
    done: false
  },
  {
    name: "Maya Lin",
    role: "Mobile App Lead (iOS / Flutter)",
    avatar: "📱",
    yest: "Refined doctor specialty filter carousel and camera PiP toggle.",
    today: "Connecting Web Audio API synthesizer chimes to push notification events.",
    blocker: "None. All API endpoints ready.",
    done: false
  },
  {
    name: "Alex Rivera",
    role: "QA Lead & Security Analyst",
    avatar: "🧪",
    yest: "Executed 45 automated regression tests on digital prescription generation.",
    today: "Conducting penetration test on WebRTC signaling tokens and token expiry.",
    blocker: "Need 2 additional test accounts with active Stripe test cards.",
    done: false
  },
  {
    name: "Chloe Dubois",
    role: "Senior UI/UX Designer",
    avatar: "🎨",
    yest: "Finished Figma mockups for Dark/Light mode color palette and hospital prescription pad.",
    today: "Validating typography contrast ratios for WCAG 2.1 AA accessibility compliance.",
    blocker: "None.",
    done: false
  },
  {
    name: "Dr. Marcus Vance",
    role: "Product Owner & Chief Medical Advisor",
    avatar: "🩺",
    yest: "Reviewed clinical accuracy of contraindication warnings for Penicillin cross-reactivity.",
    today: "Sign-off on Sprint 4 acceptance criteria for digital Rx signature verification.",
    blocker: "Awaiting state medical board telehealth compliance confirmation.",
    done: false
  },
  {
    name: "Numesh",
    role: "IT Project Manager & Scrum Master (You)",
    avatar: "👑",
    yest: "Facilitated Sprint Planning Poker session and updated RAID Risk Register.",
    today: "Unblocking external security review with Stripe team and preparing Exec Status report.",
    blocker: "None. Team velocity tracking at 30.5 story points.",
    done: false
  }
];

let currentSpeakerIndex = 0;
let standupTimerInterval = null;
let isStandupRunning = false;
let speakerSecondsLeft = 120; // 2 minutes
let totalSecondsLeft = 900;   // 15 minutes

function renderStandupMembers() {
  const container = document.getElementById("scrum-members-strip");
  if (!container) return;

  container.innerHTML = scrumTeamMembers.map((m, idx) => `
    <div class="member-chip ${idx === currentSpeakerIndex ? 'active' : ''} ${m.done ? 'done' : ''}" onclick="selectStandupSpeaker(${idx})">
      <span>${m.avatar}</span>
      <strong>${m.name}</strong>
      ${m.done ? '<i class="fa-solid fa-check" style="color: var(--accent-emerald);"></i>' : ''}
    </div>
  `).join("");
}

function selectStandupSpeaker(idx) {
  currentSpeakerIndex = idx;
  speakerSecondsLeft = 120;
  updateTimerDisplays();
  loadSpeakerQuestions(idx);
  renderStandupMembers();
  playChime("click");
}

function loadSpeakerQuestions(idx) {
  const member = scrumTeamMembers[idx];
  document.getElementById("spk-name").innerText = member.name;
  document.getElementById("spk-role").innerText = member.role;
  document.getElementById("spk-avatar-icon").innerText = member.avatar;
  document.getElementById("q-yesterday").value = member.yest;
  document.getElementById("q-today").value = member.today;
  document.getElementById("q-blocker").value = member.blocker;
}

function updateTimerDisplays() {
  const sMin = String(Math.floor(speakerSecondsLeft / 60)).padStart(2, '0');
  const sSec = String(speakerSecondsLeft % 60).padStart(2, '0');
  document.getElementById("clock-speaker").innerText = `${sMin}:${sSec}`;

  const tMin = String(Math.floor(totalSecondsLeft / 60)).padStart(2, '0');
  const tSec = String(totalSecondsLeft % 60).padStart(2, '0');
  document.getElementById("clock-total").innerText = `${tMin}:${tSec}`;
}

function toggleStandupTimer() {
  const btn = document.getElementById("btn-standup-start");
  const tag = document.getElementById("standup-status-tag");

  if (!isStandupRunning) {
    isStandupRunning = true;
    btn.innerHTML = `<i class="fa-solid fa-pause"></i> Pause Standup`;
    btn.className = "btn-sm btn-outline";
    tag.innerText = "Meeting In Progress ⏱️";
    tag.style.color = "#00f2fe";
    playChime("call");

    standupTimerInterval = setInterval(() => {
      if (speakerSecondsLeft > 0) speakerSecondsLeft--;
      if (totalSecondsLeft > 0) totalSecondsLeft--;

      updateTimerDisplays();

      if (speakerSecondsLeft === 0) {
        playChime("click");
        showToast(`Speaker time up for ${scrumTeamMembers[currentSpeakerIndex].name}!`, "info");
      }
      if (totalSecondsLeft === 0) {
        clearInterval(standupTimerInterval);
        isStandupRunning = false;
        showToast("Daily Scrum 15-Minute Timebox Completed!", "success");
      }
    }, 1000);
  } else {
    isStandupRunning = false;
    clearInterval(standupTimerInterval);
    btn.innerHTML = `<i class="fa-solid fa-play"></i> Resume Standup`;
    btn.className = "btn-sm btn-success";
    tag.innerText = "Paused ⏸️";
    tag.style.color = "#fde68a";
    playChime("click");
  }
}

function nextStandupSpeaker() {
  scrumTeamMembers[currentSpeakerIndex].done = true;
  saveSpeakerLog();

  currentSpeakerIndex = (currentSpeakerIndex + 1) % scrumTeamMembers.length;
  speakerSecondsLeft = 120;
  updateTimerDisplays();
  loadSpeakerQuestions(currentSpeakerIndex);
  renderStandupMembers();

  playChime("success");
  showToast(`Floor handed to ${scrumTeamMembers[currentSpeakerIndex].name} (${scrumTeamMembers[currentSpeakerIndex].role})`, "info");
}

function saveSpeakerLog() {
  const member = scrumTeamMembers[currentSpeakerIndex];
  member.yest = document.getElementById("q-yesterday").value;
  member.today = document.getElementById("q-today").value;
  member.blocker = document.getElementById("q-blocker").value;
  showToast(`Saved Standup Notes for ${member.name}`, "info");
}

function escalateCurrentBlocker() {
  const blockerText = document.getElementById("q-blocker").value.trim();
  const currentMember = scrumTeamMembers[currentSpeakerIndex];

  if (!blockerText || blockerText.toLowerCase().includes("none")) {
    showToast("No active blocker entered to escalate", "info");
    return;
  }

  // Add to standup action log
  const logContainer = document.getElementById("standup-action-items");
  const newRow = document.createElement("div");
  newRow.className = "standup-item-row blocker";
  newRow.innerHTML = `
    <span class="item-tag blocker">ESCALATED</span>
    <span class="item-text"><strong>${currentMember.name}:</strong> ${blockerText}</span>
    <span class="item-owner">Owner: IT PM (Numesh)</span>
  `;
  logContainer.prepend(newRow);

  playChime("success");
  showToast(`🚨 Escalated to RAID Register: "${blockerText}" assigned to IT PM!`, "success");
}

function resetStandupMeeting() {
  clearInterval(standupTimerInterval);
  isStandupRunning = false;
  speakerSecondsLeft = 120;
  totalSecondsLeft = 900;
  currentSpeakerIndex = 0;
  scrumTeamMembers.forEach(m => m.done = false);

  updateTimerDisplays();
  loadSpeakerQuestions(0);
  renderStandupMembers();

  const btn = document.getElementById("btn-standup-start");
  btn.innerHTML = `<i class="fa-solid fa-play"></i> Start Standup`;
  btn.className = "btn-sm btn-success";
  document.getElementById("standup-status-tag").innerText = "Ready to Start";
  document.getElementById("standup-status-tag").style.color = "";

  playChime("click");
  showToast("Standup Meeting Reset to Baseline 15:00", "info");
}

// Call render on load
document.addEventListener("DOMContentLoaded", () => {
  renderStandupMembers();
  loadSpeakerQuestions(0);
});








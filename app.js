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



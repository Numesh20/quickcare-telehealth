/* ==========================================================================
   QuickCare Telehealth App & IT PM Control Center Logic
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
let callTimerInterval = null;
let callSeconds = 0;
let isMicMuted = false;
let isCamOff = false;

// ==========================================================================
// Initialization
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
  renderDoctors("All");
  renderKanban();
});

// View Switcher (Patient vs Doctor vs IT PM)
function switchView(viewId) {
  document.querySelectorAll(".view-panel").forEach(panel => panel.classList.remove("active"));
  document.querySelectorAll(".nav-tab").forEach(tab => tab.classList.remove("active"));

  document.getElementById(viewId).classList.add("active");

  if (viewId === "patient-view") document.getElementById("tab-patient").classList.add("active");
  if (viewId === "doctor-view") document.getElementById("tab-doctor").classList.add("active");
  if (viewId === "pm-view") document.getElementById("tab-pm").classList.add("active");
}

// PM Subtabs (Kanban, Velocity, RAID, RACI)
function switchPmTab(tabId) {
  document.querySelectorAll(".pm-tab-content").forEach(tab => tab.classList.remove("active"));
  document.querySelectorAll(".pm-subtab").forEach(btn => btn.classList.remove("active"));

  document.getElementById(tabId).classList.add("active");
  event.currentTarget.classList.add("active");
}

// ==========================================================================
// Patient View Logic
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
          <div class="doc-rating">⭐ ${doc.rating}</div>
        </div>
      </div>
      <div class="doc-card-bottom">
        <span class="doc-fee">${doc.fee} / 15-min call</span>
        <button class="btn-book-sm" onclick="openBookingModal(${doc.id})">Book Consult</button>
      </div>
    </div>
  `).join("");
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

function processPaymentAndLaunch() {
  const payBtn = document.getElementById("btn-pay-confirm");
  payBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Authorizing with Stripe...`;
  payBtn.disabled = true;

  setTimeout(() => {
    payBtn.innerHTML = `<i class="fa-solid fa-check"></i> Payment Approved! Launching Room...`;
    setTimeout(() => {
      closeModal("booking-modal");
      payBtn.disabled = false;
      launchVideoCall(selectedDoctor.name, selectedDoctor.specialty);
    }, 800);
  }, 1200);
}

// ==========================================================================
// Live Video Call Room Simulation
// ==========================================================================

function launchVideoCall(doctorName, specialty) {
  document.getElementById("call-doc-name").innerText = `${doctorName} (Live Consultation)`;
  document.getElementById("video-modal").classList.remove("hidden");
  
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
}

function toggleCam() {
  isCamOff = !isCamOff;
  const btn = document.getElementById("btn-toggle-cam");
  btn.style.background = isCamOff ? "#f43f5e" : "";
  btn.innerHTML = isCamOff ? `<i class="fa-solid fa-video-slash"></i>` : `<i class="fa-solid fa-video"></i>`;
  document.getElementById("video-patient-stream").style.opacity = isCamOff ? "0.1" : "1";
}

function openChatDrawer() {
  alert("In-Call Secure Chat: Doctor says 'Hello Sarah! I can see you clearly. How can I help you today?'");
}

function endCallAndShowRx() {
  clearInterval(callTimerInterval);
  closeModal("video-modal");
  alert("Consultation Ended. Doctor is preparing your digital prescription in the Doctor Portal.");
  switchView("doctor-view");
}

// ==========================================================================
// Doctor Portal & Prescription Generator
// ==========================================================================

function generatePrescription(e) {
  e.preventDefault();
  const name = document.getElementById("rx-patient-name").value;
  const date = document.getElementById("rx-date").value;
  const diagnosis = document.getElementById("rx-diagnosis").value;
  const med1 = document.getElementById("rx-med1").value;
  const dose1 = document.getElementById("rx-dose1").value;
  const dur1 = document.getElementById("rx-dur1").value;
  const advice = document.getElementById("rx-advice").value;

  const outputDiv = document.getElementById("rx-details-output");
  outputDiv.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; font-size: 13px;">
      <div><strong>Patient:</strong> ${name}</div>
      <div><strong>Date:</strong> ${date}</div>
    </div>
    <div style="margin-bottom: 12px; font-size: 13px;"><strong>Diagnosis:</strong> ${diagnosis}</div>
    <div style="background: rgba(255,255,255,0.05); padding: 12px; border-radius: 8px; margin-bottom: 12px; font-size: 13px;">
      <strong>Rx Medications:</strong>
      <p style="color: #38bdf8; margin-top: 4px;">💊 1. ${med1} — ${dose1} (${dur1})</p>
    </div>
    <div style="font-size: 12px; color: #94a3b8;"><strong>Instructions:</strong> ${advice}</div>
    <div style="margin-top: 14px; border-top: 1px dashed #334155; padding-top: 8px; font-size: 11px; color: #10b981;">
      Verified Digital Signature: Dr. Marcus Vance, MD (Lic #MED-884210)
    </div>
  `;

  document.getElementById("rx-preview-card").classList.remove("hidden");
  document.getElementById("rx-preview-card").scrollIntoView({ behavior: 'smooth' });
}

// ==========================================================================
// IT PM Interactive Kanban Board Logic
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
    cardEl.title = "Click to advance status";
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
  card.status = flow[card.status];
  renderKanban();
}

function resetKanban() {
  kanbanCards = [...initialKanbanCards];
  renderKanban();
}

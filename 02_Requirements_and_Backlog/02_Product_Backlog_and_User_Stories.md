# QuickCare — Product Backlog & User Stories

## 1. Backlog Structure Overview
In Agile, we break large concepts down into manageable pieces:
1. **Epic:** A large feature or project area that takes multiple sprints to complete.
2. **User Story:** A small, specific requirement written from the user's perspective.
3. **Acceptance Criteria:** The checklist of conditions that must be met for the story to be considered "Done".
4. **Story Points:** A measure of effort, complexity, and uncertainty (using the Fibonacci scale: 1, 2, 3, 5, 8, 13).

---

## 2. Epic Breakdown for QuickCare (MVP)

* **EPIC-01: User Authentication & Profiles** (Patient & Doctor registration, login, profile setup)
* **EPIC-02: Doctor Discovery & Scheduling** (Search doctors, filter by specialty, select calendar slots)
* **EPIC-03: Video Consultation Room** (Live 1-on-1 video call, mute/unmute, call end)
* **EPIC-04: Payment & Checkout** (Credit card entry, Stripe processing, invoice receipt)
* **EPIC-05: Digital Prescriptions & Medical History** (Doctor writes prescription, patient downloads PDF)

---

## 3. Detailed User Stories & Acceptance Criteria

### 🔹 Story US-101: Patient Registration via OTP
* **Epic:** EPIC-01 (Authentication)
* **Priority:** High (Must-Have)
* **Story Points:** 3 Points
* **User Story:**
  > *As a* new patient,  
  > *I want to* sign up using my mobile phone number and a 6-digit SMS OTP,  
  > *So that* I can quickly create a secure account without remembering complex passwords.
* **Acceptance Criteria (Definition of Done):**
  - [ ] User enters 10-digit phone number.
  - [ ] System sends a 6-digit verification code via SMS within 10 seconds.
  - [ ] Code expires after 5 minutes.
  - [ ] If code is entered correctly, account is created and redirected to Home screen.
  - [ ] If 3 failed attempts occur, user is locked for 15 minutes.

---

### 🔹 Story US-201: Doctor Search & Filtering
* **Epic:** EPIC-02 (Discovery)
* **Priority:** High (Must-Have)
* **Story Points:** 5 Points
* **User Story:**
  > *As a* sick patient,  
  > *I want to* search for doctors by medical specialty (e.g., General Physician, Dermatologist, Pediatrician),  
  > *So that* I can find the right specialist for my health issue.
* **Acceptance Criteria:**
  - [ ] Search bar allows typing specialty or doctor name.
  - [ ] Filter chips displayed for top 5 specialties.
  - [ ] Search results show Doctor Name, Photo, Specialty, Years of Experience, and Consultation Fee.
  - [ ] Results load in under 2 seconds.

---

### 🔹 Story US-301: 1-on-1 Telehealth Video Call
* **Epic:** EPIC-03 (Video Room)
* **Priority:** Critical (Must-Have)
* **Story Points:** 8 Points
* **User Story:**
  > *As an* approved patient,  
  > *I want to* join a secure video room with my doctor at my scheduled appointment time,  
  > *So that* I can receive medical advice remotely.
* **Acceptance Criteria:**
  - [ ] "Join Call" button activates 5 minutes before scheduled start time.
  - [ ] Camera and Microphone permissions requested automatically on first launch.
  - [ ] Call controls available: Toggle Mic (Mute/Unmute), Toggle Camera (On/Off), Switch Front/Back Camera, End Call.
  - [ ] Call session is end-to-end encrypted (HIPAA compliance).
  - [ ] If call drops due to internet, user can reconnect within 2 minutes without re-authenticating.

---

### 🔹 Story US-401: Secure In-App Payment (Stripe)
* **Epic:** EPIC-04 (Payment)
* **Priority:** Critical (Must-Have)
* **Story Points:** 5 Points
* **User Story:**
  > *As a* patient,  
  > *I want to* pay the consultation fee using my Credit/Debit card or Apple Pay / Google Pay,  
  > *So that* my booking is confirmed immediately.
* **Acceptance Criteria:**
  - [ ] Displays clear breakdown: Consultation Fee + Processing Fee = Total Amount.
  - [ ] Card details collected using secure Stripe SDK (no raw card data stored on our servers).
  - [ ] Instant payment receipt sent to user's registered email.
  - [ ] On successful payment, appointment status changes to "Confirmed".

---

### 🔹 Story US-501: Digital Prescription PDF Generation
* **Epic:** EPIC-05 (Prescriptions)
* **Priority:** Medium (Must-Have)
* **Story Points:** 3 Points
* **User Story:**
  > *As a* doctor,  
  > *I want to* enter medications, dosage instructions, and digital signature after a consultation,  
  > *So that* the patient can download an official PDF prescription.
* **Acceptance Criteria:**
  - [ ] Form contains: Medication Name, Dosage, Frequency, Duration (days), and Special Instructions.
  - [ ] System automatically embeds Doctor's License Number and Digital Signature.
  - [ ] Generates a standardized, printable PDF file.
  - [ ] Patient receives a push notification: "Your prescription is ready to download".

---

## 4. Full MVP Backlog & Story Point Summary

| Story ID | Title | Epic | Priority | Story Points | Sprint Target |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **US-101** | Patient Registration (SMS OTP) | Authentication | High | 3 | Sprint 1 |
| **US-102** | Doctor Profile & Verification | Authentication | High | 5 | Sprint 1 |
| **US-201** | Doctor Search & Specialty Filter | Discovery | High | 5 | Sprint 2 |
| **US-202** | Calendar Time-Slot Selection | Scheduling | High | 5 | Sprint 2 |
| **US-401** | Stripe Payment Integration | Payments | Critical | 5 | Sprint 3 |
| **US-301** | 1-on-1 Video Consultation Call | Video Room | Critical | 8 | Sprint 3 |
| **US-501** | Digital Prescription PDF | Prescriptions | Medium | 3 | Sprint 4 |
| **US-601** | Push Notifications (Reminders) | Notifications | Low | 2 | Sprint 4 |
| **TOTAL** | | | | **31 Points** | Sprints 1–4 |

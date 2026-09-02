# QuickCare Telehealth Mobile App — Project Charter

## 1. Executive Summary
* **Project Name:** QuickCare Telehealth Mobile Application (iOS & Android)
* **Project Manager:** Numesh Ravindra (IT Project Manager / Scrum Master)
* **Project Sponsor:** VP of Digital Health
* **Start Date:** September 1, 2026
* **Target Launch Date:** December 15, 2026 (15 Weeks / 4 Sprints)
* **Approved Budget:** Rs. 39,600,000 LKR ($120,000 USD equivalent)

---

## 2. Business Case & Problem Statement
* **Current Problem:** Patients face an average wait time of 4 days for in-person primary care appointments. Minor consultations (e.g., flu, rash, prescription refills) tie up physical clinic rooms unnecessarily.
* **Proposed Solution:** A secure, HIPAA-compliant mobile application allowing patients to search, book, and attend live video consultations with certified doctors in under 15 minutes.
* **Expected Business Value:**
  * Open a direct-to-consumer digital revenue stream (Rs. 14,850 per standard consultation).
  * Onboard 50 certified doctors within 60 days of launch.
  * Reduce in-clinic wait times for urgent patients by 25%.

---

## 3. Project Objectives (SMART)
1. **Specific:** Build and launch iOS and Android apps with video calling, booking, pharmacy delivery, and in-app payment.
2. **Measurable:** Achieve 1,000 completed consultations and a 4.5+ star app rating in the first 30 days.
3. **Achievable:** Utilize existing Twilio (Video API) and Stripe (Payments) SDKs to reduce development time.
4. **Relevant:** Directly aligns with the healthcare network's 2026 Digital Transformation Strategy.
5. **Time-Bound:** Production release by December 15, 2026.

---

## 4. Scope Definition

### In-Scope (MVP - Version 1.0)
* **User Accounts:** Patient & Doctor registration with Phone/Email OTP verification.
* **Doctor Directory:** Search by specialty, availability calendar, verified ratings, and profile bio.
* **Consultation Booking:** Appointment scheduling and real-time calendar sync.
* **Telehealth Video Room:** End-to-end encrypted 1-on-1 video & audio call (powered by Twilio).
* **Payment Gateway:** In-app credit card and digital payment processing (Stripe).
* **Digital Prescriptions:** Doctor generates downloadable/shareable PDF prescription with allergy contraindication checking.
* **Push Notifications & Pharmacy Dispatch:** Appointment reminders and express delivery tracking with driver GPS.

### Out-of-Scope (Deferred to Version 2.0)
* Health insurance automated claims / co-pay direct processing.
* Smartwatch (Apple Watch / Fitbit) real-time continuous vital signs telemetry.
* Multi-language AI voice translation (Sinhala / Tamil / English voice synthesis).
* Automated hospital inpatient admission workflows.

---

## 5. Key Milestones & Timeline

| Milestone | Target Completion | Key Deliverable |
| :--- | :--- | :--- |
| **M1: Discovery & UI/UX Design** | Week 3 | Approved Figma Wireframes & Architecture Spec |
| **M2: Core Development (Sprints 1-4)** | Week 11 | Working MVP on Staging Environment |
| **M3: User Acceptance & QA Testing** | Week 13 | 0 Critical Bugs, HIPAA Security Audit Sign-off |
| **M4: Production Deployment & Launch** | Week 15 | App Store & Google Play Public Release |

---

## 6. Budget & Resource Estimates

| Cost Category | Estimated Cost (LKR) | Estimated Cost (USD) | Notes |
| :--- | :--- | :--- | :--- |
| **Development Team (6 People)** | Rs. 29,700,000 | $90,000 | 1 Tech Lead, 2 Mobile/Web Devs, 1 Backend Dev, 1 QA, 1 Designer |
| **Cloud & 3rd-Party APIs** | Rs. 2,640,000 | $8,000 | AWS Hosting, Twilio Video, Stripe Fees |
| **Security & Compliance Audit** | Rs. 3,960,000 | $12,000 | External HIPAA / Penetration Testing |
| **Contingency Buffer (10%)** | Rs. 3,300,000 | $10,000 | Managed reserve for unexpected risks |
| **Total Approved Budget** | **Rs. 39,600,000** | **$120,000** | Favorable variance achieved at closure |

---

## 7. Approvals & Sign-off

| Role | Name | Signature | Date |
| :--- | :--- | :--- | :--- |
| **Project Sponsor** | VP of Digital Health | *Signed* | Sept 1, 2026 |
| **Lead Architect** | Ranjith Perera | *Signed* | Sept 1, 2026 |
| **IT Project Manager** | Numesh Ravindra | *Signed* | Sept 1, 2026 |

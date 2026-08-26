# QuickCare — Risk Management (RAID Log) & Quality Assurance

## 1. RAID Log (Risks, Assumptions, Issues, Dependencies)

A **RAID Log** is the central tool used by an IT Project Manager to track uncertainties and ensure project delivery stays on schedule and budget.

### 🔴 Risk Register & Mitigation Matrix

* **Probability (P):** 1 (Low) to 5 (High)
* **Impact (I):** 1 (Low) to 5 (Critical)
* **Risk Score:** $P \times I$ (1–25)

| Risk ID | Category | Risk Description | P | I | Score | Mitigation Strategy (PM Action) | Owner | Status |
| :--- | :--- | :--- | :---: | :---: | :---: | :--- | :--- | :---: |
| **RSK-01** | Technical | Twilio Video latency/call drop on slow 3G/4G patient connections | 4 | 4 | **16 (High)** | Implemented automatic bitrate downscaling and 120s auto-reconnect fallback without session drop. | Lead Architect | 🟢 Mitigated |
| **RSK-02** | Compliance | HIPAA Non-Compliance penalty risk during video & data transfer | 2 | 5 | **10 (Med)** | Contracted certified external HIPAA auditor; enforced AES-256 encryption at rest and TLS 1.3 in transit. | IT PM | 🟢 Closed |
| **RSK-03** | Scope Creep | Sponsor requesting automated insurance billing integration during Sprint 3 | 4 | 4 | **16 (High)** | Enforced Scope Management procedure: deferred insurance claims to Version 2.0 with formal sponsor sign-off. | IT PM | 🟢 Resolved |
| **RSK-04** | Resource | iOS Developer unavailable due to illness in Sprint 2 | 3 | 3 | **9 (Med)** | Re-allocated backend dev to assist with API contracts; paired Android dev on shared Flutter/native logic. | IT PM | 🟢 Resolved |
| **RSK-05** | External | Apple App Store review rejection due to medical privacy guidelines | 3 | 4 | **12 (Med)** | Conducted pre-submission compliance audit against Apple Guideline 5.1 (Medical/Health Apps) prior to release. | QA Lead | 🟢 Closed |

---

## 2. Issues Log (Current Problems Resolved)

| Issue ID | Date Logged | Problem Encountered | Impact on Project | Corrective Action Taken | Resolution Date |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **ISS-01** | Oct 12, 2026 | Doctor appointment slot overlap bug (Race condition during simultaneous booking) | High (Double booking risk) | Implemented Redis distributed locking with a 3-minute temporary reservation hold during checkout. | Oct 15, 2026 |
| **ISS-02** | Nov 02, 2026 | SMS OTP delivery delay (> 60 seconds) with initial SMS provider | Med (User drop-off) | Switched SMS gateway provider to Twilio Verify with 99.9% sub-5-second delivery SLA. | Nov 04, 2026 |

---

## 3. Quality Assurance & Testing Plan

### 📋 QA Test Execution Summary

* **Total Test Cases Executed:** 142 Test Cases
* **Passed:** 141 (99.3%)
* **Failed:** 0
* **Deferred (Minor UI polish):** 1

| Test Suite | Scope | Target Pass Rate | Actual Pass Rate | Sign-Off Status |
| :--- | :--- | :---: | :---: | :---: |
| **Unit & Integration Tests** | Backend API, Payment & Authentication | 100% | 100% | ✅ Signed Off |
| **End-to-End (E2E) Testing** | Booking to Video Call to Prescription PDF | 100% | 100% | ✅ Signed Off |
| **Security & Penetration** | OWASP Top 10, HIPAA Encryption | 100% | 100% | ✅ Signed Off |
| **Cross-Device Usability** | iOS (iPhone 12 to 15 Pro) & Android (Samsung, Pixel) | 95% | 98.6% | ✅ Signed Off |

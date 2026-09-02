# QuickCare Telehealth App — IT Project Management Portfolio

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel_App-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://quickcare-telehealth.vercel.app)
![Project Status](https://img.shields.io/badge/Status-Completed_MVP-success?style=for-the-badge)
![Methodology](https://img.shields.io/badge/Methodology-Agile%20%2F%20Scrum-blue?style=for-the-badge)
![Duration](https://img.shields.io/badge/Duration-15_Weeks_(4_Sprints)-orange?style=for-the-badge)
![Budget](https://img.shields.io/badge/Budget-Rs._39,600,000_LKR-green?style=for-the-badge)
![Target Platforms](https://img.shields.io/badge/Platforms-iOS_%7C_Android_%7C_Web-purple?style=for-the-badge)

---

## Live Interactive Application Demo

Experience the full interactive simulation directly in your browser:  
[Launch Live Vercel App](https://quickcare-telehealth.vercel.app) *(or open [index.html](file:///c:/Users/USER/Desktop/IT%20Pm%20Project%2002/index.html) locally)*

### What You Can Test Live:
1. **Patient Mobile Experience:** Real-time doctor search (*search "fever" or "skin"*), verified patient ratings modal, 15-minute consult booking, Stripe checkout simulation (Rs. 15,675 fee breakdown), express pharmacy delivery tracker with driver GPS, and live video consultation room with webcam & mic controls.
2. **Doctor Consultation Portal:** Weekly schedule manager (Mon-Fri), patient queue switcher, penicillin allergy high-alert banner, contraindication auto-detection engine, voice dictation notes, and official printable digital prescription pad.
3. **IT PM & Scrum Master Control Center:** Interactive Agile Kanban board (drag & drop cards), Agile Planning Poker Fibonacci estimation game (`1` to `13` & `Break`), Sprint Retrospective sticky note board with upvoting, live budget reconciliation (Rs. 38.41M spend, +Rs. 1.188M favorable variance), Agile Earned Value Management (EVM) calculator (PV, EV, AC, CPI, SPI), RAID risk matrix calculator ($P \times I$), RACI matrix, 15-min Daily Standup Runner, and one-click Executive Status Report & CSV Backlog Exporter!

---

## Executive Summary

**QuickCare** is an end-to-end agile software development project for a HIPAA-compliant telehealth application tailored for modern digital healthcare delivery. As the **IT Project Manager & Scrum Master**, I led a cross-functional Scrum team of 6 (Lead Architect, Frontend & Backend Engineers, UI/UX Designer, QA Lead, and Product Owner) across a 15-week delivery lifecycle to launch a Minimum Viable Product (MVP).

The platform enables patients to book video consultations with licensed doctors in under 15 minutes, receive digital prescriptions, track medication delivery, and process payments securely in-app.

---

## Complete IT PM Documentation Directory

This repository contains the complete suite of industry-standard IT Project Management deliverables:

| Phase / Category | Documentation File | Key Deliverables & Methodologies Included |
| :--- | :--- | :--- |
| **01. Initiation** | [01_Project_Charter.md](file:///c:/Users/USER/Desktop/IT%20Pm%20Project%2002/01_Project_Initiation/01_Project_Charter.md) | Business Case, SMART Objectives, Rs. 39.6M ($120k USD) Budget Breakdown, In-Scope vs Out-of-Scope Boundaries |
| **02. Requirements** | [02_Product_Backlog_and_User_Stories.md](file:///c:/Users/USER/Desktop/IT%20Pm%20Project%2002/02_Requirements_and_Backlog/02_Product_Backlog_and_User_Stories.md) | 5 Epics, 12 Detailed User Stories, Given/When/Then Acceptance Criteria, Fibonacci Story Points (122 Pts) |
| **03. Governance** | [03_RACI_Matrix_and_Team_Plan.md](file:///c:/Users/USER/Desktop/IT%20Pm%20Project%2002/03_Team_and_Governance/03_RACI_Matrix_and_Team_Plan.md) | 6-Member Scrum Team Structure, Complete RACI Matrix, Agile Ceremonies Cadence |
| **04. Sprint Execution** | [04_Sprint_Plan_and_Ceremonies.md](file:///c:/Users/USER/Desktop/IT%20Pm%20Project%2002/04_Sprint_Execution/04_Sprint_Plan_and_Ceremonies.md) | Sprints 1-4 Execution Logs, 30.5-Pt Velocity, Daily Standup Blocker Resolutions, Sprint Burndown Chart |
| **05. Risk & Quality** | [05_Risk_Register_and_QA_Plan.md](file:///c:/Users/USER/Desktop/IT%20Pm%20Project%2002/05_Risk_and_Quality/05_Risk_Register_and_QA_Plan.md) | RAID Log ($P \times I$ Scoring), 4 Mitigated Critical Risks, 142 QA Test Cases, HIPAA Security Audit |
| **06. Closure** | [06_Release_and_Lessons_Learned.md](file:///c:/Users/USER/Desktop/IT%20Pm%20Project%2002/06_Release_and_Closure/06_Release_and_Lessons_Learned.md) | App Store & Google Play Launch Checklist, Rs. 1,188,000 Favorable Cost Variance, Post-Mortem Retrospective |
| **07. Interview Prep** | [07_IT_PM_Interview_Cheat_Sheet.md](file:///c:/Users/USER/Desktop/IT%20Pm%20Project%2002/07_Interview_Preparation/07_IT_PM_Interview_Cheat_Sheet.md) | Top 6 IT PM / Scrum Master Interview Questions with STAR Method Model Answers |

---

## System Architecture & Workflow

```mermaid
sequenceDiagram
    autonumber
    actor Patient
    actor Doctor
    participant App as QuickCare Mobile App
    participant Server as Backend API (AWS)
    participant Stripe as Stripe Gateway
    participant Twilio as Twilio Video Room

    Patient->>App: 1. Search Specialty & Select Doctor
    Patient->>App: 2. Pick Time Slot & Enter Card
    App->>Stripe: 3. Authorize Payment (Rs. 15,675)
    Stripe-->>App: Payment Success Token
    App->>Server: 4. Confirm Appointment
    Server-->>Doctor: Push Notification (New Booking)
    
    Note over Patient,Doctor: Scheduled Consultation Time
    Patient->>Twilio: 5. Join Encrypted Video Room
    Doctor->>Twilio: 6. Join Consultation
    Doctor->>App: 7. Submit Digital Prescription
    App-->>Patient: 8. Download PDF Prescription & Track Delivery
```

---

## Key Project Metrics & Performance

| Metric | Target Baseline | Actual Result | Variance / Status |
| :--- | :--- | :--- | :--- |
| **Delivery Schedule** | 15 Weeks (4 Sprints) | 15 Weeks | [On Time] 100% On Time |
| **Budget Variance** | Rs. 39,600,000 LKR ($120k) | Rs. 38,412,000 LKR ($116.4k) | [Favorable] +Rs. 1,188,000 (3% Under Budget) |
| **Sprint Velocity** | 30 Points / Sprint | Avg. 30.5 Points / Sprint | [Predictable] High Delivery Predictability |
| **QA Test Pass Rate** | > 98.0% | 99.2% (141/142 Test Cases) | [Zero Defects] 0 Critical Bugs at Release |
| **App Store Rating** | > 4.5 Stars | 4.7 Stars (first 500 reviews) | [Exceeded] Benchmark Exceeded |
| **Agile EVM (CPI / SPI)** | CPI = 1.00, SPI = 1.00 | CPI = 1.03, SPI = 1.00 | [Efficient] Under Budget & On Schedule |

---

## Core IT PM & Scrum Skills Demonstrated

* **Agile Frameworks:** Scrum, Kanban, SDLC (Software Development Life Cycle), User Story Mapping.
* **Agile Ceremonies:** Sprint Planning, Daily Standup, Backlog Refinement, Sprint Review, Retrospective.
* **Estimation & Tracking:** Fibonacci Planning Poker, Story Point Velocity, Burndown / Burnup Charts, Agile EVM (Earned Value Management).
* **Risk & Governance:** RAID Log, $P \times I$ Matrix, RACI Charting, Scope Creep Control, Vendor SLA Management.
* **Compliance & Financials:** HIPAA Security Rule, PCI-DSS Level 1, CapEx/OpEx Budget Reconciliation, Executive Status Reporting.

---

## Project Author

* **Author:** Numesh Ravindra
* **Role:** IT Project Manager / Scrum Master
* **GitHub Repository:** [Numesh20/quickcare-telehealth](https://github.com/Numesh20/quickcare-telehealth)
* **Live Web App:** [quickcare-telehealth.vercel.app](https://quickcare-telehealth.vercel.app)

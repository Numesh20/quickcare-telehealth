# QuickCare — Team Structure, RACI Matrix & Governance

## 1. Scrum Team Structure & Roles

In this project, we utilize an Agile Scrum cross-functional team of 6 members:

| Role | Name / Title | Primary Responsibilities |
| :--- | :--- | :--- |
| **Project Manager / Scrum Master** | IT Project Manager | Facilitates agile ceremonies, removes team blockers, tracks budget & schedule, manages risks. |
| **Product Owner (PO)** | Product Manager (Health Tech) | Owns the product vision, writes user stories, prioritizes the backlog, accepts completed work. |
| **Lead Full-Stack / Cloud Engineer** | Senior Backend Engineer | Architect AWS backend, Twilio Video integration, and secure API endpoints. |
| **Mobile App Developers (2)** | iOS (Swift) & Android (Kotlin) | Build native mobile client apps, UI components, and integrate Stripe SDK. |
| **UI/UX Product Designer** | Lead UI/UX Designer | Creates Figma interactive prototypes, patient/doctor design systems, user flows. |
| **QA / Test Automation Engineer** | QA Lead | Writes automated test scripts, performs cross-device manual testing, security checks. |

---

## 2. RACI Matrix (Responsibility Assignment)

The RACI matrix clarifies who does what for each project deliverable:
* **R = Responsible:** The person who does the actual work.
* **A = Accountable:** The single person with final approval and ownership.
* **C = Consulted:** Subject matter experts who provide input.
* **I = Informed:** People kept updated on progress.

| Deliverable / Activity | Project Sponsor | Product Owner | IT PM / Scrum Master | Lead Engineer | Mobile Devs | QA Lead | UI/UX Designer |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Project Charter & Budget Approval** | **A** | C | **R** | C | I | I | I |
| **Backlog Prioritization & User Stories**| I | **A / R** | C | C | I | I | C |
| **Figma UI/UX Designs & Wireframes** | I | A | C | C | C | I | **R** |
| **Sprint Planning & Task Estimation** | I | C | **A** | **R** | **R** | **R** | C |
| **Mobile App & Backend Development** | I | I | C | **A** | **R** | I | I |
| **Quality Assurance & Bug Verification**| I | C | C | C | C | **A / R** | I |
| **Risk & Issue Management (RAID Log)** | I | C | **A / R** | C | C | C | I |
| **Sprint Review & Stakeholder Demo** | I | **A** | **R** | C | C | C | C |
| **Production Release & App Store Launch**| I | A | **A / R** | **R** | **R** | C | I |

---

## 3. Agile Ceremonies & Communication Plan

| Ceremony | Cadence | Duration | Attendees | Purpose / Goal |
| :--- | :--- | :--- | :--- | :--- |
| **Sprint Planning** | Every 2 weeks (Monday morning) | 1 hour | Entire Scrum Team | Select stories from backlog, confirm story points, commit to sprint goal. |
| **Daily Standup (Scrum)**| Daily (9:30 AM) | 15 mins | Entire Scrum Team | 3 Questions: What did you do yesterday? What will you do today? Any blockers? |
| **Backlog Refinement** | Mid-sprint (Wednesday) | 45 mins | PO, PM, Tech Lead | Clarify acceptance criteria, break down complex stories, estimate upcoming items. |
| **Sprint Review (Demo)** | Last Friday of Sprint | 45 mins | Team + Stakeholders | Live demo of working software on real mobile devices to gather feedback. |
| **Sprint Retrospective** | Last Friday of Sprint | 30 mins | Scrum Team only | Discuss: What went well? What went wrong? What process improvement will we try next? |
| **Executive Status Report**| Bi-weekly (Written PDF/Email) | N/A | Project Sponsor, VP | Summary of milestones, budget burn, key risks, and release forecast. |

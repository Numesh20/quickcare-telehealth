# QuickCare — Team Structure, RACI Matrix & Governance

## 1. Scrum Team Structure & Roles

In this project, we utilize an Agile Scrum cross-functional team of 6 members:

| Role | Name / Title | Primary Responsibilities |
| :--- | :--- | :--- |
| **Project Manager / Scrum Master** | Numesh Ravindra (IT PM) | Facilitates agile ceremonies, removes team blockers, tracks budget & schedule, manages risks, oversees EVM. |
| **Product Owner (PO)** | Priyanka Nanayakkara | Owns product vision, writes user stories, prioritizes backlog, accepts completed work. |
| **Lead Full-Stack / Cloud Engineer** | Ranjith Perera (Lead Dev) | Architects AWS cloud infrastructure, Twilio Video integration, and secure API endpoints. |
| **Frontend & Mobile Developer** | Eranga Tennakoon (FE Dev) | Builds client application interfaces, responsive components, and integrates Stripe SDK. |
| **QA / Security Test Lead** | Nadeeka Silva (QA Lead) | Writes automated test scripts, performs cross-device validation, HIPAA security checks. |
| **UI/UX Product Designer** | Lahiru Fernando (UI/UX) | Creates Figma interactive prototypes, design system tokens, patient/doctor user flows. |

---

## 2. RACI Matrix (Responsibility Assignment)

The RACI matrix clarifies who does what for each project deliverable:
* **R = Responsible:** The person who does the actual work.
* **A = Accountable:** The single person with final approval and ownership.
* **C = Consulted:** Subject matter experts who provide input.
* **I = Informed:** People kept updated on progress.

| Deliverable / Activity | Project Sponsor | Product Owner | IT PM / Scrum Master | Lead Engineer | Frontend Dev | QA Lead | UI/UX Designer |
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
| **Daily Standup (Scrum)**| Daily (9:00 AM) | 15 mins | Entire Scrum Team | 3 Questions: What did you do yesterday? What will you do today? Any blockers? |
| **Backlog Refinement** | Mid-sprint (Wednesday) | 45 mins | PO, PM, Tech Lead | Clarify acceptance criteria, break down complex stories, estimate upcoming items. |
| **Sprint Review (Demo)** | Last Friday of Sprint | 45 mins | Team + Stakeholders | Live demo of working software on real devices to gather feedback. |
| **Sprint Retrospective** | Last Friday of Sprint | 30 mins | Scrum Team only | Discuss: What went well? What went wrong? What process improvement will we try next? |
| **Executive Status Report**| Bi-weekly (Written Brief / PDF) | N/A | Project Sponsor, VP | Summary of milestones, budget burn, EVM metrics (CPI/SPI), and release forecast. |

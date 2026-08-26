# QuickCare — IT Project Manager Interview Cheat Sheet & STAR Guide

This guide prepares you to answer the most common IT Project Manager & Scrum Master interview questions using your **QuickCare Telehealth** project as real-world evidence.

---

## 🎯 The STAR Interview Framework

Always structure your behavioral interview answers using the **STAR** method:
* **S - Situation:** Set the scene (project context, industry, team size, constraints).
* **T - Task:** Explain your specific responsibility or the challenge faced.
* **A - Action:** Describe the exact steps and tools you used (RACI, Jira, Daily Standup, RAID Log).
* **R - Result:** Quantify the outcome (delivered on time, $3.6k under budget, 4.7-star rating).

---

## 🎤 Top 6 IT PM Interview Questions & Model Answers

### Q1: "Tell me about yourself and a recent IT project you managed."
* **Model Answer:**
  > *"I am an IT Project Manager with a strong foundation in Agile/Scrum delivery. Recently, I managed the end-to-end launch of QuickCare, a HIPAA-compliant telehealth mobile application. As the IT PM and Scrum Master, I led a cross-functional team of 6 engineers and designers across a 15-week lifecycle. I structured our work across 5 core Epics and 4 two-week sprints, maintaining a predictable velocity of 30 story points. We successfully launched on both iOS and Android on schedule, achieving a 4.7-star rating and finishing 3% under our $120,000 budget."*

---

### Q2: "How do you handle scope creep when stakeholders request last-minute features?"
* **Model Answer (Using QuickCare Scenario):**
  > *"I use a collaborative 'Yes, and here is the trade-off' approach based on the Iron Triangle of Project Management (Time, Cost, Scope). For example, during Sprint 3 of QuickCare, executive stakeholders requested an AI-powered symptom checker. Rather than saying a flat 'no' or accepting it and burning out the team, I explained that adding this feature mid-flight would delay our hard Dec 15 launch by 4 weeks. I proposed prioritizing the AI checker as the #1 item in our Version 2.0 release backlog immediately after MVP launch. The sponsor appreciated the transparency and agreed to maintain the original launch date."*

---

### Q3: "How do you deal with a developer who is blocked or behind schedule?"
* **Model Answer:**
  > *"I use our Daily 15-minute Standups to identify blockers early before they impact the sprint burndown. For instance, in Sprint 3, our mobile developer was blocked waiting for Stripe sandbox credentials from security. I took immediate ownership of the impediment, coordinated with the security lead, and delivered the keys within 30 minutes. If a task is genuinely more complex than estimated, we use backlog refinement to split the story or negotiate with the Product Owner to defer lower-priority items so the sprint goal is protected."*

---

### Q4: "What is your approach to Risk Management on an IT project?"
* **Model Answer:**
  > *"I maintain a live RAID Log (Risks, Assumptions, Issues, Dependencies) throughout the project lifecycle. I score every risk based on Probability and Impact ($P \times I$). On QuickCare, our highest-rated risk was potential video dropouts on low-bandwidth 3G connections ($Score = 16/25$). We proactively mitigated this during Sprint 3 by implementing automatic video downscaling and an auto-reconnect fallback without session drops, which passed all 142 QA test cases."*

---

### Q5: "What is the difference between Scrum and Waterfall, and how do you decide which to use?"
* **Model Answer:**
  > *"Waterfall is sequential and best suited for projects with fixed, well-defined requirements and strict regulatory handoffs (like building physical data centers). Scrum is iterative and ideal for software products where requirements evolve based on user feedback. For QuickCare, we utilized Agile Scrum because building a mobile app requires continuous testing, bi-weekly demos, and rapid user feedback across 2-week sprints."*

---

### Q6: "How do you measure project success at closure?"
* **Model Answer:**
  > *"I evaluate success across four key dimensions:  
  > 1. **Schedule:** Met our 15-week target launch date.  
  > 2. **Budget:** Finished at $116,400 against a $120,000 budget ($3,600 favorable variance).  
  > 3. **Quality:** 0 Critical/High bugs at launch with a 99.3% test pass rate.  
  > 4. **User & Business Value:** Achieved a 4.7-star rating and onboarded over 50 doctors in the first 60 days."*

---

## 📌 Key PM Terms Quick Reference

| Term | Definition in 1 Sentence |
| :--- | :--- |
| **Epic** | A large user requirement that spans multiple sprints. |
| **User Story** | A feature written from the user's perspective: *As a [User], I want [Feature], so that [Benefit].* |
| **Velocity** | The average number of Story Points a Scrum team completes in one sprint (~30 pts). |
| **Burndown Chart** | A graph showing remaining story points day-by-day towards the sprint goal. |
| **RACI Matrix** | Clarifies who is **R**esponsible, **A**ccountable, **C**onsulted, and **I**nformed. |
| **RAID Log** | Tracks **R**isks, **A**ssumptions, **I**ssues, and **D**ependencies. |
| **UAT** | **User Acceptance Testing:** Final business validation before production release. |

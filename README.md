# EduAlphka

> **Language / Idioma:** **English** | [Português (Brasil)](README.pt-BR.md)
>
> *Se você prefere ler esta documentação em português, [clique aqui](README.pt-BR.md).*

<div align="center">
	<a href="https://github.com/Alphka/EduAlphka">
		<img src="src/app/icon.svg" alt="EduAlphka logo" height="140">
	</a>
	<h3>Online Platform for Creating, Applying, and Grading Exams</h3>
	<p>
		A full-stack Next.js application that lets educators and recruiters build custom online<br>
		tests, distribute them through secure invite links, and grade them automatically<br>
		or by hand, all while keeping the exam timer completely out of the candidate's control.
	</p>
</div>

<br>

<p align="center">
	<img alt="License" src="https://img.shields.io/badge/License-ISC-5271FF?style=for-the-badge">
	<img alt="Next.js" src="https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=next.js&logoColor=white">
	<img alt="React" src="https://img.shields.io/badge/React-19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB">
	<img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white">
	<img alt="MongoDB" src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white">
	<img alt="Mantine" src="https://img.shields.io/badge/Mantine-7-339AF0?style=for-the-badge&logo=mantine&logoColor=white">
	<img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind%20CSS-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white">
	<img alt="Vercel" src="https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white">
</p>

## Table of Contents
- [EduAlphka](#edualphka)
  - [Table of Contents](#table-of-contents)
  - [About the Project](#about-the-project)
    - [Context \& Problem](#context--problem)
    - [The Solution](#the-solution)
  - [Key Features](#key-features)
  - [System Architecture \& Data Flow](#system-architecture--data-flow)
    - [Architectural Overview](#architectural-overview)
    - [Authentication \& Session Security](#authentication--session-security)
    - [Anti-Cheating: Server-Enforced Exam Timing](#anti-cheating-server-enforced-exam-timing)
    - [Grading \& Reporting Engine](#grading--reporting-engine)
    - [Invite-Based Access Control](#invite-based-access-control)
    - [Scheduled Data Housekeeping](#scheduled-data-housekeeping)
  - [Data Model](#data-model)
  - [Tech Stack](#tech-stack)
    - [Frontend](#frontend)
    - [Backend \& Data](#backend--data)
  - [Project Structure](#project-structure)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Environment Variables](#environment-variables)
    - [Running the Application](#running-the-application)
  - [Screenshots](#screenshots)
    - [Login \& Registration](#login--registration)
    - [Exam Creation Form](#exam-creation-form)
    - [Professor Dashboard](#professor-dashboard)
    - [Correction screen](#correction-screen)
  - [Ideas for the Future](#ideas-for-the-future)
  - [Academic Context \& Credits](#academic-context--credits)
  - [License](#license)

## About the Project

### Context & Problem
Remote and distance-based assessment has grown sharply in both educational and corporate settings, which makes the automated application and correction of tests increasingly necessary. Manually scheduling, distributing, timing, and grading exams, especially at scale, is slow, error-prone, and hard to keep fair for every candidate.

### The Solution
**EduAlphka** is a web platform for creating, applying, and correcting online tests, aimed at both educational assessments and corporate hiring processes. A **professor** (exam applicator) can assemble a test out of objective (multiple-choice) and dissertative (essay) questions, mark any of them as optional, define a time limit, and share it through a unique invite link. A **candidate** answers the test within that time window, which is enforced server-side rather than by the browser, and gets immediate feedback on the objective questions as soon as they submit. If the exam has required dissertative questions, the final grade is only published once the professor corrects them by hand.

The project was designed to be used both by schools evaluating students and by companies running selection processes, without needing a different tool for each context.

## Key Features
- **Two account types**: professor (exam applicator) and candidate, each with role-based access to routes and actions.
- **Custom exam builder**: title, description, subject, duration, optional start date, optional expiration date, and an ordered list of questions.
- **Two question types**: multiple choice (with automatically graded correct options) and dissertative (free-text, manually graded).
- **Required vs. optional questions**: optional questions never affect the final grade and are never queued for manual correction.
- **Secure invite links**: each exam gets a unique, regenerable invite token, and access can be revoked per candidate through a blacklist that survives new invite links.
- **Exam management dashboard**: list created exams, edit them while no candidate has started, delete them, and track which candidates have submitted and which submissions are still pending correction.
- **Manual correction workflow**: professors grade dissertative answers, attach written feedback, and publish results when ready. Multiple correctors are supported through the shared `Submit` document.
- **Server-enforced timer**: the countdown a candidate sees is just a UI convenience. The platform independently recomputes whether the exam window is still open on every request (see [Anti-Cheating](#anti-cheating-server-enforced-exam-timing)).
- **Immediate and partial feedback**: objective results are shown right after submission. If a dissertative correction is still pending, the candidate sees a partial grade until it's published.
- **Exam analytics**: average grade, average completion time, and per-question accuracy are computed through MongoDB aggregation pipelines and rendered with Recharts and Mantine Charts.
- **In-app notifications**: candidates are notified when their dissertative answers finish being corrected, and the preference can be toggled per user.
- **Password recovery by e-mail**: a one-time verification code is sent via Gmail SMTP to reset a forgotten password.
- **Scheduled data housekeeping**: a weekly job removes expired sessions, verification codes, and any document left orphaned by a deleted user or exam.
- **Responsive, accessible UI**: built with Mantine and Tailwind CSS, following the accessibility and responsiveness requirements defined in the project's software plan.

## System Architecture & Data Flow

### Architectural Overview
EduAlphka is built on the **Next.js App Router**, combining server-rendered pages, Server Actions for mutations, and Route Handlers for the maintenance API. All persistence goes through **Mongoose** into a **MongoDB Atlas** cluster.

```mermaid
flowchart TD
    subgraph Clients["Clients"]
        Prof["Professor / Recruiter<br/>(creates and corrects exams)"]
        Cand["Candidate<br/>(takes exams via invite link)"]
    end

    subgraph App["EduAlphka - Next.js 15 (App Router)"]
        MW["Middleware<br/>Token propagation + security headers"]
        UI["Server & Client Components<br/>React 19, Mantine, Tailwind CSS"]
        SA["Server Actions & Route Handlers<br/>auth, exam CRUD, submission, correction"]
        Cron["/api/cron<br/>Scheduled maintenance endpoint"]
    end

    subgraph Data["MongoDB Atlas (Mongoose ODM)"]
        Users[("Users & Sessions")]
        Exams[("Exams, Questions & Invites")]
        Submits[("Submits & Answers")]
    end

    Mail["Nodemailer (Gmail SMTP)<br/>Password recovery codes"]

    Prof --> MW
    Cand --> MW
    MW --> UI
    UI --> SA
    SA --> Users
    SA --> Exams
    SA --> Submits
    SA --> Mail
    Cron -->|Vercel Cron, Mondays 00:00 UTC| SA
    SA -.->|cascading cleanup| Users
    SA -.-> Exams
    SA -.-> Submits
```

### Authentication & Session Security
- On login or registration, the server issues a 96-character hexadecimal token (`crypto.randomBytes(48)`) and persists it in a `Session` document together with the user agent and an expiration date one month out.
- The token is set as a cookie and also accepted as a `Bearer` header; the middleware validates its shape with a strict regular expression requiring exactly 96 hexadecimal characters (`^[a-fA-F0-9]{96}$`) before forwarding it to the rest of the app.
- Passwords are never stored in plain text. They are hashed with **HMAC-SHA512**, keyed by a server-only salt:

$$
\text{passwordHash} = \text{HMAC-SHA512}(\text{password},\ \text{salt})
$$

- Every response carries hardened headers set in the middleware and `next.config.ts`: `Referrer-Policy: origin-when-cross-origin`, `X-Frame-Options: DENY`, `X-XSS-Protection`, and `X-Content-Type-Options: nosniff`.
- Logging out deletes the `Session` document server-side and clears the cookie, so a stolen token stops working immediately after logout.

### Anti-Cheating: Server-Enforced Exam Timing
One of the platform's original requirements was a time limit that the candidate cannot manipulate. Instead of trusting a client-side countdown, EduAlphka records a `StartedExam` document the moment a candidate opens a test and recomputes the deadline from that timestamp on every request:

$$
\text{deadline} = \text{startedExam.createdAt} + \text{exam.duration (minutes)}
$$

$$
\text{isExpired} = (\text{now} > \text{deadline})\ \lor\ (\text{now} > \text{exam.expiresAt})
$$

Because the comparison always happens against the timestamp stored in the database, never against a value sent by the browser, pausing the tab, changing the device clock, or editing the client-side timer has no effect on whether the platform still accepts answers.

### Grading & Reporting Engine
Grades and statistics are computed with MongoDB aggregation pipelines rather than being cached client-side, so they always reflect the current state of the submissions.

Let $Q_r$ be the set of an exam's **required** questions.

**Candidate score**: the count of required questions answered correctly (dissertative answers only count once their correction is published):

$$
\text{grade} = \sum_{q \in Q_r} \mathbb{1}\left[\text{answer}(q)\ \text{is correct}\right]
$$

**Average grade for an exam** (only published submissions are counted when the exam has required dissertative questions):

$$
\overline{\text{grade}} = \frac{\sum \text{correctAnswers}}{\text{totalCandidates}}
$$

**Per-question accuracy**, used to surface the questions candidates struggle with the most:

$$
\text{accuracy}_q = \frac{\text{correctAnswers}_q}{\text{totalAnswers}_q} \times 100
$$

**Average completion time**, derived from the gap between starting and submitting an exam:

$$
\overline{t} = \text{avg}\left(\text{submit.createdAt} - \text{startedExam.createdAt}\right)
$$

### Invite-Based Access Control
Candidates never browse a public list of exams. Each exam owns a unique `ExamInvite` token; the professor shares that link, and the platform associates the candidate with the exam on first access. Revoking a candidate moves their ID into the exam's `disallowedCandidates` blacklist, so generating a brand-new invite link does **not** let a removed candidate back in.

### Scheduled Data Housekeeping
A Vercel Cron job hits `GET /api/cron` every Monday at 00:00 UTC (`vercel.json`). It cascades through the collections to delete:
- expired or orphaned sessions and password-recovery codes;
- exams whose owner no longer exists;
- invites, started-exam records, and notifications tied to a deleted exam or user;
- submissions and answers tied to a deleted exam or submission.

This keeps the database free of orphaned documents without requiring manual cleanup, and keeps storage costs predictable on a serverless deployment.

## Data Model

<details>
<summary><strong>Entity-relationship diagram</strong> (click to expand)</summary>

```mermaid
erDiagram
    Session {
        ObjectId id PK
        String(96) token
        ObjectId user FK
        String(255) userAgent
        Date createdAt
        Date expiresAt
    }

    VerificationCode {
        ObjectId id PK
        ObjectId user FK
        String(10) code
        Date createdAt
        Date expiresAt
    }

    Notification {
        ObjectId id
        string title
        string content
        User user
        Exam exam
        User owner
        Date createdAt
        Date readAt
    }

    User {
        ObjectId id PK
        String(255) name
        String(255) email
        String(255) normalizedEmail
        String(30) username
        String(255) password
        String(255) accountType
        Date createdAt
        Date updatedAt
        Object settings
    }
    User 1--0+ Session : creates
    User 1--1+ VerificationCode : requests
    User 1+--0+ Notification : receives
    User 1--1+ Notification : sends
    User 1--0+ Exam : creates
    User 0+--0+ Exam : participates
    User 1--0+ StartedExam : starts
    User 1--0+ Submit : performs

    StartedExam {
        ObjectId id PK
        ObjectId exam FK
        ObjectId user FK
        Date createdAt
    }
    StartedExam 1--0+ Exam : refers

    Exam {
        ObjectId id PK
        ObjectId owner FK
        String(255) title
        String(355) description
        String(255) subject
        Number duration
        ObjectId[] candidates FK
        ObjectId[] disallowedCandidates FK
        Date createdAt
        Date updatedAt
        Date expiresAt
        Date startsAt
    }
    Exam 1--1+ ExamInvite : contains
    Exam 1--1+ Question : contains
    Exam 1--0+ Submit : allows

    ExamInvite {
        ObjectId id PK
        String(96) token
        ObjectId exam FK
        Date createdAt
    }

    Question {
        ObjectId id PK
        String(255) type
        String(2000) text
        Boolean isRequired
        ObjectId correctAnswer FK
        String(2000) feedback
    }
    Question 1--0+ Answer : allows
    Question 1--0+ QuestionOption : contains

    QuestionOption {
        ObjectId id PK
        String(255) text
    }

    Answer {
        ObjectId id PK
        String(255) type
        ObjectId submit FK
        ObjectId question FK
        ObjectId option FK
        String(2000) content
        Boolean isCorrect
        String(2000) feedback
        Date createdAt
        Date updatedAt
    }
    Answer 1--zero or one QuestionOption : contains

    Submit {
        ObjectId id PK
        ObjectId user FK
        ObjectId exam FK
        Date createdAt
        Date publishedAt
    }
```

</details>

The full software plan also includes a conceptual diagram and a class diagram (with methods such as `isExpired()`, `getAverageGrade()`, and `getQuestionCorrectPercentage()`) under [`/diagram`](diagram), exported from the same MongoDB schemas that ship in [`src/models`](src/models).

## Tech Stack

### Frontend
- **[Next.js 15](https://nextjs.org/)** (App Router, Turbopack in development): hybrid rendering and file-system routing.
- **[React 19](https://react.dev/)**: component-driven UI.
- **[TypeScript](https://www.typescriptlang.org/)**: static typing across client, server, models, and schemas.
- **[Mantine 7](https://mantine.dev/)** (`core`, `hooks`, `dates`, `charts`): accessible component library and analytics charts.
- **[Tailwind CSS 3](https://tailwindcss.com/)**: utility-first styling, combined with Sass modules for global styles.
- **[React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)**: typed, schema-validated forms.
- **[SWR](https://swr.vercel.app/)**: client-side data fetching, caching, and revalidation.
- **[Recharts](https://recharts.org/)**: exam performance charts.
- **[React Toastify](https://fkhadra.github.io/react-toastify/)**: interaction feedback.
- **[Day.js](https://day.js.org/)**: date and time handling for exam scheduling and timers.

### Backend & Data
- **[Next.js Server Actions & Route Handlers](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)**: mutations and the `/api/cron` maintenance endpoint.
- **[MongoDB Atlas](https://www.mongodb.com/atlas)**: cloud NoSQL document database.
- **[Mongoose 8](https://mongoosejs.com/)**: schema definition, validation, static/instance methods, and aggregation pipelines.
- **[Node.js `crypto`](https://nodejs.org/api/crypto.html)**: token generation and HMAC-SHA512 password hashing.
- **[Nodemailer](https://nodemailer.com/)**: transactional e-mail for password recovery, sent over Gmail SMTP.
- **[Vercel Cron Jobs](https://vercel.com/docs/cron-jobs)**: weekly orphaned-data cleanup.

## Project Structure
```
src/
├── app/
│   ├── (overview)/        # Authenticated shell: dashboard, exam management, account, submissions
│   ├── login/, register/, recover-password/   # Public authentication flows
│   ├── invite/[token]/    # Public landing page for exam invite links
│   ├── api/cron/          # Scheduled maintenance endpoint
│   ├── constants/, schemas/  # App-wide constants and Zod validation schemas
│   └── routes.ts          # Centralized route map used for navigation and redirects
├── models/                # Mongoose schemas, static/instance methods, aggregation pipelines
├── lib/                   # Server-only business logic (auth, exam CRUD, e-mail, DB connection)
├── helpers/                # Pure utility functions shared across client and server
├── typings/                # Shared TypeScript types
└── middleware.ts           # Auth token propagation + security headers
diagram/                    # Conceptual, entity-relationship, and class diagrams
```

## Getting Started

### Prerequisites
- **Node.js** `^18.18 || ^19.8 || ^20.3 || >=21`
- **[pnpm](https://pnpm.io/)** or `npm`
- A **MongoDB** instance: an [Atlas](https://www.mongodb.com/atlas) cluster or a local server (`>= 6.0`)
- A **Gmail account with an App Password**, used to send password-recovery e-mails

### Installation
```bash
git clone https://github.com/Alphka/EduAlphka.git
cd EduAlphka
pnpm install
```

### Environment Variables
Copy the example file and fill in your own values:
```bash
cp .env.example .env.local
```

| Variable | Required | Description |
| :--- | :---: | :--- |
| `MONGODB_URI` | Yes | MongoDB connection string, e.g. `mongodb+srv://user:pass@cluster.mongodb.net/` |
| `DATABASE_NAME` | No | Database name to use; defaults to `development` or `production` based on `NODE_ENV` |
| `HASH_SALT` | Yes | Secret salt used to derive the HMAC-SHA512 password hash. Use a long, random value |
| `EMAIL` | Yes | Gmail address used to send password-recovery codes |
| `EMAIL_PASSWORD` | Yes | Gmail **App Password** for the account above (not your regular password) |

### Running the Application
* **Development mode** (Turbopack, hot reload):
  ```bash
  pnpm dev
  ```
  Open [http://localhost:3000](http://localhost:3000).

* **Production build & execution:**
  ```bash
  pnpm build
  pnpm start
  ```

* **Scheduled cleanup job:** on Vercel this runs automatically (see `vercel.json`). When self-hosting elsewhere, point any external scheduler (cron, a GitHub Actions workflow, etc.) at `GET /api/cron` on the interval of your choice.

## Screenshots

### Login & Registration

![Login screen](.github/screenshots/login.png)

### Exam Creation Form

![Exam creation form](.github/screenshots/exam_creation.png)

### Professor Dashboard

![Professor Dashboard](.github/screenshots/professor_dashboard.png)

### Correction screen

![Correction screen](.github/screenshots/dissertative_question_correction.png)

## Ideas for the Future
The original software plan sketched out a few directions beyond what's built today. None of this is scheduled or promised, just possibilities that could be worth exploring down the line:

- Running usability sessions with real students and professors and adjusting the platform based on what they run into
- Adding automated integration tests that cover the frontend and backend together
- Social login through Google, Microsoft, Facebook, or GitHub
- Two-factor authentication
- Some form of real-time fraud detection, such as flagging simultaneous logins from different devices
- A proper compliance review under Brazil's LGPD for how personal and assessment data is handled
- Internationalization, so the platform isn't limited to Portuguese
- NLP-assisted corrections to help professors grade dissertative answers
- Recommending study material based on the questions candidates get wrong most often

## Academic Context & Credits
This project was conceived, designed, and developed as the **Projeto Integrador II** (Integrative Project II) final deliverable at:
- **Institution:** Instituto Federal do Norte de Minas Gerais (IFNMG)
- **Campus:** Montes Claros, MG, Brazil
- **Author:** Kayo Felipe de Souza Melo
- **Period:** 2024–2025

The accompanying software development plan, covering requirements, use-case diagrams, database modeling, and market/advertising strategy, is available on request or as a companion PDF in the project's academic records.

## License
This project is released under the terms of the [ISC License](LICENSE.md).

# Linguardian - Enrich your vocabulary with the power of spaced repetition

## 🌐 [Check it out on www.linguardian.com](https://www.linguardian.com)

This is a project using **Next.js** and an **Express** backend that communicates with **MongoDB**.

On Linguardian, users can **learn and review user-generated vocabulary lists** that can be created using the website or by uploading CSV files. They can also pick from the existing list catalogue. After learning the items, users wait for a set period of time (default is 4 hours), after which they are tested. If the tests go well, the time between reviews increases — but if they fail, the interval resets. This scientifically backed system is known as **spaced repetition**.

Depending on the language they are learning, users are also tested on the gender of nouns (e.g. German/French) or the grammatical case required by prepositions (e.g. German).

Uploaded items also become part of a **browsable dictionary**, which aims to be comprehensive with example sentences, images, recordings, and phonetic transcription.

The website targets anyone interested in learning languages, but it does not promise to make people fluent or to be a solution that ticks all boxes. It's a vocabulary builder, maintainer, and trainer.

---

## ✨ Key Features

- **🧠 Spaced Repetition Learning**  
  Built around a scientifically proven method that optimizes memory retention. Linguardian automatically schedules review sessions based on user performance, increasing intervals for mastered items and resetting them for forgotten ones.

- **📚 User-Generated Dictionary**  
  Every uploaded or created item becomes part of a shared dictionary accessible to all users. The dictionary grows organically through community contributions.

- **🗂️ Custom Vocabulary Lists**  
  Users can create, edit, and organize their own vocabulary lists — either manually or by uploading CSV files — and track their progress over time.

- **🌍 Multi-Language Support**  
  Currently supports English, German, and French, with built-in logic for language-specific challenges such as noun genders and prepositional cases. The system is built to easily support additional languages and scripts in the future.

- **🔒 Authentication with Google OAuth**  
  Secure login using Google via NextAuth, ensuring smooth access and session management.

- **📦 Modern Full-Stack Architecture**  
  Next.js frontend, Express backend, and MongoDB database — containerized with Docker and deployed through an automated GitHub Actions + AWS pipeline.

- **⚙️ Robust Data Validation & API Layer**  
  Type-safe schemas using Zod ensure consistent validation across both frontend and backend, minimizing runtime errors and simplifying refactoring.

> 🧩 Planned features include streaks, activity statistics, and daily progress visualizations. However, gamification will remain optional — users can disable streaks to reduce pressure and focus on long-term learning.  
> The design choices are informed by the developer’s own extensive experience using spaced-repetition systems.

---

## 📈 Project Status

As of now:

- ✅ Dictionary, list creation/management, and learning flow are functional
- 🎨 UI/UX design is in progress: [Figma File](https://www.figma.com/design/lOeIA9jB6QLTcKTwJVzYj8/Linguardian?node-id=419-572&t=RNUHs0xGzvzMy8u1-1)

---

## 🧰 Technologies & Libraries Used

### General

- TypeScript
- Git
- Figma
- Zod

### Frontend

- Next.js
- NextAuth
- Tailwind CSS
- Headless UI
- React Hook Form + Zod
- React Hot Toast
- ApexCharts
- React Icons
- @hello-pangea/dnd
- react-world-flags
- clsx
- tailwind-merge
- Google Fonts
- barrelsby

### Backend

- Node.js
- Express.js
- ts-node
- Mongoose
- bcryptjs
- multer
- morgan
- helmet
- cors
- dotenv
- nodemon
- csv-parse

---

## 🧪 Local Development Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/linguardian.git
cd linguardian
```

### 2. Set up environment variables

```bash
cp client/.env.example client/.env.local
cp server/.env.example server/.env
```

💡 Never commit `.env` files. Only commit `.env.example` templates.

### 3. Start the dev environment

```bash
docker-compose -f docker-compose.dev.yml up --build
```

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:8000](http://localhost:8000)

### 4. Configure Google OAuth

Add this URI in your Google Console:

```
http://localhost:3000/api/auth/callback/google
```

---

## 🚀 Production Deployment (GitHub Actions + EC2 + Docker Compose)

This project uses GitHub Actions to build and push Docker images to Amazon ECR, then deploy them to an EC2 instance using SSH and Docker Compose.

---

### 🔐 1. GitHub Secrets Setup

In your GitHub repository, define the following secrets under **Settings > Secrets and variables > Actions**:

- `AWS_ACCESS_KEY` – Your AWS IAM access key
- `AWS_SECRET_KEY` – Your AWS IAM secret key
- `AWS_REGION` – Your AWS region (e.g. `eu-central-1`)
- `AWS_ID` – Your AWS account ID
- `ECR_REPOSITORY` – Your ECR repository URL (e.g. `123456789.dkr.ecr.eu-central-1.amazonaws.com/linguardian`)
- `PEM_FILE` – Contents of your EC2 SSH private key (multiline string)
- `NEXTAUTH_SECRET` – Your NextAuth JWT secret
- `GOOGLE_ID` – Google OAuth client ID
- `GOOGLE_SECRET` – Google OAuth client secret
- `NEXTAUTH_URL` – Typically `https://www.linguardian.com`
- `MONGO_URL` – MongoDB connection URI

---

### ⚙️ 2. Deployment Process

Your GitHub Actions workflow (`.github/workflows/deploy.yml`) does the following:

1. Builds frontend and backend Docker images using your `build.sh` script
2. Tags and pushes the images to ECR with both `latest` and timestamped tags
3. SSHs into your EC2 instance and runs `deploy.sh`
4. `deploy.sh` uses `docker-compose.deploy.yml` to:
   - Pull new images from ECR
   - Inject environment variables (secrets)
   - Restart the running containers

---

### 🖥️ 3. EC2 Instance Requirements

Make sure your EC2 instance:

- Has **Docker** and **Docker Compose** installed
- Allows SSH access via the **PEM file** defined in your secrets
- Has IAM permission to pull images from ECR

---

### 📦 4. `docker-compose.deploy.yml` Example

```yaml
services:
  frontend:
    image: <your-ecr>/linguardian:frontend-latest
    environment:
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - GOOGLE_ID=${GOOGLE_ID}
      - GOOGLE_SECRET=${GOOGLE_SECRET}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
      - SERVER_URL=http://backend:8000
      - FRONTEND_URL=http://frontend:3000

  backend:
    image: <your-ecr>/linguardian:backend-latest
    environment:
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - MONGO_URL=${MONGO_URL}
      - FRONTEND_URL=http://frontend:3000
```

---

### 🚀 5. Triggering a Deployment

Every `git push` to the `main` branch automatically:

- Builds and pushes Docker images to Amazon ECR
- Deploys them to your EC2 instance via SSH

> You can customize the trigger behavior in `.github/workflows/deploy.yml` under the `on:` block.

## 🏗️ Architecture Overview

Linguardian follows a **modern full-stack architecture** with a clear separation between frontend, API, and database layers.  
It’s designed for scalability, maintainability, and a smooth developer experience.

            ┌────────────────────────────┐
            │         Frontend           │
            │   Next.js (App Router)     │
            │   Tailwind CSS, NextAuth   │
            │        TypeScript          │
            └─────────────┬──────────────┘
                          │
                HTTPS / REST API Calls
                          │
            ┌─────────────▼──────────────┐
            │         API Layer          │
            │     Express.js (BFF)       │
            │  Handles validation, data  │
            |    fetching and business   |
            |        logic via Zod       |
            |       + service layer      │
            └─────────────┬──────────────┘
                          │
                    Mongoose ODM
                          │
            ┌─────────────▼──────────────┐
            │         MongoDB            │
            │ Stores users, lists, items │
            │ and spaced-repetition data │
            └────────────────────────────┘

### 🔄 Communication Flow

1. **Frontend (Next.js)**

   - Renders UI and handles authentication using **NextAuth**.
   - Communicates with the Express API for all app data and actions.

2. **API Layer (Express.js)**

   - Acts as a **Backend-for-Frontend (BFF)** — responsible for validation, data handling, and business logic.
   - Provides a clean separation between frontend concerns and database access.
   - This lightweight, framework-agnostic approach provides freedom to evolve or scale services independently later.

3. **Database (MongoDB)**

   - Stores users, lists, items, and spaced-repetition metadata via **Mongoose** models.
   - Indexed collections ensure performant lookups and scalability.

4. **Infrastructure**
   - All services run in Docker containers.
   - CI/CD pipeline builds and deploys images to **AWS (ECR + EC2)** using **GitHub Actions**.

---

> 🧩 This structure ensures clean separation of concerns, reproducible deployments, and an easily extensible backend for future features such as AI-assisted dictionary generation and moderation tools.

## ⚡ Tech Highlights

### 🧩 Type-Safe Development with TypeScript + Zod

TypeScript is used throughout the stack — in both the frontend and backend — ensuring consistent types and early error detection.  
Zod complements this by validating API inputs and outputs, enforcing type safety at runtime as well.

### ⚙️ Backend-for-Frontend (BFF) Pattern

The Express backend acts as a dedicated BFF for the Next.js app.  
This allows for optimized endpoints tailored to UI needs, centralizes authentication, and simplifies frontend logic.

### 🔒 Authentication & Security

User authentication and session handling are powered by **NextAuth** with Google OAuth.  
Security middleware such as **Helmet**, **CORS**, and **bcryptjs** are used to secure headers, manage cross-origin requests, and safely hash passwords.

### 🧱 Scalable Architecture with Docker

Both the frontend and backend are containerized using Docker, ensuring consistent builds and deployments.  
A single `docker-compose` configuration is used locally and in production, enabling easy scaling and environment parity.

### 🚀 Continuous Deployment on AWS

A custom CI/CD pipeline automates the entire deployment flow:

- GitHub Actions builds Docker images for frontend and backend
- Pushes them to **Amazon ECR**
- Deploys to **EC2** using SSH and Docker Compose  
  This pipeline provides fast, reproducible deployments with rollback safety through versioned image tags.

### 🎨 UI/UX with Tailwind & Headless UI

The frontend combines **Tailwind CSS** and **Headless UI** for a fast, accessible, and responsive design system.  
Reusable components are styled with utility classes and type-safe props for maintainability.

### 🧰 Development Workflow

Local development runs through **Docker Compose**, mirroring production as closely as possible.  
Environment variables are isolated through `.env.example` templates, ensuring secure and predictable configuration management.

## 🧭 Future Roadmap

Development of Linguardian continues with a focus on expanding the learning experience and deepening the dictionary’s intelligence.

- **🤖 AI-Enhanced Dictionary**  
  The next major milestone is integrating the ChatGPT API to automatically generate **IPA transcriptions** and **concise definitions** for each word.  
  This will unlock two new learning modes:

  - **Spelling / IPA Mode** – users see the IPA and must provide the correct spelling.
  - **Definition Mode** – users are shown a definition (without the word) and must recall the matching term.

- **👤 User Profiles & Activity Tracking**  
  A new profile section (design already completed) will display each user’s activity history and progress in a clear, visual format using an annual activity chart.

- **🧩 Context Mode**  
  Planned integration of real sentences from large text sources (e.g., Project Gutenberg) to add contextual examples for each dictionary item.  
  This data will power another learning mode where users fill in the missing word within authentic sentence contexts.

- **💡 Mnemonic System**  
  Users will be able to create and share **mnemonics** (“mems”) to support memory retention. These community-generated aids will be visible to all learners and eventually moderated for quality.

- **🏆 Leaderboards**  
  A balanced leaderboard system will reflect a user’s **current competence** rather than accumulated points.  
  Each vocabulary list will have a maximum achievable score based on item mastery.
  The intent is to keep competition engaging without turning learning into point farming.

- **🛡️ Moderation Tools**  
  As user-generated content grows, moderation will become essential. Dedicated tools will allow trusted users or moderators to review and manage submitted dictionary entries and mnemonics.

The roadmap aims to bring Linguardian to its first complete product phase — a self-sustaining platform for vocabulary building, powered by data, community, and thoughtful learning design.

---

## 👤 About the Developer

Linguardian is a solo project — designed, built, and deployed end-to-end by a single developer.  
It began as a personal response to the limitations of existing spaced-repetition platforms. I want to strike a balance between **bling and bland** — where gamification does not get in the way, where statistics and points don't steer users into manipulating them or farming scores.  
Where users build something **together**, not create hundreds of isolated lists, so that every edit improves all lists an item appears in.

Having been part of **Memrise** and **Chessable**, two platforms built around spaced repetition and community learning, I’ve seen both the strengths and the shortcomings of these systems — from the inside and as a power user. The experience I gained there has informed nearly every design decision behind Linguardian.

Every design and architectural decision is informed by first-hand experience with language learning.  
The project demonstrates full-stack capability across **Next.js**, **Express**, **MongoDB**, **Docker**, and **AWS**, but it’s also a reflection of long-term curiosity: how humans remember, and how software can support that process without turning it into a chore.

The goal isn’t just to finish a product — it’s to maintain it, refine it, and grow it into something genuinely useful for learners everywhere.

## 📬 Contact

I’m always open to opportunities, collaboration, and conversations about language learning, web development, or educational technology.

- **Website:** [www.linguardian.com](https://www.linguardian.com)
- **LinkedIn:** [jan-eisen](https://www.linkedin.com/in/jan-eisen/)
- **Email:** [jan.eisen@tutanota.de](mailto:jan.eisen@tutanota.de)

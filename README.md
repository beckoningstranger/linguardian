# Linguardian - Enrich your vocabulary with the power of spaced repetition

## 🌐 [Check it out on www.linguardian.com](https://www.linguardian.com)

This is a project using **Next.js** and an **Express** backend that communicates with **MongoDB**.

On Linguardian, users can **learn and review user-generated vocabulary lists** that can be created using the website or by uploading CSV files. They can also pick from the existing list catalogue. After learning the items, users wait for a set period of time (default is 4 hours), after which they are tested. If the tests go well, the time between reviews increases — but if they fail, the interval resets. This scientifically backed system is known as **spaced repetition**.

Depending on the language they are learning, users are also tested on the gender of nouns (German/French) or the grammatical case required by prepositions (German).

Uploaded items also become part of a **browsable dictionary**, which aims to be comprehensive with example sentences, images, recordings, and phonetic transcription.

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

> 💡 Never commit `.env` files. Only commit `.env.example` templates.

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

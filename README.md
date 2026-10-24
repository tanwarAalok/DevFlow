# DevFlow

![Next.js](https://img.shields.io/badge/Next.js-13-000000?logo=nextdotjs&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white) ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white) ![Clerk](https://img.shields.io/badge/Auth-Clerk-6C47FF?logo=clerk&logoColor=white)

A Stack Overflow-style community for developers: ask and answer coding questions, get an AI-generated answer, vote, save questions, follow tags and find jobs, all in one place.

**Live demo:** [devflow-hub.vercel.app](https://devflow-hub.vercel.app/)

![DevFlow home page](https://github.com/tanwarAalok/DevFlow/assets/78805153/bee6e4fd-0c08-43f0-a56d-65ae7d203c3e)

## Features

- **Questions and answers** with a rich-text editor (TinyMCE) and syntax-highlighted code blocks (Prism).
- **AI answers:** generate a suggested answer to any question with the OpenAI API.
- **Voting, views and saved collections** for questions and answers.
- **Tags and community pages** to browse topics and other developers.
- **Global search** across questions, answers, users and tags, plus filters and pagination on every list.
- **Job board** powered by the JSearch API, pre-filtered to the visitor's country.
- **Profiles** with stats, top posts and editable details.
- **Authentication** with Clerk, synced to MongoDB through a webhook.
- **Light and dark themes**, responsive layout with a mobile nav.

## Tech stack

Next.js 13 (App Router, Server Actions) · TypeScript · MongoDB with Mongoose · Clerk · Tailwind CSS and shadcn/ui · TinyMCE · Prism · Zod · OpenAI API

## Getting started

```bash
git clone https://github.com/tanwarAalok/DevFlow.git
cd DevFlow
npm install
```

Create `.env.local`:

```env
MONGODB_URL=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
WEBHOOK_SECRET=                 # Clerk webhook signing secret
NEXT_PUBLIC_TINY_EDITOR_API_KEY=
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
NEXT_PUBLIC_IPGEO_API_KEY=      # visitor location for the job board
OPENAI_API_KEY=
```

Then run the dev server on http://localhost:3000:

```bash
npm run dev
```

## Project structure

```
app/
  (auth)/         sign-in and sign-up
  (root)/         home, ask-question, question/[id], tags, community, collection, jobs, profile
  api/            chatgpt (AI answers) and webhook (Clerk user sync)
components/       cards, forms, shared UI, shadcn/ui primitives
lib/actions/      server actions for questions, answers, users, tags, interactions, search, jobs
models/           Mongoose models
```

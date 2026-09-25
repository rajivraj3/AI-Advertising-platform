<<<<<<< HEAD
# AI Advertising Platform

## 🚀 Overview

AI Advertising Platform is a full-stack marketing application that helps businesses create campaign ideas and advertising content from structured product and audience information.

Creating a consistent campaign usually requires strategy, copywriting, platform-specific formatting, and repeated revisions. This project brings those activities into one web application. Users can enter their business context, select campaign goals and channels, and use Gemini AI to generate campaign strategy, headlines, ad copy, calls to action, captions, hashtags, keywords, creative suggestions, slogans, and poster concepts.

The platform also provides authentication, campaign storage, campaign history, analytics-oriented summaries, and an AI marketing chat experience.

## ✨ Features

- User registration and login
- JWT-based authentication for protected application routes
- Dashboard with campaign overview and activity
- AI-powered advertising campaign generation
- Campaign strategy, USP, headlines, descriptions, ad copy, CTAs, hashtags, keywords, and creative suggestions
- Multi-channel campaign content for Instagram, Facebook, Google Ads, YouTube, and LinkedIn
- AI slogan generation
- AI poster copy and visual concept generation
- AI marketing chatbot and saved chat messages
- Campaign history and saved campaigns
- View, update, delete, and duplicate saved campaigns
- Regenerate headlines, ad copy, CTAs, and captions for an existing campaign
- AI text improvement endpoint
- Analytics-oriented campaign result fields
- Responsive React user interface

## 🛠️ Tech Stack

| Area | Technology |
| --- | --- |
| Frontend | React 19, Vite |
| Routing | React Router |
| Backend | Node.js, Express 5 |
| Database | MongoDB with Mongoose |
| Local database fallback | MongoDB Memory Server |
| AI | Google Gemini API via `@google/genai` |
| Authentication | JWT with `jsonwebtoken` |
| Password security | `bcryptjs` |
| Styling | CSS, Tailwind CSS, glassmorphism UI |
| HTTP client | Axios |
| UI and animation | Lucide React, Framer Motion |
| Middleware and configuration | CORS, Morgan, Dotenv |

## 🏗️ Project Architecture

```text
User
  |
  v
React + Vite Frontend
  |
  | Axios requests with Bearer JWT
  v
Node.js + Express Backend
  |----------------------|
  v                      v
Gemini API           MongoDB / MongoDB Atlas
  |                      |
  | Generated content    | Users, campaigns, chats
  v                      v
Campaign and AI results returned to the frontend
```

The frontend collects user input and displays generated results. The Express backend validates JWTs, coordinates Gemini requests, normalizes AI responses, and stores application data through Mongoose. Gemini is called from the backend so the API key is not exposed in browser code. When `MONGODB_URI` is unavailable or the primary database connection fails, the server starts a MongoDB Memory Server instance for local development.

## 📁 Project Structure

```text
AI-Project-main/
├── client/
│   ├── src/
│   │   ├── api/axios.js
│   │   ├── components/
│   │   ├── context/AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Analytics.jsx
│   │   │   ├── CampaignBuilder.jsx
│   │   │   ├── Chatbot.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── PosterGenerator.jsx
│   │   │   ├── SavedCampaigns.jsx
│   │   │   ├── Settings.jsx
│   │   │   ├── Signup.jsx
│   │   │   └── SloganGenerator.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── aiController.js
│   │   │   └── authController.js
│   │   ├── middleware/authMiddleware.js
│   │   ├── models/
│   │   │   ├── Campaign.js
│   │   │   ├── Chat.js
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   ├── aiRoutes.js
│   │   │   └── authRoutes.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── .gitignore
├── package.json
└── README.md
```

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd AI-Project-main
```

### 2. Install root dependencies

```bash
npm install
```

### 3. Install frontend dependencies

```bash
cd client
npm install
```

### 4. Install backend dependencies

```bash
cd ../server
npm install
```

### 5. Configure environment variables

Create `server/.env` using the placeholder structure in `server/.env.example`.

### 6. Start the backend

From the `server` directory:

```bash
npm run dev
```

The backend runs on `http://localhost:5000` by default.

### 7. Start the frontend

Open a second terminal at the project root, then run:

```bash
cd client
npm run dev -- --host 0.0.0.0
```

Vite displays the local frontend URL, normally `http://localhost:5173`.

### Run both services from the project root

After installing dependencies in the root, `client`, and `server` directories:

```bash
npm run dev
```

## 🔐 Environment Variables

The backend reads these variables from `server/.env`:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

Never place real API keys, passwords, database credentials, or JWT secrets in the README or source code. The `.env` file must not be committed to GitHub. It is excluded by the repository `.gitignore`; use `server/.env.example` only as a placeholder template.

## 🤖 AI Integration

The backend uses the Gemini API through `@google/genai`. Authenticated users can request:

- Complete advertising campaigns from product, business, audience, objective, budget, duration, tone, and platform inputs
- Headlines, descriptions, ad copy, CTAs, hashtags, keywords, and creative suggestions
- Platform-specific campaign content for Instagram, Facebook, Google Ads, YouTube, and LinkedIn
- Slogans based on product, tone, and audience
- Poster headline, subheadline, CTA, and visual prompt concepts
- Marketing chat responses
- Improved versions of user-provided marketing text
- Regenerated headlines, ad copy, CTAs, and captions for saved campaigns

The backend parses and normalizes AI responses before returning or saving them. Fallback content is available for several AI operations when Gemini is unavailable or returns an unusable response.

## 🔑 Authentication

Users can register with a name, email, and password or log in with existing credentials. Passwords are hashed with `bcryptjs`. Successful registration and login return a JWT that expires after seven days.

Protected requests use the header:

```text
Authorization: Bearer <jwt-token>
```

The authentication middleware verifies the token before allowing access to campaign, chat, slogan, poster, and other AI routes.

## 🗄️ Database

MongoDB stores the application's persistent data through Mongoose models:

- `User`: name, email, hashed password, and creation time
- `Campaign`: owner, campaign inputs, generated strategy, ad assets, captions, analytics, and timestamps
- `Chat`: owner, user/model messages, and timestamps

Set `MONGODB_URI` to use MongoDB Atlas or another MongoDB deployment. If the connection is missing or unavailable, the server attempts to use MongoDB Memory Server for local development.

## 📡 API Endpoints

All endpoints below are mounted under `http://localhost:5000`.

### Authentication

| Method | Endpoint | Description | Authentication |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/signup` | Alias for user registration | No |
| POST | `/api/auth/login` | Log in and receive a JWT | No |
| GET | `/api/auth/me` | Get the authenticated user | JWT required |

### Campaigns and AI Tools

| Method | Endpoint | Description | Authentication |
| --- | --- | --- | --- |
| POST | `/api/campaign` | Generate an AI campaign | JWT required |
| POST | `/api/campaigns/generate` | Generate an AI campaign | JWT required |
| POST | `/api/save` | Save generated campaign data | JWT required |
| GET | `/api/history` | Get campaign history | JWT required |
| GET | `/api/campaigns` | List the user's campaigns | JWT required |
| GET | `/api/campaigns/:id` | Get one campaign | JWT required |
| PUT | `/api/campaigns/:id` | Update a campaign | JWT required |
| DELETE | `/api/campaigns/:id` | Delete a campaign | JWT required |
| POST | `/api/campaigns/:id/duplicate` | Duplicate a campaign | JWT required |
| POST | `/api/campaigns/:id/regenerate/headline` | Regenerate a campaign headline | JWT required |
| POST | `/api/campaigns/:id/regenerate/adcopy` | Regenerate campaign ad copy | JWT required |
| POST | `/api/campaigns/:id/regenerate/cta` | Regenerate a campaign CTA | JWT required |
| POST | `/api/campaigns/:id/regenerate/caption` | Regenerate a campaign caption | JWT required |
| POST | `/api/generate-slogans` | Generate slogan ideas | JWT required |
| POST | `/api/generate-poster` | Generate poster copy and visual concept | JWT required |
| POST | `/api/chat` | Create or process marketing chat content | JWT required |
| POST | `/api/ai/improve` | Improve marketing text | JWT required |
| POST | `/api/ai/chat` | Chat with the AI marketing assistant | JWT required |

## 📌 Development Notes

- The frontend API client is configured for `http://localhost:5000/api`.
- Start the backend before using authenticated frontend features.
- Run `npm run build` and `npm run lint` inside `client` to validate the frontend before deployment.
=======
# AI-Advertising-platform
>>>>>>> ab149158268e47eb369c7272e64eb1954823c5ea

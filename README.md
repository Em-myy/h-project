# Document Digitization System

A web-based document digitization platform designed to help staff create, edit, manage and export digital documents through a centralized system.

The application provides a staff portal with authentication and department-based registration, alongside a rich-text document editing experience.

## Live Demo

<https://h-project-psi.vercel.app>

## Features

### Authentication and User Management

- Staff account registration.
- Secure email and password authentication.
- Department selection during registration.
- Supabase-powered authentication.
- Protected access to the application.

### Document Management

- Rich-text document editing.
- Text formatting and underline support.
- Text alignment options.
- Document export to Microsoft Word format.
- Document export to PDF format.

### User Experience

- Responsive user interface.
- Light and dark theme support.
- Form validation and error feedback.
- Interactive interface with loading and success states.

## Technology Stack

| Category         | Technologies                         |
| ---------------- | ------------------------------------ |
| Framework        | Next.js 16                           |
| Frontend         | React 19                             |
| Language         | TypeScript                           |
| Styling          | Tailwind CSS 4                       |
| Authentication   | Supabase Auth                        |
| Database         | Supabase                             |
| Rich Text Editor | Tiptap                               |
| Icons            | Lucide React                         |
| Document Export  | html-docx-js-typescript, html2pdf.js |
| Deployment       | Vercel                               |

## Project Structure

```text
h-project/
│
├── app/                  # Application routes and pages
│
├── components/           # Reusable UI components
│
├── context/              # Application context and state
│
├── public/               # Static assets
│
├── utils/                # Utility functions and configurations
│
├── proxy.ts              # Request handling
│
├── next.config.ts        # Next.js configuration
│
├── package.json          # Dependencies and scripts
│
└── README.md
```

## Getting Started

Follow these steps to run the project locally.

### Prerequisites

- Node.js
- npm
- A Supabase account and project

### 1. Clone the Repository

```bash
git clone https://github.com/Em-myy/h-project.git

cd h-project
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

Replace the placeholder values with your actual Supabase project credentials.

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Command         | Description                           |
| --------------- | ------------------------------------- |
| `npm run dev`   | Starts the development server         |
| `npm run build` | Builds the application for production |
| `npm run start` | Starts the production server          |
| `npm run lint`  | Runs ESLint                           |

## Deployment

The application is deployed using Vercel.

Live URL: https://h-project-psi.vercel.app

## Author

**Rufai Haliyah**

---

_Built to make document digitization and management more accessible and efficient._

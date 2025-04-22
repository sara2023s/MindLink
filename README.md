# MindLink

MindLink is your intelligent link organizer — summarize, categorize, and search your saved links effortlessly using AI.

## 🏠 Homepage Sections

- Hero Section with prominent call-to-action
- Problem/Solution overview
- Core Features showcase
- How It Works step-by-step guide
- Why MindLink professional benefits list
- Testimonials carousel
- About Creator profile
- Final Call-to-Action

## 🔗 Link Management

- Smart Link Saving with automatic metadata extraction
- AI-Powered Content Analysis: automatic title, summary, category, and tag generation
- Custom Categories: create, view, edit, and delete categories (with last-category deletion confirmation)
- Tag System: add, edit, and remove tags
- Pin/Unpin links for quick access
- Link Editing: inline editing of link details and AI reprocessing
- Detail View: comprehensive link details with AI summary and original URL

## 📋 Dashboard & Navigation

- Protected Dashboard with all user links
- Views for Pinned, All, and Saved links
- Responsive layout and modern animations (Framer Motion)
- Toast notifications (react-hot-toast)
- Scroll-to-top behavior on route change

## 👥 Authentication & Security

- Firebase Email/Password Authentication
- User-Specific Data in Firestore
- Protected Routes for data security

## 📂 Category Management

- List all categories
- Category detail and edit page
- Create and delete custom categories
- Last-category deletion confirmation prompt

## 🤖 AI Integration

- AI Service using OpenRouter for content generation
- Customizable prompts for title, summary, categories, and tags
- Expand and improve content with AI

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Firebase account

### Installation

1. Clone the repository:
```bash
git clone [your-repo-url]
cd ai-link-organizer
```

2. Install dependencies:
```bash
npm install
```

3. Set up Firebase:
- Create a new Firebase project
- Enable Authentication (Email/Password)
- Create a Firestore database
- Add your Firebase configuration to `src/config/firebase.ts`

4. Start the development server:
```bash
npm run dev
```

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **AI Integration**: Custom AI service
- **Routing**: React Router
- **UI Components**: Custom components with Lucide icons
- **Date Handling**: date-fns
- **Animations**: Framer Motion

## 📁 Project Structure

```
src/
├── components/     # Reusable UI components
├── context/       # React context providers
├── hooks/         # Custom React hooks
├── pages/         # Page components
├── services/      # External service integrations
├── types/         # TypeScript type definitions
└── utils/         # Utility functions
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory with:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_OPENROUTER_API_KEY=your_openrouter_api_key
```

### Vercel Deployment
When deploying to Vercel, make sure to:
1. Add all environment variables in the Vercel project settings
2. Enable the "Automatically expose System Environment Variables" option
3. Redeploy after adding new environment variables

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Firebase for authentication and database services
- The React and TypeScript communities
- All contributors and users of this project 
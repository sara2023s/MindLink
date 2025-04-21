# AI Link Organizer

A modern web application that helps users organize, categorize, and enhance their saved links with AI-powered features.

## 🌟 Features

### 🔗 Link Management
- **Smart Link Saving**: Save links with automatic metadata extraction
- **AI-Powered Content Analysis**: Get AI-generated summaries and tags
- **Custom Categories**: Organize links into categories (Articles, Videos, Social, Documentation, Tools)
- **Tag System**: Add and manage custom tags for better organization
- **Search & Filter**: Find links quickly with search and category filters
- **Bulk Actions**: Delete multiple links at once

### 🎨 Modern UI/UX
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Dark Mode**: Eye-friendly dark theme option
- **Modern Animations**: Smooth transitions and hover effects
- **Clean Interface**: Intuitive and user-friendly layout
- **Loading States**: Visual feedback during operations

### 🔒 Authentication & Security
- **Firebase Authentication**: Secure user authentication
- **User-Specific Data**: Each user's links are private and secure
- **Protected Routes**: Secure access to user data

### 🤖 AI Integration
- **Content Analysis**: AI-powered link content analysis
- **Smart Summaries**: Automatic content summarization
- **Tag Generation**: AI-suggested tags based on content
- **Platform-Specific Handling**: Special handling for platforms like Instagram

### 📱 Platform Support
- **Instagram Integration**: Special handling for Instagram links
- **Universal Support**: Works with any web link
- **Metadata Extraction**: Automatic extraction of link metadata

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
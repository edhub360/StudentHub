# StudentHub - EdHub360 Educational Platform Frontend

A modern, feature-rich frontend platform providing an integrated learning experience with AI-powered features, interactive tools, and comprehensive educational content management.

## Overview

StudentHub is the user-facing interface for the EdHub360 educational platform. It hosts multiple interconnected pages and modules designed to facilitate comprehensive learning through various modalities including interactive dashboards, AI chat, problem-solving tools, flashcards, video content, and more.

## Technology Stack

- **Primary Language**: TypeScript (60.5%)
- **Markup**: HTML (39.4%)
- **Other**: (0.1%)

**Frontend Framework**: [React/Vue/Angular - specify your framework]
**Styling**: [Tailwind CSS/Bootstrap/CSS-in-JS - specify your approach]
**Build Tool**: [Webpack/Vite - specify your tool]

## Core Features

### 1. **Dashboard**
   - Personalized student dashboard
   - Quick access to all learning modules
   - Overview of progress and activities
   - Performance metrics and statistics

### 2. **Progress Tracking**
   - Real-time progress visualization
   - Learning analytics and insights
   - Achievement and milestone tracking
   - Performance comparison and goals

### 3. **AI-Chat**
   - AI-powered conversational learning
   - Instant homework help and explanations
   - Natural language query processing
   - Context-aware responses

### 4. **Solve**
   - Problem-solving module
   - Step-by-step solution guidance
   - Interactive problem editor
   - Multiple problem formats support

### 5. **FlashCards**
   - Digital flashcard system
   - Spaced repetition algorithm
   - Custom deck creation
   - Study progress tracking

### 6. **Courses**
   - Structured course catalog
   - Course enrollment and management
   - Curriculum organization
   - Course progression tracking

### 7. **Audio-Video Overview**
   - Multimedia content library
   - Video player with controls
   - Audio content management
   - Transcript and subtitle support

### 8. **Summary**
   - Automated content summarization
   - Key points extraction
   - Study guide generation
   - Multiple format exports

### 9. **Interactive BOT**
   - Chatbot-based learning support
   - FAQ automation
   - 24/7 learning assistance
   - Personalized recommendations

## Project Structure

```
StudentHub/
├── src/
│   ├── components/
│   │   ├── Dashboard/
│   │   ├── Progress/
│   │   ├── Chat/
│   │   ├── Solve/
│   │   ├── FlashCards/
│   │   ├── Courses/
│   │   ├── Media/
│   │   ├── Summary/
│   │   └── Bot/
│   ├── pages/
│   ├── services/
│   ├── hooks/
│   ├── utils/
│   ├── styles/
│   ├── types/
│   └── App.tsx
├── public/
├── tests/
├── .env.example
├── tsconfig.json
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm 8.x or yarn 3.x
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/edhub360/StudentHub.git
   cd StudentHub
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```

   The application will open at `http://localhost:3000`

## Environment Configuration

Create a `.env.local` file with the following variables:

```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_AI_CHAT_API=http://localhost:8000/api/chat
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
REACT_APP_ENVIRONMENT=development
```

## Building for Production

```bash
npm run build
# or
yarn build
```

This creates an optimized production build in the `build/` directory.

## Development

### Running Tests

```bash
npm test
# or
yarn test
```

### Linting

```bash
npm run lint
# or
yarn lint
```

### Code Formatting

```bash
npm run format
# or
yarn format
```

## API Integration

StudentHub connects to the EdHub360 Backend API:

- **Base URL**: Configured via `REACT_APP_API_URL`
- **Authentication**: JWT tokens (stored securely)
- **Endpoints**:
  - `/api/auth/` - Authentication services
  - `/api/chat/` - AI chat services
  - `/api/courses/` - Course management
  - `/api/progress/` - Progress tracking
  - `/api/user/` - User profile

## Features in Detail

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimization
- Touch-friendly interfaces
- Cross-browser compatibility

### Accessibility (A11y)
- WCAG 2.1 compliance
- Screen reader support
- Keyboard navigation
- High contrast options

### Performance
- Code splitting and lazy loading
- Image optimization
- Caching strategies
- Minimal bundle size

### Security
- Secure authentication flow
- XSS protection
- CSRF token validation
- Secure credential storage

## Module Details

### Dashboard
- User profile quick view
- Recent activity feed
- Upcoming deadlines
- Quick action buttons

### AI-Chat
- Real-time messaging interface
- Conversation history
- Typing indicators
- Markdown support for responses

### Solve
- Code editor integration
- Multiple language support
- Test case visualization
- Solution comparison

### FlashCards
- Deck management
- Study modes (learn, test, review)
- Progress metrics
- Difficulty adjustment

### Courses
- Course listing with filters
- Curriculum overview
- Resource management
- Progress indicators

### Media Player
- Video playback controls
- Subtitle/caption support
- Playback speed adjustment
- Offline download (if available)

### Summary Generator
- Document upload
- AI-powered summarization
- Key points extraction
- Export to multiple formats

### Interactive BOT
- Natural language understanding
- Context-aware responses
- Learning recommendations
- Issue resolution

## Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Connect repository to Netlify
```

### GitHub Pages
```bash
npm run build
npm run deploy
```

### Docker
```bash
docker build -t edhub360-studenthub .
docker run -p 3000:3000 edhub360-studenthub
```

## Troubleshooting

### API Connection Issues
- Verify `REACT_APP_API_URL` is correct
- Ensure backend server is running
- Check CORS configuration
- Review network tab in DevTools

### Authentication Problems
- Clear browser cookies and cache
- Check JWT token expiration
- Verify Google OAuth credentials
- Review authentication logs

### Build Errors
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear build cache: `npm run clean`
- Check Node version compatibility

### Performance Issues
- Analyze bundle size: `npm run analyze`
- Check for memory leaks in DevTools
- Review network waterfall in Performance tab
- Consider code splitting opportunities

## Contributing

1. Create a feature branch from `main`
2. Implement your changes
3. Write/update tests for new functionality
4. Run linting and tests: `npm run lint && npm test`
5. Create a pull request with detailed description

## Code Standards

- Use TypeScript for type safety
- Follow ESLint/Prettier configuration
- Write meaningful commit messages
- Add JSDoc comments for complex functions
- Keep components modular and reusable

## CI/CD Pipeline

Automated workflows for:
- Testing on push and PRs
- Code quality checks
- Build verification
- Automated deployment to staging/production

## Related Repositories

- [Backend](https://github.com/edhub360/Backend) - AI chat backend services

## Performance Metrics

- Lighthouse Score: [Target score]
- Page Load Time: < 3 seconds
- Time to Interactive: < 5 seconds
- Bundle Size: < 500KB (gzipped)

## Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

[Your License Here]

## Support

For issues and questions:
1. Check existing GitHub issues
2. Create a new issue with steps to reproduce
3. Include browser and OS information
4. Attach screenshots or videos if applicable

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history and updates.

## Team

- **Frontend Lead**: [Name/Contact]
- **UI/UX Designer**: [Name/Contact]
- **QA**: [Name/Contact]

---

**Happy Learning! 🎓**

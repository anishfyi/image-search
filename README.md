# Google Image Search Clone

A pixel-perfect clone of Google's image search interface, built with React.js and Capacitor.js for cross-platform functionality.

## Author
Anish Kr Singh

## Tech Stack
- **Frontend Framework**: React.js 18.2.0
- **Cross-Platform Integration**: Capacitor.js 5.0.0
- **Styling**: Tailwind CSS 3.3.0
- **State Management**: React Context API and useState/useReducer hooks
- **Build Tool**: Vite 4.4.0
- **Package Manager**: npm 9.6.0

### Additional Libraries
- **UI Components**: HeadlessUI 1.7.15
- **Navigation**: React Router 6.14.1
- **Animation**: Framer Motion 10.12.16
- **Camera Integration**: Capacitor Camera API
- **Voice Input**: Web Speech API
- **Gesture Handling**: use-gesture 9.1.3
- **HTTP Client**: Axios 1.4.0
- **Image Processing**: react-image-crop 10.1.5

## Features
- Google App Homepage with sign-in functionality
- Text search with voice input support
- Image search via camera or gallery upload
- Image cropping and processing
- Search results with visual matches and related searches
- Responsive design for cross-platform compatibility
- Native mobile capabilities through Capacitor.js

## Project Structure
```
advanced-image-based-searching/
├── capacitor.config.ts         # Capacitor configuration
├── tailwind.config.js          # Tailwind configuration
├── vite.config.js              # Vite configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # Dependencies and scripts
├── public/                     # Static assets
├── src/
│   ├── components/             # Reusable components
│   │   ├── common/             # Generic UI components
│   │   ├── layout/             # Layout components
│   │   ├── home/               # Homepage specific components
│   │   ├── search/             # Search specific components
│   │   ├── camera/             # Camera and image processing components
│   │   └── results/            # Results page components
│   ├── pages/                  # Page components
│   ├── services/               # API and other services
│   ├── context/                # Context providers
│   ├── hooks/                  # Custom React hooks
│   ├── utils/                  # Utility functions
│   ├── types/                  # TypeScript type definitions
│   └── styles/                 # Global styles
├── android/                    # Capacitor Android platform
└── ios/                        # Capacitor iOS platform
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Installation
1. Clone the repository
```bash
git clone https://github.com/yourusername/image-search.git
cd image-search
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. For mobile development
```bash
# Add platforms
npx cap add android
npx cap add ios

# Build the app
npm run build

# Copy web assets to native projects
npx cap copy

# Open native IDE
npx cap open android
# or
npx cap open ios
```

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run cap:android` - Open Android project
- `npm run cap:ios` - Open iOS project (macOS only)

### Building for Production
```bash
npm run build
npx cap copy
npx cap open android  # or ios
```

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details.

# Video Annotation Tool

A powerful, modern video annotation application built with Vite, React, and Redux that allows users to add timestamped notes to both YouTube videos and uploaded video files.

![Video Annotation Tool](./public/preview.png)

**🔗 Live Demo:** [video-annotate.vercel.app](https://video-annotate.vercel.app)

## 🌟 Features

### Core Functionality
- **Dual Video Support** - Annotate both YouTube videos and locally uploaded files
- **Timestamped Annotations** - Automatically capture current video time when creating notes
- **Real-Time Synchronization** - Annotations update as the video plays
- **Click-to-Seek** - Jump to any timestamp by clicking an annotation
- **Copy to Clipboard** - Quickly copy annotations for external use
- **Edit & Delete** - Full CRUD operations on annotations
- **Modern UI** - Clean, responsive interface with smooth animations

### Advanced Features
- **Redux State Management** - Predictable state updates and time travel debugging
- **YouTube API Integration** - Seamless YouTube video embedding
- **File Upload Support** - Works with MP4, WebM, and other video formats
- **Persistent State** - Annotations remain during video playback
- **Keyboard Shortcuts** - Quick actions for power users
- **Responsive Design** - Works on desktop and mobile devices

## 🛠️ Tech Stack

### Frontend Framework
- **Vite** - Lightning-fast build tool and dev server
- **React 18** - Modern React with concurrent features
- **Redux Toolkit** - Simplified Redux with built-in best practices
- **React-Redux** - Official React bindings for Redux

### Video Handling
- **YouTube IFrame API** - For YouTube video integration
- **HTML5 Video API** - For uploaded video files
- **Custom Video Player Controls** - Built from scratch

### Styling
- **CSS3** - Modern CSS with animations
- **CSS Modules** - Scoped styling (if applicable)
- **Responsive Design** - Mobile-first approach

### Development Tools
- **ESLint** - Code quality and consistency
- **Vite HMR** - Hot Module Replacement for instant feedback

## 📦 Installation

### Prerequisites
- Node.js 16+
- npm or yarn

### Setup Instructions

1. **Clone the repository**
```bash
git clone https://github.com/sheet848/video-annotate.git
cd video-annotate
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

The application will open at `http://localhost:5173`

4. **Build for production**
```bash
npm run build
```

5. **Preview production build**
```bash
npm run preview
```

## 📁 Project Structure

```
video-annotate/
├── public/
│   └── assets/
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── VideoSourceSelector.jsx
│   │   ├── VideoPlayer.jsx
│   │   ├── AnnotationsPanel.jsx
│   │   └── AddAnnotationModal.jsx
│   ├── store/
│   │   ├── store.js
│   │   └── videoAnnotationSlice.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
├── vite.config.js
├── eslint.config.js
└── README.md
```

## 🏗️ Architecture

### Redux Store Structure

The application uses a single Redux slice (`videoAnnotationSlice`) to manage all state:

```javascript
{
  videoSource: {
    type: 'youtube' | 'upload',
    url: string,
    file: File | null
  },
  annotations: [
    {
      id: string,
      timestamp: number,
      text: string,
      createdAt: timestamp
    }
  ],
  currentTime: number,
  isPlaying: boolean,
  selectedAnnotation: string | null,
  isEditMode: boolean
}
```

### Component Architecture

**1. App Component**
- Root component with Redux Provider
- Manages global layout
- Handles routing (if applicable)

**2. Header Component**
- Application title and branding
- Navigation (if multiple pages)
- User controls

**3. VideoSourceSelector Component**
- YouTube URL input field
- File upload button
- Source type selection
- Validation and error handling

**4. VideoPlayer Component**
- YouTube iframe for YouTube videos
- HTML5 video player for uploaded files
- Custom playback controls
- Time tracking and synchronization
- Event handlers for play/pause/seek

**5. AnnotationsPanel Component**
- List of all annotations
- Timestamp display
- Edit/Delete buttons
- Click-to-seek functionality
- Copy to clipboard feature
- Scroll synchronization with video time

**6. AddAnnotationModal Component**
- Modal dialog for new annotations
- Timestamp auto-capture
- Text input field
- Save/Cancel actions
- Form validation

## 🔑 Key Features Explained

### Automatic Timestamp Tracking

When you click "Add Annotation," the current video time is automatically captured:

```javascript
const handleAddAnnotation = () => {
  const currentTime = videoPlayer.getCurrentTime();
  dispatch(createAnnotation({
    timestamp: currentTime,
    text: annotationText
  }));
};
```

### Real-Time Synchronization

Annotations highlight as the video plays:

```javascript
useEffect(() => {
  const interval = setInterval(() => {
    const time = videoPlayer.getCurrentTime();
    dispatch(updateCurrentTime(time));
  }, 100);
  
  return () => clearInterval(interval);
}, [videoPlayer]);
```

### Click-to-Seek

Jump to any point in the video by clicking an annotation:

```javascript
const handleAnnotationClick = (timestamp) => {
  videoPlayer.seekTo(timestamp);
  dispatch(setSelectedAnnotation(annotationId));
};
```

### Copy to Clipboard

Export annotations as formatted text:

```javascript
const copyToClipboard = () => {
  const text = annotations
    .map(a => `[${formatTime(a.timestamp)}] ${a.text}`)
    .join('\n');
  
  navigator.clipboard.writeText(text);
};
```

## 💡 Usage Guide

### Adding Annotations to YouTube Videos

1. **Enter YouTube URL**
   - Paste full YouTube URL or video ID
   - Click "Load Video"

2. **Play Video**
   - Video loads in embedded player
   - Use standard playback controls

3. **Create Annotation**
   - Click "Add Annotation" button
   - Current timestamp is auto-captured
   - Enter your note text
   - Click "Save"

4. **Navigate Annotations**
   - Click any annotation to jump to that timestamp
   - Edit or delete as needed
   - Copy all annotations to clipboard

### Adding Annotations to Uploaded Videos

1. **Upload Video File**
   - Click "Upload Video" button
   - Select MP4, WebM, or other supported format
   - Wait for video to load

2. **Annotate**
   - Same process as YouTube videos
   - All features work identically

### Managing Annotations

**Edit Annotation:**
- Click edit icon on annotation
- Modify text (timestamp is locked)
- Click "Save" to confirm

**Delete Annotation:**
- Click delete icon
- Confirm deletion
- Annotation removed immediately

**Copy All:**
- Click "Copy All" button
- Formatted text copied to clipboard
- Includes timestamps and text

## 🎨 UI/UX Features

### Modern Interface
- Clean, minimalist design
- Intuitive controls
- Smooth animations
- Responsive layout

### Visual Feedback
- Active annotation highlighting
- Hover effects on interactive elements
- Loading states for video loading
- Success/error notifications

### Accessibility
- Keyboard navigation support
- ARIA labels for screen readers
- High contrast mode compatible
- Focus indicators

## 🔧 Configuration

### Vite Configuration

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
```

### ESLint Configuration

The project uses ESLint for code quality. Configuration can be found in `eslint.config.js`.

## 🚀 Deployment

### Deploy to Vercel

1. **Push to GitHub**
```bash
git add .
git commit -m "Deploy to Vercel"
git push origin main
```

2. **Connect to Vercel**
- Go to [vercel.com](https://vercel.com)
- Import your GitHub repository
- Vercel auto-detects Vite configuration
- Click "Deploy"

3. **Automatic Deployments**
- Every push to main triggers deployment
- Preview deployments for pull requests
- Instant rollbacks if needed

### Deploy to Netlify

```bash
npm run build
# Upload dist folder to Netlify
```

Or connect your GitHub repo for automatic deployments.

## 📊 State Management Flow

```
User Action → Redux Action → Reducer → Store Update → Component Re-render
     ↓                                                        ↓
Video Player ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ↓
     ↓                                                        ↓
Time Update → Redux Action → Update Current Time → Highlight Annotation
```

## 🐛 Troubleshooting

### YouTube Videos Not Loading
- Check if URL is valid YouTube link
- Verify internet connection
- Try video ID instead of full URL
- Check browser console for API errors

### Uploaded Videos Not Playing
- Verify file format is supported (MP4, WebM)
- Check file size (large files may be slow)
- Ensure browser supports HTML5 video
- Try converting to MP4 format

### Annotations Not Saving
- Check Redux DevTools for state updates
- Verify text is not empty
- Check browser console for errors
- Try refreshing the page

### Performance Issues
- Large video files may cause lag
- Use YouTube for better performance
- Close other browser tabs
- Clear browser cache

## 🔮 Future Enhancements

- [ ] Export annotations as JSON/CSV
- [ ] Import annotations from file
- [ ] Multiple video annotation projects
- [ ] Collaboration features
- [ ] Video playback speed control
- [ ] Annotation categories/tags
- [ ] Search annotations
- [ ] Annotation time range (start/end)
- [ ] Drawing on video frames
- [ ] Audio waveform visualization
- [ ] Keyboard shortcuts customization
- [ ] Dark mode toggle
- [ ] Multi-language support

## 📝 Scripts

```json
{
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "lint": "eslint ."
}
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **Vite** - For blazing fast development experience
- **Redux Toolkit** - For simplified Redux development
- **YouTube IFrame API** - For video embedding capabilities
- **React Community** - For excellent documentation and support

## 📞 Contact

For questions or feedback:
- Open an issue on GitHub
- Visit the [live demo](https://video-annotate.vercel.app)

---

**Built with ❤️ using Vite + React + Redux**

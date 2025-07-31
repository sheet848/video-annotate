# Video Annotation Tool

## Architecture Overview
### Redux Store Structure:

- **Single slice:** videoAnnotationSlice managing all app state
- **State includes:** video source, annotations, UI states, player instances
- **Actions:** All user interactions are handled through Redux actions

### Components:
1. **App Component** - Main wrapper with Redux Provider
2. **Header Component** - Clean, reusable header
3. **VideoSourceSelector Component** - Handles YouTube URL input and file uploads
4. **VideoPlayer Component** - Manages video playback for both YouTube and uploaded videos
5. **AnnotationsPanel Component** - Displays, edits, and manages annotations
6. **AddAnnotationModal Component** - Modal for creating new annotations

## Key Benefits of This Structure:
### Separation of Concerns:
- Each component has a single responsibility
- Business logic is centralized in Redux
- UI components are focused on presentation

### State Management:

- **Predictable state updates** through Redux actions
- **Time synchronization** between video player and annotations
- **Persistent UI state** (editing modes, selected annotations)

### Reusability:

- Components can be easily reused or modified
- Clean interfaces between components
- Easy to test individual components

### Maintainability:

- **Clear data flow** from Redux store to components
- **Centralized state logic** makes debugging easier
- **Easy to add new features** without touching existing components

## Features Maintained:

- **Automatic timestamp tracking** for both YouTube and uploaded videos
- **Real-time synchronization** between player and annotations
- **Click-to-seek** functionality
- **Copy to clipboard** functionality
- **Edit and delete** annotations
- **Beautiful, modern UI** with all animations preserved

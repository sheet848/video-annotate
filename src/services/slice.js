import { createSlice } from '@reduxjs/toolkit';

export const videoAnnotationSlice = createSlice({
  name: 'videoAnnotation',
  // initialState
  initialState: {
    videoSource: null,
    videoType: '', // 'youtube' or 'upload'
    annotations: [],
    currentTime: 0,
    isPlaying: false,
    showAddAnnotation: false,
    newAnnotation: { text: '', time: 0 },
    youtubeUrl: '',
    editingId: null,
    selectedAnnotation: null,
    youtubePlayer: null,
  },
  // reducers: takes initialState and the action called
  reducers: {
    setVideoSource: (state, action) => {
      state.videoSource = action.payload.source;
      state.videoType = action.payload.type;
      state.annotations = [];
      state.currentTime = 0;
      state.youtubePlayer = null;
    },
    setCurrentTime: (state, action) => {
      state.currentTime = action.payload;
    },
    setIsPlaying: (state, action) => {
      state.isPlaying = action.payload;
    },
    addAnnotation: (state, action) => {
      const annotation = {
        id: Date.now(),
        text: action.payload.text,
        time: action.payload.time,
        timestamp: new Date().toISOString()
      };
      state.annotations.push(annotation);
      state.annotations.sort((a, b) => a.time - b.time);
    },
    deleteAnnotation: (state, action) => {
      state.annotations = state.annotations.filter(ann => ann.id !== action.payload);
      if (state.selectedAnnotation?.id === action.payload) {
        state.selectedAnnotation = null;
      }
    },
    editAnnotation: (state, action) => {
      const { id, text } = action.payload;
      const annotation = state.annotations.find(ann => ann.id === id);
      if (annotation) {
        annotation.text = text;
      }
    },
    setShowAddAnnotation: (state, action) => {
      state.showAddAnnotation = action.payload;
    },
    setNewAnnotation: (state, action) => {
      state.newAnnotation = action.payload;
    },
    setYoutubeUrl: (state, action) => {
      state.youtubeUrl = action.payload;
    },
    setEditingId: (state, action) => {
      state.editingId = action.payload;
    },
    setSelectedAnnotation: (state, action) => {
      state.selectedAnnotation = action.payload;
    },
    setYoutubePlayer: (state, action) => {
      state.youtubePlayer = action.payload;
    },
  },
});

export const {
  setVideoSource,
  setCurrentTime,
  setIsPlaying,
  addAnnotation,
  deleteAnnotation,
  editAnnotation,
  setShowAddAnnotation,
  setNewAnnotation,
  setYoutubeUrl,
  setEditingId,
  setSelectedAnnotation,
  setYoutubePlayer,
} = videoAnnotationSlice.actions;

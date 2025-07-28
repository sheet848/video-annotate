import { configureStore } from '@reduxjs/toolkit';
import { videoAnnotationSlice } from "./slice"

export const store = configureStore({
  reducer: {
    videoAnnotation: videoAnnotationSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['videoAnnotation/setYoutubePlayer'],
        ignoredPaths: ['videoAnnotation.youtubePlayer'],
      },
    }),
});

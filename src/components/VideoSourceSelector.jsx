import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Upload, Youtube } from 'lucide-react';

import { setVideoSource, setYoutubeUrl, setCurrentTime } from '../services/slice';

const VideoSourceSelector = () => {

    const { youtubeUrl } = useSelector(state => state.videoAnnotation);
  const dispatch = useDispatch();
  const fileInputRef = React.useRef(null);

  const extractYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('video/')) {
      const url = URL.createObjectURL(file);
      dispatch(setVideoSource({ source: url, type: 'upload' }));
    }
  };

  const handleYouTubeLoad = () => {
    if (youtubeUrl) {
      const videoId = extractYouTubeId(youtubeUrl);
      if (videoId) {
        dispatch(setVideoSource({ source: videoId, type: 'youtube' }));
        dispatch(setCurrentTime(0));
      }
    }
  };

  return (
    <>
    <div className="video-source">
      <h2>
        Choose Your Video Source
      </h2>
      
      <div className="dual-grid">
        {/* YouTube Input */}
        <div className="youtube-col"
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-5px)';
          e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}>
          <Youtube size={48} color="white" style={{ marginBottom: '20px' }} />
          <h3>YouTube Video</h3>
          <input
            type="text"
            placeholder="Paste YouTube URL here..."
            value={youtubeUrl}
            onChange={(e) => dispatch(setYoutubeUrl(e.target.value))}
          />
          <button
            onClick={handleYouTubeLoad}
            disabled={!youtubeUrl}
            style={{
              background: youtubeUrl ? 'linear-gradient(135deg, #ff6b6b, #ee5a24)' : 'rgba(255, 255, 255, 0.2)',
              cursor: youtubeUrl ? 'pointer' : 'not-allowed',
            }}
          >
            Load Video
          </button>
        </div>

        {/* File Upload */}
        <div className="file-upload"
        onClick={() => fileInputRef.current?.click()}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-5px)';
          e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}>
          <Upload size={48} color="white" style={{ marginBottom: '20px' }} />
          <h3>Upload Video File</h3>
          <p>
            Supports MP4, WebM, MOV and other video formats
          </p>
          <div className="choose-file">
            Choose File
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
        </div>
      </div>
    </div>
    </>
  )
}

export default VideoSourceSelector
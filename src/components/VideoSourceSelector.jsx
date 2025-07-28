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
    <div style={{
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(20px)',
      borderRadius: '24px',
      padding: '40px',
      marginBottom: '30px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      textAlign: 'center'
    }}>
      <h2 style={{
        color: 'white',
        marginBottom: '30px',
        fontSize: '24px',
        fontWeight: '500'
      }}>
        Choose Your Video Source
      </h2>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        {/* YouTube Input */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '30px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          transition: 'all 0.3s ease',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-5px)';
          e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}>
          <Youtube size={48} color="white" style={{ marginBottom: '20px' }} />
          <h3 style={{ color: 'white', marginBottom: '15px', fontSize: '18px' }}>YouTube Video</h3>
          <input
            type="text"
            placeholder="Paste YouTube URL here..."
            value={youtubeUrl}
            onChange={(e) => dispatch(setYoutubeUrl(e.target.value))}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              fontSize: '14px',
              marginBottom: '15px',
              outline: 'none'
            }}
          />
          <button
            onClick={handleYouTubeLoad}
            disabled={!youtubeUrl}
            style={{
              background: youtubeUrl ? 'linear-gradient(135deg, #ff6b6b, #ee5a24)' : 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '12px',
              cursor: youtubeUrl ? 'pointer' : 'not-allowed',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.3s ease'
            }}
          >
            Load Video
          </button>
        </div>

        {/* File Upload */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '30px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          transition: 'all 0.3s ease',
          cursor: 'pointer'
        }}
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
          <h3 style={{ color: 'white', marginBottom: '15px', fontSize: '18px' }}>Upload Video File</h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '20px', fontSize: '14px' }}>
            Supports MP4, WebM, MOV and other video formats
          </p>
          <div style={{
            background: 'linear-gradient(135deg, #4facfe, #00f2fe)',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '500',
            display: 'inline-block'
          }}>
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
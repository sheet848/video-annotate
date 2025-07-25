import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Upload, Youtube, Copy, Plus, X, Edit3, Clock, MessageSquare } from 'lucide-react';

const VideoAnnotationApp = () => {
  const [videoSource, setVideoSource] = useState(null);
  const [videoType, setVideoType] = useState(''); // 'youtube' or 'upload'
  const [annotations, setAnnotations] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showAddAnnotation, setShowAddAnnotation] = useState(false);
  const [newAnnotation, setNewAnnotation] = useState({ text: '', time: 0 });
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [selectedAnnotation, setSelectedAnnotation] = useState(null);
  const [youtubePlayer, setYoutubePlayer] = useState(null);
  
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Load YouTube API
    if (videoType === 'youtube' && !window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      
      window.onYouTubeIframeAPIReady = () => {
        initYouTubePlayer();
      };
    } else if (videoType === 'youtube' && window.YT && window.YT.Player) {
      initYouTubePlayer();
    }
  }, [videoSource, videoType]);

  const initYouTubePlayer = () => {
    if (videoType === 'youtube' && videoSource) {
      const videoId = extractYouTubeId(youtubeUrl);
      if (videoId && window.YT && window.YT.Player) {
        const player = new window.YT.Player('youtube-player', {
          height: '400',
          width: '100%',
          videoId: videoId,
          playerVars: {
            controls: 1,
            modestbranding: 1,
            rel: 0
          },
          events: {
            onReady: (event) => {
              setYoutubePlayer(event.target);
              // Start tracking time
              const interval = setInterval(() => {
                if (event.target && event.target.getCurrentTime) {
                  const time = event.target.getCurrentTime();
                  setCurrentTime(time);
                  
                  // Check if player is playing
                  const state = event.target.getPlayerState();
                  setIsPlaying(state === 1); // 1 means playing
                }
              }, 100);
              
              // Store interval for cleanup
              event.target.timeInterval = interval;
            },
            onStateChange: (event) => {
              const state = event.data;
              setIsPlaying(state === 1); // 1 means playing
            }
          }
        });
      }
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video || videoType !== 'upload') return;

    const updateTime = () => {
      const time = video.currentTime;
      setCurrentTime(time);
    };
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [videoSource, videoType]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('video/')) {
      const url = URL.createObjectURL(file);
      setVideoSource(url);
      setVideoType('upload');
      setAnnotations([]);
    }
  };

  const handleYouTubeLoad = () => {
    if (youtubeUrl) {
      const videoId = extractYouTubeId(youtubeUrl);
      if (videoId) {
        setVideoSource(videoId);
        setVideoType('youtube');
        setAnnotations([]);
        setCurrentTime(0);
        setYoutubePlayer(null);
      }
    }
  };

  const extractYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const addAnnotation = () => {
    if (newAnnotation.text.trim()) {
      const annotation = {
        id: Date.now(),
        text: newAnnotation.text,
        time: newAnnotation.time, // Use the time from newAnnotation which is set when modal opens
        timestamp: new Date().toISOString()
      };
      setAnnotations(prev => [...prev, annotation].sort((a, b) => a.time - b.time));
      setNewAnnotation({ text: '', time: 0 });
      setShowAddAnnotation(false);
    }
  };

  const deleteAnnotation = (id) => {
    setAnnotations(prev => prev.filter(ann => ann.id !== id));
    if (selectedAnnotation?.id === id) {
      setSelectedAnnotation(null);
    }
  };

  const editAnnotation = (id, newText) => {
    setAnnotations(prev => prev.map(ann => 
      ann.id === id ? { ...ann, text: newText } : ann
    ));
    setEditingId(null);
  };

  const seekToTime = (time) => {
    if (videoType === 'upload' && videoRef.current) {
      videoRef.current.currentTime = time;
    } else if (videoType === 'youtube' && youtubePlayer) {
      youtubePlayer.seekTo(time, true);
    }
  };

  const copyAnnotations = () => {
    const text = annotations.map(ann => 
      `[${formatTime(ann.time)}] ${ann.text}`
    ).join('\n');
    
    navigator.clipboard.writeText(text).then(() => {
      alert('Annotations copied to clipboard!');
    });
  };

  const togglePlayPause = () => {
    if (videoType === 'upload' && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    } else if (videoType === 'youtube' && youtubePlayer) {
      if (isPlaying) {
        youtubePlayer.pauseVideo();
      } else {
        youtubePlayer.playVideo();
      }
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        padding: '20px 0'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '15px'
        }}>
          <MessageSquare size={32} color="white" />
          <h1 style={{
            color: 'white',
            margin: 0,
            fontSize: '28px',
            fontWeight: '600',
            letterSpacing: '-0.5px'
          }}>
            Video Annotator
          </h1>
        </div>
      </div>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 20px'
      }}>
        {/* Video Source Selection */}
        {!videoSource && (
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
                  onChange={(e) => setYoutubeUrl(e.target.value)}
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
        )}

        {/* Main Content */}
        {videoSource && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: '30px',
            alignItems: 'start'
          }}>
            {/* Video Player Section */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              padding: '30px',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <div style={{
                position: 'relative',
                borderRadius: '16px',
                overflow: 'hidden',
                marginBottom: '20px',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
              }}>
                {videoType === 'youtube' ? (
                  <div
                    id="youtube-player"
                    style={{
                      width: '100%',
                      height: '400px',
                      background: '#000'
                    }}
                  />
                ) : (
                  <video
                    ref={videoRef}
                    src={videoSource}
                    style={{
                      width: '100%',
                      height: '400px',
                      objectFit: 'contain',
                      background: '#000'
                    }}
                    controls={false}
                  />
                )}
              </div>

              {/* Custom Controls for Both Video Types */}
              {videoSource && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  padding: '15px 20px',
                  borderRadius: '12px',
                  marginBottom: '20px'
                }}>
                  <button
                    onClick={togglePlayPause}
                    style={{
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '45px',
                      height: '45px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {isPlaying ? <Pause size={20} color="white" /> : <Play size={20} color="white" />}
                  </button>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    flex: 1,
                    color: 'white'
                  }}>
                    <Clock size={16} />
                    <span style={{ fontSize: '14px', fontWeight: '500' }}>
                      {formatTime(currentTime)}
                    </span>
                    {videoType === 'youtube' && (
                      <span style={{ fontSize: '12px', opacity: 0.7, marginLeft: '10px' }}>
                        (YouTube Player)
                      </span>
                    )}
                  </div>
                </div>
              )}

              <button
                onClick={() => {
                  setNewAnnotation({ text: '', time: currentTime });
                  setShowAddAnnotation(true);
                }}
                style={{
                  background: 'linear-gradient(135deg, #4facfe, #00f2fe)',
                  color: 'white',
                  border: 'none',
                  padding: '15px 30px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  transition: 'all 0.3s ease',
                  width: '100%',
                  justifyContent: 'center'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(79, 172, 254, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <Plus size={20} />
                Add Annotation at {formatTime(currentTime)}
              </button>
            </div>

            {/* Annotations Panel */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              height: 'fit-content',
              maxHeight: '600px',
              display: 'flex',
              flexDirection: 'column'
            }}>
              {/* Panel Header */}
              <div style={{
                padding: '25px 30px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <h3 style={{
                  color: 'white',
                  margin: 0,
                  fontSize: '20px',
                  fontWeight: '500'
                }}>
                  Annotations ({annotations.length})
                </h3>
                
                <button
                  onClick={copyAnnotations}
                  disabled={annotations.length === 0}
                  style={{
                    background: annotations.length > 0 ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px',
                    cursor: annotations.length > 0 ? 'pointer' : 'not-allowed',
                    transition: 'all 0.3s ease'
                  }}
                  title="Copy annotations"
                >
                  <Copy size={16} color="white" />
                </button>
              </div>

              {/* Annotations List */}
              <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '20px 30px'
              }}>
                {annotations.length === 0 ? (
                  <div style={{
                    textAlign: 'center',
                    color: 'rgba(255, 255, 255, 0.6)',
                    padding: '40px 20px',
                    fontSize: '14px'
                  }}>
                    <MessageSquare size={48} color="rgba(255, 255, 255, 0.3)" style={{ marginBottom: '15px' }} />
                    <p>No annotations yet. Add your first annotation to get started!</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {annotations.map((annotation) => (
                      <div
                        key={annotation.id}
                        style={{
                          background: selectedAnnotation?.id === annotation.id 
                            ? 'rgba(79, 172, 254, 0.2)' 
                            : 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '12px',
                          padding: '15px',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          transition: 'all 0.3s ease',
                          cursor: 'pointer'
                        }}
                        onClick={() => {
                          setSelectedAnnotation(annotation);
                          seekToTime(annotation.time);
                        }}
                        onMouseEnter={(e) => {
                          if (selectedAnnotation?.id !== annotation.id) {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedAnnotation?.id !== annotation.id) {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                          }
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '8px'
                        }}>
                          <span style={{
                            color: '#4facfe',
                            fontSize: '12px',
                            fontWeight: '500',
                            background: 'rgba(79, 172, 254, 0.2)',
                            padding: '4px 8px',
                            borderRadius: '6px'
                          }}>
                            {formatTime(annotation.time)}
                          </span>
                          
                          <div style={{ display: 'flex', gap: '5px' }}>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingId(annotation.id);
                              }}
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '4px',
                                borderRadius: '4px',
                                transition: 'all 0.3s ease'
                              }}
                            >
                              <Edit3 size={14} color="rgba(255, 255, 255, 0.7)" />
                            </button>
                            
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteAnnotation(annotation.id);
                              }}
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '4px',
                                borderRadius: '4px',
                                transition: 'all 0.3s ease'
                              }}
                            >
                              <X size={14} color="rgba(255, 255, 255, 0.7)" />
                            </button>
                          </div>
                        </div>
                        
                        {editingId === annotation.id ? (
                          <input
                            type="text"
                            defaultValue={annotation.text}
                            autoFocus
                            onBlur={(e) => editAnnotation(annotation.id, e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                editAnnotation(annotation.id, e.target.value);
                              }
                            }}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              background: 'rgba(255, 255, 255, 0.1)',
                              border: '1px solid rgba(255, 255, 255, 0.3)',
                              borderRadius: '6px',
                              padding: '8px',
                              color: 'white',
                              fontSize: '14px',
                              width: '100%',
                              outline: 'none'
                            }}
                          />
                        ) : (
                          <p style={{
                            color: 'white',
                            margin: 0,
                            fontSize: '14px',
                            lineHeight: '1.4'
                          }}>
                            {annotation.text}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Add Annotation Modal */}
        {showAddAnnotation && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '30px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              width: '90%',
              maxWidth: '500px'
            }}>
              <h3 style={{
                color: 'white',
                marginBottom: '20px',
                fontSize: '20px',
                fontWeight: '500'
              }}>
                Add Annotation at {formatTime(newAnnotation.time)}
              </h3>
              
              <textarea
                value={newAnnotation.text}
                onChange={(e) => setNewAnnotation(prev => ({ ...prev, text: e.target.value }))}
                placeholder="Enter your annotation here..."
                autoFocus
                style={{
                  width: '100%',
                  height: '120px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '12px',
                  padding: '15px',
                  color: 'white',
                  fontSize: '14px',
                  resize: 'vertical',
                  outline: 'none',
                  marginBottom: '20px'
                }}
              />
              
              <div style={{
                display: 'flex',
                gap: '15px',
                justifyContent: 'flex-end'
              }}>
                <button
                  onClick={() => setShowAddAnnotation(false)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Cancel
                </button>
                
                <button
                  onClick={addAnnotation}
                  disabled={!newAnnotation.text.trim()}
                  style={{
                    background: newAnnotation.text.trim() 
                      ? 'linear-gradient(135deg, #4facfe, #00f2fe)' 
                      : 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    cursor: newAnnotation.text.trim() ? 'pointer' : 'not-allowed',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Add Annotation
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoAnnotationApp;
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Copy, X, Edit3, MessageSquare } from 'lucide-react';

import { deleteAnnotation,
  editAnnotation,
  setEditingId,
  setSelectedAnnotation } from '../services/slice';

const AnnotationsPanel = () => {

    const { 
    annotations, 
    editingId, 
    selectedAnnotation, 
    videoType,
    youtubePlayer 
  } = useSelector(state => state.videoAnnotation);
  const dispatch = useDispatch();
  const videoRef = React.useRef(null);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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

  const handleEditAnnotation = (id, newText) => {
    dispatch(editAnnotation({ id, text: newText }));
    dispatch(setEditingId(null));
  };

  return (
    <>
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
                  dispatch(setSelectedAnnotation(annotation));
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
                        dispatch(setEditingId(annotation.id));
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
                        dispatch(deleteAnnotation(annotation.id));
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
                    onBlur={(e) => handleEditAnnotation(annotation.id, e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleEditAnnotation(annotation.id, e.target.value);
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
    </>
  )
}

export default AnnotationsPanel
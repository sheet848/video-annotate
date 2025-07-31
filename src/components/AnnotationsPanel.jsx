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
    <div className="right-col">
      {/* Panel Header */}
      <div className="anno-panel-header">
        <h3>
          Annotations ({annotations.length})
        </h3>
        
        <button
          onClick={copyAnnotations}
          disabled={annotations.length === 0}
          style={{
            background: annotations.length > 0 ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)',
            cursor: annotations.length > 0 ? 'pointer' : 'not-allowed',
          }}
          title="Copy annotations"
        >
          <Copy size={16} color="white" />
        </button>
      </div>

      {/* Annotations List */}
      <div className="anno-panel-body">
        {annotations.length === 0 ? (
          <div className="message">
            <MessageSquare size={48} color="rgba(255, 255, 255, 0.3)" style={{ marginBottom: '15px' }} />
            <p>No annotations yet. Add your first annotation to get started!</p>
          </div>
        ) : (
          <div className="anno-list">
            {annotations.map((annotation) => (
              <div
                key={annotation.id}
                style={{
                  background: selectedAnnotation?.id === annotation.id 
                    ? 'rgba(79, 172, 254, 0.2)' 
                    : 'rgba(255, 255, 255, 0.1)',
                }}
                className="single-annotate"
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
                <div className="anno-options">
                  <span className="time">
                    {formatTime(annotation.time)}
                  </span>
                  
                  <div className="right-buttons">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(setEditingId(annotation.id));
                      }}
                      className="edit-button"
                    >
                      <Edit3 size={14} color="rgba(255, 255, 255, 0.7)" />
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(deleteAnnotation(annotation.id));
                      }}
                      className="delete-button"
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
                  />
                ) : (
                  <p className="white-text">
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
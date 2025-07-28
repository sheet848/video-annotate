import { useSelector, useDispatch } from 'react-redux';

import { 
  addAnnotation, 
  setNewAnnotation, 
  setShowAddAnnotation 
} from '../services/slice';

const AddAnnotationModal = () => {

  const { newAnnotation } = useSelector(state => state.videoAnnotation);
  const dispatch = useDispatch();

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAddAnnotation = () => {
    if (newAnnotation.text.trim()) {
      dispatch(addAnnotation({
        text: newAnnotation.text,
        time: newAnnotation.time
      }));
      dispatch(setNewAnnotation({ text: '', time: 0 }));
      dispatch(setShowAddAnnotation(false));
    }
  };

  const handleCancel = () => {
    dispatch(setShowAddAnnotation(false));
  };

  const handleTextChange = (e) => {
    dispatch(setNewAnnotation({ ...newAnnotation, text: e.target.value }));
  };

  return (
    <>
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
          onChange={handleTextChange}
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
            marginBottom: '20px',
            fontFamily: 'inherit'
          }}
        />
        
        <div style={{
          display: 'flex',
          gap: '15px',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={handleCancel}
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
            onClick={handleAddAnnotation}
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
    </>
  )
}

export default AddAnnotationModal
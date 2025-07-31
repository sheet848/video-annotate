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
    <div className="modal-background">
      <div className="modal-box">
        <h3>
          Add Annotation at {formatTime(newAnnotation.time)}
        </h3>
        
        <textarea
          value={newAnnotation.text}
          onChange={handleTextChange}
          placeholder="Enter your annotation here..."
          autoFocus
        />
        
        <div className="button-action">
          <button
            className="cancel-button"
            onClick={handleCancel}
          >
            Cancel
          </button>
          
          <button
            className="add-anno-button"
            onClick={handleAddAnnotation}
            disabled={!newAnnotation.text.trim()}
            style={{
              background: newAnnotation.text.trim() 
                ? 'linear-gradient(135deg, #4facfe, #00f2fe)' 
                : 'rgba(255, 255, 255, 0.2)',
              cursor: newAnnotation.text.trim() ? 'pointer' : 'not-allowed',
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
import { useSelector } from 'react-redux';

import Header from './Header';
import VideoSourceSelector from './VideoSourceSelector';
import VideoPlayer from './VideoPlayer';
import AnnotationsPanel from './AnnotationsPanel';
import AddAnnotationModal from './AddAnnotationModal';

const VideoAnnotationApp = () => {

    const { videoSource, showAddAnnotation } = useSelector(state => state.videoAnnotation);

  return (
    <>
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <Header />
      
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 20px'
      }}>
        {!videoSource ? (
          <VideoSourceSelector />
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: '30px',
            alignItems: 'start'
          }}>
            <VideoPlayer />
            <AnnotationsPanel />
          </div>
        )}

        {showAddAnnotation && <AddAnnotationModal />}
      </div>
    </div>
    </>
  )
}

export default VideoAnnotationApp
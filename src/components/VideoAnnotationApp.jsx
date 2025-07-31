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
    <div>
      <Header />
      
      <div className="main-window">
        {!videoSource ? (
          <VideoSourceSelector />
        ) : (
          <div className="video-src-grid">
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
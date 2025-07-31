import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Play, Pause, Plus, Clock } from 'lucide-react';
import { 
  setCurrentTime, 
  setIsPlaying, 
  setYoutubePlayer, 
  setNewAnnotation, 
  setShowAddAnnotation 
} from '../services/slice';

const VideoPlayer = () => {

    const { 
    videoSource, 
    videoType, 
    currentTime, 
    isPlaying, 
    youtubePlayer,
    youtubeUrl 
  } = useSelector(state => state.videoAnnotation);
  const dispatch = useDispatch();
  const videoRef = React.useRef(null);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const extractYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // YouTube API Integration
  useEffect(() => {
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
              dispatch(setYoutubePlayer(event.target));
              const interval = setInterval(() => {
                if (event.target && event.target.getCurrentTime) {
                  const time = event.target.getCurrentTime();
                  dispatch(setCurrentTime(time));
                  
                  const state = event.target.getPlayerState();
                  dispatch(setIsPlaying(state === 1));
                }
              }, 100);
              
              event.target.timeInterval = interval;
            },
            onStateChange: (event) => {
              const state = event.data;
              dispatch(setIsPlaying(state === 1));
            }
          }
        });
      }
    }
  };

  // HTML5 Video Integration
  useEffect(() => {
    const video = videoRef.current;
    if (!video || videoType !== 'upload') return;

    const updateTime = () => {
      const time = video.currentTime;
      dispatch(setCurrentTime(time));
    };
    const handlePlay = () => dispatch(setIsPlaying(true));
    const handlePause = () => dispatch(setIsPlaying(false));

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [videoSource, videoType, dispatch]);

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
    <>
    <div className="left-col">
      <div className="video-player">
        {videoType === 'youtube' ? (
          <div id="youtube-player"/>
        ) : (
          <video
            ref={videoRef}
            src={videoSource}
            controls={false}
          />
        )}
      </div>

      {/* Custom Controls for Both Video Types */}
      {videoSource && (
        <div className="video-control">
          <button onClick={togglePlayPause}>
            {isPlaying ? <Pause size={20} color="white" /> : <Play size={20} color="white" />}
          </button>
          
          <div>
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

      {/* Add Annotation button */}
      <button className="annotation-button"
        onClick={() => {
          dispatch(setNewAnnotation({ text: '', time: currentTime }));
          dispatch(setShowAddAnnotation(true));
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
    </>
  )
}

export default VideoPlayer
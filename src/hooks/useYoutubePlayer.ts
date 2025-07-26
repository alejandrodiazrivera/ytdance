import { useEffect, useState } from 'react';

const useYouTubePlayer = () => {
  const [player, setPlayer] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Load YouTube IFrame API
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      setIsReady(true);
    };

    return () => {
      if (player) {
        player.destroy();
      }
    };
  }, []);

  const loadVideo = (url) => {
    if (!isReady) return;

    let videoId = '';
    if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1].split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    }

    if (!videoId) {
      alert('Please enter a valid YouTube URL');
      return;
    }

    const newPlayer = new window.YT.Player('player', {
      videoId,
      playerVars: {
        autoplay: 0,
        controls: 1,
        enablejsapi: 1,
        modestbranding: 1
      },
      events: {
        onReady: () => setPlayer(newPlayer),
        onStateChange: (event) => {
          if (event.data === window.YT.PlayerState.PLAYING) {
            // Handle play event
          } else if (event.data === window.YT.PlayerState.PAUSED) {
            // Handle pause event
          }
        }
      }
    });
  };

  const playVideo = () => {
    if (player) player.playVideo();
  };

  const pauseVideo = () => {
    if (player) player.pauseVideo();
  };

  const seekTo = (seconds) => {
    if (player) player.seekTo(seconds, true);
  };

  const setPlaybackRate = (rate) => {
    if (player) player.setPlaybackRate(rate);
  };

  return {
    player,
    loadVideo,
    playVideo,
    pauseVideo,
    seekTo,
    setPlaybackRate,
    isReady
  };
};

export default useYouTubePlayer;
import React, { useMemo, useRef, useState } from 'react';
import styles from './VideoPlayback.module.scss';
import IconsCirclePlay from '../../Ui/Icons/IconsCirclePlay';

interface VideoPlaybackProps {
  data: Blob;
}

function VideoPlayback({ data }: VideoPlaybackProps) {
  const [videoPlaying, setVideoPlaying] = useState(false);
  const playBackRef = useRef<HTMLVideoElement>(null);

  const playVideo = () => {
    setVideoPlaying(true);
    playBackRef.current?.play();
  };

  const onPlaying = () => setVideoPlaying(true);

  const onEnded = () => setVideoPlaying(false);

  const src = useMemo(() => URL.createObjectURL(data), [data]);

  return (
    <div className={styles.playback}>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video
        ref={playBackRef}
        onPlaying={onPlaying}
        onEnded={onEnded}
        muted={false}
      >
        <source src={src} />
      </video>
      {!videoPlaying && (
        <button
          onClick={playVideo}
          type="button"
          className={styles.playback__control}
        >
          <IconsCirclePlay />
        </button>
      )}
    </div>
  );
}

export default VideoPlayback;

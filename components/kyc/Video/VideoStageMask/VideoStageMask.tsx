import React from 'react';
import classes from 'classnames';
import styles from './VideoStageMask.module.scss';
import PreviewGesturesOverlay from '../PreviewGesturesOverlay/PreviewGesturesOverlay';

interface VideoStageMaskProps {
  gestures: Array<string>;
}

function VideoStageMask({ gestures }: VideoStageMaskProps) {
  return (
    <div className={classes(styles.mask, styles.desktop)}>
      <PreviewGesturesOverlay gestures={gestures} />
    </div>
  );
}

export default VideoStageMask;

import React, { Fragment } from 'react';
import classes from 'classnames';
import styles from './PreviewGesturesOverlay.module.scss';
import IconsLeft from '../../Ui/Icons/IconsLeft';

const orderTranslate = ['اول', 'دوم', 'سوم'];

interface PreviewGesturesOverlayProps {
  gestures: string[];
}

function PreviewGesturesOverlay({ gestures }: PreviewGesturesOverlayProps) {
  const renderGesture = (gesture, index: number, isLast: boolean) => (
    <Fragment key={index}>
      <div className={styles.gesture}>
        <div>
          <img
            src={`/static/hand-gestures/L${gesture}.png`}
            alt={gesture}
            placeholder="blur"
          />
        </div>
        <p>{`حرکت ${orderTranslate[index]}`}</p>
      </div>
      {!isLast && <IconsLeft />}
    </Fragment>
  );
  return (
    <div className={classes(styles.container, styles.mobile)}>
      {gestures.map((gesture, index, arr) =>
        renderGesture(gesture, index, index + 1 === arr.length),
      )}
    </div>
  );
}

export default PreviewGesturesOverlay;

import React, { SVGProps } from 'react';
import classes from 'classnames';

function IconsInfo({
  width,
  height,
  color,
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={width || '1em'}
      height={height || '1em'}
      color={color || 'inherit'}
      viewBox="0 0 16 16"
      {...props}
      className={classes('icons8', props.className)}
    >
      <path
        fill="currentColor"
        d="M8 0a8 8 0 0 0-8 8 8 8 0 1 0 16 0 8 8 0 0 0-8-8zm.8 12H7.2V7.2h1.6zm0-6.4H7.2V4h1.6z"
      />
    </svg>
  );
}

export default IconsInfo;

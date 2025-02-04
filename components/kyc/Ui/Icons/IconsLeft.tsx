import React, { SVGProps } from 'react';
import classes from 'classnames';

function IconsLeft({
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
      viewBox="0 0 30 8"
      {...props}
      className={classes('icons8', props.className)}
    >
      <path
        fill="currentColor"
        d="M3.933 0 0 4l3.933 4 .652-.622-2.874-2.924H30V3.56H1.694L4.585.622z"
      />
    </svg>
  );
}

export default IconsLeft;

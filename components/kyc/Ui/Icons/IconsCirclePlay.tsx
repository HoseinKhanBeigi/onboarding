import React, { SVGProps } from 'react';
import classes from 'classnames';

function IconsCirclePlay({
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
      viewBox="-8 -8 64 64"
      {...props}
      className={classes('icons8', props.className)}
    >
      <defs>
        <filter
          id="prefix__a"
          x={0}
          y={0}
          width={64}
          height={64}
          filterUnits="userSpaceOnUse"
        >
          <feOffset dy={3} />
          <feGaussianBlur result="blur" stdDeviation={3} />
          <feFlood floodOpacity={0.161} />
          <feComposite in2="blur" operator="in" />
          <feComposite in="SourceGraphic" />
        </filter>
      </defs>
      <g filter="url(#prefix__a)">
        <path
          fill="currentColor"
          d="M24 0C10.745 0 0 10.745 0 24s10.745 24 24 24 24-10.745 24-24h0C48 10.745 37.255 0 24 0zm-5.31 14.58a2.05 2.05 0 0 1 .85.21L34 22.41a1.8 1.8 0 0 1 0 3.18l-14.47 7.62a1.81 1.81 0 0 1-2.64-1.6V16.39a1.8 1.8 0 0 1 1.8-1.8z"
        />
      </g>
    </svg>
  );
}

export default IconsCirclePlay;

import { SVGProps } from 'react';
import classnames from '../../lib/classnames';

function IconsOk({ width, height, color, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={width || '1em'}
      height={height || '1em'}
      color={color || 'inherit'}
      viewBox="0 0 16 16"
      {...props}
      className={classnames('icons8', props.className)}
    >
      <path
        fill="currentColor"
        d="M19.765 5.973a.889.889 0 0 0-.876.9v.786a8.084 8.084 0 1 0 3.043 5.321.889.889 0 0 0-1.764.22A6.219 6.219 0 1 1 14 7.761a6.165 6.165 0 0 1 3.19.888h-.079a.888.888 0 1 0 0 1.777h2.667a.889.889 0 0 0 .889-.888V6.873a.889.889 0 0 0-.9-.9z"
        transform="translate(-6 -5.972)"
      />
    </svg>
  );
}

export default IconsOk;

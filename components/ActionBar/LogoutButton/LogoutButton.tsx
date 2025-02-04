import React from 'react';
import { LogoutOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import classes from 'classnames';
import style from './LogoutButton.scss';
import Button from '../../Button/Button';

interface LogoutButtonProps {
  // eslint-disable-next-line react/require-default-props
  className?: string;
  // eslint-disable-next-line react/require-default-props
  disabled?: boolean;
  action: string;
  product: string;
}

export function logout(router, action, product) {
  router.push(
    '/auth/[action]/[product]/logout',
    `/auth/${action}/${product}/logout`,
  );
}

export default function LogoutButton({
  className,
  disabled,
  action,
  product,
}: LogoutButtonProps) {
  const router = useRouter();
  function onLogout() {
    logout(router, action, product);
  }
  return (
    <Button
      onClick={() => onLogout()}
      disabled={disabled}
      className={classes(className, style.buttonColor)}
      type="primary"
      ghost
    >
      <LogoutOutlined className={style.exitBtnIcon} />
      <span>خروج</span>
    </Button>
  );
}

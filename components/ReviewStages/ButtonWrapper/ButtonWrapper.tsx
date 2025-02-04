import React from 'react';
import { LeftOutlined } from '@ant-design/icons';
import classes from 'classnames';
import style from './ButtonWrapper.scss';
import Button from '../../Button/Button';
import LogoutButton from '../../ActionBar/LogoutButton/LogoutButton';

export interface ButtonWrapperInterface {
  goToReview: (string) => void;
  disabled: boolean;
  product: string;
}

export default function ButtonWrapper({
  disabled,
  goToReview,
  product,
}: ButtonWrapperInterface) {
  return (
    <div className={style.mobileButtonWrapper}>
      <div className={classes('arrow-button', disabled && 'disabled')}>
        <LeftOutlined
          className={disabled ? style.arrowDisableIcon : style.arrowEnableIcon}
        />
      </div>
      <div className="render-button">
        <Button
          type="primary"
          color="primary"
          className={style.checkInfoBtn}
          onClick={goToReview}
          disabled={disabled}
        >
          {disabled ? (
            <span>بررسی و تایید اطلاعات</span>
          ) : (
            <div className={style.titleWrapper}>
              <span>بررسی و تایید اطلاعات</span>
              <LeftOutlined />
            </div>
          )}
        </Button>
        <LogoutButton action="onboarding" product={product} />
      </div>
    </div>
  );
}

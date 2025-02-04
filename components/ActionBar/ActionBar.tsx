import React, { useState } from 'react';
import { LeftOutlined } from '@ant-design/icons';
import Link from 'next/link';
import style from './ActionBar.scss';
import Button from '../Button/Button';
import { BrandingInterface } from '../../interfaces/branding.interface';
import LogoutButton from './LogoutButton/LogoutButton';
import FormInput from '../FormInput';
import { Checkbox } from 'antd';

export interface ActionBarInterface {
  buttons: string[];
  actions: Record<string, (string) => void>;
  loading?: boolean;
  error?: boolean;
  product: string;
  brand?: BrandingInterface;
}

function ActionBar({
  buttons,
  actions,
  loading,
  error,
  product,
  brand,
}: ActionBarInterface) {
  const [disable, setDisabled] = useState(true);
  const handleChange = e => {
    setDisabled(!e.target.checked);
  };
  const renderedButtons = buttons.map(type => {
    const action = actions[type] || (() => {});
    if (type === 'next') {
      return (
        <Button
          key={type}
          htmlType="submit"
          type="primary"
          className={style.buttonColor}
          onClick={() => action('FORWARD')}
          loading={loading}
        >
          ثبت و ادامه <LeftOutlined />
        </Button>
      );
    } else if (type === 'exit') {
      return (
        <LogoutButton
          key={type}
          disabled={loading}
          product={product}
          action="onboarding"
        />
      );
    } else if (type === 'backToThirdParty') {
      return (
        <Button
          key={type}
          type="primary"
          className={style.buttonColor}
          onClick={() => action('BACK')}
          loading={loading}
        >
          بازگشت
          {brand?.label ? ` به ${brand.label}` : ''}
        </Button>
      );
    } else if (type === 'approve') {
      if (brand?.productGroup === 'SEJAM') {
        return (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Link href={`/onboarding/${brand.name}/condition`} passHref>
                <a target="_blank" rel="noopener noreferrer">
                  <span>تمامی شرایط و تعهدات مندرج را می پذیرم</span>
                </a>
              </Link>
              <Checkbox onChange={handleChange} />
            </div>
            <Button
              key={type}
              htmlType="submit"
              type="primary"
              disabled={disable}
              className={style.buttonColor}
              onClick={() => action('APPROVE')}
              loading={loading}
            >
              تایید و ثبت نهایی
            </Button>
          </>
        );
      }
      return (
        <>
          <Button
            key={type}
            htmlType="submit"
            type="primary"
            className={style.buttonColor}
            onClick={() => action('APPROVE')}
            loading={loading}
          >
            تایید و ثبت نهایی
          </Button>
        </>
      );
    } else {
      return <></>;
    }
  });

  return <div className={style.buttonContainer}>{renderedButtons}</div>;
}

export default ActionBar;

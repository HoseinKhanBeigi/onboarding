import { Radio } from 'antd';
import React, { useMemo } from 'react';
import style from './Locations.scss';
import classes from 'classnames';

interface LocationsProps {
  title?: string;
  onChange?: any;
  value?: any;
  addresses?: Array<any>;
  data?: any;
  error?: string;
  disabled: boolean;
  inputName: string;
}

const AddressMapper = {
  LIVING: 'منزل',
  OTHER: 'دیگر',
  WORKING: 'محل کار',
};

export function Locations({
  title,
  onChange,
  value,
  addresses,
  data,
  disabled,
  error,
  inputName,
}: LocationsProps) {
  const items = useMemo(() => {
    return (
      addresses || (data.initialData && data.addressType && [data.initialData])
    );
  }, [addresses, data.initialData]);

  function setAddress(addressId) {
    onChange(addressId);
  }

  const renderedItems = items?.map(item => (
    <div className="locations-item" key={item.addressType}>
      <Radio value={item.addressType} className={style.radio}>
        {AddressMapper[item.addressType]}
      </Radio>
      <div className={classes('street', style.address)}>{item.street}</div>
    </div>
  ));
  return (
    <div className="ant-form-item">
      <div
        className={classes(
          'ant-form-item-control',
          error ? 'has-error' : 'has-success',
        )}
      >
        <div className={style.containerTitle}>{title}</div>
        <div className={classes('locations', inputName, style.container)}>
          <Radio.Group
            onChange={e => setAddress(e.target.value)}
            value={value}
            className={style.livingAddress}
            disabled={disabled}
          >
            {renderedItems || (
              <div className={style.address}>
                شما هیچ آدرسی ثبت نکرده‌اید، لطفا آدرس جدید ثبت کنید، یا تلفنی
                هماهنگ شود را انتخاب کنید.
              </div>
            )}
          </Radio.Group>
        </div>
        {error && <div className="ant-form-explain">{error}</div>}
      </div>
    </div>
  );
}

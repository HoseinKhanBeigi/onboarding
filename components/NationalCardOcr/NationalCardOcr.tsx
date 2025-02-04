import React, { useEffect, useMemo, useState } from 'react';
import { CameraFilled, ScanOutlined } from '@ant-design/icons/lib';
import { Button, Modal } from 'antd';
import CardScanner from '../CardScanner/CardScanner';
import style from './NationalCardOcr.scss';
import { DataSourceInterface } from '../../interfaces/entity.interface';
import { FormInput } from '../index';
import { StartForItemInterface } from '../../interfaces/branding.interface';
import { validateNationalId } from '../../lib/formValidation';
import { StringUtils } from '../../lib/StringUtils';
import DataInjector from '../../lib/DataInjector';
import { ObjectUtils } from '../../lib/ObjectUtils';

export interface NationalCardDataInterface {
  nationalCode: string;
  firstName?: string;
  lastName?: string;
  birthDate?: string;
  fatherName?: string;
  expirationDate?: string;
  birthDateEpoch: number;
  expirationDateEpoch?: number;
}

interface NationalCardOcrProps {
  value?: NationalCardDataInterface;
  requestConfig: DataSourceInterface;
  startForItemInterface?: false | StartForItemInterface;
  onChange?: (value: NationalCardDataInterface) => void;
}

export function NationalCardOcr({
  onChange,
  requestConfig,
  startForItemInterface,
}: NationalCardOcrProps) {
  const [data, setData] = useState<NationalCardDataInterface>();
  const [showScan, setShowScan] = useState<boolean>(false);

  const isUniqIdValid = useMemo(() => {
    return validateNationalId(data?.nationalCode || '');
  }, [data]);

  useEffect(() => {
    if (
      data?.birthDateEpoch &&
      StringUtils.isItFilled(data.birthDateEpoch.toString()) &&
      StringUtils.isItFilled(data?.nationalCode) &&
      isUniqIdValid &&
      onChange
    ) {
      onChange(data);
    }
  }, [data]);

  const uniqIdLabel = useMemo(() => {
    return startForItemInterface
      ? startForItemInterface?.uniqIdLabel
      : 'کد ملی';
  }, [startForItemInterface]);

  function setNationalCode(value: string) {
    setData({
      nationalCode: value,
      birthDateEpoch: data?.birthDateEpoch || Date.now(),
    });
  }

  function setBirthDate(value: number) {
    setData({ birthDateEpoch: value, nationalCode: data?.nationalCode || '' });
  }

  const maxDateValidation = parseInt(
    DataInjector.unixDateMapper('${unixDate:now}'),
    10,
  );

  function checkDataAndCloseModal(extractedData: NationalCardDataInterface) {
    if (ObjectUtils.checkIfItsFilled(extractedData)) {
      setShowScan(false);
      setData(extractedData);
    }
  }

  return (
    <div>
      <div className={style.manualContainer}>
        <FormInput
          type="input"
          value={data?.nationalCode}
          inputName="nationalCode"
          title={uniqIdLabel}
          placeholder={`${uniqIdLabel} را وارد کنید`}
          error={
            StringUtils.isItFilled(data?.nationalCode) &&
            !isUniqIdValid &&
            `${uniqIdLabel} وارد شده صحیح نیست`
          }
          onChange={val => setNationalCode(val.trim())}
          className={style.formItem}
          extractor={value => value}
          converter={value => value}
        />
        <FormInput
          type="date-picker"
          value={data?.birthDateEpoch || Date.now()}
          inputName="birthDate"
          title="تاریخ تولد"
          error=""
          onChange={setBirthDate}
          className={style.formItem}
          extractor={value => value}
          converter={value => value}
          max={maxDateValidation}
        />
      </div>
      {/*<Button*/}
      {/*  type="primary"*/}
      {/*  ghost*/}
      {/*  className={style.outLineButton}*/}
      {/*  onClick={() => setShowScan(true)}*/}
      {/*>*/}
      {/*  <ScanOutlined className={style.scanIcon} />*/}
      {/*  وارد کردن اطلاعات با اسکن کارت ملی*/}
      {/*</Button>*/}
      {/*<Modal*/}
      {/*  title="Basic Modal"*/}
      {/*  visible={showScan}*/}
      {/*  onCancel={() => setShowScan(false)}*/}
      {/*  centered*/}
      {/*  footer={null}*/}
      {/*  className={style.modal}*/}
      {/*>*/}
      {/*  <span className={style.title}>روی کارت ملی</span>*/}
      {/*  <hr className={style.separator} />*/}
      {/*  {showScan && (*/}
      {/*    <CardScanner*/}
      {/*      requestConfig={requestConfig}*/}
      {/*      onChange={checkDataAndCloseModal}*/}
      {/*      description={*/}
      {/*        <p className={style.guide}>*/}
      {/*          لطفاً کادر مشخص شده در تصویر را بر روی کارت‌ملی خود تنظیم کرده و*/}
      {/*          دکمه*/}
      {/*          <CameraFilled />*/}
      {/*          را فشار دهید، و یا برای آپلود عکس کارت ملی خود که از قبل*/}
      {/*          گرفته‌اید، گزینه انتخاب تصویر از گالری را بزنید.*/}
      {/*        </p>*/}
      {/*      }*/}
      {/*    />*/}
      {/*  )}*/}
      {/*</Modal>*/}
    </div>
  );
}

export default NationalCardOcr;

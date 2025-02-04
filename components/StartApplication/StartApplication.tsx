import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { Modal } from 'antd';
import {
  customStartApplication,
  startApplication,
} from '../../store/application/action';
import { RootState } from '../../store/rootReducer';
import style from './StartApplication.scss';
import Switch from '../Switch/Switch';
import { FormInput } from '../index';
import Button from '../Button/Button';
import LogoutButton from '../ActionBar/LogoutButton/LogoutButton';
import { ObjectUtils } from '../../lib/ObjectUtils';
import { StringUtils } from '../../lib/StringUtils';
import {
  isValidMobile,
  validateCompanyId,
  validateNationalId,
} from '../../lib/formValidation';
import {
  NationalCardDataInterface,
  NationalCardOcr,
} from '../NationalCardOcr/NationalCardOcr';

export default function StartApplication() {
  const [uniqId, setUniqId] = useState('');
  const [ocrData, setOcrData] = useState<NationalCardDataInterface>();
  const [categoryId, setCategoryId] = useState<number>();
  const [otherMobile, setOtherMobile] = useState<string>('');
  const [relation, setRelation] = useState('MYSELF');
  const [displayError, setDisplayError] = useState(false);
  const metaData = useMemo(() => {
    if (typeof window !== 'undefined') {
      try {
        const data = sessionStorage.getItem('meta-data');
        if (StringUtils.isItFilled(data)) {
          const parsedData = JSON.parse(data as string);
          const dataArray: Array<any> = [];
          Object.keys(parsedData).forEach(item =>
            dataArray.push({ key: item, value: parsedData[item] }),
          );
          return dataArray;
        } else {
          return null;
        }
      } catch {
        return null;
      }
    }
  }, []);
  const [abandonedProductTypeModal, setAbandonedProductTypeModal] = useState<{
    visible: boolean;
    message: string;
    links: Array<any>;
  }>({ visible: false, message: '', links: [] });
  const dispatch = useDispatch();
  const router = useRouter();
  const { product } = router.query;
  const applicationStatus = useSelector(({ application }: RootState) => ({
    error: application.error,
    loading: application.loading,
    errorMessage: application.errorMessage,
  }));

  const branding = useSelector(
    ({ branding: brandingStore }: RootState) => brandingStore.data,
  );

  const selectedStartForItem = useMemo(() => {
    if (branding?.startFor?.length) {
      if (branding?.startFor?.length === 1) {
        return branding?.startFor[0];
      } else {
        const selectedItem = branding?.startFor.find(
          item => item.value === relation,
        );
        if (
          ObjectUtils.checkIfItsFilled(selectedItem) &&
          StringUtils.isItFilled(selectedItem?.uniqIdLabel)
        ) {
          return selectedItem;
        }
      }
    }
    return false;
  }, [branding, relation]);

  const isMerchant = useMemo(
    () => selectedStartForItem && selectedStartForItem?.type === 'MERCHANT',
    [selectedStartForItem],
  );

  const isGrownUpOther = useMemo(() => {
    if (!selectedStartForItem) {
      return false;
    } else if (selectedStartForItem?.type !== 'INDIVIDUAL') {
      return false;
    } else if (['MYSELF', 'CHILD'].includes(selectedStartForItem?.value)) {
      return false;
    }
    return true;
  }, [selectedStartForItem]);

  useEffect(() => {
    if (!isGrownUpOther) {
      setOtherMobile('');
    }
  }, [isGrownUpOther]);

  const isOtherMobileValid = useMemo(() => {
    if (!isGrownUpOther) {
      return true;
    } else {
      return isValidMobile(otherMobile);
    }
  }, [isGrownUpOther, otherMobile]);

  useEffect(() => {
    if (branding?.startFor?.length) {
      const filteredItems = branding?.startFor?.filter(item => !item.disabled);
      if (filteredItems?.length) {
        setRelation(filteredItems[0].value);
      }
    }
  }, [branding]);

  const isUniqIdValid = useMemo(() => {
    if (
      selectedStartForItem &&
      selectedStartForItem.type &&
      selectedStartForItem.type === 'BUSINESS'
    ) {
      return validateCompanyId(uniqId);
    } else if (
      selectedStartForItem &&
      selectedStartForItem.type &&
      selectedStartForItem.type !== 'INDIVIDUAL'
    ) {
      return new RegExp(selectedStartForItem.pattern || /^\d{10,11}$/).test(
        uniqId,
      );
    }

    return validateNationalId(uniqId);
  }, [uniqId, selectedStartForItem]);

  function checkCode(code) {
    if (branding?.errorOnTypes) {
      if (branding.errorOnTypes[code]) {
        setAbandonedProductTypeModal({
          visible: true,
          message: branding.errorOnTypes[code].message,
          links: branding.errorOnTypes[code].links,
        });
        return false;
      }
    }
    setAbandonedProductTypeModal({
      visible: false,
      message: '',
      links: [],
    });
    return true;
  }

  const readyToSubmit = useMemo(() => {
    if (isGrownUpOther && !isOtherMobileValid) {
      return false;
    }
    if (branding?.actions?.ocrRequest && ocrData) {
      return true;
    }
    return (
      StringUtils.isItFilled(uniqId) &&
      isUniqIdValid &&
      (!isMerchant || StringUtils.isItFilled(categoryId))
    );
  }, [isOtherMobileValid, ocrData, uniqId, relation, categoryId]);

  async function handleSubmit() {
    if (readyToSubmit) {
      if (branding?.actions?.startApplication) {
        await dispatch(
          customStartApplication(
            branding?.actions?.startApplication,
            Object.assign(
              {
                uniqId,
                relation,
                metaData,
                categoryId,
                otherMobile,
                orgCode: branding?.orgCode,
                productGroup: branding?.productGroup || (product as string),
              },
              ocrData,
            ),
            router,
            checkCode,
          ),
        );
      } else {
        await dispatch(
          startApplication(
            isMerchant ? `${categoryId}-${uniqId}` : uniqId,
            branding?.productGroup || (product as string),
            relation,
            branding?.orgCode,
            metaData,
            checkCode,
          ),
        );
      }
    } else {
      setDisplayError(true);
    }
  }

  const links = useMemo(
    () =>
      abandonedProductTypeModal.links.map(item => (
        <Button href={item.href} type="primary" className={style.linksButton}>
          {item.label}
        </Button>
      )),
    [abandonedProductTypeModal.links],
  );

  const items = useMemo(() => {
    if (isMerchant) {
      return branding?.extraConfig?.category?.map(({ id, title }) => ({
        id,
        label: title,
      }));
    } else {
      return [];
    }
  }, [branding?.extraConfig?.category, isMerchant]);

  const uniqIdLabel = useMemo(() => {
    return selectedStartForItem ? selectedStartForItem?.uniqIdLabel : 'کد ملی';
  }, [selectedStartForItem]);

  const background = useMemo(() => {
    if (branding?.theme && branding?.theme.sidebar.background.image) {
      return branding?.theme.sidebar.background.image.desktop.url;
    } else if (
      branding?.name === 'demo-brokerage' ||
      branding?.name === 'demo-sejam' ||
      branding?.name === 'kbr-brokerage' ||
      branding?.name === 'kbr-sejam' ||
      branding?.name === 'dorsa'
    ) {
      return '/static/images/startApplication.jpg';
    }
  }, [branding?.theme]);

  function onOcrChange(value: NationalCardDataInterface) {
    setOcrData(value);
  }

  return (
    <div className={style.mainContainer}>
      <div className={style.sideLayout}>
        <div className={style.container}>
          <div className={style.content}>
            <h3>خوش آمدید</h3>
            <div className={style.box}>
              {branding?.startFor?.length && branding?.startFor?.length > 1 ? (
                <div className={style.row}>
                  <Switch
                    value={relation}
                    items={branding?.startFor}
                    label="ثبت نام برای:"
                    onChange={setRelation}
                  />
                </div>
              ) : (
                ''
              )}
              <div className={style.row}>
                {isGrownUpOther && (
                  <FormInput
                    type="input"
                    value={otherMobile}
                    inputName="mobile"
                    title="شماره موبایل شخص"
                    placeholder="شماره موبایل را وارد کنید"
                    error={
                      displayError &&
                      !isOtherMobileValid &&
                      `شماره موبایل صحیح را وارد کنید`
                    }
                    onChange={val => setOtherMobile(val.trim())}
                    className={style.formItem}
                    extractor={value => value}
                    converter={value => value}
                  />
                )}
                {!branding?.actions?.ocrRequest && (
                  <FormInput
                    type="input"
                    value={uniqId}
                    inputName="nationalCode"
                    title={uniqIdLabel}
                    placeholder={`${uniqIdLabel} را وارد کنید`}
                    error={
                      displayError &&
                      !isUniqIdValid &&
                      `${uniqIdLabel} صحیح را وارد کنید`
                    }
                    onChange={val => setUniqId(val.trim())}
                    className={style.formItem}
                    extractor={value => value}
                    converter={value => value}
                  />
                )}
                {branding?.actions?.ocrRequest && (
                  <NationalCardOcr
                    onChange={onOcrChange}
                    requestConfig={branding?.actions.ocrRequest}
                    startForItemInterface={selectedStartForItem}
                  />
                )}
                {isMerchant && (
                  <FormInput
                    type="select"
                    value={categoryId}
                    inputName="merchantCode"
                    items={items}
                    title="نوع کسب‌و‌کار"
                    placeholder="نوع کسب‌و‌کار خود را وارد کنید"
                    onChange={val => setCategoryId(val.trim())}
                    className={style.formItem}
                    extractor={value => value}
                    converter={value => value}
                    error={
                      displayError &&
                      isUniqIdValid &&
                      `لطفا نوع کسب‌و‌کار را انتخاب کنید`
                    }
                  />
                )}
              </div>
              {applicationStatus.error && (
                <span className={style.errorText}>
                  {applicationStatus.errorMessage}
                </span>
              )}
              <Button
                type="primary"
                htmlType="submit"
                onClick={() => handleSubmit()}
                loading={applicationStatus.loading}
                className={style.submit}
                disabled={!readyToSubmit}
              >
                شروع ثبت‌نام
              </Button>
              <LogoutButton action="onboarding" product={product as string} />
            </div>
          </div>
        </div>
        <div className={style.footer}>
          <img
            className={style.logo}
            src={branding?.logo}
            alt={`${branding?.label} Logo`}
          />
          <span>{branding?.description}</span>
          <span>پشتیبانی: {branding?.phone}</span>
        </div>
      </div>
      <div className={style.contentLayout}>
        <div className={style.backgroundImgWrapper}>
          <img src={background} alt="background" />
        </div>
      </div>
      <Modal
        title="Basic Modal"
        visible={abandonedProductTypeModal.visible}
        centered
        closable
        maskClosable
        wrapClassName={style.startModal}
        footer={[
          ...links,
          <LogoutButton
            action="onboarding"
            product={product as string}
            className={style.exitButton}
          />,
        ]}
      >
        {abandonedProductTypeModal.visible && (
          <div className={style.startContentModal}>
            {abandonedProductTypeModal.message}
          </div>
        )}
      </Modal>
    </div>
  );
}

import React, {useMemo, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Input} from 'antd';
import {useRouter} from 'next/router';
import {RootState} from '../../store/rootReducer';
import {StringUtils} from '../../lib/StringUtils';
import Button from '../Button/Button';
import style from './Referral.scss';
import {
  customGetApplicationById,
  customSetReferralCode,
  getApplicationById,
  setReferralCode,
} from '../../store/application/action';

function Referral() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { application, loading } = useSelector(
    ({ application: applicationStore }: RootState) => ({
      application: applicationStore?.data?.application,
      loading: applicationStore?.loading,
    }),
  );
  const { orgCode, actions } = useSelector(({ branding }: RootState) => ({
    orgCode: branding?.data?.orgCode,
    actions: branding?.data?.actions,
  }));
  const [insertedRefCode, changeRefCode] = useState('');
  const { applicationId, referrerCode, disabled } = useMemo(
    () => ({
      applicationId: application?.applicationInfo.applicationID || '',
      referrerCode:
        application?.applicationInfo.referrerCode || insertedRefCode,
      disabled: StringUtils.isItFilled(
        application?.applicationInfo.referrerCode,
      ),
    }),
    [application, insertedRefCode],
  );

  async function submitReferralCode() {
    if (!disabled) {
      if (actions?.submitApplicationReferral) {
        await dispatch(
          customSetReferralCode(
            actions?.submitApplicationReferral,
            {
              applicationId,
              referrerCode,
              orgCode,
            },
            router,
          ),
        );
      } else {
        await dispatch(setReferralCode(applicationId, referrerCode, orgCode));
      }
      if (actions?.getApplication) {
        await dispatch(
          customGetApplicationById(
            actions?.getApplication,
            {
              orgCode,
              applicationId,
            },
            router,
          ),
        );
      } else {
        await dispatch(getApplicationById(applicationId, orgCode));
      }
    }
  }

  return (
    <>
      <span className={style.labelTitle}>کد معرف را وارد کنید</span>
      <div className={style.buttonContainer}>
        <Input
          value={referrerCode}
          name="referralCode"
          onChange={({ target: { value: val } }) => changeRefCode(val)}
          className={style.input}
          placeholder="در صورتی که کد معرف دارید وارد کنید"
          disabled={disabled}
        />
        <Button
          loading={loading}
          hidden={disabled}
          type="primary"
          onClick={submitReferralCode}
        >
          تایید
        </Button>
      </div>
    </>
  );
}

export default Referral;

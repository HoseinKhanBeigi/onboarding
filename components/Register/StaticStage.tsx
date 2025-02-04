import React from 'react';
import {CheckCircleOutlined} from '@ant-design/icons';
import {useSelector} from 'react-redux';
import Notice from '../Notice/Notice';
import {RootState} from '../../store/rootReducer';
import StaticPageContainer from '../StaticPageContainer/StaticPageContainer';
import style from '../Notice/Notice.scss';

interface StaticStageProps {
  currentStage: string;
  actionBar: JSX.Element;
}

export function StaticStage({ currentStage, actionBar }: StaticStageProps) {
  const application = useSelector(
    ({ application: applicationStore }: RootState) =>
      applicationStore.data?.application,
  );

  const staticComponent = (() => {
    if (currentStage === 'FINAL') {
      return (
        <Notice
          icon={<CheckCircleOutlined className={style.checkIcon} />}
          title="عملیات با موفقیت انجام شد"
          message="اطلاعات شما با موفقیت ثبت و تایید شد. اکنون می توانید به حساب کاربری خود در سامانه دسترسی داشته باشید"
        />
      );
    } else if (currentStage === 'PENDING') {
      const isPendingKyc =
        application?.applicationInfo.stagingState === 'PENDING_KYC';
      if (isPendingKyc) {
        return (
          <Notice
            title="در انتظار تایید احراز هویت"
            message="اطلاعات شما تایید شد. پس از تایید احراز هویت شما توسط همکاران ما،نتیجه از طریق پیامک به اطلاع شما خواهد رسید"
          />
        );
      } else {
        return (
          <Notice
            title="در حال بررسی اطلاعات"
            message="اطلاعات شما با موفقیت دریافت شد. پس از بررسی اطلاعات توسط همکاران ما، نتیجه از طریق پیامک به اطلاع شما خواهد رسید."
          />
        );
      }
    } else {
      return null;
    }
  })();
  return (
    <StaticPageContainer>
      {staticComponent}
      {actionBar}
    </StaticPageContainer>
  );
}

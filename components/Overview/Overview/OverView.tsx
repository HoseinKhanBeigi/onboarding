import React, { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import ListGenerator from '../ListGenerator';
import style from './OverView.scss';
import { ProductInterface } from '../../../interfaces/product.interface';
import { generateLabelObject } from './GenerateLabelObject';
import { joinObjectsOfArray, JoinObjectsOfArray } from './JoinObjectsOfArray';
import { RootState } from '../../../store/rootReducer';
import { StepRouteInterface } from '../../../interfaces/step-route.Interface';
import Referral from '../../Referral/Referral';

interface OverviewProps {
  product?: ProductInterface;
  steps?: Array<StepRouteInterface>;
}

function OverView({ product, steps }: OverviewProps) {
  const stagesData = useSelector(({ stages: { data } }: RootState) => data);
  const branding = useSelector(({ branding: { data } }: RootState) => data);
  const extraData = useSelector(
    ({ stageAdditionalData: { data } }: RootState) => data,
  );
  const applicationStatus = useSelector(({ application }: RootState) => ({
    error: application.error,
    loading: application.loading,
    errorMessage: application.errorMessage,
  }));
  const router = useRouter();
  const builtinFilteredStages = useMemo(
    () => product?.stages.filter(item => !item.builtin),
    [product?.stages],
  );
  const builtinFilteredSteps = useMemo(
    () => steps?.filter(item => !item.builtin),
    [steps],
  );

  const showReferral = useMemo(() => branding?.showReferral, [
    branding?.showReferral,
  ]);

  const labelObject: Record<string, any> = useMemo(
    () => generateLabelObject(builtinFilteredStages || []),
    [builtinFilteredStages],
  );

  useEffect(()=>{
    console.log(branding?.showReferral)
  },[])

  const list: JoinObjectsOfArray = joinObjectsOfArray(
    stagesData || {},
    labelObject,
    builtinFilteredStages || [],
    router,
    extraData,
  );
  return (
    <div className={style.root}>
      <div className={style.box}>
        <span className={style.title} data-cy="title">
          بررسی و تایید نهایی اطلاعات
        </span>
        <hr />
        <ListGenerator
          list={list}
          productData={builtinFilteredStages || []}
          steps={builtinFilteredSteps || []}
        />
      </div>
      {showReferral && (
        <div className={style.box}>
          <span className={style.title} data-cy="title">
            کد معرف
          </span>
          <hr />
          <Referral />
        </div>
      )}

      {applicationStatus.error && (
        <span className={style.errorText}>
          {applicationStatus.errorMessage}
        </span>
      )}
    </div>
  );
}

export default OverView;

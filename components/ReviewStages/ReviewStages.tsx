import React from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import style from './ReviewStages.scss';
import { StepRouteInterface } from '../../interfaces/step-route.Interface';
import { StepsBar } from '..';
import ButtonWrapper from './ButtonWrapper/ButtonWrapper';
import { RootState } from '../../store/rootReducer';
import { StringUtils } from '../../lib/StringUtils';

export interface ReviewStagesProps {
  steps: Array<StepRouteInterface>;
  currentStage: string;
}

export function ReviewStages({ steps, currentStage }: ReviewStagesProps) {
  const applicationCurrentStage = useSelector(
    ({ application }: RootState) =>
      application.data?.application?.applicationInfo.currentStage,
  );
  const router = useRouter();
  const { product, applicationId } = router.query;
  function goToReview() {
    router.push(
      '/onboarding/[product]/[step]/[applicationId]',
      `/onboarding/${product}/review/${applicationId}`,
    );
  }

  return (
    <>
      <div className={style.group}>
        <div className={style.stepContainer}>
          <StepsBar current={currentStage} steps={steps} />
        </div>
        <ButtonWrapper
          goToReview={goToReview}
          product={product as string}
          disabled={StringUtils.isItFilled(applicationCurrentStage)}
        />
      </div>
    </>
  );
}

export default ReviewStages;

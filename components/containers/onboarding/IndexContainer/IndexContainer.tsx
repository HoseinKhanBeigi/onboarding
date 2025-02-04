import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../../store/rootReducer';
import {CurrentApplicationInterface} from '../../../../interfaces/application.interface';
import {useClientRedirectUrl} from '../../../useClientRedirectUrl';
import {useReferral} from '../../../Referral/useReferral';
import useAuthGuard from '../../../useAuthGuard/useAuthGuard';
import useUpdateErrorMap from '../../../useUpdateErrorMap/useUpdateErrorMap';
import {
  customGetApplicationById,
  customGetApplications,
  getApplicationById,
  getApplications,
} from '../../../../store/application/action';
import {inProgress, isApproved, isPending, isWon} from '../../../../xstate/guards';

export default function IndexContainer() {
  const [triedRequest, setTriedRequest] = useState('');
  const router = useRouter();
  const dispatch = useDispatch();
  const [
    applications,
    currentApplication,
    loading,
  ] = useSelector(({ application }: RootState) => [
    application?.data?.applications,
    application?.data?.application as CurrentApplicationInterface,
    application?.loading as boolean,
  ]);
  const { error: applicationError, errorCode } = useSelector(
    ({ application }: RootState) => ({
      error: application?.error,
      errorCode: application?.errorCode,
    }),
  );

  const { product } = router.query;
  useClientRedirectUrl(product, null);
  useReferral(product);
  useAuthGuard('onboarding', product as string);
  useUpdateErrorMap();
  const { orgCode, productGroup, productType, actions } = useSelector(
    (state: RootState) => ({
      orgCode: state.branding?.data?.orgCode,
      productGroup: state.branding?.data?.productGroup,
      productType: state.branding?.data?.type,
      actions: state.branding?.data?.actions,
    }),
  );

  function checkIfProductTypeIsIndividual() {
    return ['BUSINESS', 'MERCHANT'].includes(productType as string);
  }

  function checkConcurrencyAndTryToGetApplicationIfJustThereWasAnApplication() {
    const filteredApplications = applications?.filter(
      item => item.productGroup === productGroup,
    );
    if (
      filteredApplications?.length === 1 &&
      filteredApplications[0].startOnboardingFor === 'MYSELF' &&
      filteredApplications[0].applicationFinalStatus !== 'WON'
    ) {
      if (triedRequest !== 'getApplicationById') {
        setTriedRequest('getApplicationById');
        if (actions?.getApplication) {
          dispatch(
            customGetApplicationById(
              actions?.getApplication,
              {
                orgCode,
                applicationId: filteredApplications[0].applicationID,
              },
              router,
            ),
          );
        } else {
          dispatch(
            getApplicationById(filteredApplications[0].applicationID, orgCode),
          );
        }
      }
      return true;
    }
    return false;
  }

  function checkIfThereIsNoApplicationAssignedToTheUser() {
    const hasApplication =
      applications &&
      applications?.filter(item => item.productGroup === productGroup).length >
        0;
    return triedRequest === 'getApplications' && !hasApplication && !loading;
  }

  function checkIfApplicationFetched() {
    return applications && applications.length && !loading;
  }

  function checkIfApplicationsHasNotBeenTriedToFetch() {
    return !applications && !loading && triedRequest !== 'getApplications';
  }

  function checkIfCurrentApplicationFetchedAndItsNotNull() {
    return (
      currentApplication &&
      currentApplication.preCondition &&
      currentApplication.applicationInfo
    );
  }

  useEffect(() => {
    if (Number(errorCode) !== 401) {
      if (checkIfThereIsNoApplicationAssignedToTheUser()) {
        router.push(
          '/onboarding/[product]/start',
          `/onboarding/${product}/start`,
        );
      } else if (checkIfApplicationFetched()) {
        if (
          checkIfProductTypeIsIndividual() ||
          !checkConcurrencyAndTryToGetApplicationIfJustThereWasAnApplication()
        ) {
          router.push(
            '/onboarding/[product]/applications',
            `/onboarding/${product}/applications`,
          );
        }
      } else if (checkIfApplicationsHasNotBeenTriedToFetch()) {
        setTriedRequest('getApplications');
        if (actions?.getApplications) {
          dispatch(
            customGetApplications(
              actions?.getApplications,
              {
                orgCode,
                productGroup,
              },
              router,
            ),
          );
        } else {
          dispatch(getApplications(orgCode));
        }
      }
    }
  }, [applications, loading, triedRequest, product, router, applicationError]);

  function generateCurrentStage() {
    const { applicationInfo } = currentApplication;
    if (isWon(applicationInfo) || isApproved(applicationInfo)) {
      return 'FINAL';
    } else if (inProgress(applicationInfo) && !isPending(applicationInfo)) {
      return applicationInfo.currentStage || 'review';
    } else if (isPending(applicationInfo)) {
      return 'PENDING';
    } else {
      return 'REVIEW';
    }
  }

  useEffect(() => {
    if (checkIfCurrentApplicationFetchedAndItsNotNull()) {
      const {
        applicationInfo: { applicationID },
      } = currentApplication;
      const step = generateCurrentStage();
      router.push(
        '/onboarding/[product]/[step]/[applicationId]',
        `/onboarding/${(product as string).toLowerCase()}/${step}/${applicationID}`,
      );
    }
  }, [currentApplication, product, router]);

  return <p>لطفا صبر کنید ...</p>;
}

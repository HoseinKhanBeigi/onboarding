import React, {useEffect} from 'react';
import {useRouter} from 'next/router';
import {useSelector} from 'react-redux';
import {RootState} from '../../../../store/rootReducer';
import StartApplication from '../../../StartApplication/StartApplication';
import {Utils} from '../../../../lib/utils';
import useAuthGuard from '../../../useAuthGuard/useAuthGuard';
import {isPending, isWon} from '../../../../xstate/guards';
import useUpdateErrorMap from '../../../useUpdateErrorMap/useUpdateErrorMap';
import {useReferral} from '../../../Referral/useReferral';
import {useClientRedirectUrl} from '../../../useClientRedirectUrl';

export default function StartContainer() {
  const router = useRouter();
  const application = useSelector(
    ({ application: applicationStore }: RootState) =>
      applicationStore?.data?.application,
  );
  const { product } = router.query;
  useReferral(product);
  useClientRedirectUrl(product, null);
  useAuthGuard('onboarding', product as string);
  useUpdateErrorMap();
  const theme = useSelector(({ branding }: RootState) => branding.data?.theme);

  useEffect(() => {
    Utils.applyStylesFromBrand(theme);
  }, [theme]);

  useEffect(() => {
    if (application && application.applicationInfo) {
      const {
        applicationInfo: { currentStage, applicationID },
      } = application;
      if (isWon(application.applicationInfo)) {
        router.push(
          '/onboarding/[product]/[step]/[applicationId]',
          `/onboarding/${(product as string).toLowerCase()}/final/${applicationID}`,
        );
      } else if (isPending(application.applicationInfo)) {
        router.push(
          '/onboarding/[product]/[step]/[applicationId]',
          `/onboarding/${(product as string).toLowerCase()}/pending/${applicationID}`,
        );
      } else {
        const step = currentStage ? currentStage.toLowerCase() : 'review';
        router.push(
          '/onboarding/[product]/[step]/[applicationId]',
          `/onboarding/${(product as string).toLowerCase()}/${step}/${applicationID}`,
        );
      }
    }
  }, [application, router]);

  return <StartApplication />;
}

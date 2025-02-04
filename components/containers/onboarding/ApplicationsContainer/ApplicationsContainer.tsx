import React from 'react';
import {useRouter} from 'next/router';
import ApplicationList from '../../../ApplicationList/ApplicationList';
import useAuthGuard from '../../../useAuthGuard/useAuthGuard';
import useUpdateErrorMap from '../../../useUpdateErrorMap/useUpdateErrorMap';
import {useReferral} from '../../../Referral/useReferral';
import {useClientRedirectUrl} from '../../../useClientRedirectUrl';

export default function ApplicationsContainer() {
  const router = useRouter();
  const { product } = router.query;
  useReferral(product);
  useClientRedirectUrl(product, null);
  useAuthGuard('onboarding', product as string);
  useUpdateErrorMap();

  return <ApplicationList />;
}

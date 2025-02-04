import Head from 'next/head';
import React from 'react';
import OnBoardingLayout from '../../../../../components/Layout/OnBoarding';
import BrandingGuard from '../../../../../components/BrandingGuard/BrandingGuard';
import StageContainer from '../../../../../components/containers/onboarding/StageContainer/StageContainer';
import {generalGetInitialProps} from "../../../../../lib/generalGetInitialProps";

export default function Step({ branding, query }) {
  const faviconAddress = `/static/images/favicons/${query.product.toLowerCase()}.png`;
  const title = branding?.title || 'پلتفرم آنبوردینگ';

  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="icon" href={faviconAddress} type="image/gif" sizes="16x16" />
      </Head>
      <BrandingGuard>
        <OnBoardingLayout>
          <StageContainer />
        </OnBoardingLayout>
      </BrandingGuard>
    </>
  );
}

Step.getInitialProps = generalGetInitialProps;

import React from 'react';
import Head from 'next/head';
import BrandingGuard from '../../../../components/BrandingGuard/BrandingGuard';
import StartContainer from '../../../../components/containers/onboarding/StartContainer/StartContainer';
import OnBoardingLayout from '../../../../components/Layout/OnBoarding';
import { generalGetInitialProps } from '../../../../lib/generalGetInitialProps';

export default function StartProductApplication({ branding, query }) {
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
          <StartContainer />
        </OnBoardingLayout>
      </BrandingGuard>
    </>
  );
}

StartProductApplication.getInitialProps = generalGetInitialProps;

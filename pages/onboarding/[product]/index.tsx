import React from 'react';
import parse from 'urlencoded-body-parser';
import Head from 'next/head';
import IndexContainer from '../../../components/containers/onboarding/IndexContainer/IndexContainer';
import BrandingGuard from '../../../components/BrandingGuard/BrandingGuard';
import OnBoardingLayout from '../../../components/Layout/OnBoarding';
import {generalGetInitialProps} from "../../../lib/generalGetInitialProps";

export default function Product({ branding, data, query }) {
  const faviconAddress = `/static/images/favicons/${query.product.toLowerCase()}.png`;
  const title = branding?.title || 'پلتفرم آنبوردینگ';

  if (data && typeof window !== 'undefined') {
    sessionStorage.setItem('meta-data', JSON.stringify(data));
  }

  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="icon" href={faviconAddress} type="image/gif" sizes="16x16" />
      </Head>
      <BrandingGuard>
        <OnBoardingLayout>
          <IndexContainer />
        </OnBoardingLayout>
      </BrandingGuard>
    </>
  );
}

Product.getInitialProps = async function(ctx) {
  const props = await generalGetInitialProps(ctx);
  if (ctx.req?.method === 'POST') {
    const data = await parse(ctx.req);
    return { ...props, data };
  }
};

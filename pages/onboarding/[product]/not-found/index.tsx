import React from 'react';
import Head from 'next/head';
import style from './index.scss';
import OnBoardingLayout from '../../../../components/Layout/OnBoarding';
import {generalGetInitialProps} from "../../../../lib/generalGetInitialProps";
import BrandingGuard from "../../../../components/BrandingGuard/BrandingGuard";

export default function NotFound() {
  const title = 'پلتفرم آنبوردینگ';

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <BrandingGuard>
        <OnBoardingLayout>
          <div className={style.root}>
            <Head>
              <title>ثبت نام | محصول مورد نظر یافت نشد</title>
            </Head>
            <p className={style.title}>404</p>
            <p className={style.message}>محصول مورد نظر یافت نشد</p>
          </div>
        </OnBoardingLayout>
      </BrandingGuard>
    </>
  );
}

NotFound.getInitialProps = generalGetInitialProps;

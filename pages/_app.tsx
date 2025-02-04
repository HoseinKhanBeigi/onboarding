import Head from 'next/head';
import React from 'react';
import getConfig from 'next/config';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import { NextComponentType, NextPageContext } from 'next';
import { AppInitialProps } from 'next/app';
import { AppContext } from 'next/dist/pages/_app';
import { ConfigProvider } from 'antd';
import Persian from 'antd/lib/locale/fa_IR';
import * as Sentry from '@sentry/browser';
import withRedux from 'next-redux-wrapper';
import '@tensorflow/tfjs-backend-webgl';
import { RootState } from '../store/rootReducer';
import configureStore from '../store/store';
import { TenantConfigProvider } from '../components/TenantConfig/TenantConfig';

const {
  publicRuntimeConfig: {
    sentryDsn,
    environment,
    baseUrl,
    fileBaseUrl,
    flowBaseUrl,
    auth,
  },
} = getConfig();

if (sentryDsn && typeof window !== 'undefined') {
  Sentry.init({
    // @ts-ignore
    dsn: sentryDsn,
    environment,
  });
}

const initialState = {
  server: baseUrl,
  file: fileBaseUrl,
  flow: flowBaseUrl,
  auth,
};

function MyApp(props: MyAppProps) {
  const { Component, pageProps, store } = props;
  let text = '';
  if (
    props?.pageProps?.branding?.name === 'demo-brokerage' ||
    props?.pageProps?.branding?.name === 'kbr-brokerage'
  ) {
    text = 'دانلود قرار داد خبرگان';
  } else {
    text = 'ثبت نام در محصولات کیان';
  }
  return (
    <>
      <Head>
        <title>{text}</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </Head>
      <ConfigProvider locale={Persian}>
        <Provider store={store}>
          <TenantConfigProvider config={initialState}>
            <Component {...pageProps} />
          </TenantConfigProvider>
        </Provider>
      </ConfigProvider>
    </>
  );
}

MyApp.getInitialProps = async (initProps: AppContext) => {
  const mappedInitProps = initProps as MyAppContext;
  const { Component, ctx } = mappedInitProps;
  const mappedContext: CustomNextPageContext = ctx as CustomNextPageContext;
  let pageProps = {
    query: mappedContext.query,
  };
  if (Component.getInitialProps) {
    pageProps = Object.assign(
      pageProps,
      await Component.getInitialProps(mappedContext),
    );
  }
  return { pageProps };
};

export default withRedux(configureStore)(MyApp);

interface MyAppProps extends AppInitialProps {
  store: Store;
  Component: NextComponentType<NextPageContext, any, any>;
}

interface MyAppContext extends AppContext {
  store: Store;
}

export interface CustomNextPageContext extends NextPageContext {
  store: Store<RootState>;
}

import React from 'react';
import Document, { Head, Html, Main, NextScript } from 'next/document';
import '@tensorflow/tfjs-backend-webgl';
import getConfig from 'next/config';

const {
  publicRuntimeConfig: { environment },
} = getConfig();

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);

    // Make sure this operation is on the server and has a request
    if (ctx.req) {
      // Make sure we're only doing this for the correct route
      const isInviteScreen = `${ctx.req.url}`;
    }

    // Default return just in case
    return {
      ...initialProps,
    };
  }

  render() {
    const isProd = environment === 'PROD';

    return (
      <Html>
        <Head>
          {(this.props.__NEXT_DATA__.query.product === 'dorsa' ||
            this.props.__NEXT_DATA__.query.product === 'kt-brokerage') && (
            <script
              dangerouslySetInnerHTML={{
                __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','GTM-MQFDCXV');`,
              }}
            />
          )}
          <meta name="description" content="ثبت نام در محصولات کیان" />
          <link rel="stylesheet" href="/static/fontiran.css" />
          <link rel="stylesheet" href="/static/css/main.css" />
          <meta name="apple-mobile-web-app-title" content="Onboarding" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="default"
          />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="mobile-web-app-capable" content="yes" />
        </Head>
        <body className="rtlLayout">
          {(this.props.__NEXT_DATA__.query.product === 'dorsa' ||
            this.props.__NEXT_DATA__.query.product === 'kt-brokerage') && (
            <script
              dangerouslySetInnerHTML={{
                __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MQFDCXV" height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
              }}
            />
          )}
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;

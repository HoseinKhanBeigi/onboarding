import React from 'react';
import {Col, Row} from 'antd';
import style from './Final.scss';

export default function Final() {
  // TODO: please make this page configurable
  return (
    <>
      <Col
        className={style.finalContainer}
        xs={22}
        sm={20}
        md={16}
        lg={11}
        xl={8}
      >
        <img src="/static/images/check2.svg" alt="check2" />
        <div className={style.thanksText}>
          <span>با تشکر </span>ثبت‌نام شما با موفقیت به پایان رسید.
        </div>
        <img
          className={style.kianLogo}
          src="/static/images/kiandigital.png"
          alt="kiandigital"
        />
        <div className={style.installApp}>
          لطفا اپلیکیشن کیان دیجیتال را از طریق یکی از لینک‌های زیر نصب کنید و
          از این پس آخرین وضعیت ثبت نام خود را در سامانه مقصد، از طریق این
          نرم‌افزار پیگیری کنید.
        </div>
        {false && <Row gutter={24}>
          <Col className={style.appContainer} span={12}>
            <img src="/static/images/android.svg" alt="android" />
            <div className={style.bazar}>
              <img src="/static/images/bazar.png" alt="bazar" />
              دریافت از کافه بازار
            </div>
            <div className={style.googlePlay}>
              <img src="/static/images/google.png" alt="google" />
              دریافت از گوگل پلی
            </div>
          </Col>
          <Col className={style.container} span={12}>
            <img src="/static/images/apple-logo-black.svg" alt="apple" />
            <div className={style.sibApp}>
              <img src="/static/images/sibapp.png" alt="sibapp" />
              دریافت از سیب اپ
            </div>
          </Col>
        </Row>}
      </Col>
    </>
  );
}

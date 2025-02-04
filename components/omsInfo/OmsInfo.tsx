import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Radio } from 'antd';
import { DownOutlined, LeftOutlined } from '@ant-design/icons';
import { BuiltInStageProps } from '../../interfaces/builtInStages.interface';
import { configurableRequest } from '../../lib/configurableRequest';
import { RequestInstance } from '../../store/request';
import { showErrorNotification } from '../../store/globalAction';
import style from './OmsInfo.scss';

export default function OMSINFO({ stage, actions: { submitForm } }: any) {
  const [fetched, setFetched] = useState(false);
  const [fetchedData, setFetchedData] = useState<Record<string, any>>();
  const [showModal, setShowModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [radioValue, setRadioValue] = useState('EMAX');
  const router = useRouter();
  const { applicationId, product } = router.query;
  const [loading, setLoading] = useState(false);

  function closeModal() {
    setShowRejectModal(false);
  }

  async function submitInfo() {
    try {
      const data = {
        mappedData: {
          dataOMS: radioValue,
        },
      };
      setLoading(true);
      await submitForm(data);
    } finally {
      setLoading(false);
    }
  }
  const options = [
    {
      label: 'سامانه معاملاتی کیان تریدر',
      value: 'EMAX',
      def:true,

      decss: [
        {
          title: 'ارسال سفارشات شرطی',
          desc: 'ارسال انواع سفارشات پیش‌نویس یا شرطی',
        },
        {
          title: 'معاملات مشتقه سهام و صندوق',
          desc: 'انجام معاملات اختیار معامله و اخذ استراتژی',
        },
        {
          title: 'دریافت اعتبار برخط',
          desc: 'امکان ثبت درخواست دریافت اعتبار به صورت برخط',
        },
        {
          title: 'ابزار تحلیل تکنیکال',
          desc: 'بررسی‌ آخرین رصدهای بازار سرمایه برای انجام تحلیل تکنیکال',
        },
        {
          title: 'برتری عرضه و تقاضا در سفارشات',
          desc:
            'نمایش حجم عرضه و تقاضا و اختلاف قیمت سرخط خرید و فروش در نمادها',
        },
        {
          title: 'نوبت سفارشات',
          desc: 'نمایش عمق بازار و محل سفارش در خرید و فروش',
        },
        {
          title: 'ارسال سریع سفارش‌ها',
          desc:
            'ارسال سریع و سرخطی سفارش‌های خرید و فروش به دلیل فناوری جدید پردازش داده‌ها',
        },
        {
          title: 'نمودار قیمت خرید و فروش نمادهای پورتفوی',
          desc: 'نمایش نمودار در تمامی دوره‌های زمانی به همراه میانگین قیمت',
        },
      ],
    },
    {
      label: 'سامانه معاملاتی اکسیر',
      value: 'RAYAN',
      def:false,
      decss: [
        {
          title: 'ارسال همزمان',
          desc: 'ارسال سریع چندین سفارش به صورت همزمان',
        },

        {
          title: ' پشتیبانی از PWA',
          desc: 'حذف محدودیت برای هر نوع گوشی و سیستم عامل',
        },
        {
          title: 'ارسال خودکار سفارش',
          desc: 'ارسال خودکار سفارش و تعریف هشدار با شرایط مورد نظر کاربر',
        },
        {
          title: 'حجم سفارشات',
          desc: 'قابلیت ارسال سفارشات با حجم بیشتر از آستانه تعداد',
        },
        {
          title: ' محیط کاربری',
          desc: 'رابط کاربری با قابلیت شخصی سازی',
        },
        {
          title: 'معاملات ابزارهای مالی',
          desc: 'قابلیت انجام معاملات ابزارهای مالی موجود در بازار سرمایه',
        },

        {
          title: 'جانمایی سفارش ',
          desc: 'جانمایی سفارش ارسالی در صف عرضه و تقاضا',
        },
        {
          title: 'پشتیبانی از زبان های مختلف',
          desc: 'فارسی / انگلیسی و قابلیت ارائه به زبانهای دیگر',
        },
      ],
    },
  ];

  const onChange = value => {
    setRadioValue(value.target.value);
  };

  const [activeIndex, setActiveIndex] = useState(null);

  const handleToggle = index => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className={style.Container}>
      <div style={{ marginBottom: '24px' }}>انتخاب سامانه معاملاتی</div>
      <img
        style={{ marginBottom: '32px' }}
        src="/static/images/omsImg.png"
        alt="kiandigital"
      />
      <Radio.Group onChange={onChange} defaultValue='EMAX'>
        <div className={style.optionContainer}>
          {options.map((e, i) => (
            <div style={{ background: 'none' }}>
              <div
                style={{
                  border: '1px solid #D9D9D9',
                  borderBottom: 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  height: '50px',
                }}
              >
                <Radio value={e.value} >{e.label}</Radio>
              </div>

              <div
                className={`${style.descContainer} ${
                  activeIndex === i ? `${style.show}` : ''
                }`}
              >
                {e.decss.map(el => (
                  <ol style={{ margin: '12px 0' }}>
                    <li style={{ color: '#595959', listStyleType: 'disc' }}>
                      {el.title}
                    </li>
                    <div style={{ color: '#A3AAB3' }}>{el.desc}</div>
                  </ol>
                ))}
              </div>
              <div
                style={{
                  border: '1px solid rgb(217, 217, 217)',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'end',
                  alignItems: 'center',
                  height: '42px',
                  backgroundColor: '#D9D9D9',
                }}
                onClick={() => handleToggle(i)}
              >
                {activeIndex === i ? (
                  ''
                ) : (
                  <div style={{ color: '#2469AC' }}>5 مورد دیگر</div>

                )}
                {activeIndex === i ? (
                  <div style={{ marginLeft: '20px', marginRight: '20px' }}>
                    <svg
                      width="16"
                      height="10"
                      viewBox="0 0 10 6"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9 4.81226L5 0.812256L1 4.81226"
                        stroke="#2469AC"
                      />
                    </svg>
                  </div>
                ) : (
                  <div style={{ marginLeft: '20px', marginRight: '20px' }}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="10"
                      viewBox="0 0 9 6"
                      fill="none"
                    >
                      <path
                        d="M0.502197 0.812256L4.5022 4.81226L8.5022 0.812256"
                        stroke="#2469AC"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Radio.Group>
      <Button
        style={{ marginTop: '34px' }}
        type="primary"
        className={style.submitExamBtn}
        loading={loading}
        disabled={!radioValue}
        onClick={() => submitInfo()}
      >
        ثبت و ادامه <LeftOutlined />
      </Button>
    </div>
  );
}

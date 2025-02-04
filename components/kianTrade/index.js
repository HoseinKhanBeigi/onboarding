import formDocOne from './formDocOne.json';
import formDocTwo from './formDocTwo.json';
import formDocFour from './formDocFour.json';
import formDocThree from './formDocThree.json';
import formDocFive from './formDocFive.json';
import formDocSix from './formDocSix.json';
import formDocSeven from './formDocSeven.json';

export const contractListKianTrade = [
  {
    label: 'فرم مشخصات اشخاص حقیقی ایرانی',
    data: formDocOne,
    isVisible: false,
    statue: true,
    name: 'formDocOne',
    contractName: 'ktPersonalInfoForm',
    isMeta: true,
  },
  {
    label: 'قرارداد جامع مشتری و کارگزار',
    data: formDocTwo,
    isVisible: false,
    name: 'formDocTwo',
    statue: true,
    contractName: 'ktGeneralContract',
    isMeta: true,
  },
  {
    label: 'توافق نامه خرید و فروش الکترونیکی اوراق بهادار (آفلاین)',
    data: formDocThree,
    isVisible: false,
    name: 'formDocThree',
    statue: true,
    contractName: 'ktOfflineContract',
    isMeta: true,
  },
  {
    label: 'قرارداد استفاده از خدمات برخط (آنلاین)',
    data: formDocFour,
    isVisible: false,
    name: 'formDocFour',
    statue: true,
    isQuestion: true,
    contractName: 'ktOnlineContract',
    isMeta: true,
  },
  {
    label: 'قرارداد خرید اعتباری',
    data: formDocFive,
    isVisible: false,
    name: 'formDocFive',
    statue: true,
    contractName: 'ktCreditContract',
    isMeta: true,
  },
  {
    label: ' قرارداد استفاده از خدمات اختیار معامله',
    data: formDocSix,
    isVisible: false,
    name: 'formDocSix',
    statue: true,
    contractName: 'ktCreditContract',
    isMeta: true,
  },
  {
    label: 'قرارداد راهبردهای معاملاتی در بازار اختیار معامله',
    data: formDocSeven,
    isVisible: false,
    name: 'formDocSeven',
    statue: true,
    contractName: 'ktCreditContract',
    isMeta: true,
  },
];
// معاملاتی

// تغیيرات

import formDocSixteen from './formDocSixteen.json';
import formKhobreganMerged from './formKhobreganMerged.json';
import formKharidEtebari from './formKharidEtebari.json';
import formJameMoshtari from './formeJameMoshtari.json';
import formCallCenter from './formCallCenter.json';
import formOffline from './formOffline.json';

export const contractListKhobregan = [
  {
    label: 'قرارداد های معاملات برخط',
    data: formKhobreganMerged,
    isVisible: false,
    name: 'formKhobreganMerged',
    statue: true,
    isQuestion: true,
    contractName: 'onlineTradingContract',
    isMeta: true,
  },
  {
    label: 'قرارداد خرید اعتباری ',
    data: formKharidEtebari,
    isVisible: false,
    name: 'formKharidEtebari',
    statue: true,
    contractName: 'creditTradingContract',
    isMeta: true,
  },
  {
    label: 'فرم مشخصات اشخاص حقیقی(مشتری/نماینده)',
    data: formDocSixteen,
    name: 'formDocSixteen',
    isVisible: false,
    statue: true,
    contractName: 'personalInfoForm',
    isMeta: true,
  },
  {
    label:
      'قرارداد جامع مشتری ،کارگزار و اقرارنامه و بیانیه پذیرش ریسک معاملات سهام',
    data: formJameMoshtari,
    name: 'formJameMoshtari',
    isVisible: false,
    statue: true,
    contractName: 'detailedContract',
    isMeta: true,
  },
  {
    label: 'قرارداد کال سنتر',
    data: formCallCenter,
    name: 'formCallCenter',
    isVisible: false,
    statue: true,
    contractName: 'callcenterContract',
    isMeta: true,
  },
  {
    label: 'قرارداد آفلاین',
    data: formOffline,
    name: 'formOffline',
    isVisible: false,
    statue: true,
    contractName: 'offlineContract',
    isMeta: true,
  },
];

import React from "react";
import momentJalaali from 'moment-jalaali';
import classes from 'classnames';
import styles from './FetchSejamWithPreview.scss';
import {StringUtils} from "../../lib/StringUtils";

momentJalaali.loadPersian({ dialect: 'persian-modern' });

function checkUndefined(value) {
  return StringUtils.isItFilled(value) ? value : '-'
}

export function PreviewSejamData({ data }) {
  const {privatePerson, uniqueIdentifier, mobile, accounts, addresses} = data;

  const banks = accounts.map(item => {
    return  {
      isDefault:item.isDefault,
      note:(
        'حساب ' + checkUndefined(item.typeTitle) +
        ' ' + checkUndefined(item.bank.name) +
        ' شعبه ' + checkUndefined(item.branchName) +
        ' به شماره حساب ' + checkUndefined(item.accountNumber) +
        ' و شماره شبا ' + checkUndefined(item.sheba))
    }
  })
    .map(item => {
      return (
        <li key={item}>
          {item.isDefault === true && (
            <span style={{ fontWeight: 'bold' }}>{'حساب پیش فرض :'}</span>
          )}
          <span>{item.note}</span>
        </li>
      );
    });

  const address = checkUndefined((addresses[0])?.country?.name) + ' - ' +
    checkUndefined((addresses[0])?.province?.name) + ' - ' +
    checkUndefined((addresses[0])?.city?.name) + ' - ' +
    checkUndefined((addresses[0])?.alley) + '  ' +
    'پلاک ' + checkUndefined((addresses[0])?.plaque) + ' - ' +
    'کد پستی ' + checkUndefined((addresses[0])?.postalCode) + ' - ';

  const tel = (addresses[0])?.cityPrefix + '-' + (addresses[0])?.tel;

  const birthDate = momentJalaali(privatePerson?.birthDate).format('jYYYY/jM/jD');

  const gender = privatePerson?.gender.toLowerCase() === 'male' ? 'مرد' : 'زن';

  return (
    <div className={styles.previewBox}>
      <div className={styles.group}>
        <h3>اطلاعات اولیه</h3>
        <div className={styles.groupItems}>
          <div className={styles.groupItem}>
            <span className={styles.label}>نام و نام‌خانوادگی:</span>
            <span className={styles.value}>{privatePerson?.firstName} {privatePerson?.lastName}</span>
          </div>
          <div className={styles.groupItem}>
            <span className={styles.label}>کد ملی:</span>
            <span className={styles.value}>{uniqueIdentifier}</span>
          </div>
          <div className={styles.groupItem}>
            <span className={styles.label}>شماره موبایل:</span>
            <span className={styles.value}>{mobile}</span>
          </div>
          <div className={styles.groupItem}>
            <span className={styles.label}>نام پدر:</span>
            <span className={styles.value}>{privatePerson?.fatherName}</span>
          </div>
          <div className={styles.groupItem}>
            <span className={styles.label}>سری حرفی شناسنامه:</span>
            <span className={styles.value}>{privatePerson?.seriShChar}</span>
          </div>
          <div className={styles.groupItem}>
            <span className={styles.label}>سری عددی شناسنامه:</span>
            <span className={styles.value}>{privatePerson?.seriSh}</span>
          </div>
          <div className={styles.groupItem}>
            <span className={styles.label}> سریال شناسنامه:</span>
            <span className={styles.value}>{privatePerson?.serial}</span>
          </div>
          <div className={styles.groupItem}>
            <span className={styles.label}> محل صدور شناسنامه:</span>
            <span className={styles.value}>{privatePerson?.placeOfIssue}</span>
          </div>
          <div className={styles.groupItem}>
            <span className={styles.label}> محل تولد :</span>
            <span className={styles.value}>{privatePerson?.placeOfBirth}</span>
          </div>
          <div className={styles.groupItem}>
            <span className={styles.label}>جنسیت:</span>
            <span className={styles.value}>{gender}</span>
          </div>
          <div className={styles.groupItem}>
            <span className={styles.label}>تاریخ تولد:</span>
            <span className={styles.value}>{birthDate}</span>
          </div>
          <div className={classes(styles.groupItem, styles.fullWidth)}>
            <span className={styles.label}>نشانی:</span>
            <span className={styles.value}>{address}</span>
          </div>
          <div className={styles.groupItem}>
            <span className={styles.label}>تلفن ثابت:</span>
            <span className={styles.value}>{tel}</span>
          </div>
        </div>
      </div>
      <div className={styles.group}>
        <h3>حساب‌های بانکی</h3>
        <ul>
          {banks}
        </ul>
      </div>
    </div>
  );
}
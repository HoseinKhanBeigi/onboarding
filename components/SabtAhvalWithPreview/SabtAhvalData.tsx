import React from "react";
import momentJalaali from 'moment-jalaali';
import styles from './FetchSejamWithPreview.scss';

momentJalaali.loadPersian({ dialect: 'persian-modern' });

export function SabtAhvalData({ data }) {

   const info = data.stages[0].data;


  const birthDate = momentJalaali(info?.birthDate).format('jYYYY/jM/jD');

  return (
    <div className={styles.previewBox}>
      <div className={styles.group}>
        <h3>اطلاعات اولیه</h3>
        <div className={styles.groupItems}>
          <div className={styles.groupItem}>
            <span className={styles.label}>نام:</span>
            <span className={styles.value}>{info?.firstName}</span>
          </div>
          <div className={styles.groupItem}>
            <span className={styles.label}>نام‌خانوادگی:</span>
            <span className={styles.value}>{info?.lastName}</span>
          </div>
          <div className={styles.groupItem}>
            <span className={styles.label}>کد ملی:</span>
            <span className={styles.value}>{info?.nationalCode}</span>
          </div>
          <div className={styles.groupItem}>
            <span className={styles.label}>نام پدر:</span>
            <span className={styles.value}>{info?.fatherName}</span>
          </div>
          <div className={styles.groupItem}>
            <span className={styles.label}>تاریخ تولد:</span>
            <span className={styles.value}>{birthDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
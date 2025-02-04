import React, { FunctionComponent } from 'react';
import { Spin } from 'antd';
import styles from './WebcamLoading.module.scss';

const WebcamLoading: FunctionComponent = () => (
  <div className={styles.loading}>
    <Spin spinning size="large" />
    <p>در حال بارگذاری دوربین</p>
  </div>
);

export default WebcamLoading;

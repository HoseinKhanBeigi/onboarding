import React from 'react';
import { Layout } from 'antd';

import style from './index.scss';

export default function OnBoardingLayout({ children }: { children: any }) {
  return (
    <Layout className={style.layout}>
      <Layout.Content>{children}</Layout.Content>
    </Layout>
  );
}

import React from 'react';
import style from './StaticPageContainer.scss';

interface StaticPageContainerProps {
  children: any;
}

function StaticPageContainer({ children }: StaticPageContainerProps) {
  return (
    <div className={style.container}>
      <div className={style.content}>
        <div className={style.groupsContainer}>{children}</div>
      </div>
    </div>
  );
}

export default StaticPageContainer;

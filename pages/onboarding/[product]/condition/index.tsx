import React, { useEffect } from 'react';
import ConditionComponent from '../../../../components/condition';
import BrandingGuard from '../../../../components/BrandingGuard/BrandingGuard';

export default function Condition(props) {
  useEffect(() => {
    console.log(props);
  }, []);
  return (
    <>
      <ConditionComponent />;
    </>
  );
}

Condition.getInitialProps = async function({ store, query: { product }, req }) {
  const { common } = store.getState();
  const props: any = { common, product };
  return props;
};

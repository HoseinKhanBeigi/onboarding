import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import { RootState } from '../../store/rootReducer';

function AuthInterceptor({ children, unAuthorizedUser, purchaseId }: any) {
  const router = useRouter();
  useEffect(() => {
    if (unAuthorizedUser) {
      router.push('/auth/[purchaseId]', `/auth/${purchaseId}`);
    }
  }, [purchaseId, router, unAuthorizedUser]);
  return <>{children}</>;
}

const mapState = (state: RootState) => ({
  unAuthorizedUser: state.auth.data?.unAuthorizedUser,
  purchaseId: state.auth.data?.purchaseId,
});

export default connect(mapState, {})(AuthInterceptor);

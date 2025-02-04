import {useEffect, useMemo, useState} from 'react';
import {useRouter} from 'next/router';
import {useDispatch} from 'react-redux';
import {StringUtils} from '../../lib/StringUtils';
import {wrappedLocalStorage} from '../../lib/hybridStorage';
import {REFERRAL} from '../../store/constants';
import {
  customGetApplicationById,
  customSetReferralCode,
  getApplicationById,
  setReferralCode,
} from '../../store/application/action';

const STATUS_MAP = {
  NOT_TRIED: 'NOT_TRIED',
  TRIED: 'TRIED',
};

function useReferral(
  product,
  actions?: Record<string, any>,
  applicationId?: string,
  orgCode?: string,
  referrerCode?: string,
) {
  const router = useRouter();
  const dispatch = useDispatch();

  const [status, setStatus] = useState(STATUS_MAP.NOT_TRIED);

  const refCode = useMemo(() => {
    const key = `${product}-${REFERRAL}`;
    if (StringUtils.isItFilled(router.query.ref)) {
      const ref = router.query.ref as string;
      wrappedLocalStorage.setItem(key, ref);
      return ref;
    } else if (StringUtils.isItFilled(wrappedLocalStorage.getItem(key))) {
      return wrappedLocalStorage.getItem(key) as string;
    }
    return false;
  }, [router.query, product]);

  useEffect(()=>{
    console.log(refCode,"refCode")
  },[refCode])

  useEffect(() => {
    if (
      refCode &&
      refCode !== referrerCode &&
      status === STATUS_MAP.NOT_TRIED &&
      StringUtils.isItFilled(applicationId, orgCode)
    ) {
      setStatus(STATUS_MAP.TRIED);
      if (actions?.submitApplicationReferral) {
       
        dispatch(
          customSetReferralCode(
            actions?.submitApplicationReferral,
            {
              applicationId,
              refCode,
              orgCode,
            },
            router,
          ),
        );
      } else {
        
        dispatch(
          setReferralCode(
            applicationId as string,
            refCode as string,
            orgCode,
          ),
        );
      }
      if (actions?.getApplication) {
        dispatch(
          customGetApplicationById(
            actions?.getApplication,
            {
              orgCode,
              applicationId,
            },
            router,
          ),
        );
      } else {
        dispatch(getApplicationById(applicationId as string, orgCode));
      }
    }
  }, [router.query, referrerCode, status, refCode]);
}

export { useReferral };

import {useSelector} from 'react-redux';
import {useEffect} from 'react';
import {RootState} from '../../store/rootReducer';
import ErrorUtils from "../../lib/errorUtils";

function useUpdateErrorMap() {
  const data = useSelector(
    ({ common }: RootState) => common.data,
  );
  useEffect(() => {
    if (data && data.errors) {
      ErrorUtils.setErrors(data.errors);
    }
  }, [data]);
}

export default useUpdateErrorMap;

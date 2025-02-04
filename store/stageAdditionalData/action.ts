import { NextRouter } from 'next/router';
import { Dispatch } from 'redux';
import { Dispatcher } from '../../interfaces/dispatcher';
import { DataSourceInterface } from '../../interfaces/entity.interface';
import { configurableRequest } from '../../lib/configurableRequest';
import {
  FAILED_RESOLVE_STAGE_DATA,
  REQUEST_RESOLVE_STAGE_DATA,
  STAGE_DATA_RESOLVED,
} from '../constants';
import { RequestInstance } from '../request';

export function resolveDataByActionConfig(
  key: string,
  stageName: string,
  dataSource: DataSourceInterface,
  router: NextRouter,
): Dispatcher<unknown> {
  return async (dispatch: Dispatch) => {
    dispatch({ type: REQUEST_RESOLVE_STAGE_DATA });
    try {
      const data = await configurableRequest(
        RequestInstance,
        dataSource,
        router,
        {},
      );
      if (data) {
        dispatch({
          type: STAGE_DATA_RESOLVED,
          payload: { key, stageName, data },
        });
        return data;
      } else {
        throw new Error();
      }
    } catch {
      dispatch({ type: FAILED_RESOLVE_STAGE_DATA });
    }
    return null;
  };
}

export default resolveDataByActionConfig;

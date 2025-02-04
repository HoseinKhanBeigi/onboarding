import {Dispatch} from 'redux';
import {NextRouter} from 'next/router';
import {Dispatcher} from '../../interfaces/dispatcher';
import {FAILED_SAVE_STAGE, REQUEST_SAVE_STAGE, STAGE_SAVED, UPDATE_APPLICATION_BY_ID_SUCCESS,} from '../constants';
import {RequestInstance} from '../request';
import {saveStageDataPath} from './service';
import {StageSubmitDataSource, SubmitDataSourceItem,} from '../../interfaces/stage.interface';
import {configurableRequest} from '../../lib/configurableRequest';
import {CurrentApplicationInterface} from '../../interfaces/application.interface';
import {ErrorUtils} from '../../lib/errorUtils';
import {hideErrorNotification, showErrorNotification} from '../globalAction';

export function saveStageData(
  applicationId,
  stageName,
  { data, mappedData },
  orgCode,
): Dispatcher<unknown> {
  return async dispatch => {
    try {
      dispatch({ type: REQUEST_SAVE_STAGE });
      hideError();
      const response = await RequestInstance.put<CurrentApplicationInterface>(
        saveStageDataPath(applicationId, stageName),
        mappedData,
        {
          headers: {
            'Application-Name': orgCode,
          },
        },
      );

      dispatch({ type: STAGE_SAVED, payload: { stageName, data } });
      dispatch({
        type: UPDATE_APPLICATION_BY_ID_SUCCESS,
        payload: { data: response.data },
      });
      return response.data;
    } catch (error) {
      handleApplicationFailure(dispatch, error);
      throw error;
    }
  };
}

async function submitStageByApplicationCurrentStageOrder(
  submit: Array<SubmitDataSourceItem>,
  data: any,
  targetIndex: number,
  router: NextRouter,
): Promise<CurrentApplicationInterface> {
  const response: CurrentApplicationInterface = await configurableRequest<
    CurrentApplicationInterface
  >(RequestInstance, submit[targetIndex].action, router, data);
  const nextTargetIndex = submit.findIndex(
    item => response?.applicationInfo?.currentStage === item.name,
  );
  if (nextTargetIndex > -1) {
    return submitStageByApplicationCurrentStageOrder(
      submit,
      data,
      nextTargetIndex,
      router,
    );
  } else {
    return response;
  }
}

async function submitStageByOrder(
  submit: Array<SubmitDataSourceItem>,
  data: any,
  router: NextRouter,
): Promise<CurrentApplicationInterface> {
  let lastResponse;
  for (const item of submit) {
    lastResponse = await configurableRequest<CurrentApplicationInterface>(
      RequestInstance,
      item.action,
      router,
      data,
    );
  }
  return lastResponse;
}

export function saveStageDataByConfiguredSubmit(
  applicationId,
  stageName,
  submit: StageSubmitDataSource,
  applicationCurrentStage: string,
  { data, mappedData },
  router: NextRouter,
  meta: Record<string, any>
): Dispatcher<unknown> {
  return async dispatch => {
    try {
      dispatch({ type: REQUEST_SAVE_STAGE });
      hideError();
      let response;
      const body = (() => {
        if (mappedData && typeof mappedData === 'object' && !(mappedData instanceof Array) && !(mappedData instanceof FormData)) {
          return {...meta, ...mappedData};
        } else if (mappedData && typeof mappedData === 'object' && (mappedData instanceof Array || mappedData instanceof FormData)) {
          return mappedData;
        } else {
          return meta;
        }
      })();
      if (submit instanceof Array) {
        response = await submitStageByOrder(submit, body, router);
      } else {
        response = await configurableRequest(
          RequestInstance,
          submit,
          router,
          body,
        );
      }

      dispatch({ type: STAGE_SAVED, payload: { stageName, data } });
      dispatch({
        type: UPDATE_APPLICATION_BY_ID_SUCCESS,
        payload: { data: response },
      });
      return response;
    } catch (error) {
      handleApplicationFailure(dispatch, error);
      throw error;
    }
  };
}

function hideError() {
  hideErrorNotification();
}

function handleApplicationFailure(dispatch, error) {
  const errorCode = error.response?.data?.status;
  const errorMessage = ErrorUtils.getErrorMessage(
    error.response?.data?.exceptionMessage || errorCode,
  );
  showErrorNotification(errorMessage);
  dispatch({
    type: FAILED_SAVE_STAGE,
    payload: { error: error.response?.data },
  });
  return Promise.reject(errorMessage);
}

export function storeStageData(stageName, data): Dispatcher<unknown> {
  return async (dispatch: Dispatch) => {
    dispatch({ type: STAGE_SAVED, payload: { stageName, data } });
    return data;
  };
}

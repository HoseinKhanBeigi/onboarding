import {Dispatch} from 'redux';
import {NextRouter} from 'next/router';
import {RequestInstance} from '../request';
import {Dispatcher} from '../../interfaces/dispatcher';
import {
  APPLICATION_FAILURE,
  APPLICATION_REQUEST,
  GET_APPLICATION_BY_ID_SUCCESS,
  GET_APPLICATIONS_SUCCESS,
  REMOVE_APPLICATION_SUCCESS,
  START_APPLICATION_SUCCESS,
} from '../constants';
import {
  getActiveApplicationsPath,
  getApplicationByIdPath,
  setReferralCodePath,
  startApplicationPath,
  submitApplicationByIdPath,
} from './service';
import {ActiveApplicationsDto} from '../../interfaces/activeApplications.dto';
import {ErrorUtils} from '../../lib/errorUtils';
import {DataSourceInterface} from '../../interfaces/entity.interface';
import {configurableRequest} from '../../lib/configurableRequest';
import {ApplicationInfoInterface, CurrentApplicationInterface,} from '../../interfaces/application.interface';
import {ObjectUtils} from '../../lib/ObjectUtils';

function getApplicationDispatch(data) {
  return {
    type: GET_APPLICATIONS_SUCCESS,
    payload: {
      data: {
        list: data?.applications?.map(item => ({
          ...item,
          applicationId: item.applicationID,
        })),
        needActivation: data?.needsUserRegistration || false,
      },
    },
  };
}

export function getApplications(orgCode): Dispatcher {
  return async dispatch => {
    try {
      dispatch({ type: APPLICATION_REQUEST });

      const response = await RequestInstance.get<ActiveApplicationsDto>(
        getActiveApplicationsPath(),
        {
          headers: {
            'Application-Name': orgCode,
          },
        },
      );

      dispatch(getApplicationDispatch(response.data));
      return Promise.resolve();
    } catch (error) {
      return handleApplicationFailure(dispatch, error);
    }
  };
}

export function customGetApplications(
  dataSource: DataSourceInterface,
  data: Record<string, any>,
  router: NextRouter,
): Dispatcher {
  return async dispatch => {
    try {
      dispatch({ type: APPLICATION_REQUEST });

      const response = (await configurableRequest(
        RequestInstance,
        dataSource,
        router,
        data,
      )) as ActiveApplicationsDto;

      dispatch(getApplicationDispatch(response));
      return Promise.resolve();
    } catch (error) {
      return handleApplicationFailure(dispatch, error);
    }
  };
}

export function customStartApplication(
  dataSource: DataSourceInterface,
  data: Record<string, any>,
  router: NextRouter,
  checkCode?: (data) => boolean,
) {
  return async dispatch => {
    if (
      !ObjectUtils.checkIfItsFilled(checkCode) ||
      typeof checkCode !== 'function'
    ) {
      checkCode = () => true;
    }
    try {
      dispatch({ type: APPLICATION_REQUEST });

      const response = (await configurableRequest(
        RequestInstance,
        dataSource,
        router,
        data,
      )) as CurrentApplicationInterface;

      if (checkCode(response?.applicationInfo?.productType.toLowerCase())) {
        dispatch({
          type: START_APPLICATION_SUCCESS,
          payload: { data: response },
        });
      }

      return Promise.resolve();
    } catch (error) {
      checkCode(error?.response?.data?.exceptionMessage?.toLowerCase());
      return handleApplicationFailure(dispatch, error);
    }
  };
}

export function startApplication(
  uniqueIdentifier: string,
  product: string,
  relation,
  orgCode,
  metaData,
  checkCode?: (data) => boolean,
) {
  return async dispatch => {
    if (
      !ObjectUtils.checkIfItsFilled(checkCode) ||
      typeof checkCode !== 'function'
    ) {
      checkCode = () => true;
    }
    try {
      dispatch({ type: APPLICATION_REQUEST });

      const response = await RequestInstance.post<CurrentApplicationInterface>(
        startApplicationPath(),
        {
          productGroupCode: product.toUpperCase(),
          startOnboardingFor: relation,
          extraDataSet: metaData,
          uniqueIdentifier,
        },
        {
          headers: {
            'Application-Name': orgCode,
          },
        },
      );

      if (
        checkCode(response.data?.applicationInfo?.productType.toLowerCase())
      ) {
        dispatch({
          type: START_APPLICATION_SUCCESS,
          payload: { data: response.data },
        });
      }

      return Promise.resolve();
    } catch (error) {
      checkCode(error?.response?.data?.exceptionMessage.toLowerCase());
      return handleApplicationFailure(dispatch, error);
    }
  };
}

export function removeTheApplication() {
  return dispatch => {
    dispatch({
      type: REMOVE_APPLICATION_SUCCESS,
    });
  };
}

export function getApplicationById(id: string, orgCode): Dispatcher {
  return async dispatch => {
    try {
      await dispatch({ type: APPLICATION_REQUEST });

      const response = await RequestInstance.get(getApplicationByIdPath(id), {
        headers: {
          'Application-Name': orgCode,
        },
      });

      dispatch({
        type: GET_APPLICATION_BY_ID_SUCCESS,
        payload: { data: response.data },
      });
      return Promise.resolve();
    } catch (error) {
      return handleApplicationFailure(dispatch, error);
    }
  };
}

export function customGetApplicationById(
  dataSource: DataSourceInterface,
  data: Record<string, any>,
  router: NextRouter,
): Dispatcher {
  return async dispatch => {
    try {
      await dispatch({ type: APPLICATION_REQUEST });

      const response = await configurableRequest(
        RequestInstance,
        dataSource,
        router,
        data,
      );

      dispatch({
        type: GET_APPLICATION_BY_ID_SUCCESS,
        payload: { data: response },
      });
      return Promise.resolve();
    } catch (error) {
      return handleApplicationFailure(dispatch, error);
    }
  };
}

export function submitApplication(applicationId: string): Dispatcher<unknown> {
  return async (dispatch: Dispatch) => {
    try {
      dispatch({ type: APPLICATION_REQUEST });

      const response = await RequestInstance.put(
        submitApplicationByIdPath(applicationId),
      );

      dispatch({
        type: GET_APPLICATION_BY_ID_SUCCESS,
        payload: { data: response.data },
      });
      return response.data;
    } catch (error) {
      return handleApplicationFailure(dispatch, error);
    }
  };
}

export function submitApplicationByConfiguredSubmit(
  applicationId: string,
  submit: DataSourceInterface,
  router: NextRouter,
  applicationInfo: ApplicationInfoInterface,
): Dispatcher<unknown> {
  return async (dispatch: Dispatch) => {
    try {
      dispatch({ type: APPLICATION_REQUEST });

      const response = await configurableRequest(
        RequestInstance,
        submit,
        router,
        applicationInfo,
      );

      dispatch({
        type: GET_APPLICATION_BY_ID_SUCCESS,
        payload: { data: response },
      });
      return response;
    } catch (error) {
      return handleApplicationFailure(dispatch, error);
    }
  };
}

export function setReferralCode(
  applicationId: string,
  referralCode: string,
  orgCode,
): Dispatcher {
  return async dispatch => {
    try {
      await dispatch({ type: APPLICATION_REQUEST });

      await RequestInstance.put(
        setReferralCodePath(applicationId),
        { code: referralCode },
        {
          headers: {
            'Application-Name': orgCode,
          },
        },
      );
      return Promise.resolve();
    } catch (error) {
      return handleApplicationFailure(dispatch, error);
    }
  };
}

export function customSetReferralCode(
  dataSource: DataSourceInterface,
  data: Record<string, any>,
  router: NextRouter,
): Dispatcher {
  return async dispatch => {
    try {
      await dispatch({ type: APPLICATION_REQUEST });

      await configurableRequest(RequestInstance, dataSource, router, data);

      return Promise.resolve();
    } catch (error) {
      return handleApplicationFailure(dispatch, error);
    }
  };
}

function handleApplicationFailure(dispatch, error) {
  const errorCode = error.response?.data?.status || error.response?.status;
  const errorMessage = ErrorUtils.getErrorMessage(
    error.response?.data?.exceptionMessage || errorCode,
  );
  dispatch({
    type: APPLICATION_FAILURE,
    payload: { errorMessage, errorCode },
  });
  return Promise.reject(errorMessage);
}

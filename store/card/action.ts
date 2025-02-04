import { FlowRequestInstance } from '../request';
import { Dispatcher } from '../../interfaces/dispatcher';
import {
  createCardPath,
  executeCardActionPath,
  getCardDataPath,
} from './service';
import {
  CARD_CREATED,
  CARD_FAILURE,
  CARD_FETCHED,
  CARD_REQUEST,
} from '../constants';
import {
  CardDto,
  EndUserWorkflowDto,
  FormDataDto,
} from '../../interfaces/card.interface';

export function getCardDataByCardId(
  id: string,
): Dispatcher<EndUserWorkflowDto | undefined> {
  return async dispatch => {
    try {
      await dispatch({ type: CARD_REQUEST });

      const response = await FlowRequestInstance.get<EndUserWorkflowDto>(
        getCardDataPath(id),
        {
          headers: {
            Authorization: 'asd',
          },
        },
      );

      dispatch({
        type: CARD_FETCHED,
        payload: response.data,
      });

      return response.data;
    } catch (error) {
      dispatch({
        type: CARD_FAILURE,
      });

      return undefined;
    }
  };
}

export function createCard(
  data: CardDto,
): Dispatcher<EndUserWorkflowDto | undefined> {
  return async dispatch => {
    try {
      await dispatch({ type: CARD_REQUEST });

      const response = await FlowRequestInstance.post<EndUserWorkflowDto>(
        createCardPath(),
        data,
      );

      dispatch({
        type: CARD_CREATED,
        payload: response.data,
      });

      return response.data;
    } catch (error) {
      dispatch({
        type: CARD_FAILURE,
      });

      return undefined;
    }
  };
}

export function executeCardAction(
  data: FormDataDto,
): Dispatcher<EndUserWorkflowDto | undefined> {
  return async dispatch => {
    try {
      await dispatch({ type: CARD_REQUEST });

      const response = await FlowRequestInstance.put<EndUserWorkflowDto>(
        executeCardActionPath(),
        data,
      );

      dispatch({
        type: CARD_FETCHED,
        payload: response.data,
      });

      return response.data;
    } catch (error) {
      dispatch({
        type: CARD_FAILURE,
      });

      return undefined;
    }
  };
}

export default getCardDataByCardId;

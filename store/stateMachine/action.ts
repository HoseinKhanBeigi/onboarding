import { StateMachineInterface } from '../../interfaces/stateMachine.interface';
import { Dispatcher } from '../../interfaces/dispatcher';
import { ConfigRequestInstance } from '../request';
import { getStateMachinePath } from './service';
import {
  GET_STATE_MACHINE_FAILURE,
  GET_STATE_MACHINE_REQUEST,
  GET_STATE_MACHINE_SUCCESS,
} from '../constants';

export function getStateMachine(
  orgCode: string,
  product: string,
  type: string,
  relation: string,
  name?: string,
): Dispatcher<StateMachineInterface | undefined> {
  return async dispatch => {
    try {
      await dispatch({ type: GET_STATE_MACHINE_REQUEST });

      const response = await ConfigRequestInstance.get<StateMachineInterface>(
        getStateMachinePath(orgCode, product, type, relation, name),
      );

      dispatch({
        type: GET_STATE_MACHINE_SUCCESS,
        payload: { data: response.data },
      });

      return response.data;
    } catch (error) {
      dispatch({
        type: GET_STATE_MACHINE_FAILURE,
      });
      return undefined;
    }
  };
}

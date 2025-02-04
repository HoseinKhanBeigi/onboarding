import { FlowRequestInstance } from '../request';
import { Dispatcher } from '../../interfaces/dispatcher';
import { getStartFormPath } from './service';
import { StartFormInterface } from '../../interfaces/startForm.interface';
import { FORM_FETCHED, FORMS_FAILURE, FORMS_REQUEST } from '../constants';

export function getStartForm(
  id: string,
): Dispatcher<StartFormInterface | undefined> {
  return async dispatch => {
    try {
      await dispatch({ type: FORMS_REQUEST });

      const response = await FlowRequestInstance.get<StartFormInterface>(
        getStartFormPath(id),
        {
          headers: {
            Authorization: 'asd',
          },
        },
      );

      dispatch({
        type: FORM_FETCHED,
        payload: { data: response.data, id },
      });

      return response.data;
    } catch (error) {
      dispatch({
        type: FORMS_FAILURE,
        payload: { id },
      });

      return undefined;
    }
  };
}

export default getStartForm;

import { Dispatch } from 'redux';

export interface Dispatcher<R = void> {
  (dispatch: Dispatch): Promise<R>;
}

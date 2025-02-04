import { applyMiddleware, createStore, compose } from 'redux';
// import { loadingBarMiddleware } from 'react-redux-loading-bar';
import thunk from 'redux-thunk';
import rootReducer from './rootReducer';

declare const window: any;
const configureStore = (initialState = {}) => {
  const isServer = typeof window === 'undefined';
  const isDev = process.env.NODE_ENV === 'development';

  // add redux devtools (only in browser and in dev mode)
  const composeEnhancers =
    (isDev && !isServer && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || // eslint-disable-line no-underscore-dangle
    compose;

  const createStoreWithMiddleware = composeEnhancers(applyMiddleware(thunk))(
    createStore,
  );

  // create store
  return createStoreWithMiddleware(rootReducer, initialState);
};

export default configureStore;

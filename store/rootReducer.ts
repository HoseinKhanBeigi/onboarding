import { combineReducers } from 'redux';
import { loadingBarReducer as loadingBar } from 'react-redux-loading-bar';
import auth from './auth/reducer';
import application from './application/reducer';
import stages from './stages/reducer';
import stageAdditionalData from './stageAdditionalData/reducer';
import branding from './branding/reducer';
import product from './product/reducer';
import common from './common/reducer';
import stateMachine from './stateMachine/reducer';
import forms from './forms/reducer';
import card from './card/reducer';
import { ReducerInitialState } from '../interfaces/reducerInitailState';
import { ApplicationInterface } from '../interfaces/application.interface';
import { ProductInterface } from '../interfaces/product.interface';
import { BrandingInterface } from '../interfaces/branding.interface';
import { FormInterface } from '../interfaces/startForm.interface';
import { EndUserWorkflowDto } from '../interfaces/card.interface';
import { ConfigurationInterface } from '../interfaces/common.interface';
import { StateMachineInterface } from '../interfaces/stateMachine.interface';

export interface RootState {
  loadingBar: any;
  auth: any;
  application: ReducerInitialState<ApplicationInterface>;
  stages: ReducerInitialState<Record<string, any>>;
  stageAdditionalData: ReducerInitialState<Record<string, Record<string, any>>>;
  product: ReducerInitialState<ProductInterface>;
  branding: ReducerInitialState<BrandingInterface>;
  common: ReducerInitialState<ConfigurationInterface>;
  stateMachine: ReducerInitialState<StateMachineInterface>;
  forms: ReducerInitialState<Record<string, FormInterface>>;
  card: ReducerInitialState<EndUserWorkflowDto>;
}

export default combineReducers<RootState>({
  loadingBar,
  auth,
  application,
  stages,
  stageAdditionalData,
  product,
  branding,
  common,
  stateMachine,
  forms,
  card,
});

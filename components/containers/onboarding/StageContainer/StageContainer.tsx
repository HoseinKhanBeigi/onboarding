import React, {useEffect, useMemo} from 'react';
import {useRouter} from 'next/router';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../../store/rootReducer';
import {useReferral} from '../../../Referral/useReferral';
import {useClientRedirectUrl} from '../../../useClientRedirectUrl';
import useAuthGuard from '../../../useAuthGuard/useAuthGuard';
import useUpdateErrorMap from '../../../useUpdateErrorMap/useUpdateErrorMap';
import {Utils} from '../../../../lib/utils';
import {getProduct, updateProduct} from '../../../../store/product/action';
import {getStateMachine} from '../../../../store/stateMachine/action';
import {customGetApplicationById, getApplicationById,} from '../../../../store/application/action';
import {StageInterface} from '../../../../interfaces/stage.interface';
import {dataMapper} from '../../../Register/dataMapper';
import {storeStageData} from '../../../../store/stages/action';
import {ObjectUtils} from '../../../../lib/ObjectUtils';
import Register from '../../../Register';
import {ProductInterface} from '../../../../interfaces/product.interface';
import {StateMachineConfigInterface} from '../../../../interfaces/stateMachineConfig.interface';

export default function StageContainer() {
  const router = useRouter();
  const productId = (router.query.product as string).toLowerCase();
  const applicationId = router.query.applicationId as string;
  const { orgCode, actions, theme } = useSelector((state: RootState) => ({
    orgCode: state.branding?.data?.orgCode,
    actions: state.branding?.data?.actions,
    theme: state.branding?.data?.theme,
  }));

  const [
    application,
    applicationLoading,
    applicationError,
  ] = useSelector(({ application: applicationStore }: RootState) => [
    applicationStore.data?.application,
    applicationStore.loading,
    applicationStore.error,
  ]);

  useReferral(
    productId,
    actions,
    applicationId,
    orgCode,
    application?.applicationInfo.referrerCode,
  );
  useClientRedirectUrl(productId, null);
  useAuthGuard('onboarding', productId);
  useUpdateErrorMap();

  useEffect(() => {
    Utils.applyStylesFromBrand(theme);
  }, [theme]);

  const [
    product,
    loading,
    error,
  ] = useSelector(({ product: productStore }: RootState) => [
    productStore.data,
    productStore.loading,
    productStore.error,
  ]);
  const [
    stateMachineConfig,
    stateMachineLoading,
    stateMachineError,
  ] = useSelector(({ stateMachine }: RootState) => [
    stateMachine.data ? stateMachine.data?.stateMachineConfig : null,
    stateMachine.loading,
    stateMachine.error,
  ]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (application && !product && !loading && !error) {
      dispatch(
        getProduct(
          orgCode?.toLowerCase() as string,
          application?.applicationInfo.productGroupCode.toLowerCase(),
          application?.applicationInfo.productType.toLowerCase(),
          application?.startOnboardingDto.startOnboardingFor.toLowerCase(),
          application?.applicationInfo.products[0],
        ),
      );
    }
  }, [product, productId, loading, error, application]);

  useEffect(() => {
    if (
      application &&
      !stateMachineConfig &&
      !stateMachineLoading &&
      !stateMachineError
    ) {
      dispatch(
        getStateMachine(
          orgCode?.toLowerCase() as string,
          application?.applicationInfo.productGroupCode.toLowerCase(),
          application?.applicationInfo.productType.toLowerCase(),
          application?.startOnboardingDto.startOnboardingFor.toLowerCase(),
          application?.applicationInfo.products[0],
        ),
      );
    }
  }, [
    stateMachineConfig,
    productId,
    stateMachineLoading,
    stateMachineError,
    application,
  ]);

  useEffect(() => {
    if (
      (!application || !Object.keys(application).length) &&
      !applicationLoading &&
      !applicationError
    ) {
      if (actions?.getApplication) {
        dispatch(
          customGetApplicationById(
            actions?.getApplication,
            {
              orgCode,
              applicationId,
            },
            router,
          ),
        );
      } else {
        dispatch(getApplicationById(applicationId, orgCode));
      }
    }
  }, [
    application,
    applicationLoading,
    applicationError,
    product,
    applicationId,
  ]);

  const hasApplicationDataStoredInStore = useMemo(() => {
    function checkIfDataFilledAndAssignDataToTheGroups(
      multipleStagesData,
      stage: StageInterface,
    ) {
      if (multipleStagesData) {
        const { mappedData } = dataMapper(
          multipleStagesData,
          stage.map.toStore,
        );
        dispatch(storeStageData(stage.name, mappedData));
        stage.groups.forEach(group => {
          if (group.name in mappedData) {
            const groupData = mappedData[group.name];
            group.entities.forEach(entity => {
              if (
                entity.entityType === 'field' &&
                entity.entity.name in groupData
              ) {
                entity.entity.value = groupData[entity.entity.name];
              }
            });
          }
        });
      }
    }

    if (
      product &&
      application &&
      Object.keys(application).length &&
      stateMachineConfig
    ) {
      product.stages.forEach(stage => {
        if (stage?.contains) {
          let multipleStagesData = {};
          stage.contains.forEach(stageName => {
            const applicationStage = application.stages.find(
              item => item.stageType.toUpperCase() === stageName.toUpperCase(),
            );
            if (ObjectUtils.checkIfItsFilled(applicationStage)) {
              multipleStagesData = Object.assign(
                multipleStagesData,
                applicationStage?.data,
              );
            }
          });
          checkIfDataFilledAndAssignDataToTheGroups(multipleStagesData, stage);
        } else {
          const applicationStage = application.stages.find(
            item => item.stageType.toUpperCase() === stage.name.toUpperCase(),
          );
          checkIfDataFilledAndAssignDataToTheGroups(
            applicationStage?.data,
            stage,
          );
        }
      });
      dispatch(updateProduct(product));
      return true;
    }
    return false;
  }, [application, product, stateMachineConfig]);

  if (hasApplicationDataStoredInStore) {
    return (
      <Register
        product={product as ProductInterface}
        stateMachineConfig={stateMachineConfig as StateMachineConfigInterface}
      />
    );
  } else {
    return <p>لطفا صبر کنید ...</p>;
  }
}

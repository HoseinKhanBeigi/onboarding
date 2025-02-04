import React, { useEffect, useMemo, useState } from 'react';
import { NextRouter, useRouter } from 'next/router';
import { Layout } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';
import { ActionBar } from '..';
import { DataSourceInterface } from '../../interfaces/entity.interface';
import { ErrorStageItemInterface } from '../../interfaces/errorStageItem.interface';
import { ProductInterface } from '../../interfaces/product.interface';
import { StageStatusEnum } from '../../interfaces/stageStatus.enum';
import {
  submitApplication,
  submitApplicationByConfiguredSubmit,
} from '../../store/application/action';
import { RootState } from '../../store/rootReducer';
import { resolveDataByActionConfig } from '../../store/stageAdditionalData/action';
import {
  saveStageData,
  saveStageDataByConfiguredSubmit,
} from '../../store/stages/action';
import useXStateMachine from '../../xstate/xstateHook';
import { dataMapper } from './dataMapper';
import style from './Register.scss';
import { ObjectUtils } from '../../lib/ObjectUtils';
import SideLayout from './SideLayout/SideLayout';
import useSteps from './useSteps';
import Overview from '../Overview/Overview/OverView';
import Selfie from '../kyc/Selfie/Selfie';
import Video from '../kyc/Video/Video';
import Signature from '../kyc/Signature/Signature';
import { StageInterface } from '../../interfaces/stage.interface';
import Esign from '../Esign/Esign';
import OnlineExam from '../OnlineExam/OnlineExam';
import OtpStage from '../OtpStage/OtpStage';
import {
  closeStageErrors,
  extractDefaultData,
  findStage,
  findStageStatus,
  generateSubmitState,
  showStageErrors,
} from './Register.utils';
import { StaticStage } from './StaticStage';
import { OnboardingFieldGeneratorList } from './Fields';
import { useFormGenerator } from '../FormGenerator/useFormGenerator';
import { StringUtils } from '../../lib/StringUtils';
import { generateContracts } from './views/Contracts/ContractsViewGenerator';
import StageMessagePublisher from './StageMessagePublisher/StageMessagePublisher';
import { generateText } from './views/Text/TextViewGenerator';
import { StateMachineConfigInterface } from '../../interfaces/stateMachineConfig.interface';
import { inProgress, readyToSubmit } from '../../xstate/guards';
import { useClientRedirectUrl } from '../useClientRedirectUrl';
import { generateValueMap } from './views/ValueMap/ValueMapViewGenerator';
import FetchSejamWithPreview from '../FetchSejamWithPreview/FetchSejamWithPreview';
import { SabtAhvalData } from '../SabtAhvalWithPreview/SabtAhvalData';
import SabtAhvalWithPreview from '../SabtAhvalWithPreview/SabtAhvalWithPreview';
import OMSINFO from '../omsInfo/OmsInfo';

interface RegisterPropsInterface {
  product: ProductInterface;
  stateMachineConfig: StateMachineConfigInterface;
}

const STATIC_STAGES = ['FINAL', 'PENDING'];

function resolveStageData(
  resolve: Record<string, DataSourceInterface> | undefined,
  currentStage: string,
  dispatch: Dispatch<any>,
  router: NextRouter,
) {
  if (!resolve) {
    return;
  }
  for (const resolveKey in resolve) {
    if (resolve.hasOwnProperty(resolveKey)) {
      const actionConfig = resolve[resolveKey];
      dispatch(
        resolveDataByActionConfig(
          resolveKey,
          currentStage.toLowerCase(),
          actionConfig,
          router,
        ),
      );
    }
  }
}

function Register({ product, stateMachineConfig }: RegisterPropsInterface) {
  const router = useRouter();
  const step = router.query.step as string;
  const applicationId = router.query.applicationId as string;
  const productName = router.query.product as string;
  const brand = useSelector(({ branding }: RootState) => branding.data);
  const [collapsed, setCollapsed] = useState(true);
  const orgCode = brand?.orgCode;

  const [
    application,
    applicationLoading,
  ] = useSelector(({ application: applicationStore }: RootState) => [
    applicationStore.data?.application,
    applicationStore.loading,
  ]);

  const { currentStage, updateState, buttons } = useXStateMachine(
    step.toUpperCase(),
    stateMachineConfig,
    application,
  );

  const [stageAdditionalData, stagesData] = useSelector((state: RootState) => [
    state.stageAdditionalData.data,
    state.stages.data,
  ]);

  function goToStage(targetStage: string) {
    router.push(
      '/onboarding/[product]/[step]/[applicationId]',
      `/onboarding/${productName}/${targetStage}/${applicationId}`,
    );
  }

  useEffect(() => {
    if (step.toLowerCase() !== currentStage.toLowerCase()) {
      goToStage(currentStage.toLowerCase());
    }
  }, [currentStage]);

  useEffect(() => {
    const mappedStep = step.toLocaleUpperCase();
    if (mappedStep !== currentStage) {
      updateState(`${mappedStep}`);
    }
  }, [step]);

  const dispatch = useDispatch();

  const stage = useMemo(() => findStage(product, currentStage), [
    currentStage,
    product,
  ]);

  useEffect(() => {
    resolveStageData(stage?.resolve, currentStage, dispatch, router);
  }, [stage]);

  const [
    storedStageData,
    stageLoading,
    stageError,
  ] = useSelector(({ stages }: RootState) => [
    stages.data && stages.data[stage?.name || ''],
    stages.loading,
    stages.error,
  ]);
  const redirectUrl = useClientRedirectUrl(
    productName,
    brand?.portalAddress || '#',
  );

  const errorItems: Array<ErrorStageItemInterface> = application?.errors.items;

  const steps = useSteps({ product, application });

  const defaultData = useMemo(
    () => storedStageData || extractDefaultData(stage),
    [stage],
  );

  const stageStatus = useMemo(() => findStageStatus(steps, stage), [
    steps,
    stage,
  ]);

  useEffect(() => {
    showStageErrors(errorItems, stage?.name as string);
    return () => closeStageErrors(stage?.name as string);
  }, [errorItems, stage?.name]);

  async function submitFormData(params) {
    let filteredArray;
    if (params?.mappedData?.documents) {
      filteredArray = {
        data: params.data.documents,
        mappedData: {
          documents: params?.mappedData?.documents.filter(str => str !== ''),
          submitState: params?.mappedData?.submitState,
        },
      };
    } else {
      filteredArray = params;
    }
    // TODO: decide to whether handle prevent submitting clean forms or not
    if (
      ![StageStatusEnum.LOCKED, StageStatusEnum.LOCKED_EMPTY].includes(
        stageStatus,
      )
    ) {
      const data = generateSubmitState(filteredArray, application, stage?.name);
      let response;
      try {
        if (stage?.submit) {
          response = await dispatch(
            saveStageDataByConfiguredSubmit(
              applicationId,
              stage?.name,
              stage.submit,
              application?.applicationInfo.currentStage || '',
              data,
              router,
              { orgCode, applicationId, product: productName },
            ),
          );
        } else {
          response = await dispatch(
            saveStageData(applicationId, stage?.name, data, orgCode),
          );
        }
        if (response) {
          updateState('FORWARD', response);
        }
      } catch (e) {
        throw e;
      }
    } else {
      updateState('FORWARD', application);
    }
  }

  async function handleApprove() {
    if (application && readyToSubmit(application?.applicationInfo)) {
      let response;
      if (ObjectUtils.checkIfItsFilled(product.submit) && product.submit) {
        response = (await dispatch(
          submitApplicationByConfiguredSubmit(
            applicationId,
            product.submit,
            router,
            application.applicationInfo,
          ),
        )) as any;
      } else {
        response = (await dispatch(submitApplication(applicationId))) as any;
      }
      if (response) {
        updateState('APPROVE', response);
      }
    } else if (application && inProgress(application?.applicationInfo)) {
      goToStage(application?.applicationInfo.currentStage.toLowerCase());
    }
  }

  function handleExit() {
    router.push(
      '/auth/[action]/[product]/logout',
      `/auth/onboarding/${productName}/logout`,
    );
  }

  function handleBackToThirdParty() {
    window.location.href = redirectUrl;
  }

  const toggleSider = () => {
    setCollapsed(!collapsed);
  };

  const actions = {
    approve: handleApprove,
    exit: handleExit,
    backToThirdParty: handleBackToThirdParty,
    submitForm: submitFormData,
  };

  const disabled = [
    StageStatusEnum.LOCKED,
    StageStatusEnum.LOCKED_EMPTY,
  ].includes(stageStatus);

  const actionBar = (
    <ActionBar
      loading={stageLoading || applicationLoading}
      error={stageError}
      buttons={buttons}
      brand={brand}
      actions={actions}
      product={productName}
    />
  );

  const { fieldMap, viewMap, form } = useFormGenerator({
    config: stage as StageInterface,
    actions: actionBar,
    defaultData,
    extraData: stageAdditionalData,
    data: stagesData,
    onSubmit: data => submitFormData(dataMapper(data, stage?.map.toService)),
    disabled,
  });
  useEffect(() => {
    fieldMap.addList(OnboardingFieldGeneratorList);
    viewMap.add('contracts', generateContracts);
    viewMap.add('text', generateText);
    viewMap.add('value-map', generateValueMap);
  }, [false]);

  // TODO: make the components load lazy
  const renderedStage = useMemo(() => {
    if (StringUtils.isItFilled(stage?.builtin)) {
      if (stage?.builtin?.toUpperCase() === 'ESIGN') {
        return <Esign stage={stage} actions={actions} brand={brand?.label} />;
      } else if (stage?.builtin?.toUpperCase() === 'ONLINE_EXAM') {
        return <OnlineExam stage={stage} actions={actions} brand={undefined} />;
      } else if (stage?.builtin?.toUpperCase() === 'OTP') {
        return <OtpStage stage={stage} actions={actions} brand={undefined} />;
      } else if (stage?.builtin?.toUpperCase() === 'FETCH_SEJAM_WITH_PREVIEW') {
        return (
          <FetchSejamWithPreview stage={stage} actions={actions} brand="" />
        );
      } else if (stage?.builtin?.toUpperCase() === 'KYC_SELFIE') {
        return <Selfie stage={stage} actions={actions} brand="" />;
      } else if (stage?.builtin?.toUpperCase() === 'KYC_VIDEO') {
        return <Video stage={stage} actions={actions} brand={undefined} />;
      } else if (stage?.builtin?.toUpperCase() === 'KYC_SIGNATURE') {
        return <Signature stage={stage} actions={actions} brand={undefined} />;
      } else if (stage?.builtin?.toUpperCase() === 'SABTAHVAL') {
        return (
          <SabtAhvalWithPreview
            stage={stage}
            actions={actions}
            brand={undefined}
          />
        );
      } else if (stage?.builtin?.toUpperCase() === 'OMSINFO') {
        return <OMSINFO stage={stage} actions={actions} />;
      }
    }

    return form;
  }, [stage?.name, form]);

  if (STATIC_STAGES.includes(currentStage.toUpperCase())) {
    return <StaticStage currentStage={currentStage} actionBar={actionBar} />;
  }

  if (
    (!stage || !ObjectUtils.checkIfItsFilled(stage)) &&
    currentStage.toUpperCase() !== 'REVIEW'
  ) {
    updateState('REVIEW');
    return <></>;
  }

  return (
    <Layout className={style.layout}>
      <Layout.Sider
        className={style.header}
        trigger={null}
        collapsible
        collapsed={collapsed}
        collapsedWidth={48}
      >
        <SideLayout
          collapsed={collapsed}
          toggle={toggleSider}
          steps={steps}
          currentStage={currentStage}
        />
      </Layout.Sider>
      <Layout.Content className={style.layoutContainer}>
        <div className={style.body}>
          <div className={style.container}>
            <div className={style.content}>
              {currentStage.toUpperCase() === 'REVIEW' || !stage ? (
                <div className={style.groupsContainer}>
                  <Overview product={product} steps={steps} />
                  {actionBar}
                </div>
              ) : (
                renderedStage
              )}
            </div>
          </div>
        </div>
        <div className={style.layoutFooter}>
          <img
            className={style.logo}
            src={brand?.logo}
            alt={`${brand?.label} Logo`}
          />
          <span>{brand?.description}</span>
          <span>پشتیبانی: {brand?.phone}</span>
        </div>
        <StageMessagePublisher message={stage?.message} />
      </Layout.Content>
    </Layout>
  );
}

export default Register;

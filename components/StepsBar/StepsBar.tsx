import React, {useMemo} from 'react';
import {Button, Steps} from 'antd';
import {StepProps} from 'antd/lib/steps';
import {CheckCircleFilled, InfoCircleOutlined, LeftOutlined,} from '@ant-design/icons';
import {useRouter} from 'next/router';
import style from './StepBar.scss';
import {StepRouteInterface} from '../../interfaces/step-route.Interface';
import {StageStatusEnum} from '../../interfaces/stageStatus.enum';

const { Step } = Steps;

interface StepsBarProps {
  current: string;
  steps: Array<StepRouteInterface>;
}

const StepsBar = ({ current, steps }: StepsBarProps) => {
  const router = useRouter();
  const currentStepIndex = steps.findIndex(step => step.key === current);
  const stepStatus = currentStepIndex < steps.length - 1 ? 'process' : 'finish';

  function handleChangeStep(StepNumber) {
    if (steps[StepNumber].status !== StageStatusEnum.LOCKED) {
      router.push(
        '/onboarding/[product]/[step]/[applicationId]',
        steps[StepNumber].path,
      );
    }
  }

  function generateEditButton() {
    return (
      <Button className={style.editBtn}>
        <span>ویرایش</span>
      </Button>
    );
  }

  function generateActiveStep(title: string): StepProps {
    return {
      title: (
        <div className={style.titleContainer}>
          <div className={style.titleWrapper}>
            <span>{title}</span>
            <LeftOutlined />
          </div>
        </div>
      ),
      icon: (
        <img
          src="/static/images/ActiveState.svg"
          width={34}
          height={34}
          className={style.activateState}
          alt="loading"
        />
      ),
      status: 'process',
    };
  }

  function generateErrorStep(title: string): StepProps {
    return {
      title: (
        <div className={style.titleContainer}>
          <div className={style.titleWrapper}>
            <span>{title}</span>
            <LeftOutlined />
          </div>
          {generateEditButton()}
        </div>
      ),
      icon: <InfoCircleOutlined className={style.error} />,
      status: 'finish',
    };
  }

  function generateDirtyStep(title: string): StepProps {
    return {
      title: (
        <div className={style.titleContainer}>
          <div className={style.titleWrapper}>
            <span>{title}</span>
          </div>
          {generateEditButton()}
        </div>
      ),
      icon: <CheckCircleFilled className={style.whiteCheck} />,
      status: 'wait',
    };
  }

  function generateLockedStep(title: string): StepProps {
    return {
      title,
      icon: <CheckCircleFilled className={style.greenCheck} />,
      status: 'wait',
    };
  }

  function generateLockedEmptyStep(title: string): StepProps {
    return {
      title,
      icon: <InfoCircleOutlined className={style.grayInfo} />,
      status: 'wait',
    };
  }

  function generateEmptyStep(title: string) {
    return {
      title,
      icon: (
        <img
          src="/static/images/Empty.svg"
          width={18}
          height={18}
          alt="EMPTY"
        />
      ),
    };
  }

  function generateStep(
    index: number,
    title: string,
    status: StageStatusEnum | undefined,
  ): StepProps {
    if (index === currentStepIndex) {
      return generateActiveStep(title);
    } else if (status === StageStatusEnum.ERROR) {
      return generateErrorStep(title);
    } else if (status === StageStatusEnum.FINISH) {
      return generateDirtyStep(title);
    } else if (status === StageStatusEnum.LOCKED) {
      return generateLockedStep(title);
    } else if (status === StageStatusEnum.LOCKED_EMPTY) {
      return generateLockedEmptyStep(title);
    } else if (status === StageStatusEnum.EMPTY && index < currentStepIndex) {
      return generateEmptyStep(title);
    } else if (status === StageStatusEnum.EMPTY) {
      return generateEmptyStep(title);
    }
    return { title };
  }

  const renderSteps = useMemo(() => {
    return (
      <Steps
        direction="vertical"
        size="small"
        current={currentStepIndex}
        status={stepStatus}
        onChange={handleChangeStep}
      >
        {steps.map(({ title, status }, index) => {
          const stepProps = generateStep(index, title, status);
          return <Step key={title} {...stepProps} />;
        })}
      </Steps>
    );
  }, [currentStepIndex, stepStatus, steps]);

  return <div className={style.container}>{renderSteps}</div>;
};
export default StepsBar;

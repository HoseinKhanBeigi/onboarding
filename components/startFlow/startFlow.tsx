import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import style from './startFlow.scss';
import LogoutButton from '../ActionBar/LogoutButton/LogoutButton';
import {StartFormInterface} from '../../interfaces/startForm.interface';
import {useFormGenerator} from '../FormGenerator/useFormGenerator';
import {mapBoxFormToStage} from '../Register/Register.utils';
import Button from '../Button/Button';
import {ShivaFieldGeneratorList} from '../Register/Fields';
import {createCard} from '../../store/card/action';
import useFlowState from '../useFlowState/useFlowState';

interface StartFlowProps {
  loading: boolean;
  form?: StartFormInterface;
}
interface ActionsProps {
  loading: boolean;
  pipeId: string;
}

const Actions = ({ loading, pipeId }: ActionsProps) => (
  <div className={style.buttonContainer}>
    <Button htmlType="submit" type="primary" loading={loading}>
      شروع فرآیند
    </Button>
    <LogoutButton action="flow" product={pipeId} />
  </div>
);

export default function StartFlow({
  loading,
  form: formStructure,
}: StartFlowProps) {
  const dispatch = useDispatch();
  const pipeId = formStructure?.pipe as string;
  useFlowState();
  function handleSubmit(data) {
    dispatch(createCard({ pipeId, values: data }));
  }
  const { fieldMap, form } = useFormGenerator({
    config: mapBoxFormToStage(formStructure),
    onSubmit: handleSubmit,
    defaultData: {}, // TODO: get the values and fill the map and send it down to the form
    disabled: false,
    extraData: {},
    actions: <Actions loading={false} pipeId={pipeId} />,
    isDev: true,
  });
  useEffect(() => {
    fieldMap.addList(ShivaFieldGeneratorList);
  }, [false]);
  return (
    <div className={style.startApplicationContainer}>
      <div className={style.sideLayout}>
        <div className={style.container}>
          <div className={style.content}>
            <h3>خوش آمدید</h3>
            <div className={style.box}>{form}</div>
          </div>
          <div className={style.footer}>
            <img
              className={style.logo}
              src="/static/images/clock.svg"
              alt="logo"
            />
            <span>پلتفرمی برای نمایش فلو های شیوا</span>
            <span>پشتیبانی: 021118</span>
          </div>
        </div>
      </div>
      <div className={style.contentLayout}>
        <div className={style.backgroundImgWrapper}>
          <img src="/static/images/loginbackground.jpg" alt="background" />
        </div>
      </div>
    </div>
  );
}

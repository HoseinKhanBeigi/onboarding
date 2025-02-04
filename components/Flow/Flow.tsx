import React, { useEffect } from 'react';
import { Layout } from 'antd';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import style from './Flow.scss';
import { BoxCardDto } from '../../interfaces/card.interface';
import { executeCardAction } from '../../store/card/action';
import { useFormGenerator } from '../FormGenerator/useFormGenerator';
import { mapBoxFormToStage } from '../Register/Register.utils';
import { ShivaFieldGeneratorList } from '../Register/Fields';
import Button from '../Button/Button';

interface FlowProps {
  loading: boolean;
  box?: BoxCardDto;
}

interface ActionsProps {
  loading: boolean;
}

const Actions = ({ loading }: ActionsProps) => (
  <div className={style.buttonContainer}>
    <Button htmlType="submit" type="primary" loading={loading}>
      ثبت و ادامه
    </Button>
  </div>
);

function Flow({ loading, box: currentBox }: FlowProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { cardId } = router.query;

  function handleSubmit(data) {
    dispatch(
      executeCardAction({
        boxId: currentBox?.boxId,
        cardId: cardId as string,
        dataCategoryType: 'BOX_FORM',
        values: data,
      }),
    );
  }

  const { fieldMap, form } = useFormGenerator({
    config: mapBoxFormToStage(currentBox?.boxForm),
    onSubmit: handleSubmit,
    defaultData: {}, // TODO: get the values and fill the map and send it down to the form
    disabled: false,
    extraData: {},
    actions: <Actions loading={loading} />,
    isDev: true,
  });
  useEffect(() => {
    fieldMap.addList(ShivaFieldGeneratorList);
  }, [false]);
  return (
    <Layout className={style.layout}>
      <Layout.Sider
        className={style.header}
        trigger={null}
        collapsible
        collapsed
      >
        <div>-</div>
      </Layout.Sider>
      <Layout.Content className={style.layoutContainer}>
        <div className={style.body}>
          <div className={style.container}>
            <div className={style.content}>{form}</div>
          </div>
        </div>
        <div className={style.layoutFooter}></div>
      </Layout.Content>
    </Layout>
  );
}

export default Flow;

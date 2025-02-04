import React, { useMemo } from 'react';
import { Button } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import style from '../Esign.scss';

export default function ContractsContainer({
  formDocValueOneRender,
  contract,
  setDataContract,
  setIsEsignOtpModalVisible,
  setIsPdfModalVisible,
  setContractItem,
  setFormDocSixteen,
  isConfirm,
  setKianTradeFormOne,
}: any) {
  const handleObserve = (item, index) => {
    const answers: any = [];
    const questionTitles: any = formDocValueOneRender?.online_exam?.map(
      // eslint-disable-next-line no-shadow
      (item: any) => {
        item?.options?.map(option => {
          answers.push({ txt: option });
        });
        return {
          txt: item,
        };
      },
    );

    const allEntity: any = [];
    const dataEntites: any = item.data.map(e => {
      if (e.pages[0].question && questionTitles) {
        allEntity.push(...e.pages[0].entities, ...questionTitles);

        return allEntity;
      } else {
        return e?.pages[0]?.entities.length > 0 && e?.pages[0]?.entities;
      }
    });
    const contacts: any = [];

    dataEntites
      .filter(e => e !== false)
      // eslint-disable-next-line no-shadow
      .map(item => contacts.push({ pages: [{ entities: item }] }));
    setDataContract(contacts);
    setIsPdfModalVisible(true);
    setContractItem(item);
    setKianTradeFormOne(item.name);
    setFormDocSixteen(item.name);
  };

  const confirmed = useMemo(() => {
    return contract?.map((item, index) => {
      return (
        <div className={style.singleFormContainer} key={item.label}>
          <div className={style.contractBtnWrapper}>
            <Button onClick={() => handleObserve(item, index)}>
              &nbsp;
              {item.label}
            </Button>
          </div>

          <span className={style.icon}>
            {item.isVisible ? (
              <span
                style={{ color: 'green', whiteSpace: 'nowrap' }}
                onClick={() => handleObserve(item, index)}
              >
                تایید شد
              </span>
            ) : (
              <span
                style={{ color: '#1890ff' }}
                onClick={() => handleObserve(item, index)}
              >
                مشاهده و دانلود
              </span>
            )}
          </span>
        </div>
      );
    });
  }, [contract, isConfirm]);
  return (
    <div className={style.bodyContainer}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {confirmed}
      </div>
      <Button
        type="primary"
        className={style.esignBtn}
        disabled={contract?.some(e => !e.isVisible)}
        onClick={() => setIsEsignOtpModalVisible(true)}
      >
        امضای الکترونیکی قراردادها <LeftOutlined />
      </Button>
    </div>
  );
}

import React, { useEffect, useMemo, useState } from 'react';
import { Button, Modal } from 'antd';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { DataSourceInterface } from '../../interfaces/entity.interface';
import style from '../Esign/Esign.scss';
import { configurableRequest } from '../../lib/configurableRequest';
import { RequestInstance } from '../../store/request';

const DOWNLOAD = 'دانلود متن قرارداد';
const DOWNLOADING = 'درحال آماده‌سازی ...';

interface FormItemInterface {
  id: string;
  title: string;
}

interface ContractsProps {
  getFormsConfig: DataSourceInterface;
  downloadFormConfig: DataSourceInterface;
  label: string;
}

function Contracts({
  getFormsConfig,
  downloadFormConfig,
  label,
}: ContractsProps) {
  const [modalVisibleState, setModalVisibleState] = useState(false);
  const [targetFormId, setTargetFormId] = useState();
  const [formsDownloadInProgress, setFormsDownloadInProgress] = useState<
    Array<number>
  >([]);
  const [forms, setForms] = useState<Array<FormItemInterface>>();
  const router = useRouter();

  useEffect(() => {
    if (getFormsConfig && !forms) {
      configurableRequest<Array<any>>(
        RequestInstance,
        getFormsConfig,
        router,
        {},
      ).then(res => {
        const mappedForms = res.map(({ id, title }) => ({ id, title }));
        setForms(mappedForms);
      });
    }
  }, [getFormsConfig]);

  function getPdf(id) {
    return configurableRequest<Blob>(
      RequestInstance,
      downloadFormConfig,
      router,
      {
        formId: id,
      },
      {
        responseType: 'blob',
      },
    );
  }

  function visitPdf(id) {
    setTargetFormId(id);
    setModalVisibleState(true);
  }

  async function downloadPdf(id, title) {
    setFormsDownloadInProgress([...formsDownloadInProgress, id]);
    try {
      const response = await getPdf(id);
      setFormsDownloadInProgress(
        formsDownloadInProgress.filter(item => item === id),
      );
      const blob = new Blob([response]);
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `${title}.pdf`;
      link.click();
    } catch {
      setFormsDownloadInProgress(
        formsDownloadInProgress.filter(item => item === id),
      );
    }
  }

  function closeModal() {
    setModalVisibleState(false);
  }

  const renderedForms = useMemo(
    () =>
      forms?.map((item, index) => {
        const isLastItem: boolean = forms.length !== index + 1;
        return (
          <div
            className={style.singleFormContainer}
            key={`${index}-${item.id}`}
          >
            <div className={style.formTitle}>{item.title}</div>
            <div className={style.contractBtnWrapper}>
              <Button onClick={() => visitPdf(item.id)}>
                مشاهده متن قرارداد
              </Button>
            </div>
            <div className={style.contractBtnWrapper}>
              <Button onClick={() => downloadPdf(item.id, item.title)}>
                {formsDownloadInProgress.includes(index)
                  ? DOWNLOADING
                  : DOWNLOAD}
              </Button>
            </div>
            {isLastItem && <div className={style.hr} data-cy="hr" />}
          </div>
        );
      }),
    [forms, targetFormId, formsDownloadInProgress],
  );

  return (
    <>
      <div className={style.container}>{renderedForms}</div>
      <Modal
        title="Basic Modal"
        visible={modalVisibleState}
        onCancel={() => closeModal()}
        centered
        className={style.modalContent}
        footer={[
          <Button
            className={style.modalFooter}
            type="primary"
            onClick={() => closeModal()}
          >
            بستن
          </Button>,
        ]}
      >
        {/* {modalVisibleState && (
          <PdfViewer downloadFile={() => getPdf(targetFormId)} />
        )} */}
      </Modal>
    </>
  );
}

export default Contracts;

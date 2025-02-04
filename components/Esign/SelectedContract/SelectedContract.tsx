import { Button, Checkbox, Modal } from 'antd';
import React, { useCallback, useMemo } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import _ from 'lodash';
import style from '../Esign.scss';
import ContractsList from '../../getValueForContracts';
import createPdf from '../hooks/pdf-generate';
import { uploadFileRequest } from '../hooks';
import getBranding from '../../../store/branding/action';

export default function SelectedContract({
  setIsPdfModalVisible,
  brand,
  setDataContract,
  isPdfModalVisible,
  setIsChecked,
  isChecked,
  formDocValueOneRender,
  isUpload,
  dataContract,
  isLoading,
  isConfirm,
  imgUrl,
  imgBlob,
  setIsUpload,
  setContractFiles,
  setConfim,
  stage,
  rootRef,
  contractItem,
  handleComplete,
}: any) {
  function onCancel() {
    setIsPdfModalVisible(false);
    setDataContract({});
  }

  async function uploadPdf(action, files) {
    const formData = new FormData();
    formData.append('files', files, 'myfile.pdf');
    return await uploadFileRequest(action, formData);
  }

  const handleChange = contract => {
    handleComplete(contract);
  };

  const onConfirm = useCallback(
    item => {
      // const byteArrayimageSigniture = signitureImage(imgUrl);

      if (formDocValueOneRender) {
        const deepCopy = _.cloneDeep(formDocValueOneRender);
        const blobdata = createPdf(
          brand,
          dataContract,
          deepCopy,
          imgUrl,
          item.name,
          item.label,
          item,
        );
        if (blobdata) {
          setIsUpload(true);
          blobdata.then(e => {
            uploadPdf(stage?.extraConfig?.actions.upload, e)
              .then(response => {
                setIsUpload(false);
                setContractFiles(prevState => [
                  ...prevState,
                  {
                    documentToken: response?.data[0].token,
                    documentType: item.contractName,
                  },
                ]);
                handleChange(contractItem);
                const link = document.createElement('a');
                link.href = URL.createObjectURL(e);
                link.download = `contract.pdf`;

                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              })
              .catch(() => {
                setIsUpload(false);
                setIsPdfModalVisible(false);
                setDataContract({});
                setConfim(false);
              })
              .finally(() => {
                setIsUpload(false);
                setIsPdfModalVisible(false);
                setDataContract({});
                setConfim(false);
              });
          });
        }
      }
    },
    [contractItem, dataContract, formDocValueOneRender, imgUrl],
  );

  const elementContractsList = useMemo(() => {
    if (!isLoading) {
      return (
        <ContractsList
          brand={brand}
          dataContract={dataContract}
          isPdfModalVisible={isPdfModalVisible}
          ref={rootRef}
          isConfirm={isConfirm}
          formDocValueOneRender={formDocValueOneRender}
          isLoading={isLoading}
          imgUrl={imgUrl}
          contractItem={contractItem}
        />
      );
    } else {
      return <>لطفا منتظر بمانید...</>;
    }
  }, [dataContract, isLoading, imgUrl]);

  return (
    <Modal
      title="Basic Modal"
      visible={isPdfModalVisible}
      onCancel={() => onCancel()}
      centered
      className={style.modalContent}
      footer={[
        <>
          <div style={{ textAlign: 'right' }}>تایید و دانلود</div>
          <div
            style={{
              display: 'flex',
              margin: '5px 0',
            }}
          >
            <Checkbox
              onChange={e => setIsChecked(prevState => !prevState)}
              checked={isChecked}
              style={{ textAlign: 'right' }}
            >
              {`اینجانب ${formDocValueOneRender &&
                formDocValueOneRender?.firstName} ${formDocValueOneRender &&
                formDocValueOneRender?.lastName} بندهای قرارداد و مفاد آن را مطالعه نموده‌ام و می‌پذیرم
در صورت انعقاد قرارداد به صورت الکترونیکی، تأیید قرارداد به منزله قبول و امضای آن توسط مشتری و دریافت یک نسخه از آن می‌باشد`}
            </Checkbox>
          </div>
        </>,
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '5px',
          }}
        >
          <Button
            className={style.modalFooter}
            type="primary"
            disabled={!isChecked}
            loading={isUpload}
            onClick={() => {
              onConfirm(contractItem);
            }}
          >
            تایید و دانلود
          </Button>
          <Button
            className={style.modalFooter}
            type="primary"
            onClick={() => onCancel()}
          >
            انصراف
          </Button>
        </div>,
      ]}
    >
      {elementContractsList}
    </Modal>
  );
}

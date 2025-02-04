import React, { useMemo, useState, useReducer, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import style from './Esign.scss';
import { RootState } from '../../store/rootReducer';
import { BuiltInStageProps } from '../../interfaces/builtInStages.interface';
import { contractListKhobregan } from '../khobregan';
import { contractListIranCR } from '../IranCr';
import { contractListKianTrade } from '../kianTrade';
import { useFetchContractsData } from '../hooks/useFetchContractsData';
import ContractsOtpModal from './Otp/ContractsOtpModal';
import SelectedContract from './SelectedContract/SelectedContract';
import ContractsContainer from './ContractsContainer/ContractsContainer';

const reducer = (state, action) => {
  switch (action.type) {
    case 'COMPLETE':
      return state.map(contract => {
        if (contract.name === action.name && contract.isVisible === false) {
          return { ...contract, isVisible: !contract.isVisible };
        } else {
          return contract;
        }
      });
    default:
      return state;
  }
};

function Esign({ brand, stage, actions: { submitForm } }: BuiltInStageProps) {
  const [isPdfModalVisible, setIsPdfModalVisible] = useState(false);
  const [dataContract, setDataContract]: any = useState({});
  const [contractItem, setContractItem]: any = useState();
  const [formDocSixteen, setFormDocSixteen] = useState();
  const [kianTradeFormOne, setKianTradeFormOne] = useState();
  const [isChecked, setIsChecked] = useState(false);
  const [isConfirm, setConfim] = useState(false);
  const [isEsignOtpModalVisible, setIsEsignOtpModalVisible] = useState(false);
  const [contractFilesUpload, setContractFiles]: any = useState([]);

  const [isUpload, setIsUpload] = useState(false);
  const router = useRouter();
  const rootRef = useRef();

  const productName = router.query.product as string;

  const applicationInfo = useSelector(
    ({ application }: RootState) =>
      application.data?.application?.applicationInfo,
  );

  useEffect(() => {
    setIsChecked(contractItem?.isVisible);
  }, [contractItem]);

  const {
    formDocValueOneRender,
    isLoading,
    imgBlob,
    imgUrl,
  } = useFetchContractsData(
    applicationInfo,
    stage?.extraConfig?.actions,
    formDocSixteen,
    kianTradeFormOne,
  );

  const formContent = useMemo(() => {
    if (productName === 'demo-brokerage' || productName === 'kbr-brokerage') {
      return contractListKhobregan;
    } else if (productName === 'kt-brokerage' || productName === 'dorsa') {
      return contractListKianTrade;
    } else if (productName === 'irancr-esign') {
      return contractListIranCR;
    }
  }, [productName]);

  const [contract, dispatch] = useReducer(reducer, formContent);

  const handleComplete = item => {
    dispatch({ type: 'COMPLETE', name: item.name });
  };

  const contentRef = useRef(null);

  // eslint-disable-next-line no-shadow

  const desc = useMemo(() => {
    if (
      productName === 'demo-brokerage' ||
      productName === 'kbr-brokerage' ||
      productName === 'kt-brokerage' ||
      productName === 'dorsa'
    ) {
      return `جهت ثبت امضا باید تمامی قراردادها را مشاهده نموده و تایید نمایید. پس از
      تایید تمامی قراردادها می توانید قراردادها را امضا نمایید.
   `;
    } else if (productName === 'irancr-esign') {
      return `قوانین و مقررات را مطالعه نموده و آن را تایید نمایید.`;
    } else {
      return '';
    }
  }, [productName]);

  const descriptions = useMemo(
    () => (
      <p className={style.description} data-cy="description">
        <img src="/static/images/rule-orange.svg" alt="rule" />
        {desc}
      </p>
    ),
    [],
  );

  return (
    <>
      <div className={style.contractsFormWrapper} ref={contentRef}>
        <span className={style.groupLabel} data-cy="title">
          {stage.label}
        </span>

        <ContractsContainer
          formDocValueOneRender={formDocValueOneRender}
          contract={contract}
          isConfirm={isConfirm}
          setDataContract={setDataContract}
          setIsEsignOtpModalVisible={setIsEsignOtpModalVisible}
          setIsPdfModalVisible={setIsPdfModalVisible}
          setContractItem={setContractItem}
          setKianTradeFormOne={setKianTradeFormOne}
          setFormDocSixteen={setFormDocSixteen}
        />
        <SelectedContract
          setIsPdfModalVisible={setIsPdfModalVisible}
          setDataContract={setDataContract}
          isPdfModalVisible={isPdfModalVisible}
          setIsChecked={setIsChecked}
          isChecked={isChecked}
          formDocValueOneRender={formDocValueOneRender}
          isUpload={isUpload}
          dataContract={dataContract}
          isLoading={isLoading}
          isConfirm={isConfirm}
          imgUrl={imgUrl}
          imgBlob={imgBlob}
          setContractFiles={setContractFiles}
          setIsUpload={setIsUpload}
          setConfim={setConfim}
          stage={stage}
          brand={brand}
          rootRef={rootRef}
          contractItem={contractItem}
          productName={productName}
          submitForm={submitForm}
          handleComplete={handleComplete}
        />

        {isEsignOtpModalVisible && (
          <ContractsOtpModal
            stage={stage}
            setIsEsignOtpModalVisible={setIsEsignOtpModalVisible}
            isEsignOtpModalVisible={isEsignOtpModalVisible}
            submitForm={submitForm}
            contractFilesUpload={contractFilesUpload}
          />
        )}
        <div className={style.descContainer}>{descriptions}</div>
      </div>
    </>
  );
}

export default Esign;

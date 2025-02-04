import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { configurableRequest } from '../../lib/configurableRequest';
import { FileRequestInstance, RequestInstance } from '../../store/request';
import { getBase64File } from '../UploadFile/UploadFile';

interface ContractsInterface {
  applicationInfo: any;
  stage: any;
}
export const useFetchContractsData = (
  applicationInfo,
  stage,
  formDocSixteen,
  kianTradeFormOne,
) => {
  const router = useRouter();
  const [formDocValue, setFormDocValue]: any = useState(false);
  const [formDocData, setFormDocData] = useState(false);
  const [error, setError] = useState(false);
  const [imgUrl, setImgUrl]: any = useState();
  const [isLoading, setLoading] = useState(false);
  const [imgBlob, setImageBlob] = useState();

  useEffect(() => {
    if (formDocSixteen !== 'formDocSixteen') {
      if (stage?.getToken && stage?.getValueLead) {
        setLoading(true);
        configurableRequest(RequestInstance, stage?.getValueLead, router, {
          ...applicationInfo,
        })
          .then(result => {
            setFormDocValue(result);
            setLoading(false);
            if (result.signature_path) {
              configurableRequest(RequestInstance, stage?.getToken, router, {
                ...applicationInfo,
              })
                .then(res => {
                  getImage(
                    res.token,
                    result.signature_path,
                    stage?.getSignature,
                  );
                })
                .catch(() => {
                  setLoading(false);
                });
            }
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }
  }, []);

  useEffect(() => {
    if (formDocSixteen === 'formDocSixteen') {
      if (stage?.getToken && stage?.getValueDetalied) {
        setLoading(true);
        configurableRequest(RequestInstance, stage?.getValueDetalied, router, {
          ...applicationInfo,
        })
          .then(result => {
            setFormDocData(result);
            setLoading(false);
            if (result.signature_path) {
              configurableRequest(RequestInstance, stage?.getToken, router, {
                ...applicationInfo,
              })
                .then(res => {
                  getImage(
                    res.token,
                    result.signature_path,
                    stage?.getSignature,
                  );
                })
                .catch(() => {
                  setLoading(false);
                });
            }
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }
  }, [formDocSixteen]);

  function getImage(token, fileUrl, action) {
    const data = {
      token,
    };
    configurableRequest(
      FileRequestInstance,
      action,
      router,
      {
        ...applicationInfo,
        ...data,
        filename: fileUrl,
      },
      {
        responseType: 'blob',
      },
    )
      .then(file => {
        setImageBlob(file);
        // setFileType((file as any).type);
        getBase64File(file).then(img => {
          setImgUrl(img);
        });
      })
      .catch(() => {
        setError(true);
      });
  }

  const valueOfContract = formDoc => {
    const result = formDoc?.address?.split('،');
    const fullAddress = result?.map(item => {
      return item?.split('،');
    });

    const streetArray = fullAddress && fullAddress[0];
    const street = streetArray && streetArray[0]?.split('خیابان')[1];
    const alleyArray = fullAddress && fullAddress[1];
    const alley = alleyArray && alleyArray[0]?.split('کوچه')[1];
    const unitArray = fullAddress && fullAddress[2];
    const unit = unitArray && unitArray[0]?.split('واحد')[1];
    const NOArray = unitArray && unitArray[0]?.split('واحد')[0];
    const NO = NOArray && NOArray?.split('پلاک');

    const address = {
      street,
      alley,
      unit,
      NO,
    };

    const transaction_level_Value = [
      {
        id: 'ONE',
        price_level: 'کمتر از ۲۵۰ میلیون ریال',
      },
      {
        id: 'TWO',
        price_level: 'بین ۲۵۰ تا ۱۰۰۰ میلیون ریال',
      },
      {
        id: 'THREE',
        price_level: 'بین ۱۰۰۰ تا ۵۰۰۰ میلیون ریال',
      },
      {
        id: 'FOUR',
        price_level: 'بین ۵۰۰۰ تا ۱۰۰۰۰ میلیون ریال',
      },
      {
        id: 'FIVE',
        price_level: 'بیش از  ۱۰۰۰۰ میلیون ریال',
      },
    ];

    const knowledge_level = [
      {
        id: 'EXCELLENT',
        knowledge_status: 'عالی',
      },
      {
        id: 'GOOD',
        knowledge_status: 'خوب',
      },
      {
        id: 'MEDIUM',
        knowledge_status: 'متوسط',
      },
      {
        id: 'LOW',
        knowledge_status: 'کم',
      },
      {
        id: 'VERYLOW',
        knowledge_status: 'خیلی کم',
      },
    ];

    const resultTransaction = transaction_level_Value.find(
      item => item.id === formDoc?.transaction_level,
    );

    const resultknowledge = knowledge_level.find(
      item => item.id === formDoc?.trading_knowledge_level,
    );

    const newValue = {
      ...formDoc,
      ...address,
      ...resultTransaction,
      ...resultknowledge,
    };

    return newValue;
  };

  const formDocValueOneRender = useMemo(() => {
    if (formDocSixteen === 'formDocSixteen') {
      return valueOfContract(formDocData);
    } else if (kianTradeFormOne === 'formDocOne') {
      return valueOfContract(formDocValue);
    } else {
      return formDocValue;
    }
  }, [formDocValue, formDocData, formDocSixteen, kianTradeFormOne]);

  return {
    formDocValue,
    formDocData,
    error,
    imgUrl,
    imgBlob,
    formDocValueOneRender,
    isLoading,
  };
};

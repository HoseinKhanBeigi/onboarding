import React, {useEffect, useState} from 'react';
import { useRouter } from 'next/router';
import { Button, Modal  } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import style from './FetchSejamWithPreview.scss';
import { BuiltInStageProps } from '../../interfaces/builtInStages.interface';
import { configurableRequest } from '../../lib/configurableRequest';
import { RequestInstance } from '../../store/request';
import { SabtAhvalData } from './SabtAhvalData';
import { logout } from '../ActionBar/LogoutButton/LogoutButton';
import { showErrorNotification } from '../../store/globalAction';
import ErrorUtils from '../../lib/errorUtils';

export default function SabtAhvalWithPreview({
  stage,
  actions: { submitForm },
}: BuiltInStageProps) {
  const [fetched,setFetched] = useState(false)
  const [fetchedData, setFetchedData] = useState<Record<string, any>>();
  const [showModal, setShowModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const router = useRouter();
  const { applicationId, product } = router.query;
  const [loading, setLoading] = useState(false);

  const openModal = async () => {
      setShowModal(true);
  };
  useEffect( () => {
const fetch = async () => {
  setFetched(false)
  try {
    const data = await configurableRequest(
      RequestInstance,
      stage.extraConfig?.actions.fetch,
      router,
      {
        applicationId,
      },
    );

    setFetchedData(data as any);
    setFetched(true)
    closeModal();
  } catch (error) {
    const exceptionMessage = error.response?.data?.exceptionMessage;
    showErrorNotification(ErrorUtils.getErrorMessage(exceptionMessage));
    setFetched(false)
  }
}
fetch()
  },[])


  function closeModal() {
    setShowRejectModal(false);
  }

  async function submitInfo() {
    try {
      const data = {
        mappedData: {
          applicationId,
        },
      };
      setLoading(true);
      await submitForm(data);
    } finally {
      setLoading(false);
    }
    // try {
    //   setLoading(true)
    //   await configurableRequest(
    //     RequestInstance,
    //     stage.extraConfig?.actions.fetch,
    //     router,
    //     {
    //       applicationId,
    //     },
    //   )
    //   setLoading(false)
    // } catch (error) {
    //   const exceptionMessage = error.response?.data?.exceptionMessage;
    //   showErrorNotification(ErrorUtils.getErrorMessage(exceptionMessage));
    //   setLoading(false)
    // }
    // finally {
    //   setLoading(false)
    // }
  }

  function reject() {
    setShowRejectModal(true);
  }

  function onLogout() {
    logout(router, 'onboarding', product as string);
  }
  return (
    <>
      {fetched && (
        <div className={style.container}>
          <p className={style.mainDescription}>
            {stage.extraConfig?.previewDescription}
          </p>

          <SabtAhvalData data={fetchedData} />
          <Button
            type="primary"
            className={style.rejectButton}
            loading={loading}
            onClick={reject}
          >
            عدم تایید
          </Button>
          <Button
            type="primary"
            className={style.sendOtpButton}
            loading={loading}
            onClick={submitInfo}
          >
            ثبت و ادامه <LeftOutlined />
          </Button>
        </div>
      )}
      <Modal
        onCancel={closeModal}
        title="Reject confirmation"
        visible={showRejectModal}
        centered
        footer={null}
        className={style.otpModalContent}
      >
        <p className={style.otpModalBody}>
          لطفا به
          سامانه ثبت احوال
          مراجعه کرده و اطلاعات را اصلاح کنید و سپس برای ادامه فرآیند تلاش کنید
        </p>
        <Button
          type="primary"
          className={style.rejectButton}
          loading={loading}
          onClick={onLogout}
        >
          خروج
        </Button>
      </Modal>
    </>
  );
}

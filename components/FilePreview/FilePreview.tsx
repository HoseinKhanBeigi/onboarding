import {
  CheckCircleFilled,
  LoadingOutlined,
  SyncOutlined,
} from '@ant-design/icons/lib';
import { Icon } from 'antd';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { FileConfigInterface } from '../../interfaces/entity.interface';
import { configurableRequest } from '../../lib/configurableRequest';
import { FileRequestInstance } from '../../store/request';
import { getBase64File } from '../UploadFile/UploadFile';
import { FileInfoInterface } from '../../interfaces/uploadFiles';

import style from './FilePreview.scss';
import { DEFAULT_FILE } from '../Overview/Overview/FIeldValueResolver';

const DEFAULT_RETRY_TIMEOUT = 1000;

interface FilePreviewProps {
  imageStatus: boolean;
  setImageStatus: Function;
  value: Record<string, any>;
  config?: FileConfigInterface;
  data: Record<string, any>;
  imageUrl?: string;
  fileId?: string;
  fileInfo?: FileInfoInterface;
}

export default function FilePreview({
  imageStatus,
  setImageStatus,
  value,
  config,
  data,
  imageUrl,
  fileId,
  fileInfo,
}: FilePreviewProps) {
  const [imgUrl, setImgUrl] = useState(imageUrl);
  const [showError, setShowError] = useState(false);
  const [retryTimeout, setRetryTimeout] = useState(DEFAULT_RETRY_TIMEOUT);
  const [fileType, setFileType] = useState();
  const router = useRouter();

  useEffect(() => {
    if (fileId && !imageStatus && !imgUrl) {
      setImageStatus(true);
      getImage(fileId);
    }
  }, [fileId, data, imageStatus, imgUrl]);

  useEffect(() => setImgUrl(imageUrl), [imageUrl]);

  useEffect(() => {
    setTimeout(() => {
      setShowError(false);
    }, 3000);
  }, [showError]);

  function getImage(fileUrl) {
    if (config?.get) {
      configurableRequest(
        FileRequestInstance,
        config.get,
        router,
        {
          ...data,
          filename: fileUrl,
        },
        {
          responseType: 'blob',
        },
      )
        .then(file => {
          setFileType((file as any).type);
          return getBase64File(file);
        })
        .then(url => {
          setImgUrl(url);
          setImageStatus(false);
          setRetryTimeout(DEFAULT_RETRY_TIMEOUT);
        })
        .catch(() =>
          setTimeout(() => {
            setImageStatus(false);
            setRetryTimeout(retryTimeout * 2);
          }, retryTimeout),
        );
    } else {
      setImgUrl('');
      setImageStatus(false);
    }
  }

  const ShowImage = () => {
    return (
      <div className={style.documentImageWrapper}>
        <img src={imgUrl} alt="avatar" className={style.documentImage} />
        {value?.state === 'APPROVED' && (
          <CheckCircleFilled className={style.approvedCheck} />
        )}
        {!value?.state && imgUrl && <ShowReload />}
      </div>
    );
  };

  const ShowReload = () => {
    return (
      <div className={style.uploadAgain}>
        <SyncOutlined className={style.syncUpload} />
        <span>بارگذاری مجدد</span>
      </div>
    );
  };

  const ShowSelectFile = () => {
    if (
      fileInfo?.type === 'application/pdf' ||
      (fileType === 'application/json' && !fileInfo?.type)
    ) {
      return (
        <div className={style.pdfNameContainer}>
          <div className={style.documentImageWrapper}>
            <img
              src={DEFAULT_FILE}
              alt="avatar"
              className={style.documentImage}
            />
            {value?.state === 'APPROVED' && (
              <CheckCircleFilled className={style.approvedCheck} />
            )}
          </div>
          {(value?.state === 'SUBMITTED' || value?.submitState === 'NEW') && (
            <ShowReload />
          )}
        </div>
      );
    } else if (imageStatus) {
      return <LoadingOutlined />;
    } else if (imgUrl && !imageStatus) {
      return (
        <>
          <ShowImage />
          {(value?.state === 'SUBMITTED' || value?.submitState === 'NEW') && (
            <ShowReload />
          )}
        </>
      );
    } else if (!imageStatus && !imgUrl) {
      return (
        <div className={style.iconWrapper}>
          <Icon type="plus" className={style.uploadIcon} />
          <span>انتخاب فایل</span>
        </div>
      );
    } else {
      return null;
    }
  };

  return (
    <div className={style.filePreviewContainer}>
      <ShowSelectFile />
      {showError && (
        <div className={style.errorText}>عدم امکان پیش نمایش فایل</div>
      )}
    </div>
  );
}

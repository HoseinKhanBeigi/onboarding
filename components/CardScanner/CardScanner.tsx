import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Upload } from 'antd';
import { CameraFilled, Loading3QuartersOutlined } from '@ant-design/icons/lib';
import { useRouter } from 'next/router';
import CameraWrapper from './CameraWrapper/CameraWrapper';
import Loading from './LoadingProgress/LoadingProgress';
import blobToBase64 from '../../lib/blobToBase64';
import style from './CardScanner.scss';
import dataURLtoFile from '../../lib/dataURLtoFile';
import { configurableRequest } from '../../lib/configurableRequest';
import { RequestInstance } from '../../store/request';
import { DataSourceInterface } from '../../interfaces/entity.interface';

interface CardScannerProps {
  onChange: (data: any) => void;
  requestConfig: DataSourceInterface;
  description: JSX.Element;
}

const layoutIds = {
  DATA_CONTAINER: 'DATA_CONTAINER',
  IMAGE: 'IMAGE',
};

function CardScanner({
  onChange,
  requestConfig,
  description,
}: CardScannerProps) {
  const imageRef = useRef<HTMLImageElement>(null);
  const [image, setImage] = useState<string>();
  const [mediaSize, setMediaSize] = useState({ width: 0, height: 0 });
  const router = useRouter();
  const webcamRef = useRef<any>(null);
  const [error, setError] = useState<string>();
  const [ocrLoading, setOcrLoading] = useState(false);

  useEffect(() => {
    if (webcamRef.current) {
      webcamRef.current.onDataAvailable = (imageData: string) => {
        extractDataFromImage(imageData);
        setImage(imageData);
      };
    }
  }, [webcamRef.current]);

  const cameraLoading = (
    <div className={style.cameraLoading}>
      <Loading message="در حال بارگذاری دوربین" color="black" />
    </div>
  );

  function changeTheMediaSize(data) {
    setMediaSize(data);
  }

  const aspectRatio = useMemo(() => {
    if (mediaSize.width && mediaSize.height) {
      return `${(mediaSize.width / 220).toFixed(1)}/${(
        mediaSize.height / 220
      ).toFixed(1)}`;
    } else {
      return '8/5';
    }
  }, [mediaSize]);

  async function customRequest(options) {
    const imageData = await blobToBase64(options?.file);
    setImage(imageData);
    extractDataFromImage(imageData);
  }

  async function extractDataFromImage(imageData: string) {
    setError(undefined);
    setOcrLoading(true);
    const form = new FormData();
    form.append('file', dataURLtoFile(imageData, `image.jpeg`));
    try {
      const response = await configurableRequest(
        RequestInstance,
        requestConfig,
        router,
        form,
      );
      onChange(response as any);
    } catch (exception) {
      const exceptionMessage = exception.response?.data?.exceptionMessage;
      setImage(undefined);
      if (exceptionMessage === 'IMAGE_IS_NOT_SUITABLE') {
        setError('تصویر قابل پردازش نبود');
      } else if (exceptionMessage === 'ERROR_OCR_SERVICE') {
        setError('سرویس در دسترس نبود');
      } else {
        setError('خطا');
      }
    } finally {
      setOcrLoading(false);
    }
  }

  return (
    <div className={style.cardScannerContainer}>
      {description}
      <Upload customRequest={customRequest} className={style.uploadButton}>
        انتخاب تصویر از گالری
      </Upload>
      <div className={style.cameraContainer} style={{ aspectRatio }}>
        <CameraWrapper
          className={style.webCam}
          ref={webcamRef}
          mirrored={false}
          visible={!image}
          changeTheMediaSize={changeTheMediaSize}
          loading={cameraLoading}
        />
        {!ocrLoading && !image && (
          <div className={style.clipBox}>
            <div className={style.innerBox} />
          </div>
        )}
        {image && (
          <img
            id={layoutIds.IMAGE}
            ref={imageRef}
            src={image}
            className={style.imageBox}
            alt="captured"
          />
        )}
        {ocrLoading && (
          <div className={style.loadingBox}>
            <Loading3QuartersOutlined spin className={style.icon} />
            <span className={style.title}>در حال بارگذاری ...</span>
          </div>
        )}
      </div>
      <div className={style.actionBar}>
        <div
          className={[
            style.captureButton,
            ocrLoading ? style.disabledCaptureButton : '',
          ].join(' ')}
        >
          <span
            className={style.iconContainer}
            onClick={webcamRef?.current?.captureImage}
          >
            <CameraFilled />
          </span>
        </div>
      </div>
      <div className={style.noticeContainer}>
        {!error && ocrLoading && (
          <span className={style.message}>
            در حال پردازش تصویر، لطفا منتظر بمانید.
          </span>
        )}
        {error && (
          <span className={style.errorMessage}>
            {error}. برای ادامه فرآیند لطفا دوباره تلاش کنید
          </span>
        )}
      </div>
    </div>
  );
}

export default CardScanner;

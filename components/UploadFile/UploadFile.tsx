import { Button, Form, Modal, Upload } from 'antd';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import classes from 'classnames';
import {
  FileConfigInterface,
  SampleFile,
} from '../../interfaces/entity.interface';
import { FileInfoInterface } from '../../interfaces/uploadFiles';
import {
  injectDataIntoObject,
  injectIntoString,
} from '../../lib/configurableRequest';
import style from './UploadFile.scss';
import FilePreview from '../FilePreview/FilePreview';
import { StringUtils } from '../../lib/StringUtils';
import { NumberUtils } from '../../lib/NumberUtils';
import { TenantConfigContext } from '../TenantConfig/TenantConfig';

interface UploadFileProps {
  acceptFile?: string;
  multipleFile?: boolean;
  title?: string;
  error?: string;
  fileName?: string;
  data: Record<string, any>;
  maxSize?: number;
  onChange?: any;
  value?: any;
  config?: FileConfigInterface;
  sample?: SampleFile;
  disabled?: boolean;
  validationMessage?: string;
}

export function UploadFile({
  acceptFile,
  multipleFile,
  title,
  error,
  fileName,
  maxSize,
  data,
  onChange,
  value,
  config,
  sample,
  disabled,
  validationMessage,
}: UploadFileProps) {
  const [imageStatus, setImageStatus] = useState(false);
  const [imgUrl, setImgUrl] = useState('');
  const uploadRef = useRef<any>();
  const router = useRouter();
  const fileRef = useRef(value);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [sampleUrl, setSampleUrl] = useState('');
  const [imageErrorStatus, setImageErrorStatus] = useState(false);
  const [fileInfo, setFileInfo] = useState<FileInfoInterface>();

  const uploadLocked = useMemo(() => {
    return value?.state === 'APPROVED';
  }, [value]);

  const tenantConfig = useContext(TenantConfigContext);

  // TODO: enforce user to upload files had rejected before

  useEffect(() => {
    if (value?.fileId) {
      fileRef.current = value;
      onChange({});
    }
  }, [value]);

  function showModal(url) {
    setSampleUrl(url);
    setIsModalVisible(true);
  }

  function handleCancel() {
    setIsModalVisible(false);
  }

  function handleFileChange(info) {
    if (info?.file?.status === 'uploading') {
      setImageStatus(true);
      setImageErrorStatus(false);
    } else if (info?.file?.status === 'done') {
      setFileInfo({
        type: info?.file?.type,
        name: info?.file?.name,
      });
      onChange({
        submitState: 'NEW',
        documentType: fileName,
        documentToken: info?.file?.response[0].token,
        path: info?.file?.response[0].name,
      });
      getBase64File(info.file.originFileObj).then(url => setImgUrl(url));
      setImageStatus(false);
    } else if (info?.file?.status === 'error') {
      setImageErrorStatus(true);
    }
  }

  const { injectedHeaders, injectedUrl, method } = useMemo(
    () => ({
      injectedHeaders: injectDataIntoObject(
        config?.upload.header,
        router,
        data,
      ),
      injectedUrl: injectIntoString(
        tenantConfig.file + config?.upload.url,
        router,
        data,
      ),
      method: config?.upload.method,
    }),
    [config, router, data],
  );

  function selectUploadFileStyle() {
    if (fileRef.current) {
      if (fileRef.current?.state === 'REJECTED') {
        return style.rejectedBorder;
      } else if (fileRef.current?.state === 'APPROVED') {
        return style.approvedBorder;
      } else if (fileRef.current?.state === 'SUBMITTED') {
        return style.solidBorder;
      } else {
        return style.solidBorder;
      }
    } else if (imageErrorStatus) {
      return style.dashedErrorBorder;
    } else if (error) {
      return style.dashedErrorBorder;
    } else {
      return style.dashedBorder;
    }
  }

  function getValidationMessage() {
    if (imageErrorStatus) {
      return <span className={style.errorText}>{validationMessage}</span>;
    } else if (uploadLocked || fileRef.current?.state === 'APPROVED') {
      return <span className={style.approvedText}>تایید شده</span>;
    } else if (fileRef.current?.state === 'REJECTED') {
      return (
        <span className={style.errorText}>
          تصویر بارگذاری شده از سوی کارشناسان رد شده است،
        </span>
      );
    } else if (StringUtils.isItFilled(error)) {
      return <span className={style.errorText}>{error}</span>;
    } else {
      return '';
    }
  }

  function generateMultipleSample(multipleSample) {
    return (
      <div className={style.arraySampleWrapper}>
        مشاهده (
        {multipleSample?.map((item, index) => {
          return index === multipleSample.length - 1 ? (
            <span key={item.label} onClick={() => showModal(item.address)}>
              {item.label}
            </span>
          ) : (
            <span key={item.label} onClick={() => showModal(item.address)}>
              {item.label},{' '}
            </span>
          );
        })}
        )
      </div>
    );
  }

  function generateSample() {
    if (Array.isArray(sample)) {
      return generateMultipleSample(sample);
    } else {
      return (
        <div className={style.singleSample} onClick={() => showModal(sample)}>
          مشاهده نمونه
        </div>
      );
    }
  }

  function generateModal() {
    return (
      <Modal
        title="Basic Modal"
        visible={isModalVisible}
        onCancel={handleCancel}
        centered
        footer={null}
      >
        <img src={sampleUrl} alt="sample" />
        <Button className={style.modalFooter} onClick={handleCancel}>
          بستن
        </Button>
      </Modal>
    );
  }

  function checkFileIsValid(file: File): boolean {
    if (
      NumberUtils.isNumberAndGreaterThanZero(file.size) &&
      NumberUtils.isNumberAndGreaterThanZero(maxSize)
    ) {
      // @ts-ignore
      if (Math.floor(file.size / 1000) <= maxSize) {
        setImageErrorStatus(false);
        return true;
      }
    } else if (
      NumberUtils.isNumberAndGreaterThanZero(file.size) &&
      !NumberUtils.isNumberAndGreaterThanZero(maxSize)
    ) {
      setImageErrorStatus(false);
      return true;
    }
    setImageErrorStatus(true);
    return false;
  }

  return (
    <Form.Item className={style.uploadContainer} colon={false}>
      <div className={style.filePlaceHolder}>
        <span>{title}</span>
        {sample && <span>{generateSample()}</span>}
      </div>
      <Upload
        name="files"
        multiple={multipleFile}
        accept={acceptFile}
        listType="picture-card"
        className={classes('avatar-uploader', selectUploadFileStyle())}
        showUploadList={false}
        onChange={info => handleFileChange(info)}
        beforeUpload={checkFileIsValid}
        headers={injectedHeaders}
        method={method === 'POST' ? 'POST' : 'PUT'}
        action={injectedUrl}
        disabled={disabled || uploadLocked}
      >
        <div ref={uploadRef}>
          <FilePreview
            imageStatus={imageStatus}
            setImageStatus={setImageStatus}
            value={fileRef.current}
            fileId={fileRef.current?.fileId}
            config={config}
            data={data}
            imageUrl={imgUrl}
            fileInfo={fileInfo}
          />
        </div>
      </Upload>
      {getValidationMessage()}
      {generateModal()}
    </Form.Item>
  );
}

export function getBase64File(file): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      if (reader.result) {
        resolve(reader.result as string);
      } else {
        reject();
      }
    });
    if (!file) {
      reject();
    }
    reader.readAsDataURL(new Blob([file]));
  });
}

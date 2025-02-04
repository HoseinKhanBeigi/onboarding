import React, {useEffect, useMemo, useState} from 'react';
import {FormConfigInterface} from '../../../interfaces/stage.interface';
import {useFormGenerator} from '../../FormGenerator/useFormGenerator';
import style from './ObjectItem.scss';
import Button from '../../Button/Button';
import {OnboardingFieldGeneratorList} from '../../Register/Fields';
import {StringUtils} from '../../../lib/StringUtils';

interface ActionsProps {
  onClose: () => void;
  loading: boolean;
}

const Actions = ({ onClose, loading }: ActionsProps) => (
  <div className={style.buttonContainer}>
    <Button htmlType="submit" type="primary" loading={loading}>
      تایید
    </Button>
    <Button type="primary" onClick={onClose} loading={loading} ghost>
      انصراف
    </Button>
  </div>
);

interface ObjectItemProps {
  formConfig: FormConfigInterface;
  extraData?: Record<string, any>;
  onSubmit: (data: Record<string, any>) => Promise<void | string>;
  data?: Record<string, any>;
  onClose: () => void;
}

export function ObjectItem({
  formConfig,
  data,
  onClose,
  onSubmit,
  extraData,
}: ObjectItemProps) {
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<FormConfigInterface>();
  const [formData, setFormData] = useState();
  const [error, setError] = useState('');

  async function submit(submittedData: Record<string, any>) {
    setLoading(true);
    try {
      const submitError = await onSubmit(submittedData);
      if (StringUtils.isItFilled(submitError)) {
        setError(submitError as string);
      }
    } finally {
      setLoading(false);
    }
  }
  const { fieldMap, form } = useFormGenerator({
    config,
    onSubmit: submit,
    defaultData: formData,
    disabled: false,
    extraData,
    actions: <Actions onClose={onClose} loading={loading} />,
    isDev: false,
  });

  useEffect(() => {
    fieldMap.addList(OnboardingFieldGeneratorList);
    setConfig(formConfig);
  }, [false]);

  useEffect(() => setFormData(data), [config]);

  const renderedError = useMemo(() => {
    if (StringUtils.isItFilled(error)) {
      return <span className={style.error}>{error}</span>;
    }
    return '';
  }, [error]);

  return (
    <div className={style.container}>
      {form}
      {renderedError}
    </div>
  );
}

export default ObjectItem;

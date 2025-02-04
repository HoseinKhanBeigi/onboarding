import { Checkbox, Form, Input, InputNumber, Select } from 'antd';
import classes from 'classnames';
import React, { useMemo } from 'react';
import { InitialDataInterface } from '../../interfaces/entity.interface';
import style from './FormInput.scss';
import PersianDatePicker from '../DatePicker/DatePicker';
import { ObjectUtils } from '../../lib/ObjectUtils';

declare function isNaN(number: number): boolean;

function getSelectValue(items, value, mode) {
  if (mode === 'multiple') {
    if (items && value && value.length) {
      return value;
    }
    return [];
  } else {
    if (items && value !== '') {
      return [
        items?.find(item =>
          isNaN(item.id as number)
            ? item.id === value
            : Number(item.id) === Number(value),
        )?.label,
        value,
      ];
    }
    return undefined;
  }
}

export interface FormInputInterface {
  inputName?: string;
  title?: string;
  placeholder?: string;
  className?: string;
  onChange?: any;
  onBlur?: any;
  extractor: (data: any) => any;
  converter: (data: any) => any;
  type?:
    | 'input'
    | 'textarea'
    | 'number'
    | 'tel'
    | 'select'
    | 'checkbox'
    | 'date-picker';
  size?: string;
  min?: number;
  max?: number;
  disabled?: boolean;
  rows?: any;
  items?: Array<InitialDataInterface>;
  data?: Record<string, any>;
  onSelect?: any;
  mode?: any;
  defaultValue?: any;
  value?: any;
  error: unknown;
}

const { Option } = Select;

function FormInput({
  inputName,
  title,
  placeholder,
  onChange,
  onBlur,
  extractor,
  converter,
  className,
  type,
  disabled,
  rows,
  min,
  max,
  items,
  onSelect,
  mode,
  defaultValue,
  value,
  error,
}: FormInputInterface) {
  let component;
  if (type === 'input') {
    component = (
      <Input
        value={value}
        name={inputName}
        onChange={({ target: { value: val } }) =>
          onChange(converter(extractor(val)))
        }
        onBlur={onBlur}
        className={classes(style.input, className)}
        placeholder={placeholder}
        disabled={disabled}
      />
    );
  } else if (type === 'number') {
    component = (
      <InputNumber
        min={min}
        max={max}
        value={value}
        name={inputName}
        formatter={item => `$ ${item}`.replace(/^([0])|(\D)/g, '')}
        onChange={val => onChange(converter(val))}
        onBlur={onBlur}
        className={classes(style.inputNumber, className, style.input)}
        placeholder={placeholder}
        disabled={disabled}
      />
    );
  } else if (type === 'tel') {
    component = (
      <Input
        value={value}
        name={inputName}
        onChange={({ target: { value: val } }) =>
          onChange(converter(extractor(val.replace(/[^0-9\.]+/g, ''))))
        }
        onBlur={onBlur}
        className={classes(style.inputTel, className, style.input)}
        placeholder={placeholder}
        disabled={disabled}
      />
    );
  } else if (type === 'textarea') {
    component = (
      <Input.TextArea
        name={inputName}
        onChange={({ target: { value: val } }) =>
          onChange(converter(extractor(val)))
        }
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        className={classes(style.textarea, className, style.input)}
        value={value}
      />
    );
  } else if (type === 'select') {
    const children = useMemo(()=>{
      return items?.map(({ id, label }) => (
        <Option key={id} value={id}>
          {label}
        </Option>
      ));
    },[items]);
    let selectedValue = getSelectValue(items, value, mode);
    if (selectedValue === undefined) {
      selectedValue = [undefined, undefined];
    }
    if (items && items?.length > 0) {
      if (
        typeof selectedValue[0] === 'undefined' &&
        ObjectUtils.checkIfItsFilled(selectedValue[1])
      ) {
        onChange(null);
      }
    }
    component = (
      <Select
        className={classes(style.selectBox, className)}
        showSearch
        value={selectedValue}
        onChange={val => onChange(extractor(val))}
        onBlur={onBlur}
        onSelect={onSelect}
        mode={mode}
        optionFilterProp="children"
        defaultValue={defaultValue}
        placeholder={placeholder}
        disabled={disabled}
      >
        {children}
      </Select>
    );
  } else if (type === 'checkbox') {
    component = (
      <Checkbox
        className={style.checkbox}
        value={value}
        onChange={e => onChange(e?.target?.checked)}
        checked={value}
        name={inputName}
        disabled={disabled}
      >
        {placeholder}
      </Checkbox>
    );
  } else if (type === 'date-picker') {
    component = (
      <PersianDatePicker
        onChange={onChange}
        name={inputName}
        value={value}
        disabled={disabled}
        min={min}
        max={max}
      />
    );
  }

  const generateTitleStyle = () => {
    if (type === 'textarea') {
      return style.textAreaTitle;
    } else {
      return style.labelTitle;
    }
  };

  return (
    <Form.Item
      className={style.formItem}
      help={error as string}
      hasFeedback={!!value}
      validateStatus={error ? 'error' : 'success'}
      colon={false}
    >
      {title ? <span className={generateTitleStyle()}>{title}</span> : null}
      {component}
    </Form.Item>
  );
}

FormInput.defaultProps = {
  onChange: () => null,
  onBlur: () => null,
};

export default FormInput;

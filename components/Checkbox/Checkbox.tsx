import React, { useState } from 'react';
import { Form, Radio } from 'antd';
import classes from 'classnames';
import style from './Checkbox.scss';

export interface CheckboxInterface {
  data: any;
  title: any;
  placeholder: any;
  inputName: any;
}

const Checkbox = ({
  data,
  title,
  placeholder,
  inputName,
}: CheckboxInterface) => {
  const [value, setValue] = useState(data.values[inputName]);

  const options = [
    { label: 'بلی', value: true },
    { label: 'خیر', value: false },
  ];

  const onChange = e => {
    data.setFieldValue(inputName, value);
    setValue(e.target.value);
  };

  const { values, touched, errors } = data;
  return (
    <Form.Item
      help={errors[inputName] && touched[inputName] ? errors[inputName] : ''}
      hasFeedback={!!(values[inputName] && touched[inputName])}
      validateStatus={
        errors[inputName] && touched[inputName] ? 'error' : 'success'
      }
      label={<span>{title}</span>}
      colon={false}
    >
      <div className={classes(style.body, errors[inputName] && style.error)}>
        <span className={style.placeholder}>{placeholder}</span>
        <Radio.Group options={options} onChange={onChange} value={value} />
      </div>
    </Form.Item>
  );
};

export default Checkbox;

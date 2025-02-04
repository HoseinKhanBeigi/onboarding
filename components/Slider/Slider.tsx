import React, { useEffect, useMemo } from 'react';
import { Form, Slider } from 'antd';
import { SliderMarks } from 'antd/es/slider';
import { StepInterface } from '../../interfaces/entity.interface';
import { Utils } from '../../lib/utils';
import style from './Slider.scss';

interface WrappedSliderProps {
  title: string;
  steps: Array<StepInterface>;
  value: number;
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
  onChange?: any;
  disabled?: boolean;
  className?: string;
  data: Record<string, any>;
  id?: string;
  error: unknown;
}

export default function WrappedSlider(props: WrappedSliderProps) {
  const {
    steps,
    step,
    value,
    onChange,
    disabled,
    className,
    id,
    title,
    unit,
  } = props;
  const { min, max } = useMemo(
    () => ({
      min: props.min || steps[0].value,
      max: props.max || [...steps].pop()?.value,
    }),
    [props.max, props.min, steps],
  );

  useEffect(() => {
    if (Utils.checkIfItsFilled(value)) {
      const thereIsNoStepWithExactValue = !steps.find(
        item => item.value === value,
      );
      if (thereIsNoStepWithExactValue) {
        onChange(steps[0].value);
      }
    }
  }, [steps, value]);

  const marks: SliderMarks = {};
  steps.forEach((item, index) => {
    index === 0 || index === steps.length - 1
      ? (marks[item.value] = (
          <div className={style.currency}>
            <span>
              {item.label.match(/\d/g)}
              {item.label.match(/\D+/g)}
            </span>
          </div>
        ))
      : (marks[item.value] = (
          <div className={style.dNone}>
            {item.label.match(/\d/g)}${item.label.match(/\D+/g)}
          </div>
        ));
  });

  const sliderProps = {
    min,
    max,
    marks: (marks as any) as SliderMarks,
    value,
    step,
    onChange,
    disabled,
    className,
    id,
    reverse: true,
  };
  return (
    <Form.Item
      className={style.formItem}
      label={<span>{title}</span>}
      colon={false}
    >
      <div className={style.titleContainer}>
        <div className={style.title}>{title}</div>
        <div className={style.value}>
          {Utils.separateWithComma(value)}
          <span>{unit}</span>
        </div>
      </div>
      <div className={style.sliderContainer}>
        <Slider {...sliderProps} />
      </div>
    </Form.Item>
  );
}

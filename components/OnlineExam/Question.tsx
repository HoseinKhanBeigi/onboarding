import { Checkbox } from 'antd';
import React from 'react';
import style from './OnlineExam.scss';
import { QuestionInterface } from './OnlineExam';

interface QuestionProps extends QuestionInterface {
  index: number;
  value: number;
  onChange: any; // TODO: correct the callback
}
const Bold = value => {
  return <span style={{ fontWeight: 600 }}>{value}</span>;
};

export function Question({ id, body, options, questionNumber, index, onChange, value,answer }: QuestionProps) {
  const renderedOptions = options.map((option, idx) => (
    <Checkbox
      key={idx}
      value={option.optionNumber}
      checked={option.optionNumber === value}
      className={style.quizOption}
      onChange={e => onChange(e, questionNumber)}
    >
      {idx + 1 === answer ? Bold(option.body) : option.body}
    </Checkbox>
  ));

  return (
    <div key={id} className={style.questionWrapper}>
      <div className={style.title}>
        {index + 1}- {body}
      </div>
      <div className={style.optionsWrapper}>{renderedOptions}</div>
    </div>
  );
}
/* eslint-disable no-nested-ternary */
import React, { useMemo, useState } from 'react';
import style from '../schema.scss';

// eslint-disable-next-line import/prefer-default-export
export const paragraphWithThreeDots = (item, data, isLoading) => {
  if (item.values) {
    const resultArray = [];
    let replacementIndex = 0;
    const dotPattern = /\.{3,}/g;
    const valuess = [];
    const result = item.text.split(/(\.{3,})/);
    if (data) {
      const res = item?.names?.map(name => {
        if (Array.isArray(name)) {
          return `${data[name[0]]}-${data[name[1]]}`;
        }
        return data[name];
      });
      if (item.names) {
        res.map(el => valuess.push(el));
      }
    }

    for (const sentence of result) {
      if (dotPattern.test(sentence)) {
        resultArray.push(
          <span style={{ color: 'black' }}>
            &nbsp; {valuess[replacementIndex]}&nbsp;
          </span>,
        );
        replacementIndex++;

        const idx = resultArray.findIndex(
          e =>
            e === '' ||
            e === undefined ||
            (typeof e === 'object' && e?.props?.children[1] === ''),
        );
        if (idx !== -1) {
          resultArray[idx] = '....';
        }
      } else {
        resultArray.push(sentence);
      }
    }

    return resultArray.map(el => {
      return <span key={`idx${el}`}>{el}</span>;
    });
  }
};

export const useParagraphWithHandleQuestions = data => {
  if (data) {
    return data?.map(questionItem => (
      <>
        <div className={style.itemTitle}>{questionItem?.txt?.body}</div>
        <div>
          {questionItem?.txt?.options.map((anwser, idx) => {
            return (
              <div className={style.containerDot}>
                <div
                  className={
                    questionItem?.txt?.answer ===
                    questionItem?.txt.submittedAnswer
                      ? questionItem?.txt?.answer === idx + 1
                        ? style.GreenDot
                        : style.blackDot
                      : questionItem?.txt?.answer !==
                        questionItem?.txt.submittedAnswer
                      ? questionItem?.txt.submittedAnswer === idx + 1
                        ? style.RedDot
                        : questionItem?.txt?.answer === idx + 1
                        ? style.GreenDot
                        : style.blackDot
                      : style.blackDot
                  }
                >
                  {anwser.body}
                </div>
              </div>
            );
          })}
        </div>
      </>
    ));
  } else {
    return <></>;
  }
};

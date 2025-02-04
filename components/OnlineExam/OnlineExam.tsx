import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { Button } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { configurableRequest } from '../../lib/configurableRequest';
import { RequestInstance } from '../../store/request';
import { RootState } from '../../store/rootReducer';
import style from './OnlineExam.scss';
import { Utils } from '../../lib/utils';
import { BuiltInStageProps } from '../../interfaces/builtInStages.interface';
import { Question } from './Question';

export interface QuestionInterface {
  id: string;
  body: string;
  options: Array<OptionsInterface>;
  questionNumber: number;
  answer: number;
}

interface OptionsInterface {
  body: string;
  optionNumber: number;
}

interface AnswerInterface {
  answer: number;
  questionNumber: number;
}

const OnlineExam = ({ stage, actions: { submitForm } }: BuiltInStageProps) => {
  const [questions, setQuestions] = useState<Array<QuestionInterface>>();
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const applicationInfo = useSelector(
    ({ application }: RootState) =>
      application.data?.application?.applicationInfo,
  );

  function initializeAnswers(questions: Array<QuestionInterface>) {
    const initializedAnswers: Record<number, number> = {};
    questions.forEach(({ questionNumber }) => {
      initializedAnswers[questionNumber] = 0;
    });
    setAnswers(initializedAnswers);
  }

  function getQuestions() {
    configurableRequest<Record<string, any>>(
      RequestInstance,
      stage.extraConfig?.actions?.getQuestions,
      router,
      {
        ...applicationInfo,
      },
    )
      .then(response => {
        setQuestions(response?.questions);
        initializeAnswers(response?.questions);
      })
      .catch(err => err);
  }

  async function submitExam() {
    setLoading(true);
    try {
      const mappedAnswers = Object.keys(answers).map<AnswerInterface>(
        questionNumber => ({
          questionNumber: parseInt(questionNumber),
          answer: answers[questionNumber],
        }),
      );
      const params = {
        mappedData: {
          answers: mappedAnswers,
        },
      };
      await submitForm(params);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getQuestions();
  }, []);

  const optionsOnChange = (e, questionNumber) => {
    const option = e.target.value;
    if (e.target.checked) {
      setAnswers(prevState => ({ ...prevState, [questionNumber]: option }));
    }
  };

  const descriptions = useMemo(
    () => (
      <p className={style.description} data-cy="description">
        <img src="/static/images/rule-orange.svg" alt="rule" />
        {`ﺑﺮای ﻗﺒﻮﻟﯽ در آزﻣﻮن ﻟﺎزم اﺳﺖ ﺣﺪاﻗﻞ ﺑﻪ ${Utils.convertToPersianNumber(
          stage.extraConfig?.minScore,
        )} ﺳﻮال ﺑﺎﻟﺎ ﭘﺎﺳﺦ ﺻﺤﯿﺢ ﺑﺪﻫﯿﺪ.`}
      </p>
    ),
    [stage.extraConfig?.minScore],
  );

  const questionsGenerator = useMemo(
    () =>
      questions?.map((question, index) => {
        return (
          <Question
            index={index}
            body={question.body}
            answer={question.answer}
            id={question.id}
            options={question.options}
            questionNumber={question.questionNumber}
            key={question.id}
            onChange={optionsOnChange}
            value={answers[question.questionNumber]}
          />
        );
      }),
    [questions, answers],
  );

  return (
    <>
      <div className={style.Container}>
        {questionsGenerator}
        <Button
          type="primary"
          className={style.submitExamBtn}
          loading={loading}
          onClick={submitExam}
        >
          ثبت و ادامه <LeftOutlined />
        </Button>
      </div>
      <div className={style.descContainer}>{descriptions}</div>
    </>
  );
};

export default OnlineExam;

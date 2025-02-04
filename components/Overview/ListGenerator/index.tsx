import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { EditFilled, LoadingOutlined } from '@ant-design/icons';
import classes from 'classnames';

import style from './index.scss';
import { StepRouteInterface } from '../../../interfaces/step-route.Interface';
import { StageStatusEnum } from '../../../interfaces/stageStatus.enum';
import { JoinObjectsOfArray } from '../Overview/JoinObjectsOfArray';
import { ObjectUtils } from '../../../lib/ObjectUtils';

const GROUP_SUFFIX = {
  FINISH: ' (پر شده)',
  EMPTY: ' (خالی)',
  ERROR: ' (نیاز به اصلاح)',
  LOCKED: ' (غیرقابل ویرایش)',
  LOCKED_EMPTY: ' (غیرقابل ویرایش)',
};

const FILE_SUFFIX = {
  REJECTED: ' (رد شده)',
  APPROVED: ' (تایید شده)',
  SUBMITTED: '',
};

interface ProductDataInterface {
  label: string;
  name: string;
}

interface ListGeneratorProps {
  list: JoinObjectsOfArray;
  productData: Array<ProductDataInterface>;
  steps: Array<StepRouteInterface>;
}

export default function ListGenerator({
  list,
  productData,
  steps,
}: ListGeneratorProps) {
  // console.log(productData,"productData")
  const router = useRouter();
  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(true);
  setTimeout(() => setLoading(false), 2000);

  function handleChangeStep(StepNumber) {
    if (steps[StepNumber].status !== StageStatusEnum.LOCKED) {
      router.push(
        '/onboarding/[product]/[step]/[applicationId]',
        steps[StepNumber].path,
      );
    }
  }

  function generateFileSection(item) {
    if (!ObjectUtils.checkIfItsFilled(files[item.name])) {
      if (typeof item.value === 'function') {
        if (!files[item.name]?.loading && !files[item.name]?.error) {
          setFiles(prevState => ({
            ...prevState,
            [item.name]: { loading: true, error: false, data: null },
          }));
          item.value().then(
            fileData =>
              setFiles(prevState => ({
                ...prevState,
                [item.name]: { loading: false, error: false, data: fileData },
              })),
            () =>
              setFiles(prevState => ({
                ...prevState,
                [item.name]: { loading: false, error: true, data: null },
              })),
          );
        }
      } else {
        setFiles(prevState => ({
          ...prevState,
          [item.name]: { loading: false, error: false, data: item.value },
        }));
      }
    }
    return (
      <div
        key={item.name}
        className={classes(style.fileRow, style[item?.status?.toLowerCase()])}
        data-cy="row"
      >
        <p data-cy="title">
          {item.title}
          {FILE_SUFFIX[item.status]}
        </p>
        <div className={style.imageWrapper}>
          {loading && <LoadingOutlined style={{ color: 'black' }} />}
          <img
            hidden={loading}
            data-cy="value"
            src={files[item.name]?.data || '/static/images/avatar.png'}
            alt="avatar"
          />
        </div>
      </div>
    );
  }

  function generateListSection(item) {
    const renderedItems = item.value?.map(listItem => (
      <div className={style.listItemRow}>
        <p className={style.itemTitle}>{listItem.title}</p>
        <p className={style.itemDescription}>{listItem.description}</p>
      </div>
    ));
    return (
      <div key={item.value} className={style.listRowContainer}>
        <div className={style.halfCol}>
          <p data-cy="title" className={style.listTitle}>
            {item.title}
          </p>
        </div>
        <div className={style.halfCol}>{renderedItems}</div>
      </div>
    );
  }

  function generateTextSection(item) {
    if (item?.type === 'full-contact') {
      // eslint-disable-next-line no-restricted-syntax, guard-for-in
      for (const property in item) {
        return (
          <div key={item.value} className={style.row} data-cy="row">
            <p data-cy="title">{property}</p>
            <p data-cy="value">{item[property]}</p>
          </div>
        );
      }
    }
    return (
      <div key={item.value} className={style.row} data-cy="row">
        <p data-cy="title">{item.title}</p>
        <p data-cy="value">{item.value}</p>
      </div>
    );
  }

  function generateEntitySection(type, item) {
    if (type === 'file') {
      return generateFileSection(item);
    } else if (['stakeholder-list', 'object-list'].includes(type)) {
      return generateListSection(item);
    } else {
      return generateTextSection(item);
    }
  }

  function generateSection(group, groupIndex) {
    return (
      <>
        <div className={style.sectionFieldsContainer}>
          {group.map((item, i) => {
            const hasHr: boolean =
              group.length === i + 1 && list.length > groupIndex + 1;
            return (
              <React.Fragment key={item.name}>
                {generateEntitySection(item.type, item)}
                {hasHr && <div className={style.hr} data-cy="hr"></div>}
              </React.Fragment>
            );
          })}
        </div>
      </>
    );
  }

  function getGroupStatusSuffix(groupIndex: number) {
    return GROUP_SUFFIX[steps[groupIndex].status as string];
  }

  function isLocked(groupIndex: number) {
    return steps[groupIndex].status === 'LOCKED';
  }

  return (
    <>
      <div className={style.listGeneratorContainer}>
        {list.map((group, groupIndex) => {
          return (
            <div className={style.sectionFieldsContainer}>
              <div className={style.listGeneratorTitle}>
                <span>
                  {productData[groupIndex].label}
                  <span
                    className={
                      style[steps[groupIndex].status?.toLowerCase() as string]
                    }
                  >
                    {getGroupStatusSuffix(groupIndex)}
                  </span>
                </span>
                <div hidden={isLocked(groupIndex)} className={style.editBtn}>
                  <EditFilled className={style.editIcon} />
                  <span
                    className={style.editIconTitle}
                    onClick={() => handleChangeStep(groupIndex)}
                  >
                    ویرایش
                  </span>
                </div>
              </div>
              {generateSection(group.items, groupIndex)}
            </div>
          );
        })}
      </div>
    </>
  );
}

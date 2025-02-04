import React, { useMemo } from 'react';
import style from '../schema.scss';

const valueOfTable = (name, data, nestedItemValue) => {
  if (data) {
    if (nestedItemValue) {
      return name.map(item => <div>{item}</div>);
    }
    if (!Array.isArray(name) && name !== undefined) {
      if (name in data) {
        if (name === 'male' && data[name]) {
          return 'مرد';
        } else if (name === 'male' && !data[name]) {
          return 'زن';
        }
        return data[name];
      }
    } else if (Array.isArray(name) && name !== undefined) {
      return `${data[name[0]]}-${data[name[1]]}`;
    }
  }
};

const Table = ({ tableArray, data }: any) => {
  const cacheTable = useMemo(() => {
    return (
      <div className={style.table}>
        {tableArray?.map((row, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <div key={`idx${index}`} className={style.row}>
            {row.map((col, idx) => (
              // eslint-disable-next-line react/no-array-index-key
              <div key={`idx${idx}`} className={style.cell}>
                <span key={col}>
                  {col.urlTextTable ? col.urlshow : col.text} &nbsp;
                  <span style={{ color: 'black' }}>
                    {valueOfTable(col.name, data, col.nestedItemValue)}{' '}
                  </span>
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }, [tableArray, data]);
  return <>{cacheTable}</>;
};

export default Table;

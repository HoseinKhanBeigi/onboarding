import React, {useMemo} from 'react';
import DatePicker from 'react-datepicker2';
import moment from 'moment';
import momentJalaali from 'moment-jalaali';
import style from './DatePicker.scss';

interface PersianDatePickerInterface {
  value: number;
  onChange(date: number): void;
  name?: string;
  disabled?: boolean;
  min?: number;
  max?: number;
}

momentJalaali.loadPersian({ dialect: 'persian-modern' });

const PersianDatePicker = ({
  onChange,
  name,
  value,
  disabled,
  min,
  max,
}: PersianDatePickerInterface) => {
  const datePickerOnchange = date => {
    const newTimeStamp = new Date(moment(date).format('YYYY/M/D')).getTime();
    if (newTimeStamp.toString() !== 'NaN') {
      onChange(newTimeStamp);
    }
  };

  const handledValue = useMemo(() => {
    if (value) {
      if (min && min > 0 && max && max > 0) {
        return Math.max(min, Math.min(max, value));
      } else if (min && min > 0) {
        return Math.max(min, value);
      } else if (max && max > 0) {
        return Math.min(max, value);
      } else {
        return value;
      }
    }
  }, [value, min, max]);
  const handledMin = useMemo(() => {
    if (min && min > 0) {
      return momentJalaali(min);
    }
  }, [max]);
  const handledMax = useMemo(() => {
    if (max && max > 0) {
      return momentJalaali(max);
    }
  }, [max]);

  // TODO: use min and max to manage the date user picks and avoid picking wrong date
  return (
    <div className={style.datePickerContainer}>
      <DatePicker
        isGregorian={false}
        onChange={pickedValue => datePickerOnchange(pickedValue)}
        value={momentJalaali(handledValue)}
        timePicker={false}
        min={handledMin}
        max={handledMax}
      />
    </div>
  );
};

export default PersianDatePicker;

import React, { useMemo } from 'react';
import JDate from 'jalali-date';
import { AppointmentInterface } from '../../interfaces/appointment.interface';
import style from './Schedule.scss';
import classes from 'classnames';

export interface ScheduleProps {
  title?: string;
  value?: number;
  onChange?: any;
  scheduleItems?: Array<AppointmentInterface>;
  data: Record<string, any>;
  error: string;
  disabled: boolean;
  inputName: string;
}

interface DateListInterface {
  title: string;
  items: Array<{ from: string; to: string; hasCapacity: boolean; id: number }>;
}

export function Schedule({ title, onChange, value, data, scheduleItems, disabled, error, inputName }: ScheduleProps) {
  const handleSchedule = (id, capacity): void => {
    if (capacity && !disabled) {
      onChange(id);
    }
  };
  const initialData: Array<AppointmentInterface> = useMemo(() => {
    if (scheduleItems) {
      return scheduleItems;
    } else if (data.initialData) {
      return data.initialData.map(item => item as AppointmentInterface);
    }
    return [];
  }, [scheduleItems, data]);

  const items: Array<DateListInterface> = useMemo(() => {
    const mappedItems: Record<string, DateListInterface> = {};
    initialData.forEach(item => {
      const date = new JDate(new Date(item.fromTimeEpoch));
      if (mappedItems[date.getDate()]) {
        mappedItems[date.getDate()].items.push({
          id: item.id,
          from: new Date(item.fromTimeEpoch).toLocaleTimeString('en-us', { hour12: false, hour: 'numeric', timeZone: 'Iran' }),
          to: new Date(item.toTimeEpoch).toLocaleTimeString('en-us', { hour12: false, hour: 'numeric', timeZone: 'Iran' }),
          hasCapacity: item.capacity > 0
        });
      } else {
        mappedItems[date.getDate()] = {
          title: date.format('dddd DD MMMM'),
          items: [
            {
              id: item.id,
              from: new Date(item.fromTimeEpoch).toLocaleTimeString('en-us', { hour12: false, hour: 'numeric', timeZone: 'Iran' }),
              to: new Date(item.toTimeEpoch).toLocaleTimeString('en-us', { hour12: false, hour: 'numeric', timeZone: 'Iran' }),
              hasCapacity: item.capacity > 0
            }
          ]
        }
      }
    });
    return Object.keys(mappedItems).map(key => mappedItems[key]);
  }, [initialData]);

  return (
    <div className='ant-form-item'>
      <div className={classes('ant-form-item-control', error ? 'has-error' : 'has-success')}>
        <div className={style.tableTitle}>{title}</div>
        <table className={classes('schedule', inputName, style.table)}>
          <tbody>
            {items.map(date => (
              <tr key={date.title}>
                <td> {date.title} </td>
                {date.items.map(item => (
                  <td
                    role="presentation"
                    key={item.id}
                    data-key={item.id}
                    className={`${item.id === value ? style.selected : ''} ${item.hasCapacity ? '' : style.disableTd
                      }`}
                    onClick={(): void => handleSchedule(item.id, item.hasCapacity)}
                  >
                    <img src="/static/images/clock.svg" alt="clock" />
                    {item.from} الی {item.to}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {error && <div className='ant-form-explain'>{error}</div>}
      </div>
    </div>
  );
}

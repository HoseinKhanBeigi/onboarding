import React from 'react';
import {
  FieldDataInterface,
  resolveItems,
} from '../../../FormGenerator/FieldGenerator/FieldGenerator';
import { Schedule } from '../../../Schedule/Schedule';
import { AppointmentInterface } from '../../../../interfaces/appointment.interface';

export function generateSchedule({
  disabled,
  entityData,
  errorMessage,
  entity: {
    value,
    label,
    name,
    initialData: entityInitialData,
    itemsDependsOn,
  },
  realTimeFormValues,
}: FieldDataInterface) {
  const scheduleItems: Array<AppointmentInterface> = resolveItems(
    entityInitialData as any,
    realTimeFormValues,
    itemsDependsOn,
  );
  const props = {
    value: value as number,
    title: label,
    inputName: name,
    scheduleItems,
    error: errorMessage as string,
    data: entityData,
    disabled,
  };
  return <Schedule {...props} />;
}

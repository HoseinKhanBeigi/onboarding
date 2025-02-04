import { generateText } from './Text/TextFieldGenerator';
import { generateNumber } from './Number/NumberFieldGenerator';
import { generateTel } from './Tel/TelFieldGenerator';
import { generateTextarea } from './Textarea/TextareaFieldGenerator';
import { generateSelect } from './Select/SelectFieldGenerator';
import { generateSlider } from './Slider/SliderFieldGenerator';
import { generateFile } from './File/FileFieldGenerator';
import { generateSchedule } from './Schedule/ScheduleFieldGenerator';
import { generateCheckbox } from './Checkbox/CheckboxFieldGenerator';
import { generateLocation } from './Location/LocationFieldGenerator';
import { generateDatePicker } from './DatePicker/DatePickerFieldGenerator';
import { generateObjectList } from './ObjectList/ObjectListFieldGenerator';
import { generateNationalCardOcr } from './NationalCardOcr/NationalCardOcrFieldGenerator';
import { generateStakeholderList } from './StakeholderList/StakeholderListFieldGenerator';
import { generateFullContact } from './Contact/GeneratorContact';

export {
  generateText,
  generateTel,
  generateNumber,
  generateTextarea,
  generateSelect,
  generateSlider,
  generateFile,
  generateSchedule,
  generateCheckbox,
  generateLocation,
  generateDatePicker,
  generateObjectList,
  generateNationalCardOcr,
  generateFullContact,
};

export const OnboardingFieldGeneratorList = [
  {
    name: 'text',
    generator: generateText,
  },
  {
    name: 'number',
    generator: generateNumber,
  },
  {
    name: 'tel',
    generator: generateTel,
  },
  {
    name: 'text-area',
    generator: generateTextarea,
  },
  {
    name: 'select',
    generator: generateSelect,
  },
  {
    name: 'slider',
    generator: generateSlider,
  },
  {
    name: 'file',
    generator: generateFile,
  },
  {
    name: 'full-contact',
    generator: generateFullContact,
  },
  {
    name: 'schedule',
    generator: generateSchedule,
  },
  {
    name: 'checkbox',
    generator: generateCheckbox,
  },
  {
    name: 'locations',
    generator: generateLocation,
  },
  {
    name: 'date-picker',
    generator: generateDatePicker,
  },
  {
    name: 'object-list',
    generator: generateObjectList,
  },
  {
    name: 'stakeholder-list',
    generator: generateStakeholderList,
  },
  {
    name: 'national-card-ocr',
    generator: generateNationalCardOcr,
  },
];

export const ShivaFieldGeneratorList = [
  {
    name: 'short-text',
    generator: generateText,
  },
  {
    name: 'number',
    generator: generateNumber,
  },
  {
    name: 'tel',
    generator: generateTel,
  },

  {
    name: 'long-text',
    generator: generateTextarea,
  },
  {
    name: 'select',
    generator: generateSelect,
  },
  {
    name: 'file',
    generator: generateFile,
  },
  {
    name: 'checkbox',
    generator: generateCheckbox,
  },
  {
    name: 'date',
    generator: generateDatePicker,
  },
];

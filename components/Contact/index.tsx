/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { Spin, notification } from 'antd';
import style from './index.scss';
import { RootState } from '../../store/rootReducer';
import { abstractConfigurableRequest } from '../../lib/useConfigurableRequest';
import FormInput from '../FormInput';
import { DataSourceInterface } from '../../interfaces/entity.interface';
// import { StringUtils } from '../../lib/StringUtils';

interface FullContactValue {
  sejamCountry?: string;
  sejamProvince?: string;
  sejamCity?: string;
  sejamSection?: string;
}

interface FullContactProps {
  // eslint-disable-next-line react/require-default-props
  value?: FullContactValue | any;
  requestConfig: DataSourceInterface;
  errorMessage: any;
  // eslint-disable-next-line react/require-default-props
  onChange?: (value?: FullContactValue) => void;
  validation: any;
}

export function Contact({
  requestConfig,
  onChange,
  value,
  validation,
  errorMessage,
}: FullContactProps) {
  const [countryId, setContryId] = useState<any>(value?.sejamCountry);
  const [provinceId, setProvinceId] = useState<any>(value?.sejamProvince);
  const [cityId, setCityId] = useState<any>(value?.sejamCity);
  const [sectionId, setSectionId] = useState<any>(value?.sejamSection);
  const [countries, setCountries] = useState<any>();
  const [provinces, setProvinces] = useState<Array<any>>();
  const [cities, setCities] = useState<Array<any>>();
  const [sections, setSections] = useState<Array<any>>();
  const [loading, setLoading] = useState<any>(false);

  const isUniqIdValid = useMemo(() => {
    if (!countryId) {
      return false;
    } else if (!provinceId) {
      return false;
    } else if (!cityId) {
      return false;
    }
    return true;
  }, [countryId, provinceId, cityId]);

  useEffect(() => {
    if (onChange) {
      if (isUniqIdValid) {
        onChange({
          sejamCountry: countryId,
          sejamProvince: provinceId,
          sejamCity: cityId,
          sejamSection: sectionId,
        });
      }
    }
  }, [countryId, provinceId, cityId, sectionId]);

  const applicationInfo = useSelector(
    ({ application }: RootState) =>
      application.data?.application?.applicationInfo,
  );

  useEffect(() => {
    if (!value?.sejamCountry) {
      abstractConfigurableRequest({
        applicationInfo,
        requestConfig,
        name: 'countries',
        setLoading,
        setState: setCountries,
      });
    }
  }, []);

  useEffect(() => {
    if (value?.sejamCountry) {
      abstractConfigurableRequest({
        applicationInfo,
        requestConfig,
        name: 'countries',
        setLoading,
        setState: setCountries,
      });
    }
    if (value?.sejamProvince) {
      abstractConfigurableRequest({
        applicationInfo,
        requestConfig,
        name: 'provinces',
        setLoading,
        ids: { countryId: value.sejamCountry },
        setState: setProvinces,
      });
    }
    if (value?.sejamCity) {
      abstractConfigurableRequest({
        applicationInfo,
        requestConfig,
        ids: { countryId: value.sejamCountry, provinceId: value.sejamProvince },
        name: 'cities',
        setLoading,
        setState: setCities,
      });
    }
    if (value?.sejamSection) {
      abstractConfigurableRequest({
        applicationInfo,
        requestConfig,
        ids: {
          countryId: value.sejamCountry,
          provinceId: value.sejamProvince,
          cityId: value.sejamCity,
        },
        setLoading,
        name: 'sections',
        setState: setSections,
      });
    }
  }, []);

  const handleChangeCountries = (e: any) => {
    setContryId(e);
    setProvinceId(null);
    setCityId(null);
    setSectionId(null);
    setCities([]);
    setSections([]);
    abstractConfigurableRequest({
      applicationInfo,
      requestConfig,
      ids: { countryId: e },
      setLoading,
      name: 'provinces',
      setState: setProvinces,
    });
  };

  const handleChangeProvinces = (e: any) => {
    setProvinceId(e);
    setCityId(null);
    setSectionId(null);
    setSections([]);
    abstractConfigurableRequest({
      applicationInfo,
      requestConfig,
      ids: { countryId, provinceId: e },
      setLoading,
      name: 'cities',
      setState: setCities,
    });
  };

  const handleChangeCities = e => {
    setCityId(e);
    setSectionId(null);
    abstractConfigurableRequest({
      applicationInfo,
      requestConfig,
      ids: { countryId, provinceId, cityId: e },
      setLoading,
      name: 'sections',
      setState: setSections,
    });
  };

  const handleChangeSections = e => {
    setSectionId(e);
    abstractConfigurableRequest({
      applicationInfo,
      requestConfig,
      name: 'sections',
      setLoading,
      setState: setSections,
    });
  };

  const contriesItem = useMemo(() => {
    if (countries) {
      return countries?.map(({ id, name }) => ({
        id,
        label: name,
      }));
    } else {
      return [];
    }
  }, [countries]);

  const provinceItem = useMemo(() => {
    if (provinces) {
      return provinces?.map(({ id, name }) => ({
        id,
        label: name,
      }));
    } else {
      return [];
    }
  }, [provinces]);

  const citisItem = useMemo(() => {
    if (cities) {
      return cities?.map(({ id, name }) => ({
        id,
        label: name,
      }));
    } else {
      return [];
    }
  }, [cities]);

  const sectionItems = useMemo(() => {
    if (sections) {
      return sections?.map(({ id, name }) => ({
        id,
        label: name,
      }));
    } else {
      return [];
    }
  }, [sections]);

  return (
    <div>
      {loading && (
        <div className={style.spin}>
          <Spin />
        </div>
      )}
      <>
        <FormInput
          type="select"
          inputName="sejamCountry"
          items={contriesItem}
          value={countryId}
          title="کشور *"
          placeholder="test"
          error={!isUniqIdValid && !countryId && errorMessage}
          onChange={val => handleChangeCountries(val)}
          className={style.formItem}
          extractor={val => val}
          converter={val => val}
        />
        <FormInput
          type="select"
          value={provinceId}
          items={provinceItem}
          inputName="sejamProvince"
          title="استان *"
          placeholder="استان را انتخاب نمایید"
          error={!isUniqIdValid && !provinceId && errorMessage}
          onChange={handleChangeProvinces}
          className={style.formItem}
          extractor={val => val}
          converter={val => val}
        />
        <FormInput
          type="select"
          value={cityId}
          items={citisItem}
          inputName="sejamCity"
          title="شهر *"
          placeholder="شهر را انتخاب نمایید"
          error={!isUniqIdValid && !cityId && errorMessage}
          onChange={handleChangeCities}
          className={style.formItem}
          extractor={val => val}
          converter={val => val}
        />
        <FormInput
          type="select"
          value={sectionId}
          items={sectionItems}
          inputName="sejamSection"
          title="بخش"
          placeholder="بخش را انتخاب نمایید"
          error={false}
          onChange={handleChangeSections}
          className={style.formItem}
          extractor={val => val}
          converter={val => val}
        />
      </>
    </div>
  );
}

export default Contact;

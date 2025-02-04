import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { Button } from 'antd';
import classes from 'classnames';
import Link from 'next/link';
import style from './ApplicationList.scss';
import { RootState } from '../../store/rootReducer';
import {
  customGetApplications,
  getApplications,
  removeTheApplication,
} from '../../store/application/action';
import { ObjectUtils } from '../../lib/ObjectUtils';
import { isPending, isWon } from '../../xstate/guards';
import LogoutButton from '../ActionBar/LogoutButton/LogoutButton';
import { ActiveApplicationInterface } from '../../interfaces/activeApplication.interface';
import { StringUtils } from '../../lib/StringUtils';

interface MutatedActiveApplicationInterface extends ActiveApplicationInterface {
  isPending: boolean;
  isWon: boolean;
  isInProgress: boolean;
}

export default function ApplicationList() {
  const router = useRouter();
  const [
    applicationsInfo,
    needActivation,
  ] = useSelector(({ application: applicationStore }: RootState) => [
    applicationStore.data?.applications,
    applicationStore.data?.needActivation,
  ]);
  const { product } = router.query;
  const dispatch = useDispatch();
  const brand = useSelector(({ branding }: RootState) => branding.data);
  const applications = useMemo(() => {
    if (applicationsInfo && applicationsInfo.length > 0) {
      return applicationsInfo
        .map(item => ({
          ...item,
          isPending: isPending(item),
          isWon: isWon(item),
          isInProgress: !isWon(item) && !isPending(item),
        }))
        .sort(item => {
          if (item.isWon) {
            return 1;
          } else if (item.isPending) {
            return 0;
          } else {
            return -1;
          }
        });
    } else {
      return [];
    }
  }, [applicationsInfo]);

  const showAddOther = useMemo(() => {
    return (
      ObjectUtils.checkIfItsFilled(brand?.startFor) &&
      brand?.startFor?.length !== 0
    );
  }, [brand?.startFor]);

  useEffect(() => {
    dispatch(removeTheApplication());
    if (brand?.actions?.getApplications) {
      dispatch(
        customGetApplications(
          brand?.actions?.getApplications,
          {
            orgCode: brand?.orgCode,
            productGroup: brand?.productGroup || (product as string),
          },
          router,
        ),
      );
    } else {
      dispatch(getApplications(brand?.orgCode));
    }
  }, []);

  const startNewApplication = () => {
    dispatch(removeTheApplication());
    return router.push(
      '/onboarding/[product]/start',
      `/onboarding/${product}/start`,
    );
  };

  function applicationDetail(applicationInfo, id) {
    if (applicationInfo.isInProgress) {
      const stage = StringUtils.isItFilled(applicationInfo.currentStage)
        ? applicationInfo.currentStage
        : 'review';
      router.push(
        '/onboarding/[product]/[step]/[applicationId]',
        `/onboarding/${product}/${stage}/${id}`,
      );
    }
  }

  function checkApplicationBtn(applicationInfo) {
    if (applicationInfo.isWon) {
      return (
        <div className={classes(style.done, style.itemStatus)}>احراز شده</div>
      );
    } else if (applicationInfo.isPending) {
      return (
        <div className={classes(style.pending, style.itemStatus)}>
          در انتظار بررسی
        </div>
      );
    } else {
      return (
        <div className={classes(style.inProgress, style.itemStatus)}>
          در حال تکمیل
        </div>
      );
    }
  }

  const background = useMemo(() => {
    if (brand?.theme && brand?.theme.sidebar.background.image) {
      return brand?.theme.sidebar.background.image.desktop.url;
    } else if (
      brand?.name === 'demo-brokerage' ||
      brand?.name === 'demo-sejam' ||
      brand?.name === 'kbr-brokerage' ||
      brand?.name === 'kbr-sejam'
    ) {
      return '/static/images/startApplication.jpg';
    }
  }, [brand?.theme]);

  function generateNeedActivationItem(fullName) {
    return (
      <div className={classes(style.appWrapper)}>
        <div className={style.firstRow}>
          <div className={style.contentWrapper}>
            <span className={style.name}>{fullName}</span>
          </div>
          <div className={classes(style.inProgress, style.itemStatus)}>
            در انتظار فعالسازی
          </div>
        </div>
        <div className={style.thirdRow}>
          <Link
            href="/auth/[action]/[product]/activate"
            as={`/auth/onboarding/${product}/activate`}
          >
            <Button className={style.button} type="primary" ghost>
              <span>فعالسازی حساب</span>
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  function generateItem(item: MutatedActiveApplicationInterface, subItemList?) {
    return (
      <div
        key={item.applicationID}
        className={classes(style.appWrapper, item.isInProgress)}
      >
        <div className={style.firstRow}>
          <div className={style.contentWrapper}>
            <span className={style.name}>{item?.fullName}</span>
          </div>
          {checkApplicationBtn(item)}
        </div>
        {subItemList}
        {item.isInProgress && (
          <div className={style.thirdRow}>
            <Button
              className={style.button}
              type="primary"
              onClick={() => applicationDetail(item, item.applicationID)}
              ghost
            >
              <span>تکمیل اطلاعات</span>
            </Button>
          </div>
        )}
      </div>
    );
  }

  function generateIndividualItem(item: MutatedActiveApplicationInterface) {
    const stakeholders = item.relations
      .filter(relation => relation.relationType === 'BUSINESS_STAKEHOLDER')
      .map(relation =>
        applications.find(
          application => relation.relatedUserId === application.userId,
        ),
      )
      .filter(application => ObjectUtils.checkIfItsFilled(application))
      .map(application => (
        <span
          className={classes(
            style.stakeHolderItem,
            application?.isWon ? style.active : style.inProgress,
          )}
        >
          {application?.fullName}
        </span>
      ));
    if (stakeholders.length > 0) {
      return generateItem(
        item,
        <div className={style.secondRow}>{stakeholders}</div>,
      );
    }
    return generateItem(item);
  }

  function generateLegalItem(item: MutatedActiveApplicationInterface) {
    const stakeholders = item.relations
      .filter(relation => relation.relationType === 'STAKEHOLDER')
      .map(relation =>
        applications.find(
          application => relation.relatedUserId === application.userId,
        ),
      )
      .filter(application => ObjectUtils.checkIfItsFilled(application))
      .map(application => (
        <div
          className={classes(
            style.stakeHolderItem,
            application?.isWon ? style.active : style.inProgress,
          )}
        >
          <span>{application?.fullName}</span>
          {application?.isInProgress && (
            <a
              href={`/onboarding/stakeholder/review/${application?.applicationID}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              {`ادامه فرآیند >`}
            </a>
          )}
        </div>
      ));
    if (stakeholders.length > 0) {
      return generateItem(
        item,
        <div className={style.secondRow}>{stakeholders}</div>,
      );
    }
    return generateItem(item);
  }

  const renderApplicationList = useMemo(() => {
    if (needActivation) {
      const fullName =
        applications.find(item => item.startOnboardingFor === 'MYSELF')
          ?.fullName || 'کاربر گرامی';
      return generateNeedActivationItem(fullName);
    } else {
      return applications
        ?.filter(item => item.productGroup === brand?.productGroup)
        ?.map(item => {
          if (item.type === 'BUSINESS') {
            return generateLegalItem(item);
          } else if (item.type === 'PERSON') {
            return generateIndividualItem(item);
          } else {
            return generateItem(item);
          }
        });
    }
  }, [applicationsInfo]);

  const showStakeHolderGuide = useMemo(() => {
    const businessItems = applications?.filter(
      item =>
        item.productGroup === brand?.productGroup && item.type === 'BUSINESS',
    );
    return businessItems?.length > 0;
  }, [applications]);

  return (
    <div className={style.mainContainer}>
      <div className={style.sideLayout}>
        <div className={style.container}>
          <div className={style.content}>
            <h3>شرکت یا فرد مورد نظر را انتخاب کنید</h3>
            <div className={style.box}>
              <div className={style.itemListContainer}>
                {renderApplicationList}
              </div>
              {showStakeHolderGuide && (
                <div className={style.guide}>
                  <span className={style.active}>فعال</span>
                  <span className={style.inProgress}>در حال تکمیل</span>
                </div>
              )}
              {showAddOther && (
                <Button
                  type="primary"
                  onClick={startNewApplication}
                  className={style.submit}
                >
                  + افزودن
                </Button>
              )}
              <LogoutButton
                action="onboarding"
                className={style.logoutBtn}
                product={product as string}
              />
            </div>
          </div>
        </div>
        <div className={style.footer}>
          <img
            className={style.logo}
            src={brand?.logo}
            alt={`${brand?.label} Logo`}
          />
          <span>{brand?.description}</span>
          <span>پشتیبانی: {brand?.phone}</span>
        </div>
      </div>
      <div className={style.contentLayout}>
        <div className={style.backgroundImgWrapper}>
          <img src={background} alt="background" />
        </div>
      </div>
    </div>
  );
}

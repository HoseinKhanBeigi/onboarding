import React from 'react';
import { Button, Col, Row } from 'antd';
import { useSelector } from 'react-redux';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import style from './SideLayout.scss';
import { RootState } from '../../../store/rootReducer';
import { ReviewStages } from '../../ReviewStages/ReviewStages';
import { StepRouteInterface } from '../../../interfaces/step-route.Interface';

export interface SideLayoutInterface {
  toggle: (string) => void;
  currentStage: string;
  collapsed: boolean;
  steps: Array<StepRouteInterface>;
}

export default function SideLayout({
  collapsed,
  toggle,
  steps,
  currentStage,
}: SideLayoutInterface) {
  const brand = useSelector(({ branding }: RootState) => branding.data);
  return (
    <Row onClick={toggle} className="side-layout-side-container">
      <Col className={style.togglerBtn}>
        <div className="side-layout-btn-container">
          <Button onClick={toggle} className={style.collapsedBtn}>
            {collapsed ? (
              <ArrowLeftOutlined color="white" />
            ) : (
              <ArrowRightOutlined color="white" />
            )}
          </Button>
        </div>
      </Col>
      <div className={style.reviewStagesBox}>
        <ReviewStages steps={steps} currentStage={currentStage} />
      </div>
      <Col span={12} className={style.sideBarFooter}>
        <img
          className={style.logo}
          src={brand?.logo}
          alt={`${brand?.label} Logo`}
        />
        <span>{brand?.description}</span>
        <span>پشتیبانی: {brand?.phone}</span>
      </Col>
    </Row>
  );
}

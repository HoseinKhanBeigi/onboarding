import React from 'react';
import {ObjectUtils} from '../../lib/ObjectUtils';
import {getCommon} from '../../store/common/action';

type LinkItem = { title: string; id: string };
function linkGenerator(list: Array<LinkItem>) {
  return list.map(({ id, title }) => (
    <li>
      <a href={id}>{title}</a>
    </li>
  ));
}

interface LinksProps {
  sit: Array<LinkItem>;
  uat: Array<LinkItem>;
  mt: Array<LinkItem>;
  prod: Array<LinkItem>;
  saas: Array<LinkItem>;
}

export default function Links(props: LinksProps) {
  const sitLinks = linkGenerator(props.sit || []);
  const uatLinks = linkGenerator(props.uat || []);
  const mtLinks = linkGenerator(props.mt || []);
  const prodLinks = linkGenerator(props.prod || []);
  const saasLinks = linkGenerator(props.saas || []);
  return (
    <>
      <div>
        <h3>محیط سیت</h3>
        <ul>{sitLinks}</ul>
      </div>
      <div>
        <h3>محیط یو‌ای‌تی</h3>
        <ul>{uatLinks}</ul>
      </div>
      <div>
        <h3>محیط مالتی تننسی</h3>
        <ul>{mtLinks}</ul>
      </div>
      <div>
        <h3>محیط عملیاتی</h3>
        <ul>{prodLinks}</ul>
      </div>
      <div>
        <h3>محیط عملیاتی (ابری)</h3>
        <ul>{saasLinks}</ul>
      </div>
    </>
  );
}

Links.getInitialProps = async function({ store, query: { product }, req }) {
  const { common } = store.getState();
  const props: any = {};
  try {
    if (
      !common.error &&
      !common.loading &&
      !ObjectUtils.checkIfItsFilled(common.data)
    ) {
      const response = await getCommon()(store.dispatch);
      props.sit = response?.sitLinks;
      props.uat = response?.uatLinks;
      props.mt = response?.mtLinks;
      props.prod = response?.prodLinks;
      props.saas = response?.saasLinks;
    }
  } catch (e) {
    console.error(`${new Date().toISOString()} ERROR: /onboarding/links`);
    console.error(e);
  }
  return props;
};

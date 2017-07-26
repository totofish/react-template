import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { html } from 'react-libs';
import 'react-libs/dist/react-libs.css';
import '@/assets/sass/styles';
import Title from '@/components/Title';
import Progress from '@/components/Progress';

const { CenterBox } = html;

export default function Page({ store }) {
  return (
    <Provider store={store}>
      <div className="scene" style={{ width: '100%', height: '100%' }}>
        <figure className="scene__bg" />
        <Title text="Page" />
        <CenterBox>
          <div className="scene__circle scene__circle--black" />
          <div
            className="scene__icon"
            onClick={() => { location.replace('/base'); }}
            role="button"
            tabIndex="0"
          />
        </CenterBox>
        <Progress />
      </div>
    </Provider>
  );
}

Page.propTypes = {
  store: PropTypes.object.isRequired,  // eslint-disable-line react/forbid-prop-types
};

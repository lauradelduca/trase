import BaseMarkup from 'html/base.ejs';
import FeedbackMarkup from 'html/includes/_feedback.ejs';

import 'styles/profile-root.scss';

import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { Provider } from 'react-redux';
import TopNavBar from 'react-components/shared/nav/top-nav-bar.container';

import ProfileRoot from 'react-components/profile-root/profile-root.container';

export const mount = (root, store) => {
  root.innerHTML = BaseMarkup({
    feedback: FeedbackMarkup()
  });

  render(
    <Provider store={store}>
      <TopNavBar />
    </Provider>,
    document.getElementById('nav')
  );

  render(
    <Provider store={store}>
      <ProfileRoot />
    </Provider>,
    document.getElementById('page-react-root')
  );
};

export const unmount = () => {
  unmountComponentAtNode(document.getElementById('nav'));
  unmountComponentAtNode(document.getElementById('page-react-root'));
};

import './style.scss';
import 'bootstrap';
import * as yup from 'yup';
import onChange from 'on-change';
import i18next from 'i18next';
import render from './view.js';
import resources from './locales/index.js';

const validate = (url, addedFeeds) => {
  const schema = yup.string().required().notOneOf(addedFeeds).url()
    .nullable();
  return schema.validate(url, { abortEarly: false });
};

const app = () => {
  const i18nextInstance = i18next.createInstance();
  i18nextInstance
    .init({
      lng: 'ru',
      debug: true,
      resources,
    })
    .then(() => i18nextInstance);

  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('#url-input'),
    feedback: document.querySelector('.feedback'),
  };

  const state = {
    form: {
      processState: 'start',
      errorMessage: null,
    },
    content: {
      feeds: [],
    },
  };

  const watchedState = onChange(state, (path, currentValue, previousValue) => {
    render(
      watchedState,
      elements,
      path,
      currentValue,
      previousValue,
      i18nextInstance,
    );
  });

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(elements.form);
    const value = formData.get('url');
    validate(value, state.content.feeds)
      .then(() => {
        watchedState.form.processState = 'filled';
        watchedState.content.feeds.push(value);
        watchedState.form.errorMessage = null;
      })
      .catch((error) => {
        watchedState.form.errorMessage = error.message;
        watchedState.form.processState = 'validateError';
      });
  });
};

app();

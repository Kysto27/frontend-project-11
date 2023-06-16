import './style.scss';
import 'bootstrap';
import { object, string } from 'yup';
import onChange from 'on-change';
import isEmpty from 'lodash/isEmpty.js';

const validate = (form, fields, addedFeeds) => {
  const schema = object({
    url: string().notOneOf(addedFeeds).url().nullable(),
  });
  schema
    .validate(fields, { abortEarly: false })
    .then(() => {
      console.log('[ok]');
    })
    .catch((error) => {
      return error.inner;
    });
};

const render = (form, initialState) => {
  if (initialState.form.valid === false) {
    console.log('Форма невалидна');
  } else {
    console.log('Форма валидна');
  }
};

const app = () => {
  const addedFeeds = [];

  const form = document.querySelector('.rss-form');

  const initialState = {
    form: {
      valid: true,
      processState: 'filling',
      processError: null,
      errors: {},
    },
    fields: {
      url: '',
    },
  };

  const state = onChange(initialState, render(form, initialState));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const value = formData.get('url');
    console.log(value);
    state.fields.url = value;
    const errors = validate(state.form, state.fields, addedFeeds);
    state.form.errors = errors;
    state.form.valid = isEmpty(errors);
    console.log(errors);
    addedFeeds.push(value);
  });
};

app();

import './style.scss';
import 'bootstrap';
import * as yup from 'yup';
import onChange from 'on-change';

const validate = (url, addedFeeds) => {
  const schema = yup.string()
    .required()
    .notOneOf(addedFeeds)
    .url()
    .nullable();
  return schema.validate(url, { abortEarly: false });
};

const renderError = (errorMessage) => {
  let errorText = '';
  if (errorMessage === 'this must be a valid URL') {
    errorText = 'Ссылка должна быть валидным URL';
  } else if (
    errorMessage.includes('this must not be one of the following values')
  ) {
    errorText = 'RSS уже существует';
  }
  return errorText;
};

const render = (state, elements, path, currentValue, previousValue) => {
  const { form, input } = elements;
  if (state.form.valid === false) {
    input.classList.add('is-invalid');
    const p = document.createElement('p');
    p.textContent = renderError(state.form.errorMessage);
    p.classList.add(
      'feedback',
      'm-0',
      'position-absolute',
      'small',
      'text-success',
      'text-danger',
    );
    form.append(p);
  }
};

const app = () => {
  const addedFeeds = [];

  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('#url-input'),
  };

  const initialState = {
    form: {
      valid: true,
      processState: 'filling',
      processError: null,
      errorMessage: null,
    },
  };

  const watchedState = onChange(
    initialState,
    (path, currentValue, previousValue) => {
      render(watchedState, elements, path, currentValue, previousValue);
    },
  );

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(elements.form);
    const value = formData.get('url');
    validate(value, addedFeeds)
      .then(() => console.log('ok'))
      .catch((error) => {
        watchedState.form.errorMessage = error.message;
        // this must not be one of the following values
        // this must be a valid URL
        watchedState.form.valid = false;
      });
    addedFeeds.push(value);
  });
};

app();

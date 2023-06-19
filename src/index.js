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
  const { input, feedback } = elements;
  console.log(state.form.processState);
  switch (state.form.processState) {
    case 'filling': {
      input.value = '';
      input.focus();
      break;
    }
    case 'filled': {
      input.classList.remove('is-invalid');
      feedback.classList.remove('text-danger');
      feedback.classList.add('text-success');
      feedback.textContent = 'RSS успешно загружен';
      input.value = '';
      input.focus();
      break;
    }
    case 'validateError': {
      input.classList.add('is-invalid');
      feedback.textContent = renderError(state.form.errorMessage);
      feedback.classList.remove('text-success');
      feedback.classList.add('text-danger');
      break;
    }
    default:
      throw new Error(`Unknown state: ${state.form.processState}!`);
  }
};

const app = () => {
  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('#url-input'),
    feedback: document.querySelector('.feedback'),
  };

  const state = {
    form: {
      processState: 'filling',
      errorMessage: null,
    },
    content: {
      feeds: [],
    },
  };

  const watchedState = onChange(state, (path, currentValue, previousValue) => {
    render(watchedState, elements, path, currentValue, previousValue);
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

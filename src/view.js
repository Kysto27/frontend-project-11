const renderError = (errorMessage, i18next) => {
  let errorText = '';
  if (errorMessage === 'this must be a valid URL') {
    // errorText = 'Ссылка должна быть валидным URL';
    errorText = i18next.t('validation.url');
  } else if (
    errorMessage.includes('this must not be one of the following values')
  ) {
    errorText = i18next.t('validation.notUnique');
  }
  return errorText;
};

const render = (state, elements, path, currentValue, previousValue, i18next) => {
  const { input, feedback } = elements;
  switch (state.form.processState) {
    case 'start': {
      break;
    }
    case 'filled': {
      input.classList.remove('is-invalid');
      feedback.classList.remove('text-danger');
      feedback.classList.add('text-success');
      feedback.textContent = 'RSS успешно загружен';
      if (state.form.errorMessage === null) {
        input.value = '';
      }
      input.focus();
      break;
    }
    case 'validateError': {
      input.classList.add('is-invalid');
      feedback.textContent = renderError(state.form.errorMessage, i18next);
      feedback.classList.remove('text-success');
      feedback.classList.add('text-danger');
      break;
    }
    default:
      throw new Error(`Unknown state: ${state.form.processState}!`);
  }
};

export default render;

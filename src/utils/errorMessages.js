import axios from 'axios';

const DEFAULT_FALLBACK = 'Something went wrong. Please try again.';

function normalizeText(value) {
  return String(value || '').trim().toLowerCase();
}

function extractRawErrorMessage(error) {
  if (!error) return '';
  if (typeof error === 'string') return error;

  const responseData = error?.response?.data;

  if (Array.isArray(responseData?.detail) && responseData.detail.length > 0) {
    const first = responseData.detail[0];
    if (typeof first === 'string') return first;
    if (typeof first?.msg === 'string') return first.msg;
  }

  if (typeof responseData?.detail === 'string') return responseData.detail;
  if (typeof responseData?.message === 'string') return responseData.message;
  if (typeof responseData?.error === 'string') return responseData.error;
  if (typeof error?.message === 'string') return error.message;

  return '';
}

function getContextAwareMessage(fieldType) {
  if (fieldType === 'number') return 'Please enter a valid number';
  if (fieldType === 'email') return 'Please enter a valid email address';
  if (fieldType === 'select') return 'Please select an option';
  if (fieldType === 'required') return 'This field is required';
  return '';
}

function mapTechnicalToFriendly(rawMessage, fieldType) {
  const normalized = normalizeText(rawMessage);

  if (!normalized) {
    return getContextAwareMessage(fieldType) || DEFAULT_FALLBACK;
  }

  if (normalized.includes('state_id') && (normalized.includes('integer') || normalized.includes('invalid') || normalized.includes('valid'))) {
    return 'Please select a state';
  }

  if ((normalized.includes('lga_id') || /\blga\b/.test(normalized)) && (normalized.includes('integer') || normalized.includes('invalid') || normalized.includes('valid'))) {
    return 'Please select a local area';
  }

  if (normalized.includes('field required') || normalized.includes('field is required') || normalized.includes('required field')) {
    return 'This field is required';
  }

  if (normalized.includes('null value') || normalized.includes('none is not an allowed value') || normalized.includes('null value not allowed')) {
    return 'Please complete this field';
  }

  if (normalized.includes('valid integer') || normalized.includes('must be integer') || normalized.includes('type_error.integer') || normalized.includes('input should be a valid integer')) {
    return fieldType === 'select' ? 'Please select an option' : 'Please enter a valid number';
  }

  if (normalized.includes('valid number') || normalized.includes('valid float') || normalized.includes('type_error.float')) {
    return 'Please enter a valid number';
  }

  if (normalized.includes('email') && (normalized.includes('invalid') || normalized.includes('valid email') || normalized.includes('value is not a valid email'))) {
    return 'Please enter a valid email address';
  }

  if (normalized.includes('invalid choice') || normalized.includes('not a valid choice') || normalized.includes('invalid enum')) {
    return 'Please select an option';
  }

  if (normalized.includes('failed to fetch') || normalized.includes('network error') || normalized.includes('timeout')) {
    return 'We could not connect right now. Please try again.';
  }

  if (normalized.includes('unauthorized') || normalized.includes('forbidden') || normalized.includes('not authenticated')) {
    return 'You do not have permission to do this.';
  }

  if (normalized.includes('password') && normalized.includes('at least')) {
    return 'Please use a stronger password.';
  }

  return getContextAwareMessage(fieldType) || DEFAULT_FALLBACK;
}

export function getUserFriendlyError(error, options = {}) {
  const { fieldType, fallback = DEFAULT_FALLBACK } = options;
  const rawMessage = extractRawErrorMessage(error);
  const friendly = mapTechnicalToFriendly(rawMessage, fieldType);
  return friendly || fallback;
}

export function logTechnicalError(error, context = '') {
  if (context) {
    console.error(`[${context}]`, error);
    return;
  }
  console.error(error);
}

export function setupAxiosErrorHandling(instance = axios) {
  if (!instance || instance.__friendlyErrorsInstalled) return;

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      const friendlyMessage = getUserFriendlyError(error);
      logTechnicalError(error, 'API_ERROR');

      if (error?.response?.data && typeof error.response.data === 'object') {
        error.response.data.detail = friendlyMessage;
        error.response.data.message = friendlyMessage;
        error.response.data.error = friendlyMessage;
      }

      error.userMessage = friendlyMessage;
      return Promise.reject(error);
    }
  );

  instance.__friendlyErrorsInstalled = true;
}

import axios from 'axios';

const STORAGE_KEY = 'connexa_website_debug_mode';
const MAX_LOGS = 250;

const state = {
  enabled: localStorage.getItem(STORAGE_KEY) === 'true',
  logs: [],
  pricingInspectors: {},
  applicationInspectors: {},
  pricingLogicInspectors: {},
};

const subscribers = new Set();
let installed = false;

function classifyFlowTag(url, method) {
  const text = String(url || '').toLowerCase();
  const verb = String(method || 'GET').toUpperCase();

  if (text.includes('/apps/apply') || text.includes('/jobs/apps/apply')) {
    return 'JOB_APP';
  }

  if (
    text.includes('/jobs') &&
    verb === 'POST' &&
    !text.includes('price') &&
    !text.includes('pricing') &&
    !text.includes('/estimate')
  ) {
    return 'JOB_POST';
  }

  if (
    text.includes('price') ||
    text.includes('pricing') ||
    text.includes('/estimate')
  ) {
    return 'PRICING';
  }

  if (
    text.includes('wallet') ||
    text.includes('withdraw') ||
    text.includes('/payments/balance') ||
    text.includes('vault')
  ) {
    return 'WALLET';
  }

  if (
    text.includes('sign-up') ||
    text.includes('sign-in') ||
    text.includes('reset-password') ||
    text.includes('create-account') ||
    text.includes('/register')
  ) {
    return 'REGISTRATION';
  }

  return 'HTTP';
}

function parseBody(value) {
  if (value == null) return null;
  if (typeof value === 'object') return value;
  if (typeof value !== 'string') return null;
  try {
    return JSON.parse(value);
  } catch (err) {
    return null;
  }
}

function deriveNumeric(obj, keys) {
  if (!obj || typeof obj !== 'object') return null;
  for (const key of keys) {
    const value = obj[key];
    if (typeof value === 'number') return value;
    if (typeof value === 'string' && value.trim() !== '') {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) return parsed;
    }
  }
  return null;
}

function jobIdFromUrl(url) {
  const text = String(url || '');
  const details = text.match(/\/jobs\/details\/(\d+)/i);
  if (details?.[1]) return details[1];
  const apply = text.match(/\/apps\/apply\/(\d+)/i);
  if (apply?.[1]) return apply[1];
  const queryId = text.match(/(?:job_id|job_uuid)=([^&]+)/i);
  if (queryId?.[1]) return queryId[1];
  return 'latest';
}

function maybeCaptureInspectors({
  url,
  method,
  status,
  requestData,
  responseData,
  isError = false,
  errorMessage,
}) {
  if (!state.enabled) return;

  const normalizedUrl = String(url || '').toLowerCase();
  const key = jobIdFromUrl(url);
  const requestObj = parseBody(requestData);
  const responseObj = parseBody(responseData) || responseData;

  if (normalizedUrl.includes('/apps/apply') || normalizedUrl.includes('/jobs/apps/apply')) {
    state.applicationInspectors[String(key)] = {
      what_was_sent: requestObj || requestData || null,
      status: isError ? 'failed' : (status >= 200 && status < 300 ? 'success' : 'failed'),
      failure_reason: isError
        ? (errorMessage || 'Request failed')
        : (status >= 400 ? toStringSafe(responseObj) : null),
      method,
      endpoint: url,
      captured_at: new Date().toISOString(),
    };
  }

  if (
    normalizedUrl.includes('price') ||
    normalizedUrl.includes('pricing') ||
    normalizedUrl.includes('/estimate')
  ) {
    state.pricingLogicInspectors[String(key)] = {
      values_used: {
        request: requestObj || requestData || null,
        response: responseObj || null,
      },
      fallback_used: false,
      fallback_reason: null,
      endpoint: url,
      status,
      captured_at: new Date().toISOString(),
    };
  }

  if (normalizedUrl.includes('/jobs/details/')) {
    const dataRoot = responseObj?.data && typeof responseObj.data === 'object'
      ? responseObj.data
      : responseObj;

    const minPrice = deriveNumeric(dataRoot, ['min_available_price', 'minAvailablePrice', 'amount']);
    const maxPrice = deriveNumeric(dataRoot, ['max_available_price', 'maxAvailablePrice', 'amount']);
    const preferredPrice = deriveNumeric(dataRoot, ['preferred_price', 'preferredPrice']);

    state.pricingInspectors[String(key)] = {
      min_price: minPrice,
      max_price: maxPrice,
      preferred_price: preferredPrice,
      source: 'jobs/details response',
      endpoint: url,
      captured_at: new Date().toISOString(),
    };
  }

  emit();
}

function emit() {
  subscribers.forEach((fn) => {
    try {
      fn(getStateSnapshot());
    } catch (err) {
      // no-op
    }
  });
}

function toStringSafe(value) {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  try {
    return JSON.stringify(value);
  } catch (err) {
    return String(value);
  }
}

function limit(value, max = 1200) {
  const text = toStringSafe(value);
  return text.length > max ? `${text.slice(0, max)}...` : text;
}

function addLog(entry) {
  if (!state.enabled) return;
  state.logs.push({ at: new Date().toISOString(), ...entry });
  if (state.logs.length > MAX_LOGS) {
    state.logs.splice(0, state.logs.length - MAX_LOGS);
  }
  emit();
}

export function addManualLog({
  tag = 'HTTP',
  level = 'info',
  phase = 'manual',
  message,
  payload,
} = {}) {
  addLog({
    tag,
    level,
    phase,
    message: message || '',
    payload: payload != null ? limit(payload) : undefined,
  });
}

function applyAxiosInterceptors(instance) {
  if (!instance || instance.__debugHooksInstalled) return;

  instance.interceptors.request.use(
    (config) => {
      const method = (config.method || 'GET').toUpperCase();
      const url = `${config.baseURL || ''}${config.url || ''}`;
      addLog({
        level: 'info',
        tag: classifyFlowTag(url, method),
        phase: 'request',
        method,
        url,
        request: {
          params: config.params || null,
          data: limit(config.data),
        },
      });
      return config;
    },
    (error) => {
      addLog({
        level: 'error',
        tag: 'HTTP',
        phase: 'request_error',
        error: limit(error?.message || error),
      });
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response) => {
      const method = (response.config?.method || 'GET').toUpperCase();
      const url = `${response.config?.baseURL || ''}${response.config?.url || ''}`;
      addLog({
        level: 'info',
        tag: classifyFlowTag(url, method),
        phase: 'response',
        method,
        url,
        status: response.status,
        response: limit(response.data),
      });
      maybeCaptureInspectors({
        url: `${response.config?.baseURL || ''}${response.config?.url || ''}`,
        method: (response.config?.method || 'GET').toUpperCase(),
        status: response.status,
        requestData: response.config?.data,
        responseData: response.data,
      });
      return response;
    },
    (error) => {
      const method = (error.config?.method || 'GET').toUpperCase();
      const url = `${error.config?.baseURL || ''}${error.config?.url || ''}`;
      addLog({
        level: 'error',
        tag: classifyFlowTag(url, method),
        phase: 'response_error',
        method,
        url,
        status: error.response?.status,
        error: limit(error.response?.data || error.message || error),
      });
      maybeCaptureInspectors({
        url: `${error.config?.baseURL || ''}${error.config?.url || ''}`,
        method: (error.config?.method || 'GET').toUpperCase(),
        status: error.response?.status,
        requestData: error.config?.data,
        responseData: error.response?.data,
        isError: true,
        errorMessage: error.message,
      });
      return Promise.reject(error);
    }
  );

  instance.__debugHooksInstalled = true;
}

function patchAxiosCreate() {
  if (axios.__debugCreatePatched) return;
  const originalCreate = axios.create.bind(axios);
  axios.create = (...args) => {
    const created = originalCreate(...args);
    applyAxiosInterceptors(created);
    return created;
  };
  axios.__debugCreatePatched = true;
}

function patchFetch() {
  if (typeof window === 'undefined' || typeof window.fetch !== 'function') {
    return;
  }
  if (window.__debugFetchPatched) return;

  const originalFetch = window.fetch.bind(window);
  window.fetch = async (input, init = {}) => {
    const method = (init.method || 'GET').toUpperCase();
    const url = typeof input === 'string' ? input : input?.url;
    const flowTag = classifyFlowTag(url, method);

    addLog({
      level: 'info',
      tag: flowTag,
      phase: 'request',
      method,
      url,
      request: {
        body: limit(init.body),
      },
    });

    try {
      const response = await originalFetch(input, init);
      let bodyPreview = '';
      try {
        bodyPreview = await response.clone().text();
      } catch (err) {
        bodyPreview = '';
      }

      addLog({
        level: response.ok ? 'info' : 'error',
        tag: flowTag,
        phase: 'response',
        method,
        url,
        status: response.status,
        response: limit(bodyPreview),
      });
      maybeCaptureInspectors({
        url,
        method,
        status: response.status,
        requestData: init.body,
        responseData: parseBody(bodyPreview) || bodyPreview,
      });

      return response;
    } catch (error) {
      addLog({
        level: 'error',
        tag: flowTag,
        phase: 'response_error',
        method,
        url,
        error: limit(error?.message || error),
      });
      maybeCaptureInspectors({
        url,
        method,
        status: 0,
        requestData: init.body,
        responseData: null,
        isError: true,
        errorMessage: error?.message,
      });
      throw error;
    }
  };

  window.__debugFetchPatched = true;
}

function exposeWindowApi() {
  if (typeof window === 'undefined') return;

  window.__CONNEXA_WEB_DEBUG__ = {
    get enabled() {
      return state.enabled;
    },
    getLogs: () => [...state.logs],
    getJobPricingInspector: (id) => state.pricingInspectors[String(id)] || null,
    getJobApplicationInspector: (id) =>
      state.applicationInspectors[String(id)] || null,
    getPricingLogicInspector: (id) =>
      state.pricingLogicInspectors[String(id)] || null,
    clearLogs: () => clearLogs(),
    setDebugMode: (value) => setDebugMode(Boolean(value)),
    addManualLog: (entry) => addManualLog(entry),
  };
}

export function installDebugRuntime() {
  if (installed) return;
  installed = true;

  patchAxiosCreate();
  applyAxiosInterceptors(axios);
  patchFetch();
  exposeWindowApi();
}

export function setDebugMode(value) {
  state.enabled = Boolean(value);
  localStorage.setItem(STORAGE_KEY, String(state.enabled));
  emit();
}

export function toggleDebugMode() {
  setDebugMode(!state.enabled);
}

export function clearLogs() {
  state.logs = [];
  emit();
}

export function capturePricingInspector(jobId, payload) {
  if (!state.enabled) return;
  state.pricingInspectors[String(jobId)] = {
    captured_at: new Date().toISOString(),
    ...payload,
  };
  emit();
}

export function captureApplicationInspector(jobId, payload) {
  if (!state.enabled) return;
  state.applicationInspectors[String(jobId)] = {
    captured_at: new Date().toISOString(),
    ...payload,
  };
  emit();
}

export function capturePricingLogicInspector(jobId, payload) {
  if (!state.enabled) return;
  state.pricingLogicInspectors[String(jobId)] = {
    captured_at: new Date().toISOString(),
    ...payload,
  };
  emit();
}

export function getStateSnapshot() {
  return {
    enabled: state.enabled,
    logs: [...state.logs],
    pricingInspectors: { ...state.pricingInspectors },
    applicationInspectors: { ...state.applicationInspectors },
    pricingLogicInspectors: { ...state.pricingLogicInspectors },
  };
}

export function subscribeDebugState(listener) {
  if (typeof listener !== 'function') return () => {};
  subscribers.add(listener);
  listener(getStateSnapshot());
  return () => subscribers.delete(listener);
}

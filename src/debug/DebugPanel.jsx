import React, { useEffect, useMemo, useState } from 'react';
import {
  clearLogs,
  getStateSnapshot,
  setDebugMode,
  subscribeDebugState,
} from './debugRuntime';

function jsonView(value) {
  if (value == null) return 'No data';
  try {
    return JSON.stringify(value, null, 2);
  } catch (err) {
    return String(value);
  }
}

export default function DebugPanel() {
  const LOG_VIEW_KEY = 'connexa_website_debug_log_view';
  const EXPORT_PREFIX = 'connexa-website-debug-logs';
  const [open, setOpen] = useState(false);
  const [state, setState] = useState(getStateSnapshot());
  const [jobId, setJobId] = useState('');
  const [toast, setToast] = useState('');
  const [logView, setLogView] = useState(() => {
    try {
      const saved = window.localStorage.getItem(LOG_VIEW_KEY);
      return saved === 'manual' ? 'manual' : 'all';
    } catch (err) {
      return 'all';
    }
  });

  useEffect(() => subscribeDebugState(setState), []);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.altKey && event.shiftKey && event.key.toLowerCase() === 'd') {
        setOpen((value) => !value);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const inspector = useMemo(() => {
    const key = String(jobId || '').trim();
    if (!key) {
      return {
        pricing: null,
        application: null,
        logic: null,
      };
    }
    return {
      pricing: state.pricingInspectors[key] || null,
      application: state.applicationInspectors[key] || null,
      logic: state.pricingLogicInspectors[key] || null,
    };
  }, [jobId, state]);

  const filteredLogs = useMemo(() => {
    if (logView === 'manual') {
      return state.logs.filter((entry) => String(entry?.phase || '').startsWith('manual_'));
    }
    return state.logs;
  }, [logView, state.logs]);

  useEffect(() => {
    try {
      window.localStorage.setItem(LOG_VIEW_KEY, logView);
    } catch (err) {
      // Ignore storage write failures in private mode or restricted contexts.
    }
  }, [logView]);

  useEffect(() => {
    if (!toast) return undefined;
    const timeout = window.setTimeout(() => setToast(''), 2200);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const handleExportVisibleLogs = () => {
    const exportData = {
      exported_at: new Date().toISOString(),
      view: logView,
      visible_count: filteredLogs.length,
      total_count: state.logs.length,
      logs: filteredLogs,
    };
    const serialized = JSON.stringify(exportData, null, 2);

    try {
      const blob = new Blob([serialized], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `${EXPORT_PREFIX}-${Date.now()}.json`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
      setToast('Visible logs exported.');
    } catch (err) {
      try {
        window.navigator.clipboard.writeText(serialized);
        setToast('Visible logs copied to clipboard.');
      } catch (clipboardErr) {
        setToast('Unable to export logs in this browser context.');
      }
    }
  };

  if (!open) return null;

  return (
    <div style={styles.wrap}>
      <div style={styles.header}>
        <strong>Debug Panel</strong>
        <div style={styles.headerActions}>
          <button style={styles.btn} onClick={() => setDebugMode(!state.enabled)}>
            {state.enabled ? 'Debug ON' : 'Debug OFF'}
          </button>
          <button style={styles.btn} onClick={clearLogs}>Clear Logs</button>
          <button style={styles.btn} onClick={() => setOpen(false)}>Close</button>
        </div>
      </div>

      {toast ? <div style={styles.toast}>{toast}</div> : null}

      <div style={styles.section}>
        <label style={styles.label}>Job ID Inspector</label>
        <input
          style={styles.input}
          value={jobId}
          onChange={(event) => setJobId(event.target.value)}
          placeholder="Enter job ID"
        />
        <div style={styles.grid}>
          <div style={styles.card}>
            <div style={styles.cardTitle}>Job Pricing Inspector</div>
            <pre style={styles.pre}>{jsonView(inspector.pricing)}</pre>
          </div>
          <div style={styles.card}>
            <div style={styles.cardTitle}>Job Application Inspector</div>
            <pre style={styles.pre}>{jsonView(inspector.application)}</pre>
          </div>
          <div style={styles.card}>
            <div style={styles.cardTitle}>Pricing Logic Inspector</div>
            <pre style={styles.pre}>{jsonView(inspector.logic)}</pre>
          </div>
        </div>
      </div>

      <div style={styles.section}>
        <div style={styles.logsHeader}>
          <div style={styles.cardTitle}>Network Logs ({filteredLogs.length}/{state.logs.length})</div>
          <div style={styles.logsControls}>
            <button style={styles.filterBtn} onClick={handleExportVisibleLogs}>Export Visible Logs</button>
          <div style={styles.filterGroup}>
            <button
              style={logView === 'all' ? styles.filterBtnActive : styles.filterBtn}
              onClick={() => setLogView('all')}
            >
              All
            </button>
            <button
              style={logView === 'manual' ? styles.filterBtnActive : styles.filterBtn}
              onClick={() => setLogView('manual')}
            >
              Manual Only
            </button>
          </div>
          </div>
        </div>
        <div style={styles.logList}>
          {[...filteredLogs].reverse().map((entry, index) => (
            <div key={`${entry.at}-${index}`} style={styles.logItem}>
              <div style={styles.logMeta}>
                [{entry.tag || 'HTTP'}][{entry.level || 'info'}] {entry.phase || 'event'} {entry.method || ''} {entry.status || ''}
              </div>
              <div style={styles.logUrl}>{entry.url || ''}</div>
              {entry.message ? <div style={styles.logMessage}>{entry.message}</div> : null}
              {entry.payload !== undefined ? (
                <pre style={styles.logPayload}>{jsonView(entry.payload)}</pre>
              ) : null}
              {entry.error ? <div style={styles.logError}>{entry.error}</div> : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    position: 'fixed',
    right: 12,
    bottom: 12,
    width: 'min(92vw, 680px)',
    maxHeight: '85vh',
    overflow: 'auto',
    zIndex: 999999,
    borderRadius: 12,
    border: '1px solid #1f2937',
    background: '#0b1220',
    color: '#e5e7eb',
    boxShadow: '0 18px 50px rgba(0,0,0,0.45)',
    fontFamily: 'Menlo, Monaco, Consolas, monospace',
    fontSize: 12,
  },
  header: {
    position: 'sticky',
    top: 0,
    background: '#111827',
    display: 'flex',
    justifyContent: 'space-between',
    gap: 8,
    alignItems: 'center',
    padding: '10px 12px',
    borderBottom: '1px solid #1f2937',
  },
  headerActions: {
    display: 'flex',
    gap: 6,
  },
  toast: {
    margin: '8px 12px 0',
    border: '1px solid #1d4ed8',
    background: '#172554',
    color: '#dbeafe',
    borderRadius: 8,
    padding: '6px 10px',
    fontSize: 11,
  },
  btn: {
    border: '1px solid #334155',
    background: '#1f2937',
    color: '#e5e7eb',
    borderRadius: 8,
    padding: '6px 10px',
    cursor: 'pointer',
  },
  section: {
    padding: 12,
    borderBottom: '1px solid #111827',
  },
  label: {
    display: 'block',
    marginBottom: 6,
    color: '#93c5fd',
  },
  input: {
    width: '100%',
    boxSizing: 'border-box',
    borderRadius: 8,
    border: '1px solid #334155',
    background: '#0f172a',
    color: '#e5e7eb',
    padding: '8px 10px',
    marginBottom: 10,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: 8,
  },
  card: {
    border: '1px solid #233044',
    borderRadius: 8,
    background: '#0f172a',
    padding: 8,
  },
  cardTitle: {
    fontWeight: 700,
    marginBottom: 6,
    color: '#bfdbfe',
  },
  pre: {
    margin: 0,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    color: '#d1d5db',
  },
  logList: {
    display: 'grid',
    gap: 8,
  },
  logsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 8,
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  logsControls: {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  filterGroup: {
    display: 'flex',
    gap: 6,
  },
  filterBtn: {
    border: '1px solid #334155',
    background: '#0f172a',
    color: '#cbd5e1',
    borderRadius: 999,
    padding: '4px 10px',
    cursor: 'pointer',
    fontSize: 11,
  },
  filterBtnActive: {
    border: '1px solid #60a5fa',
    background: '#1e3a8a',
    color: '#eff6ff',
    borderRadius: 999,
    padding: '4px 10px',
    cursor: 'pointer',
    fontSize: 11,
  },
  logItem: {
    border: '1px solid #1f2937',
    background: '#0f172a',
    borderRadius: 8,
    padding: 8,
  },
  logMeta: {
    color: '#fbbf24',
    marginBottom: 4,
  },
  logUrl: {
    color: '#93c5fd',
    marginBottom: 4,
  },
  logMessage: {
    color: '#e5e7eb',
    marginBottom: 4,
  },
  logPayload: {
    margin: '4px 0',
    padding: '6px 8px',
    borderRadius: 6,
    border: '1px solid #233044',
    background: '#0b1323',
    color: '#cbd5e1',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  logError: {
    color: '#fca5a5',
  },
};

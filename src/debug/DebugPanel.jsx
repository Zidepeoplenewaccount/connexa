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
  const [open, setOpen] = useState(false);
  const [state, setState] = useState(getStateSnapshot());
  const [jobId, setJobId] = useState('');

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
        <div style={styles.cardTitle}>Network Logs ({state.logs.length})</div>
        <div style={styles.logList}>
          {[...state.logs].reverse().map((entry, index) => (
            <div key={`${entry.at}-${index}`} style={styles.logItem}>
              <div style={styles.logMeta}>
                [{entry.tag || 'HTTP'}][{entry.level || 'info'}] {entry.phase || 'event'} {entry.method || ''} {entry.status || ''}
              </div>
              <div style={styles.logUrl}>{entry.url || ''}</div>
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
  logError: {
    color: '#fca5a5',
  },
};

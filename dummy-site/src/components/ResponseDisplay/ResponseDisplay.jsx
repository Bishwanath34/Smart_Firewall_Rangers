import React from 'react';
import styles from './ResponseDisplay.module.css';

const ResponseDisplay = ({ loading, lastRequest }) => {
  return (
    <section className={styles.container}>
      <h2 className={styles.title}>Last Response</h2>

      {loading && (
        <p className={styles.loading}>Sending request…</p>
      )}

      {!loading && !lastRequest && (
        <p className={styles.empty}>
          No request yet. Click one of the buttons above to call the API via the firewall.
        </p>
      )}

      {!loading && lastRequest && (
        <div className={styles.response}>
          <div className={styles.responseRow}>
            <span className={styles.label}>Path:</span> {lastRequest.path}
          </div>
          <div className={styles.responseRow}>
            <span className={styles.label}>Status:</span> {lastRequest.status}
          </div>
          <div className={styles.responseRow}>
            <span className={styles.label}>Body:</span>
          </div>
          <pre className={styles.responseBody}>
            {JSON.stringify(lastRequest.data, null, 2)}
          </pre>
        </div>
      )}
    </section>
  );
};

export default ResponseDisplay;
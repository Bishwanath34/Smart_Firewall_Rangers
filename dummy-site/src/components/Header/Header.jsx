import React from 'react';
import styles from './Header.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Dummy Web App (Protected by AI–NGFW)</h1>
      <p className={styles.subtitle}>
        This is the user-side application. All requests go through the firewall gateway
        at <code>http://localhost:4000/fw/…</code>
      </p>
    </header>
  );
};

export default Header;
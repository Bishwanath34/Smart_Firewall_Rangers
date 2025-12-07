import React from 'react';
import styles from './UserSession.module.css';

const UserSession = ({ userId, setUserId, role, setRole }) => {
  return (
    <section className={styles.container}>
      <h2 className={styles.title}>User Session</h2>
      <p className={styles.description}>
        Pretend you are a user or an attacker. Choose an identity and role, then call
        different endpoints. The admin can watch everything on the security dashboard.
      </p>

      <div className={styles.controls}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>User ID</label>
          <input
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="alice, bob, attacker01…"
            className={styles.input}
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className={styles.select}
          >
            <option value="guest">guest</option>
            <option value="user">user</option>
            <option value="admin">admin</option>
          </select>
        </div>
      </div>
    </section>
  );
};

export default UserSession;
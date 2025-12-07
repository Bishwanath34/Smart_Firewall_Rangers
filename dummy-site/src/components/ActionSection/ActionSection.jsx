import React from 'react';
import Button from '../Button/Button';
import styles from './ActionSection.module.css';
import { API_PATHS, BUTTON_TYPES, ACTION_TYPES } from '../../utils/constants';

const ActionSection = ({ 
  type = ACTION_TYPES.NORMAL, 
  onActionClick, 
  loading 
}) => {
  const isSuspicious = type === ACTION_TYPES.SUSPICIOUS;
  
  const actions = isSuspicious
    ? [
        { path: API_PATHS.ADMIN_SECRET, label: 'GET /admin/secret', buttonType: BUTTON_TYPES.WARNING },
        { path: API_PATHS.HONEYPOT, label: 'GET /honeypot/db-export (Honeypot)', buttonType: BUTTON_TYPES.DANGER }
      ]
    : [
        { path: API_PATHS.INFO, label: 'GET /info', buttonType: BUTTON_TYPES.SAFE },
        { path: API_PATHS.PROFILE, label: 'GET /profile', buttonType: BUTTON_TYPES.PRIMARY }
      ];

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>
        {isSuspicious ? 'Suspicious / Attack Actions' : 'Normal Actions'}
      </h2>
      <p className={styles.description}>
        {isSuspicious
          ? 'These endpoints simulate attackers probing admin areas or honeypots. The firewall should either block them or flag them as high risk.'
          : 'These simulate normal user behavior. In most cases, the firewall should allow them if the role is appropriate.'}
      </p>

      <div className={styles.buttonGroup}>
        {actions.map((action) => (
          <Button
            key={action.path}
            onClick={() => onActionClick(action.path)}
            disabled={loading}
            type={action.buttonType}
          >
            {action.label}
          </Button>
        ))}
      </div>
    </section>
  );
};

export default ActionSection;
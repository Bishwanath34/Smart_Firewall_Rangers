import React from 'react';
import styles from './Button.module.css';

const Button = ({ 
  children, 
  onClick, 
  disabled, 
  type = 'primary',
  ...props 
}) => {
  const buttonClass = `${styles.button} ${styles[type]}`;
  
  return (
    <button
      className={buttonClass}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
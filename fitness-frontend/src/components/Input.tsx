import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input: React.FC<InputProps> = ({ label, ...props }) => (
  <div style={{ marginBottom: '1rem' }}>
    {label && <label style={{ display: 'block', marginBottom: 4 }}>{label}</label>}
    <input {...props} style={{ padding: '0.5rem', width: '100%' }} />
  </div>
);

export default Input;

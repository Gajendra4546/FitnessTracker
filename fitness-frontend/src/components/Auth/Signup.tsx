import { useState } from 'react';
import { signup } from '../../services/api';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleSubmit = async () => {
    await signup(form);
    alert('Signup successful. Please login.');
  };

  return (
    <div>
      <input onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" />
      <input onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" />
      <input type="password" onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Password" />
      <button onClick={handleSubmit}>Signup</button>
    </div>
  );
}

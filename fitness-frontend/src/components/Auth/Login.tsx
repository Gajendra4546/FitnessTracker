import { useState, useContext } from 'react';
import { login } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const { setToken } = useContext(AuthContext);

  const handleSubmit = async () => {
    const res = await login(form);
    setToken(res.data.token);
  };

  return (
    <div>
      <input onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" />
      <input type="password" onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Password" />
      <button onClick={handleSubmit}>Login</button>
    </div>
  );
}

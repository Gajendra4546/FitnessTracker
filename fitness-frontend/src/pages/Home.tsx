import { useState } from 'react';
import { logExercise } from '../services/api';

export default function Home() {
  const [exercise, setExercise] = useState({ name: '', duration: 0, intensity: '', date: '' });

  const handleLog = async () => {
    await logExercise({ ...exercise });
    alert('Exercise logged');
  };

  return (
    <div>
      <input placeholder="Date (YYYY-MM-DD)" onChange={(e) => setExercise({ ...exercise, date: e.target.value })} />
      <input placeholder="Name" onChange={(e) => setExercise({ ...exercise, name: e.target.value })} />
      <input placeholder="Duration" type="number" onChange={(e) => setExercise({ ...exercise, duration: +e.target.value })} />
      <input placeholder="Intensity" onChange={(e) => setExercise({ ...exercise, intensity: e.target.value })} />
      <button onClick={handleLog}>Log Exercise</button>
    </div>
  );
}
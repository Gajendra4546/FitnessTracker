import { useEffect, useState } from 'react';
import { getPlans, selectPlan } from '../services/api';

export default function Plans() {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    getPlans().then((res) => setPlans(res.data));
  }, []);

  const handleSelect = (id: string) => {
    selectPlan(id).then(() => alert('Plan selected'));
  };

  return (
    <div>
      {plans.map((plan: any) => (
        <div key={plan._id}>
          <h3>{plan.name}</h3>
          <p>{plan.level} - {plan.days} days</p>
          <button onClick={() => handleSelect(plan._id)}>Select Plan</button>
        </div>
      ))}
    </div>
  );
}

import { useEffect, useState } from 'react';
import { getPlans, selectPlan } from '../services/api';

export default function SelectPlan() {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    getPlans().then((res) => setPlans(res.data));
  }, []);

  const handleSelect = (id: string) => {
    selectPlan(id).then(() => alert('Plan selected'));
  };

  return (
    <div>
      <h2>Select a Plan</h2>
      {plans.map((plan: any) => (
        <div key={plan._id}>
          <h4>{plan.name}</h4>
          <p>{plan.level} - {plan.days} days</p>
          <button onClick={() => handleSelect(plan._id)}>Select</button>
        </div>
      ))}
    </div>
  );
}

import { useEffect, useState } from "react";
import {
  Calendar,
  Zap,
  CheckCircle,
  Clock,
  Target,
  Trophy,
  Star,
  User,
  X,
  Edit3,
} from "lucide-react";
import { getPlans, selectPlan, getSelectedPlans } from "../services/api";
import { useNavigate } from "react-router-dom";

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)",
    padding: "40px 20px",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
  header: {
    textAlign: "center" as const,
    marginBottom: "50px",
    color: "white",
  },
  title: {
    fontSize: "42px",
    fontWeight: "bold" as const,
    marginBottom: "12px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  subtitle: {
    fontSize: "18px",
    color: "#a0a0a0",
    margin: 0,
  },
  sectionsContainer: {
    maxWidth: "1400px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "40px",
    alignItems: "start",
  },
  section: {
    background: "rgba(255, 255, 255, 0.03)",
    backdropFilter: "blur(10px)",
    borderRadius: "20px",
    padding: "30px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
  },
  sectionTitle: {
    fontSize: "28px",
    fontWeight: "bold" as const,
    color: "white",
    marginBottom: "25px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  plansGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "25px",
  },
  planCard: {
    background: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(20px)",
    borderRadius: "16px",
    padding: "25px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    transition: "all 0.3s ease",
    position: "relative" as const,
    overflow: "hidden",
  },
  planCardBeginner: {
    background: "rgba(34, 197, 94, 0.1)",
    border: "1px solid rgba(34, 197, 94, 0.3)",
  },
  planCardIntermediate: {
    background: "rgba(251, 191, 36, 0.1)",
    border: "1px solid rgba(251, 191, 36, 0.3)",
  },
  planCardAdvanced: {
    background: "rgba(239, 68, 68, 0.1)",
    border: "1px solid rgba(239, 68, 68, 0.3)",
  },
  planHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "15px",
  },
  planName: {
    fontSize: "20px",
    fontWeight: "bold" as const,
    color: "white",
    margin: 0,
  },
  levelBadge: {
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "11px",
    fontWeight: "600" as const,
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
  beginnerBadge: {
    background: "rgba(34, 197, 94, 0.2)",
    color: "#22c55e",
    border: "1px solid rgba(34, 197, 94, 0.3)",
  },
  intermediateBadge: {
    background: "rgba(251, 191, 36, 0.2)",
    color: "#fbbf24",
    border: "1px solid rgba(251, 191, 36, 0.3)",
  },
  advancedBadge: {
    background: "rgba(239, 68, 68, 0.2)",
    color: "#ef4444",
    border: "1px solid rgba(239, 68, 68, 0.3)",
  },
  planStats: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "20px",
    color: "#b0b0b0",
    fontSize: "13px",
  },
  statItem: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  exercisesList: {
    marginBottom: "20px",
  },
  exercisesTitle: {
    fontSize: "14px",
    fontWeight: "600" as const,
    color: "white",
    marginBottom: "12px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  exerciseItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "8px 12px",
    background: "rgba(255, 255, 255, 0.05)",
    borderRadius: "8px",
    marginBottom: "6px",
    color: "#e0e0e0",
    fontSize: "13px",
  },
  exerciseInfo: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  exerciseName: {
    fontWeight: "500" as const,
  },
  exerciseDuration: {
    fontSize: "11px",
    color: "#a0a0a0",
    display: "flex",
    alignItems: "center",
    gap: "2px",
  },
  intensityDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
  },
  lowIntensity: {
    background: "#22c55e",
  },
  mediumIntensity: {
    background: "#fbbf24",
  },
  highIntensity: {
    background: "#ef4444",
  },
  selectButton: {
    width: "100%",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    padding: "12px 16px",
    fontSize: "14px",
    fontWeight: "600" as const,
    cursor: "pointer" as const,
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
  },
  selectButtonDisabled: {
    opacity: 0.6,
    cursor: "not-allowed" as const,
  },
  spinner: {
    width: "14px",
    height: "14px",
    border: "2px solid rgba(255, 255, 255, 0.3)",
    borderTop: "2px solid white",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  selectedPlansContainer: {
    position: "sticky" as const,
    top: "40px",
  },
  selectedPlanCard: {
    background: "rgba(255, 255, 255, 0.08)",
    backdropFilter: "blur(20px)",
    borderRadius: "16px",
    padding: "20px",
    border: "1px solid rgba(255, 255, 255, 0.15)",
    marginBottom: "15px",
    position: "relative" as const,
  },
  progressBar: {
    width: "100%",
    height: "6px",
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: "3px",
    marginBottom: "15px",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    background: "linear-gradient(90deg, #22c55e, #16a34a)",
    borderRadius: "3px",
    transition: "width 0.3s ease",
  },
  progressText: {
    fontSize: "12px",
    color: "#a0a0a0",
    marginBottom: "10px",
  },
  removeButton: {
    position: "absolute" as const,
    top: "15px",
    right: "15px",
    background: "rgba(239, 68, 68, 0.2)",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    borderRadius: "6px",
    padding: "4px",
    cursor: "pointer" as const,
    color: "#ef4444",
    transition: "all 0.2s ease",
  },
  emptyState: {
    textAlign: "center" as const,
    padding: "40px 20px",
    color: "#666",
  },
  emptyIcon: {
    marginBottom: "15px",
    opacity: 0.5,
  },
  emptyText: {
    fontSize: "16px",
    marginBottom: "8px",
  },
  emptySubtext: {
    fontSize: "14px",
    opacity: 0.7,
  },
};

export default function Plans() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [plans, setPlans] = useState([]);
  const [selectedPlans, setSelectedPlans] = useState<any>(null);
  const navigate = useNavigate();

  const [loadingSelectedPlans, setLoadingSelectedPlans] = useState(true);

  useEffect(() => {
  const fetchData = async () => {
    getPlans().then((res) => setPlans(res.data));
    getSelectedPlans().then((res) => {
      setSelectedPlans(res.data);
      setLoadingSelectedPlans(false);
    });
  };
  fetchData();
}, []);

  const selectedPlanIds = new Set(
    selectedPlans?.[0]?.selectedPlans?.map((p: any) => p.plan._id)
  );

  console.log("Selected Plans:", selectedPlans);

  const handleSelect = async (id: string) => {
    setLoadingPlan(id);
    try {
      await selectPlan(id);
      // Refresh selected plans after selection
      const updatedSelected = await getSelectedPlans();
      setSelectedPlans(updatedSelected.data);
      alert("Plan selected successfully!");
    } catch (error) {
      alert("Failed to select plan");
    }
    setLoadingPlan(null);
  };

  // const handleRemove = async (id: string) => {
  //   setRemovingPlan(id);
  //   try {
  //     await removePlan(id);
  //     setSelectedPlans(selectedPlans.filter((plan: any) => plan._id !== id));
  //     alert('Plan removed successfully!');
  //   } catch (error) {
  //     alert('Failed to remove plan');
  //   }
  //   setRemovingPlan(null);
  // };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "beginner":
        return <Star size={14} color="#22c55e" />;
      case "intermediate":
        return <Target size={14} color="#fbbf24" />;
      case "advanced":
        return <Trophy size={14} color="#ef4444" />;
      default:
        return <Star size={14} color="#22c55e" />;
    }
  };

  const getCardStyle = (level: string) => {
    switch (level) {
      case "beginner":
        return { ...styles.planCard, ...styles.planCardBeginner };
      case "intermediate":
        return { ...styles.planCard, ...styles.planCardIntermediate };
      case "advanced":
        return { ...styles.planCard, ...styles.planCardAdvanced };
      default:
        return styles.planCard;
    }
  };

  const getBadgeStyle = (level: string) => {
    switch (level) {
      case "beginner":
        return { ...styles.levelBadge, ...styles.beginnerBadge };
      case "intermediate":
        return { ...styles.levelBadge, ...styles.intermediateBadge };
      case "advanced":
        return { ...styles.levelBadge, ...styles.advancedBadge };
      default:
        return { ...styles.levelBadge, ...styles.beginnerBadge };
    }
  };

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case "low":
        return styles.lowIntensity;
      case "medium":
        return styles.mediumIntensity;
      case "high":
        return styles.highIntensity;
      default:
        return styles.lowIntensity;
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          .plan-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
          }
          
          .select-button:hover:not(:disabled) {
            background: linear-gradient(135deg, #5a67d8 0%, #667eea 100%);
            transform: scale(1.02);
          }
          
          .exercise-item:hover {
            background: rgba(255, 255, 255, 0.1);
          }
          
          .remove-button:hover {
            background: rgba(239, 68, 68, 0.3);
            transform: scale(1.1);
          }
          
          .selected-plan-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          }
          
          @media (max-width: 1024px) {
            .sections-container {
              grid-template-columns: 1fr !important;
              gap: 30px !important;
            }
          }
        `}
      </style>

      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Workout Dashboard</h1>
          <p style={styles.subtitle}>
            Manage your fitness journey with personalized workout plans
          </p>
        </div>

        <div style={styles.sectionsContainer} className="sections-container">
          {/* Available Plans Section */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>
              <Target size={24} />
              Available Plans
            </h2>
            <div style={styles.plansGrid}>
              {plans.map((plan: any) => (
                <div
                  key={plan._id}
                  style={getCardStyle(plan.level)}
                  className="plan-card"
                >
                  <div style={styles.planHeader}>
                    <h3 style={styles.planName}>{plan.name}</h3>
                    <div style={getBadgeStyle(plan.level)}>
                      {getLevelIcon(plan.level)}
                      {plan.level}
                    </div>
                  </div>

                  <div style={styles.planStats}>
                    <div style={styles.statItem}>
                      <Calendar size={14} />
                      <span>{plan?.days} days</span>
                    </div>
                    <div style={styles.statItem}>
                      <Zap size={14} />
                      <span>{plan?.exercises?.length} exercises</span>
                    </div>
                  </div>

                  <div style={styles.exercisesList}>
                    <div style={styles.exercisesTitle}>
                      <Target size={14} />
                      Exercises
                    </div>
                    {plan.exercises?.slice(0, 3).map((exercise: any) => (
                      <div
                        key={exercise._id}
                        style={styles.exerciseItem}
                        className="exercise-item"
                      >
                        <div style={styles.exerciseInfo}>
                          <div
                            style={{
                              ...styles.intensityDot,
                              ...getIntensityColor(exercise.intensity),
                            }}
                          ></div>
                          <span style={styles.exerciseName}>
                            {exercise.name}
                          </span>
                        </div>
                        <div style={styles.exerciseDuration}>
                          <Clock size={10} />
                          {exercise.duration}min
                        </div>
                      </div>
                    ))}
                    {plan?.length > 3 && (
                      <div
                        style={{
                          ...styles.exerciseDuration,
                          textAlign: "center",
                          marginTop: "8px",
                        }}
                      >
                        +{plan?.exercises?.length - 3} more exercises
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleSelect(plan._id)}
                    disabled={
                      loadingPlan === plan._id || selectedPlanIds.has(plan._id)
                    }
                    style={{
                      ...styles.selectButton,
                      ...(loadingPlan === plan._id ||
                      selectedPlanIds.has(plan._id)
                        ? styles.selectButtonDisabled
                        : {}),
                    }}
                    className="select-button"
                  >
                    {selectedPlanIds.has(plan._id) ? (
                      <>
                        <CheckCircle size={16} />
                        <span>Already Selected</span>
                      </>
                    ) : loadingPlan === plan._id ? (
                      <>
                        <div style={styles.spinner}></div>
                        <span>Selecting...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle size={16} />
                        <span>Select Plan</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Plans Section */}
          <div style={styles.selectedPlansContainer}>
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>
                <User size={24} />
                Your Plans (
                {loadingSelectedPlans
                  ? "Loading..."
                  : selectedPlans?.selectedPlans?.length || 0}
                )
              </h2>

              {loadingSelectedPlans ? (
                <div
                  style={{
                    color: "#fff",
                    textAlign: "center",
                    margin: "20px 0",
                  }}
                >
                  Loading your plans...
                </div>
              ) : selectedPlans[0]?.selectedPlans?.length === 0 ? (
                <div style={styles.emptyState}>
                  <div style={styles.emptyIcon}>
                    <Edit3 size={48} color="#666" />
                  </div>
                  <div style={styles.emptyText}>No plans selected</div>
                  <div style={styles.emptySubtext}>
                    Choose a plan from the available options
                  </div>
                </div>
              ) : (
                selectedPlans?.selectedPlans?.map((plan: any) => (
                  <div
                    key={plan.plan._id}
                    style={{ ...styles.selectedPlanCard, cursor: "pointer" }}
                    className="selected-plan-card"
                    onClick={() => navigate(`/plan/${plan.plan._id}`)}
                  >
                    <div style={styles.planHeader}>
                      <h3 style={{ ...styles.planName, fontSize: "18px" }}>
                        {plan.plan.name}
                      </h3>
                      <div style={getBadgeStyle(plan.plan.level)}>
                        {getLevelIcon(plan.plan.level)}
                        {plan.plan.level}
                      </div>
                    </div>

                    <div style={styles.planStats}>
                      <div style={styles.statItem}>
                        <Calendar size={12} />
                        <span>{plan.plan.days} days</span>
                      </div>
                      <div style={styles.statItem}>
                        <Zap size={12} />
                        <span>{plan.plan.exercises.length} exercises</span>
                      </div>
                    </div>

                    <div style={styles.exercisesList}>
                      {plan.plan.exercises.slice(0, 2).map((exercise: any) => (
                        <div key={exercise._id} style={styles.exerciseItem}>
                          <div style={styles.exerciseInfo}>
                            <div
                              style={{
                                ...styles.intensityDot,
                                ...getIntensityColor(exercise.intensity),
                              }}
                            ></div>
                            <span style={styles.exerciseName}>
                              {exercise.name}
                            </span>
                          </div>
                          <div style={styles.exerciseDuration}>
                            <Clock size={8} />
                            {exercise.duration}min
                          </div>
                        </div>
                      ))}
                      {plan.plan.exercises.length > 2 && (
                        <div
                          style={{
                            ...styles.exerciseDuration,
                            textAlign: "center",
                            fontSize: "10px",
                          }}
                        >
                          +{plan.plan.exercises.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

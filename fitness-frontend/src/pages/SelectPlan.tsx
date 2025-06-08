import { useEffect, useState } from "react";
import {
  Calendar,
  Zap,
  CheckCircle,
  Clock,
  Target,
  Trophy,
  Star,
  ArrowLeft,
  Check,
  Play,
  Pause,
  RotateCcw,
} from "lucide-react";
import { getPlan, logExercise, getUserDetails } from "../services/api";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs"; // Install with: npm install dayjs

function getCompletedExerciseIdsForToday(user: any, planId: string) {
  if (!user || !user.selectedPlans) return new Set<string>();
  const selected = user.selectedPlans.find(
    (p: any) => p.plan === planId || (p.plan && p.plan._id === planId)
  );
  if (!selected) return new Set<string>();
  const today = dayjs().format("YYYY-MM-DD");
  const logs = selected.progress.dailyLogs.filter((log: any) => log.date === today);
  return new Set<string>(logs.map((log: any) => log.exercise.id as string));
}


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
    marginBottom: "40px",
    color: "white",
  },
  backButton: {
    position: "absolute" as const,
    top: "40px",
    left: "40px",
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "12px",
    padding: "12px 16px",
    color: "white",
    cursor: "pointer" as const,
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    fontWeight: "500" as const,
    transition: "all 0.3s ease",
  },
  planInfo: {
    background: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(20px)",
    borderRadius: "20px",
    padding: "30px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    maxWidth: "800px",
    margin: "0 auto 40px auto",
  },
  planName: {
    fontSize: "32px",
    fontWeight: "bold" as const,
    marginBottom: "15px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  planStats: {
    display: "flex",
    alignItems: "center",
    gap: "30px",
    justifyContent: "center",
    color: "#b0b0b0",
    marginBottom: "20px",
  },
  statItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "16px",
  },
  progressBar: {
    width: "100%",
    height: "8px",
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: "4px",
    overflow: "hidden",
    marginBottom: "15px",
  },
  progressFill: {
    height: "100%",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    borderRadius: "4px",
    transition: "width 0.3s ease",
  },
  progressText: {
    textAlign: "center" as const,
    color: "#e0e0e0",
    fontSize: "14px",
  },
  exercisesContainer: {
    maxWidth: "900px",
    margin: "0 auto",
  },
  sectionTitle: {
    fontSize: "24px",
    fontWeight: "bold" as const,
    color: "white",
    marginBottom: "25px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  exerciseCard: {
    background: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(20px)",
    borderRadius: "16px",
    padding: "24px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    marginBottom: "16px",
    transition: "all 0.3s ease",
    position: "relative" as const,
  },
  exerciseCardCompleted: {
    background: "rgba(34, 197, 94, 0.1)",
    border: "1px solid rgba(34, 197, 94, 0.3)",
  },
  exerciseHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "16px",
  },
  exerciseInfo: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  checkbox: {
    width: "24px",
    height: "24px",
    borderRadius: "6px",
    border: "2px solid rgba(255, 255, 255, 0.3)",
    background: "transparent",
    cursor: "pointer" as const,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease",
  },
  checkboxChecked: {
    background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
    border: "2px solid #22c55e",
  },
  exerciseName: {
    fontSize: "20px",
    fontWeight: "600" as const,
    color: "white",
  },
  exerciseNameCompleted: {
    textDecoration: "line-through",
    opacity: 0.7,
  },
  exerciseDetails: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    color: "#b0b0b0",
  },
  intensityDot: {
    width: "10px",
    height: "10px",
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
  exerciseMeta: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
  },
  timer: {
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: "8px",
    padding: "8px 12px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "16px",
    fontWeight: "600" as const,
    color: "#667eea",
  },
  timerControls: {
    display: "flex",
    gap: "8px",
    marginLeft: "12px",
  },
  timerButton: {
    background: "rgba(102, 126, 234, 0.2)",
    border: "1px solid rgba(102, 126, 234, 0.3)",
    borderRadius: "6px",
    padding: "6px",
    color: "#667eea",
    cursor: "pointer" as const,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease",
  },
  completeButton: {
    width: "100%",
    background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
    color: "white",
    border: "none",
    borderRadius: "12px",
    padding: "15px 20px",
    fontSize: "16px",
    fontWeight: "600" as const,
    cursor: "pointer" as const,
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    marginTop: "30px",
  },
  completeButtonDisabled: {
    opacity: 0.6,
    cursor: "not-allowed" as const,
  },
  spinner: {
    width: "16px",
    height: "16px",
    border: "2px solid rgba(255, 255, 255, 0.3)",
    borderTop: "2px solid white",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
};
export default function ExerciseDetails() {
  const { id: planId } = useParams<{ id: string }>();
  console.log("Plan ID:", planId);
  const [plan, setPlan] = useState<any>(null);
  const [user, setUser] = useState<any>(null); // 2. Add user state
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(
    new Set()
  );
  const [timers, setTimers] = useState<{ [key: string]: number }>({});
  const [activeTimers, setActiveTimers] = useState<Set<string>>(new Set());
  const [isLogging, setIsLogging] = useState(false);

  const navigate = useNavigate();

  // When user or plan changes, update completedExercises
useEffect(() => {
  if (user && plan) {
    setCompletedExercises(getCompletedExerciseIdsForToday(user!, plan._id!));
  }
}, [user, plan]);

  // Fetch user details on mount
  useEffect(() => {
    getUserDetails()
      .then(res => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  useEffect(() => {
    if (planId) {
      console.log("Fetching plan with ID:", planId);
      getPlan(planId)
        .then((res) => setPlan(res.data))
        .catch(() => setPlan(null));
    }
  }, [planId]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prev) => {
        const newTimers = { ...prev };
        activeTimers.forEach((exerciseId) => {
          if (newTimers[exerciseId] > 0) {
            newTimers[exerciseId]--;
          } else {
            setActiveTimers((current) => {
              const newSet = new Set(current);
              newSet.delete(exerciseId);
              return newSet;
            });
          }
        });
        return newTimers;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeTimers]);

  const toggleExercise = async (exerciseId: string) => {
    setCompletedExercises((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(exerciseId)) {
        newSet.delete(exerciseId);
      } else {
        newSet.add(exerciseId);
        // Log exercise when checked
        logExercise({
          planId: plan._id,
          exerciseId,
          date: new Date().toISOString().split("T")[0],
        }).catch((err) => {
          alert("Failed to log exercise");
        });
      }
      return newSet;
    });
  };

  const startTimer = (exerciseId: string, duration: number) => {
    setTimers((prev) => ({ ...prev, [exerciseId]: duration * 60 }));
    setActiveTimers((prev) => new Set(prev).add(exerciseId));
  };

  const pauseTimer = (exerciseId: string) => {
    setActiveTimers((prev) => {
      const newSet = new Set(prev);
      newSet.delete(exerciseId);
      return newSet;
    });
  };

  const resetTimer = (exerciseId: string) => {
    setTimers((prev) => ({ ...prev, [exerciseId]: 0 }));
    setActiveTimers((prev) => {
      const newSet = new Set(prev);
      newSet.delete(exerciseId);
      return newSet;
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
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

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "beginner":
        return <Star size={20} color="#22c55e" />;
      case "intermediate":
        return <Target size={20} color="#fbbf24" />;
      case "advanced":
        return <Trophy size={20} color="#ef4444" />;
      default:
        return <Star size={20} color="#22c55e" />;
    }
  };

  const totalExercises = plan?.exercises?.length || 1;
  const completedCount = completedExercises.size;
  const progressPercentage = (completedCount / totalExercises) * 100;

  const logExercises = async () => {
    setIsLogging(true);

    // Prepare exercises data for API
    const exercisesDone = plan.exercises
      .filter((exercise: any) => completedExercises.has(exercise._id))
      .map((exercise: any) => ({
        name: exercise.name,
        duration: exercise.duration,
        intensity: exercise.intensity,
      }));

    const logData = {
      date: new Date().toISOString().split("T")[0], // Today's date in YYYY-MM-DD format
      exercisesDone,
    };

    try {
      // Replace with actual API call
      console.log("Logging exercises:", logData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      alert(`Successfully logged ${exercisesDone.length} exercises!`);
      setCompletedExercises(new Set()); // Reset completed exercises
    } catch (error) {
      alert("Error logging exercises. Please try again.");
    } finally {
      setIsLogging(false);
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
          
          .exercise-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          }
          
          .back-button:hover {
            background: rgba(255, 255, 255, 0.15);
            transform: translateX(-2px);
          }
          
          .checkbox:hover {
            border-color: rgba(255, 255, 255, 0.5);
            transform: scale(1.05);
          }
          
          .timer-button:hover {
            background: rgba(102, 126, 234, 0.3);
            transform: scale(1.05);
          }
          
          .complete-button:hover:not(:disabled) {
            background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
            transform: scale(1.02);
          }
        `}
      </style>

      <div style={styles.container}>
        <button
          style={styles.backButton}
          className="back-button"
          onClick={() => navigate(`/plans`)}
        >
          <ArrowLeft size={16} />
          Back to Plans
        </button>

        {!plan ? (
          <div
            style={{
              color: "#fff",
              textAlign: "center",
              marginTop: 100,
              fontSize: 20,
            }}
          >
            Loading plan details...
          </div>
        ) : (
          <>
            <div style={styles.header}>
              <div style={styles.planInfo}>
                <h1 style={styles.planName}>{plan.name}</h1>

                <div style={styles.planStats}>
                  <div style={styles.statItem}>
                    <Calendar size={18} />
                    <span>{plan.days} days</span>
                  </div>
                  <div style={styles.statItem}>
                    <Zap size={18} />
                    <span>{plan.exercises.length} exercises</span>
                  </div>
                  <div style={styles.statItem}>
                    {getLevelIcon(plan.level)}
                    <span style={{ textTransform: "capitalize" }}>
                      {plan.level}
                    </span>
                  </div>
                </div>

                <div style={styles.progressBar}>
                  <div
                    style={{
                      ...styles.progressFill,
                      width: `${progressPercentage}%`,
                    }}
                  ></div>
                </div>
                <div style={styles.progressText}>
                  {completedCount} of {totalExercises} exercises completed (
                  {Math.round(progressPercentage)}%)
                </div>
              </div>
            </div>

            <div style={styles.exercisesContainer}>
              <h2 style={styles.sectionTitle}>
                <Target size={24} />
                Exercises
              </h2>

              {plan.exercises.map((exercise: any) => {
                const isCompleted = completedExercises.has(exercise._id);
                const currentTimer = timers[exercise._id] || 0;
                const isTimerActive = activeTimers.has(exercise._id);

                return (
                  <div
                    key={exercise._id}
                    style={{
                      ...styles.exerciseCard,
                      ...(isCompleted ? styles.exerciseCardCompleted : {}),
                    }}
                    className="exercise-card"
                  >
                    <div style={styles.exerciseHeader}>
                      <div style={styles.exerciseInfo}>
                        <div
                          style={{
                            ...styles.checkbox,
                            ...(isCompleted ? styles.checkboxChecked : {}),
                          }}
                          className="checkbox"
                          onClick={() => toggleExercise(exercise._id)}
                        >
                          {isCompleted && <Check size={16} color="white" />}
                        </div>

                        <div>
                          <div
                            style={{
                              ...styles.exerciseName,
                              ...(isCompleted
                                ? styles.exerciseNameCompleted
                                : {}),
                            }}
                          >
                            {exercise.name}
                          </div>

                          <div style={styles.exerciseDetails}>
                            <div style={styles.exerciseMeta}>
                              <div
                                style={{
                                  ...styles.intensityDot,
                                  ...getIntensityColor(exercise.intensity),
                                }}
                              ></div>
                              <span style={{ textTransform: "capitalize" }}>
                                {exercise.intensity} intensity
                              </span>
                            </div>

                            <div style={styles.exerciseMeta}>
                              <Clock size={14} />
                              <span>{exercise.duration} min</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center" }}>
                        {currentTimer > 0 && (
                          <div style={styles.timer}>
                            <Clock size={16} />
                            {formatTime(currentTimer)}
                          </div>
                        )}

                        <div style={styles.timerControls}>
                          {!isTimerActive ? (
                            <button
                              style={styles.timerButton}
                              className="timer-button"
                              onClick={() =>
                                startTimer(exercise._id, exercise.duration)
                              }
                              title="Start timer"
                            >
                              <Play size={14} />
                            </button>
                          ) : (
                            <button
                              style={styles.timerButton}
                              className="timer-button"
                              onClick={() => pauseTimer(exercise._id)}
                              title="Pause timer"
                            >
                              <Pause size={14} />
                            </button>
                          )}

                          <button
                            style={styles.timerButton}
                            className="timer-button"
                            onClick={() => resetTimer(exercise._id)}
                            title="Reset timer"
                          >
                            <RotateCcw size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

            </div>
          </>
        )}
      </div>
    </>
  );
}

import { useCallback, useEffect, useMemo, useState } from 'react';
import { GameMode, User } from '../App';
import { supabase } from '../lib/supabase';

interface GamePageProps {
  mode: GameMode;
  user: User;
  onComplete: (score: number, mode: GameMode) => void;
  onBack: () => void;
}

type Difficulty = 'easy' | 'medium' | 'hard';

interface RawQuestion {
  question: string;
  correct_answer: string;
  options: string[];
  difficulty: Difficulty;
}

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: Difficulty;
  points: number;
}

type AbilityKey = 'fifty' | 'freeze' | 'dangerous' | 'skip';

const abilityCost = 500;

const difficultyPoints: Record<Difficulty, number> = {
  easy: 100,
  medium: 200,
  hard: 300,
};

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const prepareQuestions = (data: RawQuestion[]): Question[] =>
  data.map((item, idx) => {
    const options = shuffleArray(item.options);
    const correctIndex = options.indexOf(item.correct_answer);
    return {
      id: idx,
      question: item.question,
      options,
      correctAnswer: correctIndex === -1 ? 0 : correctIndex,
      difficulty: item.difficulty,
      points: difficultyPoints[item.difficulty],
    };
  });

const difficultyColors: Record<Difficulty, string> = {
  easy: '#22c55e',
  medium: '#eab308',
  hard: '#ef4444',
};

export function GamePage({ mode, user, onComplete, onBack }: GamePageProps) {
  const [questionBank, setQuestionBank] = useState<Question[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isTimerFrozen, setIsTimerFrozen] = useState(false);
  const [disabledOptions, setDisabledOptions] = useState<number[]>([]);
  const [abilityCharges, setAbilityCharges] = useState({
    fifty: 1,
    freeze: 1,
    dangerous: 1,
    skip: 1,
  });
  const [dangerousActive, setDangerousActive] = useState(false);
  const [lives, setLives] = useState(mode === 'endless' ? 3 : 0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [hasFinished, setHasFinished] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [leaderboardPosition, setLeaderboardPosition] = useState<number | null>(null);
  const [finalScore, setFinalScore] = useState(0);
  
  const [showCountdown, setShowCountdown] = useState(true);
  const [countdownValue, setCountdownValue] = useState<number | 'GO'>(3);
  const [countdownAudio] = useState(() => new Audio('/music/countdown.mp3'));
  
  const [quizVisible, setQuizVisible] = useState(false);

  const modeBestScore = useMemo(() => {
    switch (mode) {
      case 'quick': return user.bestScoreQuick || 0;
      case 'standard': return user.bestScoreStandard || 0;
      case 'endless': return user.bestScoreEndless || 0;
      default: return 0;
    }
  }, [mode, user]);

  const isNewBestScore = finalScore > modeBestScore;

  useEffect(() => {
    const load = async () => {
      setLoadingQuestions(true);
      setLoadError('');
      try {
        const response = await fetch('/questions_with_difficulty.json');
        const data = (await response.json()) as RawQuestion[];
        setQuestionBank(prepareQuestions(data));
      } catch {
        setLoadError('Failed to load questions. Please try again.');
      } finally {
        setLoadingQuestions(false);
      }
    };
    load();
  }, []);

  // Countdown effect
  useEffect(() => {
    if (!showCountdown || loadingQuestions) return;
    
    countdownAudio.currentTime = 0;
    countdownAudio.volume = 0.7;
    countdownAudio.play().catch(() => {});
    
    const timings = [
      { delay: 0, value: 3 },
      { delay: 1000, value: 2 },
      { delay: 2000, value: 1 },
      { delay: 3000, value: 'GO' as const },
      { delay: 4000, value: null },
    ];
    
    const timeouts = timings.map(({ delay, value }) =>
      setTimeout(() => {
        if (value === null) {
          setShowCountdown(false);
          setTimeout(() => setQuizVisible(true), 50);
        } else {
          setCountdownValue(value);
        }
      }, delay)
    );
    
    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [showCountdown, loadingQuestions, countdownAudio]);

  useEffect(() => {
    if (!questionBank.length) return;
    
    let selectedQuestions: Question[] = [];
    
    if (mode === 'quick') {
      const easy = shuffleArray(questionBank.filter(q => q.difficulty === 'easy')).slice(0, 3);
      const medium = shuffleArray(questionBank.filter(q => q.difficulty === 'medium')).slice(0, 4);
      const hard = shuffleArray(questionBank.filter(q => q.difficulty === 'hard')).slice(0, 3);
      selectedQuestions = [...easy, ...medium, ...hard];
    } else if (mode === 'standard') {
      const easy = shuffleArray(questionBank.filter(q => q.difficulty === 'easy')).slice(0, 10);
      const medium = shuffleArray(questionBank.filter(q => q.difficulty === 'medium')).slice(0, 10);
      const hard = shuffleArray(questionBank.filter(q => q.difficulty === 'hard')).slice(0, 10);
      selectedQuestions = [...easy, ...medium, ...hard];
    } else {
      selectedQuestions = shuffleArray(questionBank);
    }
    
    setQuestions(selectedQuestions);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setTimeLeft(30);
    setIsTimerFrozen(false);
    setDisabledOptions([]);
    setAbilityCharges({
      fifty: 1,
      freeze: 1,
      dangerous: 1,
      skip: 1,
    });
    setDangerousActive(false);
    setLives(mode === 'endless' ? 3 : 0);
    setAnsweredCount(0);
    setHasFinished(false);
  }, [mode, questionBank]);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = useMemo(
    () => mode !== 'endless' && currentQuestionIndex === questions.length - 1,
    [mode, currentQuestionIndex, questions.length],
  );

  const handleTimeExpired = useCallback(() => {
    if (showResult || hasFinished || !currentQuestion) return;
    if (mode === 'endless') {
      setLives(prev => prev - 1);
    }
    setAnsweredCount(prev => prev + 1);
    setShowResult(true);
    setDangerousActive(false);
  }, [showResult, hasFinished, currentQuestion, mode]);

  useEffect(() => {
    if (!currentQuestion || showResult || isTimerFrozen || hasFinished) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [currentQuestion, showResult, isTimerFrozen, hasFinished, handleTimeExpired]);

  const handleGameEnd = useCallback(async (endScore: number) => {
    setFinalScore(endScore);
    setHasFinished(true);
    
    try {
      const modeTable = mode === 'quick' ? 'quick_leaderboard' : mode === 'standard' ? 'standard_leaderboard' : 'endless_leaderboard';
      const { count, error } = await supabase
        .from(modeTable)
        .select('*', { count: 'exact', head: true })
        .gt('score', endScore);
      
      if (!error && count !== null) {
        setLeaderboardPosition(count + 1);
      }
    } catch (e) {
      console.error('Error fetching leaderboard position:', e);
    }
    
    setShowEndModal(true);
  }, [mode]);

  useEffect(() => {
    if (mode === 'endless' && lives <= 0 && !hasFinished) {
      handleGameEnd(score);
    }
  }, [lives, mode, hasFinished, handleGameEnd, score]);

  const handleAnswerSelect = (index: number) => {
    if (showResult || disabledOptions.includes(index)) return;
    setSelectedAnswer(index);
  };

  const evaluateAnswer = () => {
    if (!currentQuestion || showResult || selectedAnswer === null) return;
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    const delta =
      selectedAnswer === null
        ? 0
        : isCorrect
          ? currentQuestion.points * (dangerousActive ? 2 : 1)
          : dangerousActive
            ? -currentQuestion.points
            : 0;
    setScore(prev => prev + delta);
    if (mode === 'endless' && (!isCorrect || selectedAnswer === null)) {
      setLives(prev => prev - 1);
    }
    setAnsweredCount(prev => prev + 1);
    setShowResult(true);
    setIsTimerFrozen(true);
  };

  const goToNextQuestion = () => {
    if (!questions.length || hasFinished) return;
    if (mode !== 'endless' && isLastQuestion) {
      handleGameEnd(score);
      return;
    }
    const nextIndex =
      mode === 'endless'
        ? (currentQuestionIndex + 1) % questions.length
        : currentQuestionIndex + 1;
    setCurrentQuestionIndex(nextIndex);
    setSelectedAnswer(null);
    setShowResult(false);
    setDisabledOptions([]);
    setDangerousActive(false);
    setTimeLeft(30);
    setIsTimerFrozen(false);
  };

  const handleUseFifty = () => {
    if (!currentQuestion || abilityCharges.fifty === 0 || showResult) return;
    const incorrect = currentQuestion.options
      .map((_, idx) => idx)
      .filter(idx => idx !== currentQuestion.correctAnswer);
    const toDisable = shuffleArray(incorrect).slice(0, 2);
    setDisabledOptions(toDisable);
    if (selectedAnswer !== null && toDisable.includes(selectedAnswer)) {
      setSelectedAnswer(null);
    }
    setAbilityCharges(prev => ({ ...prev, fifty: prev.fifty - 1 }));
  };

  const handleUseFreeze = () => {
    if (abilityCharges.freeze === 0 || isTimerFrozen || showResult) return;
    setIsTimerFrozen(true);
    setAbilityCharges(prev => ({ ...prev, freeze: prev.freeze - 1 }));
  };

  const handleUseDangerous = () => {
    if (abilityCharges.dangerous === 0 || showResult || dangerousActive) return;
    setDangerousActive(true);
    setAbilityCharges(prev => ({ ...prev, dangerous: prev.dangerous - 1 }));
  };

  const handleUseSkip = () => {
    if (abilityCharges.skip === 0 || hasFinished || !questions.length) return;
    const finishing = mode !== 'endless' && isLastQuestion;
    setAbilityCharges(prev => ({ ...prev, skip: prev.skip - 1 }));
    setAnsweredCount(prev => prev + 1);
    if (finishing) {
      handleGameEnd(score);
      return;
    }
    const nextIndex =
      mode === 'endless'
        ? (currentQuestionIndex + 1) % questions.length
        : currentQuestionIndex + 1;
    setCurrentQuestionIndex(nextIndex);
    setSelectedAnswer(null);
    setShowResult(false);
    setDisabledOptions([]);
    setDangerousActive(false);
    setTimeLeft(30);
    setIsTimerFrozen(false);
  };

  const handlePurchaseAbility = (key: AbilityKey) => {
    if (score < abilityCost) return;
    setScore(prev => prev - abilityCost);
    setAbilityCharges(prev => ({ ...prev, [key]: prev[key] + 1 }));
  };

  const handleMainButton = () => {
    if (!showResult) {
      evaluateAnswer();
    } else {
      goToNextQuestion();
    }
  };

  const abilityButtons = [
    {
      key: 'fifty' as AbilityKey,
      label: '50 / 50',
      action: handleUseFifty,
    },
    {
      key: 'freeze' as AbilityKey,
      label: 'FREEZE',
      action: handleUseFreeze,
    },
    {
      key: 'dangerous' as AbilityKey,
      label: 'DANGER',
      action: handleUseDangerous,
    },
    {
      key: 'skip' as AbilityKey,
      label: 'SKIP',
      action: handleUseSkip,
    },
  ];

  // Countdown overlay
  if (showCountdown) {
    return (
      <div 
        className="fixed inset-0 flex items-center justify-center z-50"
        style={{ 
          background: 'radial-gradient(ellipse at center, #1e1b4b 0%, #0a0015 100%)',
        }}
      >
        {loadingQuestions ? (
          <div className="text-center">
            <div 
              className="text-6xl mb-4"
              style={{ animation: 'pulse 1.5s ease-in-out infinite' }}
            >
              ⏳
            </div>
            <p className="text-[#c084fc] text-lg">Loading questions...</p>
            <style>{`
              @keyframes pulse {
                0%, 100% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.1); opacity: 0.7; }
              }
            `}</style>
          </div>
        ) : (
        <>
        <div className="relative">
          <div 
            className="absolute inset-0 flex items-center justify-center"
            style={{
              animation: countdownValue === 'GO' ? 'none' : 'pulse-ring 1s ease-out infinite',
            }}
          >
            <div 
              style={{
                width: '350px',
                height: '350px',
                borderRadius: '50%',
                border: '4px solid rgba(168, 85, 247, 0.3)',
                animation: 'countdown-ring 1s ease-out infinite',
              }}
            />
          </div>
          <div 
            className="absolute inset-0 flex items-center justify-center"
            style={{
              animation: countdownValue === 'GO' ? 'none' : 'pulse-ring 1s ease-out infinite 0.2s',
            }}
          >
            <div 
              style={{
                width: '300px',
                height: '300px',
                borderRadius: '50%',
                border: '3px solid rgba(124, 58, 237, 0.4)',
                animation: 'countdown-ring 1s ease-out infinite 0.2s',
              }}
            />
          </div>
          
          <div 
            key={countdownValue}
            className="relative z-10 flex items-center justify-center"
            style={{
              width: '250px',
              height: '250px',
              animation: 'countdown-pop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            }}
          >
            <span
              style={{
                fontSize: countdownValue === 'GO' ? '4rem' : '10rem',
                fontWeight: 'bold',
                color: countdownValue === 'GO' ? '#22c55e' : '#e9d5ff',
                textShadow: countdownValue === 'GO' 
                  ? '0 0 40px #22c55e, 0 0 80px #22c55e, 0 0 120px rgba(34, 197, 94, 0.5), 4px 4px 0 #166534'
                  : '0 0 40px #a855f7, 0 0 80px #7c3aed, 0 0 120px rgba(124, 58, 237, 0.5), 6px 6px 0 #6b21a8',
                fontFamily: '"Press Start 2P", cursive',
                letterSpacing: countdownValue === 'GO' ? '0.1em' : '0',
                WebkitTextStroke: countdownValue === 'GO' ? '2px #166534' : '3px #7c3aed',
              }}
            >
              {countdownValue === 'GO' ? 'GO!' : countdownValue}
            </span>
          </div>
          
          {countdownValue === 'GO' && (
            <>
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    width: '10px',
                    height: '10px',
                    background: i % 2 === 0 ? '#22c55e' : '#a855f7',
                    borderRadius: '50%',
                    left: '50%',
                    top: '50%',
                    marginLeft: '-5px',
                    marginTop: '-5px',
                    boxShadow: i % 2 === 0 ? '0 0 10px #22c55e' : '0 0 10px #a855f7',
                    animation: `particle-${i} 0.8s ease-out forwards`,
                  }}
                />
              ))}
            </>
          )}
        </div>
        
        <style>{`
          @keyframes countdown-pop {
            0% {
              transform: scale(0.3);
              opacity: 0;
            }
            50% {
              transform: scale(1.1);
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }
          
          @keyframes countdown-ring {
            0% {
              transform: scale(0.8);
              opacity: 0.8;
            }
            100% {
              transform: scale(1.5);
              opacity: 0;
            }
          }
          
          @keyframes pulse-ring {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
          }
          
          @keyframes fade-in {
            from { opacity: 0; transform: translateX(-50%) translateY(20px); }
            to { opacity: 1; transform: translateX(-50%) translateY(0); }
          }
          
          ${[...Array(12)].map((_, i) => `
            @keyframes particle-${i} {
              0% {
                transform: translate(0, 0);
                opacity: 1;
              }
              100% {
                transform: translate(${Math.cos(i * 30 * Math.PI / 180) * 150}px, ${Math.sin(i * 30 * Math.PI / 180) * 150}px);
                opacity: 0;
              }
            }
          `).join('')}
        `}</style>
        </>
        )}
      </div>
    );
  }

  if (loadingQuestions) {
    return (
      <div className="pixel-container max-w-3xl w-full mx-auto">
        <div className="text-center p-12 text-[#c084fc]">Loading questions...</div>
      </div>
    );
  }

  if (loadError || !currentQuestion) {
    return (
      <div className="pixel-container max-w-3xl w-full mx-auto">
        <div className="text-center p-12 text-[#c084fc]">
          {loadError || 'No questions available'}
        </div>
        <div className="flex justify-center mt-6">
          <button
            onClick={onBack}
            className="pixel-button px-4 py-2 bg-gradient-to-b from-[#4c1d95] to-[#3b0764] border-[#6b21a8] text-[#c084fc] hover:from-[#581c87] hover:to-[#4c1d95]"
          >
            ← MENU
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="pixel-container max-w-3xl w-full mx-auto"
      style={{
        opacity: quizVisible ? 1 : 0,
        transition: 'opacity 0.3s ease-out',
      }}
    >
      <div className="flex flex-col gap-3 mb-6">
        {mode === 'endless' && (
          <div 
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              background: 'linear-gradient(to bottom, #1e1b4b, #110f2d)',
              border: '2px solid #6b21a8',
              borderRadius: '2px'
            }}
          >
            {Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                style={{
                  filter: idx < Math.max(lives, 0) 
                    ? 'drop-shadow(0 0 8px #f43f5e) drop-shadow(0 0 16px #f43f5e)' 
                    : 'grayscale(1) opacity(0.3)',
                  transition: 'filter 0.3s ease'
                }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill={idx < Math.max(lives, 0) ? '#f43f5e' : '#4c1d95'}>
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>
            ))}
          </div>
        )}

        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '8px'
          }}
        >
          <button
            onClick={onBack}
            className="pixel-button bg-gradient-to-b from-[#4c1d95] to-[#3b0764] border-[#6b21a8] text-[#c084fc] hover:from-[#581c87] hover:to-[#4c1d95]"
            style={{ 
              fontSize: '0.625rem',
              padding: '10px 8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ← BACK
          </button>
          <div 
            style={{ 
              fontSize: '0.625rem',
              padding: '10px 8px',
              border: '2px solid #6b21a8',
              background: 'rgba(30, 27, 75, 0.6)',
              color: '#e9d5ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center'
            }}
          >
            {mode === 'quick' && '⚡ QUICK'}
            {mode === 'standard' && '🎯 CLASSIC'}
            {mode === 'endless' && '♾️ ENDLESS'}
          </div>
          <div 
            style={{ 
              fontSize: '0.625rem',
              padding: '10px 8px',
              border: '2px solid #7c3aed',
              background: 'rgba(30, 27, 75, 0.6)',
              color: '#e9d5ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {score} PTS
          </div>
          <div 
            style={{ 
              fontSize: '0.625rem',
              padding: '10px 8px',
              border: '2px solid #6b21a8',
              background: 'rgba(30, 27, 75, 0.6)',
              color: '#c084fc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            Q: {mode === 'endless' ? answeredCount + 1 : `${currentQuestionIndex + 1}/${questions.length}`}
          </div>
        </div>
        
        <div 
          style={{ 
            background: '#1e1b4b',
            border: '2px solid #6b21a8',
            borderRadius: '2px',
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px 12px',
              fontSize: '0.75rem',
              color: timeLeft <= 5 ? '#f87171' : '#c084fc',
              position: 'relative',
              zIndex: 1,
              fontWeight: 'bold'
            }}
          >
            ⏱ {timeLeft}s
          </div>
          <div 
            style={{ 
              position: 'absolute',
              bottom: 0,
              left: 0,
              height: '5px',
              width: `${(timeLeft / 30) * 100}%`,
              background: timeLeft <= 5 
                ? 'linear-gradient(to right, #ef4444, #f97316)' 
                : 'linear-gradient(to right, #7c3aed, #a855f7)',
              boxShadow: timeLeft <= 5 
                ? '0 0 10px rgba(239,68,68,0.8)' 
                : '0 0 10px rgba(168,85,247,0.6)',
              transition: 'width 0.3s ease-out, background 0.3s, box-shadow 0.3s'
            }}
          />
        </div>

        {mode !== 'endless' && (
          <div 
            style={{ 
              height: '8px',
              background: '#1e1b4b',
              border: '2px solid #6b21a8',
              borderRadius: '2px',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
                background: 'linear-gradient(to right, #22c55e, #a855f7)',
                transition: 'width 0.3s ease-out'
              }}
            />
          </div>
        )}
      </div>

      <div 
        className="mb-6"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '0.75rem'
        }}
      >
        {abilityButtons.map(ability => (
          <div
            key={ability.key}
            className="p-3 border-2 border-[#6b21a8] bg-[#1e1b4b]/70"
            style={{ minWidth: 0 }}
          >
            <div className="flex items-center justify-between text-[#e9d5ff] mb-2" style={{ fontSize: '0.625rem' }}>
              <span>{ability.label}</span>
              <span className="text-[#a855f7]">x{abilityCharges[ability.key]}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={ability.action}
                disabled={abilityCharges[ability.key] === 0 || showResult || hasFinished}
                className={`pixel-button flex-1 py-2 ${
                  abilityCharges[ability.key] === 0 || showResult || hasFinished
                    ? 'bg-[#1e1b4b] text-[#6b21a8] cursor-not-allowed border-[#4c1d95]'
                    : 'bg-gradient-to-b from-[#7c3aed] to-[#6b21a8] border-[#a855f7] text-[#e9d5ff]'
                }`}
                style={{ fontSize: '0.625rem' }}
              >
                USE
              </button>
              <button
                onClick={() => handlePurchaseAbility(ability.key)}
                disabled={score < abilityCost || hasFinished}
                className={`pixel-button flex-1 py-2 ${
                  score < abilityCost || hasFinished
                    ? 'bg-[#1e1b4b] text-[#6b21a8] cursor-not-allowed border-[#4c1d95]'
                    : 'bg-gradient-to-b from-[#4c1d95] to-[#3b0764] border-[#6b21a8] text-[#e9d5ff]'
                }`}
                style={{ fontSize: '0.625rem' }}
              >
                BUY
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-8 p-6 bg-gradient-to-b from-[#1e1b4b] to-[#110f2d] border-4 border-[#7c3aed] relative">
        <div className="absolute top-2 left-2 right-2 bottom-2 border border-[#6b21a8] pointer-events-none opacity-50" />
        <div className="flex items-center justify-between mb-4 text-xs text-[#e9d5ff]">
          <span
            className="px-3 py-2 border-2"
            style={{
              borderColor: difficultyColors[currentQuestion.difficulty],
              color: difficultyColors[currentQuestion.difficulty],
            }}
          >
            {currentQuestion.difficulty.toUpperCase()} • {currentQuestion.points} pts
          </span>
          {dangerousActive && <span className="text-[#f97316]">DANGER x2 / -1</span>}
          {!dangerousActive && <span className="text-[#a855f7]">Choose an answer</span>}
        </div>
        <p className="text-[#e9d5ff] text-center leading-relaxed relative z-10">
          {currentQuestion.question}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-8">
        {currentQuestion.options.map((option, index) => {
          const isCorrect = showResult && index === currentQuestion.correctAnswer;
          const isIncorrect =
            showResult && selectedAnswer === index && selectedAnswer !== currentQuestion.correctAnswer;
          const disabled = disabledOptions.includes(index);
          const isChosen = selectedAnswer === index;
          const baseStyle = !showResult
            ? {
                background: isChosen
                  ? 'linear-gradient(to bottom, #7c3aed, #6b21a8)'
                  : 'linear-gradient(to bottom, #1e1b4b, #110f2d)',
                borderColor: isChosen ? '#a855f7' : '#6b21a8',
                color: isChosen ? '#e9d5ff' : '#c084fc',
              }
            : isCorrect
              ? {
                  background: 'linear-gradient(to bottom, #22c55e, #16a34a)',
                  borderColor: '#4ade80',
                  color: '#ffffff',
                }
              : isIncorrect
                ? {
                    background: 'linear-gradient(to bottom, #ef4444, #dc2626)',
                    borderColor: '#f87171',
                    color: '#ffffff',
                  }
                : {
                    background: 'linear-gradient(to bottom, #1e1b4b, #110f2d)',
                    borderColor: '#4c1d95',
                    color: '#7c3aed',
                  };

          return (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={showResult || disabled}
              className={`pixel-button p-4 text-left transition-all ${
                !showResult && !disabled ? 'hover:border-[#7c3aed] hover:text-[#e9d5ff]' : ''
              } ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
              style={{
                background: baseStyle.background,
                borderColor: baseStyle.borderColor,
                color: baseStyle.color,
                borderWidth: '3px',
                borderStyle: 'solid',
              }}
            >
              <span
                className="mr-3"
                style={{
                  color: isCorrect || isIncorrect ? '#ffffff' : '#a855f7',
                }}
              >
                {String.fromCharCode(65 + index)}.
              </span>
              {option}
            </button>
          );
        })}
      </div>

      <button
        onClick={handleMainButton}
        disabled={(!showResult && selectedAnswer === null) || hasFinished}
        className={`pixel-button w-full p-4 transition-all ${
          (!showResult && selectedAnswer === null) || hasFinished
            ? 'bg-[#1e1b4b] text-[#6b21a8] cursor-not-allowed border-[#4c1d95]'
            : 'bg-gradient-to-b from-[#7c3aed] to-[#6b21a8] hover:from-[#8b5cf6] hover:to-[#7c3aed] border-[#a855f7] text-[#e9d5ff]'
        }`}
      >
        {showResult ? (isLastQuestion && mode !== 'endless' ? '★ FINISH ★' : 'NEXT →') : 'SUBMIT'}
      </button>

      {showResult && (
        <div className="mt-6 text-center p-4 border-3 border-[#7c3aed] bg-[#1e1b4b]/50">
          {selectedAnswer === currentQuestion.correctAnswer ? (
            <p className="text-[#a855f7]">✓ Correct! +{currentQuestion.points * (dangerousActive ? 2 : 1)}</p>
          ) : (
            <p className="text-[#c084fc]">
              ✗ Wrong. {dangerousActive ? `-${currentQuestion.points} points. ` : ''}
              Correct answer: {String.fromCharCode(65 + currentQuestion.correctAnswer)}
            </p>
          )}
        </div>
      )}

      {showEndModal && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ background: 'rgba(10, 0, 21, 0.9)' }}
        >
          <div 
            className="pixel-container max-w-md w-full mx-4 animate-in fade-in zoom-in duration-300"
            style={{
              background: 'linear-gradient(to bottom, #1e1b4b, #110f2d)',
              border: '4px solid #7c3aed',
              boxShadow: '0 0 40px rgba(124, 58, 237, 0.5)'
            }}
          >
            <div className="text-center p-6">
              {isNewBestScore && (
                <div 
                  className="mb-6 p-3 animate-pulse"
                  style={{
                    background: 'linear-gradient(to right, #eab308, #f97316)',
                    border: '3px solid #facc15',
                    color: '#1e1b4b'
                  }}
                >
                  <span className="text-xl font-bold">🎉 NEW BEST SCORE! 🎉</span>
                </div>
              )}
              
              <div className="space-y-4 mb-8">
                <div 
                  className="p-4 border-2 border-[#7c3aed]"
                  style={{ background: 'rgba(124, 58, 237, 0.2)' }}
                >
                  <p className="text-[#c084fc] text-xs mb-1">YOUR SCORE</p>
                  <p 
                    className="text-4xl text-[#e9d5ff]"
                    style={{ textShadow: '0 0 10px #a855f7' }}
                  >
                    {finalScore} pts
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div 
                    className="p-4 border-2 border-[#6b21a8]"
                    style={{ background: 'rgba(107, 33, 168, 0.2)' }}
                  >
                    <p className="text-[#7c3aed] text-xs mb-1">BEST SCORE</p>
                    <p className="text-2xl text-[#c084fc]">
                      {isNewBestScore ? finalScore : modeBestScore} pts
                    </p>
                  </div>
                  
                  <div 
                    className="p-4 border-2 border-[#6b21a8]"
                    style={{ background: 'rgba(107, 33, 168, 0.2)' }}
                  >
                    <p className="text-[#7c3aed] text-xs mb-1">LEADERBOARD</p>
                    <p className="text-2xl text-[#c084fc]">
                      {leaderboardPosition !== null ? `#${leaderboardPosition}` : '...'}
                    </p>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => {
                  setShowEndModal(false);
                  onComplete(finalScore, mode);
                }}
                className="pixel-button w-full p-4 bg-gradient-to-b from-[#7c3aed] to-[#6b21a8] hover:from-[#8b5cf6] hover:to-[#7c3aed] border-[#a855f7] text-[#e9d5ff]"
              >
                MENU
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
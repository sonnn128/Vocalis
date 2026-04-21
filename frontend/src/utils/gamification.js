const GAMIFICATION_KEY = 'vocalis.gamification';

const initialState = {
  points: 0,
  streakDays: 0,
  lastStudyDate: null,
  totalSessions: 0,
  totalReviewedCards: 0,
};

const toDateOnly = (date = new Date()) => date.toISOString().slice(0, 10);

const readState = () => {
  try {
    const raw = localStorage.getItem(GAMIFICATION_KEY);
    if (!raw) return { ...initialState };
    const parsed = JSON.parse(raw);
    return { ...initialState, ...(parsed || {}) };
  } catch {
    return { ...initialState };
  }
};

const writeState = (state) => {
  localStorage.setItem(GAMIFICATION_KEY, JSON.stringify(state));
};

export const getGamificationState = () => readState();

export const addStudyActivity = ({ cardsReviewed = 0, pointsEarned = 0 } = {}) => {
  const state = readState();
  const today = toDateOnly(new Date());

  let streakDays = state.streakDays;
  if (!state.lastStudyDate) {
    streakDays = 1;
  } else if (state.lastStudyDate === today) {
    streakDays = state.streakDays;
  } else {
    const last = new Date(state.lastStudyDate);
    const now = new Date(today);
    const diffDays = Math.round((now - last) / (1000 * 60 * 60 * 24));
    streakDays = diffDays === 1 ? state.streakDays + 1 : 1;
  }

  const next = {
    ...state,
    points: state.points + Math.max(0, pointsEarned),
    streakDays,
    lastStudyDate: today,
    totalSessions: state.totalSessions + 1,
    totalReviewedCards: state.totalReviewedCards + Math.max(0, cardsReviewed),
  };

  writeState(next);
  return next;
};

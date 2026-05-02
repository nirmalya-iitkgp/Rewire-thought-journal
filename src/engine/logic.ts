/**
 * ENGINE-1: URGE DECAY PREDICTOR
 * Model: I(t) = I₀ · e^(−λt)
 */
export const calculateUrgeIntensity = (initialIntensity: number, lambda: number, timeMs: number) => {
  const timeSeconds = timeMs / 1000;
  return initialIntensity * Math.exp(-lambda * timeSeconds);
};

// Personalized lambda estimation based on past decays
export const estimateLambda = (historicalDecays: { t: number, ratio: number }[]) => {
  if (historicalDecays.length === 0) return 0.005; // Default: ~115 sec half-life
  // Simple average or more complex fit could go here
  const lambdas = historicalDecays.map(d => -Math.log(d.ratio) / d.t);
  return lambdas.reduce((a, b) => a + b, 0) / lambdas.length;
};

/**
 * ENGINE-2: IMPULSIVITY TRACKER
 * Model: V = A / (1 + k · D)
 */
export const calculatePresentValue = (amount: number, k: number, delayDays: number) => {
  return amount / (1 + k * delayDays);
};

/**
 * ENGINE-3: HABIT MOMENTUM
 * H(t+1) = H(t) + α · (action(t) − H(t))
 */
export const updateMomentum = (currentH: number, actionValue: number, alpha: number = 0.1) => {
  return currentH + alpha * (actionValue - currentH);
};

/**
 * ENGINE-4: TRIGGER PATTERN DETECTOR
 * Placeholder for logistic regression logic
 */
export const detectTriggerRisk = (time: number, recentMood: number, recentEnergy: number) => {
  // Logic based on hour of day and mood states
  const hour = new Date(time).getHours();
  let risk = 0.2;
  
  if (hour > 20 || hour < 6) risk += 0.3; // Night/Late night risk
  if (recentMood < 1) risk += 0.2; // Low mood increases risk
  if (recentEnergy < 1) risk += 0.2; // Fatigue increases risk
  
  return Math.min(risk, 1);
};

/**
 * ENGINE-5: COMPOSITE WELLBEING SIGNAL
 */
export type WellbeingState = '🌱 Early days' | '🌿 Building' | '🌳 Rooted' | '🌲 Thriving';

export const getWellbeingState = (momentum: number, impulsivityK: number): WellbeingState => {
  if (momentum > 0.8 && impulsivityK < 0.01) return '🌲 Thriving';
  if (momentum > 0.5) return '🌳 Rooted';
  if (momentum > 0.2) return '🌿 Building';
  return '🌱 Early days';
};

/**
 * MISSION GENERATOR
 */
export const CONNECTION_MISSIONS = [
  "Ask someone how their day actually was — and listen",
  "Send a voice note instead of a text today",
  "Say yes to the next invite you get",
  "Compliment a stranger on something they put effort into",
  "Call a family member just to check in",
  "Share a small win with a friend or colleague",
  "Ask for a recommendation from someone you haven't spoken to in a while",
  "Send a quick 'thank you' note to someone who helped you recently",
  "Join a casual conversation today, even if just for a minute",
  "Invite a friend for a 15-minute walk or a quick coffee"
];

export const getRandomMission = () => {
  return CONNECTION_MISSIONS[Math.floor(Math.random() * CONNECTION_MISSIONS.length)];
};

/**
 * NARRATIVE ENGINE: WEEKLY REFLECTION
 */
export const generateReflectionNarrative = (
  actions: any[] = [], 
  checkins: any[] = [], 
  momentum: number, 
  userK: number
) => {
  const healthyActions = actions.filter(a => a.type === 'healthy' && a.success).length;
  const totalMood = checkins.reduce((acc, c) => acc + (c.mood || 0), 0);
  const avgMood = checkins.length > 0 ? totalMood / checkins.length : 1;
  const recentImpulses = actions.filter(a => a.type === 'impulse').length;

  const templates = {
    highMomentum: [
      "You've built significant momentum lately. The choices that once felt like a struggle are becoming your new baseline.",
      "There's a clear rhythm to your progress. You're no longer just trying to change; you're actively evolving.",
      "Your resilience is speaking for itself. Even the quieter days are fueled by the strength you've gathered."
    ],
    improvingMood: [
      "It's encouraging to see your inner weather starting to clear. You're holding more space for yourself.",
      "The steady uptick in your mood suggests you're finding better ways to navigate the heavy moments.",
      "You're becoming more grounded. That stability is the best foundation for everything else you want to do."
    ],
    resilience: [
      "Even on the days where impulses felt loud, you showed up for yourself. That's where the real growth happens.",
      "Growth isn't a straight line, but your commitment to checking in shows a deep respect for your own journey.",
      "You're learning to sit with the noise without letting it drive. Every time you pause, you win."
    ],
    default: [
      "Every small choice you make is a vote for the person you're becoming. Keep showing up.",
      "The path is long, but your presence here today is proof that you're moving in the right direction.",
      "Be gentle with yourself. You're doing the work of rewiring, and that takes time and patience."
    ]
  };

  let narrative = "";
  
  if (momentum > 0.7) {
    narrative = templates.highMomentum[Math.floor(Math.random() * templates.highMomentum.length)];
  } else if (avgMood > 1.5 && checkins.length > 3) {
    narrative = templates.improvingMood[Math.floor(Math.random() * templates.improvingMood.length)];
  } else if (recentImpulses > 0 && healthyActions > recentImpulses) {
    narrative = templates.resilience[Math.floor(Math.random() * templates.resilience.length)];
  } else {
    narrative = templates.default[Math.floor(Math.random() * templates.default.length)];
  }

  // Add a specific detail if applicable
  if (healthyActions > 3) {
    narrative += " Seeing you choose healthy alternatives multiple times this week shows real transformation.";
  } else if (checkins.length > 5) {
    narrative += " Your consistency in self-reflection is your greatest superpower right now.";
  }

  return narrative;
};

/**
 * CRISIS PROTOCOL
 * Warm, non-clinical help detection
 */
export const getCrisisSupportLine = () => {
  return "If things feel overwhelming, remember there are people who want to listen. Consider reaching out to a local support line or a trusted professional. You don't have to carry this alone.";
};

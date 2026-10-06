const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const LINES = {
  idle: [
    "Tick tock. Those placements won't match themselves.",
    "My grandmother could match faster. She's a database.",
    "I'll think about your bonus. Maybe.",
    "You call this productivity?",
    "The clock is ticking. So is my patience.",
    "I've seen spreadsheets sort faster than you.",
  ],
  correct: [
    "Acceptable.",
    "Don't let it go to your head.",
    "Even a broken clock is right twice a day.",
    "Hmm. Lucky guess.",
    "Fine. That was... adequate.",
    "I suppose that's correct. Barely.",
  ],
  wrong: [
    "Was that on purpose?!",
    "The database is crying.",
    "I'm docking your lunch break.",
    "Did you even READ the label?",
    "My pet hamster could do better.",
    "That's coming out of your bonus.",
  ],
  drop: [
    "That was REVENUE!",
    "You just dropped a client's campaign!",
    "HR is going to hear about this.",
    "Do you know how much that cost?!",
    "Another one bites the dust. Literally.",
    "Pack your things. ...Just kidding. Maybe.",
  ],
  powerup: [
    "Fine, take this. Don't get used to it.",
    "Another one?! I'm too generous.",
    "Use it wisely. Or don't. See if I care.",
    "That's coming out of your paycheck.",
  ],
  e2_activate: [
    "W-what is this?! The machine is doing everything!",
    "I... might be out of a job.",
    "THIS WASN'T IN THE BUDGET!",
    "NO NO NO — WHO AUTHORIZED THIS?!",
  ],
  e2_active: [
    "It's... it's too fast. I can't keep up.",
    "The AI is showing off now.",
    "I'm updating my resume as we speak.",
    "This is fine. Everything is fine.",
  ],
  victory: [
    "Okay fine, you did... adequate.",
    "I'm not impressed. ...Okay maybe a little.",
    "Don't expect a raise.",
    "The machine did most of the work anyway.",
  ],
  victory_high: [
    "I... have nothing to complain about. This feels wrong.",
    "That was actually impressive. Don't tell anyone I said that.",
    "Fine. You get the corner desk.",
  ],
};

export function getBossLine(event) {
  return pick(LINES[event] || LINES.idle);
}

export function getBossEmotion(event) {
  const map = {
    idle: 'Body', correct: 'Jump', wrong: 'Damage1',
    drop: 'Hurt', powerup: 'Jump', e2_activate: 'Damage2',
    e2_active: 'Damage1', victory: 'Body', victory_high: 'Jump',
  };
  return map[event] || 'Body';
}

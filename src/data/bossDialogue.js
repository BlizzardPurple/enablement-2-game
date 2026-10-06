const pick = a => a[Math.floor(Math.random()*a.length)];
const L = {
  idle:["Tick tock. Those placements won't match themselves.","My grandmother could match faster. She's a database.","I'll think about your bonus. Maybe.","You call this productivity?","The clock is ticking. So is my patience.","I've seen spreadsheets sort faster."],
  correct:["Acceptable.","Don't let it go to your head.","Even a broken clock...","Hmm. Lucky guess.","Fine. Adequate.","I suppose that's correct. Barely."],
  wrong:["Was that on PURPOSE?!","The database is crying.","I'm docking your lunch break.","Did you even READ it?","My pet hamster could do better.","That's coming out of your bonus."],
  drop:["That was REVENUE!","You just dropped a client's campaign!","HR is going to hear about this.","Do you know how much that cost?!","Pack your things. ...Just kidding. Maybe."],
  powerup:["Fine, take it. Don't get used to it.","Another one?! I'm too generous.","That's coming out of your paycheck."],
  e2_activate:["W-WHAT IS THIS?!","I... might be out of a job.","THIS WASN'T IN THE BUDGET!","WHO AUTHORIZED THIS?!"],
  e2_active:["It's too fast. I can't keep up.","The AI is showing off.","I'm updating my resume.","This is fine. Everything is fine."],
  victory:["Okay fine... adequate.","I'm not impressed. ...Maybe a little.","Don't expect a raise."],
  victory_high:["I have nothing to complain about. This feels wrong.","That was impressive. Don't tell anyone I said that."],
};
export const getBossLine = e => pick(L[e]||L.idle);
export const getBossAnim = e => ({idle:'Idle',correct:'Walk',wrong:'Hit',drop:'Hit',powerup:'Walk',e2_activate:'Attack',e2_active:'Attack',victory:'Walk',victory_high:'Walk'})[e]||'Idle';

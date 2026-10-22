/* ==========================================================================
   content.js — SINGLE SOURCE OF TRUTH for every word in the deck.

   Loaded as a classic script (no ES modules) so the deck works when opened
   straight from disk with file:// — no server, no build step, no network.

   Sources for quoted material are listed on the final slide and beside each
   pull-quote. Anything that is a practical routine rather than a book
   concept is labelled as such in the slide copy.
   ========================================================================== */

const DECK = {
  meta: {
    habit: "Habit 5",
    title: "Seek First to Understand,\nThen to Be Understood",
    tagline: "The skill that turns arguments into conversations.",
    book: "The 7 Habits of Highly Effective Teens",
    author: "Sean Covey",
    basedOn: "Building on Stephen R. Covey's The 7 Habits of Highly Effective People",
    epigraph: "Listen, or thy tongue will make thee deaf.",
    epigraphSrc: "— epigraph to Habit 5, The 7 Habits of Highly Effective Teens",
    footer: "The 7 Habits of Highly Effective Teens · Habit 5",
  },

  /* --- the seven habits, used on the map slide ------------------------- */
  habits: [
    { n: 1, name: "Be Proactive", group: "private" },
    { n: 2, name: "Begin with the End in Mind", group: "private" },
    { n: 3, name: "Put First Things First", group: "private" },
    { n: 4, name: "Think Win-Win", group: "bridge" },
    { n: 5, name: "Seek First to Understand, Then to Be Understood", group: "bridge", hero: true },
    { n: 6, name: "Synergize", group: "public" },
    { n: 7, name: "Sharpen the Saw", group: "public" },
  ],
  groups: [
    { key: "private", label: "Private victories", range: "Habits 1–3", note: "You take charge of you." },
    { key: "bridge", label: "The bridge", range: "Habits 4–5", note: "You meet other people where they are." },
    { key: "public", label: "Public victories + renewal", range: "Habits 6–7", note: "Now the win includes everyone." },
  ],

  /* --- the five poor listening styles (teen edition) ------------------- */
  styles: [
    {
      id: "spacing",
      name: "Spacing Out",
      sound: "“Sure, cool, anyway— so about Friday…”",
      tell: "Your eyes left the conversation three sentences ago.",
      fix: "Put the phone face down. Full attention, or no faking it.",
    },
    {
      id: "pretend",
      name: "Pretend Listening",
      sound: "“Uh-huh… totally… mhm… yeah.”",
      tell: "You nod, but the speaker can feel they are not worth your attention.",
      fix: "Admit it and reset: “I'm losing you — say that again?”",
    },
    {
      id: "selective",
      name: "Selective Listening",
      sound: "“Wait, go back — the part about the party…”",
      tell: "You heard the part that interested you and dropped the rest.",
      fix: "Listen for the whole story, not the interesting part.",
    },
    {
      id: "word",
      name: "Word Listening",
      sound: "“Fine.” (Said in a tone that was not fine.)",
      tell: "You caught every word and completely missed the meaning.",
      fix: "Listen to the tone, the pace and the body, not just the script.",
    },
    {
      id: "self",
      name: "Self-Centred Listening",
      sound: "“Well, when I was 14, I…”",
      tell: "Every story became about you, your advice, or your comeback.",
      fix: "Curiosity first. Their frame of reference, not yours.",
    },
  ],

  /* --- the four autobiographical responses (Covey) ---------------------- */
  auto: [
    { name: "Evaluating", example: "Judging: agreeing or disagreeing before they finish." },
    { name: "Probing", example: "Questioning from your own frame of reference." },
    { name: "Advising", example: "Solving their problem before you know the problem." },
    { name: "Defending", example: "Explaining, justifying, or counter-attacking." },
  ],
  empathic: [
    { name: "Suspend", example: "Park your own story, your advice and your rebuttal." },
    { name: "Observe", example: "Words, tone, pace, posture, and what is not being said." },
    { name: "Reflect", example: "Mirror back what you heard, in your own words." },
    { name: "Clarify", example: "Ask the question that shows you were really listening." },
  ],

  /* --- mirroring phrases (from the book's mirroring exercise) ----------- */
  mirrors: [
    { open: "As I get it…", full: "As I get it, you feel like nobody is actually listening to you.", note: "Opens the door without arguing." },
    { open: "So, as I see it…", full: "So, as I see it, the problem isn't the deadline — it's that you have no say in the plan.", note: "Stays in their frame." },
    { open: "I can see that you're feeling…", full: "I can see that you're feeling ignored, and honestly, that tracks.", note: "Names the emotion, not the argument." },
    { open: "You feel that…", full: "You feel like the answer was decided before you were asked.", note: "Short. Often the most powerful one." },
    { open: "So, what you're saying is…", full: "So, what you're saying is the deadline matters less than being included.", note: "Proves you understood before you respond." },
  ],

  /* --- the practice loop (built from Covey's principles, not a book term) - */
  loop: [
    { step: "01", name: "Pause", do: "Do not interrupt. Not even to fix it.", trap: "Rescuing early is not kindness. It is a spoiler." },
    { step: "02", name: "Reflect", do: "Mirror back what you heard, in your own words.", trap: "If they say “that's not it,” you listened badly — go again." },
    { step: "03", name: "Ask", do: "Open questions: “What happened next?” “What do you wish I knew?”", trap: "Closed questions and “why” make people defend, not open." },
    { step: "04", name: "Hold", do: "Let the silence sit. Count to three.", trap: "You will feel the urge to rescue the silence. Don't." },
    { step: "05", name: "Add", do: "Only now add your view — and check it landed.", trap: "Being understood is a goal, not a prize you take by force." },
  ],

  /* --- interactive lab ------------------------------------------------- */
  lab: [
    {
      scene: "Your friend says, “I guess whatever. It's fine.” — but it is obviously not fine.",
      options: [
        { text: "“Cool, so are we good then?”", ok: false, fb: "That closes the door. “Fine” is rarely fine — it's a bid to be asked again, more carefully." },
        { text: "“I'm not buying 'fine.' What actually happened?”", ok: true, fb: "Yes. You named the gap between the words and the meaning, and left the door open." },
        { text: "“I'd be fine too, honestly.”", ok: false, fb: "This is self-centred listening. You made it about how you would react instead of how they feel." },
      ],
    },
    {
      scene: "A group project. A teammate proposes an idea you think is bad.",
      options: [
        { text: "“That's not going to work. Here's a better idea.”", ok: false, fb: "That's advising — you jumped to solving a problem you haven't actually understood yet." },
        { text: "“Walk me through your thinking — why that one?”", ok: true, fb: "Exactly. Genuine curiosity costs one question and saves a whole argument." },
        { text: "“Whatever, we don't have time for this.”", ok: false, fb: "Dismissing isn't listening. You didn't have to like the idea to have to understand it." },
      ],
    },
    {
      scene: "Someone is venting about a problem you have an instant fix for.",
      options: [
        { text: "“Have you tried just turning it off and on again?”", ok: false, fb: "Advice before understanding is a very confident way to be ignored." },
        { text: "“Do you want me to just listen, or would ideas help right now?”", ok: true, fb: "Perfect. This one question honours both kinds of support." },
        { text: "“I had that exact problem last year — here's what I did.”", ok: false, fb: "That's autobiographical listening. Your story may be similar, but it is not their story." },
      ],
    },
    {
      scene: "A classmate repeats a rumour about you that is not true.",
      options: [
        { text: "“That's completely false and I can't believe you'd say that.”", ok: false, fb: "Defending. You fought for yourself, and the rumour keeps travelling." },
        { text: "“Tell me exactly what you heard, and I'll tell you what actually happened.”", ok: true, fb: "Yes. You gathered the information first — and you didn't attack the messenger." },
        { text: "“Whatever. I don't care what people think.”", ok: false, fb: "Pretend listening. The words are 'fine' while the tone says 'this hurts'." },
      ],
    },
    {
      scene: "Your parent criticises the grade you got. You know exactly how you feel.",
      options: [
        { text: "“Can I tell you what I think went wrong, and then you can add to it?”", ok: true, fb: "This is the whole habit in one line: seek to be understood, but earn it by understanding first." },
        { text: "“You don't get it. I tried really hard.”", ok: false, fb: "This is your point of view arriving before theirs. It invites a debate instead of a conversation." },
        { text: "“Fine. Whatever you say.”", ok: false, fb: "Word listening — you heard the words and ignored the person who said them." },
      ],
    },
    {
      scene: "You want to be understood about something that matters to you.",
      options: [
        { text: "“I'm right and you're wrong, but I have good reasons.”", ok: false, fb: "Being right is not the same as being understood. One wins the argument; the other wins the person." },
        { text: "“Before I say my part — can you tell me how you see it?”", ok: true, fb: "This is how you earn the right to be heard: you go second, and you go prepared." },
        { text: "“I'll explain it really clearly so you finally get it.”", ok: false, fb: "Clarity helps only after understanding. Explaining harder is not listening." },
      ],
    },
  ],

  /* --- practice plan ---------------------------------------------------- */
  planPrompts: [
    { key: "listen", label: "One conversation I will actually listen to", placeholder: "e.g. Sunday dinner with my dad" },
    { key: "phrase", label: "One phrase I will try", placeholder: "e.g. “As I get it, you feel…”" },
    { key: "understood", label: "One way I will ask to be understood", placeholder: "e.g. “Before I reply, what's your read on it?”" },
  ],

  /* --- the "understanding is not excusing" trap -------------------------- */
  traps: [
    {
      title: "Understanding ≠ excusing",
      body: "You can understand exactly why someone lied, was cruel, or let you down — and still walk away. Understanding the reason is not the same as agreeing with the action, and it is never a debt you owe them.",
    },
    {
      title: "You cannot change them by changing them",
      body: "The moment you can explain someone's behaviour to yourself, you can see their point of view without surrendering your own values. Covey's law of Others' Perception: what you perceive is what you are — and you cannot change another person by trying to change how they see.",
    },
    {
      title: "Empathic listening is risky",
      body: "It is dangerous, Covey warns, because it opens you to being hurt. Understanding someone completely means their pain becomes real to you. Take the risk on purpose, not by accident.",
    },
  ],

  /* --- the "then to be understood" loop ---------------------------------- */
  understood: [
    { step: "1", name: "Ask for feedback", body: "“What am I missing?” “How did that land?” You cannot read a mind you never asked." },
    { step: "2", name: "Listen to the feedback", body: "Same muscle as before: hear the words, hear the feeling, resist the urge to defend." },
    { step: "3", name: "Adjust", body: "Then, and only then, say it again — differently. The third version is the one they actually hear." },
  ],

  /* --- recap ------------------------------------------------------------- */
  recap: {
    headline: "Listen like you mean it. Then be heard.",
    points: [
      { k: "Understand first", v: "Curiosity is the entry fee. Seek to understand before you seek to be understood." },
      { k: "Read the whole message", v: "Words are the smallest slice. Tone and body carry most of what you hear." },
      { k: "Then speak", v: "When it's your turn, be clear, specific, and shaped around the person listening." },
    ],
    quote: "People don't care how much you know until they know how much you care.",
    quoteSrc: "— Stephen R. Covey",
  },

  /* --- credits ----------------------------------------------------------- */
  credits: {
    books: [
      "Sean Covey — The 7 Habits of Highly Effective Teens (Habit 5; the five poor listening styles; the mirroring exercise).",
      "Stephen R. Covey — The 7 Habits of Highly Effective People (empathic vs. autobiographical listening; the four autobiographical responses; the Others' Perception law; the ask–listen–adjust loop).",
      "Albert Mehrabian — research on communicating feelings (the 7 / 38 / 55 breakdown, as cited by Covey).",
    ],
    notes: [
      "The practice loop and the listening lab are original teaching aids built on the book's principles — they are not terms from the book.",
      "Quotations are attributed to their authors. The talk track on each slide is in the speaker-notes panel (press S).",
    ],
  },
};

/* Speaker notes, keyed by slide id. Shown in the notes panel (press S). */
const NOTES = {
  title: "Warm-up: ask the room to remember the last time someone really listened to them. Almost no hands go up. That's the gap we're closing today. 60 minutes, one habit, a lot of practice.",
  map: "Habit 5 is the hinge of the whole system. Habits 1-3 are about you; 4-6 need other people; 7 keeps the whole engine alive. Covey's line: the more you seek first to understand, the more effectively you can go for win-win solutions.",
  intent: "This is the whole habit in one sentence. Most of us listen with a script already loaded. Name the gap: 'I was listening to reply.' Pause on 'reply' — that's the habit-breaking habit.",
  signals: "Mehrabian's numbers, cited by Covey. Be honest about the caveat: they're from research on communicating feelings, not on all communication. The teaching point survives: words are the smallest slice of what people receive.",
  ears: "Simple, memorable, slightly provocative: two ears, one mouth. If you want to be heard more, listen more. Ask the room to count their own interruptions this week.",
  perception: "Others' Perception. Same hallway, two completely different movies. Key line: you cannot change how someone sees the world by trying to change them — including how they see you.",
  styles: "Go through the five cards and let the room recognise themselves. Most rooms laugh at 'Spacing Out' and get quiet at 'Self-Centred Listening'. Each card has a fix — read those.",
  loop: "This is our practice routine, built from the book's principles. The hardest step for most people is 4: Hold. Silence feels like failure; it is actually the moment the other person keeps talking.",
  mirror: "Mirroring is the single most useful tool. Demonstrate badly, then well. Key distinction: mirroring is not agreement — it is proof of attention.",
  auto: "Autobiographical listening = your autobiography in the way. Use the strawberry example: 'plant' vs 'fruit' — both are true, and the argument was never about fruit. Covey: when I can explain your point of view as well as you can, then I speak.",
  trap: "The most important slide for a mature audience. Understanding is not excusing. Separating 'I understand why' from 'I accept this' is the skill that protects the relationship from the habit.",
  understood: "Covey's loop: ask for feedback, listen to it, adjust. Teens often think being clear means saying it once, louder. Say it once, then check.",
  lab: "Run it live. 6 scenarios, 2 minutes, then debrief. Ask which question they found hardest — usually the one where someone was upset and they wanted to fix it.",
  timer: "60 seconds of deliberate silence, then 60 seconds of observation. Ask for one thing they noticed that they would normally have interrupted.",
  plan: "One commitment, written, specific. Read them a few out loud — commitments said out loud get kept. They save to this browser and can print the card.",
  recap: "Land the headline. 'Understand first, then speak.' Then the Covey quote, and stop.",
  credits: "Leave this up during Q&A.",
};

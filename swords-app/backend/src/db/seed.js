import sql from "../../db/client.js";

function getDifficulty(innerWord) {
  if (innerWord.length <= 4) return "easy";
  if (innerWord.length <= 5) return "medium";
  return "hard";
}

const PUZZLES = [
  { outer: "slaughter",    inner: "laugh",    start: 1 },
  { outer: "encompassing", inner: "compass",  start: 2 },
  { outer: "intoxicate",   inner: "toxic",    start: 2 },
  { outer: "sweepstake",   inner: "weeps",    start: 1 },
  { outer: "acquaintance", inner: "quaint",   start: 2 },
  { outer: "demoralizing", inner: "moral",    start: 2 },
  { outer: "displacement", inner: "place",    start: 3 },
  { outer: "uninterested", inner: "interest", start: 2 },
  { outer: "acknowledge",  inner: "know",     start: 2 },
  { outer: "presidents",   inner: "resident", start: 1 },
  { outer: "kerosene",     inner: "rose",     start: 2 },
  { outer: "chambers",     inner: "amber",    start: 2 },
  { outer: "stagnated",    inner: "gnat",     start: 3 },
  { outer: "factorial",    inner: "actor",    start: 1 },
  { outer: "lotteries",    inner: "otter",    start: 1 },
  { outer: "overheard",    inner: "hear",     start: 4 },
  { outer: "sidetracked",  inner: "track",    start: 4 },
  { outer: "paraphrased",  inner: "phrase",   start: 4 },
  { outer: "frankfurter",  inner: "rank",     start: 1 },
  { outer: "cripples",     inner: "ripple",   start: 1 },
  { outer: "unearths",     inner: "earth",    start: 2 },
  { outer: "teetotalers",  inner: "total",    start: 3 },
  { outer: "courageously", inner: "rage",     start: 3 },
  { outer: "porpoises",    inner: "poise",    start: 3 },
  { outer: "installed",    inner: "stall",    start: 2 },
  { outer: "debunking",    inner: "bunk",     start: 2 },
  { outer: "proffers",     inner: "offer",    start: 2 },
  { outer: "refreshed",    inner: "fresh",    start: 2 },
  { outer: "distressing",  inner: "stress",   start: 2 },
  { outer: "sustained",    inner: "stain",    start: 2 },
  { outer: "pinpointed",   inner: "point",    start: 3 },
  { outer: "environments", inner: "iron",     start: 3 },
  { outer: "blackened",    inner: "lack",     start: 1 },
  { outer: "chastens",     inner: "hasten",   start: 1 },
  { outer: "addictions",   inner: "diction",  start: 2 },
  { outer: "deflation",    inner: "flat",     start: 2 },
  { outer: "identical",    inner: "dent",     start: 1 },
  { outer: "gravelling",   inner: "ravel",    start: 1 },
  { outer: "equipping",    inner: "quip",     start: 1 },
  { outer: "manhandling",  inner: "hand",     start: 3 },
];

// Hints sourced from the prototype (vague → warm → warmer → obvious)
const HINTS = {
  slaughter:    ["Something joyful hides here", "A sound you make when amused", "Rhymes with 'calf'", "Express amusement out loud"],
  encompassing: ["It helps you find your way", "Used for navigation", "Has a needle that points north", "_ _ M P A S S"],
  intoxicate:   ["Something dangerous", "Related to poison", "5 letters, means harmful", "_ O X I _"],
  sweepstake:   ["An emotional reaction", "Involves tears", "What someone does when very sad", "_ E E P S"],
  acquaintance: ["A positive adjective", "Describes a charming cottage", "Old-fashioned in an appealing way", "_ U A I N _"],
  demoralizing: ["Related to right and wrong", "A lesson from a fable", "Ethics, principles", "_ O R A _"],
  displacement: ["Could be anywhere", "A location or spot", "5 letters", "_ L A C _"],
  uninterested: ["Banks charge this", "Curiosity or a rate", "8 letters — a long one!", "Starts with I, ends with T"],
  acknowledge:  ["Related to understanding", "Very common 4-letter word", "The opposite of ignorance", "_ N O _"],
  presidents:   ["Someone who lives somewhere", "An occupant or inhabitant", "8 letters long", "Starts with R"],
  kerosene:     ["Found in a garden", "A classic romantic gift", "A type of flower", "_ O S _"],
  chambers:     ["Think of color or gemstones", "A warm golden hue", "Fossilized tree resin", "_ M B E _"],
  stagnated:    ["A tiny creature", "Buzzes around your face in summer", "A small flying insect", "_ N A _"],
  factorial:    ["Works in entertainment", "Seen on stage or screen", "Plays a role", "_ C T O _"],
  lotteries:    ["An adorable animal", "Loves to swim and play", "Holds hands while sleeping", "_ T T E _"],
  overheard:    ["One of the five senses", "Done with your ears", "4 letters", "_ E A _"],
  sidetracked:  ["Found at a train station", "A path or course", "Athletes run on one", "_ R A C _"],
  paraphrased:  ["A unit of language", "A group of words", "Shorter than a sentence", "_ H R A S _"],
  frankfurter:  ["Related to order or position", "Military people have one", "Rhymes with 'bank'", "_ A N _"],
  cripples:     ["Seen on water", "A small wave or disturbance", "Drop a stone in a pond", "_ I P P L _"],
  unearths:     ["Beneath your feet", "The third planet", "Soil or our world", "_ A R T _"],
  teetotalers:  ["Related to numbers", "A complete sum", "Add everything up", "_ O T A _"],
  courageously: ["A powerful emotion", "More intense than anger", "4 letters, fiery", "_ A G _"],
  porpoises:    ["A quality of elegance", "Grace under pressure", "Balance and composure", "_ O I S _"],
  installed:    ["Can mean to delay", "Found in a barn or market", "A booth or compartment", "_ T A L _"],
  debunking:    ["Can be a type of bed", "Also means nonsense", "4 letters", "_ U N _"],
  proffers:     ["Something you might accept", "A proposal or deal", "To present something", "_ F F E _"],
  refreshed:    ["The opposite of stale", "Newly made or clean", "5 letters", "_ R E S _"],
  distressing:  ["A modern epidemic", "Pressure or tension", "What deadlines cause", "_ T R E S _"],
  sustained:    ["Hard to remove from clothes", "A mark or blemish", "Wine makes a red one", "_ T A I _"],
  pinpointed:   ["A sharp end", "A score in a game", "Can mean a location", "_ O I N _"],
  environments: ["A metal element", "Used to press clothes", "Strong as ___", "_ R O _"],
  blackened:    ["An absence", "To be without", "4 letters, means deficit", "_ A C _"],
  chastens:     ["To do something quickly", "Speed up!", "Means to hurry", "_ A S T E _"],
  addictions:   ["Related to speech", "How you pronounce words", "Style of speaking", "_ I C T I O _"],
  deflation:    ["Level, no bumps", "Like a pancake", "The opposite of hilly", "_ L A _"],
  identical:    ["Damage to a car", "A small depression", "What a fender bender leaves", "_ E N _"],
  gravelling:   ["To untangle or come apart", "The opposite of knitting together", "5 letters", "_ A V E _"],
  equipping:    ["A type of humor", "A clever one-liner", "A witty remark", "_ U I _"],
  manhandling:  ["At the end of your arm", "You wave with it", "Has five fingers", "_ A N _"],
};

async function seed() {
  console.log("Seeding puzzles…");

  const rows = PUZZLES.map(p => ({
    outer_word:  p.outer,
    inner_word:  p.inner,
    start_index: p.start,
    hints:       JSON.stringify(HINTS[p.outer]),
    difficulty:  getDifficulty(p.inner),
  }));

  await sql`TRUNCATE puzzles RESTART IDENTITY`;

  for (const row of rows) {
    await sql`
      INSERT INTO puzzles (outer_word, inner_word, start_index, hints, difficulty)
      VALUES (${row.outer_word}, ${row.inner_word}, ${row.start_index}, ${row.hints}, ${row.difficulty})
    `;
  }

  console.log(`Inserted ${rows.length} puzzles.`);
  await sql.end();
}

seed().catch(err => { console.error(err); process.exit(1); });

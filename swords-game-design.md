# sWORDs

**Game Design Document**
*MVP Specification & Reference*

---

## 1. Concept

sWORDs is a browser-based word puzzle game. Players are shown a word with some letters replaced by question marks. Those hidden letters spell a smaller word concealed inside the larger one. The player must figure out what the hidden word is.

The name itself demonstrates the mechanic: the word WORD is buried inside the word sWORDs.

### Core Loop

1. Player sees a word with hidden letters (shown as ? marks)
2. The visible letters provide context; the hidden letters form a real word
3. Player can optionally reveal progressive hints (at increasing point cost)
4. Player types their guess and submits
5. Correct guess reveals the word and awards points; wrong guess is shown as a strikethrough

---

## 2. Game Modes

### Daily 3

- 3 puzzles per day, same for all players
- Puzzles are deterministically selected using a seed derived from the current date
- Progressive difficulty: Easy → Medium → Hard
- Results screen shows total score out of maximum possible (45 points)

### Endless

- Randomly shuffled puzzles from the full pool
- No fixed end; loops through the puzzle set
- Tracks running score and streak

---

## 3. Difficulty Tiers

Difficulty is determined by the length of the hidden (inner) word:

| Tier | Inner Word Length | Example |
|------|-------------------|---------|
| Easy | 3–4 letters | keROSEne → rose |
| Medium | 5 letters | sLAUGHter → laugh |
| Hard | 6+ letters | cRIPPLEs → ripple |

The puzzle pool analysis (from a ~51,000-word dictionary) found approximately 23,000 valid outer words, with roughly 11,300 having a 4+ letter inner word. This provides a very large pool for puzzle curation.

---

## 4. Scoring System

**Maximum points per puzzle:** 15

Points are reduced by revealing hints. The cost escalates with each hint:

| Hint Level | Label | Cost | Points Remaining |
|------------|-------|------|------------------|
| 1 | Vague | −2 | 13 |
| 2 | Warm | −3 | 10 |
| 3 | Warmer | −4 | 6 |
| 4 | Obvious | −6 | 1 (minimum) |

If a player solves with no hints, they earn the full 15 points. If they use all 4 hints, they still earn 1 point for a correct answer. Giving up earns 0 points and breaks the streak.

**Streak:** Tracked across consecutive correct answers. Resets to 0 on a give-up. Currently display-only but could be used for bonus multipliers in a future version.

---

## 5. Progressive Hint System

Each puzzle has exactly 4 hand-written hints that progress from vague to obvious. This is a core differentiator of the game and the primary mechanism for managing difficulty within a single puzzle.

### Hint Design Guidelines

- **Hint 1 (Vague):** Broad thematic or categorical clue. Should make the player think in the right direction without narrowing too much. Example: "Something joyful hides here."
- **Hint 2 (Warm):** More specific, narrows the category. Example: "A sound you make when amused."
- **Hint 3 (Warmer):** Quite specific, often a near-definition. Example: "Rhymes with calf."
- **Hint 4 (Obvious):** Reveals the letter pattern with blanks for first and last characters. Example: "_ A U G _". This makes the answer nearly certain but still requires the player to type it.

### UI Behavior

- Hints are revealed one at a time via a button
- All previously revealed hints remain visible, stacked vertically
- Each hint has a color-coded label (Vague = cool gray, Warm = muted gold, Warmer = amber, Obvious = bright amber)
- A points bar visually drains as hints are used, showing the player exactly what they stand to lose
- Hint dots (4 small circles) next to the button show how many have been used

---

## 6. Puzzle Data Structure

Each puzzle is a JSON object with the following fields:

| Field | Type | Description |
|-------|------|-------------|
| outer | string | The full word shown to the player (with some letters hidden) |
| inner | string | The hidden word buried inside the outer word |
| start | integer | Zero-based index where the inner word begins in the outer word |
| hints | string[4] | Array of 4 progressive hints, from vague to obvious |

Example:

```json
{
  "outer": "slaughter",
  "inner": "laugh",
  "start": 1,
  "hints": [
    "Something joyful hides here",
    "A sound you make when amused",
    "Rhymes with calf",
    "_ A U G _"
  ]
}
```

### Puzzle Constraints

- The inner word must NOT start at position 0 (the beginning of the outer word)
- The inner word must NOT end at the last character of the outer word
- This ensures the inner word is truly "buried" with at least one visible letter on each side
- Both inner and outer words must be real, recognizable English words
- The inner word should be a common word most players would know

---

## 7. Display Logic

The outer word is rendered as a row of letter tiles:

- **Visible letters:** Light background, dark text. Always shown.
- **Hidden letters:** Dark background, showing "?" until solved/revealed.
- **On solve:** Hidden tiles transition to green background with the revealed letters.
- **On give-up:** Hidden tiles transition to red background with the revealed letters.

A shake animation plays on incorrect guesses. A brief scale-up animation plays on the hidden tiles when the puzzle is solved.

---

## 8. Daily Puzzle Selection

Daily puzzles use deterministic selection so all players get the same puzzles on the same day.

### Algorithm

1. Compute a seed from the date: year × 10000 + month × 100 + day
2. Split the puzzle pool into three arrays by difficulty (easy, medium, hard)
3. Shuffle each array independently using the seed and a linear congruential generator
4. Pick the first puzzle from each shuffled array
5. Present them in order: easy first, then medium, then hard

---

## 9. UI/UX Notes

### Visual Design

- Dark theme with deep navy/indigo gradient background
- Gold accent color (#C9B99A) for primary actions and branding
- Monospace font (DM Mono) for game elements; serif (Playfair Display) for the title
- Card-based layout centered on screen, max-width 480px

### Interactions

- Text input auto-focuses on round start
- Enter key submits guess
- Input strips non-alpha characters
- Give Up button appears only after 2+ wrong guesses
- Wrong guesses displayed as struck-through tags above the input

---

## 10. Future Considerations

The following are not in the prototype but are natural extensions for an MVP or beyond:

- **Share results:** Generate a spoiler-free emoji grid (like Wordle) showing hint usage and solve status for each puzzle.
- **Streak bonus:** Award multiplier points for consecutive solves without hints.
- **Timed mode:** Optional countdown timer per puzzle for competitive play.
- **Puzzle curation pipeline:** Tool to generate candidate puzzles from a dictionary and batch-write hints (potentially AI-assisted).
- **User accounts & leaderboards:** Persist daily scores, track all-time stats, compare with friends.
- **Sound effects:** Audio feedback for correct/incorrect guesses, hint reveals.
- **Accessibility:** Screen reader support, keyboard navigation, high contrast mode.
- **Mobile optimization:** Touch-friendly input, responsive tile sizing, swipe gestures.

---

## 11. Prototype Puzzle Inventory

The current prototype contains 40 hand-curated puzzles. Below is the full list with difficulty classification.

| Outer Word | Inner Word | Difficulty | Hint 1 (Vague) |
|------------|------------|------------|----------------|
| slaughter | laugh | Medium | Something joyful hides here |
| encompassing | compass | Hard | It helps you find your way |
| intoxicate | toxic | Medium | Something dangerous |
| sweepstake | weeps | Medium | An emotional reaction |
| acquaintance | quaint | Hard | A positive adjective |
| demoralizing | moral | Medium | Related to right and wrong |
| displacement | place | Medium | Could be anywhere |
| uninterested | interest | Hard | Banks charge this |
| acknowledge | know | Easy | Related to understanding |
| presidents | resident | Hard | Someone who lives somewhere |
| kerosene | rose | Easy | Found in a garden |
| chambers | amber | Medium | Think of color or gemstones |
| stagnated | gnat | Easy | A tiny creature |
| factorial | actor | Medium | Works in entertainment |
| lotteries | otter | Medium | An adorable animal |
| overheard | hear | Easy | One of the five senses |
| sidetracked | track | Medium | Found at a train station |
| paraphrased | phrase | Hard | A unit of language |
| frankfurter | rank | Easy | Related to order or position |
| cripples | ripple | Hard | Seen on water |
| unearths | earth | Medium | Beneath your feet |
| teetotalers | total | Medium | Related to numbers |
| courageously | rage | Easy | A powerful emotion |
| porpoises | poise | Medium | A quality of elegance |
| installed | stall | Medium | Can mean to delay |
| debunking | bunk | Easy | Can be a type of bed |
| proffers | offer | Medium | Something you might accept |
| refreshed | fresh | Medium | The opposite of stale |
| distressing | stress | Hard | A modern epidemic |
| sustained | stain | Medium | Hard to remove from clothes |
| pinpointed | point | Medium | A sharp end |
| environments | iron | Easy | A metal element |
| blackened | lack | Easy | An absence |
| chastens | hasten | Hard | To do something quickly |
| addictions | diction | Hard | Related to speech |
| deflation | flat | Easy | Level, no bumps |
| identical | dent | Easy | Damage to a car |
| gravelling | ravel | Medium | To untangle or come apart |
| equipping | quip | Easy | A type of humor |
| manhandling | hand | Easy | At the end of your arm |

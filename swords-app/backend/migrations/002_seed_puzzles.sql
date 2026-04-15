-- Migration 002: Seed 40 prototype puzzles
INSERT INTO puzzles (outer_word, inner_word, start_index, hints, difficulty) VALUES

-- EASY (inner word 3–4 letters)
('acknowledge', 'know', 2,    '["Related to understanding","What you do when you learn something","A verb meaning to be aware of","_ N O _"]', 'easy'),
('kerosene',    'rose', 2,    '["Found in a garden","A classic romantic flower","Often given on Valentine''s Day","_ O S _"]', 'easy'),
('stagnated',   'gnat', 3,    '["A tiny creature","A buzzing insect","A small fly that bites","_ N A _"]', 'easy'),
('overheard',   'hear', 4,    '["One of the five senses","What your ears do","Listen closely","_ E A _"]', 'easy'),
('frankfurter', 'rank', 1,    '["Related to order or position","An arrangement from first to last","A row or level in a hierarchy","_ A N _"]', 'easy'),
('unearths',    'earth', 2,   '["Beneath your feet","Where plants grow","The ground below us","_ A R T _"]', 'easy'),
('courageously', 'rage', 3,   '["A powerful emotion","Extreme anger","Fury or outrage","_ A G _"]', 'easy'),
('debunking',   'bunk', 2,    '["Can be a type of bed","Shared sleeping quarters","Stacked sleeping berths","_ U N _"]', 'easy'),
('environments','iron', 3,    '["A metal element","Used to smooth clothes","A heavy metallic element","_ R O _"]', 'easy'),
('blackened',   'lack', 1,    '["An absence","Not having enough of something","A shortage or void","_ A C _"]', 'easy'),
('deflation',   'flat', 2,    '["Level, no bumps","Smooth and even","Without any height","_ L A _"]', 'easy'),
('identical',   'dent', 1,    '["Damage to a car","A small hollow or indentation","Left by an impact","_ E N _"]', 'easy'),
('equipping',   'quip', 1,    '["A type of humor","A witty remark","A clever joke or retort","_ U I _"]', 'easy'),
('manhandling', 'hand', 3,    '["At the end of your arm","You have five fingers on each","Used for gripping and waving","_ A N _"]', 'easy'),

-- MEDIUM (inner word 5 letters)
('slaughter',   'laugh', 1,   '["Something joyful hides here","A sound you make when amused","Rhymes with calf","_ A U G _"]', 'medium'),
('intoxicate',  'toxic', 2,   '["Something dangerous","Harmful to living things","Poisonous","_ O X I _"]', 'medium'),
('sweepstake',  'weeps', 1,   '["An emotional reaction","Shedding tears","What you do when you cry","_ E E P _"]', 'medium'),
('demoralizing','moral', 2,   '["Related to right and wrong","About ethics and principles","A lesson in a fable","_ O R A _"]', 'medium'),
('displacement','place', 3,   '["Could be anywhere","A location or spot","Where something is situated","_ L A C _"]', 'medium'),
('chambers',    'amber', 2,   '["Think of color or gemstones","A golden-brown hue","Fossilized tree resin","_ M B E _"]', 'medium'),
('factorial',   'actor', 1,   '["Works in entertainment","Performs on stage or screen","Stars in films or plays","_ C T O _"]', 'medium'),
('lotteries',   'otter', 1,   '["An adorable animal","A semi-aquatic mammal","Loves rivers and eating fish","_ T T E _"]', 'medium'),
('sidetracked', 'track', 4,   '["Found at a train station","A path or course","Rails for a train to run on","_ R A C _"]', 'medium'),
('cripples',    'ripple', 1,  '["Seen on water","A small wave spreading outward","What a stone makes in a pond","_ I P P L _"]', 'medium'),
('teetotalers', 'total', 3,   '["Related to numbers","The sum of everything","An all-inclusive count","_ O T A _"]', 'medium'),
('porpoises',   'poise', 3,   '["A quality of elegance","Graceful self-assurance","Composure and balance","_ O I S _"]', 'medium'),
('installed',   'stall', 2,   '["Can mean to delay","To hold back or hesitate","A market booth or delay tactic","_ T A L _"]', 'medium'),
('proffers',    'offer', 2,   '["Something you might accept","A proposal or bid","What you make when negotiating","_ F F E _"]', 'medium'),
('refreshed',   'fresh', 2,   '["The opposite of stale","Newly made or recently arrived","Cool and invigorating","_ R E S _"]', 'medium'),
('sustained',   'stain', 2,   '["Hard to remove from clothes","A mark left by spilled liquid","A blemish or blot","_ T A I _"]', 'medium'),
('pinpointed',  'point', 3,   '["A sharp end","The tip of a needle","The precise end of something sharp","_ O I N _"]', 'medium'),
('gravelling',  'ravel', 2,   '["To untangle or come apart","To undo threads or explain","To separate into threads","_ A V E _"]', 'medium'),

-- HARD (inner word 6+ letters)
('encompassing','compass', 2, '["It helps you find your way","A navigation tool","Points toward magnetic north","_ O M P A S _"]', 'hard'),
('acquaintance','quaint', 2,  '["A positive adjective","Attractively unusual","Charmingly old-fashioned","_ U A I N _"]', 'hard'),
('uninterested','interest', 2,'["Banks charge this","A fee for borrowing money","A percentage added to a loan","_ N T E R E S _"]', 'hard'),
('presidents',  'resident', 1,'["Someone who lives somewhere","A person dwelling in a place","An inhabitant of a location","_ E S I D E N _"]', 'hard'),
('paraphrased', 'phrase', 4,  '["A unit of language","A short group of words","An expression or saying","_ H R A S _"]', 'hard'),
('distressing', 'stress', 2,  '["A modern epidemic","Tension or anxiety","Overwhelming pressure or worry","_ T R E S _"]', 'hard'),
('chastens',    'hasten', 1,  '["To do something quickly","To move with urgency","To hurry or rush","_ A S T E _"]', 'hard'),
('addictions',  'diction', 2, '["Related to speech","The clarity of spoken words","How clearly someone pronounces words","_ I C T I O _"]', 'hard');

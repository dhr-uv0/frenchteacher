/**
 * EntreCultures 1 ©2026 — Complete French 1 Curriculum Data
 * Standard Parisian French with correct accent marks throughout.
 */

export interface VocabItem {
  key: string;
  french: string;
  english: string;
  partOfSpeech: string;
  unit: number;
  tricky?: boolean; // if true → play audio pronunciation
  audioHint?: string; // IPA or phonetic hint
  gender?: "m" | "f";
  plural?: string;
}

export interface GrammarRule {
  id: string;
  unit: number;
  title: string;
  explanation: string; // plain English
  examples: { french: string; english: string }[];
  tables?: GrammarTable[];
}

export interface GrammarTable {
  title: string;
  headers: string[];
  rows: { label: string; cells: string[] }[];
}

export interface UnitMeta {
  number: number;
  title: string;
  subtitle: string;
  color: string; // tailwind color name
  topics: string[];
}

// ─── UNIT METADATA ────────────────────────────────────────────────────────────

export const UNITS: UnitMeta[] = [
  {
    number: 1,
    title: "Bonjour !",
    subtitle: "Greetings, identity, and the world of French",
    color: "blue",
    topics: [
      "Greetings & farewells",
      "The French alphabet",
      "Numbers 0–30",
      "Verb être (to be)",
      "Subject pronouns",
      "Nationality adjectives",
      "Personality adjectives",
      "Gender agreement",
      "Indefinite articles",
      "La Francophonie",
    ],
  },
  {
    number: 2,
    title: "Qu'est-ce que tu aimes ?",
    subtitle: "Hobbies, schedules, and daily life",
    color: "emerald",
    topics: [
      "Regular -ER verb conjugation",
      "Ne...pas negation",
      "Definite articles",
      "Question formation",
      "Numbers 31–100",
      "Days of the week",
      "Telling time",
      "Hobbies & activities",
    ],
  },
  {
    number: 3,
    title: "À l'école et en famille",
    subtitle: "School life, family, opinions, and descriptions",
    color: "violet",
    topics: [
      "School subjects & opinions",
      "Family vocabulary",
      "Verb avoir (to have)",
      "Possessive adjectives (mon–leurs)",
      "Age with avoir",
      "Adjective agreement & placement",
      "Physical descriptions",
      "Irregular adjectives (beau/vieux/nouveau)",
      "Frequency adverbs",
      "Colors",
      "School supplies",
    ],
  },
  {
    number: 4,
    title: "Ma journée",
    subtitle: "Daily routines, activities, and going places",
    color: "orange",
    topics: [
      "Daily routine vocabulary",
      "Regular -IR verbs (finir, choisir)",
      "Faire expressions (faire du sport, etc.)",
      "Weather expressions",
      "Days & time expressions",
      "Aller + contractions (au/aux/à la/à l')",
      "Near future (aller + infinitive)",
    ],
  },
  {
    number: 5,
    title: "Chez moi",
    subtitle: "Home, places, and future plans",
    color: "rose",
    topics: [
      "House & room vocabulary",
      "Prepositions of place",
      "Aller with contractions (au/aux/à la/à l')",
      "Near future (aller + infinitive)",
      "Verb venir",
    ],
  },
  {
    number: 6,
    title: "À table !",
    subtitle: "Food, restaurants, and French café culture",
    color: "amber",
    topics: [
      "Food & restaurant vocabulary",
      "Partitive articles",
      "Verbs vouloir and pouvoir",
      "Ordering food dialogue",
      "French café culture",
    ],
  },
];

// ─── UNIT 1 VOCABULARY ────────────────────────────────────────────────────────

export const VOCAB_UNIT1: VocabItem[] = [
  // Greetings
  { key: "u1_bonjour", french: "Bonjour", english: "Hello / Good morning", partOfSpeech: "greeting", unit: 1 },
  { key: "u1_bonsoir", french: "Bonsoir", english: "Good evening", partOfSpeech: "greeting", unit: 1 },
  { key: "u1_salut", french: "Salut", english: "Hi / Bye (informal)", partOfSpeech: "greeting", unit: 1 },
  { key: "u1_au_revoir", french: "Au revoir", english: "Goodbye", partOfSpeech: "greeting", unit: 1 },
  { key: "u1_a_bientot", french: "À bientôt", english: "See you soon", partOfSpeech: "greeting", unit: 1, tricky: true, audioHint: "ah byan-TOH" },
  { key: "u1_a_demain", french: "À demain", english: "See you tomorrow", partOfSpeech: "greeting", unit: 1 },
  { key: "u1_bonne_nuit", french: "Bonne nuit", english: "Good night", partOfSpeech: "greeting", unit: 1 },
  { key: "u1_comment_tu_tappelles", french: "Comment tu t'appelles ?", english: "What is your name?", partOfSpeech: "phrase", unit: 1, tricky: true, audioHint: "koh-MON too tah-PELL" },
  { key: "u1_je_mappelle", french: "Je m'appelle…", english: "My name is…", partOfSpeech: "phrase", unit: 1, tricky: true, audioHint: "zhuh mah-PELL" },
  { key: "u1_ca_va", french: "Ça va ?", english: "How's it going?", partOfSpeech: "phrase", unit: 1, tricky: true, audioHint: "sah VAH" },
  { key: "u1_ca_va_bien", french: "Ça va bien.", english: "It's going well.", partOfSpeech: "phrase", unit: 1 },
  { key: "u1_comme_ci", french: "Comme ci, comme ça.", english: "So-so.", partOfSpeech: "phrase", unit: 1, tricky: true },
  { key: "u1_pas_tres_bien", french: "Pas très bien.", english: "Not very well.", partOfSpeech: "phrase", unit: 1 },
  { key: "u1_merci", french: "Merci", english: "Thank you", partOfSpeech: "expression", unit: 1 },
  { key: "u1_de_rien", french: "De rien", english: "You're welcome", partOfSpeech: "expression", unit: 1 },
  { key: "u1_sil_vous_plait", french: "S'il vous plaît", english: "Please (formal)", partOfSpeech: "expression", unit: 1, tricky: true, audioHint: "seel voo PLAY" },
  { key: "u1_sil_te_plait", french: "S'il te plaît", english: "Please (informal)", partOfSpeech: "expression", unit: 1 },
  { key: "u1_excusez_moi", french: "Excusez-moi", english: "Excuse me (formal)", partOfSpeech: "expression", unit: 1 },
  { key: "u1_pardon", french: "Pardon", english: "Pardon / Sorry", partOfSpeech: "expression", unit: 1 },
  { key: "u1_monsieur", french: "Monsieur", english: "Mr. / Sir", partOfSpeech: "title", unit: 1, tricky: true, audioHint: "muh-SYUH" },
  { key: "u1_madame", french: "Madame", english: "Mrs. / Ma'am", partOfSpeech: "title", unit: 1 },
  // Numbers 0-30
  { key: "u1_zero", french: "zéro", english: "zero", partOfSpeech: "number", unit: 1 },
  { key: "u1_un", french: "un / une", english: "one", partOfSpeech: "number", unit: 1 },
  { key: "u1_deux", french: "deux", english: "two", partOfSpeech: "number", unit: 1 },
  { key: "u1_trois", french: "trois", english: "three", partOfSpeech: "number", unit: 1, tricky: true, audioHint: "TWAH" },
  { key: "u1_quatre", french: "quatre", english: "four", partOfSpeech: "number", unit: 1, tricky: true, audioHint: "KAH-truh" },
  { key: "u1_cinq", french: "cinq", english: "five", partOfSpeech: "number", unit: 1, tricky: true, audioHint: "SANK" },
  { key: "u1_six", french: "six", english: "six", partOfSpeech: "number", unit: 1, tricky: true, audioHint: "SEES" },
  { key: "u1_sept", french: "sept", english: "seven", partOfSpeech: "number", unit: 1, tricky: true, audioHint: "SET" },
  { key: "u1_huit", french: "huit", english: "eight", partOfSpeech: "number", unit: 1, tricky: true, audioHint: "WEET" },
  { key: "u1_neuf", french: "neuf", english: "nine", partOfSpeech: "number", unit: 1, tricky: true, audioHint: "NUF" },
  { key: "u1_dix", french: "dix", english: "ten", partOfSpeech: "number", unit: 1, tricky: true, audioHint: "DEES" },
  { key: "u1_onze", french: "onze", english: "eleven", partOfSpeech: "number", unit: 1 },
  { key: "u1_douze", french: "douze", english: "twelve", partOfSpeech: "number", unit: 1 },
  { key: "u1_treize", french: "treize", english: "thirteen", partOfSpeech: "number", unit: 1 },
  { key: "u1_quatorze", french: "quatorze", english: "fourteen", partOfSpeech: "number", unit: 1 },
  { key: "u1_quinze", french: "quinze", english: "fifteen", partOfSpeech: "number", unit: 1, tricky: true, audioHint: "KANZ" },
  { key: "u1_seize", french: "seize", english: "sixteen", partOfSpeech: "number", unit: 1 },
  { key: "u1_dix_sept", french: "dix-sept", english: "seventeen", partOfSpeech: "number", unit: 1 },
  { key: "u1_dix_huit", french: "dix-huit", english: "eighteen", partOfSpeech: "number", unit: 1 },
  { key: "u1_dix_neuf", french: "dix-neuf", english: "nineteen", partOfSpeech: "number", unit: 1 },
  { key: "u1_vingt", french: "vingt", english: "twenty", partOfSpeech: "number", unit: 1, tricky: true, audioHint: "VAN" },
  { key: "u1_vingt_et_un", french: "vingt et un", english: "twenty-one", partOfSpeech: "number", unit: 1 },
  { key: "u1_trente", french: "trente", english: "thirty", partOfSpeech: "number", unit: 1 },
  // Subject pronouns
  { key: "u1_je", french: "je", english: "I", partOfSpeech: "pronoun", unit: 1 },
  { key: "u1_tu", french: "tu", english: "you (informal singular)", partOfSpeech: "pronoun", unit: 1 },
  { key: "u1_il", french: "il", english: "he / it (masc.)", partOfSpeech: "pronoun", unit: 1 },
  { key: "u1_elle", french: "elle", english: "she / it (fem.)", partOfSpeech: "pronoun", unit: 1 },
  { key: "u1_nous", french: "nous", english: "we", partOfSpeech: "pronoun", unit: 1 },
  { key: "u1_vous", french: "vous", english: "you (formal/plural)", partOfSpeech: "pronoun", unit: 1 },
  { key: "u1_ils", french: "ils", english: "they (masc./mixed)", partOfSpeech: "pronoun", unit: 1 },
  { key: "u1_elles", french: "elles", english: "they (all feminine)", partOfSpeech: "pronoun", unit: 1 },
  { key: "u1_on", french: "on", english: "one / we (informal)", partOfSpeech: "pronoun", unit: 1 },
  // Nationality adjectives
  { key: "u1_francais", french: "français / française", english: "French", partOfSpeech: "adjective", unit: 1, tricky: true },
  { key: "u1_americain", french: "américain / américaine", english: "American", partOfSpeech: "adjective", unit: 1 },
  { key: "u1_canadien", french: "canadien / canadienne", english: "Canadian", partOfSpeech: "adjective", unit: 1, tricky: true },
  { key: "u1_mexicain", french: "mexicain / mexicaine", english: "Mexican", partOfSpeech: "adjective", unit: 1 },
  { key: "u1_senegalais", french: "sénégalais / sénégalaise", english: "Senegalese", partOfSpeech: "adjective", unit: 1 },
  { key: "u1_marocain", french: "marocain / marocaine", english: "Moroccan", partOfSpeech: "adjective", unit: 1 },
  { key: "u1_belge", french: "belge", english: "Belgian", partOfSpeech: "adjective", unit: 1 },
  { key: "u1_suisse", french: "suisse", english: "Swiss", partOfSpeech: "adjective", unit: 1 },
  { key: "u1_haitien", french: "haïtien / haïtienne", english: "Haitian", partOfSpeech: "adjective", unit: 1, tricky: true, audioHint: "ah-ee-SYAN" },
  // Personality adjectives
  { key: "u1_sympa", french: "sympa", english: "nice / friendly", partOfSpeech: "adjective", unit: 1 },
  { key: "u1_timide", french: "timide", english: "shy / timid", partOfSpeech: "adjective", unit: 1 },
  { key: "u1_drole", french: "drôle", english: "funny", partOfSpeech: "adjective", unit: 1, tricky: true, audioHint: "DROHL" },
  { key: "u1_intelligent", french: "intelligent / intelligente", english: "intelligent / smart", partOfSpeech: "adjective", unit: 1 },
  { key: "u1_sportif", french: "sportif / sportive", english: "athletic / sporty", partOfSpeech: "adjective", unit: 1 },
  { key: "u1_serieux", french: "sérieux / sérieuse", english: "serious", partOfSpeech: "adjective", unit: 1, tricky: true },
  { key: "u1_genereux", french: "généreux / généreuse", english: "generous", partOfSpeech: "adjective", unit: 1 },
  { key: "u1_paresseux", french: "paresseux / paresseuse", english: "lazy", partOfSpeech: "adjective", unit: 1 },
  { key: "u1_bavard", french: "bavard / bavarde", english: "talkative", partOfSpeech: "adjective", unit: 1 },
  { key: "u1_calme", french: "calme", english: "calm / quiet", partOfSpeech: "adjective", unit: 1 },
  { key: "u1_sociable", french: "sociable", english: "sociable / outgoing", partOfSpeech: "adjective", unit: 1 },
  // Indefinite articles
  { key: "u1_un_art", french: "un", english: "a / an (masculine singular)", partOfSpeech: "article", unit: 1 },
  { key: "u1_une_art", french: "une", english: "a / an (feminine singular)", partOfSpeech: "article", unit: 1 },
  { key: "u1_des_art", french: "des", english: "some / (plural indefinite)", partOfSpeech: "article", unit: 1 },
  // Être
  { key: "u1_etre", french: "être", english: "to be", partOfSpeech: "verb", unit: 1, tricky: true, audioHint: "EH-truh" },
  // La Francophonie
  { key: "u1_la_francophonie", french: "la Francophonie", english: "the French-speaking world", partOfSpeech: "noun", unit: 1, gender: "f" },
  { key: "u1_la_france", french: "la France", english: "France", partOfSpeech: "noun", unit: 1, gender: "f" },
  { key: "u1_le_quebec", french: "le Québec", english: "Quebec", partOfSpeech: "noun", unit: 1, gender: "m", tricky: true },
  { key: "u1_le_senegal", french: "le Sénégal", english: "Senegal", partOfSpeech: "noun", unit: 1, gender: "m" },
  { key: "u1_le_maroc", french: "le Maroc", english: "Morocco", partOfSpeech: "noun", unit: 1, gender: "m" },
  { key: "u1_haiti", french: "Haïti", english: "Haiti", partOfSpeech: "noun", unit: 1, tricky: true, audioHint: "ah-ee-TEE" },
  { key: "u1_la_belgique", french: "la Belgique", english: "Belgium", partOfSpeech: "noun", unit: 1, gender: "f" },
  { key: "u1_la_suisse", french: "la Suisse", english: "Switzerland", partOfSpeech: "noun", unit: 1, gender: "f" },
];

// ─── UNIT 2 VOCABULARY ────────────────────────────────────────────────────────

export const VOCAB_UNIT2: VocabItem[] = [
  // Days of week
  { key: "u2_lundi", french: "lundi", english: "Monday", partOfSpeech: "noun", unit: 2 },
  { key: "u2_mardi", french: "mardi", english: "Tuesday", partOfSpeech: "noun", unit: 2 },
  { key: "u2_mercredi", french: "mercredi", english: "Wednesday", partOfSpeech: "noun", unit: 2 },
  { key: "u2_jeudi", french: "jeudi", english: "Thursday", partOfSpeech: "noun", unit: 2 },
  { key: "u2_vendredi", french: "vendredi", english: "Friday", partOfSpeech: "noun", unit: 2 },
  { key: "u2_samedi", french: "samedi", english: "Saturday", partOfSpeech: "noun", unit: 2 },
  { key: "u2_dimanche", french: "dimanche", english: "Sunday", partOfSpeech: "noun", unit: 2 },
  // Hobbies / activities
  { key: "u2_ecouter", french: "écouter (de la musique)", english: "to listen (to music)", partOfSpeech: "verb", unit: 2 },
  { key: "u2_regarder", french: "regarder (la télé)", english: "to watch (TV)", partOfSpeech: "verb", unit: 2 },
  { key: "u2_jouer", french: "jouer (au foot)", english: "to play (soccer)", partOfSpeech: "verb", unit: 2 },
  { key: "u2_jouer_jeux", french: "jouer aux jeux vidéo", english: "to play video games", partOfSpeech: "phrase", unit: 2 },
  { key: "u2_danser", french: "danser", english: "to dance", partOfSpeech: "verb", unit: 2 },
  { key: "u2_chanter", french: "chanter", english: "to sing", partOfSpeech: "verb", unit: 2 },
  { key: "u2_dessiner", french: "dessiner", english: "to draw", partOfSpeech: "verb", unit: 2 },
  { key: "u2_nager", french: "nager", english: "to swim", partOfSpeech: "verb", unit: 2 },
  { key: "u2_parler", french: "parler (au téléphone)", english: "to talk (on the phone)", partOfSpeech: "verb", unit: 2 },
  { key: "u2_travailler", french: "travailler", english: "to work", partOfSpeech: "verb", unit: 2 },
  { key: "u2_voyager", french: "voyager", english: "to travel", partOfSpeech: "verb", unit: 2 },
  { key: "u2_manger", french: "manger", english: "to eat", partOfSpeech: "verb", unit: 2 },
  { key: "u2_cuisiner", french: "cuisiner", english: "to cook", partOfSpeech: "verb", unit: 2 },
  { key: "u2_lire", french: "lire", english: "to read", partOfSpeech: "verb", unit: 2 },
  { key: "u2_faire", french: "faire du sport", english: "to play sports", partOfSpeech: "phrase", unit: 2 },
  { key: "u2_surfer", french: "surfer sur Internet", english: "to surf the Internet", partOfSpeech: "phrase", unit: 2 },
  { key: "u2_photographier", french: "faire de la photo", english: "to do photography", partOfSpeech: "phrase", unit: 2 },
  // Definite articles
  { key: "u2_le", french: "le", english: "the (masculine singular)", partOfSpeech: "article", unit: 2 },
  { key: "u2_la", french: "la", english: "the (feminine singular)", partOfSpeech: "article", unit: 2 },
  { key: "u2_l", french: "l'", english: "the (before vowel/h)", partOfSpeech: "article", unit: 2, tricky: true },
  { key: "u2_les", french: "les", english: "the (plural)", partOfSpeech: "article", unit: 2 },
  // Numbers 31-100
  { key: "u2_quarante", french: "quarante", english: "forty", partOfSpeech: "number", unit: 2 },
  { key: "u2_cinquante", french: "cinquante", english: "fifty", partOfSpeech: "number", unit: 2 },
  { key: "u2_soixante", french: "soixante", english: "sixty", partOfSpeech: "number", unit: 2 },
  { key: "u2_soixante_dix", french: "soixante-dix", english: "seventy", partOfSpeech: "number", unit: 2, tricky: true, audioHint: "sixty + ten" },
  { key: "u2_quatre_vingts", french: "quatre-vingts", english: "eighty", partOfSpeech: "number", unit: 2, tricky: true, audioHint: "four twenties" },
  { key: "u2_quatre_vingt_dix", french: "quatre-vingt-dix", english: "ninety", partOfSpeech: "number", unit: 2, tricky: true, audioHint: "four twenties + ten" },
  { key: "u2_cent", french: "cent", english: "one hundred", partOfSpeech: "number", unit: 2 },
  // Time
  { key: "u2_quelle_heure", french: "Quelle heure est-il ?", english: "What time is it?", partOfSpeech: "phrase", unit: 2, tricky: true },
  { key: "u2_il_est", french: "Il est… heure(s).", english: "It is… o'clock.", partOfSpeech: "phrase", unit: 2 },
  { key: "u2_midi", french: "midi", english: "noon", partOfSpeech: "noun", unit: 2 },
  { key: "u2_minuit", french: "minuit", english: "midnight", partOfSpeech: "noun", unit: 2 },
  { key: "u2_et_demi", french: "et demie / et demi", english: "half past", partOfSpeech: "expression", unit: 2 },
  { key: "u2_et_quart", french: "et quart", english: "quarter past", partOfSpeech: "expression", unit: 2 },
  { key: "u2_moins_le_quart", french: "moins le quart", english: "quarter to", partOfSpeech: "expression", unit: 2, tricky: true },
  { key: "u2_du_matin", french: "du matin", english: "in the morning / a.m.", partOfSpeech: "expression", unit: 2 },
  { key: "u2_de_lapres_midi", french: "de l'après-midi", english: "in the afternoon", partOfSpeech: "expression", unit: 2 },
  { key: "u2_du_soir", french: "du soir", english: "in the evening / p.m.", partOfSpeech: "expression", unit: 2 },
  // Questions
  { key: "u2_est_ce_que", french: "Est-ce que…?", english: "Question marker (Do/Does…?)", partOfSpeech: "phrase", unit: 2, tricky: true, audioHint: "ess-kuh" },
  { key: "u2_tu_aimes", french: "Tu aimes… ?", english: "Do you like…?", partOfSpeech: "phrase", unit: 2 },
  { key: "u2_jaime", french: "J'aime…", english: "I like…", partOfSpeech: "phrase", unit: 2 },
  { key: "u2_je_naime_pas", french: "Je n'aime pas…", english: "I don't like…", partOfSpeech: "phrase", unit: 2 },
  { key: "u2_jadore", french: "J'adore…", english: "I love…", partOfSpeech: "phrase", unit: 2 },
  { key: "u2_je_deteste", french: "Je déteste…", english: "I hate…", partOfSpeech: "phrase", unit: 2 },
];

// ─── UNIT 3 VOCABULARY ────────────────────────────────────────────────────────

export const VOCAB_UNIT3: VocabItem[] = [
  // School subjects
  { key: "u3_le_francais", french: "le français", english: "French (class)", partOfSpeech: "noun", unit: 3, gender: "m" },
  { key: "u3_les_maths", french: "les maths", english: "math", partOfSpeech: "noun", unit: 3 },
  { key: "u3_les_sciences", french: "les sciences", english: "science", partOfSpeech: "noun", unit: 3 },
  { key: "u3_lhistoire", french: "l'histoire", english: "history", partOfSpeech: "noun", unit: 3, gender: "f" },
  { key: "u3_la_geo", french: "la géographie", english: "geography", partOfSpeech: "noun", unit: 3, gender: "f" },
  { key: "u3_langues", french: "les langues", english: "languages", partOfSpeech: "noun", unit: 3 },
  { key: "u3_anglais", french: "l'anglais", english: "English (class)", partOfSpeech: "noun", unit: 3, gender: "m" },
  { key: "u3_espagnol", french: "l'espagnol", english: "Spanish (class)", partOfSpeech: "noun", unit: 3, gender: "m" },
  { key: "u3_la_musique", french: "la musique", english: "music (class)", partOfSpeech: "noun", unit: 3, gender: "f" },
  { key: "u3_lart", french: "l'art", english: "art (class)", partOfSpeech: "noun", unit: 3, gender: "m" },
  { key: "u3_leps", french: "l'EPS", english: "P.E. (physical education)", partOfSpeech: "noun", unit: 3, tricky: true },
  { key: "u3_linformatique", french: "l'informatique", english: "computer science", partOfSpeech: "noun", unit: 3, gender: "f" },
  { key: "u3_le_sport", french: "le sport", english: "sports (class)", partOfSpeech: "noun", unit: 3, gender: "m" },
  // Opinions about school
  { key: "u3_cest_facile", french: "C'est facile.", english: "It's easy.", partOfSpeech: "phrase", unit: 3 },
  { key: "u3_cest_difficile", french: "C'est difficile.", english: "It's difficult.", partOfSpeech: "phrase", unit: 3 },
  { key: "u3_cest_interessant", french: "C'est intéressant.", english: "It's interesting.", partOfSpeech: "phrase", unit: 3 },
  { key: "u3_cest_ennuyeux", french: "C'est ennuyeux.", english: "It's boring.", partOfSpeech: "phrase", unit: 3, tricky: true, audioHint: "on-wee-YUH" },
  { key: "u3_cest_super", french: "C'est super !", english: "It's great!", partOfSpeech: "phrase", unit: 3 },
  { key: "u3_cest_nul", french: "C'est nul.", english: "It's terrible / useless.", partOfSpeech: "phrase", unit: 3 },
  { key: "u3_jaime_bien", french: "J'aime bien…", english: "I quite like…", partOfSpeech: "phrase", unit: 3 },
  { key: "u3_je_prefere", french: "Je préfère…", english: "I prefer…", partOfSpeech: "phrase", unit: 3 },
  { key: "u3_je_trouve_que", french: "Je trouve que…", english: "I think that…", partOfSpeech: "phrase", unit: 3 },
  { key: "u3_mon_cours_prefere", french: "mon cours préféré", english: "my favorite class", partOfSpeech: "phrase", unit: 3 },
  // Avoir conjugation
  { key: "u3_avoir", french: "avoir", english: "to have", partOfSpeech: "verb", unit: 3, tricky: true, audioHint: "ah-VWAR" },
  // Frequency adverbs
  { key: "u3_toujours", french: "toujours", english: "always", partOfSpeech: "adverb", unit: 3 },
  { key: "u3_souvent", french: "souvent", english: "often", partOfSpeech: "adverb", unit: 3 },
  { key: "u3_parfois", french: "parfois", english: "sometimes", partOfSpeech: "adverb", unit: 3 },
  { key: "u3_jamais", french: "jamais", english: "never", partOfSpeech: "adverb", unit: 3 },
  { key: "u3_rarement", french: "rarement", english: "rarely", partOfSpeech: "adverb", unit: 3 },
  // Colors
  { key: "u3_rouge", french: "rouge", english: "red", partOfSpeech: "adjective", unit: 3 },
  { key: "u3_bleu", french: "bleu / bleue", english: "blue", partOfSpeech: "adjective", unit: 3 },
  { key: "u3_vert", french: "vert / verte", english: "green", partOfSpeech: "adjective", unit: 3 },
  { key: "u3_jaune", french: "jaune", english: "yellow", partOfSpeech: "adjective", unit: 3 },
  { key: "u3_orange", french: "orange", english: "orange", partOfSpeech: "adjective", unit: 3 },
  { key: "u3_violet", french: "violet / violette", english: "purple / violet", partOfSpeech: "adjective", unit: 3, tricky: true },
  { key: "u3_rose", french: "rose", english: "pink", partOfSpeech: "adjective", unit: 3 },
  { key: "u3_blanc", french: "blanc / blanche", english: "white", partOfSpeech: "adjective", unit: 3, tricky: true },
  { key: "u3_noir", french: "noir / noire", english: "black", partOfSpeech: "adjective", unit: 3 },
  { key: "u3_gris", french: "gris / grise", english: "gray", partOfSpeech: "adjective", unit: 3 },
  { key: "u3_marron", french: "marron", english: "brown", partOfSpeech: "adjective", unit: 3 },
  // School supplies
  { key: "u3_un_cahier", french: "un cahier", english: "a notebook", partOfSpeech: "noun", unit: 3, gender: "m" },
  { key: "u3_un_classeur", french: "un classeur", english: "a binder", partOfSpeech: "noun", unit: 3, gender: "m" },
  { key: "u3_un_crayon", french: "un crayon", english: "a pencil", partOfSpeech: "noun", unit: 3, gender: "m" },
  { key: "u3_un_stylo", french: "un stylo", english: "a pen", partOfSpeech: "noun", unit: 3, gender: "m" },
  { key: "u3_une_gomme", french: "une gomme", english: "an eraser", partOfSpeech: "noun", unit: 3, gender: "f" },
  { key: "u3_un_livre", french: "un livre", english: "a book", partOfSpeech: "noun", unit: 3, gender: "m" },
  { key: "u3_une_regle", french: "une règle", english: "a ruler", partOfSpeech: "noun", unit: 3, gender: "f" },
  { key: "u3_un_sac_a_dos", french: "un sac à dos", english: "a backpack", partOfSpeech: "noun", unit: 3, gender: "m" },
  { key: "u3_un_ordinateur", french: "un ordinateur", english: "a computer", partOfSpeech: "noun", unit: 3, gender: "m" },
  { key: "u3_une_calculatrice", french: "une calculatrice", english: "a calculator", partOfSpeech: "noun", unit: 3, gender: "f", tricky: true },
  { key: "u3_des_ciseaux", french: "des ciseaux", english: "scissors", partOfSpeech: "noun", unit: 3 },
  // Family members (Unit 3 includes family — EntreCultures ©2026)
  { key: "u3_la_famille", french: "la famille", english: "the family", partOfSpeech: "noun", unit: 3, gender: "f" },
  { key: "u3_le_pere", french: "le père", english: "the father", partOfSpeech: "noun", unit: 3, gender: "m" },
  { key: "u3_la_mere", french: "la mère", english: "the mother", partOfSpeech: "noun", unit: 3, gender: "f" },
  { key: "u3_le_frere", french: "le frère", english: "the brother", partOfSpeech: "noun", unit: 3, gender: "m" },
  { key: "u3_la_soeur", french: "la sœur", english: "the sister", partOfSpeech: "noun", unit: 3, gender: "f", tricky: true, audioHint: "sœur = SUR" },
  { key: "u3_le_fils", french: "le fils", english: "the son", partOfSpeech: "noun", unit: 3, gender: "m", tricky: true, audioHint: "FEES" },
  { key: "u3_la_fille", french: "la fille", english: "the daughter / the girl", partOfSpeech: "noun", unit: 3, gender: "f" },
  { key: "u3_le_grand_pere", french: "le grand-père", english: "the grandfather", partOfSpeech: "noun", unit: 3, gender: "m" },
  { key: "u3_la_grand_mere", french: "la grand-mère", english: "the grandmother", partOfSpeech: "noun", unit: 3, gender: "f" },
  { key: "u3_le_cousin", french: "le cousin / la cousine", english: "the cousin", partOfSpeech: "noun", unit: 3 },
  { key: "u3_loncle", french: "l'oncle", english: "the uncle", partOfSpeech: "noun", unit: 3, gender: "m" },
  { key: "u3_la_tante", french: "la tante", english: "the aunt", partOfSpeech: "noun", unit: 3, gender: "f" },
  { key: "u3_les_parents", french: "les parents", english: "the parents", partOfSpeech: "noun", unit: 3 },
  // Possessive adjectives
  { key: "u3_mon", french: "mon / ma / mes", english: "my", partOfSpeech: "adjective", unit: 3, tricky: true },
  { key: "u3_ton", french: "ton / ta / tes", english: "your (informal)", partOfSpeech: "adjective", unit: 3 },
  { key: "u3_son", french: "son / sa / ses", english: "his / her / its", partOfSpeech: "adjective", unit: 3, tricky: true },
  { key: "u3_notre", french: "notre / nos", english: "our", partOfSpeech: "adjective", unit: 3 },
  { key: "u3_leur", french: "leur / leurs", english: "their", partOfSpeech: "adjective", unit: 3, tricky: true },
  // Physical descriptions
  { key: "u3_les_yeux", french: "les yeux", english: "the eyes", partOfSpeech: "noun", unit: 3 },
  { key: "u3_les_cheveux", french: "les cheveux", english: "the hair", partOfSpeech: "noun", unit: 3, tricky: true },
  { key: "u3_grand", french: "grand / grande", english: "tall / big", partOfSpeech: "adjective", unit: 3 },
  { key: "u3_petit", french: "petit / petite", english: "short / small", partOfSpeech: "adjective", unit: 3 },
  { key: "u3_mince", french: "mince", english: "slim / thin", partOfSpeech: "adjective", unit: 3 },
  { key: "u3_jeune", french: "jeune", english: "young", partOfSpeech: "adjective", unit: 3 },
  { key: "u3_vieux", french: "vieux / vieille / vieil", english: "old", partOfSpeech: "adjective", unit: 3, tricky: true, audioHint: "vieux (m), vieille (f), vieil (m before vowel)" },
  { key: "u3_beau", french: "beau / belle / bel", english: "beautiful / handsome", partOfSpeech: "adjective", unit: 3, tricky: true, audioHint: "beau (m), belle (f), bel (m before vowel)" },
  { key: "u3_nouveau", french: "nouveau / nouvelle / nouvel", english: "new", partOfSpeech: "adjective", unit: 3, tricky: true, audioHint: "Like beau — nouvel before vowel" },
  // Age
  { key: "u3_quel_age", french: "Quel âge as-tu ?", english: "How old are you?", partOfSpeech: "phrase", unit: 3, tricky: true },
  { key: "u3_j_ai_ans", french: "J'ai… ans.", english: "I am… years old.", partOfSpeech: "phrase", unit: 3 },
  // Additional adjectives for Unit 3
  { key: "u3_jeune2", french: "jeune", english: "young", partOfSpeech: "adjective", unit: 3 },
  { key: "u3_mince2", french: "mince", english: "thin / slim", partOfSpeech: "adjective", unit: 3 },
  { key: "u3_patient", french: "patient / patiente", english: "patient", partOfSpeech: "adjective", unit: 3 },
  { key: "u3_roux", french: "roux / rousse", english: "red-headed / ginger", partOfSpeech: "adjective", unit: 3, tricky: true, audioHint: "roux (m) ROO, rousse (f) ROOS" },
  { key: "u3_strict", french: "strict / stricte", english: "strict", partOfSpeech: "adjective", unit: 3 },
  { key: "u3_laid", french: "laid / laide", english: "ugly", partOfSpeech: "adjective", unit: 3 },
  { key: "u3_mignon", french: "mignon / mignonne", english: "cute / sweet", partOfSpeech: "adjective", unit: 3, tricky: true, audioHint: "mee-NYON / mee-NYON" },
  { key: "u3_blond", french: "blond / blonde", english: "blond", partOfSpeech: "adjective", unit: 3 },
  { key: "u3_brun", french: "brun / brune", english: "brunette / dark-haired", partOfSpeech: "adjective", unit: 3 },
  { key: "u3_grand2", french: "grand / grande", english: "tall / big", partOfSpeech: "adjective", unit: 3 },
  { key: "u3_court", french: "court / courte", english: "short (hair/things)", partOfSpeech: "adjective", unit: 3 },
  { key: "u3_long", french: "long / longue", english: "long", partOfSpeech: "adjective", unit: 3 },
  { key: "u3_sympa2", french: "sympa", english: "nice / friendly (invariable)", partOfSpeech: "adjective", unit: 3 },
  { key: "u3_gentil", french: "gentil / gentille", english: "kind / nice", partOfSpeech: "adjective", unit: 3, tricky: true, audioHint: "zhon-TEE / zhon-TEE-yuh" },
  { key: "u3_timide2", french: "timide", english: "shy / timid", partOfSpeech: "adjective", unit: 3 },
  { key: "u3_bavard", french: "bavard / bavarde", english: "talkative", partOfSpeech: "adjective", unit: 3 },
  { key: "u3_paresseux", french: "paresseux / paresseuse", english: "lazy", partOfSpeech: "adjective", unit: 3, tricky: true, audioHint: "pah-reh-SUH / pah-reh-SUZ" },
  { key: "u3_travailleur", french: "travailleur / travailleuse", english: "hardworking", partOfSpeech: "adjective", unit: 3, tricky: true },
  { key: "u3_fort", french: "fort / forte", english: "strong / good at (en)", partOfSpeech: "adjective", unit: 3 },
  // Unit 3 verbs
  { key: "u3_aider", french: "aider", english: "to help", partOfSpeech: "verb", unit: 3 },
  { key: "u3_dejeuner", french: "déjeuner", english: "to eat lunch", partOfSpeech: "verb", unit: 3, tricky: true, audioHint: "day-zhuh-NAY" },
  { key: "u3_enseigner", french: "enseigner", english: "to teach", partOfSpeech: "verb", unit: 3, tricky: true, audioHint: "on-seh-NYAY" },
  { key: "u3_faire_attention", french: "faire attention", english: "to pay attention", partOfSpeech: "phrase", unit: 3 },
  { key: "u3_travailler", french: "travailler", english: "to work / to study hard", partOfSpeech: "verb", unit: 3, tricky: true, audioHint: "trah-vah-YAY" },
  { key: "u3_faire_les_devoirs", french: "faire les devoirs", english: "to do homework", partOfSpeech: "phrase", unit: 3 },
  { key: "u3_oublier", french: "oublier", english: "to forget", partOfSpeech: "verb", unit: 3 },
  { key: "u3_expliquer", french: "expliquer", english: "to explain", partOfSpeech: "verb", unit: 3 },
  { key: "u3_poser_une_question", french: "poser une question", english: "to ask a question", partOfSpeech: "phrase", unit: 3 },
  // Basic adverbs for Unit 3
  { key: "u3_si", french: "si", english: "so (intensifier)", partOfSpeech: "adverb", unit: 3 },
  { key: "u3_vraiment", french: "vraiment", english: "really / truly", partOfSpeech: "adverb", unit: 3 },
  { key: "u3_toujours2", french: "toujours", english: "always", partOfSpeech: "adverb", unit: 3 },
  { key: "u3_trop", french: "trop", english: "too / too much", partOfSpeech: "adverb", unit: 3 },
  { key: "u3_rarement2", french: "rarement", english: "rarely", partOfSpeech: "adverb", unit: 3 },
  { key: "u3_plutot", french: "plutôt", english: "rather / quite", partOfSpeech: "adverb", unit: 3, tricky: true, audioHint: "ploo-TOH" },
  { key: "u3_assez", french: "assez", english: "enough / quite / rather", partOfSpeech: "adverb", unit: 3 },
  { key: "u3_un_peu", french: "un peu", english: "a little / a bit", partOfSpeech: "adverb", unit: 3 },
];

// ─── UNIT 4 VOCABULARY ────────────────────────────────────────────────────────

export const VOCAB_UNIT4: VocabItem[] = [
  // Daily routine
  { key: "u4_le_matin", french: "le matin", english: "the morning", partOfSpeech: "noun", unit: 4, gender: "m" },
  { key: "u4_lapres_midi", french: "l'après-midi", english: "the afternoon", partOfSpeech: "noun", unit: 4, gender: "m", tricky: true, audioHint: "lah-preh-mee-DEE" },
  { key: "u4_le_soir", french: "le soir", english: "the evening", partOfSpeech: "noun", unit: 4, gender: "m" },
  { key: "u4_le_week_end", french: "le week-end", english: "the weekend", partOfSpeech: "noun", unit: 4, gender: "m" },
  { key: "u4_dabord", french: "d'abord", english: "first / firstly", partOfSpeech: "adverb", unit: 4 },
  { key: "u4_ensuite", french: "ensuite", english: "then / next", partOfSpeech: "adverb", unit: 4 },
  { key: "u4_enfin", french: "enfin", english: "finally", partOfSpeech: "adverb", unit: 4 },
  // -IR verbs
  { key: "u4_finir", french: "finir", english: "to finish", partOfSpeech: "verb", unit: 4 },
  { key: "u4_choisir", french: "choisir", english: "to choose", partOfSpeech: "verb", unit: 4, tricky: true, audioHint: "shwah-ZEER" },
  { key: "u4_reussir", french: "réussir", english: "to succeed / to pass (a test)", partOfSpeech: "verb", unit: 4, tricky: true },
  // Faire expressions
  { key: "u4_faire", french: "faire", english: "to do / to make", partOfSpeech: "verb", unit: 4, tricky: true, audioHint: "FAIR" },
  { key: "u4_faire_du_sport", french: "faire du sport", english: "to play sports", partOfSpeech: "phrase", unit: 4 },
  { key: "u4_faire_les_devoirs", french: "faire les devoirs", english: "to do homework", partOfSpeech: "phrase", unit: 4 },
  { key: "u4_faire_une_promenade", french: "faire une promenade", english: "to take a walk", partOfSpeech: "phrase", unit: 4 },
  { key: "u4_faire_du_velo", french: "faire du vélo", english: "to ride a bike", partOfSpeech: "phrase", unit: 4 },
  // Weather
  { key: "u4_il_fait_beau", french: "Il fait beau.", english: "The weather is nice.", partOfSpeech: "phrase", unit: 4 },
  { key: "u4_il_fait_chaud", french: "Il fait chaud.", english: "It's hot.", partOfSpeech: "phrase", unit: 4 },
  { key: "u4_il_fait_froid", french: "Il fait froid.", english: "It's cold.", partOfSpeech: "phrase", unit: 4 },
  { key: "u4_il_pleut", french: "Il pleut.", english: "It's raining.", partOfSpeech: "phrase", unit: 4, tricky: true, audioHint: "eel PLUH" },
  { key: "u4_il_neige", french: "Il neige.", english: "It's snowing.", partOfSpeech: "phrase", unit: 4, tricky: true, audioHint: "eel NEZH" },
  { key: "u4_il_fait_du_vent", french: "Il fait du vent.", english: "It's windy.", partOfSpeech: "phrase", unit: 4 },
  // Going places (aller + contractions)
  { key: "u4_aller", french: "aller", english: "to go", partOfSpeech: "verb", unit: 4, tricky: true },
  { key: "u4_au", french: "au (à + le)", english: "to the (masc.)", partOfSpeech: "contraction", unit: 4, tricky: true },
  { key: "u4_a_la", french: "à la", english: "to the (fem.)", partOfSpeech: "contraction", unit: 4 },
  { key: "u4_aux", french: "aux (à + les)", english: "to the (plural)", partOfSpeech: "contraction", unit: 4, tricky: true },
  { key: "u4_je_vais", french: "Je vais…", english: "I'm going to…", partOfSpeech: "phrase", unit: 4 },
  { key: "u4_near_future", french: "aller + infinitif", english: "near future: going to…", partOfSpeech: "structure", unit: 4, tricky: true },
  // Places
  { key: "u4_la_bibliotheque", french: "la bibliothèque", english: "the library", partOfSpeech: "noun", unit: 4, gender: "f", tricky: true, audioHint: "bee-blee-oh-TEHK" },
  { key: "u4_le_parc", french: "le parc", english: "the park", partOfSpeech: "noun", unit: 4, gender: "m" },
  { key: "u4_la_piscine", french: "la piscine", english: "the swimming pool", partOfSpeech: "noun", unit: 4, gender: "f", tricky: true, audioHint: "pee-SEEN" },
  { key: "u4_le_cinema", french: "le cinéma", english: "the movie theater", partOfSpeech: "noun", unit: 4, gender: "m" },
  { key: "u4_le_stade", french: "le stade", english: "the stadium", partOfSpeech: "noun", unit: 4, gender: "m" },
];

// ─── UNIT 5 VOCABULARY ────────────────────────────────────────────────────────

export const VOCAB_UNIT5: VocabItem[] = [
  // Rooms
  { key: "u5_la_maison", french: "la maison", english: "the house", partOfSpeech: "noun", unit: 5, gender: "f" },
  { key: "u5_lappartement", french: "l'appartement", english: "the apartment", partOfSpeech: "noun", unit: 5, gender: "m" },
  { key: "u5_la_chambre", french: "la chambre", english: "the bedroom", partOfSpeech: "noun", unit: 5, gender: "f" },
  { key: "u5_la_salle_de_bain", french: "la salle de bain", english: "the bathroom", partOfSpeech: "noun", unit: 5, gender: "f" },
  { key: "u5_la_cuisine", french: "la cuisine", english: "the kitchen", partOfSpeech: "noun", unit: 5, gender: "f" },
  { key: "u5_le_salon", french: "le salon", english: "the living room", partOfSpeech: "noun", unit: 5, gender: "m" },
  { key: "u5_la_salle_a_manger", french: "la salle à manger", english: "the dining room", partOfSpeech: "noun", unit: 5, gender: "f" },
  { key: "u5_le_jardin", french: "le jardin", english: "the garden / yard", partOfSpeech: "noun", unit: 5, gender: "m" },
  { key: "u5_le_garage", french: "le garage", english: "the garage", partOfSpeech: "noun", unit: 5, gender: "m" },
  { key: "u5_le_bureau", french: "le bureau", english: "the office / desk", partOfSpeech: "noun", unit: 5, gender: "m" },
  // Furniture / items
  { key: "u5_le_lit", french: "le lit", english: "the bed", partOfSpeech: "noun", unit: 5, gender: "m" },
  { key: "u5_la_table", french: "la table", english: "the table", partOfSpeech: "noun", unit: 5, gender: "f" },
  { key: "u5_la_chaise", french: "la chaise", english: "the chair", partOfSpeech: "noun", unit: 5, gender: "f" },
  { key: "u5_le_canape", french: "le canapé", english: "the sofa / couch", partOfSpeech: "noun", unit: 5, gender: "m" },
  // Prepositions
  { key: "u5_dans", french: "dans", english: "in / inside", partOfSpeech: "preposition", unit: 5 },
  { key: "u5_sur", french: "sur", english: "on", partOfSpeech: "preposition", unit: 5 },
  { key: "u5_sous", french: "sous", english: "under", partOfSpeech: "preposition", unit: 5 },
  { key: "u5_devant", french: "devant", english: "in front of", partOfSpeech: "preposition", unit: 5 },
  { key: "u5_derriere", french: "derrière", english: "behind", partOfSpeech: "preposition", unit: 5, tricky: true, audioHint: "deh-RYAIR" },
  { key: "u5_a_cote_de", french: "à côté de", english: "next to / beside", partOfSpeech: "preposition", unit: 5, tricky: true },
  { key: "u5_en_face_de", french: "en face de", english: "across from / facing", partOfSpeech: "preposition", unit: 5 },
  { key: "u5_entre", french: "entre", english: "between", partOfSpeech: "preposition", unit: 5 },
  // Aller contractions
  { key: "u5_aller", french: "aller", english: "to go", partOfSpeech: "verb", unit: 5, tricky: true },
  { key: "u5_au", french: "au (à + le)", english: "to the (masc. sing.)", partOfSpeech: "contraction", unit: 5, tricky: true },
  { key: "u5_aux", french: "aux (à + les)", english: "to the (plural)", partOfSpeech: "contraction", unit: 5, tricky: true },
  { key: "u5_a_la", french: "à la", english: "to the (fem. sing.)", partOfSpeech: "contraction", unit: 5 },
  { key: "u5_a_l", french: "à l'", english: "to the (before vowel/h)", partOfSpeech: "contraction", unit: 5 },
  // Near future
  { key: "u5_futur_proche", french: "aller + infinitif", english: "near future (going to…)", partOfSpeech: "structure", unit: 5, tricky: true },
  { key: "u5_je_vais", french: "Je vais…", english: "I am going to…", partOfSpeech: "phrase", unit: 5 },
  // Venir
  { key: "u5_venir", french: "venir", english: "to come", partOfSpeech: "verb", unit: 5, tricky: true },
];

// ─── UNIT 6 VOCABULARY ────────────────────────────────────────────────────────

export const VOCAB_UNIT6: VocabItem[] = [
  // Food
  { key: "u6_le_pain", french: "le pain", english: "bread", partOfSpeech: "noun", unit: 6, gender: "m" },
  { key: "u6_le_fromage", french: "le fromage", english: "cheese", partOfSpeech: "noun", unit: 6, gender: "m" },
  { key: "u6_le_beurre", french: "le beurre", english: "butter", partOfSpeech: "noun", unit: 6, gender: "m" },
  { key: "u6_le_lait", french: "le lait", english: "milk", partOfSpeech: "noun", unit: 6, gender: "m" },
  { key: "u6_leau", french: "l'eau", english: "water", partOfSpeech: "noun", unit: 6, gender: "f", tricky: true, audioHint: "LOH" },
  { key: "u6_le_jus", french: "le jus d'orange", english: "orange juice", partOfSpeech: "noun", unit: 6, gender: "m" },
  { key: "u6_le_cafe", french: "le café", english: "coffee", partOfSpeech: "noun", unit: 6, gender: "m" },
  { key: "u6_le_the", french: "le thé", english: "tea", partOfSpeech: "noun", unit: 6, gender: "m", tricky: true, audioHint: "TAY" },
  { key: "u6_la_viande", french: "la viande", english: "meat", partOfSpeech: "noun", unit: 6, gender: "f" },
  { key: "u6_le_poulet", french: "le poulet", english: "chicken", partOfSpeech: "noun", unit: 6, gender: "m" },
  { key: "u6_le_poisson", french: "le poisson", english: "fish", partOfSpeech: "noun", unit: 6, gender: "m" },
  { key: "u6_les_legumes", french: "les légumes", english: "vegetables", partOfSpeech: "noun", unit: 6 },
  { key: "u6_les_fruits", french: "les fruits", english: "fruit", partOfSpeech: "noun", unit: 6 },
  { key: "u6_la_pomme", french: "la pomme", english: "apple", partOfSpeech: "noun", unit: 6, gender: "f" },
  { key: "u6_la_banane", french: "la banane", english: "banana", partOfSpeech: "noun", unit: 6, gender: "f" },
  { key: "u6_la_salade", french: "la salade", english: "salad / lettuce", partOfSpeech: "noun", unit: 6, gender: "f" },
  { key: "u6_le_dessert", french: "le dessert", english: "dessert", partOfSpeech: "noun", unit: 6, gender: "m" },
  { key: "u6_le_gateau", french: "le gâteau", english: "cake", partOfSpeech: "noun", unit: 6, gender: "m" },
  { key: "u6_la_glace", french: "la glace", english: "ice cream", partOfSpeech: "noun", unit: 6, gender: "f" },
  // Partitive articles
  { key: "u6_du", french: "du (de + le)", english: "some (masc. sing.)", partOfSpeech: "article", unit: 6, tricky: true },
  { key: "u6_de_la_art", french: "de la", english: "some (fem. sing.)", partOfSpeech: "article", unit: 6 },
  { key: "u6_de_l_art", french: "de l'", english: "some (before vowel/h)", partOfSpeech: "article", unit: 6 },
  { key: "u6_des_art_pl", french: "des", english: "some (plural)", partOfSpeech: "article", unit: 6 },
  // Restaurant
  { key: "u6_le_menu", french: "le menu", english: "the menu", partOfSpeech: "noun", unit: 6, gender: "m" },
  { key: "u6_laddition", french: "l'addition", english: "the bill / check", partOfSpeech: "noun", unit: 6, gender: "f" },
  { key: "u6_le_garcon", french: "le garçon", english: "the waiter", partOfSpeech: "noun", unit: 6, gender: "m" },
  { key: "u6_je_voudrais", french: "Je voudrais…", english: "I would like…", partOfSpeech: "phrase", unit: 6, tricky: true, audioHint: "zhuh voo-DREH" },
  { key: "u6_avez_vous", french: "Avez-vous… ?", english: "Do you have…?", partOfSpeech: "phrase", unit: 6 },
  { key: "u6_pour_moi", french: "Pour moi,…", english: "For me,…", partOfSpeech: "phrase", unit: 6 },
  // Vouloir / Pouvoir
  { key: "u6_vouloir", french: "vouloir", english: "to want", partOfSpeech: "verb", unit: 6, tricky: true, audioHint: "voo-LWAR" },
  { key: "u6_pouvoir", french: "pouvoir", english: "to be able to / can", partOfSpeech: "verb", unit: 6, tricky: true, audioHint: "poo-VWAR" },
];

// ─── GLUE WORDS ───────────────────────────────────────────────────────────────

export const GLUE_WORDS: VocabItem[] = [
  // Connectors
  { key: "gw_et", french: "et", english: "and", partOfSpeech: "conjunction", unit: 0 },
  { key: "gw_mais", french: "mais", english: "but", partOfSpeech: "conjunction", unit: 0 },
  { key: "gw_donc", french: "donc", english: "so / therefore", partOfSpeech: "conjunction", unit: 0, tricky: true, audioHint: "DONK" },
  { key: "gw_alors", french: "alors", english: "so / then / well", partOfSpeech: "conjunction", unit: 0 },
  { key: "gw_parce_que", french: "parce que", english: "because", partOfSpeech: "conjunction", unit: 0 },
  { key: "gw_ou", french: "ou", english: "or", partOfSpeech: "conjunction", unit: 0 },
  { key: "gw_car", french: "car", english: "because / for (formal)", partOfSpeech: "conjunction", unit: 0 },
  { key: "gw_si", french: "si", english: "if / so (intensifier)", partOfSpeech: "conjunction", unit: 0 },
  // Time words
  { key: "gw_quand", french: "quand", english: "when", partOfSpeech: "adverb", unit: 0 },
  { key: "gw_apres", french: "après", english: "after", partOfSpeech: "adverb", unit: 0, tricky: true, audioHint: "ah-PREH" },
  { key: "gw_avant", french: "avant", english: "before", partOfSpeech: "adverb", unit: 0 },
  { key: "gw_puis", french: "puis", english: "then / next", partOfSpeech: "adverb", unit: 0, tricky: true, audioHint: "PWEE" },
  { key: "gw_ensuite", french: "ensuite", english: "next / then / afterward", partOfSpeech: "adverb", unit: 0 },
  { key: "gw_depuis", french: "depuis", english: "since / for (time)", partOfSpeech: "preposition", unit: 0, tricky: true },
  { key: "gw_maintenant", french: "maintenant", english: "now", partOfSpeech: "adverb", unit: 0 },
  { key: "gw_deja", french: "déjà", english: "already", partOfSpeech: "adverb", unit: 0 },
  // Manner words
  { key: "gw_avec", french: "avec", english: "with", partOfSpeech: "preposition", unit: 0 },
  { key: "gw_sans", french: "sans", english: "without", partOfSpeech: "preposition", unit: 0 },
  { key: "gw_aussi", french: "aussi", english: "also / too", partOfSpeech: "adverb", unit: 0 },
  { key: "gw_encore", french: "encore", english: "again / still", partOfSpeech: "adverb", unit: 0 },
  { key: "gw_vraiment", french: "vraiment", english: "really / truly", partOfSpeech: "adverb", unit: 0 },
  { key: "gw_trop", french: "trop", english: "too / too much", partOfSpeech: "adverb", unit: 0 },
  { key: "gw_tres", french: "très", english: "very", partOfSpeech: "adverb", unit: 0 },
  { key: "gw_assez", french: "assez", english: "quite / enough", partOfSpeech: "adverb", unit: 0 },
  { key: "gw_un_peu", french: "un peu", english: "a little / a bit", partOfSpeech: "adverb", unit: 0 },
  { key: "gw_beaucoup", french: "beaucoup", english: "a lot / very much", partOfSpeech: "adverb", unit: 0, tricky: true, audioHint: "boh-KOO" },
  // Question words
  { key: "gw_qui", french: "qui", english: "who", partOfSpeech: "pronoun", unit: 0 },
  { key: "gw_quoi", french: "quoi / que", english: "what", partOfSpeech: "pronoun", unit: 0 },
  { key: "gw_ou", french: "où", english: "where", partOfSpeech: "adverb", unit: 0 },
  { key: "gw_pourquoi", french: "pourquoi", english: "why", partOfSpeech: "adverb", unit: 0, tricky: true, audioHint: "poor-KWAH" },
  { key: "gw_comment", french: "comment", english: "how", partOfSpeech: "adverb", unit: 0 },
  { key: "gw_combien", french: "combien", english: "how many / how much", partOfSpeech: "adverb", unit: 0, tricky: true, audioHint: "kom-BYAN" },
  { key: "gw_quel", french: "quel / quelle", english: "which / what (adjective)", partOfSpeech: "adjective", unit: 0 },
];

// ─── ALL VOCAB COMBINED ────────────────────────────────────────────────────────

export const ALL_VOCAB: VocabItem[] = [
  ...VOCAB_UNIT1,
  ...VOCAB_UNIT2,
  ...VOCAB_UNIT3,
  ...VOCAB_UNIT4,
  ...VOCAB_UNIT5,
  ...VOCAB_UNIT6,
  ...GLUE_WORDS,
];

export function getVocabByUnit(unit: number): VocabItem[] {
  if (unit === 0) return GLUE_WORDS;
  return ALL_VOCAB.filter((v) => v.unit === unit);
}

export function getVocabByKey(key: string): VocabItem | undefined {
  return ALL_VOCAB.find((v) => v.key === key);
}

// ─── GRAMMAR RULES ────────────────────────────────────────────────────────────

export const GRAMMAR_RULES: GrammarRule[] = [
  // ── UNIT 1 ──────────────────────────────────────────────────────────────────
  {
    id: "u1_etre",
    unit: 1,
    title: "Être (to be) — Present Tense",
    explanation:
      "Être is one of the most important verbs in French. It means 'to be.' It is irregular, so you must memorize each form. Use it to talk about identity, origin, nationality, and personality.",
    examples: [
      { french: "Je suis américain.", english: "I am American." },
      { french: "Elle est intelligente.", english: "She is intelligent." },
      { french: "Nous sommes de Paris.", english: "We are from Paris." },
    ],
    tables: [
      {
        title: "Être — Present Tense",
        headers: ["Pronoun", "Form", "Pronunciation"],
        rows: [
          { label: "je", cells: ["suis", "SWEE"] },
          { label: "tu", cells: ["es", "EH"] },
          { label: "il/elle/on", cells: ["est", "EH"] },
          { label: "nous", cells: ["sommes", "SUM"] },
          { label: "vous", cells: ["êtes", "EHT"] },
          { label: "ils/elles", cells: ["sont", "SON"] },
        ],
      },
    ],
  },
  {
    id: "u1_gender_agreement",
    unit: 1,
    title: "Gender Agreement — Adjectives",
    explanation:
      "In French, adjectives must agree with the noun they describe in both gender (masculine/feminine) and number (singular/plural). Most adjectives add -e for feminine. Adjectives ending in -e already are the same for both genders.",
    examples: [
      { french: "Il est intelligent.", english: "He is intelligent. (masculine)" },
      { french: "Elle est intelligente.", english: "She is intelligent. (feminine — add -e)" },
      { french: "Il est timide.", english: "He is shy. (ends in -e — no change)" },
      { french: "Elle est timide.", english: "She is shy. (same for both genders)" },
    ],
    tables: [
      {
        title: "Adjective Gender Patterns",
        headers: ["Pattern", "Masculine", "Feminine", "Example (m/f)"],
        rows: [
          { label: "Default", cells: ["-", "add -e", "grand / grande"] },
          { label: "Ends in -e", cells: ["-", "no change", "timide / timide"] },
          { label: "Ends in -eux", cells: ["-euse", "-euse", "sérieux / sérieuse"] },
          { label: "Ends in -if", cells: ["-ive", "-ive", "sportif / sportive"] },
          { label: "Ends in -ien", cells: ["-ienne", "-ienne", "canadien / canadienne"] },
        ],
      },
    ],
  },
  {
    id: "u1_indefinite_articles",
    unit: 1,
    title: "Indefinite Articles (un, une, des)",
    explanation:
      "Use indefinite articles when talking about 'a,' 'an,' or 'some.' In French, the article must match the gender of the noun. Un = masculine, une = feminine, des = plural (both genders).",
    examples: [
      { french: "C'est un ami.", english: "He is a friend. (masculine)" },
      { french: "C'est une amie.", english: "She is a friend. (feminine)" },
      { french: "Ce sont des amis.", english: "They are friends. (plural)" },
    ],
    tables: [
      {
        title: "Indefinite Articles",
        headers: ["", "Singular", "Plural"],
        rows: [
          { label: "Masculine", cells: ["un", "des"] },
          { label: "Feminine", cells: ["une", "des"] },
        ],
      },
    ],
  },
  // ── UNIT 2 ──────────────────────────────────────────────────────────────────
  {
    id: "u2_er_verbs",
    unit: 2,
    title: "Regular -ER Verb Conjugation",
    explanation:
      "Most French verbs are regular -ER verbs. To conjugate them: take off the -er ending and add the correct ending for each pronoun. The je, tu, il/elle/on, ils/elles forms are all pronounced the same for most -ER verbs!",
    examples: [
      { french: "Je parle français.", english: "I speak French." },
      { french: "Tu écoutes de la musique ?", english: "Do you listen to music?" },
      { french: "Ils regardent la télé.", english: "They watch TV." },
    ],
    tables: [
      {
        title: "Parler (to speak) — Regular -ER",
        headers: ["Pronoun", "Ending", "Example"],
        rows: [
          { label: "je", cells: ["-e", "parle"] },
          { label: "tu", cells: ["-es", "parles"] },
          { label: "il/elle/on", cells: ["-e", "parle"] },
          { label: "nous", cells: ["-ons", "parlons"] },
          { label: "vous", cells: ["-ez", "parlez"] },
          { label: "ils/elles", cells: ["-ent", "parlent"] },
        ],
      },
    ],
  },
  {
    id: "u2_negation",
    unit: 2,
    title: "Negation — Ne…Pas",
    explanation:
      "To make a sentence negative in French, wrap ne…pas around the verb. Ne comes before the verb, pas comes after. In spoken French, the ne is often dropped, but in writing always include both parts.",
    examples: [
      { french: "Je ne parle pas espagnol.", english: "I don't speak Spanish." },
      { french: "Elle n'aime pas les maths.", english: "She doesn't like math. (ne → n' before vowel)" },
      { french: "Nous n'avons pas de stylo.", english: "We don't have a pen." },
    ],
  },
  {
    id: "u2_definite_articles",
    unit: 2,
    title: "Definite Articles (le, la, l', les)",
    explanation:
      "Use definite articles with specific nouns ('the') and also when talking about things you like/dislike in general — this is different from English! 'J'aime la musique' = 'I like music' (in general).",
    examples: [
      { french: "J'aime le sport.", english: "I like sports. (in general)" },
      { french: "Elle déteste les maths.", english: "She hates math. (in general)" },
      { french: "Le professeur parle.", english: "The teacher speaks. (specific)" },
    ],
    tables: [
      {
        title: "Definite Articles",
        headers: ["", "Singular", "Plural"],
        rows: [
          { label: "Masculine", cells: ["le (l' before vowel/h)", "les"] },
          { label: "Feminine", cells: ["la (l' before vowel/h)", "les"] },
        ],
      },
    ],
  },
  {
    id: "u2_questions",
    unit: 2,
    title: "Question Formation",
    explanation:
      "There are three main ways to ask questions in French: (1) Rising intonation — just raise your voice at the end. (2) Est-ce que — add 'est-ce que' before a statement. (3) Inversion — flip the subject pronoun and verb. For beginners, methods 1 and 2 are most common.",
    examples: [
      { french: "Tu aimes la musique ?", english: "You like music? (intonation)" },
      { french: "Est-ce que tu aimes la musique ?", english: "Do you like music? (est-ce que)" },
      { french: "Aimes-tu la musique ?", english: "Do you like music? (inversion — formal)" },
    ],
  },
  // ── UNIT 3 ──────────────────────────────────────────────────────────────────
  {
    id: "u3_avoir",
    unit: 3,
    title: "Avoir (to have) — Present Tense",
    explanation:
      "Avoir is the second most important verb in French. It is irregular. Use it to say what you have, your age (J'ai 15 ans), and many expressions of physical state.",
    examples: [
      { french: "J'ai un stylo rouge.", english: "I have a red pen." },
      { french: "Tu as quel âge ?", english: "How old are you?" },
      { french: "Nous avons un cours de maths.", english: "We have a math class." },
    ],
    tables: [
      {
        title: "Avoir — Present Tense",
        headers: ["Pronoun", "Form", "Pronunciation"],
        rows: [
          { label: "j'", cells: ["ai", "AY"] },
          { label: "tu", cells: ["as", "AH"] },
          { label: "il/elle/on", cells: ["a", "AH"] },
          { label: "nous", cells: ["avons", "ah-VON"] },
          { label: "vous", cells: ["avez", "ah-VAY"] },
          { label: "ils/elles", cells: ["ont", "ON"] },
        ],
      },
    ],
  },
  {
    id: "u3_articles_negation",
    unit: 3,
    title: "Articles in Negation",
    explanation:
      "After ne…pas, the indefinite articles un, une, des change to de (or d' before a vowel). The meaning changes from 'a/some' to 'any.' This rule also applies to partitive articles (du, de la, des → de).",
    examples: [
      { french: "J'ai un stylo. → Je n'ai pas de stylo.", english: "I have a pen. → I don't have a pen." },
      { french: "Elle a des amis. → Elle n'a pas d'amis.", english: "She has friends. → She doesn't have any friends." },
      { french: "J'aime le chocolat.", english: "I like chocolate. (definite — no change after negation)" },
    ],
  },
  {
    id: "u3_adjective_placement",
    unit: 3,
    title: "Adjective Placement & Agreement",
    explanation:
      "In French, most adjectives come AFTER the noun (unlike English). However, a small group of common adjectives come BEFORE the noun — remember the acronym BAGS: Beauty, Age, Goodness/Badness, Size. Adjectives must agree in gender and number with the noun.",
    examples: [
      { french: "un cahier rouge", english: "a red notebook (color → after)" },
      { french: "une belle maison", english: "a beautiful house (beauty → before)" },
      { french: "un grand sac bleu", english: "a big blue bag (size before, color after)" },
    ],
    tables: [
      {
        title: "BAGS Adjectives (come BEFORE the noun)",
        headers: ["Category", "Examples"],
        rows: [
          { label: "Beauty", cells: ["beau, joli"] },
          { label: "Age", cells: ["jeune, vieux, nouveau"] },
          { label: "Goodness/Badness", cells: ["bon, mauvais"] },
          { label: "Size", cells: ["grand, petit, gros, long"] },
        ],
      },
    ],
  },
  {
    id: "u3_frequency_adverbs",
    unit: 3,
    title: "Frequency Adverbs",
    explanation:
      "Frequency adverbs tell how often something happens. In French, they usually come right after the conjugated verb.",
    examples: [
      { french: "Je joue toujours au foot.", english: "I always play soccer." },
      { french: "Elle parle souvent en classe.", english: "She often talks in class." },
      { french: "Il ne mange jamais de légumes.", english: "He never eats vegetables." },
    ],
    tables: [
      {
        title: "Frequency Adverbs — Most to Least Frequent",
        headers: ["French", "English"],
        rows: [
          { label: "1", cells: ["toujours", "always"] },
          { label: "2", cells: ["souvent", "often"] },
          { label: "3", cells: ["parfois", "sometimes"] },
          { label: "4", cells: ["rarement", "rarely"] },
          { label: "5", cells: ["ne…jamais", "never"] },
        ],
      },
    ],
  },
  // ── UNIT 4 ──────────────────────────────────────────────────────────────────
  {
    id: "u4_possessives",
    unit: 4,
    title: "Possessive Adjectives",
    explanation:
      "Possessive adjectives in French agree with the noun they modify (what is possessed), NOT with the owner. For example, 'his sister' and 'her sister' are both 'sa sœur' because sœur is feminine — regardless of who owns the sister.",
    examples: [
      { french: "mon père", english: "my father (père = masc. → mon)" },
      { french: "ma mère", english: "my mother (mère = fem. → ma)" },
      { french: "mon amie", english: "my friend (amie = fem. but starts with vowel → mon)" },
      { french: "ses parents", english: "his/her parents (parents = plural → ses)" },
    ],
    tables: [
      {
        title: "Possessive Adjectives",
        headers: ["Owner", "Masc. Sing.", "Fem. Sing.", "Plural"],
        rows: [
          { label: "my", cells: ["mon", "ma (mon*)", "mes"] },
          { label: "your (tu)", cells: ["ton", "ta (ton*)", "tes"] },
          { label: "his/her/its", cells: ["son", "sa (son*)", "ses"] },
          { label: "our", cells: ["notre", "notre", "nos"] },
          { label: "your (vous)", cells: ["votre", "votre", "vos"] },
          { label: "their", cells: ["leur", "leur", "leurs"] },
        ],
      },
    ],
  },
  {
    id: "u4_irregular_adjectives",
    unit: 4,
    title: "Irregular Adjectives: Beau, Vieux, Nouveau",
    explanation:
      "Three common adjectives have special forms: beau (beautiful), vieux (old), and nouveau (new). They have a special masculine singular form used before a vowel or silent h. These adjectives come BEFORE the noun (they are BAGS adjectives).",
    examples: [
      { french: "un beau garçon", english: "a handsome boy (masc. before consonant)" },
      { french: "un bel homme", english: "a handsome man (masc. before vowel → bel)" },
      { french: "une belle fille", english: "a beautiful girl (feminine)" },
      { french: "un vieux château", english: "an old castle (masc. before consonant)" },
      { french: "un vieil appartement", english: "an old apartment (masc. before vowel → vieil)" },
    ],
    tables: [
      {
        title: "Beau / Vieux / Nouveau — Full Forms",
        headers: ["Adjective", "Masc. Sing.", "Masc. before vowel", "Fem. Sing.", "Plural (m)", "Plural (f)"],
        rows: [
          { label: "beau", cells: ["beau", "bel", "belle", "beaux", "belles"] },
          { label: "vieux", cells: ["vieux", "vieil", "vieille", "vieux", "vieilles"] },
          { label: "nouveau", cells: ["nouveau", "nouvel", "nouvelle", "nouveaux", "nouvelles"] },
        ],
      },
    ],
  },
  // ── UNIT 5 ──────────────────────────────────────────────────────────────────
  {
    id: "u5_aller",
    unit: 5,
    title: "Aller (to go) — Present Tense & Contractions",
    explanation:
      "Aller is irregular. When you go TO a place, the preposition à combines with the definite article: à + le = au, à + les = aux. Before a feminine noun or vowel, use à la or à l'.",
    examples: [
      { french: "Je vais au cinéma.", english: "I go to the movies. (à + le → au)" },
      { french: "Elle va à la bibliothèque.", english: "She goes to the library. (à + la = à la)" },
      { french: "Ils vont aux magasins.", english: "They go to the stores. (à + les → aux)" },
      { french: "Tu vas à l'école.", english: "You go to school. (à + l' = à l')" },
    ],
    tables: [
      {
        title: "Aller — Present Tense",
        headers: ["Pronoun", "Form"],
        rows: [
          { label: "je", cells: ["vais"] },
          { label: "tu", cells: ["vas"] },
          { label: "il/elle/on", cells: ["va"] },
          { label: "nous", cells: ["allons"] },
          { label: "vous", cells: ["allez"] },
          { label: "ils/elles", cells: ["vont"] },
        ],
      },
      {
        title: "À + Definite Article Contractions",
        headers: ["Article", "Contraction", "Used with"],
        rows: [
          { label: "à + le", cells: ["au", "masc. singular nouns"] },
          { label: "à + les", cells: ["aux", "all plural nouns"] },
          { label: "à + la", cells: ["à la", "fem. singular nouns"] },
          { label: "à + l'", cells: ["à l'", "nouns starting with vowel/h"] },
        ],
      },
    ],
  },
  {
    id: "u5_futur_proche",
    unit: 5,
    title: "Near Future — Aller + Infinitive",
    explanation:
      "To talk about what you're going to do (near future), use aller conjugated + the infinitive of any verb. This is like saying 'going to' in English. It's the most common way to talk about future plans in everyday French.",
    examples: [
      { french: "Je vais manger une pizza.", english: "I'm going to eat a pizza." },
      { french: "Elle va regarder un film.", english: "She's going to watch a movie." },
      { french: "Nous allons étudier ce soir.", english: "We're going to study tonight." },
      { french: "Ils ne vont pas venir.", english: "They're not going to come." },
    ],
  },
  {
    id: "u5_venir",
    unit: 5,
    title: "Venir (to come) — Present Tense",
    explanation:
      "Venir is an irregular -IR verb. It is often paired with de to mean 'to come from.' Memorize its forms — they come up constantly.",
    examples: [
      { french: "Je viens de Paris.", english: "I come from Paris." },
      { french: "Tu viens avec moi ?", english: "Are you coming with me?" },
      { french: "Ils viennent à l'école.", english: "They come to school." },
    ],
    tables: [
      {
        title: "Venir — Present Tense",
        headers: ["Pronoun", "Form"],
        rows: [
          { label: "je", cells: ["viens"] },
          { label: "tu", cells: ["viens"] },
          { label: "il/elle/on", cells: ["vient"] },
          { label: "nous", cells: ["venons"] },
          { label: "vous", cells: ["venez"] },
          { label: "ils/elles", cells: ["viennent"] },
        ],
      },
    ],
  },
  // ── UNIT 6 ──────────────────────────────────────────────────────────────────
  {
    id: "u6_partitifs",
    unit: 6,
    title: "Partitive Articles (du, de la, de l', des)",
    explanation:
      "Use partitive articles when talking about an unspecified amount of something — especially food and drink. Think of it as 'some' in English, though we often drop 'some' in speech. After negation, all partitives become de/d'.",
    examples: [
      { french: "Je mange du pain.", english: "I eat (some) bread. (masc. → du)" },
      { french: "Elle boit de la limonade.", english: "She drinks (some) lemonade. (fem. → de la)" },
      { french: "Nous mangeons de l'agneau.", english: "We eat (some) lamb. (vowel → de l')" },
      { french: "Je ne mange pas de viande.", english: "I don't eat meat. (after negation → de)" },
    ],
    tables: [
      {
        title: "Partitive Articles",
        headers: ["Gender / Context", "Article", "Example"],
        rows: [
          { label: "Masculine", cells: ["du", "du beurre"] },
          { label: "Feminine", cells: ["de la", "de la salade"] },
          { label: "Before vowel/h", cells: ["de l'", "de l'eau"] },
          { label: "Plural", cells: ["des", "des légumes"] },
          { label: "After negation", cells: ["de / d'", "pas de sucre"] },
        ],
      },
    ],
  },
  {
    id: "u6_vouloir_pouvoir",
    unit: 6,
    title: "Vouloir (to want) & Pouvoir (to be able to)",
    explanation:
      "Vouloir and pouvoir are both irregular verbs that are often followed by an infinitive. They follow a similar 'boot' pattern — the stem changes in all forms except nous and vous.",
    examples: [
      { french: "Je veux une pizza.", english: "I want a pizza." },
      { french: "Pouvez-vous m'aider ?", english: "Can you help me? (formal)" },
      { french: "Elle ne peut pas venir.", english: "She can't come." },
    ],
    tables: [
      {
        title: "Vouloir & Pouvoir — Present Tense",
        headers: ["Pronoun", "Vouloir", "Pouvoir"],
        rows: [
          { label: "je", cells: ["veux", "peux"] },
          { label: "tu", cells: ["veux", "peux"] },
          { label: "il/elle/on", cells: ["veut", "peut"] },
          { label: "nous", cells: ["voulons", "pouvons"] },
          { label: "vous", cells: ["voulez", "pouvez"] },
          { label: "ils/elles", cells: ["veulent", "peuvent"] },
        ],
      },
    ],
  },
];

export function getGrammarByUnit(unit: number): GrammarRule[] {
  return GRAMMAR_RULES.filter((r) => r.unit === unit);
}

export function getGrammarById(id: string): GrammarRule | undefined {
  return GRAMMAR_RULES.find((r) => r.id === id);
}

// ─── WRITING PROMPTS ─────────────────────────────────────────────────────────

export interface WritingPrompt {
  id: string;
  unit: number;
  prompt: string;
  promptFr?: string;
  targetLength: string;
  focusStructures: string[];
  requiredVocab: string[];
}

export const WRITING_PROMPTS: WritingPrompt[] = [
  {
    id: "wp_u1_intro",
    unit: 1,
    prompt: "Introduce yourself in French. Include your name, where you are from, and three personality traits.",
    promptFr: "Présente-toi en français.",
    targetLength: "4–6 sentences",
    focusStructures: ["Je m'appelle…", "Je suis de…", "Je suis + adjective"],
    requiredVocab: ["être", "nationality or personality adjectives"],
  },
  {
    id: "wp_u2_hobbies",
    unit: 2,
    prompt: "Write about your hobbies and daily schedule. Include what you like to do and when.",
    promptFr: "Écris sur tes activités préférées et ton emploi du temps.",
    targetLength: "5–7 sentences",
    focusStructures: ["-ER verbs", "j'aime / je n'aime pas", "days of week"],
    requiredVocab: ["at least 3 hobby verbs", "2 days of the week"],
  },
  {
    id: "wp_u3_school",
    unit: 3,
    prompt: "Describe your school schedule and your opinions about your classes.",
    promptFr: "Décris ton emploi du temps et tes opinions sur tes cours.",
    targetLength: "5–7 sentences",
    focusStructures: ["avoir", "c'est + adjective", "frequency adverbs", "adjective agreement"],
    requiredVocab: ["3+ school subjects", "2+ opinion phrases", "1+ frequency adverb"],
  },
  {
    id: "wp_u4_family",
    unit: 4,
    prompt: "Describe your family. Include ages, appearances, and personality.",
    promptFr: "Décris ta famille.",
    targetLength: "6–8 sentences",
    focusStructures: ["possessives (mon/ma/mes…)", "avoir for age", "physical + personality adjectives"],
    requiredVocab: ["3+ family members", "2+ physical descriptions"],
  },
  {
    id: "wp_u5_home",
    unit: 5,
    prompt: "Describe your home and what you're going to do this weekend.",
    promptFr: "Décris ta maison et ce que tu vas faire ce week-end.",
    targetLength: "6–8 sentences",
    focusStructures: ["room vocabulary", "prepositions of place", "near future (aller + inf.)"],
    requiredVocab: ["3+ rooms/furniture", "2+ prepositions", "near future"],
  },
  {
    id: "wp_u6_food",
    unit: 6,
    prompt: "Write a dialogue ordering food at a French café. Include what you want to eat and drink.",
    promptFr: "Écris un dialogue dans un café français.",
    targetLength: "6–10 lines of dialogue",
    focusStructures: ["partitive articles", "vouloir / pouvoir", "restaurant vocabulary"],
    requiredVocab: ["je voudrais", "partitive articles", "3+ food items"],
  },
];

// ─── READING PASSAGES ─────────────────────────────────────────────────────────

export interface ReadingPassage {
  id: string;
  unit: number;
  title: string;
  text: string;
  questions: { question: string; answer: string }[];
}

export const READING_PASSAGES: ReadingPassage[] = [
  {
    id: "rp_u1_lucas",
    unit: 1,
    title: "Bonjour, je m'appelle Lucas !",
    text: `Bonjour ! Je m'appelle Lucas. Je suis américain, mais ma mère est française. J'ai quinze ans. Je suis sympa, un peu timide, et très sportif. Mon ami s'appelle Thomas. Il est français et il est très drôle. Nous sommes bons amis.`,
    questions: [
      { question: "Quel est le prénom du garçon ?", answer: "Lucas" },
      { question: "Quelle est la nationalité de Lucas ?", answer: "Il est américain." },
      { question: "Comment est Thomas ?", answer: "Il est drôle." },
    ],
  },
  {
    id: "rp_u2_weekend",
    unit: 2,
    title: "Mon week-end",
    text: `Le samedi, j'écoute de la musique et je joue aux jeux vidéo avec mes amis. J'adore la musique hip-hop ! Le dimanche, je regarde la télé et je lis. Je n'aime pas beaucoup regarder le sport à la télé, mais j'aime jouer au football. Et toi, qu'est-ce que tu fais le week-end ?`,
    questions: [
      { question: "Qu'est-ce qu'il fait le samedi ?", answer: "Il écoute de la musique et joue aux jeux vidéo." },
      { question: "Est-ce qu'il aime regarder le sport à la télé ?", answer: "Non, il n'aime pas beaucoup regarder le sport à la télé." },
      { question: "Quel sport aime-t-il jouer ?", answer: "Il aime jouer au football." },
    ],
  },
  {
    id: "rp_u3_emma",
    unit: 3,
    title: "L'école d'Emma",
    text: `Salut ! Je m'appelle Emma. J'ai cours de maths, de français, d'histoire et de sciences cette année. J'aime bien les sciences parce que c'est intéressant. Je déteste les maths — c'est très difficile ! J'ai toujours un livre, un stylo et un cahier dans mon sac à dos. Mes cours préférés sont l'histoire et les sciences.`,
    questions: [
      { question: "Quels cours est-ce qu'Emma a cette année ?", answer: "Elle a maths, français, histoire et sciences." },
      { question: "Pourquoi aime-t-elle les sciences ?", answer: "Parce que c'est intéressant." },
      { question: "Qu'est-ce qu'elle a dans son sac à dos ?", answer: "Un livre, un stylo et un cahier." },
    ],
  },
];

"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import type { VocabItem, GrammarRule } from "@/data/curriculum";
import { addMistake } from "@/lib/store";
import { CheckCircle2, XCircle, RefreshCw } from "lucide-react";

function normalize(s: string): string {
  return s.trim().toLowerCase()
    .replace(/['']/g, "'")
    .replace(/\s+/g, " ")
    .replace(/[!?.,;:]+$/, "")
    .replace(/\.$/, "");
}
function stripAccents(s: string): string {
  return s.replace(/[àâä]/g,"a").replace(/[éèêë]/g,"e")
    .replace(/[îï]/g,"i").replace(/[ôö]/g,"o")
    .replace(/[ùûü]/g,"u").replace(/ç/g,"c").replace(/œ/g,"oe");
}
function matchAnswer(input: string, answers: string[]): "correct"|"accent_only"|"wrong" {
  const n = normalize(input);
  for (const a of answers) if (n === normalize(a)) return "correct";
  for (const a of answers) if (stripAccents(n) === stripAccents(normalize(a))) return "accent_only";
  return "wrong";
}

type ExerciseType =
  | "fill_blank"
  | "translation"
  | "word_bank"
  | "reading_check"
  | "timed_write"
  | "story_fill" | "simple_translation" | "error_hunt";

interface Props {
  vocab: VocabItem[];
  grammar: GrammarRule[];
  unit: number;
  onMastered: () => void;
}

export default function ExerciseSection({ vocab, grammar, unit, onMastered }: Props) {
  const [activeType, setActiveType] = useState<ExerciseType>("word_bank");

  const exerciseTypes: { id: ExerciseType; label: string; desc: string }[] = [
    { id: "word_bank", label: "⭐ Sentence Builder", desc: "Given a verb + adjectives — arrange words into a correct French sentence" },
    { id: "fill_blank", label: "Fill in the Blank", desc: "Complete the sentence with the correct French word" },
    { id: "translation", label: "English → French", desc: "Translate a full sentence and get instant feedback" },
    { id: "reading_check", label: "Reading Check", desc: "Short passage with comprehension questions" },
    { id: "timed_write", label: "Timed Write", desc: "3-minute free production sprint" },
    { id: "story_fill", label: "Story Fill-in", desc: "Complete a short French story — fill in the missing words" },
    { id: "simple_translation", label: "Quick Translate", desc: "English → French, instantly self-checked (no AI needed)" },
    { id: "error_hunt", label: "Spot the Error", desc: "Find and fix one deliberate error in a French sentence" },
  ];

  return (
    <div className="space-y-4">
      {/* Type selector */}
      <div className="grid grid-cols-1 gap-2">
        {exerciseTypes.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveType(t.id)}
            className={cn(
              "flex items-start gap-3 p-3 rounded-xl text-left border transition-all",
              activeType === t.id
                ? "border-[var(--accent-fr)] bg-blue-50 dark:bg-blue-950/20"
                : "border-[var(--border)] hover:bg-[var(--surface2)]"
            )}
          >
            <div
              className={cn(
                "h-3 w-3 rounded-full flex-shrink-0 mt-1",
                activeType === t.id ? "bg-[var(--accent-fr)]" : "bg-[var(--border)]"
              )}
            />
            <div>
              <p className="text-sm font-medium" style={{ color: "var(--text)" }}>{t.label}</p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>{t.desc}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Exercise */}
      <div className="mt-2">
        {activeType === "fill_blank" && <FillBlankExercise vocab={vocab} unit={unit} onComplete={onMastered} />}
        {activeType === "translation" && <TranslationExercise vocab={vocab} unit={unit} onComplete={onMastered} />}
        {activeType === "word_bank" && <WordBankExercise vocab={vocab} unit={unit} onComplete={onMastered} />}
        {activeType === "reading_check" && <ReadingCheckExercise unit={unit} onComplete={onMastered} />}
        {activeType === "timed_write" && <TimedWriteExercise unit={unit} onComplete={onMastered} />}
        {activeType === "story_fill" && <StoryFillExercise unit={unit} onComplete={onMastered} />}
        {activeType === "simple_translation" && <SimpleTranslationExercise unit={unit} onComplete={onMastered} />}
        {activeType === "error_hunt" && <ErrorHuntExercise unit={unit} onComplete={onMastered} />}
      </div>
    </div>
  );
}

// ── Story Fill Data ────────────────────────────────────────────────────────────

const STORY_FILL: Record<number, { story: string; blanks: { id: number; answers: string[]; hint: string }[] }> = {
  1: {
    story: "Bonjour ! Je [1] Lucas. Je [2] français et j'habite à Paris. Je suis grand et [3]. Mon amie s'appelle Sophie — elle est petite et très [4]. Nous sommes contents d'être amis !",
    blanks: [
      { id: 1, answers: ["m'appelle"], hint: "My name is = je m'___" },
      { id: 2, answers: ["suis"], hint: "être — je form" },
      { id: 3, answers: ["sportif","sympa","amusant","intelligent"], hint: "A positive masculine adjective" },
      { id: 4, answers: ["intelligente","sympa","amusante","sportive"], hint: "A positive feminine adjective" },
    ],
  },
  2: {
    story: "Le samedi, je [1] de la musique avec mes amis. J'[2] beaucoup la guitare mais je n'[3] pas danser — c'est difficile ! Le soir, nous [4] aux jeux vidéo jusqu'à dix heures.",
    blanks: [
      { id: 1, answers: ["écoute"], hint: "écouter — je form (-ER verb)" },
      { id: 2, answers: ["aime"], hint: "aimer — j' form (vowel elision)" },
      { id: 3, answers: ["aime"], hint: "ne…pas: je n'___ pas" },
      { id: 4, answers: ["jouons"], hint: "jouer — nous form" },
    ],
  },
  3: {
    story: "Aujourd'hui, j'[1] trois cours : le français, les maths et les sciences. J'aime bien le français parce que c'est [2]. Par contre, je [3] les maths — c'est trop difficile ! Dans mon sac, j'ai toujours mon [4] et mes stylos.",
    blanks: [
      { id: 1, answers: ["ai"], hint: "avoir — j' form" },
      { id: 2, answers: ["intéressant","super","amusant","cool","bien"], hint: "A positive adjective (masculine)" },
      { id: 3, answers: ["déteste","n'aime pas"], hint: "To strongly dislike (-ER verb, je form)" },
      { id: 4, answers: ["cahier","livre","agenda","classeur"], hint: "A school supply (masculine noun)" },
    ],
  },
  4: {
    story: "Le matin, je me lève à sept heures. Je [1] mon petit-déjeuner vite parce que mon bus [2] à sept heures et demie. Après l'école, je [3] mes devoirs et ensuite je vais [4] une promenade avec mon chien.",
    blanks: [
      { id: 1, answers: ["mange","prends"], hint: "manger or prendre — je form" },
      { id: 2, answers: ["part","arrive"], hint: "partir or arriver — il form" },
      { id: 3, answers: ["fais","termine","finit","finis"], hint: "faire or finir — je form" },
      { id: 4, answers: ["faire"], hint: "aller + infinitive → je vais ___" },
    ],
  },
  5: {
    story: "Ma maison est grande. Il y a un salon, une cuisine et [1] chambres. Ma chambre est [2] de la salle de bain. Demain, je vais [3] au cinéma avec ma famille — nous allons [4] un bon film français !",
    blanks: [
      { id: 1, answers: ["deux","trois","quatre","cinq"], hint: "A number (how many bedrooms?)" },
      { id: 2, answers: ["à côté","en face"], hint: "next to or across from = ___ de" },
      { id: 3, answers: ["aller"], hint: "near future: je vais ___ (infinitive)" },
      { id: 4, answers: ["regarder","voir"], hint: "to watch or see a film" },
    ],
  },
  6: {
    story: "Au café, le serveur demande : « Vous désirez ? » Je voudrais [1] café et [2] croissant, s'il vous plaît. Mon ami ne [3] pas de viande — il est végétarien. Il commande [4] salade verte.",
    blanks: [
      { id: 1, answers: ["un"], hint: "A/an + coffee (masculine) = ___" },
      { id: 2, answers: ["un"], hint: "A/an + croissant (masculine) = ___" },
      { id: 3, answers: ["mange"], hint: "manger — il form" },
      { id: 4, answers: ["une"], hint: "A/an + salade (feminine) = ___" },
    ],
  },
};

// ── Simple Translation Data ────────────────────────────────────────────────────

const SIMPLE_TRANSLATION: Record<number, { english: string; answers: string[]; hint: string; grammarNote: string }[]> = {
  1: [
    { english: "Hello, my name is Marie.", answers: ["bonjour, je m'appelle marie", "bonjour ! je m'appelle marie"], hint: "Bonjour + je m'___ + [name]", grammarNote: "Greeting + name: Bonjour ! Je m'appelle [nom]." },
    { english: "I am French and I am 15 years old.", answers: ["je suis français et j'ai quinze ans","je suis française et j'ai quinze ans","je suis français et j'ai 15 ans","je suis française et j'ai 15 ans"], hint: "je suis [nationality] + j'ai [number] ans", grammarNote: "Nationality uses être. Age uses avoir: j'ai ___ ans." },
    { english: "She is tall and very athletic.", answers: ["elle est grande et très sportive","elle est grande et sportive"], hint: "elle est [adj.f.] et [adj.f.]", grammarNote: "grand → grande (f), sportif → sportive (f). Adjectives agree with the subject." },
    { english: "We are not shy.", answers: ["nous ne sommes pas timides","on n'est pas timides","on n'est pas timide"], hint: "ne…pas wraps around être", grammarNote: "Negation: nous ne sommes pas + adjective." },
    { english: "Good evening! I am Canadian.", answers: ["bonsoir ! je suis canadien","bonsoir, je suis canadien","bonsoir ! je suis canadienne","bonsoir, je suis canadienne"], hint: "Evening greeting + je suis [nationality]", grammarNote: "bonsoir = good evening. canadien (m) / canadienne (f)." },
  ],
  2: [
    { english: "I like playing soccer on Saturdays.", answers: ["j'aime jouer au foot le samedi","j'aime jouer au football le samedi"], hint: "j'aime + infinitive + au + sport + le [day]", grammarNote: "aimer + infinitive. jouer à + article: jouer au foot." },
    { english: "She doesn't like watching television.", answers: ["elle n'aime pas regarder la télévision","elle n'aime pas regarder la télé","elle n'aime pas la télé"], hint: "elle n'aime pas + infinitive", grammarNote: "ne...pas: elle n'aime pas. aimer followed by infinitive for activities." },
    { english: "It is quarter past eight.", answers: ["il est huit heures et quart","il est huit heures quinze"], hint: "il est [hour] heures et quart", grammarNote: "Quarter past = et quart. Twenty past = vingt. Half past = et demie." },
    { english: "Do you like dancing?", answers: ["tu aimes danser ?","est-ce que tu aimes danser ?","aimes-tu danser ?","tu aimes danser"], hint: "tu aimes + infinitive + ?", grammarNote: "Three question forms: intonation, est-ce que, or inversion." },
    { english: "They play video games on Wednesdays.", answers: ["ils jouent aux jeux vidéo le mercredi","elles jouent aux jeux vidéo le mercredi"], hint: "jouer + aux + jeux vidéo + le mercredi", grammarNote: "jouer à + les = jouer aux. le mercredi = every Wednesday." },
  ],
  3: [
    { english: "I have math class on Monday.", answers: ["j'ai cours de maths le lundi","j'ai un cours de maths le lundi","j'ai maths le lundi"], hint: "j'ai + cours de + [subject] + le [day]", grammarNote: "avoir: j'ai cours de [matière]. le lundi = every Monday." },
    { english: "My sister is 13 years old.", answers: ["ma sœur a treize ans","ma sœur a 13 ans"], hint: "ma sœur + avoir + [number] + ans", grammarNote: "Age uses avoir. Never 'elle est 13 ans' — always 'elle a 13 ans'." },
    { english: "His father has blue eyes.", answers: ["son père a les yeux bleus","son père a des yeux bleus"], hint: "son père + a + les yeux + [color]", grammarNote: "Physical features use avoir. bleu → bleus (masc. pl.)." },
    { english: "I don't have a pencil.", answers: ["je n'ai pas de crayon","je n'ai pas de stylo"], hint: "je n'ai pas + de (not un after negation)", grammarNote: "After ne…pas: un/une/des → de. 'je n'ai pas DE crayon'." },
    { english: "My favorite subject is French.", answers: ["ma matière préférée est le français","mon cours préféré est le français","ma matière préférée c'est le français"], hint: "ma matière préférée + est + le français", grammarNote: "préféré/préférée agrees with the noun: matière (f.) → préférée." },
  ],
  4: [
    { english: "She goes to school by bus.", answers: ["elle va à l'école en bus","elle va au collège en bus","elle va au lycée en bus"], hint: "aller à + l'école + moyen de transport", grammarNote: "aller + à + place. Transport: en bus/en voiture/à pied/à vélo." },
    { english: "We are going to watch a film tonight.", answers: ["nous allons regarder un film ce soir","on va regarder un film ce soir"], hint: "futur proche: aller + infinitive", grammarNote: "Near future: subject + aller + infinitive. Ce soir = tonight." },
    { english: "He finishes his homework at six o'clock.", answers: ["il finit ses devoirs à six heures","il termine ses devoirs à six heures"], hint: "finir (-IR): il finit / terminer: il termine", grammarNote: "finir: je finis, tu finis, il finit (no -e). Regular -IR pattern." },
    { english: "The weather is nice so I'm going to take a walk.", answers: ["il fait beau alors je vais faire une promenade","il fait beau donc je vais faire une promenade"], hint: "il fait beau + alors/donc + aller + infinitive", grammarNote: "Weather: il fait beau/chaud/froid. alors/donc = so/therefore." },
    { english: "I choose a big salad.", answers: ["je choisis une grande salade","je choisis une salade"], hint: "choisir (-IR): je choisis", grammarNote: "choisir: je choisis, tu choisis, il choisit. -IR pattern: finis/choisit." },
  ],
  5: [
    { english: "The library is next to the school.", answers: ["la bibliothèque est à côté de l'école","la bibliothèque est à côté du lycée"], hint: "à côté de + location", grammarNote: "à côté de = next to. de + l' before vowel." },
    { english: "I go to the park to play football.", answers: ["je vais au parc pour jouer au foot","je vais au parc pour jouer au football","je vais au parc jouer au foot"], hint: "je vais au + place + pour + infinitive", grammarNote: "aller + à + le = au. Pour + infinitive = in order to." },
    { english: "There is a sofa in the living room.", answers: ["il y a un canapé dans le salon","il y a un sofa dans le salon"], hint: "il y a = there is + article + noun + dans + room", grammarNote: "il y a = there is/are. Never changes to agree with plural." },
    { english: "She comes from Bordeaux but lives in Paris.", answers: ["elle vient de bordeaux mais elle habite à paris","elle vient de bordeaux mais elle habite paris"], hint: "venir de + city + mais + habiter à + city", grammarNote: "venir de + city. habiter à + city. à Paris (not 'en Paris' — en for countries)." },
    { english: "My bedroom is next to the bathroom.", answers: ["ma chambre est à côté de la salle de bain","ma chambre est à côté des toilettes"], hint: "à côté de + feminine room", grammarNote: "de + la = de la (fem.). Compare: de + le = du (masc.)." },
  ],
  6: [
    { english: "I would like a coffee, please.", answers: ["je voudrais un café s'il vous plaît","je voudrais un café, s'il vous plaît"], hint: "je voudrais (polite) + un + drink", grammarNote: "je voudrais = conditional of vouloir. More polite than je veux." },
    { english: "Do you want some water or some juice?", answers: ["vous voulez de l'eau ou du jus ?","tu veux de l'eau ou du jus ?","vous voulez de l'eau ou du jus"], hint: "partitive: de l' (vowel) for water, du (masc.) for juice", grammarNote: "Partitive articles: du (m), de la (f), de l' (vowel)." },
    { english: "He doesn't eat meat because he is vegetarian.", answers: ["il ne mange pas de viande parce qu'il est végétarien","il ne mange pas de viande parce qu'il est végétarien."], hint: "ne...pas + de + parce que", grammarNote: "After negation: de la viande → pas DE viande." },
    { english: "The bill, please!", answers: ["l'addition s'il vous plaît","l'addition, s'il vous plaît","l'addition s'il vous plaît !"], hint: "l'addition = the bill", grammarNote: "l'addition = the check/bill. Use s'il vous plaît with staff." },
    { english: "We want to order a large salad.", answers: ["nous voulons commander une grande salade","on veut commander une grande salade","nous voudrions commander une grande salade"], hint: "vouloir + commander + une + BAGS adj + salade", grammarNote: "grande is BAGS — goes BEFORE the noun: une grande salade." },
  ],
};

// ── Error Hunt Data ────────────────────────────────────────────────────────────

const ERROR_HUNT: Record<number, { sentence: string; errorType: "grammar"|"accent"|"agreement"; errorDescription: string; answers: string[]; grammarNote: string; hint: string }[]> = {
  1: [
    { sentence: "Je suis americain.", errorType: "accent", errorDescription: "Missing accent: américain needs é", answers: ["je suis américain","je suis américaine"], grammarNote: "Nationality adjectives require proper accents. américain has é. Accents are part of the spelling.", hint: "Look at the nationality adjective — something is missing above a letter." },
    { sentence: "Elle est grand.", errorType: "agreement", errorDescription: "Adjective agreement: elle (f.) → grand must be grande", answers: ["elle est grande"], grammarNote: "Adjectives agree with the subject's gender. Elle → grand becomes grande (add -e for feminine).", hint: "Elle is feminine. Does the adjective match?" },
    { sentence: "Nous sommes content.", errorType: "agreement", errorDescription: "Adjective agreement: nous (pl.) → content must be contents", answers: ["nous sommes contents","nous sommes contentes"], grammarNote: "Adjectives agree in gender AND number. nous → content becomes contents (add -s for plural).", hint: "Nous is plural. Does the adjective have a plural ending?" },
    { sentence: "Il est une acteur célèbre.", errorType: "grammar", errorDescription: "Article gender: acteur is masculine → un, not une", answers: ["il est un acteur célèbre","c'est un acteur célèbre"], grammarNote: "Indefinite articles match the noun's gender. acteur (m.) → un acteur. une is feminine.", hint: "Is acteur masculine or feminine?" },
    { sentence: "Comment tu appelles ?", errorType: "grammar", errorDescription: "Missing reflexive pronoun: s'appeler needs te → t'", answers: ["comment tu t'appelles ?","comment t'appelles-tu ?"], grammarNote: "s'appeler is reflexive: tu t'appelles. The reflexive pronoun te (→ t' before vowel) is required.", hint: "s'appeler is reflexive. What pronoun goes with tu?" },
  ],
  2: [
    { sentence: "J'aime jouer à le foot.", errorType: "grammar", errorDescription: "Contraction: à + le must become au", answers: ["j'aime jouer au foot","j'aime jouer au football"], grammarNote: "à + le always contracts to au. Mandatory, not optional.", hint: "When à meets le, what must happen?" },
    { sentence: "Elle aime la danse beaucoup.", errorType: "grammar", errorDescription: "Word order: beaucoup must come directly after the verb", answers: ["elle aime beaucoup la danse"], grammarNote: "Adverbs like beaucoup, souvent, toujours go immediately AFTER the conjugated verb.", hint: "Where does beaucoup belong relative to the verb?" },
    { sentence: "Ils jouent souvent aux jeux vidéos.", errorType: "grammar", errorDescription: "Spelling: jeux vidéo is invariable — no -s on vidéo", answers: ["ils jouent souvent aux jeux vidéo"], grammarNote: "jeux vidéo: vidéo is an invariable modifier. Never jeux vidéos.", hint: "Which part of 'jeux vidéo' should not have a plural -s?" },
    { sentence: "Il est trois heure.", errorType: "grammar", errorDescription: "Missing plural: heures needs -s for numbers greater than one", answers: ["il est trois heures"], grammarNote: "Telling time: il est + number + heures (plural). Exception: il est une heure.", hint: "Check the time noun — is it singular or plural?" },
    { sentence: "Tu danses très bons.", errorType: "agreement", errorDescription: "Adverb vs adjective: bon is an adjective; the adverb is bien", answers: ["tu danses très bien"], grammarNote: "bon is an adjective (good). bien is the adverb (well). Tu danses bien = You dance well.", hint: "Is 'bon' an adjective or an adverb? Which form describes how you do something?" },
  ],
  3: [
    { sentence: "J'ai un cours de maths difficiles.", errorType: "agreement", errorDescription: "Agreement: difficile modifies cours (m.s.), not maths — no -s", answers: ["j'ai un cours de maths difficile"], grammarNote: "difficile modifies cours, which is masculine singular → no -s. Watch which noun the adjective actually describes.", hint: "Which noun does difficile describe — cours or maths?" },
    { sentence: "Ma sœur a les cheveux noires.", errorType: "agreement", errorDescription: "Agreement: cheveux is masculine plural → noirs, not noires", answers: ["ma sœur a les cheveux noirs"], grammarNote: "cheveux is masculine plural. Color adjectives agree: noir → noirs (m.pl.). Hair is always masculine in French.", hint: "Is cheveux masculine or feminine?" },
    { sentence: "Je n'ai pas un stylo.", errorType: "grammar", errorDescription: "After negation, un/une → de", answers: ["je n'ai pas de stylo"], grammarNote: "After ne…pas: un/une/du/de la/des → de. The noun stays the same.", hint: "What happens to un/une after negation?" },
    { sentence: "Elle a les yeux bleu.", errorType: "agreement", errorDescription: "Agreement: yeux (m.pl.) → bleu must be bleus", answers: ["elle a les yeux bleus"], grammarNote: "Color adjectives agree. yeux is masculine plural → bleu becomes bleus.", hint: "yeux is plural. Does bleu need a plural ending?" },
    { sentence: "Mon frère et ma sœur sont beau.", errorType: "agreement", errorDescription: "Agreement: mixed-gender plural → masculine plural beaux", answers: ["mon frère et ma sœur sont beaux"], grammarNote: "beau irregular forms: beau (m.s.), belle (f.s.), beaux (m.pl.), belles (f.pl.). Mixed group → masculine plural.", hint: "beau is irregular. What is its masculine plural form?" },
  ],
  4: [
    { sentence: "Je fais du sport cet matin.", errorType: "grammar", errorDescription: "Demonstrative: matin starts with consonant → ce, not cet", answers: ["je fais du sport ce matin"], grammarNote: "Demonstratives: ce (m.consonant), cet (m.vowel/h), cette (f.), ces (pl.). matin starts with 'm' → ce matin.", hint: "Does matin start with a vowel or consonant?" },
    { sentence: "C'est amusants.", errorType: "agreement", errorDescription: "c'est + adjective is always masculine singular", answers: ["c'est amusant"], grammarNote: "c'est + adjective is always masculine singular: c'est amusant, c'est intéressant. Never pluralizes.", hint: "Can an adjective after c'est ever be plural?" },
    { sentence: "Je vas au marché.", errorType: "grammar", errorDescription: "Conjugation: aller — je form is vais, not vas", answers: ["je vais au marché"], grammarNote: "Aller is irregular: je vais, tu vas, il va, nous allons, vous allez, ils vont.", hint: "aller is irregular. What is the je form?" },
    { sentence: "Elle finit ses devoirs difficile.", errorType: "agreement", errorDescription: "Agreement: devoirs (m.pl.) → difficile needs -s → difficiles", answers: ["elle finit ses devoirs difficiles"], grammarNote: "Adjectives agree with the noun they modify. devoirs (m.pl.) → difficile becomes difficiles.", hint: "devoirs is plural — does difficile agree?" },
    { sentence: "Il fait les courses et puis il prendre le bus.", errorType: "grammar", errorDescription: "Conjugation: prendre must be conjugated (il prend), not infinitive", answers: ["il fait les courses et puis il prend le bus"], grammarNote: "After a subject pronoun, the verb must be conjugated. prendre: je prends, tu prends, il prend.", hint: "The second clause needs a conjugated verb, not an infinitive." },
  ],
  5: [
    { sentence: "Le chat est sous de la table.", errorType: "grammar", errorDescription: "sous takes a direct article — no 'de' needed", answers: ["le chat est sous la table"], grammarNote: "sous = under. Takes direct article: sous la table, sous le lit. No 'sous de'. Compare: à côté DE la table.", hint: "Does sous need 'de' before the article?" },
    { sentence: "Il y as une piscine près d'ici.", errorType: "grammar", errorDescription: "il y a never takes -s — it's a fixed expression", answers: ["il y a une piscine près d'ici"], grammarNote: "il y a = there is/are. Fixed expression, never 'il y as'. Past: il y avait. Future: il y aura.", hint: "il y a is a fixed expression. Does it ever add -s?" },
    { sentence: "Je vais à la cinéma.", errorType: "grammar", errorDescription: "cinéma is masculine → au (à + le), not à la", answers: ["je vais au cinéma"], grammarNote: "cinéma is masculine: le cinéma. à + le = au → au cinéma. à la is for feminine nouns.", hint: "Is cinéma masculine or feminine?" },
    { sentence: "Votre chambre est en face du salle de bain.", errorType: "grammar", errorDescription: "salle is feminine → de la, not du (de + le)", answers: ["votre chambre est en face de la salle de bain"], grammarNote: "de + le = du (masc.), de + la = de la (fem.). salle is feminine → de la salle.", hint: "Is salle masculine or feminine?" },
    { sentence: "Elle habite dans un grand appartement belle.", errorType: "agreement", errorDescription: "appartement is masculine + starts with vowel → bel, not belle; and BAGS adj goes before noun", answers: ["elle habite dans un bel appartement","elle habite dans un bel appartement grand"], grammarNote: "beau irregular: bel before masculine vowel-start. BAGS adjectives go BEFORE the noun. belle is feminine.", hint: "appartement starts with a vowel. Which form of beau is used?" },
  ],
  6: [
    { sentence: "Je voudrais de la pain, s'il vous plaît.", errorType: "grammar", errorDescription: "pain is masculine → du, not de la", answers: ["je voudrais du pain, s'il vous plaît","je voudrais du pain s'il vous plaît"], grammarNote: "Partitive: du (masc.), de la (fem.), de l' (vowel). pain is masculine → du pain.", hint: "Is pain masculine or feminine?" },
    { sentence: "Il ne mange pas de la viande.", errorType: "grammar", errorDescription: "After ne...pas, de la → de", answers: ["il ne mange pas de viande"], grammarNote: "After negation: du/de la/de l'/des all become de. 'pas de viande'.", hint: "What happens to partitive articles after ne...pas?" },
    { sentence: "Nous pouvons commander une salade grande verte.", errorType: "agreement", errorDescription: "grande is BAGS (size) → must come BEFORE the noun", answers: ["nous pouvons commander une grande salade verte","nous pouvons commander une grande salade"], grammarNote: "BAGS adjectives (Beauty, Age, Goodness, Size) go BEFORE the noun. Color adjectives go after. grande = size → before.", hint: "Where do size adjectives go relative to the noun?" },
    { sentence: "Je veux du chocolat chauds.", errorType: "agreement", errorDescription: "chocolat is m.s. → chaud (no -s)", answers: ["je veux du chocolat chaud"], grammarNote: "du chocolat chaud: chocolat is masculine singular → chaud. chauds would be for plural masculine nouns.", hint: "chocolat is masculine singular — does chaud need a plural -s?" },
    { sentence: "Vous voulez de thé ou du café ?", errorType: "grammar", errorDescription: "thé is masculine → du thé, not bare 'de'", answers: ["vous voulez du thé ou du café ?","vous voulez du thé ou du café"], grammarNote: "Partitive for masculine nouns: du. 'de thé' alone is only correct after negation.", hint: "thé is masculine. Which partitive article goes with masculine nouns?" },
  ],
};

// ── Fill in the Blank ──────────────────────────────────────────────────────────

const FILL_BLANK_TEMPLATES: Record<number, { sentence: string; blank: string; answer: string; hint: string }[]> = {
  1: [
    { sentence: "Je ___ américain.", blank: "suis", answer: "suis", hint: "Use être (to be) — je form" },
    { sentence: "___ tu t'appelles ?", blank: "Comment", answer: "Comment", hint: "How = ___?" },
    { sentence: "Elle est très ___.", blank: "intelligente", answer: "intelligente", hint: "Smart (feminine form)" },
    { sentence: "Bonjour ! Je m'___ Lucas.", blank: "appelle", answer: "appelle", hint: "My name is = je m'___" },
    { sentence: "Nous ___ de Paris.", blank: "sommes", answer: "sommes", hint: "Être — nous form" },
  ],
  2: [
    { sentence: "J'___ la musique.", blank: "aime", answer: "aime", hint: "I like = j'___" },
    { sentence: "Tu ___ la télé le soir ?", blank: "regardes", answer: "regardes", hint: "-ER verb regarder — tu form" },
    { sentence: "Elle ne ___ pas danser.", blank: "aime", answer: "aime", hint: "ne…pas negation" },
    { sentence: "Il est ___ heures.", blank: "trois", answer: "trois", hint: "It's 3 o'clock" },
    { sentence: "Ils ___ aux jeux vidéo.", blank: "jouent", answer: "jouent", hint: "jouer — ils form" },
  ],
  3: [
    { sentence: "J'___ un cours de maths.", blank: "ai", answer: "ai", hint: "avoir — j' form" },
    { sentence: "Les maths, c'est très ___.", blank: "difficile", answer: "difficile", hint: "It's very difficult" },
    { sentence: "Elle a ___ un stylo rouge.", blank: "toujours", answer: "toujours", hint: "Always comes after the verb" },
    { sentence: "Mon cours ___ est le français.", blank: "préféré", answer: "préféré", hint: "favorite (BAGS adj — after noun here)" },
    { sentence: "Je n'ai pas ___ calculatrice.", blank: "de", answer: "de", hint: "After negation: pas + de" },
  ],
  4: [
    { sentence: "___ père s'appelle Marc.", blank: "Mon", answer: "Mon", hint: "My (père = masculine)" },
    { sentence: "Ma sœur a quinze ___.", blank: "ans", answer: "ans", hint: "Years old with avoir" },
    { sentence: "C'est ___ beau garçon.", blank: "un", answer: "un", hint: "A/an + masculine" },
    { sentence: "Sa ___ est très sympa.", blank: "famille", answer: "famille", hint: "his/her + feminine noun" },
    { sentence: "___ parents viennent de Lyon.", blank: "Ses", answer: "Ses", hint: "Possessive adj — plural" },
  ],
  5: [
    { sentence: "Je vais ___ cinéma.", blank: "au", answer: "au", hint: "à + le → ___ (masculine)" },
    { sentence: "Elle va ___ bibliothèque.", blank: "à la", answer: "à la", hint: "à + la = ___ (feminine)" },
    { sentence: "Nous allons ___ faire un pique-nique.", blank: "aller", answer: "aller", hint: "Near future: aller + ___" },
    { sentence: "Le chat est ___ la table.", blank: "sous", answer: "sous", hint: "The cat is ___ the table" },
    { sentence: "Je ___ de Marseille.", blank: "viens", answer: "viens", hint: "venir — je form" },
  ],
  6: [
    { sentence: "Je voudrais ___ pain.", blank: "du", answer: "du", hint: "Partitive: some bread (masc.)" },
    { sentence: "Elle boit ___ café.", blank: "du", answer: "du", hint: "Some coffee (masc.)" },
    { sentence: "Il ne mange pas ___ viande.", blank: "de", answer: "de", hint: "After negation: partitive → de" },
    { sentence: "Je ___ commander une pizza.", blank: "veux", answer: "veux", hint: "vouloir — je form" },
    { sentence: "Vous ___ m'aider ?", blank: "pouvez", answer: "pouvez", hint: "pouvoir — vous form" },
  ],
};

function FillBlankExercise({
  vocab,
  unit,
  onComplete,
}: {
  vocab: VocabItem[];
  unit: number;
  onComplete: () => void;
}) {
  const questions = FILL_BLANK_TEMPLATES[unit] ?? FILL_BLANK_TEMPLATES[1];
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);

  function check() {
    let correct = 0;
    questions.forEach((q, i) => {
      if (answers[i]?.trim().toLowerCase() === q.answer.toLowerCase()) correct++;
    });
    setScore(correct);
    setChecked(true);
    if (correct >= Math.ceil(questions.length * 0.7)) onComplete();

    // Log mistakes via store
    questions.forEach((q, i) => {
      const ans = answers[i]?.trim() ?? "";
      if (ans.toLowerCase() !== q.answer.toLowerCase()) {
        try {
          addMistake({
            unitNumber: unit,
            category: "grammar",
            question: q.sentence.replace("___", "___"),
            wrongAnswer: ans || "(blank)",
            rightAnswer: q.answer,
            explanation: q.hint,
          });
        } catch {}
      }
    });
  }

  function reset() {
    setAnswers({});
    setChecked(false);
    setScore(0);
  }

  return (
    <div className="space-y-4">
      <div
        className="p-4 rounded-xl text-sm"
        style={{ backgroundColor: "var(--surface2)", border: "1px solid var(--border)" }}
      >
        <p style={{ color: "var(--text)" }}>
          Fill in each blank with the correct French word. Focus: this is <strong>recognition practice</strong> — you see the context, you produce the answer.
        </p>
      </div>

      <div className="space-y-3">
        {questions.map((q, i) => {
          const ans = answers[i] ?? "";
          const isCorrect = checked && ans.trim().toLowerCase() === q.answer.toLowerCase();
          const isWrong = checked && !isCorrect;

          return (
            <div
              key={i}
              className="p-4 rounded-xl"
              style={{
                backgroundColor: "var(--surface)",
                border: `1px solid ${isCorrect ? "#10b981" : isWrong ? "#ef4444" : "var(--border)"}`,
              }}
            >
              <p className="fr-text text-base mb-2" style={{ color: "var(--text)" }}>
                {q.sentence.replace(
                  "___",
                  `[${checked ? (isCorrect ? "✓" : q.answer) : "___"}]`
                )}
              </p>
              {!checked && (
                <input
                  type="text"
                  value={ans}
                  onChange={(e) => setAnswers((prev) => ({ ...prev, [i]: e.target.value }))}
                  onKeyDown={(e) => e.key === "Enter" && check()}
                  className="px-3 py-1.5 rounded-lg text-sm border outline-none fr-text focus:ring-2 focus:ring-[var(--accent-fr)]"
                  style={{ backgroundColor: "var(--surface2)", borderColor: "var(--border)", color: "var(--text)" }}
                  placeholder="Écris ta réponse…"
                />
              )}
              {checked && (
                <div className="flex items-center gap-2 text-xs mt-1">
                  {isCorrect ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">✓ Correct !</span>
                  ) : (
                    <span className="text-red-600 dark:text-red-400">
                      You wrote: <strong>{ans || "(blank)"}</strong> → Correct: <strong className="fr-text">{q.answer}</strong>
                    </span>
                  )}
                  <span style={{ color: "var(--text-muted)" }}>({q.hint})</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {checked ? (
        <div className="space-y-3">
          <div
            className="p-4 rounded-xl text-center"
            style={{ backgroundColor: "var(--surface2)", border: "1px solid var(--border)" }}
          >
            <p className="text-2xl font-bold" style={{ color: "var(--text)" }}>
              {score}/{questions.length}
            </p>
            <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
              {score === questions.length
                ? "Perfect score! 🎉"
                : score >= Math.ceil(questions.length * 0.7)
                ? "Good job! Review your mistakes."
                : "Keep practicing — you've got this!"}
            </p>
          </div>
          <button
            onClick={reset}
            className="w-full py-2.5 rounded-xl text-sm font-medium border transition-colors hover:bg-[var(--surface2)] flex items-center justify-center gap-2"
            style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
          >
            <RefreshCw className="h-4 w-4" /> Try Again
          </button>
        </div>
      ) : (
        <button
          onClick={check}
          className="w-full py-3 rounded-xl text-white text-sm font-semibold"
          style={{ backgroundColor: "var(--accent-fr)" }}
        >
          Check My Answers →
        </button>
      )}
    </div>
  );
}

// ── Translation Exercise ───────────────────────────────────────────────────────

const TRANSLATION_PROMPTS: Record<number, string[]> = {
  1: [
    "My name is Marie and I am French.",
    "He is tall and very athletic.",
    "We are from Canada — we are Canadian.",
    "She is shy but very intelligent.",
    "Good evening! My name is Thomas. I am 15 years old.",
  ],
  2: [
    "I love listening to music on Saturday.",
    "She doesn't like playing video games.",
    "Do you like dancing? I prefer singing.",
    "It is half past seven in the evening.",
    "They play soccer on Wednesdays.",
  ],
  3: [
    "I have math and French on Monday.",
    "History is interesting but very difficult.",
    "She always has a red pen in her backpack.",
    "I don't have a calculator — it's boring.",
    "My favorite class is science because it's super.",
  ],
  4: [
    "My father is tall with brown hair.",
    "Her sister is 13 years old.",
    "They have a new dog — it's beautiful!",
    "His grandparents are very old but kind.",
    "My family lives in a beautiful old house.",
  ],
  5: [
    "I go to school every day by bus.",
    "The cat is under the table in the kitchen.",
    "We are going to go to the movies tonight.",
    "She comes from Lyon and lives in Paris now.",
    "Her room is next to the bathroom.",
  ],
  6: [
    "I would like some bread and butter, please.",
    "Do you want some coffee or some tea?",
    "She can't eat meat — she's vegetarian.",
    "We want to order a salad and fish.",
    "The bill, please! Do you have ice cream?",
  ],
};

function TranslationExercise({
  vocab,
  unit,
  onComplete,
}: {
  vocab: VocabItem[];
  unit: number;
  onComplete: () => void;
}) {
  const prompts = TRANSLATION_PROMPTS[unit] ?? TRANSLATION_PROMPTS[1];
  const [currentIdx, setCurrentIdx] = useState(0);
  const [translation, setTranslation] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const prompt = prompts[currentIdx];

  async function submit() {
    if (!translation.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "grade_translation",
          content: `Translate to French: "${prompt}"\n\nStudent's translation: "${translation}"`,
          context: { unit },
        }),
      });
      const data = await res.json();
      setFeedback(data.response ?? "Unable to grade.");
    } catch {
      setFeedback("Unable to grade — check your AI API key.");
    } finally {
      setLoading(false);
    }
  }

  function next() {
    if (currentIdx + 1 >= prompts.length) {
      setDone(true);
      onComplete();
    } else {
      setCurrentIdx((i) => i + 1);
      setTranslation("");
      setFeedback("");
    }
  }

  if (done) {
    return (
      <div className="text-center py-8 space-y-4">
        <p className="text-4xl">🏆</p>
        <p className="font-bold text-lg" style={{ color: "var(--text)" }}>All translations done!</p>
        <button
          onClick={() => { setCurrentIdx(0); setTranslation(""); setFeedback(""); setDone(false); }}
          className="px-6 py-2.5 rounded-xl text-sm font-medium border hover:bg-[var(--surface2)]"
          style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
        >
          Start Over
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs" style={{ color: "var(--text-muted)" }}>
        <span>{currentIdx + 1} / {prompts.length}</span>
        <span>English → French production</span>
      </div>

      <div
        className="p-5 rounded-xl"
        style={{ backgroundColor: "var(--surface)", border: "2px solid var(--accent-fr)" }}
      >
        <p className="text-xs uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>
          Translate to French:
        </p>
        <p className="text-lg font-semibold" style={{ color: "var(--text)" }}>{prompt}</p>
      </div>

      <textarea
        value={translation}
        onChange={(e) => setTranslation(e.target.value)}
        rows={3}
        className="w-full px-4 py-3 rounded-xl text-sm border outline-none resize-none fr-text focus:ring-2 focus:ring-[var(--accent-fr)]"
        style={{
          backgroundColor: "var(--surface)",
          borderColor: "var(--border)",
          color: "var(--text)",
          fontSize: "1rem",
        }}
        placeholder="Écris ta traduction ici…"
        disabled={!!feedback}
      />

      {feedback && (
        <div
          className="rounded-xl p-4 whitespace-pre-wrap text-sm"
          style={{ backgroundColor: "var(--surface2)", border: "1px solid var(--border)", color: "var(--text)" }}
        >
          {feedback}
        </div>
      )}

      {!feedback ? (
        <button
          onClick={submit}
          disabled={loading || !translation.trim()}
          className="w-full py-3 rounded-xl text-white text-sm font-semibold disabled:opacity-60"
          style={{ backgroundColor: "var(--accent-fr)" }}
        >
          {loading ? "Grading with AI…" : "Submit for AI Feedback →"}
        </button>
      ) : (
        <button
          onClick={next}
          className="w-full py-3 rounded-xl text-white text-sm font-semibold"
          style={{ backgroundColor: "#10b981" }}
        >
          {currentIdx + 1 >= prompts.length ? "Finish ✓" : "Next Sentence →"}
        </button>
      )}
    </div>
  );
}

// ── Word Bank Exercise ─────────────────────────────────────────────────────────

// Sentence Builder — each prompt gives a VERB and ADJECTIVE(S) to use.
// Slightly more complex than single-word: includes adjective agreement, adverbs, conjunctions.
const WORD_BANK_SENTENCES: Record<number, { words: string[]; answer: string; hint: string; verbFocus?: string }[]> = {
  1: [
    {
      words: ["suis", "je", "grand", "et", "sportif"],
      answer: "je suis grand et sportif",
      hint: "Verb: être — two adjectives joined by et (both masculine here)",
      verbFocus: "être + adjectives",
    },
    {
      words: ["est", "elle", "petite", "très", "intelligente", "mais"],
      answer: "elle est petite mais très intelligente",
      hint: "Verb: être — mais (but) connects two adjectives; très intensifies the second",
      verbFocus: "être + contrast with mais",
    },
    {
      words: ["ne", "nous", "sommes", "timides", "pas"],
      answer: "nous ne sommes pas timides",
      hint: "Verb: être — negation ne…pas wraps around the verb",
      verbFocus: "ne…pas + être",
    },
    {
      words: ["il", "est", "sympa", "amusant", "et", "très"],
      answer: "il est sympa et très amusant",
      hint: "Verb: être — sympa is invariable; très comes right before amusant",
      verbFocus: "être + personality adjectives",
    },
  ],
  2: [
    {
      words: ["j'aime", "la", "musique", "beaucoup", "mais", "j'aime", "aussi", "le", "sport"],
      answer: "j'aime beaucoup la musique mais j'aime aussi le sport",
      hint: "Verb: aimer — beaucoup after verb; aussi = also; definite articles la/le for general preferences",
      verbFocus: "aimer + beaucoup / aussi",
    },
    {
      words: ["elle", "n'aime", "pas", "regarder", "la", "télé", "ennuyeuse"],
      answer: "elle n'aime pas regarder la télé ennuyeuse",
      hint: "Verb: aimer — negation + infinitive; adjective ennuyeux(euse) agrees with télé (fem.)",
      verbFocus: "ne…pas aimer + infinitive",
    },
    {
      words: ["ils", "jouent", "souvent", "aux", "jeux", "vidéo", "le", "soir"],
      answer: "ils jouent souvent aux jeux vidéo le soir",
      hint: "Verb: jouer — adverb souvent comes after conjugated verb; jouer aux + plural noun",
      verbFocus: "jouer + souvent",
    },
    {
      words: ["tu", "étudies", "beaucoup", "mais", "tu", "es", "fatigué"],
      answer: "tu étudies beaucoup mais tu es fatigué",
      hint: "Two verbs: étudier (-ER) and être — connect two ideas with mais",
      verbFocus: "étudier + être + adjective",
    },
  ],
  3: [
    {
      words: ["ma", "sœur", "est", "grande", "et", "très", "intelligente"],
      answer: "ma sœur est grande et très intelligente",
      hint: "Verb: être — adjectives grande/intelligente agree with sœur (feminine); très intensifies",
      verbFocus: "être + feminine adjective agreement",
    },
    {
      words: ["j'ai", "un", "cours", "de", "maths", "difficile", "le", "mardi"],
      answer: "j'ai un cours de maths difficile le mardi",
      hint: "Verb: avoir — difficile comes AFTER the noun it describes; le mardi = on Tuesdays",
      verbFocus: "avoir + adjective after noun",
    },
    {
      words: ["mon", "père", "est", "sympa", "et", "il", "a", "les", "yeux", "bleus"],
      answer: "mon père est sympa et il a les yeux bleus",
      hint: "Two verbs: être + avoir — bleus agrees with yeux (masculine plural)",
      verbFocus: "être + avoir + color adjective",
    },
    {
      words: ["nous", "n'avons", "pas", "de", "cours", "d'EPS", "aujourd'hui"],
      answer: "nous n'avons pas de cours d'EPS aujourd'hui",
      hint: "Verb: avoir — after ne…pas, un/une/des → de; d'EPS uses elision",
      verbFocus: "ne…pas avoir + de",
    },
    {
      words: ["sa", "petite", "sœur", "est", "amusante", "mais", "un", "peu", "timide"],
      answer: "sa petite sœur est amusante mais un peu timide",
      hint: "petite is a BAGS adjective (before noun); amusante/timide agree with sœur (fem.); un peu = a little",
      verbFocus: "être + BAGS adjective + agreement",
    },
  ],
  4: [
    {
      words: ["je", "vais", "faire", "du", "sport", "cet", "après-midi"],
      answer: "je vais faire du sport cet après-midi",
      hint: "Near future: aller + infinitive faire; du sport = partitive; cet before masc. vowel sound",
      verbFocus: "aller + faire (near future)",
    },
    {
      words: ["il", "fait", "beau", "alors", "nous", "allons", "faire", "une", "longue", "promenade"],
      answer: "il fait beau alors nous allons faire une longue promenade",
      hint: "Weather expression il fait beau; alors = so/therefore; longue (BAGS adj) comes before promenade",
      verbFocus: "faire (weather) + aller + faire (activity)",
    },
    {
      words: ["elle", "finit", "ses", "devoirs", "difficiles", "avant", "de", "regarder", "la", "télé"],
      answer: "elle finit ses devoirs difficiles avant de regarder la télé",
      hint: "Verb: finir (-IR) — difficiles agrees with devoirs (masc. plural); avant de + infinitive",
      verbFocus: "finir (-IR) + adjective agreement",
    },
    {
      words: ["ils", "vont", "au", "cinéma", "ce", "soir", "parce que", "c'est", "amusant"],
      answer: "ils vont au cinéma ce soir parce que c'est amusant",
      hint: "aller + au (à+le masc.); parce que = because; c'est + adjective",
      verbFocus: "aller + au + parce que",
    },
  ],
  5: [
    {
      words: ["je", "vais", "à la", "bibliothèque", "pour", "étudier", "tranquillement"],
      answer: "je vais à la bibliothèque pour étudier tranquillement",
      hint: "aller + à la (fem.); pour + infinitive = in order to; tranquillement is an adverb (-ment)",
      verbFocus: "aller + à la + pour + infinitive",
    },
    {
      words: ["le", "chat", "paresseux", "est", "sous", "la", "grande", "table"],
      answer: "le chat paresseux est sous la grande table",
      hint: "paresseux after noun (BANGS); sous = under; grande is BAGS — before table (fem.)",
      verbFocus: "être + preposition + adjective placement",
    },
    {
      words: ["nous", "allons", "visiter", "notre", "belle", "nouvelle", "maison", "demain"],
      answer: "nous allons visiter notre belle nouvelle maison demain",
      hint: "Near future; belle and nouvelle are BAGS — both before maison; stacked pre-noun adjectives",
      verbFocus: "aller + stacked BAGS adjectives",
    },
    {
      words: ["elle", "vient", "de", "Lyon", "et", "elle", "habite", "dans", "un", "grand", "appartement"],
      answer: "elle vient de Lyon et elle habite dans un grand appartement",
      hint: "venir de = to come from; habiter dans = to live in; grand is BAGS (before masc. noun)",
      verbFocus: "venir + habiter + grand",
    },
  ],
  6: [
    {
      words: ["je", "voudrais", "du", "pain", "frais", "et", "du", "bon", "fromage", "s'il vous plaît"],
      answer: "je voudrais du pain frais et du bon fromage s'il vous plaît",
      hint: "vouloir conditionnel; du = partitive (masc.); frais after noun; bon is BAGS — before fromage",
      verbFocus: "vouloir + partitive + adjective placement",
    },
    {
      words: ["elle", "ne", "mange", "pas", "de", "viande", "rouge", "parce que", "elle", "est", "végétarienne"],
      answer: "elle ne mange pas de viande rouge parce que elle est végétarienne",
      hint: "After ne…pas, partitive → de; rouge after noun; parce que links cause",
      verbFocus: "manger + ne…pas de + parce que",
    },
    {
      words: ["nous", "pouvons", "commander", "une", "grande", "salade", "verte"],
      answer: "nous pouvons commander une grande salade verte",
      hint: "pouvoir + infinitive; grande is BAGS (before noun); verte (color) comes after noun",
      verbFocus: "pouvoir + BAGS vs color adjective",
    },
    {
      words: ["vous", "voulez", "du", "thé", "chaud", "ou", "du", "café", "fort"],
      answer: "vous voulez du thé chaud ou du café fort",
      hint: "vouloir + partitive du (both masc.); adjectives chaud/fort come AFTER the drink nouns",
      verbFocus: "vouloir + partitive + post-noun adjectives",
    },
  ],
};

function WordBankExercise({
  vocab,
  unit,
  onComplete,
}: {
  vocab: VocabItem[];
  unit: number;
  onComplete: () => void;
}) {
  const sentences = WORD_BANK_SENTENCES[unit] ?? WORD_BANK_SENTENCES[1];
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [available, setAvailable] = useState<string[]>([...sentences[0].words]);
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = sentences[idx];

  function selectWord(word: string, fromSelected: boolean) {
    if (checked) return;
    if (fromSelected) {
      setSelected((s) => s.filter((w, i) => !(w === word && i === s.lastIndexOf(word))));
      setAvailable((a) => [...a, word]);
    } else {
      const idx = available.indexOf(word);
      if (idx === -1) return;
      const newAvail = [...available];
      newAvail.splice(idx, 1);
      setAvailable(newAvail);
      setSelected((s) => [...s, word]);
    }
  }

  function check() {
    const attempt = selected.join(" ").toLowerCase();
    const isCorrect = attempt === q.answer.toLowerCase();
    setCorrect(isCorrect);
    setChecked(true);
    if (isCorrect) setScore((s) => s + 1);
  }

  function next() {
    if (idx + 1 >= sentences.length) {
      setDone(true);
      onComplete();
    } else {
      const next = sentences[idx + 1];
      setIdx((i) => i + 1);
      setSelected([]);
      setAvailable([...next.words]);
      setChecked(false);
      setCorrect(false);
    }
  }

  if (done) {
    return (
      <div className="text-center py-8 space-y-3">
        <p className="text-4xl">{score >= sentences.length ? "🎉" : "💪"}</p>
        <p className="font-bold" style={{ color: "var(--text)" }}>{score}/{sentences.length} sentences correct</p>
        <button
          onClick={() => { setIdx(0); setSelected([]); setAvailable([...sentences[0].words]); setChecked(false); setCorrect(false); setDone(false); setScore(0); }}
          className="px-6 py-2.5 rounded-xl text-sm border hover:bg-[var(--surface2)]"
          style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs" style={{ color: "var(--text-muted)" }}>
        <span>{idx + 1} / {sentences.length}</span>
        <span>{score} correct</span>
      </div>

      <div className="space-y-1">
        <p className="text-sm font-medium" style={{ color: "var(--text)" }}>
          Arrange the words to form a correct French sentence:
        </p>
        {q.verbFocus && (
          <span
            className="inline-block text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ backgroundColor: "var(--accent-fr)", color: "white", opacity: 0.85 }}
          >
            Focus: {q.verbFocus}
          </span>
        )}
      </div>

      {/* Selected words */}
      <div
        className="min-h-12 p-3 rounded-xl border-2 border-dashed flex flex-wrap gap-2 items-center transition-colors"
        style={{
          borderColor: checked ? (correct ? "#10b981" : "#ef4444") : "var(--border)",
          backgroundColor: "var(--surface2)",
        }}
      >
        {selected.length === 0 && (
          <span className="text-xs" style={{ color: "var(--text-subtle)" }}>Tap words below to build the sentence…</span>
        )}
        {selected.map((w, i) => (
          <button
            key={`sel_${i}`}
            onClick={() => selectWord(w, true)}
            className="px-3 py-1.5 rounded-lg text-sm font-semibold fr-text transition-all hover:scale-105 hover:opacity-70 active:scale-95"
            style={{ backgroundColor: "#002395", border: "1px solid #001a6e", color: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }}
          >
            {w}
          </button>
        ))}
      </div>

      {/* Word bank */}
      <div className="flex flex-wrap gap-2">
        {available.map((w, i) => (
          <button
            key={`avail_${i}`}
            onClick={() => selectWord(w, false)}
            className="px-3 py-1.5 rounded-lg text-sm font-semibold fr-text transition-all hover:scale-105 hover:shadow-md active:scale-95"
            style={{
              backgroundColor: "#e8edf8",
              border: "1px solid #b8c8e8",
              color: "#1a2f6e",
              boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
            }}
          >
            {w}
          </button>
        ))}
      </div>

      {checked && (
        <div
          className="p-3 rounded-xl text-sm"
          style={{
            backgroundColor: correct ? "#d1fae5" : "#fee2e2",
            color: correct ? "#065f46" : "#991b1b",
          }}
        >
          {correct ? (
            <span>✓ Correct! <strong className="fr-text">{q.answer}</strong></span>
          ) : (
            <span>Correct answer: <strong className="fr-text">{q.answer}</strong> — {q.hint}</span>
          )}
        </div>
      )}

      {!checked ? (
        <button
          onClick={check}
          disabled={selected.length === 0}
          className="w-full py-3 rounded-xl text-white text-sm font-semibold disabled:opacity-60"
          style={{ backgroundColor: "var(--accent-fr)" }}
        >
          Check →
        </button>
      ) : (
        <button
          onClick={next}
          className="w-full py-3 rounded-xl text-white text-sm font-semibold"
          style={{ backgroundColor: "#10b981" }}
        >
          {idx + 1 >= sentences.length ? "Finish ✓" : "Next →"}
        </button>
      )}
    </div>
  );
}

// ── Reading Check ──────────────────────────────────────────────────────────────

function ReadingCheckExercise({ unit, onComplete }: { unit: number; onComplete: () => void }) {
  const MINI_PASSAGES: Record<number, { text: string; questions: string[]; answers: string[] }> = {
    1: {
      text: "Bonjour ! Je m'appelle Léa. Je suis française et j'habite à Paris. Je suis sympa et un peu timide. J'ai une amie qui s'appelle Sophie. Elle est très drôle !",
      questions: ["Comment s'appelle la fille ?", "Elle est de quelle nationalité ?", "Comment est Sophie ?"],
      answers: ["Léa", "Elle est française.", "Elle est drôle."],
    },
    2: {
      text: "Le mardi, je joue au foot avec mes amis. Le vendredi soir, j'écoute de la musique. Je n'aime pas regarder la télé mais j'adore surfer sur Internet.",
      questions: ["Qu'est-ce qu'il fait le mardi ?", "Est-ce qu'il aime la télé ?", "Qu'est-ce qu'il adore ?"],
      answers: ["Il joue au foot.", "Non, il n'aime pas la télé.", "Il adore surfer sur Internet."],
    },
    3: {
      text: "J'ai cours de sciences, de maths et de français aujourd'hui. J'aime bien les sciences — c'est intéressant. Je déteste les maths parce que c'est difficile. J'ai toujours mon cahier et mon stylo.",
      questions: ["Quels cours a-t-il aujourd'hui ?", "Pourquoi aime-t-il les sciences ?", "Qu'est-ce qu'il a toujours ?"],
      answers: ["Sciences, maths et français.", "Parce que c'est intéressant.", "Son cahier et son stylo."],
    },
    4: {
      text: "Ma famille est grande. Mon père a 45 ans et ma mère a 42 ans. J'ai un frère — il s'appelle Paul et il a 12 ans. Mes grands-parents habitent à Lyon. Ils sont très vieux mais très sympas.",
      questions: ["Quel âge a son père ?", "Comment s'appelle son frère ?", "Où habitent ses grands-parents ?"],
      answers: ["Il a 45 ans.", "Il s'appelle Paul.", "Ils habitent à Lyon."],
    },
    5: {
      text: "Ma maison est grande. Il y a un salon, une cuisine, et trois chambres. Ma chambre est à côté de la salle de bain. Demain, je vais aller au cinéma avec mon ami.",
      questions: ["Combien de chambres y a-t-il ?", "Où est la chambre ?", "Qu'est-ce qu'il va faire demain ?"],
      answers: ["Il y a trois chambres.", "À côté de la salle de bain.", "Il va aller au cinéma."],
    },
    6: {
      text: "Au café, je voudrais un café et un croissant s'il vous plaît. Mon ami veut de l'eau et une salade. Nous ne mangeons pas de viande. Le garçon apporte l'addition.",
      questions: ["Qu'est-ce qu'il veut ?", "Qu'est-ce que son ami veut ?", "Est-ce qu'ils mangent de la viande ?"],
      answers: ["Un café et un croissant.", "De l'eau et une salade.", "Non, ils ne mangent pas de viande."],
    },
  };

  const passage = MINI_PASSAGES[unit] ?? MINI_PASSAGES[1];
  const [answers, setAnswers] = useState<string[]>(["", "", ""]);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  async function check() {
    setLoading(true);
    try {
      const qa = passage.questions
        .map((q, i) => `Q: ${q}\nStudent: ${answers[i] ?? "(no answer)"}\nCorrect: ${passage.answers[i]}`)
        .join("\n\n");
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: "grade_reading", content: qa, context: { unit } }),
      });
      const data = await res.json();
      setFeedback(data.response);
      onComplete();
    } catch {
      setFeedback("Could not grade — check API key.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div
        className="p-4 rounded-xl fr-text text-base leading-relaxed"
        style={{ backgroundColor: "var(--surface2)", border: "1px solid var(--border)", color: "var(--text)" }}
      >
        {passage.text}
      </div>
      {passage.questions.map((q, i) => (
        <div key={i}>
          <label className="block text-sm font-medium mb-1 fr-text" style={{ color: "var(--text)" }}>
            {i + 1}. {q}
          </label>
          <input
            type="text"
            value={answers[i]}
            onChange={(e) => setAnswers((prev) => { const next = [...prev]; next[i] = e.target.value; return next; })}
            className="w-full px-3 py-2 rounded-lg text-sm border outline-none fr-text focus:ring-2 focus:ring-[var(--accent-fr)]"
            style={{ backgroundColor: "var(--surface2)", borderColor: "var(--border)", color: "var(--text)" }}
            placeholder="Répondez en français…"
          />
        </div>
      ))}
      {feedback && (
        <div className="p-4 rounded-xl whitespace-pre-wrap text-sm" style={{ backgroundColor: "var(--surface2)", border: "1px solid var(--border)", color: "var(--text)" }}>
          {feedback}
        </div>
      )}
      {!feedback && (
        <button onClick={check} disabled={loading} className="w-full py-3 rounded-xl text-white text-sm font-semibold disabled:opacity-60" style={{ backgroundColor: "var(--accent-fr)" }}>
          {loading ? "Checking…" : "Check Answers →"}
        </button>
      )}
    </div>
  );
}

// ── Timed Write ────────────────────────────────────────────────────────────────

const TIMED_PROMPTS: Record<number, string> = {
  1: "Présente-toi : ton nom, ta nationalité, et 3 adjectifs qui te décrivent.",
  2: "Décris ce que tu aimes et n'aimes pas faire le week-end.",
  3: "Parle de ton cours préféré et de ton cours le plus difficile.",
  4: "Décris un membre de ta famille — son apparence et sa personnalité.",
  5: "Décris ta chambre et ce que tu vas faire ce week-end.",
  6: "Tu es au restaurant. Commande un repas complet pour toi et ton ami.",
};

// ── Story Fill Exercise ────────────────────────────────────────────────────────

function StoryFillExercise({ unit, onComplete }: { unit: number; onComplete: () => void }) {
  const data = STORY_FILL[unit] ?? STORY_FILL[1];
  const [inputs, setInputs] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState(false);
  const [results, setResults] = useState<Record<number, "correct"|"accent_only"|"wrong">>({});
  const score = Object.values(results).filter(r => r !== "wrong").length;

  const parts = data.story.split(/(\[\d+\])/);

  function check() {
    const r: Record<number, "correct"|"accent_only"|"wrong"> = {};
    for (const b of data.blanks) {
      r[b.id] = matchAnswer(inputs[b.id] ?? "", b.answers);
    }
    setResults(r);
    setChecked(true);
    if (Object.values(r).filter(v => v === "wrong").length === 0) onComplete();
  }

  function reset() {
    setInputs({});
    setChecked(false);
    setResults({});
  }

  return (
    <div className="space-y-4">
      <p className="text-xs" style={{ color: "var(--text-muted)" }}>Fill in each blank to complete the story:</p>
      <div
        className="p-4 rounded-xl fr-text text-base leading-[2.2] border"
        style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)", color: "var(--text)" }}
      >
        {parts.map((part, i) => {
          const match = part.match(/\[(\d+)\]/);
          if (match) {
            const id = parseInt(match[1]);
            const blank = data.blanks.find(b => b.id === id);
            const result = results[id];
            return (
              <span key={i} className="inline-flex items-end mx-1">
                <input
                  type="text"
                  value={inputs[id] ?? ""}
                  onChange={e => setInputs(prev => ({ ...prev, [id]: e.target.value }))}
                  disabled={checked}
                  className="fr-text text-base border-b-2 bg-transparent outline-none px-1 text-center transition-colors"
                  style={{
                    width: `${Math.max(5, (blank?.answers[0].length ?? 5) + 2)}ch`,
                    borderColor: checked ? (result === "correct" || result === "accent_only" ? "#10b981" : "#ef4444") : "var(--accent-fr)",
                    color: "var(--text)",
                  }}
                />
                {checked && result === "wrong" && blank && (
                  <span className="text-xs text-red-500 ml-0.5">[{blank.answers[0]}]</span>
                )}
                {checked && result === "accent_only" && (
                  <span className="text-xs text-amber-500 ml-0.5">accent!</span>
                )}
              </span>
            );
          }
          return <span key={i}>{part}</span>;
        })}
      </div>

      {checked && (
        <div className="space-y-2">
          {data.blanks.map(b => results[b.id] === "wrong" && (
            <p key={b.id} className="text-xs p-2 rounded-lg" style={{ backgroundColor: "#fee2e2", color: "#991b1b" }}>
              Blank {b.id}: {b.hint}
            </p>
          ))}
          <p className="text-sm font-medium" style={{ color: "var(--text)" }}>
            {score}/{data.blanks.length} correct {score === data.blanks.length ? "🎉" : ""}
          </p>
        </div>
      )}

      {!checked ? (
        <button
          onClick={check}
          disabled={Object.keys(inputs).length < data.blanks.length || Object.values(inputs).some(v => !v.trim())}
          className="w-full py-3 rounded-xl text-white text-sm font-semibold disabled:opacity-60"
          style={{ backgroundColor: "var(--accent-fr)" }}
        >
          Check All →
        </button>
      ) : (
        <button onClick={reset} className="w-full py-3 rounded-xl text-sm border font-medium" style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
          Try Again
        </button>
      )}
    </div>
  );
}

// ── Simple Translation Exercise ────────────────────────────────────────────────

function SimpleTranslationExercise({ unit, onComplete }: { unit: number; onComplete: () => void }) {
  const items = SIMPLE_TRANSLATION[unit] ?? SIMPLE_TRANSLATION[1];
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState("");
  const [result, setResult] = useState<"correct"|"accent_only"|"wrong"|null>(null);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const item = items[idx];

  function check() {
    const r = matchAnswer(input, item.answers);
    setResult(r);
    if (r !== "wrong") setScore(s => s + 1);
  }

  function next() {
    if (idx + 1 >= items.length) { setDone(true); onComplete(); }
    else { setIdx(i => i + 1); setInput(""); setResult(null); setShowHint(false); }
  }

  if (done) return (
    <div className="text-center py-8 space-y-3">
      <p className="text-4xl">{score >= items.length ? "🎉" : "💪"}</p>
      <p className="font-bold" style={{ color: "var(--text)" }}>{score}/{items.length} correct</p>
      <button onClick={() => { setIdx(0); setInput(""); setResult(null); setScore(0); setDone(false); }} className="px-6 py-2.5 rounded-xl text-sm border" style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>Try Again</button>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between text-xs" style={{ color: "var(--text-muted)" }}>
        <span>{idx + 1} / {items.length}</span>
        <span>{score} correct · self-checked</span>
      </div>

      <div className="p-4 rounded-xl border-l-4" style={{ backgroundColor: "var(--surface)", borderLeftColor: "var(--accent-fr)", border: "1px solid var(--border)", borderLeft: "4px solid var(--accent-fr)" }}>
        <p className="text-xs uppercase tracking-wide mb-1" style={{ color: "var(--text-muted)" }}>Translate to French:</p>
        <p className="text-lg font-semibold" style={{ color: "var(--text)" }}>{item.english}</p>
      </div>

      {showHint && (
        <p className="text-sm px-3 py-2 rounded-lg" style={{ backgroundColor: "var(--surface2)", color: "var(--text-muted)" }}>
          💡 {item.hint}
        </p>
      )}

      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === "Enter" && !result && input.trim() && check()}
        disabled={!!result}
        className="w-full px-4 py-3 rounded-xl text-sm border outline-none fr-text focus:ring-2 focus:ring-[var(--accent-fr)]"
        style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)", color: "var(--text)", fontSize: "1rem" }}
        placeholder="Écris ta traduction ici…"
      />

      {result && (
        <div className="p-3 rounded-xl text-sm space-y-1" style={{
          backgroundColor: result === "wrong" ? "#fee2e2" : result === "accent_only" ? "#fef9c3" : "#d1fae5",
          color: result === "wrong" ? "#991b1b" : result === "accent_only" ? "#78350f" : "#065f46",
        }}>
          {result === "correct" && <p>✓ Correct!</p>}
          {result === "accent_only" && <p>✓ Almost — check the accents! Correct answer: <strong className="fr-text">{item.answers[0]}</strong></p>}
          {result === "wrong" && <><p>✗ Correct answer: <strong className="fr-text">{item.answers[0]}</strong></p><p className="text-xs mt-1">{item.grammarNote}</p></>}
        </div>
      )}

      <div className="flex gap-2">
        {!result && !showHint && (
          <button onClick={() => setShowHint(true)} className="flex-1 py-2.5 rounded-xl text-sm border" style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>Show Hint</button>
        )}
        {!result ? (
          <button onClick={check} disabled={!input.trim()} className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold disabled:opacity-60" style={{ backgroundColor: "var(--accent-fr)" }}>Check →</button>
        ) : (
          <button onClick={next} className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold" style={{ backgroundColor: "#10b981" }}>{idx + 1 >= items.length ? "Finish ✓" : "Next →"}</button>
        )}
      </div>
    </div>
  );
}

// ── Error Hunt Exercise ────────────────────────────────────────────────────────

function ErrorHuntExercise({ unit, onComplete }: { unit: number; onComplete: () => void }) {
  const items = ERROR_HUNT[unit] ?? ERROR_HUNT[1];
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState("");
  const [result, setResult] = useState<"correct"|"accent_only"|"wrong"|null>(null);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const item = items[idx];

  function check() {
    if (input.trim().split(/\s+/).length < 2) return; // require full sentence
    const r = matchAnswer(input, item.answers);
    setResult(r);
    if (r !== "wrong") setScore(s => s + 1);
    else addMistake({ unitNumber: unit, category: "error_hunt", question: item.sentence, wrongAnswer: input, rightAnswer: item.answers[0], explanation: item.grammarNote });
  }

  function next() {
    if (idx + 1 >= items.length) { setDone(true); onComplete(); }
    else { setIdx(i => i + 1); setInput(""); setResult(null); setShowHint(false); }
  }

  if (done) return (
    <div className="text-center py-8 space-y-3">
      <p className="text-4xl">{score >= items.length ? "🎉" : "💪"}</p>
      <p className="font-bold" style={{ color: "var(--text)" }}>{score}/{items.length} errors found!</p>
      <button onClick={() => { setIdx(0); setInput(""); setResult(null); setScore(0); setDone(false); }} className="px-6 py-2.5 rounded-xl text-sm border" style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>Try Again</button>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between text-xs" style={{ color: "var(--text-muted)" }}>
        <span>{idx + 1} / {items.length}</span>
        <span className="px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: item.errorType === "grammar" ? "#dbeafe" : item.errorType === "accent" ? "#fef9c3" : "#ede9fe", color: item.errorType === "grammar" ? "#1e40af" : item.errorType === "accent" ? "#78350f" : "#5b21b6" }}>{item.errorType}</span>
      </div>

      <div className="p-4 rounded-xl border-2" style={{ backgroundColor: "var(--surface)", borderColor: "#ef4444" }}>
        <p className="text-xs uppercase tracking-wide mb-2" style={{ color: "#ef4444" }}>Find and fix the error:</p>
        <p className="text-xl fr-text font-medium" style={{ color: "var(--text)" }}>{item.sentence}</p>
      </div>

      {showHint && (
        <p className="text-sm px-3 py-2 rounded-lg" style={{ backgroundColor: "var(--surface2)", color: "var(--text-muted)" }}>💡 {item.hint}</p>
      )}

      <div className="space-y-1">
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>Rewrite the full corrected sentence:</p>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !result && input.trim() && check()}
          disabled={!!result}
          className="w-full px-4 py-3 rounded-xl text-sm border outline-none fr-text focus:ring-2 focus:ring-[var(--accent-fr)]"
          style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)", color: "var(--text)", fontSize: "1rem" }}
          placeholder="Écris la phrase correcte ici…"
        />
      </div>

      {result && (
        <div className="p-3 rounded-xl text-sm space-y-1" style={{
          backgroundColor: result === "wrong" ? "#fee2e2" : result === "accent_only" ? "#fef9c3" : "#d1fae5",
          color: result === "wrong" ? "#991b1b" : result === "accent_only" ? "#78350f" : "#065f46",
        }}>
          {result === "correct" && <p>✓ Correct! You spotted a <strong>{item.errorType}</strong> error.</p>}
          {result === "accent_only" && <p>✓ Grammar right — watch the accents! <strong className="fr-text">{item.answers[0]}</strong></p>}
          {result === "wrong" && <><p>✗ The error: {item.errorDescription}</p><p className="fr-text font-medium mt-1">Correct: {item.answers[0]}</p><p className="text-xs mt-1">{item.grammarNote}</p></>}
        </div>
      )}

      <div className="flex gap-2">
        {!result && !showHint && (
          <button onClick={() => setShowHint(true)} className="flex-1 py-2.5 rounded-xl text-sm border" style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>Need a hint?</button>
        )}
        {!result ? (
          <button onClick={check} disabled={!input.trim() || input.trim().split(/\s+/).length < 2} className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold disabled:opacity-60" style={{ backgroundColor: "var(--accent-fr)" }}>Check →</button>
        ) : (
          <button onClick={next} className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold" style={{ backgroundColor: "#10b981" }}>{idx + 1 >= items.length ? "Finish ✓" : "Next →"}</button>
        )}
      </div>
    </div>
  );
}

// ── Timed Write ────────────────────────────────────────────────────────────────

function TimedWriteExercise({ unit, onComplete }: { unit: number; onComplete: () => void }) {
  const [started, setStarted] = useState(false);
  const [text, setText] = useState("");
  const [timeLeft, setTimeLeft] = useState(180); // 3 min
  const [finished, setFinished] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [timerRef, setTimerRef] = useState<NodeJS.Timeout | null>(null);

  const prompt = TIMED_PROMPTS[unit] ?? TIMED_PROMPTS[1];

  function startTimer() {
    setStarted(true);
    setTimeLeft(180);
    const t = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(t);
          setFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setTimerRef(t);
  }

  function stop() {
    if (timerRef) clearInterval(timerRef);
    setFinished(true);
  }

  async function getFeedback() {
    setLoading(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "grade_writing",
          content: `Timed write prompt: ${prompt}\n\nStudent's writing:\n${text}`,
          context: { unit, targetStructures: ["production", "fluency", "accuracy"] },
        }),
      });
      const data = await res.json();
      setFeedback(data.response);
      onComplete();
    } catch {
      setFeedback("Could not grade — check API key.");
    } finally {
      setLoading(false);
    }
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  if (!started) {
    return (
      <div className="space-y-4">
        <div
          className="p-5 rounded-xl border-2 border-dashed"
          style={{ borderColor: "var(--accent-fr)", backgroundColor: "var(--surface)" }}
        >
          <p className="text-xs uppercase tracking-wider mb-2 font-semibold" style={{ color: "var(--accent-fr)" }}>
            3-Minute Production Sprint
          </p>
          <p className="fr-text text-base font-medium" style={{ color: "var(--text)" }}>{prompt}</p>
          <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>
            Write as much as you can in 3 minutes. Don't stop to look things up — this builds real fluency. Go!
          </p>
        </div>
        <button
          onClick={startTimer}
          className="w-full py-3 rounded-xl text-white text-sm font-semibold"
          style={{ backgroundColor: "var(--accent-red)" }}
        >
          ⏱ Start 3-Minute Timer
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Timer */}
      <div
        className={cn(
          "flex items-center justify-between p-3 rounded-xl text-sm font-bold",
          timeLeft <= 30 ? "bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400" : "bg-[var(--surface2)]"
        )}
        style={{ color: timeLeft <= 30 ? undefined : "var(--text)" }}
      >
        <span>{TIMED_PROMPTS[unit]}</span>
        <span className="text-lg font-mono flex-shrink-0 ml-3">
          {minutes}:{seconds.toString().padStart(2, "0")}
        </span>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
        disabled={finished}
        autoFocus
        className="w-full px-4 py-3 rounded-xl text-sm border outline-none resize-none fr-text focus:ring-2 focus:ring-[var(--accent-fr)]"
        style={{
          backgroundColor: "var(--surface)",
          borderColor: "var(--border)",
          color: "var(--text)",
          fontSize: "1rem",
        }}
        placeholder="Commence à écrire…"
      />

      <div className="flex items-center justify-between text-xs" style={{ color: "var(--text-muted)" }}>
        <span>{text.trim().split(/\s+/).filter(Boolean).length} words</span>
        {!finished && (
          <button onClick={stop} className="text-amber-600 hover:underline">
            Stop early
          </button>
        )}
      </div>

      {finished && !feedback && (
        <div className="space-y-3">
          <div
            className="p-3 rounded-xl text-sm text-center"
            style={{ backgroundColor: "var(--surface2)", color: "var(--text)" }}
          >
            Time's up! You wrote {text.trim().split(/\s+/).filter(Boolean).length} words. Get AI feedback?
          </div>
          <button
            onClick={getFeedback}
            disabled={loading || !text.trim()}
            className="w-full py-3 rounded-xl text-white text-sm font-semibold disabled:opacity-60"
            style={{ backgroundColor: "var(--accent-fr)" }}
          >
            {loading ? "Getting feedback…" : "Get AI Feedback →"}
          </button>
        </div>
      )}

      {feedback && (
        <div className="p-4 rounded-xl whitespace-pre-wrap text-sm" style={{ backgroundColor: "var(--surface2)", border: "1px solid var(--border)", color: "var(--text)" }}>
          {feedback}
        </div>
      )}
    </div>
  );
}

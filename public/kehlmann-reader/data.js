const pdfPath = "/reader/assets/doeblin-freundinnen.pdf";
const coverImg = "/reader/assets/doeblin-freundinnen-cover.svg";
const authorImg = "/reader/assets/alfred-doeblin-card.svg";

const fillerWords = new Set([
  "der",
  "die",
  "das",
  "und",
  "oder",
  "dass",
  "weil",
  "wird",
  "werden",
  "einer",
  "eine",
  "einem",
  "einen",
  "eines",
  "wie",
  "warum",
  "welche",
  "welcher",
  "welches",
  "wodurch",
  "woran",
  "wo",
  "hier",
  "dieser",
  "diese",
  "dieses",
  "deiner",
  "deine",
  "deinem",
  "deinen",
  "passage",
  "szene",
  "text",
  "stelle",
  "genau",
  "besonders",
  "mehr",
  "schon",
  "gerade",
  "doch",
  "noch"
]);

const theoryProfiles = {
  "milieu-symbiose": {
    label: "Milieu und Symbiose",
    aliases: ["milieu", "symbiose", "straße", "strasse", "wohnung", "haus", "umgebung", "berlin", "friedrichsfelde"]
  },
  "briefe-rausch": {
    label: "Briefe und Rausch",
    aliases: ["brief", "briefe", "selbstberauschung", "heimlichkeit", "komplott", "süße", "suesse", "schreibdrang", "fetisch"]
  },
  "koerper-gewalt": {
    label: "Körper, Gewalt, Abscheu",
    aliases: ["körper", "koerper", "ekel", "gewalt", "schlag", "schläge", "schlaege", "berührung", "beruehrung", "wut"]
  },
  "prozess-gutachten": {
    label: "Prozess und Gutachten",
    aliases: ["prozess", "gericht", "gutachten", "geschworene", "anklage", "zuschreibung", "psychiatrie", "urteil"]
  },
  forensik: {
    label: "Forensik",
    aliases: ["forensik", "arsen", "gift", "toxikologie", "obduktion", "chemiker", "haare", "methylalkohol", "spuren"]
  },
  rechtswissenschaft: {
    label: "Rechtswissenschaft",
    aliases: ["recht", "rechtswissenschaft", "mord", "beihilfe", "zurechnungsfähigkeit", "zurechnungsfaehigkeit", "anklage", "urteil", "strafrecht"]
  },
  "geschichte-weimar": {
    label: "Geschichte",
    aliases: ["geschichte", "weimar", "weimarer republik", "medien", "geschlechterordnung", "sexualwissenschaft", "1923", "zeitung", "moderne"]
  },
  "schuld-zusammenhang": {
    label: "Schuld und Zusammenhang",
    aliases: ["schuld", "zusammenhang", "kausalität", "kausalitaet", "romandichtung", "symbiose", "unsicher", "unvermeidlich"]
  }
};

function normalizeText(value = "") {
  return String(value || "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenizeMeaningful(value = "") {
  return normalizeText(value)
    .split(" ")
    .filter((token) => token && token.length > 2 && !fillerWords.has(token));
}

function unique(items) {
  return [...new Set(items.filter(Boolean))];
}

function firstSentence(value = "") {
  const text = String(value || "").trim();
  if (!text) {
    return "";
  }
  const [sentence] = text.split(/(?<=[.!?])\s+/u);
  return sentence || text;
}

function capitalize(value = "") {
  const text = String(value || "").trim();
  return text ? `${text.charAt(0).toUpperCase()}${text.slice(1)}` : "";
}

function operatorProfile(prompt = "") {
  const text = normalizeText(prompt);
  if (/^(warum|wie|erkläre|erklaere|erläutere|erlaeutere)/.test(text)) {
    return { label: "Erklären", sentenceCount: "3-4", action: "Erkläre die Beobachtung, sichere sie am Text und leite ihre Wirkung oder Funktion ab" };
  }
  if (/^(zeige|weise|ordne|vergleiche|verbinde)/.test(text)) {
    return { label: "Zeigen", sentenceCount: "3-4", action: "Zeige die Aussage an einem genauen Detail und führe sie zu einer Deutung weiter" };
  }
  if (/^(prüfe|pruefe|entscheide)/.test(text)) {
    return { label: "Prüfen", sentenceCount: "3-4", action: "Entscheide dich begründet und sichere deine Entscheidung am Text" };
  }
  if (/^(wo|wodurch|woran|welche|welcher|welches|nenne|benenne)/.test(text)) {
    return { label: "Benennen", sentenceCount: "2-3", action: "Benenne zuerst das Textsignal und erkläre dann knapp seine Funktion" };
  }
  return { label: "Ausarbeiten", sentenceCount: "3-4", action: "Arbeite die Frage in präzisen, textnahen Sätzen aus" };
}

function focusTerms(prompt = "", context = "", extras = []) {
  return unique([
    ...tokenizeMeaningful(prompt),
    ...tokenizeMeaningful(context),
    ...extras.flatMap((item) => tokenizeMeaningful(item))
  ]).slice(0, 6);
}

function conceptFromAliases(label, aliases = []) {
  const normalizedAliases = unique(
    aliases.flatMap((alias) => {
      const plain = normalizeText(alias);
      if (!plain) {
        return [];
      }
      return unique([plain, ...plain.split(" ").filter((part) => part.length > 2)]);
    })
  );

  return {
    label,
    aliases: normalizedAliases
  };
}

function theoryConcepts(ids = []) {
  return ids
    .map((id) => theoryProfiles[id])
    .filter(Boolean)
    .map((profile) => conceptFromAliases(profile.label, profile.aliases));
}

function modelAnswerForTask({ prompt, context, signalWords = [], keyIdeas = [], writingFrame = "", relatedTheoryIds = [], taskTitle = "" }) {
  const sentence = firstSentence(context || writingFrame || taskTitle);
  const evidence = signalWords.length
    ? `Das sieht man an Signalen wie ${signalWords.slice(0, 2).map((word) => `"${word}"`).join(" und ")}.`
    : "";
  const theoryHint = relatedTheoryIds
    .map((id) => theoryProfiles[id]?.label)
    .filter(Boolean)
    .slice(0, 2);
  const focus = keyIdeas.length ? keyIdeas.slice(0, 2).join(" und ") : focusTerms(prompt, context, signalWords).slice(0, 2).join(" und ");
  const finalSentence = theoryHint.length
    ? `Dadurch wird besonders ${theoryHint.join(" und ").toLowerCase()} sichtbar.`
    : focus
      ? `Dadurch wird besonders ${focus.toLowerCase()} als Deutungsschwerpunkt greifbar.`
      : "Dadurch wird die Funktion der Passage deutlich und nicht nur ihr Inhalt nacherzählt.";

  return unique([capitalize(sentence), evidence, finalSentence]).join(" ");
}

function instructionForTask(prompt, { signalWords = [], relatedTheoryIds = [], kind = "question" } = {}) {
  const operator = operatorProfile(prompt);
  const evidencePart = signalWords.length
    ? `Arbeite mit mindestens einem genauen Signalwort aus der Passage, zum Beispiel ${signalWords.slice(0, 2).map((word) => `"${word}"`).join(" oder ")}.`
    : "Arbeite mit mindestens einem genauen Textdetail oder Wortlaut aus der Passage.";
  const theoryPart = relatedTheoryIds.length
    ? `Verbinde deine Beobachtung am Schluss mit ${relatedTheoryIds.map((id) => theoryProfiles[id]?.label).filter(Boolean).slice(0, 2).join(" oder ")}.`
    : "Schließe mit einer klaren Deutung oder Funktionsaussage.";
  const opening = kind === "transfer"
    ? "Beziehe Passage und Deutungslinse ausdrücklich aufeinander."
    : kind === "resource"
      ? "Nutze die Ressource als Leselinse und bleibe eng am Romanausschnitt."
      : operator.action;

  return `Antworte in ${operator.sentenceCount} Sätzen. ${opening}. ${evidencePart} ${theoryPart}`;
}

function checklistForTask(prompt, { signalWords = [], relatedTheoryIds = [] } = {}) {
  const operator = operatorProfile(prompt);
  return unique([
    `${operator.label}: ${capitalize(prompt.replace(/\?$/, ""))}.`,
    signalWords.length
      ? `Nenne mindestens ein Textsignal aus der Passage: ${signalWords.slice(0, 3).join(", ")}.`
      : "Nenne mindestens ein Textsignal oder eine genaue Beobachtung aus der Passage.",
    relatedTheoryIds.length
      ? `Verbinde deine Aussage mit ${relatedTheoryIds.map((id) => theoryProfiles[id]?.label).filter(Boolean).slice(0, 2).join(" oder ")}.`
      : "Formuliere am Schluss die Wirkung, Funktion oder Ambivalenz der Stelle."
  ]);
}

export function buildTask(prompt, options = {}) {
  const {
    context = "",
    signalWords = [],
    relatedTheoryIds = [],
    keyIdeas = [],
    writingFrame = "",
    kind = "question",
    taskTitle = ""
  } = options;
  const question = String(prompt || "").trim();
  const conceptTerms = focusTerms(question, context, [...signalWords, ...keyIdeas]);
  const concepts = unique([
    signalWords.length ? conceptFromAliases("Textsignal", signalWords) : null,
    ...theoryConcepts(relatedTheoryIds),
    conceptTerms.length ? conceptFromAliases("Fragekern", conceptTerms) : null
  ]);

  return {
    prompt: question,
    operatorLabel: operatorProfile(question).label,
    instruction: instructionForTask(question, { signalWords, relatedTheoryIds, kind }),
    checklist: checklistForTask(question, { signalWords, relatedTheoryIds }),
    modelAnswer: modelAnswerForTask({
      prompt: question,
      context,
      signalWords,
      keyIdeas,
      writingFrame,
      relatedTheoryIds,
      taskTitle
    }),
    concepts,
    synonymHints: unique(concepts.flatMap((concept) => concept.aliases)).slice(0, 10)
  };
}

export const theoryResources = [
  {
    id: "milieu-symbiose",
    title: "Dossier: Berliner Milieuzeichnung und Symbiose",
    shortTitle: "Milieu",
    sourceTitle: "Lokales Dossier zu Raum, Milieu und Döblins Fallblick",
    mediaType: "html",
    openUrl: "/reader/assets/doeblin-milieu-und-symbiose.html",
    embedUrl: "/reader/assets/doeblin-milieu-und-symbiose.html",
    summary:
      "Döblin liest Menschen nie isoliert. Wohnungen, Straßen, Familienmilieus und Nachbarschaften wirken mit, wenn sich Beziehungen verformen und Entscheidungen verdichten.",
    keyIdeas: ["Berlin", "Milieu", "Wohnung", "Straße", "Symbiose"],
    questions: [
      "Welche Räume oder Milieus prägen deine Passage besonders stark mit?",
      "Wo zeigt sich, dass Figuren hier nicht als isolierte Einzelwesen, sondern in Verstrickungen erscheinen?",
      "Wie hilft das Milieu, eine Figur nicht psychologisch zu vereinfachen?"
    ],
    transferPrompts: [
      "Ordne deine Passage in Döblins Milieublick ein und benenne mindestens ein raumgebundenes Detail.",
      "Zeige, wie Wohnung, Straße oder soziale Lage an der Szene mitarbeiten.",
      "Prüfe, ob der Text die Figuren eher aus ihrem Inneren oder aus ihren Verflechtungen heraus verständlich macht."
    ],
    writingFrame:
      "Die Passage wirkt nicht nur über Figurenpsychologie, sondern auch darüber, dass Milieu und Umgebung ..."
  },
  {
    id: "briefe-rausch",
    title: "Dossier: Briefe, Heimlichkeit und Selbstberauschung",
    shortTitle: "Briefe",
    sourceTitle: "Lokales Dossier zu Briefen und Beziehungsdynamik",
    mediaType: "html",
    openUrl: "/reader/assets/doeblin-briefe-und-selbstberauschung.html",
    embedUrl: "/reader/assets/doeblin-briefe-und-selbstberauschung.html",
    summary:
      "Die Briefe sind im Text nicht bloß Belege, sondern eine eigene Dynamik. Sie verstärken Liebe, Hass, Heimlichkeit und Komplott, bis Sprache selbst berauschend wird.",
    keyIdeas: ["Briefe", "Heimlichkeit", "Komplott", "Rausch", "Schreibdrang"],
    questions: [
      "Welche Funktion haben die Briefe in deiner Passage genau: Nähe, Steigerung, Tarnung oder Selbstverführung?",
      "Wie kippt Sprache im Briefwechsel von Trost in Komplott?",
      "Warum sind die Briefe zugleich Beweismaterial und Motor der Handlung?"
    ],
    transferPrompts: [
      "Zeige an einem Detail, wie Schreiben hier mehr tut als bloß Mitteilung.",
      "Erkläre, wie die Briefe Selbstberauschung und Eskalation zugleich antreiben.",
      "Prüfe, ob der Briefstil eher verklärt, anstachelt oder entlastet."
    ],
    writingFrame:
      "Die Briefe sind hier wichtig, weil sie nicht nur etwas festhalten, sondern ..."
  },
  {
    id: "koerper-gewalt",
    title: "Dossier: Körper, Gewalt, Abscheu",
    shortTitle: "Körper",
    sourceTitle: "Lokales Dossier zu Gewalt- und Körperdarstellung",
    mediaType: "html",
    openUrl: "/reader/assets/doeblin-koerper-gewalt-und-ekel.html",
    embedUrl: "/reader/assets/doeblin-koerper-gewalt-und-ekel.html",
    summary:
      "Der Text arbeitet auffallend stark mit Berührung, Abwehr, Ekel, Schlagen und körperlicher Nähe. Gerade dadurch werden Macht, Unterwerfung und seelische Zerrüttung sichtbar.",
    keyIdeas: ["Ekel", "Berührung", "Schläge", "Unterwerfung", "Körperbild"],
    questions: [
      "Wie wird körperliche Nähe in deiner Passage als Gewalt, Zumutung oder Machtfrage gestaltet?",
      "Wo zeigt der Text Ekel oder Abwehr nicht nur psychologisch, sondern körperlich?",
      "Welche Funktion hat der Körper im Verhältnis von Herrschaft und Ohnmacht?"
    ],
    transferPrompts: [
      "Arbeite heraus, wie ein Körperdetail die gesamte Szene auflädt.",
      "Zeige, ob die Passage eher mit Gewalt, Erstarrung oder Widerstand arbeitet.",
      "Prüfe, wie aus Berührung hier Konflikt statt Nähe entsteht."
    ],
    writingFrame:
      "Der Körper ist in dieser Passage nicht nur Schauplatz, sondern Träger von ..."
  },
  {
    id: "prozess-gutachten",
    title: "Dossier: Prozess, Gutachten, Öffentlichkeit",
    shortTitle: "Prozess",
    sourceTitle: "Lokales Dossier zu Gerichts- und Wissensdiskursen",
    mediaType: "html",
    openUrl: "/reader/assets/doeblin-prozess-und-gutachten.html",
    embedUrl: "/reader/assets/doeblin-prozess-und-gutachten.html",
    summary:
      "Im Prozess prallen Strafrecht, Zeitungslogik, psychiatrische Zuschreibung und moralische Empörung aufeinander. Döblin zeigt, wie viele konkurrierende Erklärungsmodelle den Fall besetzen.",
    keyIdeas: ["Gericht", "Gutachten", "Anklage", "Zuschreibung", "Öffentlichkeit"],
    questions: [
      "Welche Stimme dominiert deine Passage: Gericht, Presse, Gutachten oder Erzählinstanz?",
      "Wie produziert der Prozess Deutungen statt nur Fakten?",
      "Wo zeigt sich, dass Wissen über den Fall immer schon interessengeleitet ist?"
    ],
    transferPrompts: [
      "Benenne das Deutungsmodell, das in deiner Passage am stärksten wirkt.",
      "Zeige, wie die Passage zwischen Erklärung und Stigmatisierung schwankt.",
      "Prüfe, ob das Gutachten den Fall erhellt oder neu verengt."
    ],
    writingFrame:
      "Die Passage macht deutlich, dass der Prozess nicht nur urteilt, sondern den Fall auch durch ... formt."
  },
  {
    id: "forensik",
    title: "Dossier: Forensik, Arsen und toxikologische Spuren",
    shortTitle: "Forensik",
    sourceTitle: "Lokales Dossier zu Gift, Obduktion und Beweisführung",
    mediaType: "html",
    openUrl: "/reader/assets/doeblin-forensik-und-arsen.html",
    embedUrl: "/reader/assets/doeblin-forensik-und-arsen.html",
    summary:
      "Die Erzählung lässt sich auch als forensischer Fall lesen: Giftbeschaffung, Symptome, Obduktion, chemische Analyse und Haarspuren machen sichtbar, wie naturwissenschaftliche Verfahren den Fall rekonstruieren.",
    keyIdeas: ["Arsen", "Obduktion", "Symptome", "Chemiker", "Spuren"],
    questions: [
      "Welche Symptome, Stoffe oder Beweisformen prägen deine Passage forensisch besonders stark?",
      "Wie wird aus Verdacht in deiner Passage ein naturwissenschaftlich gestützter Befund?",
      "Wo zeigt sich, dass forensisches Wissen den Fall klärt, aber nicht vollständig erklärt?"
    ],
    transferPrompts: [
      "Lies die Passage als forensische Rekonstruktion und benenne mindestens zwei konkrete Spuren.",
      "Erkläre, wie Gift, Körperreaktion und Beweisführung in der Szene zusammenarbeiten.",
      "Prüfe, was die naturwissenschaftliche Perspektive sichtbar macht und was sie offenlässt."
    ],
    writingFrame:
      "Forensisch wird die Passage besonders lesbar, weil sie aus Symptomen, Stoffen und Spuren ..."
  },
  {
    id: "rechtswissenschaft",
    title: "Dossier: Rechtswissenschaft, Strafrecht und Zurechnung",
    shortTitle: "Recht",
    sourceTitle: "Lokales Dossier zu Anklage, Beihilfe und Urteil",
    mediaType: "html",
    openUrl: "/reader/assets/doeblin-rechtswissenschaft-und-strafrecht.html",
    embedUrl: "/reader/assets/doeblin-rechtswissenschaft-und-strafrecht.html",
    summary:
      "Der Fall eignet sich für rechtswissenschaftliche Fragen: Was ist Mord, was Beihilfe, wie wird Zurechnungsfähigkeit verhandelt und wie verschränken sich Strafrecht, Gutachten und moralische Bewertung?",
    keyIdeas: ["Mord", "Beihilfe", "Zurechnung", "Anklage", "Urteil"],
    questions: [
      "Welche juristische Kategorie oder Entscheidungslinie steht in deiner Passage im Vordergrund?",
      "Wie verändert sich der Fall, wenn du ihn als strafrechtliches Problem statt nur als Beziehungsgeschichte liest?",
      "Wo kollidieren in der Passage rechtliche, moralische und psychiatrische Deutungen?"
    ],
    transferPrompts: [
      "Benenne die zentrale Rechtsfrage der Passage und sichere sie am Wortlaut.",
      "Erkläre, wie Anklage, Beihilfe oder Zurechnung den Blick auf den Fall strukturieren.",
      "Prüfe, ob die juristische Ordnung den Fall präzisiert oder erneut verengt."
    ],
    writingFrame:
      "Rechtswissenschaftlich ist die Passage wichtig, weil sie den Fall über ... neu ordnet."
  },
  {
    id: "geschichte-weimar",
    title: "Dossier: Geschichte der Weimarer Republik und Medienprozess",
    shortTitle: "Geschichte",
    sourceTitle: "Lokales Dossier zu Weimar, Geschlechterordnung und Öffentlichkeit",
    mediaType: "html",
    openUrl: "/reader/assets/doeblin-geschichte-weimar-und-medien.html",
    embedUrl: "/reader/assets/doeblin-geschichte-weimar-und-medien.html",
    summary:
      "Historisch zeigt der Text mehr als einen Einzelfall: Großstadtmoderne, Geschlechterordnung, Sexualwissenschaft, Sensationspresse und die Rechtskultur der Weimarer Republik prägen mit, wie der Mordfall lesbar wird.",
    keyIdeas: ["Weimar", "Geschlechterordnung", "Presse", "Sexualwissenschaft", "Moderne"],
    questions: [
      "Welche historischen Spannungen der Weimarer Republik werden in deiner Passage sichtbar?",
      "Wie prägen Presse, Geschlechterbilder oder zeitgenössische Wissenschaft den Fall?",
      "Wodurch wird aus dem Einzelfall zugleich ein historischer Text über die Moderne?"
    ],
    transferPrompts: [
      "Lies die Passage ausdrücklich historisch und benenne ein Merkmal der Weimarer Gegenwart.",
      "Erkläre, wie Geschlechterordnung, Sensationspresse oder Sexualdiskurs die Szene mitprägen.",
      "Prüfe, was sich an deiner Deutung verändert, wenn du den Fall als historisches Dokument der Moderne liest."
    ],
    writingFrame:
      "Historisch gewinnt die Passage Schärfe, weil sie nicht nur einen Mordfall, sondern auch ..."
  },
  {
    id: "schuld-zusammenhang",
    title: "Dossier: Schuld, Zusammenhang und Erkenntniskritik",
    shortTitle: "Zusammenhang",
    sourceTitle: "Lokales Dossier zum Epilog und zu Döblins Fallpoetik",
    mediaType: "html",
    openUrl: "/reader/assets/doeblin-schuld-und-zusammenhang.html",
    embedUrl: "/reader/assets/doeblin-schuld-und-zusammenhang.html",
    summary:
      "Am Ende verschiebt Döblin den Blick weg vom einfachen Schema schuld/unschuldig. Entscheidend werden Zusammenhänge, Verstrickungen, sprachliche Unschärfe und die Kritik an glatten Erklärungen.",
    keyIdeas: ["Schuld", "Zusammenhang", "Unsicherheit", "Romandichtungen", "Fallpoetik"],
    questions: [
      "Wie unterläuft deine Passage einfache Schuldzuschreibungen?",
      "Welche Rolle spielen sprachliche Unsicherheit und erklärungskritische Sätze?",
      "Wie macht Döblin aus dem Kriminalfall eine Reflexion über Erkenntnis?"
    ],
    transferPrompts: [
      "Zeige, wie die Passage zwischen Fakt, Deutung und Unsicherheit pendelt.",
      "Erkläre, warum Döblin glatte Kausalitäten misstraut.",
      "Prüfe, wie der Text Zusammenhang wichtiger macht als eindeutige Verurteilung."
    ],
    writingFrame:
      "Gerade diese Passage zeigt, dass Döblin nicht nur nach Täterschaft fragt, sondern nach ..."
  }
];

export const readerModules = [
  {
    id: "auftakt",
    title: "Elli, Link und die frühe Ehefalle",
    lens: "Rollenentwurf, Enttäuschung, Gewaltbeginn",
    briefing:
      "Lies den Beginn nicht als bloße Vorgeschichte. Schon hier legt der Text die asymmetrische Beziehung, die soziale Erwartung an Ehe und die spätere Gewaltspirale an.",
    task:
      "Arbeite heraus, wie Döblin Ellis Leichtigkeit, Links Ernst und die frühe Enttäuschung in eine verhängnisvolle Dynamik bringt.",
    relatedTheoryIds: ["milieu-symbiose", "koerper-gewalt", "schuld-zusammenhang"],
    entries: [
      {
        id: "auftakt-1",
        title: "Elli zwischen Spiel, Charme und Anziehung",
        pageHint: "PDF S. 3-4",
        pageNumber: 3,
        passageLabel: "Der Kanarienvogel und der ernste Werber",
        context:
          "Döblin zeichnet Elli zunächst als lebenslustig, verspielt und schwer festzulegen. Gerade dieser Einstieg macht verständlich, warum Links beharrlicher Ernst für sie zugleich attraktiv und bedrohlich wirkt.",
        signalWords: ["Wuschelkopf", "Kanarienvogel", "ernst und beharrlich", "Familie gründen", "Munterkeit"],
        prompts: [
          "Wie charakterisiert Döblin Elli im Auftakt, ohne sie einfach zu verurteilen?",
          "Warum wirkt Links Werben im Vergleich zu Ellis bisherigen Männererfahrungen so stark?",
          "Welche Asymmetrie zwischen Spiel und Ernst entsteht schon in dieser frühen Passage?"
        ],
        writingFrame:
          "Der Auftakt ist wichtig, weil Elli hier zugleich als ... und als ... lesbar wird.",
        relatedTheoryIds: ["milieu-symbiose", "schuld-zusammenhang"]
      },
      {
        id: "auftakt-2",
        title: "Versorgung, Aufstieg, unterirdische Enttäuschung",
        pageHint: "PDF S. 4-5",
        pageNumber: 5,
        passageLabel: "Vom Heiratsversprechen zur Ernüchterung",
        context:
          "Die Vorstellung von Versorgung, eigener Wirtschaft und sozialer Passung kippt früh in Enttäuschung. Döblin zeigt, wie Ellis Aufstiegshoffnung mit Scham und Verachtung verschränkt ist.",
        signalWords: ["versorgen", "eigene Wirtschaft", "jämmerlich", "umspringen", "unterirdische Enttäuschung"],
        prompts: [
          "Wie arbeitet der Text mit der Idee sozialer Passung und Versorgung?",
          "Warum wird Link für Elli vom `ernsten Mann` zur Enttäuschung?",
          "Wodurch klingt die Passage schon nach einem künftigen Machtkampf?"
        ],
        writingFrame:
          "Die frühe Enttäuschung ist zentral, weil sie Ehe hier nicht als Ziel, sondern als ... zeigt.",
        relatedTheoryIds: ["milieu-symbiose", "schuld-zusammenhang"]
      },
      {
        id: "auftakt-3",
        title: "Eheliche Berührung, Ekel und starre Rollen",
        pageHint: "PDF S. 6-7",
        pageNumber: 6,
        passageLabel: "Nähe als Zumutung",
        context:
          "Mit der Ehe wird körperliche Nähe nicht erfüllend, sondern bedrängend. Döblin beschreibt Ellas Abwehr und Links Kränkung auffallend körpernah und macht daraus eine Machtfrage.",
        signalWords: ["behagte ihr nicht", "erduldete", "tot", "ich mag nicht", "Ekel"],
        prompts: [
          "Wie gestaltet Döblin die eheliche Nähe als Zwang statt als Intimität?",
          "Welche Rolle spielt Ellis Ekel für die spätere Eskalation?",
          "Wie zeigt die Passage, dass Körper und Macht hier eng zusammenhängen?"
        ],
        writingFrame:
          "Die Passage macht sichtbar, dass körperliche Nähe hier sofort in ... kippt.",
        relatedTheoryIds: ["koerper-gewalt", "schuld-zusammenhang"]
      },
      {
        id: "auftakt-4",
        title: "Wildheit, Bestrafung, gefährlicher Friede",
        pageHint: "PDF S. 8-9",
        pageNumber: 8,
        passageLabel: "Ein Friede auf gefährlichem Weg",
        context:
          "Als Link die Beziehung über Wildheit, Demütigung und Wut neu organisiert, verschiebt sich die Dynamik. Der Text zeigt eine Nähe, die aus Kampf und Unterwerfung hervorgeht.",
        signalWords: ["wild", "bestrafen", "Wut", "unterwarf", "gefährlicher Weg"],
        prompts: [
          "Wie verändert sich die Beziehung durch die neue Wildheit?",
          "Warum nennt der Text diese Annäherung einen `gefährlichen Weg`?",
          "Wodurch verbindet Döblin hier Gewalt, Begehren und Macht so eng?"
        ],
        writingFrame:
          "Gerade der scheinbare Friede bleibt bedrohlich, weil er auf ... beruht.",
        relatedTheoryIds: ["koerper-gewalt", "schuld-zusammenhang"]
      }
    ]
  },
  {
    id: "freundinnen",
    title: "Grete Bende, Briefe und Gegenwelt",
    lens: "Heimlichkeit, Gegenbindung, Rachephantasie",
    briefing:
      "Mit Grete Bende entsteht keine harmlose Freundschaft. Der Text zeigt, wie Trost, Begehren, Briefwechsel und Männerhass eine eigene Gegenwelt aufbauen.",
    task:
      "Zeige, wie sich zwischen Elli und Grete eine Bindung formt, die zugleich Schutzraum, Rausch und Eskalationsmotor wird.",
    relatedTheoryIds: ["briefe-rausch", "koerper-gewalt", "schuld-zusammenhang"],
    entries: [
      {
        id: "freundinnen-1",
        title: "Briefe als Heimlichkeit und Komplott",
        pageHint: "PDF S. 17-18",
        pageNumber: 17,
        passageLabel: "Schreiben, obwohl man sich täglich sieht",
        context:
          "Dass die beiden Frauen sich trotz unmittelbarer Nähe Briefe schreiben, macht das Schreiben selbst bedeutsam. Es dient nicht bloß der Mitteilung, sondern steigert Verfolgung, Nähe und Komplott.",
        signalWords: ["Briefschreiben", "Komplott gegen die Männer", "Selbstberauschung", "Heimlichkeit", "Süße"],
        prompts: [
          "Warum beginnt zwischen den beiden Frauen gerade dann ein intensiver Briefwechsel?",
          "Wie wird aus Hilfe und Trost schrittweise eine berauschende Heimlichkeit?",
          "Welche neue Form von Nähe entsteht durch das Schreiben?"
        ],
        writingFrame:
          "Das Briefschreiben ist hier mehr als Kommunikation, weil es ... hervorbringt.",
        relatedTheoryIds: ["briefe-rausch", "schuld-zusammenhang"]
      },
      {
        id: "freundinnen-2",
        title: "Trennung, Attest, Verfügung",
        pageHint: "PDF S. 24-26",
        pageNumber: 25,
        passageLabel: "Befreiung über Rechtsschritte",
        context:
          "Elli sucht rechtliche Distanz von Link, doch der Text erzählt diese Schritte nie als einfache Lösung. Gerade zwischen Attest, Anwalt und Briefen wird sichtbar, wie sehr Befreiung und neue Abhängigkeit ineinandergreifen.",
        signalWords: ["Attest", "einstweilige Verfügung", "Prozeßvorschuß", "festbleiben", "zusammenbleiben"],
        prompts: [
          "Wie erscheint die juristische Trennung hier zugleich als Befreiung und neue Verstrickung?",
          "Welche Rolle spielt Grete Bende in dieser Phase der Abkehr von Link?",
          "Warum führt der rechtliche Weg im Text noch nicht in eine stabile Ordnung?"
        ],
        writingFrame:
          "Die Passage zeigt, dass formale Befreiung noch keine innere Entlastung ist, weil ...",
        relatedTheoryIds: ["briefe-rausch", "schuld-zusammenhang"]
      },
      {
        id: "freundinnen-3",
        title: "Liebe beweisen, Hass rechtfertigen",
        pageHint: "PDF S. 33-35",
        pageNumber: 33,
        passageLabel: "Rache unter dem Namen Liebe",
        context:
          "Elli und Grete heizen ihre Gefühle wechselseitig an. Die Formeln vom Liebesbeweis verschleiern und legitimieren zugleich den wachsenden Vernichtungswunsch gegen Link.",
        signalWords: ["Liebe beweisen", "Rache", "Trauerspiel", "Zone", "verboten"],
        prompts: [
          "Wie verbindet der Text Liebesleidenschaft und Hasssteigerung?",
          "Warum ist die Formel `ich will dir meine Liebe beweisen` so gefährlich?",
          "Wie verschleiert die Freundinnenbeziehung hier bereits den Schritt zur Tat?"
        ],
        writingFrame:
          "Die Liebesrhetorik wirkt hier nicht entlastend, sondern als ...",
        relatedTheoryIds: ["briefe-rausch", "koerper-gewalt"]
      },
      {
        id: "freundinnen-4",
        title: "Vom Krankenbett zum Mordstern",
        pageHint: "PDF S. 35-38",
        pageNumber: 38,
        passageLabel: "Faszination statt Klarheit",
        context:
          "Der Wunsch, Link aufs Krankenbett zu bringen, schlägt in einen festen Mordentschluss um. Döblin zeigt diese Bewegung nicht als linearen Plan, sondern als Mischung aus Faszination, Schlafzustand und innerer Verfinsterung.",
        signalWords: ["aufs Krankenbett", "Faszination", "Entrückung", "Stern", "Mord"],
        prompts: [
          "Wie beschreibt der Text den Übergang vom Wunsch zur Tötungsphantasie?",
          "Warum ist von Faszination und Entrückung die Rede und nicht nur von Planung?",
          "Was verrät die Passage über Döblins Blick auf Entscheidung und Verantwortung?"
        ],
        writingFrame:
          "Der Mordentschluss wirkt hier gerade deshalb so beklemmend, weil er aus ... entsteht.",
        relatedTheoryIds: ["schuld-zusammenhang", "briefe-rausch"]
      }
    ]
  },
  {
    id: "giftmord",
    title: "Arsen, Alltag und tödliche Routine",
    lens: "Tatvollzug, Schwanken, Pflege und Vergiftung",
    briefing:
      "Die Tat wird nicht als einmaliger Ausbruch erzählt, sondern als Serie von Dosen, Zweifeln, Briefen und häuslichen Handgriffen. Genau darin liegt ihre Kälte.",
    task:
      "Arbeite heraus, wie Döblin den Giftmord zwischen Alltagsroutine, Rauschformeln und innerem Schwanken entfaltet.",
    relatedTheoryIds: ["koerper-gewalt", "briefe-rausch", "schuld-zusammenhang"],
    entries: [
      {
        id: "giftmord-1",
        title: "Arsen kaufen, Quetschkartoffeln vergiften",
        pageHint: "PDF S. 38-39",
        pageNumber: 39,
        passageLabel: "Der Entschluss bekommt Stoff",
        context:
          "Mit dem Gang zum Drogisten wird aus der dunklen Vorstellung eine materielle Tatspur. Der Text verbindet den Erwerb des Arsens mit banalen Küchendetails und steigert so den Schrecken.",
        signalWords: ["Rattenkuchen", "Arsen", "Quetschkartoffeln", "erste Giftdose", "sicher der Mord"],
        prompts: [
          "Wie macht der Text aus dem Giftkauf einen Wendepunkt?",
          "Warum wirkt die Verbindung von Alltagsessen und Mordmittel so stark?",
          "Wie zeigt die Passage, dass Elli den Entschluss zwar gefasst hat, aber seine Tragweite noch nicht wirklich überblickt?"
        ],
        writingFrame:
          "Die Szene wirkt so hart, weil der Mord hier in die Form von ... eintritt.",
        relatedTheoryIds: ["koerper-gewalt", "schuld-zusammenhang"]
      },
      {
        id: "giftmord-2",
        title: "Pflegen und zugleich vergiften",
        pageHint: "PDF S. 40-41",
        pageNumber: 41,
        passageLabel: "Krankenmehl, Tropfen, kaltes Herz",
        context:
          "Die Vergiftung läuft parallel zu Pflegegesten. Gerade dieser doppelte Modus aus Fürsorge und Zynismus macht den Text so verstörend.",
        signalWords: ["Krankenmehl", "Tropfen", "Herzklopfen", "Umschläge", "das Schwein"],
        prompts: [
          "Wie arbeitet die Passage mit dem Kontrast von Pflege und Tötung?",
          "Welche Wirkung hat die zynische Wortwahl inmitten der Krankenversorgung?",
          "Warum wird der Giftmord gerade durch seine Alltäglichkeit besonders unheimlich?"
        ],
        writingFrame:
          "Die Passage ist so eindringlich, weil dieselbe Handlung hier zugleich ... und ... bedeutet.",
        relatedTheoryIds: ["koerper-gewalt", "briefe-rausch"]
      },
      {
        id: "giftmord-3",
        title: "Schwanken, Klosett, neues Gift",
        pageHint: "PDF S. 41-43",
        pageNumber: 42,
        passageLabel: "Zwischen Schuldpanik und Todeswunsch",
        context:
          "Elli schwankt, wirft Gift weg, fordert neues an und gerät zwischen Schuldgefühl, Hass und Zwang. Döblin zeigt hier besonders deutlich, wie wenig glatt der Weg zur Tat bleibt.",
        signalWords: ["warf es in das Klosett", "verschaff mir bitte", "ich will ihn los sein", "hasse ihn", "Ärzte"],
        prompts: [
          "Wie zeigt die Passage, dass der Tatvollzug kein geradliniger Prozess ist?",
          "Welche Rolle spielt Gretes Mitwirkung in diesem erneuten Anlauf?",
          "Wie verschiebt sich hier das Verhältnis von Entschluss, Zwang und Angst?"
        ],
        writingFrame:
          "Gerade das Schwanken macht die Passage aufschlussreich, weil es ... sichtbar macht.",
        relatedTheoryIds: ["schuld-zusammenhang", "briefe-rausch"]
      },
      {
        id: "giftmord-4",
        title: "Erlösung, Witwenphantasie, Entdeckung",
        pageHint: "PDF S. 44-47",
        pageNumber: 47,
        passageLabel: "Vom Jubel zur Beschlagnahmung",
        context:
          "Nach Links Tod kippt der Text kurz in Erlösungsrausch und Zukunftsphantasie, bevor Arsenbefund, Polizeiermittlung und Brief-Fund die Katastrophe umdrehen.",
        signalWords: ["lustige Witwe", "erlöst", "Methylalkohol", "Arsen", "Briefe"],
        prompts: [
          "Wie wirkt der abrupte Tonwechsel zwischen Erleichterung und Entdeckung?",
          "Warum ist die Formel von der `lustigen Witwe` für die Figurenzeichnung so wichtig?",
          "Wie zeigt die Passage, dass private Heimlichkeit nun öffentliches Material wird?"
        ],
        writingFrame:
          "Die Passage kippt radikal, weil aus privater Erlösung schlagartig ... wird.",
        relatedTheoryIds: ["prozess-gutachten", "briefe-rausch"]
      }
    ]
  },
  {
    id: "haft",
    title: "Haft, Träume und innere Umstellung",
    lens: "Traumarbeit, Schuldabwehr, Familienrückbindung",
    briefing:
      "In der Haft verlagert sich der Text von Handlung auf innere Nacharbeit. Träume, Rechtfertigungen und neue Familienimpulse verändern besonders Elli stark.",
    task:
      "Zeige, wie Döblin in der Haftpassage Schuld, Abwehr und innere Verschiebung nicht glättet, sondern widersprüchlich offenlegt.",
    relatedTheoryIds: ["schuld-zusammenhang", "koerper-gewalt", "milieu-symbiose"],
    entries: [
      {
        id: "haft-1",
        title: "Löwen, Kinderbild, Gewalttraum",
        pageHint: "PDF S. 49-50",
        pageNumber: 49,
        passageLabel: "Die Tat kehrt als Bildlogik zurück",
        context:
          "In den Haftträumen verarbeitet Elli den Mord nicht direkt, sondern in Bildern von Löwen, Kindern, Tischecken und Stürzen. Gerade diese Umcodierung ist aufschlussreich.",
        signalWords: ["Löwen", "Blutlache", "kleines Mädel", "Tischecke", "tot umfiel"],
        prompts: [
          "Wie arbeiten die Träume mit Verschiebung und Bildlogik statt mit direktem Geständnis?",
          "Welche Funktion haben Tier- und Kindbilder in den Träumen?",
          "Wie versucht Elli, sich im Traum zugleich anzuklagen und zu rechtfertigen?"
        ],
        writingFrame:
          "Die Träume sind wichtig, weil sie die Tat nicht wiederholen, sondern als ... umformen.",
        relatedTheoryIds: ["schuld-zusammenhang", "koerper-gewalt"]
      },
      {
        id: "haft-2",
        title: "Muttchen, Zelle, Elterninstinkte",
        pageHint: "PDF S. 53-54",
        pageNumber: 53,
        passageLabel: "Rückzug in die Familie",
        context:
          "Der Text liest die Haft als heftige Rückbewegung in Familiengefühle. Gerade im Ruf nach der Mutter und in der Traumwiederholung zeigt sich ein konflikthaftes neues Zentrum.",
        signalWords: ["Muttchen", "Zelle", "Straftat", "Elterninstinkte", "Abgrund"],
        prompts: [
          "Wie beschreibt Döblin die Haft als Rückbindung an Familie und Kindheitsmuster?",
          "Warum ist der Mutterruf für die Deutung von Elli so aufschlussreich?",
          "Wodurch bleibt diese Rückbewegung zugleich heilsam und verstörend?"
        ],
        writingFrame:
          "Die Haft verändert Elli, weil sie sie nicht nur bestraft, sondern in ... zurückzieht.",
        relatedTheoryIds: ["milieu-symbiose", "schuld-zusammenhang"]
      },
      {
        id: "haft-3",
        title: "Leichte Psychose und neue Anbindung",
        pageHint: "PDF S. 55-56",
        pageNumber: 56,
        passageLabel: "Vertiefung statt bloßer Reue",
        context:
          "Döblin beschreibt an Elli keine simple Läuterung. Vielmehr gerät ihr Inneres in eine gefährdete, aber verändernde Vertiefung, während sich ihre Bindungen neu ordnen.",
        signalWords: ["leichte Psychose", "vertieft", "Veränderung", "Anschluß an die Familie", "Schwierigkeiten"],
        prompts: [
          "Warum ist von Vertiefung und Veränderung die Rede und nicht einfach von Reue?",
          "Wie gestaltet der Text Ellis innere Umstellung als krisenhaften Prozess?",
          "Welche Rolle spielt die Familie in dieser seelischen Verschiebung?"
        ],
        writingFrame:
          "Die Passage macht deutlich, dass innere Veränderung hier als ... beschrieben wird.",
        relatedTheoryIds: ["schuld-zusammenhang", "milieu-symbiose"]
      },
      {
        id: "haft-4",
        title: "Elli und Grete in der Haft gegeneinander gelesen",
        pageHint: "PDF S. 56-57",
        pageNumber: 57,
        passageLabel: "Zwei verschiedene Seelenlagen",
        context:
          "Der Text kontrastiert Ellis komplizierte innere Nacharbeit mit Gretes stabilerer, an die Mutter gebundener Gefühlslage. So verhindert Döblin jede schlichte Gleichsetzung der beiden Täterinnen.",
        signalWords: ["einfacher", "elastischer", "Mutter", "liebte sie", "ihr Kind"],
        prompts: [
          "Wie setzt Döblin Elli und Grete in der Haft bewusst voneinander ab?",
          "Warum ist Gretes Bindung an die Mutter für diesen Kontrast so wichtig?",
          "Wie verhindert die Passage eine einfache Täterinnen-Schablone?"
        ],
        writingFrame:
          "Der Vergleich ist wichtig, weil der Text die beiden Frauen gerade nicht als ... behandelt.",
        relatedTheoryIds: ["milieu-symbiose", "schuld-zusammenhang"]
      }
    ]
  },
  {
    id: "prozess",
    title: "Gericht, Gutachten und öffentliche Deutung",
    lens: "Fallkonstruktion, Zuschreibung, Urteilspolitik",
    briefing:
      "Vor Gericht wird der Mordfall in immer neue Sprach- und Wissensordnungen übersetzt. Gerade diese Konkurrenz von Erklärungen ist für den Text zentral.",
    task:
      "Arbeite heraus, wie Gerichtsrede, Gutachten und Presseberichte den Fall nicht nur darstellen, sondern aktiv konstruieren.",
    relatedTheoryIds: ["prozess-gutachten", "briefe-rausch", "schuld-zusammenhang"],
    entries: [
      {
        id: "prozess-1",
        title: "Giftmischerinnen auf der Anklagebank",
        pageHint: "PDF S. 57-58",
        pageNumber: 57,
        passageLabel: "Der Fall als Sensation",
        context:
          "Schon die Zeitungsüberschriften machen den Prozess zum Spektakel. Die Passage zeigt, wie Öffentlichkeit die Angeklagten typisiert und dramatisiert, noch bevor erklärt wird.",
        signalWords: ["Giftmischerinnen aus Liebe", "Anklagebank", "Hauptverhandlung", "vorsätzlich", "mit Überlegung"],
        prompts: [
          "Wie macht die Passage aus dem Prozess ein öffentliches Schauspiel?",
          "Welche Wirkung haben die Formeln und Anklagewörter auf die Wahrnehmung der Frauen?",
          "Warum beginnt der Gerichtsblock mit Schlagzeilen und nicht mit einer nüchternen Rekonstruktion?"
        ],
        writingFrame:
          "Die Passage zeigt Öffentlichkeit als Macht, weil sie den Fall sofort in ... übersetzt.",
        relatedTheoryIds: ["prozess-gutachten", "schuld-zusammenhang"]
      },
      {
        id: "prozess-2",
        title: "600 Briefe und pathologischer Rausch",
        pageHint: "PDF S. 61-63",
        pageNumber: 61,
        passageLabel: "Gutachten lesen Leidenschaft",
        context:
          "Die Briefe werden im Prozess zum Material psychiatrischer und moralischer Deutung. Gerade die Gutachterstimme macht sichtbar, wie schnell Beziehungsdynamik in pathologische Sprache überführt wird.",
        signalWords: ["600 Briefe", "Rauschzustand", "pathologischer Natur", "kindliche Konstitution", "Fetisch"],
        prompts: [
          "Wie deutet das Gutachten die Briefe um?",
          "Welche Rolle spielt die Sprache von Pathologie und Kindlichkeit in dieser Passage?",
          "Wodurch zeigt der Text, dass Deutung hier nie neutral bleibt?"
        ],
        writingFrame:
          "Das Gutachten ist hier nicht nur Beschreibung, sondern eine Form von ...",
        relatedTheoryIds: ["prozess-gutachten", "briefe-rausch"]
      },
      {
        id: "prozess-3",
        title: "Jenseits von schuldig und unschuldig",
        pageHint: "PDF S. 65-68",
        pageNumber: 65,
        passageLabel: "Zusammenhänge statt einfacher Schuld",
        context:
          "Die Geschworenen stehen vor einer Frage, die sich gerade nicht auf nackte Täterschaft reduzieren lässt. Döblin verschiebt den Fokus auf Entstehung, Zusammenhang und Unsicherheit.",
        signalWords: ["schuldig-unschuldig", "Zusammenhänge", "unvermeidlich", "Apparat", "warteten"],
        prompts: [
          "Wie begründet der Text die Verschiebung von Schuld zur Frage des Zusammenhangs?",
          "Warum ist diese Passage für Döblins Fallpoetik so zentral?",
          "Welche Wirkung hat die Beschreibung der Geschworenen und des gesamten Apparats?"
        ],
        writingFrame:
          "Die Passage ist zentral, weil sie den Fall nicht mehr als bloße Tat, sondern als ... liest.",
        relatedTheoryIds: ["schuld-zusammenhang", "prozess-gutachten"]
      },
      {
        id: "prozess-4",
        title: "Mildes Urteil, Sexualdiskurs, Gegenpresse",
        pageHint: "PDF S. 69-70",
        pageNumber: 69,
        passageLabel: "Öffentliche Nachkämpfe",
        context:
          "Auch nach dem Urteil ist der Fall nicht zu Ende. Presse und Sexualwissenschaft streiten weiter darum, welche Erklärung gelten soll und wie weit Milde oder Stigmatisierung reichen dürfen.",
        signalWords: ["gefährliches Urteil", "sexuelle Verirrungen", "mildes Urteil", "zweite Ehe", "Gnadengesuch"],
        prompts: [
          "Wie setzt die Passage den Kampf um die Deutung des Falls nach dem Urteil fort?",
          "Welche Rolle spielt die Rede von Sexualität und Abweichung in dieser öffentlichen Bewertung?",
          "Warum ist die Nachgeschichte des Urteils für den Text ebenso wichtig wie die Tat selbst?"
        ],
        writingFrame:
          "Der Fall bleibt öffentlich umkämpft, weil das Urteil sofort wieder in ... übersetzt wird.",
        relatedTheoryIds: ["prozess-gutachten", "schuld-zusammenhang"]
      }
    ]
  },
  {
    id: "poetik",
    title: "Epilog, Symbiose und moderne Fallpoetik",
    lens: "Erkenntniskritik, Symbiose, literarische Form",
    briefing:
      "Im Epilog und im Nachwort tritt besonders deutlich hervor, dass Döblin keinen glatten Kriminalfall erzählen will. Der Text reflektiert seine eigenen Grenzen und Möglichkeiten mit.",
    task:
      "Zeige, wie Döblin aus dem Giftmordfall eine Reflexion über Sprache, Zusammenhang und literarische Fallkonstruktion macht.",
    relatedTheoryIds: ["schuld-zusammenhang", "milieu-symbiose", "prozess-gutachten"],
    entries: [
      {
        id: "poetik-1",
        title: "Fürchterlich unklare Worte",
        pageHint: "PDF S. 72-73",
        pageNumber: 72,
        passageLabel: "Misstrauen gegen glatte Begriffe",
        context:
          "Im Epilog attackiert Döblin die bequemen Sammelwörter für innere Vorgänge. Begriffe wie Liebe, Rache oder Neigung erscheinen als Vereinfachungen, die Erkenntnis eher blockieren als leisten.",
        signalWords: ["fürchterlich unklare Worte", "Neigung", "Abneigung", "Romandichtungen", "Kausalitätsprinzip"],
        prompts: [
          "Warum misstraut Döblin Begriffen wie Liebe, Neigung oder Rache so stark?",
          "Wie macht die Passage Erkenntniskritik zum Teil des Textes?",
          "Welche Wirkung hat dieser Angriff auf glatte psychologische Erklärungsmuster?"
        ],
        writingFrame:
          "Döblin kritisiert hier nicht nur Begriffe, sondern die ganze Gewohnheit, Fälle durch ... zu beruhigen.",
        relatedTheoryIds: ["schuld-zusammenhang"]
      },
      {
        id: "poetik-2",
        title: "Straßen gehen, Wohnungen mitdenken",
        pageHint: "PDF S. 73-74",
        pageNumber: 73,
        passageLabel: "Symbiose statt Einzelpsychologie",
        context:
          "Döblin erklärt ausdrücklich, dass Menschen nur in Verbindung mit anderen Menschen, Häusern, Straßen und Milieus verständlich werden. Dieser Symbiose-Gedanke ist eine poetische und methodische Setzung.",
        signalWords: ["Straßen zu gehen", "Symbiose", "Wohnungen", "Häusern", "Blatt oder Fingerglied"],
        prompts: [
          "Wie begründet der Text den Gedanken der Symbiose?",
          "Warum lehnt Döblin eine isolierte Beschreibung einzelner Figuren ab?",
          "Wie verändert diese Passage deinen Blick auf den ganzen Fall?"
        ],
        writingFrame:
          "Der Symbiose-Gedanke ist zentral, weil er den Fall von der Einzelperson auf ... erweitert.",
        relatedTheoryIds: ["milieu-symbiose", "schuld-zusammenhang"]
      },
      {
        id: "poetik-3",
        title: "Der reale Fall Klein/Nebbe im Nachwort",
        pageHint: "PDF S. 108-110",
        pageNumber: 108,
        passageLabel: "Literarische Verarbeitung eines Rechtsfalls",
        context:
          "Das Nachwort macht deutlich, dass Döblins Text auf dem historischen Fall Klein/Nebbe beruht und gerade deshalb zwischen Dokument, Literatur und Diskursgeschichte vermittelt.",
        signalWords: ["Klein/Nebbe", "literarische Verarbeitung", "Prozess", "Zeitungsberichte", "Fallkonstruktion"],
        prompts: [
          "Wie rahmt das Nachwort Döblins Text als literarische Bearbeitung eines realen Falls?",
          "Welche Funktion hat dieses Wissen für die Lektüre des Haupttextes?",
          "Warum ist der Fall weder bloß Dokument noch bloße Erfindung?"
        ],
        writingFrame:
          "Das Nachwort schärft die Lektüre, weil es den Text als ... sichtbar macht.",
        relatedTheoryIds: ["prozess-gutachten", "schuld-zusammenhang"]
      },
      {
        id: "poetik-4",
        title: "Patriarchatskritik ohne Monokausalität",
        pageHint: "PDF S. 121-123",
        pageNumber: 122,
        passageLabel: "Fallpoetik gegen einfache Antworten",
        context:
          "Das Nachwort betont, dass Döblin gesellschaftliche und patriarchale Machtverhältnisse sichtbar macht, zugleich aber jede monokausale Lesart zurückweist. Genau daraus gewinnt der Text seine Modernität.",
        signalWords: ["Patriarchatskritik", "monokausale Lesart", "Wutsphäre", "verbotener Ort", "schrecklich unsicher"],
        prompts: [
          "Wie verbindet das Nachwort Gesellschaftskritik mit Warnungen vor einfachen Erklärungen?",
          "Warum bleibt gerade die Offenheit der Zusammenhänge für Döblins Text so wichtig?",
          "Wodurch wirkt die Erzählung moderner als ein bloßer Kriminalbericht?"
        ],
        writingFrame:
          "Gerade diese Offenheit ist produktiv, weil der Text Schuld und Macht nicht in ... auflöst.",
        relatedTheoryIds: ["schuld-zusammenhang", "milieu-symbiose"]
      }
    ]
  }
];

export const lessonSets = [
  {
    id: "lesson-01-elli-und-link",
    title: "Lektion 1 · Elli, Link und die frühe Schieflage",
    summary:
      "Der Auftakt legt Spiel, Ernst, Ehehoffnung und erste Asymmetrien schonungslos nebeneinander.",
    chapterMedia: [
      {
        src: coverImg,
        alt: "Grafische Karte zu Döblins Giftmord-Erzählung",
        title: "Ein Fall beginnt als Beziehungsform",
        caption:
          "Der Beginn wirkt leicht und sozial plausibel, trägt aber die spätere Verformung schon in sich.",
        focusPrompt:
          "Arbeite heraus, wie Döblin aus einer scheinbar passenden Verbindung früh eine schiefe Ordnung macht."
      }
    ],
    entryIds: ["auftakt-1", "auftakt-2"],
    moduleIds: ["auftakt"],
    reviewFocus: "Achte auf Figurenanlage, soziale Erwartungen und die frühe Enttäuschungslogik.",
    sebPrompt:
      "Analysiere den Auftakt. Zeige, wie Döblin Elli und Link so einführt, dass Versorgungshoffnung und spätere Konfliktdynamik bereits ineinandergreifen."
  },
  {
    id: "lesson-02-ekel-und-gefahr",
    title: "Lektion 2 · Ekel, Gewalt und gefährlicher Friede",
    summary:
      "Die Ehe kippt in körperliche Abwehr, Demütigung und eine bedrohliche Form von Nähe.",
    chapterMedia: [
      {
        src: authorImg,
        alt: "Typografische Karte zu Alfred Döblin",
        title: "Nähe wird hier zum Konfliktfeld",
        caption:
          "Diese Lektion ist zentral, weil Döblin Körper und Macht nicht trennt.",
        focusPrompt:
          "Wie macht der Text aus Berührung eine Szene von Zwang, Kränkung und gefährlicher Bindung?"
      }
    ],
    entryIds: ["auftakt-3", "auftakt-4"],
    moduleIds: ["auftakt"],
    reviewFocus: "Arbeite an Ekel, Körperdarstellung, Macht und Gewaltbeginn.",
    sebPrompt:
      "Zeige, wie Döblin körperliche Nähe in den frühen Ehepassagen als Zwangs- und Machtverhältnis gestaltet.",
    recommendedTheoryIds: ["koerper-gewalt"],
    resourceAssignments: [
      {
        resourceId: "koerper-gewalt",
        title: "Körperauftrag: Wie schreibt Döblin Gewalt in Berührung ein?",
        summary:
          "Das Dossier hilft, Ekel, Körpernähe und Unterwerfung genauer zu fassen.",
        task:
          "Nutze das Körper-Dossier und zeige an einer der beiden Passagen, wie Berührung, Abwehr und Macht sprachlich zusammenspielen.",
        questions: [
          "Welches Körperdetail trägt deine Deutung?",
          "Wo kippt Nähe in Gewalt?",
          "Wie macht die Wortwahl den Konflikt sichtbar?"
        ]
      }
    ]
  },
  {
    id: "lesson-03-briefe-und-gegenwelt",
    title: "Lektion 3 · Grete Bende und die Brief-Gegenwelt",
    summary:
      "Mit Grete entsteht eine Bindung, die Trost, Heimlichkeit und Eskalation zugleich produziert.",
    chapterMedia: [
      {
        src: coverImg,
        alt: "Grafische Karte zu Döblins Giftmord-Erzählung",
        title: "Heimlichkeit schreibt mit",
        caption:
          "Die Briefdynamik ist hier nicht Beiwerk, sondern eine eigene Handlungskraft.",
        focusPrompt:
          "Warum braucht diese Beziehung Schreiben, obwohl die beiden Frauen sich dauernd sehen?"
      }
    ],
    entryIds: ["freundinnen-1", "freundinnen-2"],
    moduleIds: ["freundinnen"],
    reviewFocus: "Achte auf Briefe, Heimlichkeit, juristische Trennung und neue Abhängigkeiten.",
    sebPrompt:
      "Untersuche, wie Döblin den Briefwechsel und die Trennungsschritte so erzählt, dass Trost, Komplott und neue Verstrickung gleichzeitig sichtbar werden.",
    recommendedTheoryIds: ["briefe-rausch"],
    resourceAssignments: [
      {
        resourceId: "briefe-rausch",
        title: "Briefauftrag: Schreiben als Handlungsmacht lesen",
        summary:
          "Das Dossier fokussiert die Briefe als Motor von Nähe und Eskalation.",
        task:
          "Nutze das Brief-Dossier und arbeite heraus, wie Schreiben in einer der beiden Passagen mehr leistet als Information.",
        questions: [
          "Welche Stimmung erzeugen die Briefe?",
          "Wo wird aus Trost Komplott?",
          "Wie verändert der Briefmodus die Beziehung?"
        ]
      }
    ]
  },
  {
    id: "lesson-04-liebe-und-rache",
    title: "Lektion 4 · Liebe beweisen, Rache vorbereiten",
    summary:
      "Die Freundinnenbeziehung verdichtet sich, bis Liebesbeweis und Vernichtungsfantasie kaum noch zu trennen sind.",
    chapterMedia: [
      {
        src: authorImg,
        alt: "Typografische Karte zu Alfred Döblin",
        title: "Entschluss ohne glatte Linie",
        caption:
          "Die Passage ist gerade deshalb so stark, weil der Mordentschluss nicht als klare Kalkulation erscheint.",
        focusPrompt:
          "Wie beschreibt Döblin den Übergang vom Hass zur Tatvorbereitung als Faszination statt als sauberen Plan?"
      }
    ],
    entryIds: ["freundinnen-3", "freundinnen-4"],
    moduleIds: ["freundinnen"],
    reviewFocus: "Arbeite an Liebesrhetorik, Rachephantasie, Faszination und Verantwortung.",
    sebPrompt:
      "Analysiere, wie die Formel vom Liebesbeweis in den Freundinnenpassagen den Weg zur Tat vorbereitet und zugleich verschleiert.",
    recommendedTheoryIds: ["schuld-zusammenhang"],
    resourceAssignments: [
      {
        resourceId: "schuld-zusammenhang",
        title: "Zusammenhangsauftrag: Entschluss ohne Vereinfachung lesen",
        summary:
          "Das Dossier hilft, glatte Kausalmodelle zu vermeiden.",
        task:
          "Nutze das Dossier zu Schuld und Zusammenhang und zeige, warum der Text die Tatvorbereitung weder entschuldigt noch simpel psychologisiert.",
        questions: [
          "Welche Kräfte greifen ineinander?",
          "Wo bleibt die Passage bewusst unscharf?",
          "Warum wäre eine einfache Tätererklärung hier zu kurz?"
        ]
      }
    ]
  },
  {
    id: "lesson-05-arsen-und-alltag",
    title: "Lektion 5 · Arsen, Küche, erste Dosen",
    summary:
      "Mit dem Giftkauf wird die Tat konkret und zieht in den banalen Alltag ein.",
    chapterMedia: [
      {
        src: coverImg,
        alt: "Grafische Karte zu Döblins Giftmord-Erzählung",
        title: "Das Verbrechen beginnt banal",
        caption:
          "Die Schärfe dieser Lektion liegt im Kontrast zwischen Küchenroutine und Tötungsabsicht.",
        focusPrompt:
          "Wie macht Döblin gerade aus Alltagsdetails den Schrecken des Giftmords?"
      }
    ],
    entryIds: ["giftmord-1", "giftmord-2"],
    moduleIds: ["giftmord"],
    reviewFocus: "Achte auf Giftkauf, Pflegegesten, Zynismus und Alltagsroutine.",
    sebPrompt:
      "Zeige, wie Döblin den Giftmord nicht als spektakulären Ausbruch, sondern als tödliche Alltagsroutine erzählt und forensisch lesbare Spuren vorbereitet.",
    recommendedTheoryIds: ["forensik"],
    resourceAssignments: [
      {
        resourceId: "forensik",
        title: "Forensikauftrag: Wie wird aus Gift ein Befund?",
        summary:
          "Das Dossier verschiebt den Blick auf Symptome, Giftstoff und Rekonstruktion des Tatablaufs.",
        task:
          "Nutze das Forensik-Dossier und arbeite heraus, wie Döblin in einer der beiden Passagen den Giftmord über Stoffe, Körperreaktionen und Alltagsdetails materiell lesbar macht.",
        questions: [
          "Welche Spur oder welches Symptom ist besonders wichtig?",
          "Wie hängt der Stoff Arsen mit dem Küchenalltag zusammen?",
          "Was zeigt die forensische Linse, was eine rein psychologische Deutung übersehen würde?"
        ]
      }
    ]
  },
  {
    id: "lesson-06-schwanken-und-entdeckung",
    title: "Lektion 6 · Schwanken, Erlösung, Entdeckung",
    summary:
      "Die Tat bleibt innerlich instabil, bis Todesfall und Ermittlungen den privaten Raum sprengen.",
    chapterMedia: [
      {
        src: authorImg,
        alt: "Typografische Karte zu Alfred Döblin",
        title: "Privates kippt ins Öffentliche",
        caption:
          "Diese Lektion zeigt, wie Rausch, Erleichterung und Beweismaterial ineinanderstürzen.",
        focusPrompt:
          "Warum wirkt der Umschlag von Erlösungsgefühl zu öffentlicher Ermittlung so radikal?"
      }
    ],
    entryIds: ["giftmord-3", "giftmord-4"],
    moduleIds: ["giftmord"],
    reviewFocus: "Arbeite an Schwanken, Briefdynamik, Witwenphantasie und Ermittlungsbeginn.",
    sebPrompt:
      "Untersuche, wie Döblin aus innerem Schwanken, Todesfall und Brief-Fund einen Umschlag vom privaten Rausch zur öffentlichen Katastrophe formt.",
    recommendedTheoryIds: ["briefe-rausch", "prozess-gutachten", "forensik"],
    resourceAssignments: [
      {
        resourceId: "forensik",
        title: "Forensikauftrag: Vom Symptom zur Spur",
        summary:
          "Das Dossier hilft, den Übergang von körperlichem Zustand zu beweisbarer Tatspur präzise zu lesen.",
        task:
          "Nutze das Forensik-Dossier und zeige, wie die Passage Erleichterung, Todesursache, Arsenbefund und Ermittlungsbeginn miteinander verknüpft.",
        questions: [
          "Welche forensische Erkenntnis kippt die Situation?",
          "Wie verändert der Arsenbefund die Deutung des Todes?",
          "Was bleibt trotz naturwissenschaftlicher Klärung offen?"
        ]
      },
      {
        resourceId: "prozess-gutachten",
        title: "Prozessauftrag: Wie wird aus Heimlichkeit ein Fall?",
        summary:
          "Das Dossier schärft den Übergang vom privaten Geschehen zum öffentlichen Verfahren.",
        task:
          "Nutze das Prozess-Dossier und arbeite heraus, wie Beweise, Deutungen und Öffentlichkeit in der zweiten Passage vorbereitet werden.",
        questions: [
          "Welches Detail macht den Fall öffentlich?",
          "Wie verändert sich dadurch die Perspektive?",
          "Welche neue Sprache tritt an die Stelle der Heimlichkeit?"
        ]
      }
    ]
  },
  {
    id: "lesson-07-hafttraeume",
    title: "Lektion 7 · Haftträume und Schuldabwehr",
    summary:
      "In der Haft kehrt die Tat als Bildlogik wieder und zerlegt einfache Schuldformeln.",
    chapterMedia: [
      {
        src: coverImg,
        alt: "Grafische Karte zu Döblins Giftmord-Erzählung",
        title: "Die Tat arbeitet im Traum weiter",
        caption:
          "Die Traumprotokolle sind keine Nebensache, sondern Schlüssel zur inneren Nacharbeit.",
        focusPrompt:
          "Wie verwandeln die Träume Mord, Schuld und Gewalt in verschobene Bilder?"
      }
    ],
    entryIds: ["haft-1", "haft-2"],
    moduleIds: ["haft"],
    reviewFocus: "Achte auf Traumlogik, Mutterbezug, Rechtfertigung und Schuldabwehr.",
    sebPrompt:
      "Analysiere die Haftträume. Zeige, wie Döblin die Tat in Bildverschiebungen, Familienimpulsen und inneren Abwehrbewegungen nacharbeiten lässt.",
    recommendedTheoryIds: ["schuld-zusammenhang"],
    resourceAssignments: [
      {
        resourceId: "schuld-zusammenhang",
        title: "Traumauftrag: Zusammenhang statt Geständnis",
        summary:
          "Das Dossier hilft, die Träume nicht bloß symbolisch, sondern funktional zu lesen.",
        task:
          "Nutze das Dossier zu Schuld und Zusammenhang und erkläre, wie die Träume zugleich anklagen, rechtfertigen und verschieben.",
        questions: [
          "Welches Bild steht im Zentrum?",
          "Was wird darin verschoben?",
          "Wie verändert das die Frage nach Schuld?"
        ]
      }
    ]
  },
  {
    id: "lesson-08-innere-umstellung",
    title: "Lektion 8 · Familie, Vertiefung, zwei Täterinnen",
    summary:
      "Die Haft verändert Elli und Grete auf unterschiedliche Weise und verhindert einfache Gleichsetzungen.",
    chapterMedia: [
      {
        src: authorImg,
        alt: "Typografische Karte zu Alfred Döblin",
        title: "Keine Schablone für beide",
        caption:
          "Die Differenz zwischen Elli und Grete wird hier zum entscheidenden Deutungsgewinn.",
        focusPrompt:
          "Wie arbeitet der Text in der Haft bewusst mit Unterschieden statt mit einer gemeinsamen Täterinnenfigur?"
      }
    ],
    entryIds: ["haft-3", "haft-4"],
    moduleIds: ["haft"],
    reviewFocus: "Arbeite an Vertiefung, Familienrückbindung und am Kontrast zwischen Elli und Grete.",
    sebPrompt:
      "Zeige, wie Döblin in den Haftpassagen die beiden Frauen seelisch unterschiedlich modelliert und dadurch jede einfache Typisierung unterläuft."
  },
  {
    id: "lesson-09-der-fall-vor-gericht",
    title: "Lektion 9 · Der Fall vor Gericht",
    summary:
      "Anklage, Öffentlichkeit und Gutachten übersetzen das Geschehen in konkurrierende Wissensformen.",
    chapterMedia: [
      {
        src: coverImg,
        alt: "Grafische Karte zu Döblins Giftmord-Erzählung",
        title: "Gericht produziert Lesarten",
        caption:
          "Diese Lektion rückt ins Zentrum, dass der Prozess den Fall nicht nur verhandelt, sondern formatiert.",
        focusPrompt:
          "Welche Deutungslogiken dominieren den Fall, sobald er vor Gericht und in der Presse erscheint?"
      }
    ],
    entryIds: ["prozess-1", "prozess-2"],
    moduleIds: ["prozess"],
    reviewFocus: "Achte auf Anklagesprache, Sensationslogik, Gutachten und Briefdeutung.",
    sebPrompt:
      "Untersuche, wie Döblin Gerichtsrede, Presse und Gutachten so montiert, dass der Fall als Kampf konkurrierender Deutungen erscheint.",
    recommendedTheoryIds: ["prozess-gutachten", "rechtswissenschaft"],
    resourceAssignments: [
      {
        resourceId: "prozess-gutachten",
        title: "Gerichtsauftrag: Wer erklärt hier eigentlich was?",
        summary:
          "Das Dossier fokussiert die konkurrierenden Stimmen im Prozessblock.",
        task:
          "Nutze das Prozess-Dossier und arbeite heraus, welche Instanz in einer der beiden Passagen die stärkste Deutungshoheit beansprucht.",
        questions: [
          "Welche Stimme spricht am lautesten?",
          "Wie legitimiert sie sich?",
          "Was bleibt dabei unsicher oder ausgeblendet?"
        ]
      },
      {
        resourceId: "rechtswissenschaft",
        title: "Rechtsauftrag: Welche Rechtsfrage steht auf dem Spiel?",
        summary:
          "Das Dossier fokussiert Mord, Beihilfe, Zurechnung und die juristische Struktur des Falls.",
        task:
          "Nutze das Rechts-Dossier und arbeite heraus, welche juristische Problemstellung die Prozesspassagen besonders stark ordnet.",
        questions: [
          "Geht es vor allem um Mord, Beihilfe oder Zurechnung?",
          "Wie wird Verantwortung juristisch verteilt?",
          "Wo kollidiert die Straflogik mit anderen Deutungen des Falls?"
        ]
      }
    ]
  },
  {
    id: "lesson-10-urteil-und-diskurs",
    title: "Lektion 10 · Urteil, Öffentlichkeit, Sexualdiskurs",
    summary:
      "Der Text verschiebt den Blick von nackter Tat auf Zusammenhänge, während die Öffentlichkeit nach einfachen Zuschreibungen verlangt.",
    chapterMedia: [
      {
        src: authorImg,
        alt: "Typografische Karte zu Alfred Döblin",
        title: "Schuldig oder schon zu schlicht?",
        caption:
          "Die Schärfe dieser Lektion liegt in der Spannung zwischen Zusammenhangsdenken und Stigmatisierung.",
        focusPrompt:
          "Warum reicht das Schema `schuldig oder unschuldig` für Döblins Fall gerade nicht aus?"
      }
    ],
    entryIds: ["prozess-3", "prozess-4"],
    moduleIds: ["prozess"],
    reviewFocus: "Arbeite an Zusammenhangsdenken, öffentlicher Moral, Sexualdiskurs und Urteilskritik.",
    sebPrompt:
      "Analysiere, wie Döblin im Prozess- und Nachurteilsblock einfache moralische Zuschreibungen unterläuft und stattdessen auf unsichere Zusammenhänge, Rechtsfragen und historische Diskurse verweist.",
    recommendedTheoryIds: ["rechtswissenschaft", "geschichte-weimar", "schuld-zusammenhang"],
    resourceAssignments: [
      {
        resourceId: "rechtswissenschaft",
        title: "Rechtsauftrag: Was leistet das Urteil juristisch, was nicht?",
        summary:
          "Das Dossier schärft, wie stark der Fall über strafrechtliche Kategorien lesbar gemacht wird.",
        task:
          "Nutze das Rechts-Dossier und prüfe, ob Urteil und Gutachten den Fall juristisch ordnen oder zugleich neue Blindstellen erzeugen.",
        questions: [
          "Welche juristische Kategorie dominiert?",
          "Was wird dadurch geklärt?",
          "Welche soziale oder moralische Komplexität geht dabei verloren?"
        ]
      },
      {
        resourceId: "geschichte-weimar",
        title: "Geschichtsauftrag: Wie spricht hier die Weimarer Öffentlichkeit?",
        summary:
          "Das Dossier öffnet den Blick auf Sensationspresse, Geschlechterbilder und Sexualdiskurse der 1920er Jahre.",
        task:
          "Nutze das Geschichts-Dossier und arbeite heraus, wie Presse, Sexualdiskurs und Weimarer Öffentlichkeit die Urteilspassage historisch rahmen.",
        questions: [
          "Welches historische Deutungsmuster tritt hervor?",
          "Wie wirken Geschlechter- und Moralvorstellungen mit?",
          "Was macht die Passage dadurch zum Text der Weimarer Moderne?"
        ]
      }
    ]
  },
  {
    id: "lesson-11-epilog-und-symbiose",
    title: "Lektion 11 · Epilog, Begriffsverdacht, Symbiose",
    summary:
      "Im Epilog greift Döblin bequeme Begriffe an und entwirft stattdessen einen Blick auf Verstrickung und Milieu.",
    chapterMedia: [
      {
        src: coverImg,
        alt: "Grafische Karte zu Döblins Giftmord-Erzählung",
        title: "Der Fall wird zur Poetologie",
        caption:
          "Hier zeigt sich am deutlichsten, dass der Text mehr will als Täterpsychologie.",
        focusPrompt:
          "Wie wird aus dem Kriminalfall im Epilog eine Reflexion über Sprache und Zusammenhang?"
      }
    ],
    entryIds: ["poetik-1", "poetik-2"],
    moduleIds: ["poetik"],
    reviewFocus: "Achte auf Erkenntniskritik, Symbiose, Milieu und Misstrauen gegen glatte Wörter.",
    sebPrompt:
      "Zeige, wie Döblin im Epilog bequeme Begriffe und einfache Kausalmodelle angreift und den Fall stattdessen über Symbiose und Zusammenhang neu liest.",
    recommendedTheoryIds: ["milieu-symbiose", "schuld-zusammenhang"],
    resourceAssignments: [
      {
        resourceId: "milieu-symbiose",
        title: "Milieuauftrag: Warum reichen Einzelporträts nicht aus?",
        summary:
          "Das Dossier hilft, Döblins Symbiose-Gedanken für den ganzen Text fruchtbar zu machen.",
        task:
          "Nutze das Milieu-Dossier und arbeite heraus, wie der Epilog Figuren, Räume und Beziehungen bewusst zusammendenkt.",
        questions: [
          "Welche Räume oder Umgebungen klingen mit?",
          "Wie begründet Döblin Symbiose?",
          "Was verändert das an deiner Lesart?"
        ]
      }
    ]
  },
  {
    id: "lesson-12-fallpoetik-und-nachwort",
    title: "Lektion 12 · Fallpoetik, Nachwort, moderne Lektüre",
    summary:
      "Das Nachwort macht sichtbar, wie stark Döblin zwischen Dokument, Diskurs und Literatur vermittelt.",
    chapterMedia: [
      {
        src: authorImg,
        alt: "Typografische Karte zu Alfred Döblin",
        title: "Kein bloßer Kriminalbericht",
        caption:
          "Die letzte Lektion bündelt Realfall, Fallpoetik und moderne Offenheit des Textes.",
        focusPrompt:
          "Warum bleibt Döblins Text gerade dadurch modern, dass er keine monokausale Lösung liefert?"
      }
    ],
    entryIds: ["poetik-3", "poetik-4"],
    moduleIds: ["poetik"],
    reviewFocus: "Arbeite an Realfallbezug, Fallkonstruktion, Patriarchatskritik und offener Erkenntnisform.",
    sebPrompt:
      "Analysiere, wie Nachwort und Fallpoetik den Text zugleich historisch verankern und gegen einfache Erklärungen offenhalten.",
    recommendedTheoryIds: ["prozess-gutachten", "rechtswissenschaft", "geschichte-weimar", "forensik", "schuld-zusammenhang", "milieu-symbiose"],
    resourceAssignments: [
      {
        resourceId: "geschichte-weimar",
        title: "Geschichtsauftrag: Warum ist der Fall auch ein Text über die Weimarer Republik?",
        summary:
          "Das Dossier bündelt Großstadtmoderne, Geschlechterordnung, Presse und Wissenschaftsgeschichte als historischen Horizont.",
        task:
          "Nutze das Geschichts-Dossier und zeige, wie Nachwort und Fallpoetik den Text in die Weimarer Moderne einbetten.",
        questions: [
          "Welcher historische Kontext ist hier zentral?",
          "Wie wirken Presse, Sexualwissenschaft oder Geschlechterordnung mit?",
          "Warum ist die historische Linse für die Gesamtsicht unverzichtbar?"
        ]
      },
      {
        resourceId: "rechtswissenschaft",
        title: "Rechtsauftrag: Wie weit trägt die juristische Deutung des Falls?",
        summary:
          "Das Dossier erlaubt einen abschließenden Abgleich von literarischer und juristischer Falllogik.",
        task:
          "Nutze das Rechts-Dossier und prüfe, was eine juristische Lesart des Falls erfasst und was erst die literarische Form sichtbar macht.",
        questions: [
          "Welche juristische Ordnung bleibt tragfähig?",
          "Wo reicht Strafrecht allein nicht mehr aus?",
          "Wie reagiert Döblins Form auf diese Grenze?"
        ]
      },
      {
        resourceId: "forensik",
        title: "Forensikauftrag: Was klären Spuren, was klären sie nicht?",
        summary:
          "Das Dossier hilft, naturwissenschaftliche Beweisführung und literarische Offenheit gegeneinander zu halten.",
        task:
          "Nutze das Forensik-Dossier und halte fest, welche Teile des Falls naturwissenschaftlich rekonstruierbar sind und wo Döblins Text trotzdem offen bleibt.",
        questions: [
          "Welche Spuren sind eindeutig?",
          "Welche Deutungsfragen bleiben trotz Obduktion und Analyse offen?",
          "Wie ergänzt die literarische Form die forensische Rekonstruktion?"
        ]
      },
      {
        resourceId: "schuld-zusammenhang",
        title: "Abschlussauftrag: Den Fall ohne Vereinfachung lesen",
        summary:
          "Zum Schluss sollen Tat, Milieu, Gewalt, Prozess und Nachwort in einer reflektierten Deutung zusammengeführt werden.",
        task:
          "Nutze das Dossier zu Schuld und Zusammenhang, um deine Gesamtsicht auf den Text zu schärfen. Zeige, welche Erklärung tragfähig ist und wo der Text bewusst widerständig bleibt.",
        questions: [
          "Welche Erklärung überzeugt dich am ehesten?",
          "Wo bleibt der Text absichtlich unsicher?",
          "Welche Vereinfachung würdest du nach dieser Lektüre ausdrücklich zurückweisen?"
        ]
      }
    ]
  }
];

function decorateTheoryResources() {
  for (const resource of theoryResources) {
    resource.questionTasks = resource.questions.map((question) =>
      buildTask(question, {
        context: resource.summary,
        keyIdeas: resource.keyIdeas,
        relatedTheoryIds: [resource.id],
        writingFrame: resource.writingFrame,
        kind: "theory",
        taskTitle: resource.title
      })
    );
    resource.transferTasks = resource.transferPrompts.map((prompt) =>
      buildTask(prompt, {
        context: resource.summary,
        keyIdeas: resource.keyIdeas,
        relatedTheoryIds: [resource.id],
        writingFrame: resource.writingFrame,
        kind: "transfer",
        taskTitle: resource.title
      })
    );
  }
}

function decorateReaderModules() {
  for (const module of readerModules) {
    for (const entry of module.entries) {
      entry.focusTasks = entry.prompts.map((prompt) =>
        buildTask(prompt, {
          context: `${entry.context} ${module.briefing}`,
          signalWords: entry.signalWords,
          relatedTheoryIds: entry.relatedTheoryIds,
          writingFrame: entry.writingFrame,
          kind: "focus",
          taskTitle: entry.title
        })
      );
    }
  }
}

function decorateLessonSets() {
  for (const lesson of lessonSets) {
    for (const assignment of lesson.resourceAssignments || []) {
      const resource = theoryResources.find((entry) => entry.id === assignment.resourceId);
      assignment.questionTasks = assignment.questions.map((question) =>
        buildTask(question, {
          context: `${assignment.summary} ${assignment.task} ${resource?.summary || ""}`,
          signalWords: [],
          keyIdeas: resource?.keyIdeas || [],
          relatedTheoryIds: [assignment.resourceId],
          writingFrame: resource?.writingFrame || "",
          kind: "resource",
          taskTitle: assignment.title
        })
      );
      assignment.taskCard = buildTask(assignment.task, {
        context: `${assignment.summary} ${resource?.summary || ""}`,
        keyIdeas: resource?.keyIdeas || [],
        relatedTheoryIds: [assignment.resourceId],
        writingFrame: resource?.writingFrame || "",
        kind: "resource",
        taskTitle: assignment.title
      });
    }
  }
}

decorateTheoryResources();
decorateReaderModules();
decorateLessonSets();

export const starterPrompt = {
  title: "Autonomer Lernparcours",
  items: [
    "Arbeite die Einheit selbstgesteuert entlang von zwölf eng geführten Lektionen im eingebetteten PDF durch und sichere jede Beobachtung passagennah.",
    "Beginne immer mit einem Textsignal: Wortlaut, Bild, Raumdetail, Briefformel, Körperreaktion, juristische Formel, Gutachterbegriff oder forensische Spur.",
    "Nutze pro Passage mindestens eine literarische und wenn möglich eine interdisziplinäre Linse: Forensik, Rechtswissenschaft, Geschichte der Weimarer Republik, Milieu/Symbiose, Briefe/Rausch oder Schuld/Zusammenhang.",
    "Arbeite vergleichend: Was klären Literatur, Forensik, Strafrecht und Geschichtswissenschaft jeweils gut, und wo bleiben ihre Erklärungen unvollständig?",
    "Halte im Revisionsfeld fest, was du nach neuer Lektüre, nach Feedback oder nach einem Dossiervergleich noch präzisieren würdest.",
    "Behalte besonders Elli Link, Karl Link, Grete Bende, die Mutterfiguren, Briefe, Arsen, Gewalt, Prozesssprache, Weimarer Öffentlichkeit, historische Zuschreibungen und den Epilog im Blick."
  ]
};

export const pdfSource = pdfPath;

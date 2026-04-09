const pdfPath = "/reader/assets/22-bahnen.pdf";
const coverImg = "/reader/assets/22-bahnen-cover.jpg";
const authorImg = "/reader/assets/caroline-wahl.jpg";
const dropboxFolder =
  "https://www.dropbox.com/scl/fo/gvyema66vegtqwou0wnwr/AO4zf617pYeKWWyP_9wDrOI?rlkey=27l9qxttc7iem2fhtdt15f5za&st=hrr3zlfo&dl=0";
const youtubeOne = "https://www.youtube.com/watch?v=ETB4dW189qY";
const youtubeTwo = "https://www.youtube.com/watch?v=bCFr14gaHNQ";
const youtubeThree = "https://www.youtube.com/watch?v=9Qjvm6u4eb4";

function youtubeEmbed(url) {
  const id = new URL(url).searchParams.get("v");
  return `https://www.youtube.com/embed/${id}`;
}

export const theoryResources = [
  {
    id: "materialpool",
    title: "Externer Materialpool zum Roman",
    shortTitle: "Materialpool",
    sourceTitle: "Dropbox-Ordner und verlinkte Zusatzinputs",
    mediaType: "html",
    openUrl: dropboxFolder,
    embedUrl: "/reader/assets/materialpool-22-bahnen.html",
    summary:
      "Diese Linse bündelt die vom Auftrag ausgehenden Zusatzmaterialien. Sie ist keine Musterlösung, sondern eine Vergleichsfolie für eigene Deutungen, Schwerpunktsetzungen und Unterrichtsgespräche.",
    keyIdeas: ["Vergleichshorizont", "Außenperspektive", "Romanzugang", "Unterrichtsimpuls", "Materialauswahl"],
    questions: [
      "Welches der externen Materialien ergänzt deine aktuelle Passage am sinnvollsten, und warum gerade dieses?",
      "An welcher Stelle bestätigt der Materialpool deine Lektüre, und an welcher widerspricht oder verschiebt er sie?",
      "Wie kannst du ein externes Material nutzen, ohne bloß nachzuerzählen, was dort gesagt wird?"
    ],
    transferPrompts: [
      "Vergleiche deine Passage mit einem Material aus dem Pool und halte genau fest, was sich an deiner Deutung dadurch schärft.",
      "Erkläre, welche Perspektive von außen auf den Roman hier besonders hilfreich ist: Figurenblick, Motivik, Sprache oder Gesamtdeutung.",
      "Prüfe, ob das externe Material eher eine Lücke füllt oder deine bisherige Sicht bewusst irritiert."
    ],
    writingFrame:
      "Als Vergleichsfolie hilft mir das externe Material, weil es meine Passage nicht ersetzt, sondern ..."
  },
  {
    id: "perspektive",
    title: "Dossier: Ich-Erzählung, Wahrnehmung und Selbstschutz",
    shortTitle: "Perspektive",
    sourceTitle: "Lokales Dossier zur Erzählperspektive",
    mediaType: "html",
    openUrl: "/reader/assets/erzaehlperspektive-22-bahnen.html",
    embedUrl: "/reader/assets/erzaehlperspektive-22-bahnen.html",
    summary:
      "Das Dossier schärft, dass Tildas Ich-Erzählung nie neutral ist. Sie beobachtet präzise, lenkt aber zugleich weg, wenn Schmerz, Schuld oder Überforderung zu nah kommen.",
    keyIdeas: ["Ich-Erzählung", "Fokalisierung", "Nähe", "Distanz", "Selbstschutz"],
    questions: [
      "Wo merkt man in deiner Passage besonders deutlich, dass wir nur Tildas Wahrnehmung erhalten?",
      "Was blendet Tilda aus, verkürzt sie oder kontrolliert sie sprachlich besonders stark?",
      "Wie verändert sich die Wirkung einer Szene dadurch, dass Tilda zugleich Beobachterin und Betroffene ist?"
    ],
    transferPrompts: [
      "Zeige an einem Wort, Blick oder Wahrnehmungssprung, wie Tilda die Szene filtert.",
      "Prüfe, ob Tilda in deiner Passage eher Nähe zulässt oder Distanz erzeugt.",
      "Erkläre, wie die Perspektive das Verhältnis von Kontrolle und Verletzlichkeit formt."
    ],
    writingFrame:
      "Die Passage wirkt so, weil Tilda als Ich-Erzählerin ... wahrnimmt, aber ... zugleich zurückhält."
  },
  {
    id: "wasser-motivik",
    title: "Dossier: Wasser, Bahnen, Tauchen und Rettung",
    shortTitle: "Wasser",
    sourceTitle: "Lokales Dossier zur Motivik",
    mediaType: "html",
    openUrl: "/reader/assets/wasser-und-bahnen-22-bahnen.html",
    embedUrl: "/reader/assets/wasser-und-bahnen-22-bahnen.html",
    summary:
      "Vom Freibad über den Regen bis zum Meer im Fiebertraum trägt Wasser den Roman. Es steht für Ordnung, Flucht, Kontrolle, Überforderung, Erinnerung und Rettung zugleich.",
    keyIdeas: ["Schwimmen", "Zählen", "Tauchen", "Meer", "Rettung"],
    questions: [
      "Welche Funktion hat Wasser in deiner Passage genau: Beruhigung, Bedrohung, Erinnerung oder Übergang?",
      "Wie verbindet das Schwimmen Körperdisziplin mit emotionalem Überleben?",
      "Wo kippt Wasser im Roman von einem kontrollierten Element in etwas Unberechenbares?"
    ],
    transferPrompts: [
      "Ordne deine Passage in die Wasser-Motivik des Romans ein und benenne eine klare Funktionsverschiebung.",
      "Erkläre, wie aus den 22 Bahnen mehr wird als bloß eine Sportgewohnheit.",
      "Zeige, ob Wasser hier eher Schutzraum, Prüfungsraum oder Beziehungsraum ist."
    ],
    writingFrame:
      "Das Wasser-Motiv schärft die Passage, weil es hier nicht nur ... bedeutet, sondern zugleich ..."
  },
  {
    id: "familienrollen",
    title: "Dossier: Fürsorge, Parentifizierung und Schwesternschaft",
    shortTitle: "Familie",
    sourceTitle: "Lokales Dossier zu Rollen im Roman",
    mediaType: "html",
    openUrl: "/reader/assets/fuersorge-und-familie-22-bahnen.html",
    embedUrl: "/reader/assets/fuersorge-und-familie-22-bahnen.html",
    summary:
      "Das Dossier zeigt, wie sehr `22 Bahnen` von verschobenen Rollen lebt: Tilda wird zur Versorgerin, Ida ist zugleich Kind und Gegenkraft, die Mutter kippt zwischen Bedürftigkeit, Verletzung und Aggression.",
    keyIdeas: ["Fürsorge", "Parentifizierung", "Ida", "Mutter", "Vaterleerstelle"],
    questions: [
      "Welche Rolle übernimmt Tilda in deiner Passage, die eigentlich einer erwachsenen Bezugsperson zukommen müsste?",
      "Wie wird Ida zugleich als schutzbedürftig und erstaunlich handlungsfähig gezeigt?",
      "Woran erkennt man, dass die Familie nicht stabil ist, obwohl viele Routinen funktionieren?"
    ],
    transferPrompts: [
      "Arbeite die Rollenverschiebung in deiner Passage präzise heraus.",
      "Zeige, ob Tildas Fürsorge eher schützt, überfordert oder beides zugleich.",
      "Prüfe, wie der Roman Nähe nicht idyllisiert, sondern mit Verantwortung auflädt."
    ],
    writingFrame:
      "Die Passage macht Familienrolle nicht als festen Platz sichtbar, sondern als ...",
  },
  {
    id: "sprache-koerper",
    title: "Dossier: Lakonie, Listenstil und Körperwahrnehmung",
    shortTitle: "Sprache",
    sourceTitle: "Lokales Dossier zu Sprache und Stil",
    mediaType: "html",
    openUrl: "/reader/assets/sprache-und-koerper-22-bahnen.html",
    embedUrl: "/reader/assets/sprache-und-koerper-22-bahnen.html",
    summary:
      "Caroline Wahl verbindet knappe Sätze, Aufzählungen, trockenen Witz und extreme Körpernähe. Gerade dadurch werden Überforderung, Zärtlichkeit und Angst unmittelbar lesbar.",
    keyIdeas: ["Aufzählung", "Lakonie", "Körper", "Rhythmus", "Ironie"],
    questions: [
      "Welche sprachliche Form prägt die Passage am stärksten: Liste, Lakonie, Bildlichkeit oder Dialogknappheit?",
      "Wie arbeitet der Roman mit Geruch, Temperatur, Schmerz oder Bewegung?",
      "Wo kippt ein trockener Ton in Verletzlichkeit oder umgekehrt?"
    ],
    transferPrompts: [
      "Benenne ein sprachliches Muster und erkläre seine Wirkung auf die Passage.",
      "Zeige, wie Körperwahrnehmung die psychische Lage sichtbar macht.",
      "Prüfe, ob der Witz entlastet, schützt oder den Schmerz gerade schärfer macht."
    ],
    writingFrame:
      "Sprachlich trägt die Passage besonders, weil Wahl hier mit ... arbeitet und dadurch ..."
  },
  {
    id: "inputvideo-1",
    title: "YouTube-Impuls 1 aus dem Auftrag",
    shortTitle: "Video 1",
    sourceTitle: "Verlinkter YouTube-Input",
    mediaType: "video",
    openUrl: youtubeOne,
    embedUrl: youtubeEmbed(youtubeOne),
    summary:
      "Dieser vom Auftrag ausgehende Videoimpuls dient als Vergleichshorizont. Nutze ihn nicht als Lösung, sondern als Anlass, deine eigene Lektüre zu prüfen, zu schärfen oder bewusst abzugrenzen.",
    keyIdeas: ["Vergleich", "Deutungsangebot", "Akzentsetzung", "Romanzugang"],
    questions: [
      "Welchen Schwerpunkt setzt das Video, den du in deiner Passage ebenfalls oder gerade nicht siehst?",
      "Welche Figur, welches Motiv oder welche Beziehung rückt durch den Videoimpuls stärker in den Vordergrund?",
      "Wo solltest du der Videoaussage widersprechen, weil der Romantext differenzierter ist?"
    ],
    transferPrompts: [
      "Vergleiche deine Passage mit einer Deutungsbewegung aus dem Video.",
      "Entscheide, ob der Videoimpuls den Roman eher vereinfacht oder sinnvoll zuspitzt.",
      "Halte fest, was du aus dem Video übernehmen würdest und was nicht."
    ],
    writingFrame:
      "Der Videoimpuls ist für meine Passage hilfreich, weil er ... betont; zugleich bleibt wichtig, dass der Roman ..."
  },
  {
    id: "inputvideo-2",
    title: "YouTube-Impuls 2 aus dem Auftrag",
    shortTitle: "Video 2",
    sourceTitle: "Verlinkter YouTube-Input",
    mediaType: "video",
    openUrl: youtubeTwo,
    embedUrl: youtubeEmbed(youtubeTwo),
    summary:
      "Auch dieser Videoimpuls wird hier als Kontrastfolie eingesetzt. Entscheidend ist, ob deine Textbeobachtung dem externen Zugriff standhält oder ihn korrigieren muss.",
    keyIdeas: ["Kontrastfolie", "Textprüfung", "Figurenblick", "Akzentverschiebung"],
    questions: [
      "Welche Lesart bietet das Video an, die du am Text überprüfen musst?",
      "An welcher Stelle macht der Videozugriff den Roman pointierter als der Text selbst?",
      "Wie kannst du aus dem Video eine Rückfrage an deine Passage formulieren?"
    ],
    transferPrompts: [
      "Vergleiche einen Schwerpunkt des Videos mit einem genauen Textsignal deiner Passage.",
      "Erkläre, ob das Video eher Figurenpsychologie, Handlung oder Motivik in den Vordergrund rückt.",
      "Prüfe, wo deine Passage widerständig gegen eine glatte Lesart bleibt."
    ],
    writingFrame:
      "Im Vergleich mit dem Video wird deutlich, dass meine Passage nicht nur ..., sondern vor allem ..."
  },
  {
    id: "inputvideo-3",
    title: "YouTube-Impuls 3 aus dem Auftrag",
    shortTitle: "Video 3",
    sourceTitle: "Verlinkter YouTube-Input",
    mediaType: "video",
    openUrl: youtubeThree,
    embedUrl: youtubeEmbed(youtubeThree),
    summary:
      "Der dritte Videoimpuls eignet sich besonders, um Schlussbewegungen, Gesamtwirkung und offene Zukunftsbilder gegen eine fremde Lektüre zu spiegeln.",
    keyIdeas: ["Gesamtdeutung", "Schluss", "Offenheit", "Abgleich"],
    questions: [
      "Welche Gesamtaussage zum Roman scheint in diesem Video angelegt zu sein?",
      "Passt diese Gesamtaussage wirklich zu deiner Passage oder bleibt sie zu eindeutig?",
      "Wie verändert der Videoimpuls deinen Blick auf das Ende oder auf Viktors Rolle?"
    ],
    transferPrompts: [
      "Vergleiche deine Passage mit der Gesamttendenz des Videos.",
      "Prüfe, ob das Video dem offenen Ende des Romans gerecht wird.",
      "Erkläre, welche Ambivalenz des Textes du gegen die Außenperspektive verteidigen würdest."
    ],
    writingFrame:
      "Im Abgleich mit dem Video bleibt für mich entscheidend, dass der Roman am Schluss ..."
  }
];

export const readerModules = [
  {
    id: "routine",
    title: "Alltag, Disziplin und 22 Bahnen",
    lens: "Routine, Kontrolle, Selbststeuerung",
    briefing:
      "Untersuche, wie Tilda ihren Alltag durchlisten, takten und zählen muss. Gerade diese Ordnung verrät früh, wie groß die innere Belastung bereits ist.",
    task:
      "Arbeite heraus, wie Einkauf, Studium, Schwimmen und Beobachtung bei Tilda nicht bloß Gewohnheiten, sondern Überlebensformen sind.",
    relatedTheoryIds: ["perspektive", "wasser-motivik", "sprache-koerper"],
    entries: [
      {
        id: "routine-1",
        title: "Der Kassenauftakt als Selbststeuerung",
        pageHint: "S. 8-9",
        pageNumber: 8,
        passageLabel: "Listen, Raten, Kontrolle",
        context:
          "Der Roman beginnt mit Warenlisten, Preisraten und knapper Beobachtung. Schon im Auftakt zeigt sich, dass Tilda die Welt nur im Modus strenger Selbststeuerung bewältigt.",
        signalWords: ["Hafermilch", "Levi's-Shirt", "30,72 Euro", "hochschauen", "Höhepunkt"],
        prompts: [
          "Welche Wirkung hat der Listenauftakt auf Tildas Figur?",
          "Wie zeigt die Szene, dass Beobachtung für Tilda ein Kontrollinstrument ist?",
          "Warum ist dieser Einstieg zugleich komisch und erschöpfend?"
        ],
        writingFrame:
          "Der Auftakt ist stark, weil er Tildas Alltag nicht erklärt, sondern sofort als ... erfahrbar macht.",
        relatedTheoryIds: ["perspektive", "sprache-koerper"]
      },
      {
        id: "routine-2",
        title: "Zeitplan, Papierstau und aufgestaute Wut",
        pageHint: "S. 10-11",
        pageNumber: 10,
        passageLabel: "Taktung statt Leichtigkeit",
        context:
          "Straßenbahn, Uni, Kopierer, Aufgaben: Der Roman verdichtet Tildas Tag über Abfolge und Takt. Der kleine Defekt des Kopierers zeigt, wie wenig Spielraum sie sich leisten kann.",
        signalWords: ["strikter Zeitplan", "Papierstau", "Zerstörungswut", "Straßenbahn"],
        prompts: [
          "Wie macht der Text Zeitdruck sprachlich sichtbar?",
          "Was verrät Tildas Reaktion auf den Kopierer über ihren Zustand?",
          "Warum ist die scheinbar banale Alltagsszene für die Figurenzeichnung wichtig?"
        ],
        writingFrame:
          "An der Kopierer-Szene wird sichtbar, dass Tildas Kontrolle nur funktioniert, solange ...",
        relatedTheoryIds: ["sprache-koerper", "perspektive"]
      },
      {
        id: "routine-3",
        title: "Tauchen, zählen, sich bestrafen",
        pageHint: "S. 12-15",
        pageNumber: 14,
        passageLabel: "22 Bahnen als Ritual",
        context:
          "Im Wasser wird Tildas Tag erstmals geordnet und körperlich übersetzt. Dass sie bei Unsicherheit fünf Bahnen zur Strafe anhängt, macht aus dem Schwimmen ein strenges Ritual.",
        signalWords: ["Grund", "22 Bahnen", "20 oder 22", "Bestrafung", "zusätzliche Bahnen"],
        prompts: [
          "Welche Funktion hat das Schwimmen in dieser frühen Passage?",
          "Wie verbindet der Text Körperdisziplin mit psychischer Anspannung?",
          "Warum ist die Selbstbestrafung nach dem Zählfehler so aufschlussreich?"
        ],
        writingFrame:
          "Das Schwimmen bedeutet hier mehr als Sport, weil es Tildas Bedürfnis nach ... sichtbar macht.",
        relatedTheoryIds: ["wasser-motivik", "sprache-koerper"]
      },
      {
        id: "routine-4",
        title: "Ursula, Stille und der erste Blick auf Viktor",
        pageHint: "S. 16-22",
        pageNumber: 20,
        passageLabel: "Beobachten statt sprechen",
        context:
          "Mit Ursula zeigt der Roman eine Form stiller Verlässlichkeit. Zugleich kippt die Beckenbeobachtung in Schock, als Viktor Tildas Erinnerung an Ivan aktiviert.",
        signalWords: ["schweigen", "Ursula", "Blickkontakt", "Ivan", "großer Bruder"],
        prompts: [
          "Wie funktioniert die stille Beziehung zwischen Tilda und Ursula?",
          "Wodurch kippt die Sommerleichtigkeit der Szene in Bedrohung oder Übelkeit?",
          "Wie arbeitet der Text mit Blicken, Distanz und plötzlicher Erinnerung?"
        ],
        writingFrame:
          "Die Passage kippt, weil aus einer Beobachtungsszene plötzlich ... wird.",
        relatedTheoryIds: ["perspektive", "wasser-motivik"]
      }
    ]
  },
  {
    id: "familie",
    title: "Zuhause, Fürsorge und kleine Gegenräume",
    lens: "Parentifizierung, Zärtlichkeit, Überlebensalltag",
    briefing:
      "Lies die Familienszenen nicht bloß als Hintergrund. Hier zeigt der Roman, dass Tilda längst Funktionen übernommen hat, die eigentlich Erwachsene tragen müssten.",
    task:
      "Arbeite heraus, wie Wahl Fürsorge, Scham, Humor und Erschöpfung innerhalb derselben häuslichen Welt zusammenführt.",
    relatedTheoryIds: ["familienrollen", "sprache-koerper", "perspektive"],
    entries: [
      {
        id: "familie-1",
        title: "Die Wohnung als Krisenraum",
        pageHint: "S. 23-28",
        pageNumber: 26,
        passageLabel: "Mama hat wieder gekocht",
        context:
          "Das Heimkommen enthüllt sofort die instabile Familienlage. Die Küche, die beschlagenen Fenster und die schlafende Mutter machen die Wohnung zum Bild gelebter Verwahrlosung und Scham.",
        signalWords: ["beschlagene Scheiben", "verbrannt", "Welcome", "dummes Huhn", "gekocht"],
        prompts: [
          "Wie zeichnet der Roman die Wohnung als Spiegel der familiären Lage?",
          "Warum ist der Satz `Mama hat wieder gekocht` so vielsagend?",
          "Wie mischt die Passage Ekel, Mitleid und Routine?"
        ],
        writingFrame:
          "Die Wohnung wirkt nicht einfach chaotisch, sondern als Raum, in dem ... alltäglich geworden ist.",
        relatedTheoryIds: ["familienrollen", "sprache-koerper"]
      },
      {
        id: "familie-2",
        title: "Mirácoli, Lüge und Zärtlichkeit mit Ida",
        pageHint: "S. 29-33",
        pageNumber: 31,
        passageLabel: "Versorgen, ohne viel zu reden",
        context:
          "Zwischen billigem Essen, Müdigkeit und kleinem Trost zeigt sich Tildas Bindung an Ida. Die Lüge `Mirácoli` schützt weniger vor der Wahrheit als vor zusätzlicher Härte.",
        signalWords: ["Mirácoli", "Gut&Günstig", "Hab dich lieb", "Ich dich auch"],
        prompts: [
          "Wie zeigt die Passage Fürsorge ohne große Sentimentalität?",
          "Welche Funktion hat die kleine Lüge rund um das Essen?",
          "Wodurch wird Ida als Gegenüber für Tilda so zentral?"
        ],
        writingFrame:
          "Die Szene trägt, weil Fürsorge hier nicht groß inszeniert, sondern ... wird.",
        relatedTheoryIds: ["familienrollen", "perspektive"]
      },
      {
        id: "familie-3",
        title: "Sommernachtsbrise und Krieg da draußen",
        pageHint: "S. 34-38",
        pageNumber: 36,
        passageLabel: "Ein eigener Atemraum",
        context:
          "Auf der Matratze erlebt Tilda einen kurzen Gegenraum. Der Roman verbindet Wind, Geruch und Ruhe mit der Erkenntnis, dass sie tagsüber in einen Krieg zurückkehrt.",
        signalWords: ["Sommernachtsbrise", "leicht", "Krieg da draußen", "für Ida"],
        prompts: [
          "Wie wird aus der nächtlichen Ruhe mehr als bloße Erholung?",
          "Was bedeutet die Kriegsmetapher im Zusammenhang mit Familie und Kleinstadt?",
          "Wie arbeitet die Passage mit Atem, Körper und Naturwahrnehmung?"
        ],
        writingFrame:
          "Die Passage zeigt Erleichterung, aber sie bleibt prekär, weil ...",
        relatedTheoryIds: ["sprache-koerper", "familienrollen"]
      },
      {
        id: "familie-4",
        title: "Regenweg, Kleinstadt und Idas Auftreten",
        pageHint: "S. 39-46",
        pageNumber: 43,
        passageLabel: "Zwischen Vorstadt und Schwimmbad",
        context:
          "Der Roman führt die räumliche Enge der Kleinstadt gegen Idas überraschend farbige Selbstinszenierung. Gerade in Tildas Beobachtungen zeigt sich, wie sie Ida liest und schützt.",
        signalWords: ["Felder", "Kleinstadt", "Snoopy-Rucksack", "Fashionista", "flüstert"],
        prompts: [
          "Wie kontrastiert der Roman Stadt, Vorstadt und Kleinstadt?",
          "Warum beobachtet Tilda Idas Kleidung und Auftreten so genau?",
          "Wie entstehen in dieser Passage gleichzeitig Enge und Lebendigkeit?"
        ],
        writingFrame:
          "Die Passage macht Kleinstadt nicht nur als Ort, sondern als ... erfahrbar.",
        relatedTheoryIds: ["perspektive", "familienrollen"]
      }
    ]
  },
  {
    id: "viktor",
    title: "Viktor, Erinnerung und die Rückkehr der Vergangenheit",
    lens: "Begehren, Trauma, Blickregie",
    briefing:
      "Lies Viktors Auftauchen nicht als bloße Liebesgeschichte. Er zieht Ivan, Schuld, Erinnerung und Zukunft gleichzeitig in den Roman hinein.",
    task:
      "Zeige, wie Wahl Viktors Präsenz über Blicke, Körperwahrnehmung und nachträgliche Erinnerung auflädt.",
    relatedTheoryIds: ["perspektive", "wasser-motivik", "familienrollen"],
    entries: [
      {
        id: "viktor-1",
        title: "Der leere Regenbad-Moment",
        pageHint: "S. 47-52",
        pageNumber: 48,
        passageLabel: "23 Bahnen und ein fremder Rhythmus",
        context:
          "Im fast leeren Becken wird Viktors Schwimmen zu einem Gegenbild von Kontrolle, Eleganz und Irritation. Tilda kann sich seinem Rhythmus kaum entziehen.",
        signalWords: ["fast leer", "23 Bahnen", "grinst", "22 Bahnen", "schneller als du"],
        prompts: [
          "Wie verändert sich die Atmosphäre des Schwimmbads durch Viktors Auftreten?",
          "Warum ist Tildas Beobachtung seines Schwimmstils so ausführlich?",
          "Welche Rolle spielt Ida als kommentierende Gegenstimme in dieser Szene?"
        ],
        writingFrame:
          "Viktor erscheint hier weniger als Person mit Vorgeschichte, sondern zuerst als ...",
        relatedTheoryIds: ["wasser-motivik", "perspektive"]
      },
      {
        id: "viktor-2",
        title: "Der Name und die Legende Viktor",
        pageHint: "S. 53-59",
        pageNumber: 56,
        passageLabel: "Mythos und Projektion",
        context:
          "Als Tilda sich an Viktors Namen erinnert, breitet der Roman eine Schullegende aus. Begehrlichkeit und Erzählung greifen ineinander, ohne dass Viktor dadurch einfacher würde.",
        signalWords: ["Viktor", "Darknet", "hochbegabt", "sagenumwoben", "russischer Kampfschwimmer"],
        prompts: [
          "Wie wird Viktor über Erzählgerüchte aufgeladen?",
          "Was verrät Tildas Erinnerung an Schule und Gerüchte über ihren Blick auf Viktor?",
          "Warum ist die Figur gerade durch diese Legendenbildung nicht wirklich durchschaubar?"
        ],
        writingFrame:
          "Der Roman macht aus Viktor bewusst keine einfache Liebesfigur, weil er ihn als ... einführt.",
        relatedTheoryIds: ["perspektive", "sprache-koerper"]
      },
      {
        id: "viktor-3",
        title: "Ivan, Einladung und das Nicht-Einsteigen",
        pageHint: "S. 60-68",
        pageNumber: 64,
        passageLabel: "Erinnerung als offener Schmerz",
        context:
          "In der Rückblende auf Ivan verdichten sich Panik, Rettung, Nähe und Schuld. Besonders wichtig bleibt die verpasste Abfahrt: Tilda ist nicht eingestiegen, aber die Frage nach einer anderen Kette von Ereignissen bleibt offen.",
        signalWords: ["Mein Herz", "Russland", "nicht eingestiegen", "Sorry", "ist schon okay"],
        prompts: [
          "Wie inszeniert der Roman die Erinnerung an Ivan als körperlich überformten Schock?",
          "Warum ist das Motiv des Nicht-Einsteigens für Tilda so belastet?",
          "Wie entsteht hier Schuld, ohne dass der Text sie eindeutig verteilt?"
        ],
        writingFrame:
          "Die Rückblende ist so stark, weil sie Erinnerung nicht ordnet, sondern als ... erfahrbar macht.",
        relatedTheoryIds: ["perspektive", "sprache-koerper"]
      },
      {
        id: "viktor-4",
        title: "Im Haus der Vergangenheit",
        pageHint: "S. 69-76",
        pageNumber: 72,
        passageLabel: "Gegenwart mit altem Echo",
        context:
          "Dass Viktor im Haus lebt, vor dem sich Tilda vor Jahren von Ivan verabschiedet hat, verschränkt Gegenwart und Vergangenheit dauerhaft. Die Nähe zu Viktor ist dadurch nie unbelastet.",
        signalWords: ["Haus", "vor fünf Jahren", "verabschiedet", "erzählen", "falsch"],
        prompts: [
          "Wie wird der Ort selbst zum Träger von Erinnerung?",
          "Warum ist Tildas Schweigen gegenüber Viktor so bedeutsam?",
          "Wie bindet die Passage neue Nähe an alte Schuld?"
        ],
        writingFrame:
          "Der Ort ist hier nicht bloß Kulisse, sondern speichert ...",
        relatedTheoryIds: ["perspektive", "familienrollen"]
      }
    ]
  },
  {
    id: "belastung",
    title: "Überforderung, Konflikt und Wunsch nach Aufbruch",
    lens: "Rollenlast, Körperstress, Emanzipation",
    briefing:
      "Verfolge, wie Tildas Belastung nicht aus einer einzigen Krise stammt. Studium, Arbeit, Sorge, Begehren und Zukunftsfragen überlagern sich permanent.",
    task:
      "Arbeite heraus, wie der Roman Überforderung über Körper, Dialog und Eskalation in Familiengesprächen sichtbar macht.",
    relatedTheoryIds: ["sprache-koerper", "familienrollen", "perspektive"],
    entries: [
      {
        id: "belastung-1",
        title: "Panik auf der Party",
        pageHint: "S. 77-85",
        pageNumber: 80,
        passageLabel: "Herz, Hitze, Kontrollverlust",
        context:
          "Die Party-Rückblende zerlegt Tildas Körperempfinden. Hitze, Beats, fluoreszierende Gesichter und Wasserbilder machen sichtbar, wie schnell Kontrolle in Panik kippt.",
        signalWords: ["Mein Herz", "Kaulquappen", "zu heiß", "Wasseroberfläche", "Blitze"],
        prompts: [
          "Wie arbeitet die Passage mit Halluzination und Körperauflösung?",
          "Warum sind Wasserbilder gerade im Panikmoment so präsent?",
          "Welche Funktion hat die direkte Rede in der Darstellung des Kontrollverlusts?"
        ],
        writingFrame:
          "Die Panik wird nicht erklärt, sondern über ... unmittelbar erfahrbar gemacht.",
        relatedTheoryIds: ["sprache-koerper", "wasser-motivik"]
      },
      {
        id: "belastung-2",
        title: "Leistungsdruck und Erwachsenenroutine",
        pageHint: "S. 86-94",
        pageNumber: 90,
        passageLabel: "Alles läuft gleichzeitig",
        context:
          "Zwischen Uni, Kasse, Schwimmbad und Haushalt wird deutlich, dass Tilda in mehreren Systemen gleichzeitig funktionieren muss. Der Roman zeigt diese Rollenlast ohne Pathos.",
        signalWords: ["Masterkolloquium", "stehen müssen", "verschwende Zeit", "Hühnersuppe", "Hausaufgaben"],
        prompts: [
          "Wie macht der Roman Mehrfachbelastung über Alltagsdetails sichtbar?",
          "Warum wirkt die Erzählung trotz der Schwere oft lakonisch statt klagend?",
          "Wie verändert sich dein Blick auf Tilda, wenn du Studium und Sorgearbeit zusammendenkst?"
        ],
        writingFrame:
          "Die Passage zeigt Überforderung, weil Tilda hier zugleich ... und ... leisten muss.",
        relatedTheoryIds: ["sprache-koerper", "familienrollen"]
      },
      {
        id: "belastung-3",
        title: "Die Mutter in der depressiven Phase",
        pageHint: "S. 95-103",
        pageNumber: 98,
        passageLabel: "Brot, Leere und Angst",
        context:
          "Die Tischszenen machen deutlich, dass die Mutter nicht nur trinkt, sondern in eine apathische Leere kippt. Tildas Angst gilt gerade der scheinbaren Ruhe.",
        signalWords: ["resigniert", "leer", "Scheibe Brot", "alles gut", "Termine"],
        prompts: [
          "Wie zeigt der Roman Depression über kleine Routinen statt über große Erklärungen?",
          "Warum ist die Mutter gerade in ihrer Apathie so bedrohlich?",
          "Wie reagieren Ida und Tilda unterschiedlich auf diese Phase?"
        ],
        writingFrame:
          "Die Passage wirkt beklemmend, weil die scheinbare Ruhe hier ... bedeutet.",
        relatedTheoryIds: ["familienrollen", "sprache-koerper"]
      },
      {
        id: "belastung-4",
        title: "Berlin als Konfliktlinie",
        pageHint: "S. 104-113",
        pageNumber: 108,
        passageLabel: "Weggehen oder bleiben",
        context:
          "Die Berlin-Frage legt den Rollenkonflikt offen: Tilda will Zukunft, kann Ida aber nicht allein lassen. Die Mutter reagiert mit Abwehr, Kränkung und Zynismus.",
        signalWords: ["Berlin", "alt genug", "Wunschkonzert", "du hast sie nur bekommen", "abhauen"],
        prompts: [
          "Wie verdichtet das Gespräch Tildas Emanzipationsproblem?",
          "Was zeigt die Passage über die Rolle der Mutter im Familiengefüge?",
          "Warum ist Ida in diesem Konflikt zugleich Grund zum Bleiben und Motor für Veränderung?"
        ],
        writingFrame:
          "An der Berlin-Szene wird sichtbar, dass Zukunft für Tilda immer durch ... blockiert bleibt.",
        relatedTheoryIds: ["familienrollen", "perspektive"]
      }
    ]
  },
  {
    id: "krise",
    title: "Überdosis, Fieber und Rettungsbilder",
    lens: "Notfall, Traumlogik, Rettung",
    briefing:
      "Arbeite die Krisenpassagen nicht nur als Handlungshöhepunkt heraus. Sie bündeln die ganze Vorgeschichte aus Rollenverschiebung, Verlust und Wasser-Motivik in verdichteter Form.",
    task:
      "Zeige, wie sich in Überdosis, Fieber und Rettung psychische, familiäre und symbolische Ebenen überlagern.",
    relatedTheoryIds: ["wasser-motivik", "familienrollen", "sprache-koerper"],
    entries: [
      {
        id: "krise-1",
        title: "Die entdeckte Überdosis",
        pageHint: "S. 124-131",
        pageNumber: 126,
        passageLabel: "Stillstand und sofortiges Handeln",
        context:
          "Der Roman schaltet vom Pizzagluck in einen Schockmoment. Gegen die Starre setzt Tilda eine fast protokollarische Notfalllogik.",
        signalWords: ["Wodkaflasche", "Xanax", "SORRY", "jetzt", "Atmung kontrollieren"],
        prompts: [
          "Wie organisiert der Roman den abrupten Umschlag von Alltag in Notfall?",
          "Welche Wirkung hat die genaue Notfallprozedur auf die Szene?",
          "Warum ist Ida in diesem Moment nicht bloß Nebenfigur?"
        ],
        writingFrame:
          "Die Szene ist so eindringlich, weil Wahl Schock und Handlungszwang gleichzeitig zeigt: ...",
        relatedTheoryIds: ["sprache-koerper", "familienrollen"]
      },
      {
        id: "krise-2",
        title: "Zwei Kinder, ein Rettungsprotokoll",
        pageHint: "S. 132-137",
        pageNumber: 134,
        passageLabel: "Professionalisierte Fürsorge",
        context:
          "Mit den `Jetzt:`-Schritten und Idas Notruf wird sichtbar, wie vorbereitet die Schwestern für einen Katastrophenfall längst sind. Genau darin liegt die Härte der Szene.",
        signalWords: ["112", "stabile Seitenlage", "Ida Schmitt", "Betroffene", "Sirenen"],
        prompts: [
          "Was zeigt die protokollhafte Sprache über Tildas und Idas Lebenswirklichkeit?",
          "Wie wird aus Fürsorge hier eine erschreckende Professionalität?",
          "Warum ist der Märchenvergleich mit Schneewittchen zugleich entlastend und grausam?"
        ],
        writingFrame:
          "Die Protokollsprache wirkt so stark, weil sie verrät, dass ... längst eingeübt ist.",
        relatedTheoryIds: ["familienrollen", "sprache-koerper"]
      },
      {
        id: "krise-3",
        title: "Fiebertraum mit Vater und offenem Meer",
        pageHint: "S. 138-151",
        pageNumber: 146,
        passageLabel: "Verlassenwerden als Wasserbild",
        context:
          "Im Fieber formt der Roman Kindheit, Vaterverlust und Lebensangst zu einem Meeresbild um. Tilda und Ida treiben allein, während der Vater wegfährt.",
        signalWords: ["Pferd", "Papa", "offenes Meer", "wir schaffen alles", "Schiff am Horizont"],
        prompts: [
          "Wie verbindet der Fiebertraum Familiengeschichte und Bedrohungsbild?",
          "Welche Funktion hat das Meer in dieser Passage?",
          "Wie wird Idas Rettungsbedürftigkeit zum Zentrum von Tildas Traum?"
        ],
        writingFrame:
          "Im Fieber wird das Verlassenwerden als ... inszeniert und dadurch besonders radikal.",
        relatedTheoryIds: ["wasser-motivik", "familienrollen"]
      },
      {
        id: "krise-4",
        title: "Viktor als Seemann und Pflegender",
        pageHint: "S. 152-164",
        pageNumber: 158,
        passageLabel: "Rettung wird konkret",
        context:
          "Viktor erscheint im Traum als Seemann und in der Realität als derjenige, der Tilda versorgt. Damit wird Rettung nicht kitschig, sondern körperlich und praktisch greifbar.",
        signalWords: ["Seemann", "Wickel", "Tilda, ich bin da", "tapfer", "neu bezogene Decke"],
        prompts: [
          "Wie verschränkt der Roman Traum- und Wirklichkeitsebene in dieser Passage?",
          "Warum ist Viktors Fürsorge gerade durch ihre Praktikabilität so bedeutsam?",
          "Wie verändert sich Tildas Wahrnehmung von Viktor hier?"
        ],
        writingFrame:
          "Viktor wird hier wichtig, weil Rettung bei ihm nicht behauptet, sondern ... wird.",
        relatedTheoryIds: ["wasser-motivik", "perspektive"]
      }
    ]
  },
  {
    id: "aufbruch",
    title: "Nach der Krise: Entlastung, Liebe und offenes Ende",
    lens: "Veränderung, Offenheit, neue Bewegung",
    briefing:
      "Lies die späten Passagen nicht als einfache Heilung. Der Roman zeigt Entlastung und Nähe, ohne die Instabilität der Lebenslage ganz aufzulösen.",
    task:
      "Arbeite heraus, wie `22 Bahnen` gegen Ende offen bleibt und gerade dadurch glaubwürdig wirkt.",
    relatedTheoryIds: ["perspektive", "wasser-motivik", "familienrollen", "sprache-koerper"],
    entries: [
      {
        id: "aufbruch-1",
        title: "Krankenhaus, Verweigerung und Idas Rede",
        pageHint: "S. 165-176",
        pageNumber: 170,
        passageLabel: "Hilfe annehmen oder ablehnen",
        context:
          "Im Krankenhaus prallen Wahrheit und Verdrängung frontal aufeinander. Ida übernimmt für einen Moment die klarste, erwachsenste Position im Raum.",
        signalWords: ["Entgiftung", "Klinik", "wir schaffen es ohne dich und mit dir", "na, meine Mäuschen"],
        prompts: [
          "Wie zeigt die Passage, dass sich die Familienrollen weiter verschieben?",
          "Warum ist Idas vorbereitete Ansprache so stark?",
          "Wie reagiert die Mutter sprachlich auf Verantwortung und Wahrheit?"
        ],
        writingFrame:
          "Die Szene ist zentral, weil sie Hilfe nicht als Geschenk, sondern als ... verhandelt.",
        relatedTheoryIds: ["familienrollen", "sprache-koerper"]
      },
      {
        id: "aufbruch-2",
        title: "Wohnung regeneriert, Herbstluft, neues Gewicht",
        pageHint: "S. 177-186",
        pageNumber: 182,
        passageLabel: "Erleichterung ohne Erlösung",
        context:
          "Nach dem Fieber und der Reinigung beschreibt Tilda ein neues Körpergefühl. Die Wohnung, der Herbst und Viktors Anwesenheit lassen etwas leichter werden, ohne die Lage zu verharmlosen.",
        signalWords: ["regeneriert", "Altweibersommer", "Magie", "mehr Platz", "frische Bettwäsche"],
        prompts: [
          "Wie stellt der Roman Erleichterung körperlich und atmosphärisch dar?",
          "Warum bleibt die Passage trotz des leichteren Tons vorsichtig?",
          "Welche Rolle spielt der Herbst als Gegenbild zur vorherigen Hitze und Überforderung?"
        ],
        writingFrame:
          "Die Passage zeigt Entlastung, aber keine einfache Lösung, weil ...",
        relatedTheoryIds: ["sprache-koerper", "wasser-motivik"]
      },
      {
        id: "aufbruch-3",
        title: "Libellenwissen und neue Gefühle",
        pageHint: "S. 187-198",
        pageNumber: 192,
        passageLabel: "Naturwissen als Liebessprache",
        context:
          "Das Libellenwissen wirkt zunächst schräg und komisch, wird dann aber zum Bild für Tildas eigene Veränderung. Die Passage verbindet Naturbeobachtung mit dem Zulassen von Nähe.",
        signalWords: ["Libelle", "Jäger", "95%", "Opsine", "keine Angst"],
        prompts: [
          "Warum ist die Libellenpassage mehr als eine schrullige Wissensszene?",
          "Wie wird das Naturwissen in Beziehungssprache übersetzt?",
          "Worin liegt die Verbindung zwischen Libellen, Jagd, Bewegung und Tildas Gefühlen?"
        ],
        writingFrame:
          "Die Libelle wird zum Leitbild, weil sie Tildas neue Bewegung zwischen ... und ... spiegelt.",
        relatedTheoryIds: ["wasser-motivik", "sprache-koerper"]
      },
      {
        id: "aufbruch-4",
        title: "Das Bild, das Schiff und das offene Wiederkommen",
        pageHint: "S. 199-208",
        pageNumber: 204,
        passageLabel: "Kein Schlussstrich",
        context:
          "Idas Bild vom Schiff und der Ritterin bringt das Ende symbolisch auf den Punkt: Hilfe, Lotsenrolle, Abschied und Wiederkehr bleiben offen. Dass der Roman mit `Schwimmbad?` schließt, bindet alles an die Bewegung zurück.",
        signalWords: ["Schiff", "Lotsen", "Ich brauche Hilfe", "Bis bald", "Schwimmbad"],
        prompts: [
          "Wie bündelt Idas Bild die offenen Zukunftsfragen des Romans?",
          "Warum ist Viktors Abschied kein klassischer Schluss?",
          "Welche Wirkung hat es, dass der Roman in eine neue Schwimmbadbewegung zurückführt?"
        ],
        writingFrame:
          "Das Ende überzeugt, weil es Offenheit nicht als Mangel, sondern als ... gestaltet.",
        relatedTheoryIds: ["wasser-motivik", "perspektive", "familienrollen"]
      }
    ]
  }
];

export const lessonSets = [
  {
    id: "lesson-01-alltag-und-kasse",
    title: "Lektion 1 · Listen, Preise, Taktung",
    summary:
      "Der Romanauftakt macht Tildas Alltag als kontrollierte Hochleistungsroutine sichtbar.",
    chapterMedia: [
      {
        src: coverImg,
        alt: "Cover von 22 Bahnen",
        title: "Auftakt zwischen Leichtigkeit und Druck",
        caption:
          "Das Cover passt hier als Startbild, weil der Roman früh zwischen sommerlicher Oberfläche und innerer Anspannung arbeitet.",
        focusPrompt:
          "Wie viel Leichtigkeit trägt der Auftakt wirklich, und wo wird der Druck schon im ersten Kapitel spürbar?"
      }
    ],
    entryIds: ["routine-1", "routine-2"],
    moduleIds: ["routine"],
    reviewFocus: "Achte auf Listenstil, Taktung, Kontrolle und erste Signale von Überforderung.",
    sebPrompt:
      "Analysiere den Auftakt des Romans. Zeige am Wortlaut, wie Tildas Selbststeuerung früh als notwendige Überlebensstrategie erscheint."
  },
  {
    id: "lesson-02-schwimmen-und-blicke",
    title: "Lektion 2 · 22 Bahnen, Stille und Schock",
    summary:
      "Das Schwimmbad wird als Ordnungsraum eingeführt und kippt dann in Erinnerung, Beobachtung und Irritation.",
    chapterMedia: [
      {
        src: coverImg,
        alt: "Cover von 22 Bahnen",
        title: "Das Wasser als Ordnungsraum",
        caption:
          "Schon in der Titelformel steckt das Versprechen von Ordnung. Die Passage zeigt, wie brüchig diese Ordnung zugleich bleibt.",
        focusPrompt:
          "Arbeite heraus, wie die 22 Bahnen Halt geben und zugleich etwas Zwanghaftes haben."
      }
    ],
    entryIds: ["routine-3", "routine-4"],
    moduleIds: ["routine"],
    reviewFocus: "Arbeite am Wasser-Motiv, an Blickregie und am Umschlag von Ruhe in Erinnerungsschock.",
    sebPrompt:
      "Zeige, wie das Schwimmbad in den frühen Passagen zugleich Schutzraum, Beobachtungsraum und Auslöser der Vergangenheit wird.",
    recommendedTheoryIds: ["wasser-motivik", "perspektive"],
    resourceAssignments: [
      {
        resourceId: "wasser-motivik",
        title: "Motivauftrag: Was leisten die 22 Bahnen?",
        summary:
          "Das Dossier hilft, Schwimmen, Zählen, Tauchen und spätere Meeresbilder als zusammenhängendes Motivfeld zu lesen.",
        task:
          "Nutze das Wasser-Dossier und zeige, wie die frühen Schwimmbadpassagen bereits die spätere Krisen- und Rettungsmotivik vorbereiten.",
        questions: [
          "Welche Funktion hat das Zählen der Bahnen genau?",
          "Wo ist Wasser schon früh mehr als Entspannung?",
          "Wie kündigt sich die spätere Ambivalenz des Wassers hier bereits an?"
        ]
      }
    ]
  },
  {
    id: "lesson-03-zuhause-und-ida",
    title: "Lektion 3 · Zuhause, Scham und Fürsorge",
    summary:
      "Die Wohnung und das abendliche Essen zeigen, wie sehr Tilda längst Verantwortung übernommen hat.",
    chapterMedia: [
      {
        src: authorImg,
        alt: "Autorinnenfoto Caroline Wahl",
        title: "Nüchterne Nähe",
        caption:
          "Für diese Lektion ist die Autorinnenpräsenz hilfreich, weil der Roman Schwere sehr knapp, aber nie kalt erzählt.",
        focusPrompt:
          "Woran merkt man in diesen Passagen, dass knappe Sprache gerade Nähe und nicht Distanz erzeugen kann?"
      }
    ],
    entryIds: ["familie-1", "familie-2"],
    moduleIds: ["familie"],
    reviewFocus: "Achte auf Parentifizierung, Scham, Zärtlichkeit und die unspektakuläre Form von Fürsorge.",
    sebPrompt:
      "Arbeite heraus, wie die Familienszenen Verantwortung, Verwahrlosung und Schwesterntreue zusammenführen, ohne sentimental zu werden."
  },
  {
    id: "lesson-04-krieg-da-draussen",
    title: "Lektion 4 · Nacht, Kleinstadt und Gegenräume",
    summary:
      "Tilda sucht Atemräume, aber jeder Gegenraum bleibt durch Familie und Enge bedroht.",
    chapterMedia: [
      {
        src: authorImg,
        alt: "Autorinnenfoto Caroline Wahl",
        title: "Beobachten als Schutz",
        caption:
          "Die Lektion eignet sich, um Tildas genaue Wahrnehmung als Form des Selbstschutzes zu lesen.",
        focusPrompt:
          "Wie macht der Roman Gegenräume erfahrbar, ohne die strukturelle Enge der Lebenslage auszublenden?"
      }
    ],
    entryIds: ["familie-3", "familie-4"],
    moduleIds: ["familie"],
    reviewFocus: "Arbeite an Perspektive, Kriegsmetapher, Raumdarstellung und Idas Figur.",
    sebPrompt:
      "Untersuche, wie Wahl Nacht, Regen, Kleinstadt und Geschwisteralltag dazu nutzt, Tildas Lebenslage räumlich und körperlich lesbar zu machen.",
    recommendedTheoryIds: ["perspektive", "familienrollen"],
    resourceAssignments: [
      {
        resourceId: "perspektive",
        title: "Perspektivauftrag: Wie filtert Tilda die Welt?",
        summary:
          "Das Dossier zeigt, wie Tildas Ich-Erzählung Nähe ermöglicht und zugleich Schutzmechanismen aktiviert.",
        task:
          "Nutze das Perspektiv-Dossier, um eine der beiden Passagen als gefilterte Wahrnehmung zu lesen. Zeige, was Tilda sehr genau sieht und was sie sprachlich eher wegdrückt.",
        questions: [
          "Wo ist Tilda besonders präzise?",
          "Wo weicht sie aus oder verkürzt?",
          "Wie prägt dieser Filter deine Deutung?"
        ]
      }
    ]
  },
  {
    id: "lesson-05-viktor-erscheint",
    title: "Lektion 5 · Viktor im Wasser",
    summary:
      "Viktors Auftauchen macht aus dem Schwimmbad einen Raum von Irritation, Anziehung und Vergleich.",
    chapterMedia: [
      {
        src: coverImg,
        alt: "Cover von 22 Bahnen",
        title: "Bewegung und Gegenbewegung",
        caption:
          "Die Lektion zeigt, wie ein einziger anderer Körperrhythmus Tildas Innenwelt destabilisieren kann.",
        focusPrompt:
          "Welche Rolle spielt Viktors Bewegung für Tildas Wahrnehmung und Begehren?"
      }
    ],
    entryIds: ["viktor-1", "viktor-2"],
    moduleIds: ["viktor"],
    reviewFocus: "Achte auf Blickregie, Projektionsflächen und die langsame Aufladung von Viktors Figur.",
    sebPrompt:
      "Zeige, wie der Roman Viktors Auftreten weniger über direkte Erklärung als über Beobachtung, Gerücht und Körperrhythmus gestaltet."
  },
  {
    id: "lesson-06-vergangenheit-und-schuld",
    title: "Lektion 6 · Ivan, Erinnerung und verschobene Nähe",
    summary:
      "Mit Ivan kehrt die Vergangenheit zurück und bindet jede neue Nähe an Schuld und Schweigen.",
    chapterMedia: [
      {
        src: authorImg,
        alt: "Autorinnenfoto Caroline Wahl",
        title: "Erinnerung als offener Riss",
        caption:
          "Die Lektion rückt ins Zentrum, dass die Liebesgeschichte nie unbelastet erzählt wird.",
        focusPrompt:
          "Wie hält der Roman neue Nähe und alte Verletzung gleichzeitig offen?"
      }
    ],
    entryIds: ["viktor-3", "viktor-4"],
    moduleIds: ["viktor"],
    reviewFocus: "Arbeite an Schuld, Erinnerung, Ortsbedeutung und Tildas Schweigen gegenüber Viktor.",
    sebPrompt:
      "Analysiere, wie Ivan in den Roman hineinragt und warum Viktors Nähe deshalb immer auch eine Konfrontation mit der Vergangenheit bleibt.",
    recommendedTheoryIds: ["familienrollen", "inputvideo-1"],
    resourceAssignments: [
      {
        resourceId: "inputvideo-1",
        title: "Vergleichsauftrag: Externe Lesart gegen den Text prüfen",
        summary:
          "Der erste Videoimpuls dient hier als Außenperspektive auf Figurendynamik und Romanzugang.",
        task:
          "Vergleiche eine Deutung aus dem Video mit den Ivan-Viktor-Passagen. Arbeite heraus, was der Text komplexer macht als eine glatte Außenlesart.",
        questions: [
          "Welchen Schwerpunkt setzt das Video?",
          "Passt dieser Schwerpunkt zur Passage?",
          "Wo würdest du aus Textgründen widersprechen?"
        ]
      }
    ]
  },
  {
    id: "lesson-07-koerper-unter-druck",
    title: "Lektion 7 · Panik und Rollenlast",
    summary:
      "Körperlicher Kontrollverlust und Alltagsüberforderung zeigen dieselbe Grundspannung in zwei verschiedenen Formen.",
    chapterMedia: [
      {
        src: coverImg,
        alt: "Cover von 22 Bahnen",
        title: "Druck, bevor er explodiert",
        caption:
          "Die Lektion verbindet akute Panik mit dauerhafter Rollenbelastung.",
        focusPrompt:
          "Zeige, wie der Roman denselben Druck einmal als Ausnahmezustand und einmal als Alltag organisiert."
      }
    ],
    entryIds: ["belastung-1", "belastung-2"],
    moduleIds: ["belastung"],
    reviewFocus: "Achte auf Körperbilder, Hitze, Wasser, Lakonie und Mehrfachbelastung.",
    sebPrompt:
      "Untersuche, wie Wahl Kontrollverlust und Dauerüberforderung sprachlich so gestaltet, dass beide als Varianten derselben Lebenslage erscheinen."
  },
  {
    id: "lesson-08-berlin-oder-bleiben",
    title: "Lektion 8 · Depression, Zukunft und Abwehr",
    summary:
      "Die Tischszenen und die Berlin-Debatte bündeln Tildas Wunsch nach Aufbruch mit ihrer Bindung an Ida.",
    chapterMedia: [
      {
        src: authorImg,
        alt: "Autorinnenfoto Caroline Wahl",
        title: "Konflikt ohne melodramatische Kulisse",
        caption:
          "Die Härte dieser Lektion liegt gerade darin, dass alles in alltäglichen Gesten und Sätzen verhandelt wird.",
        focusPrompt:
          "Wie arbeitet der Roman mit scheinbar kleinen Sätzen, die enorme familiäre Folgen tragen?"
      }
    ],
    entryIds: ["belastung-3", "belastung-4"],
    moduleIds: ["belastung"],
    reviewFocus: "Arbeite an depressiver Leere, Rollenverschiebung und Tildas blockierter Zukunft.",
    sebPrompt:
      "Zeige, wie die späten Familienszenen Depression, Schuldzuweisung und Tildas Emanzipationswunsch ineinander schieben.",
    recommendedTheoryIds: ["familienrollen", "sprache-koerper"],
    resourceAssignments: [
      {
        resourceId: "sprache-koerper",
        title: "Sprachauftrag: Wie schreibt Wahl Belastung?",
        summary:
          "Das Dossier fokussiert Lakonie, Körpernähe und die genaue Dosierung von Witz und Schmerz.",
        task:
          "Nutze das Sprach-Dossier, um zu zeigen, wie in einer der beiden Passagen gerade knappe, nüchterne Formulierungen die Belastung steigern.",
        questions: [
          "Welches sprachliche Muster fällt auf?",
          "Wie verbindet der Roman Körper und Psyche?",
          "Wodurch wirkt die Szene härter als eine pathetische Klage?"
        ]
      }
    ]
  },
  {
    id: "lesson-09-notfall",
    title: "Lektion 9 · Überdosis und Notfallwissen",
    summary:
      "Die Mutterkrise macht sichtbar, wie vorbereitet die beiden Schwestern auf den Ausnahmefall längst sind.",
    chapterMedia: [
      {
        src: coverImg,
        alt: "Cover von 22 Bahnen",
        title: "Stillstand im Wohnzimmer",
        caption:
          "Die Lektion lebt vom Bruch: Aus Pizza und Kälte wird sofort medizinischer Ernst.",
        focusPrompt:
          "Wie organisiert der Roman diesen Bruch, ohne an Genauigkeit zu verlieren?"
      }
    ],
    entryIds: ["krise-1", "krise-2"],
    moduleIds: ["krise"],
    reviewFocus: "Achte auf Protokollsprache, Kindheit im Notfall und die Härte routinierter Fürsorge.",
    sebPrompt:
      "Analysiere die Überdosis-Szenen. Zeige, wie Wahl Schock über präzise Abläufe, Rollenwissen und Geschwisterkoordination schreibt."
  },
  {
    id: "lesson-10-fieber-und-rettung",
    title: "Lektion 10 · Fieber, Meer und Seemann",
    summary:
      "Im Fieber bündeln sich Vaterverlust, Wasserangst und Rettungssehnsucht, bis Viktor diese Bilder real unterläuft.",
    chapterMedia: [
      {
        src: authorImg,
        alt: "Autorinnenfoto Caroline Wahl",
        title: "Traum und Wirklichkeit verschränken sich",
        caption:
          "Die Lektion zeigt, wie stark der Roman symbolisch werden kann, ohne seine Körpernähe zu verlieren.",
        focusPrompt:
          "Welche Bilder aus dem Fiebertraum kehren in der realen Pflege durch Viktor verändert wieder?"
      }
    ],
    entryIds: ["krise-3", "krise-4"],
    moduleIds: ["krise"],
    reviewFocus: "Arbeite am Meer-Motiv, an Vaterverlust und an Viktors Rettungsfunktion.",
    sebPrompt:
      "Untersuche, wie Fiebertraum und reale Fürsorge ineinandergreifen und warum Wasser- und Rettungsbilder hier den inneren Roman-Kern freilegen.",
    recommendedTheoryIds: ["wasser-motivik", "inputvideo-2"],
    resourceAssignments: [
      {
        resourceId: "inputvideo-2",
        title: "Vergleichsauftrag: Gesamtdeutung gegen Traumlogik prüfen",
        summary:
          "Der zweite Videoimpuls dient als Außenblick auf Symbolik und Figurenbeziehungen.",
        task:
          "Vergleiche die Fieber- und Rettungspassagen mit einer Deutungsbewegung aus dem Video. Prüfe, ob der Text komplexer oder offener bleibt als die Außenlesart.",
        questions: [
          "Welche Lesart legt das Video nahe?",
          "Stützt der Text diese Lesart wirklich?",
          "Wo bleibt der Roman widerständig?"
        ]
      }
    ]
  },
  {
    id: "lesson-11-nach-der-krise",
    title: "Lektion 11 · Hilfe, Herbst und Entlastung",
    summary:
      "Ida gewinnt Handlungsmacht, die Mutter verweigert Hilfe, und Tilda erlebt dennoch erstmals echte Entlastung.",
    chapterMedia: [
      {
        src: coverImg,
        alt: "Cover von 22 Bahnen",
        title: "Leichter, aber nicht erledigt",
        caption:
          "Die Lektion markiert keinen Happy End-Punkt, sondern eine glaubwürdige Verschiebung von Gewicht.",
        focusPrompt:
          "Woran merkt man, dass etwas leichter wird, ohne dass die Probleme damit verschwinden?"
      }
    ],
    entryIds: ["aufbruch-1", "aufbruch-2"],
    moduleIds: ["aufbruch"],
    reviewFocus: "Achte auf Hilfeverweigerung, Idas neue Stimme, Atmosphäre und vorsichtige Entlastung.",
    sebPrompt:
      "Zeige, wie der Roman nach der Krise zwischen realistischer Härte und neuer Leichtigkeit balanciert, ohne seine Ambivalenzen zu verlieren."
  },
  {
    id: "lesson-12-libellen-und-offenes-ende",
    title: "Lektion 12 · Libellen, Schiff und Wiederkommen",
    summary:
      "Das Ende bindet neue Gefühle, offene Zukunft und das Bewegungsmotiv der 22 Bahnen zusammen.",
    chapterMedia: [
      {
        src: authorImg,
        alt: "Autorinnenfoto Caroline Wahl",
        title: "Offenheit als Schlussform",
        caption:
          "Die letzte Lektion zeigt, dass `22 Bahnen` seinen Schluss bewusst offen und beweglich hält.",
        focusPrompt:
          "Warum passt Offenheit besser zu diesem Roman als ein sauber verriegelter Abschluss?"
      }
    ],
    entryIds: ["aufbruch-3", "aufbruch-4"],
    moduleIds: ["aufbruch"],
    reviewFocus: "Arbeite an Libellenmotiv, Symbolik des Schiffs und der offenen Schlussbewegung.",
    sebPrompt:
      "Analysiere, wie das Ende von `22 Bahnen` Naturwissen, Liebe, Lotsenbild und erneute Schwimmbewegung zu einer offenen, aber tragfähigen Schlussform verbindet.",
    recommendedTheoryIds: ["wasser-motivik", "inputvideo-3", "materialpool"],
    resourceAssignments: [
      {
        resourceId: "inputvideo-3",
        title: "Vergleichsauftrag: Schlussdeutung spiegeln",
        summary:
          "Der dritte Videoimpuls eignet sich, um das offene Ende gegen eine fremde Gesamtdeutung zu prüfen.",
        task:
          "Nutze das Video, um deine Lesart des Schlusses zu schärfen. Halte fest, ob die Außenperspektive dem Romanende gerecht wird oder es zu eindeutig festlegt.",
        questions: [
          "Welche Schlussdeutung bietet das Video an?",
          "Bleibt der Roman im Text offener als das Video?",
          "Was würdest du am Ende ausdrücklich ambivalent lassen?"
        ]
      },
      {
        resourceId: "materialpool",
        title: "Abschlussauftrag: Externe Inputs bündeln",
        summary:
          "Zum Schluss sollen die verlinkten Zusatzmaterialien nicht nebeneinander stehen bleiben, sondern bewusst gegen den Roman gelesen werden.",
        task:
          "Wähle aus dem Materialpool ein Zusatzmedium und vergleiche es mit dem Ende des Romans. Zeige, wie deine eigene Lektüre dadurch klarer, nuancierter oder auch widerständiger wird.",
        questions: [
          "Welches Zusatzmaterial passt am besten zum Ende?",
          "Welche Deutung bestätigt sich?",
          "Welche Ambivalenz des Romans verteidigst du gegen zu glatte Außenlesarten?"
        ]
      }
    ]
  }
];

export const starterPrompt = {
  title: "Arbeitsauftrag",
  items: [
    "Arbeite den Roman entlang von zwölf eng geführten Lektionen im eingebetteten PDF durch und notiere Beobachtungen immer passagennah.",
    "Sichere zuerst ein Textsignal: Wortlaut, Bild, Blick, Liste, Dialogzeile, Körperreaktion oder Motivbewegung.",
    "Nutze pro Passage mindestens eine Linse: Perspektive, Wasser-Motivik, Familienrollen, Sprache/Körper oder die externen Vergleichsmaterialien.",
    "Verwende die drei YouTube-Impulse und den Dropbox-Materialpool nicht als Musterlösung, sondern als Vergleichsfolie für deine eigene Deutung.",
    "Halte im Revisionsfeld fest, was du nach erneuter Lektüre, nach Feedback oder nach einem Materialvergleich noch präzisieren würdest.",
    "Achte besonders auf Tilda, Ida, Mutter, Viktor, Ivan, die 22 Bahnen, Wasserbilder, Fürsorge und offene Zukunftsbewegungen."
  ]
};

export const pdfSource = pdfPath;

export const readerModules = [
  {
    id: "kapelle",
    title: "Wärterhäuschen und Minna",
    lens: "Raum, Ritual, Erinnerung",
    briefing: "Arbeite direkt im eingebetteten PDF zu den Stellen, an denen das Wärterhäuschen zum Erinnerungs- und Andachtsraum wird.",
    task: "Untersuche, wie Arbeitsraum, Religion und Trauer bei Thiel räumlich und sprachlich ineinandergreifen.",
    entries: [
      {
        id: "kapelle-1",
        title: "Das Wärterhäuschen als Erinnerungsraum",
        pageHint: "S. 9",
        pageNumber: 9,
        passageLabel: "Raum und Minnas Andenken",
        context:
          "Thiel trennt seinen Alltag von einem inneren Raum ab, der ganz Minna gehört. Der Ort ist nicht mehr nur funktional, sondern emotional aufgeladen und fast sakral umgedeutet.",
        signalWords: ["Photographie", "Gesangbuch", "Bibel", "Kapelle"],
        prompt:
          "Zeige, wie konkrete Gegenstände die Erinnerung an Minna materialisieren und warum diese Dinge mehr als bloße Requisiten sind."
      },
      {
        id: "kapelle-2",
        title: "Ekstase statt nüchterner Pflichterfüllung",
        pageHint: "S. 10",
        pageNumber: 10,
        passageLabel: "Nacht, Lesen, Visionen",
        context:
          "In seinen nächtlichen Ritualen gerät Thiel aus der kontrollierten Routine heraus. Lesen und Singen kippen in Visionen und öffnen eine zweite Wirklichkeit.",
        signalWords: ["Ekstase", "Gesichte", "tiefe Mitternacht", "Tote"],
        prompt:
          "Erkläre, wie der Text aus einem religiösen Ritual eine psychische Grenzerfahrung macht."
      },
      {
        id: "kapelle-3",
        title: "Lene bleibt draußen",
        pageHint: "S. 9",
        pageNumber: 9,
        passageLabel: "Abgrenzung gegen Lene",
        context:
          "Thiel markiert das Wärterhäuschen innerlich als verbotene Zone für Lene. Dadurch werden Erinnerung und Gegenwart, Minna und Lene scharf voneinander getrennt.",
        signalWords: ["geheiligtes Land", "ausschließlich", "Tote", "gewidmet"],
        prompt:
          "Analysiere, wie die räumliche Abgrenzung die spätere innere Spaltung der Figur vorbereitet."
      }
    ]
  },
  {
    id: "traum",
    title: "Traum, Vorahnung, Entgrenzung",
    lens: "Wahrnehmung, Angst, Katastrophe",
    briefing: "Navigiere im PDF direkt in die Unfallszene und lies, wie Traum und Wirklichkeit ineinanderkippen.",
    task: "Arbeite textnah heraus, wie der Text Wahrnehmungsstörung und Katastrophe sprachlich vorbereitet.",
    entries: [
      {
        id: "traum-1",
        title: "Minnas Erscheinung auf den Schienen",
        pageHint: "S. 36",
        pageNumber: 36,
        passageLabel: "Minnas Erscheinung",
        context:
          "Kurz vor der Katastrophe erscheint Minna in Thiels Wahrnehmung auf den Gleisen. Die Erscheinung bleibt körperlich beschädigt, blass und zugleich zwingend real.",
        signalWords: ["verstorbene Frau", "schlaff", "blutig", "bleich"],
        prompt:
          "Beschreibe, wie der Text die Erscheinung zugleich geisterhaft und körperlich konkret macht."
      },
      {
        id: "traum-2",
        title: "Traum und Wirklichkeit verschmelzen",
        pageHint: "S. 37",
        pageNumber: 37,
        passageLabel: "Verschmelzung der Ebenen",
        context:
          "Nach dem Erwachen bleibt die Trennung zwischen innerem Bild und äußerer Realität instabil. Dadurch verliert Thiel für entscheidende Momente seine Sicherheit als Beobachter.",
        signalWords: ["verschmolzen", "Wirklichkeit", "Angst", "Grauen"],
        prompt:
          "Erkläre, warum diese Verschmelzung für die Unfallszene mehr ist als bloße Vorahnung."
      },
      {
        id: "traum-3",
        title: "Der heranrasende Zug",
        pageHint: "S. 37",
        pageNumber: 37,
        passageLabel: "Technik und Überforderung",
        context:
          "Der Zug ist nicht nur äußere Gefahr, sondern trifft auf eine Figur, deren Wahrnehmung bereits destabilisiert ist. Dadurch wird Technik mit psychischer Überforderung gekoppelt.",
        signalWords: ["rasender Zug", "Stehen bringen", "Grauen", "Angst"],
        prompt:
          "Arbeite heraus, wie Natur, Technik und Innenwelt in dieser Szene zusammenspielen."
      }
    ]
  },
  {
    id: "lene",
    title: "Lene, Tobias und Verdrängung",
    lens: "Schuld, Passivität, Gewalt",
    briefing: "Nutze die Passage-Navigation, um Lenes Härte und Thiels Passivität direkt am Wortlaut zu untersuchen.",
    task: "Untersuche, wie Thiels Passivität und Schuld nicht nur behauptet, sondern in einzelnen Beobachtungen sichtbar gemacht werden.",
    entries: [
      {
        id: "lene-1",
        title: "Die Belauschungsszene",
        pageHint: "S. 21-22",
        pageNumber: 21,
        passageLabel: "Lene gegen Tobias",
        context:
          "Thiel hört Lenes Brutalität gegenüber Tobias, reagiert aber nicht mit entschlossener Gegenwehr. Die Szene zeigt nicht nur Mitgefühl, sondern auch lähmende Ohnmacht.",
        signalWords: ["herzloser Schuft", "zittern", "es ließ nach", "kaum"],
        prompt:
          "Zeige, wie der Text Thiels aufsteigende Wut sofort wieder zurücknimmt und warum das moralisch wichtig ist."
      },
      {
        id: "lene-2",
        title: "Spuren der Misshandlung",
        pageHint: "S. 22",
        pageNumber: 22,
        passageLabel: "Körperliche Zeichen",
        context:
          "Spätere körperliche Zeichen an Tobias machen Lenes Gewalt sichtbar. Trotzdem handelt Thiel nicht konsequent, sondern bleibt in Abhängigkeit und Verdrängung gefangen.",
        signalWords: ["Fingerspuren", "abhängig", "ohne umzuschauen"],
        prompt:
          "Erkläre, wie der Text aus kleinen Beobachtungen ein Schuldmuster entstehen lässt."
      },
      {
        id: "lene-3",
        title: "Thiels Abhängigkeit",
        pageHint: "S. 9",
        pageNumber: 9,
        passageLabel: "Frühe Vorzeichnung",
        context:
          "Schon früh beschreibt der Text Thiels Abhängigkeit von Lene als beinahe total. Damit wird die spätere Passivität nicht entschuldigt, aber psychologisch vorbereitet.",
        signalWords: ["unbedingt abhängig", "Alltag", "Härte", "Verdrängung"],
        prompt:
          "Analysiere, wie Abhängigkeit und moralisches Versagen zusammenhängen."
      }
    ]
  },
  {
    id: "schluss",
    title: "Zusammenbruch und Deutung",
    lens: "Wahnsinn, Ende, Gesamtdeutung",
    briefing: "Springe im PDF in die Schlussbewegung und verbinde einzelne Signale zu einer Gesamtdeutung.",
    task: "Formuliere eine Deutungshypothese zum Schluss und stütze sie auf mindestens zwei konkrete Beobachtungen aus dem Wortlaut.",
    entries: [
      {
        id: "schluss-1",
        title: "Nach Tobias' Tod",
        pageHint: "S. 38-39",
        pageNumber: 38,
        passageLabel: "Schock und Erstarrung",
        context:
          "Nach Tobias' Tod bricht Thiels fragile Selbstkontrolle zusammen. Die letzten Wahrnehmungen des Unfalls wirken weiter und treiben ihn in eine endgültige psychische Zerstörung.",
        signalWords: ["nicht sprechen", "erstarrt", "leblos", "Zusammenbruch"],
        prompt:
          "Erkläre, wie der Text innere Leere und Schock körperlich sichtbar macht."
      },
      {
        id: "schluss-2",
        title: "Gewalt als entgrenzter Endpunkt",
        pageHint: "S. 39-40",
        pageNumber: 39,
        passageLabel: "Tat und Eskalation",
        context:
          "Die Gewalttat gegen Lene und das Kind erscheint nicht als isolierter Affekt, sondern als Endpunkt einer lange vorbereiteten inneren Spaltung aus Schuld, Wahn und Verdrängung.",
        signalWords: ["Wahnsinn", "Tat", "Kind", "Schuld"],
        prompt:
          "Arbeite heraus, warum der Schluss nicht nur Schock, sondern auch Konsequenz der vorherigen Entwicklung ist."
      },
      {
        id: "schluss-3",
        title: "Warum heißt der Text nicht nach dem Mord?",
        pageHint: "Gesamtdeutung",
        pageNumber: 40,
        passageLabel: "Titel und Gesamtfigur",
        context:
          "Der Titel lenkt den Blick auf die Figur in ihrer sozialen Rolle, nicht nur auf die einzelne Tat. So werden Arbeit, Ordnung und Zusammenbruch von Anfang an zusammen gelesen.",
        signalWords: ["Bahnwärter", "Rolle", "Ordnung", "Zusammenbruch"],
        prompt:
          "Formuliere eine knappe Gesamtdeutung dazu, warum der Titel die Katastrophe schon vorwegnimmt."
      }
    ]
  }
];

export const starterPrompt = {
  title: "Arbeitsauftrag",
  items: [
    "Nutze die Passage-Navigation und lies die markierten Seiten direkt im eingebetteten PDF.",
    "Notiere zuerst eine Beobachtung am Wortlaut, dann eine Deutung.",
    "Sichere Schlüsselbegriffe im Feld für Signalwörter oder Wortlaut.",
    "Exportiere am Ende deine Notizen als Markdown."
  ]
};

export const pdfSource = "/reader/assets/bahnwaerter-thiel.pdf";

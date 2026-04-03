const verdammtenVideo =
  "https://www.dropbox.com/scl/fi/ul98jwpg0x64t0jqdbjpv/Die-Reise-der-Verdammten-1.mp4?rlkey=3ipejfcqv65qrpmzko41xgu3g&st=m1i680vb&dl=0";
const verlorenenVideo =
  "https://www.dropbox.com/scl/fi/3h67gy4raonrf1z2deyh9/Die-Reise-der-Verlorenen-to-go-MeinSenf-Kehlmann-in-11-Minuten.mp4?rlkey=2e7ccsnjmphtu1haovcpwou75&st=gqx92xef&dl=0";
const geschichteVideo =
  "https://www.dropbox.com/scl/fi/eex00kfd2kpd86g4zddyo/Daniel-Kehlmann-was-ist-eine-gute-Geschichte-Interviewpodcast-Alles-gesagt.mp4?rlkey=tel4p06cf7eqtahp7eicx5kx1&st=a4rikz4e&dl=0";
const dokumentartheaterVideo =
  "https://www.dropbox.com/scl/fi/ux8nsigllc9o8knwzxzxb/Dokumentartheater-Deutsch-Dramatik.mp4?rlkey=nhx1ktv76qjk3gpbl042ktmq6&st=k8v0qr38&dl=0";
const epischesTheaterVideo =
  "https://www.dropbox.com/scl/fi/kcm1eu8mgnalwj5mykxl7/EpischesTheater.mp4?rlkey=vifs3zrdn2qcnf48kv82oq8se&st=f0yzthwx&dl=0";
const steinbruchPdf = "/reader/assets/im-steinbruch-kehlmann.pdf";
const susanneHeimPdf = "/reader/assets/susanne-heim-zwischen-den-grenzen.pdf";
const evianWikipediaUrl = "https://de.wikipedia.org/wiki/Konferenz_von_%C3%89vian";
const evianDeutschlandfunkUrl =
  "https://www.deutschlandfunk.de/jochen-thies-evian-1938-als-die-welt-die-juden-verriet-100.html";
const ndrStLouisUrl =
  "https://www.ndr.de/geschichte/chronologie/Die-Irrfahrt-der-St-Louis-Fluechtlinge-die-keiner-wollte,stlouis126.html";
const ushmmVoyageUrl = "https://encyclopedia.ushmm.org/content/de/article/voyage-of-the-st-louis";
const ushmmReturnUrl = "https://encyclopedia.ushmm.org/content/de/article/return-to-europe-of-the-st-louis";
const ushmmFateUrl = "https://encyclopedia.ushmm.org/content/de/article/wartime-fate-of-the-passengers-of-the-st-louis";
const gerdaBlachmannVideoUrl =
  "https://encyclopedia.ushmm.org/content/en/oral-history/gerda-blachmann-wilchfort-describes-the-mood-of-passengers-on-the-st-louis-after-they-were-denied-entry-into-cuba";
const andruckRssUrl = "https://www.deutschlandfunk.de/andruck-100.xml";
const evianWikipediaDossier = "/reader/assets/evian-konferenz-dossier.html";
const evianDeutschlandfunkDossier = "/reader/assets/evian-deutschlandfunk-dossier.html";
const ndrStLouisDossier = "/reader/assets/ndr-st-louis-dossier.html";
const fritzBuffDossier = "/reader/assets/fritz-buff-reisebericht-dossier.html";
const fritzBuffAudio = "/reader/assets/fritz-buff-soundfile.mp3";
const bilddossierReise = "/reader/assets/bilddossier-reise-und-passagiere.html";
const bilddossierAkteure = "/reader/assets/bilddossier-politische-akteure.html";
const ushmmVoyageDossier = "/reader/assets/ushmm-voyage-dossier.html";
const ushmmReturnDossier = "/reader/assets/ushmm-return-to-europe-dossier.html";
const ushmmFateDossier = "/reader/assets/ushmm-wartime-fate-dossier.html";
const gerdaBlachmannDossier = "/reader/assets/gerda-blachmann-dossier.html";

function asRaw(url) {
  return url.replace("dl=0", "raw=1");
}

export const theoryResources = [
  {
    id: "historischer-kontext",
    title: "Historischer Kontext: Die Reise der Verdammten",
    shortTitle: "Kontext",
    sourceTitle: "Die Reise der Verdammten",
    mediaType: "video",
    openUrl: verdammtenVideo,
    embedUrl: asRaw(verdammtenVideo),
    summary:
      "Diese Linse bündelt die historische Ausgangslage: Flucht, verweigerte Aufnahme, internationale Verantwortungsverschiebung und die realen politischen Konstellationen von 1939.",
    keyIdeas: ["St. Louis", "Flucht", "Aufnahmeverweigerung", "internationale Politik", "historische Verantwortung"],
    questions: [
      "Welche historischen Fakten nutzt das Stück, um die Handlung als reale Katastrophe lesbar zu machen?",
      "Wo zeigt der Text, dass politisches Wegsehen tödliche Folgen hat?",
      "Wie verändert das Wissen um den historischen Hintergrund deine Wahrnehmung der Figuren?"
    ],
    transferPrompts: [
      "Zeige an der Passage, wie individuelle Schicksale mit internationalen Entscheidungen verschränkt werden.",
      "Prüfe, ob die Szene eher dokumentiert, kommentiert oder emotional zuspitzt.",
      "Erkläre, wie historische Realität auf der Bühne in dramatische Form übersetzt wird."
    ],
    writingFrame:
      "Historisch bedeutsam ist die Passage, weil sie zeigt, wie ... nicht nur einzelnen Figuren, sondern einer ganzen Gruppe von Flüchtlingen widerfährt."
  },
  {
    id: "evian-konferenz",
    title: "Historisches Dossier: Die Konferenz von Évian",
    shortTitle: "Évian",
    sourceTitle: "Wikipedia · Konferenz von Évian",
    mediaType: "html",
    openUrl: evianWikipediaUrl,
    embedUrl: evianWikipediaDossier,
    summary:
      "Diese Ressource schärft den historischen Unterbau des Dramas: Évian 1938 steht für internationale Beratungen ohne bindende Aufnahmepolitik und für eine globale Politik der verweigerten Rettung.",
    keyIdeas: ["Évian", "32 Staaten", "Dominikanische Republik", "Aufnahmeverweigerung", "Intergovernmental Committee on Refugees"],
    questions: [
      "Benennen die Struktur von Évian in einem Satz: Wer berät, wer hilft nicht, wer bleibt gefährdet?",
      "Erkläre präzise, warum die Dominikanische Republik historisch auffällt, aber keine wirkliche Lösung darstellt.",
      "Zeige konkret, welche Havanna- oder Rückweg-Passage mit Évian besser verständlich wird."
    ],
    transferPrompts: [
      "Weise an einem Satz der Passage nach, wie Verhandlung ohne Rettung inszeniert wird.",
      "Entscheide klar: zeigt die Szene vor allem Leid, Bürokratie oder internationale Mitschuld?",
      "Verbinde ein konkretes Textsignal der Passage ausdrücklich mit Évian 1938."
    ],
    writingFrame:
      "Mit Évian gelesen, erscheint die Passage nicht als Einzelfall, sondern als Symptom einer internationalen Politik, die ..."
  },
  {
    id: "evian-deutschlandfunk",
    title: "Deutschlandfunk: Evian 1938 und die Sprache des Verrats",
    shortTitle: "DLF Évian",
    sourceTitle: "Deutschlandfunk · Andruck",
    mediaType: "html",
    openUrl: evianDeutschlandfunkUrl,
    embedUrl: evianDeutschlandfunkDossier,
    audioUrl: andruckRssUrl,
    audioLabel: "Andruck-Podcast-RSS öffnen",
    summary:
      "Die Rezension zu Jochen Thies verschiebt den Blick auf die Sprache der Konferenz: kein Land öffnet die Grenzen, Hitler wird nicht klar benannt, und ökonomische Ausreden überlagern die politische Verantwortung.",
    keyIdeas: ["unterschwelliger Antisemitismus", "Flüchtlinge statt Vertriebene", "hohe Arbeitslosigkeit", "kein Land öffnete seine Grenzen", "Nachfolgeorganisation wirkungslos"],
    questions: [
      "Nenne zwei Sprachmuster des Ausweichens, die der Beitrag offenlegt.",
      "Erkläre knapp, warum das Nicht-Benennen Hitlers historisch und rhetorisch wichtig ist.",
      "Zeige an einer diplomatischen Szene, wie aus Sprache politische Unterlassung wird."
    ],
    transferPrompts: [
      "Markiere ein Ausweichsignal in der Passage und erkläre seine Funktion.",
      "Prüfe, wo das Drama Gewalt über Verwaltungs- oder Diplomatensprache sichtbar macht.",
      "Erkläre in einem präzisen Satz, wie die Szene Untätigkeit moralisch lesbar macht."
    ],
    writingFrame:
      "Mit dem Deutschlandfunk-Beitrag wird sichtbar, dass die Passage nicht nur von gescheiterter Hilfe erzählt, sondern die Sprache dieser Hilfeverweigerung offenlegt."
  },
  {
    id: "susanne-heim-grenzen",
    title: "Susanne Heim: „Die Menschen irrten zwischen den Grenzen hin und her“",
    shortTitle: "Susanne Heim",
    sourceTitle: "Republik · Susanne Heim",
    mediaType: "pdf",
    openUrl: susanneHeimPdf,
    embedUrl: susanneHeimPdf,
    summary:
      "Der Text vertieft die Frage nach Grenzregimen, internationalen Abwehrmechanismen und der historischen Erfahrung, zwischen Transit, Blockade und Zuständigkeitsverschiebung festzusitzen.",
    keyIdeas: ["Grenzregime", "Transit", "Zwischenräume", "staatliche Abwehr", "historische Bewegungszwänge"],
    questions: [
      "Bestimme die Grenzlogik der Quelle möglichst genau: Grenze als Linie, Verfahren oder Machtordnung?",
      "Erkläre knapp, wie die Quelle das Hin- und Hergeschobenwerden beschreibt.",
      "Zeige an einer Passage, wie das Drama Transit ohne Ankunft inszeniert."
    ],
    transferPrompts: [
      "Verbinde die Passage mit einer präzisen Beobachtung aus dem Republik-Text zu Grenze oder Transit.",
      "Entscheide klar: legt die Szene eher Gefühl, Bürokratie oder Geopolitik frei?",
      "Erkläre, wie die Quelle eine bloß individuelle Deutung der Passage korrigiert."
    ],
    writingFrame:
      "Die Quelle von Susanne Heim verschärft die Passage historisch, weil sie zeigt, dass das Hin- und Hergeschobenwerden ..."
  },
  {
    id: "ndr-st-louis",
    title: "NDR-Chronologie: Die Irrfahrt der „St. Louis“",
    shortTitle: "NDR St. Louis",
    sourceTitle: "NDR Geschichte",
    mediaType: "html",
    openUrl: ndrStLouisUrl,
    embedUrl: ndrStLouisDossier,
    summary:
      "Die NDR-Chronologie verdichtet den historischen Ablauf der Reise: Abfahrt in Hamburg, Havanna, Florida, Rückweg, Antwerpen und die europäische Verteilung. Sie hilft, den dramatischen Ablauf als reale Chronologie nachzuvollziehen.",
    keyIdeas: ["13. Mai 1939", "Havanna", "Florida", "Antwerpen", "mehr als 900 Flüchtlinge"],
    questions: [
      "Ordne die Passage eindeutig einer Station der Irrfahrt zu.",
      "Erkläre knapp, wie der Artikel Schröders Handeln von staatlicher Untätigkeit abgrenzt.",
      "Zeige, warum die Reihenfolge Hamburg, Havanna, Florida, Antwerpen für das Drama wichtig ist."
    ],
    transferPrompts: [
      "Ordne die Passage in die Chronologie ein und benenne die verdichtete Phase der Irrfahrt.",
      "Entscheide klar: fokussiert die Szene Passagiere, Schröder oder die Staaten?",
      "Erkläre, wie der historische Überblick aus Einzelbildern einen Katastrophenverlauf macht."
    ],
    writingFrame:
      "Im NDR-Beitrag erscheint die Passage als Teil einer genauen historischen Chronologie, in der ..."
  },
  {
    id: "fritz-buff-reisebericht",
    title: "Primärquelle: Fritz Buffs Reisebericht von Bord der St. Louis",
    shortTitle: "Fritz Buff",
    sourceTitle: "Hamburger Schlüsseldokumente",
    mediaType: "html",
    openUrl: fritzBuffDossier,
    embedUrl: fritzBuffDossier,
    audioUrl: fritzBuffAudio,
    audioLabel: "Soundfile öffnen",
    summary:
      "Die Primärquelle führt in eine unmittelbare Binnenperspektive der Reise. Besonders wichtig: Fritz Buff war erst 17 Jahre alt und reiste allein. Bildseiten, Transkript-Auszüge und Soundfile schärfen, wie Hoffnung, Warten, Gerüchte, politische Entscheidungen und die Angst vor der Rückkehr aus einer zeitgenössischen Passagiersicht erlebt werden.",
    keyIdeas: ["17 Jahre", "allein reisend", "Binnenperspektive", "Havanna", "Florida", "Antwerpen", "Passagiererfahrung"],
    questions: [
      "Benenne präzise zwei Stimmungslagen, die im Bericht aufeinanderprallen.",
      "Erkläre klar, was sich ändert, wenn du die Szene aus Buffs Ich-Perspektive liest.",
      "Wähle eine Formulierung der Quelle und zeige, wie sie deine Dramenlektüre schärft."
    ],
    transferPrompts: [
      "Verbinde die Passage mit einer Beobachtung aus Buffs Bericht und bestimme die gemeinsame Erfahrungsebene.",
      "Entscheide klar: dominiert Binnenperspektive oder politische Übersicht?",
      "Erkläre, wie der Reisebericht eine zu abstrakte Deutung der Passage verhindert."
    ],
    writingFrame:
      "Mit Fritz Buffs Bericht gelesen, wirkt die Passage besonders eindringlich, weil die Quelle zeigt, dass ..."
  },
  {
    id: "bilddossier-reise",
    title: "Bilddossier: Schiff, Kapitän und Passagiere",
    shortTitle: "Bilder Reise",
    sourceTitle: "Historische Bildquellen",
    mediaType: "html",
    openUrl: bilddossierReise,
    embedUrl: bilddossierReise,
    summary:
      "Dieses Bilddossier bündelt die St. Louis in Havanna, Gustav Schröder und die Passagierperspektive. Es hilft, Bordraum, Verantwortung und Familienblick nicht nur textlich, sondern visuell zu erfassen.",
    keyIdeas: ["Schiffsrumpf", "Passagiere", "Schröder", "Havanna", "Blickregie", "Bordraum"],
    questions: [
      "Welches Bild schärft deine aktuelle Passage am stärksten, und warum gerade dieses?",
      "Wie verändert das Schiffs- oder Passagierbild deinen Blick auf Nähe, Enge und Ausgeliefertsein an Bord?",
      "Was zeigt das Porträt Schröders über Verantwortung, Haltung oder Begrenzung seiner Rolle?"
    ],
    transferPrompts: [
      "Verbinde ein Bildelement ausdrücklich mit einer Formulierung aus der Passage.",
      "Entscheide klar: schärft das Bild eher Raum, Figur oder Stimmung?",
      "Erkläre, wie das Bild die Passage konkreter und weniger abstrakt lesbar macht."
    ],
    writingFrame:
      "Das Bild schärft die Passage, weil es sichtbar macht, wie ..."
  },
  {
    id: "bilddossier-akteure",
    title: "Bilddossier: Politische Akteure der Blockade",
    shortTitle: "Bilder Politik",
    sourceTitle: "Historische Porträts",
    mediaType: "html",
    openUrl: bilddossierAkteure,
    embedUrl: bilddossierAkteure,
    summary:
      "Das Bilddossier bündelt zentrale politische Akteure der Krise: Federico Laredo Brú, J. Butler Wright, Cordell Hull, Henry Morgenthau Jr. und Batista. Die Porträts helfen, diplomatische und staatliche Macht im Drama genauer zu verorten.",
    keyIdeas: ["Bru", "Wright", "Hull", "Morgenthau", "Batista", "politische Verantwortung"],
    questions: [
      "Welche Figur des Dossiers steht deiner Passage politisch am nächsten?",
      "Wie verändert ein konkretes Gesicht deine Deutung von Diplomatie, Verhandlung und Unterlassung?",
      "Welche Machtstufe wird durch das Bild sichtbar: Regierung, Diplomatie, Ministerium oder militärischer Einfluss?"
    ],
    transferPrompts: [
      "Ordne die Passage einem Akteur oder Machtfeld des Bilddossiers zu.",
      "Prüfe, ob das Bild eher Entscheidungsmacht, Distanz oder Verantwortungslosigkeit schärft.",
      "Erkläre, wie das Porträt die politische Struktur deiner Passage konkretisiert."
    ],
    writingFrame:
      "Mit dem Bilddossier wird die Passage politisch konkreter, weil hinter der Verhandlung sichtbar wird, dass ..."
  },
  {
    id: "ushmm-voyage",
    title: "USHMM-Dossier: Die Reise der St. Louis",
    shortTitle: "USHMM Reise",
    sourceTitle: "USHMM · Voyage of the St. Louis",
    mediaType: "html",
    openUrl: ushmmVoyageUrl,
    embedUrl: ushmmVoyageDossier,
    summary:
      "Das Dossier schärft die Ausgangslage der Irrfahrt: 937 Passagiere, ungültig erklärte Dokumente, kubanische Machtkämpfe, informierte Behörden und eine Krise, die politisch längst sichtbar war, bevor die Passagiere sie erfuhren.",
    keyIdeas: ["937 Passagiere", "13. Mai 1939", "ungültige Papiere", "Havanna", "informierte Behörden", "sichtbar und ausgeschlossen"],
    questions: [
      "Benenne die drei wichtigsten historischen Vorentscheidungen, die die Reise schon vor Havanna belasten.",
      "Erkläre präzise, warum die USHMM-Seite die Krise nicht als plötzliches Unglück, sondern als politisch bekannte Entwicklung lesbar macht.",
      "Zeige an deiner Passage, wie aus Sichtbarkeit noch keine Aufnahme wird."
    ],
    transferPrompts: [
      "Ordne die Passage eindeutig der Phase vor Havanna, im Hafen oder vor Florida zu und sichere das mit einem Textsignal.",
      "Prüfe, ob die Szene eher Machtkampf, Verwaltungsentscheidung oder Passagiererfahrung verdichtet.",
      "Erkläre, wie die USHMM-Seite eine bloß emotionale Lektüre der Passage historisch schärft."
    ],
    writingFrame:
      "Mit dem USHMM-Dossier gelesen, erscheint die Passage als Teil einer politisch vorbereiteten Krise, weil ..."
  },
  {
    id: "gerda-blachmann",
    title: "Gerda Blachmann: Videostimme vom Schiff",
    shortTitle: "Gerda Video",
    sourceTitle: "USHMM · Oral History",
    mediaType: "html",
    openUrl: gerdaBlachmannVideoUrl,
    embedUrl: gerdaBlachmannDossier,
    summary:
      "Gerda Blachmann Wilchfort erinnert als junge Passagierin Depression, Suizidversuch, Newsletter an Bord, die Lichter von Miami und die Angst vor der Rückkehr. Das Video gibt der St.-Louis-Krise eine dichte Binnenstimme und verbindet Havanna mit späterer Verfolgung.",
    keyIdeas: ["Gerda Blachmann", "Video", "Suizidversuch", "Miami-Lichter", "Newsletter an Bord", "Belgien und Schweiz"],
    questions: [
      "Benenne präzise zwei Beobachtungen, die Gerdas Aussage über die Stimmung an Bord macht.",
      "Erkläre, warum die Miami-Lichter in ihrer Erinnerung mehr als ein Detail der Reise sind.",
      "Zeige, wie Gerdas Videostimme deine Passage gegen eine zu abstrakte historische Lektüre absichert."
    ],
    transferPrompts: [
      "Verbinde ein Detail aus Gerdas Aussage ausdrücklich mit einem Wort, Bild oder Bühnenmoment deiner Passage.",
      "Prüfe, ob Gerda vor allem Angst, Hoffnung oder politisches Warten sichtbar macht.",
      "Erkläre, wie die Oral History den Weg von Havanna zur europäischen Nachgeschichte eröffnet."
    ],
    writingFrame:
      "Gerdas Aussage schärft die Passage, weil ihre Erinnerung zeigt, dass ..."
  },
  {
    id: "ushmm-return-europe",
    title: "USHMM-Dossier: Rückkehr nach Europa und Verteilung",
    shortTitle: "Rückkehr Europa",
    sourceTitle: "USHMM · Return to Europe",
    mediaType: "html",
    openUrl: ushmmReturnUrl,
    embedUrl: ushmmReturnDossier,
    summary:
      "Dieses Dossier macht die Rückkehr nach Europa präzise: 287 Passagiere gingen nach Großbritannien, 224 nach Frankreich, 214 nach Belgien, 181 in die Niederlande. Die Aufnahme blieb provisorisch, an Fragebögen und Lager gekoppelt und ausdrücklich ohne Präzedenzwirkung.",
    keyIdeas: ["287 Großbritannien", "224 Frankreich", "214 Belgien", "181 Niederlande", "provisorisches Asyl", "kein Präzedenzfall"],
    questions: [
      "Ordne die Verteilung der Passagiere auf die vier Aufnahmeländer korrekt zu.",
      "Erkläre klar, warum die Rückkehr nach Europa keine Rettung im starken Sinn ist.",
      "Zeige an deiner Passage, wie das Drama Übergang, Verteilung oder vorläufige Sicherheit inszeniert."
    ],
    transferPrompts: [
      "Verbinde die Passage ausdrücklich mit einem der vier Aufnahmeländer oder mit der Verteilungslogik.",
      "Prüfe, wo die Szene vorläufige Aufnahme statt wirklicher Sicherheit sichtbar macht.",
      "Erkläre, wie aus Verwaltung, Fragebögen und Transporten eine neue Form der Unsicherheit entsteht."
    ],
    writingFrame:
      "Das USHMM-Dossier zeigt, dass die Passage nicht in Rettung mündet, sondern in eine provisorische und gefährdete Verteilung, weil ..."
  },
  {
    id: "ushmm-wartime-fate",
    title: "USHMM-Dossier: Kriegsschicksale der Passagiere",
    shortTitle: "Kriegsschicksale",
    sourceTitle: "USHMM · Wartime Fate",
    mediaType: "html",
    openUrl: ushmmFateUrl,
    embedUrl: ushmmFateDossier,
    summary:
      "Das Dossier verfolgt die Nachgeschichte bis in Internierung, Fluchtwege und Deportation. Von den 620 Passagieren, die auf den Kontinent zurückkehrten, saßen 532 später im besetzten Westeuropa fest; 278 überlebten, 254 starben. Die Familien Seligmann und Hermanns zeigen, wie ungleich die Schicksale verliefen.",
    keyIdeas: ["532 festgesetzt", "278 überlebt", "254 ermordet", "Seligmann", "Hermanns", "1942 versiegende Fluchtwege"],
    questions: [
      "Benenne die drei entscheidenden Zahlen des USHMM-Dossiers korrekt und erkläre ihre Aussagekraft.",
      "Erkläre präzise, was die Gegenüberstellung von Seligmann und Hermanns historisch sichtbar macht.",
      "Zeige an deiner Passage, wie das Drama ein Ende verweigert, weil die Nachgeschichte weiterläuft."
    ],
    transferPrompts: [
      "Verbinde die Passage ausdrücklich mit Internierung, Deportation, untergetauchtem Überleben oder blockierten Fluchtwegen.",
      "Prüfe, ob deine Szene eher Vorausdeutung, Nachgeschichte oder offene Bedrohung trägt.",
      "Erkläre, wie die USHMM-Seite die moralische Schärfe des Schlusses erhöht."
    ],
    writingFrame:
      "Mit dem USHMM-Dossier zu den Kriegsschicksalen gelesen, erhält die Passage ihre volle Härte, weil ..."
  },
  {
    id: "werkueberblick",
    title: "Werküberblick und Dramengang",
    shortTitle: "Werk",
    sourceTitle: "Die Reise der Verlorenen to go",
    mediaType: "video",
    openUrl: verlorenenVideo,
    embedUrl: asRaw(verlorenenVideo),
    summary:
      "Nutze diese Linse, um den Gesamtverlauf des Stücks im Blick zu behalten: Abfahrt, Zwischenraum Schiff, Havanna, diplomatisches Ringen, Rückweg und Nachgeschichte.",
    keyIdeas: ["Dramengang", "Montage", "Mehrstimmigkeit", "Zwischenraum Schiff", "Schlussbild"],
    questions: [
      "Wo verdichtet das Stück den Stoff besonders stark und warum?",
      "Wie wechseln persönliche Szenen und politische Ebenen einander ab?",
      "Welche Funktion hat der Schluss mit den späteren Lebenswegen?"
    ],
    transferPrompts: [
      "Ordne die Passage in den Gesamtverlauf des Stücks ein.",
      "Zeige, was die Szene für die spätere Entwicklung vorbereitet oder verschiebt.",
      "Erkläre, ob die Passage eher zuspitzt, verzögert oder kommentiert."
    ],
    writingFrame:
      "Im Gesamtaufbau ist die Passage wichtig, weil sie den Übergang von ... zu ... markiert und dadurch ..."
  },
  {
    id: "gute-geschichte",
    title: "Erzählen, Verdichtung und Verantwortung",
    shortTitle: "Geschichte",
    sourceTitle: "Daniel Kehlmann: Was ist eine gute Geschichte?",
    mediaType: "video",
    openUrl: geschichteVideo,
    embedUrl: asRaw(geschichteVideo),
    summary:
      "Diese Linse hilft dabei zu untersuchen, wie Kehlmann historische Wirklichkeit in erzählerische Form, Bühnenrhythmus und erinnerbare Szenen übersetzt, ohne die Verantwortung des Stoffs zu verlieren.",
    keyIdeas: ["Verdichtung", "Szenenbau", "Spannung", "Stimmenführung", "narrative Verantwortung"],
    questions: [
      "Wie macht Kehlmann einen historischen Stoff dramatisch, ohne ihn bloß nachzuerzählen?",
      "Welche Szenen sind so gebaut, dass sie zugleich informieren und Spannung erzeugen?",
      "Wo zeigt sich, dass gute Geschichte auch Auswahl, Verdichtung und Perspektivierung bedeutet?"
    ],
    transferPrompts: [
      "Suche in der Passage nach erzählerischer Verdichtung statt bloßer Faktensammlung.",
      "Beschreibe, wie Figurenrede und Szenenwechsel den Stoff rhythmisch organisieren.",
      "Prüfe, wie die Passage Zuschauer*innen zugleich verstehen lässt und emotional bindet."
    ],
    writingFrame:
      "Die Szene ist dramaturgisch stark gebaut, weil Kehlmann hier ... verdichtet und dadurch ..."
  },
  {
    id: "dokumentartheater",
    title: "Dokumentartheater",
    shortTitle: "Dokumentarisch",
    sourceTitle: "Dokumentartheater | Deutsch Dramatik",
    mediaType: "video",
    openUrl: dokumentartheaterVideo,
    embedUrl: asRaw(dokumentartheaterVideo),
    summary:
      "Mit dieser Linse prüfst du, wie das Stück mit dokumentarischen Verfahren arbeitet: reale Personen, historische Vorgänge, protokollnahe Redeweisen und offengelegte Faktizität.",
    keyIdeas: ["Dokument", "Authentizität", "historische Quelle", "Protokollnähe", "Faktenbühne"],
    questions: [
      "Welche Momente wirken fast wie Akten, Berichte oder Zeugenaussagen?",
      "Wo macht das Stück seine historische Faktengrundlage sichtbar?",
      "Wie verändert die dokumentarische Form die Wirkung im Vergleich zu rein fiktivem Drama?"
    ],
    transferPrompts: [
      "Zeige, welche Elemente der Passage dokumentarisch wirken.",
      "Prüfe, ob Figuren eher individuell gezeichnet oder als Träger historischer Aussagen eingesetzt werden.",
      "Erkläre, wie Faktizität und Bühneneffekt hier zusammenarbeiten."
    ],
    writingFrame:
      "Dokumentartheaterartig wirkt die Passage, weil sie ... nicht nur erzählt, sondern als historisch belegbare Wirklichkeit ausstellt."
  },
  {
    id: "episches-theater",
    title: "Episches Theater",
    shortTitle: "Episch",
    sourceTitle: "Episches Theater",
    mediaType: "video",
    openUrl: epischesTheaterVideo,
    embedUrl: asRaw(epischesTheaterVideo),
    summary:
      "Diese Linse fokussiert Verfremdung, Zuschaueransprache, kommentierende Szenen und die politische Lesbarkeit des Geschehens statt bloßer Einfühlung.",
    keyIdeas: ["Verfremdung", "Zuschaueransprache", "Kommentar", "Montage", "politische Distanz"],
    questions: [
      "Wo spricht das Stück direkt zum Publikum oder unterbricht illusionistisches Spielen?",
      "Wie entsteht Distanz, die zum Nachdenken statt zum bloßen Mitleiden zwingt?",
      "Welche Szenen funktionieren eher als gesellschaftlicher Kommentar denn als private Psychologie?"
    ],
    transferPrompts: [
      "Untersuche, wie die Passage Zuschauer*innen adressiert oder mit Distanz arbeiten lässt.",
      "Prüfe, ob die Szene eher miterleben lässt oder analytisch rahmt.",
      "Zeige, wie Montage und Perspektivwechsel politische Wirkung erzeugen."
    ],
    writingFrame:
      "Episch wirkt die Szene, weil sie das Geschehen nicht nur erleben lässt, sondern das Publikum dazu bringt, über ... nachzudenken."
  },
  {
    id: "im-steinbruch",
    title: "Sekundärtext: Kehlmanns Rede „Im Steinbruch“",
    shortTitle: "Steinbruch",
    sourceTitle: "Festrede Brucknerfest Linz 2018",
    mediaType: "pdf",
    openUrl: steinbruchPdf,
    embedUrl: steinbruchPdf,
    summary:
      "Der Sekundärtext verbindet Kunst, Erinnerung, Mauthausen und gegenwärtige Flüchtlingspolitik. Er hilft, Kehlmanns Haltung zu Erinnerung, Tradition und politischer Gegenwart mitzulesen.",
    keyIdeas: ["Erinnerungskultur", "Mauthausen", "Kunst und Barbarei", "Gegenwartsbezug", "ethische Verantwortung"],
    questions: [
      "Welche Verbindung stellt Kehlmann zwischen Kunst, Gedenken und politischer Gegenwart her?",
      "Wie spricht die Rede über Orte, die sich nicht ästhetisch neutralisieren lassen?",
      "Was bedeutet dieser Text für die Lektüre von Die Reise der Verlorenen?"
    ],
    transferPrompts: [
      "Vergleiche die Passage mit Kehlmanns Aussagen über Gedenken und politische Verantwortung.",
      "Prüfe, ob die Szene Erinnerung eher ritualisiert oder schmerzhaft offen hält.",
      "Zeige, wie Kunst hier nicht entlastet, sondern Verantwortung zuspitzt."
    ],
    writingFrame:
      "Mit dem Sekundärtext gelesen, gewinnt die Passage zusätzlich Gewicht, weil Kehlmann darin ... ausdrücklich als Gegenwartsfrage markiert."
  }
];

export const readerModules = [
  {
    id: "abfahrt",
    title: "Auftakt, Täterrede und Abfahrt",
    lens: "Täterstimme, Exposition, Fluchtlage",
    briefing:
      "Arbeite die Eröffnung als bewusste Setzung heraus: Das Stück startet mit Täterperspektive, institutioneller Sprache und konkreten Fluchtgeschichten statt mit rein privater Einfühlung.",
    task:
      "Zeige, wie der dramatische Auftakt historische Gewalt, institutionelle Verantwortung und individuelle Bedrohung zugleich exponiert.",
    relatedTheoryIds: ["dokumentartheater", "episches-theater", "historischer-kontext", "gute-geschichte"],
    entries: [
      {
        id: "abfahrt-1",
        title: "Schiendick eröffnet als Tätersprecher",
        pageHint: "S. 4",
        pageNumber: 4,
        passageLabel: "Direkte Täteransprache",
        context:
          "Kehlmann lässt nicht zuerst ein Opfer sprechen, sondern einen offen auftretenden Nationalsozialisten. Dadurch wird der Zuschauerblick sofort politisch und unangenehm gerahmt.",
        signalWords: ["ich bin ein Nazi", "vorstellen", "Publikum", "Schiendick"],
        prompts: [
          "Welche Wirkung hat es, dass das Stück mit einer Täterstimme beginnt?",
          "Wie arbeitet diese Passage mit direkter Zuschaueradressierung?",
          "Inwiefern ist dieser Einstieg eher episch oder dokumentarisch als psychologisch?"
        ],
        writingFrame:
          "Die Eröffnung irritiert gezielt, weil sie ... nicht verbirgt, sondern frontal ausstellt.",
        relatedTheoryIds: ["episches-theater", "dokumentartheater"]
      },
      {
        id: "abfahrt-2",
        title: "Holthusen und Schröder vor der Reise",
        pageHint: "S. 5-6",
        pageNumber: 5,
        passageLabel: "Spezialfahrt statt Kreuzfahrt",
        context:
          "Schon vor dem Ablegen prallen Pflichterfüllung, Unternehmensinteresse und politische Einflussnahme aufeinander. Die Reise erscheint von Anfang an als belastete Ausnahmefahrt.",
        signalWords: ["spezielle Fahrt", "ausgebucht", "Macht", "Schiff"],
        prompts: [
          "Wie wird die Reise sprachlich als Sonderfall markiert?",
          "Welche Gegensätze zwischen Schröders Berufsethos und Holthusens Kalkül entstehen?",
          "Wie wird institutionelle Verantwortung verteilt oder abgeschoben?"
        ],
        writingFrame:
          "Die Passage zeigt, dass die Reise kein neutraler Transport ist, weil ...",
        relatedTheoryIds: ["historischer-kontext", "gute-geschichte"]
      },
      {
        id: "abfahrt-3",
        title: "Pozners Bericht von Verfolgung und Flucht",
        pageHint: "S. 7",
        pageNumber: 7,
        passageLabel: "Biografie unter Zwang",
        context:
          "Mit Pozners Rede kommt die Gewalt des nationalsozialistischen Alltags auf die Bühne. Das Stück konkretisiert Geschichte durch individuelle, knappe und belastete Zeugenschaft.",
        signalWords: ["Dachau", "geschlagen", "versteckt", "Hebräischlehrer"],
        prompts: [
          "Wie verdichtet Pozners Sprache biografische Zerstörung?",
          "Warum wirkt die Szene eher wie Zeugenschaft als wie lange Vorgeschichte?",
          "Welche Funktion hat diese frühe Opferrede im Gesamtaufbau?"
        ],
        writingFrame:
          "Pozners Bericht wirkt so stark, weil er in knapper Form sichtbar macht, dass ...",
        relatedTheoryIds: ["dokumentartheater", "historischer-kontext"]
      },
      {
        id: "abfahrt-4",
        title: "Familienbilder und Überlebenshoffnung",
        pageHint: "S. 8",
        pageNumber: 8,
        passageLabel: "Private Hoffnung im Ausnahmezustand",
        context:
          "Die frühen Familienmomente setzen keinen ruhigen Gegenraum, sondern zeigen verletzliche Hoffnung unter extremem politischem Druck.",
        signalWords: ["Fotoapparat", "überleben", "Kinder", "Hoffnung"],
        prompts: [
          "Wie verbindet die Passage privates Sprechen mit drohender Katastrophe?",
          "Welche Rolle spielt der Bild- oder Erinnerungscharakter dieser Szene?",
          "Wie baut Kehlmann emotionale Nähe auf, ohne die politische Ebene zu verlieren?"
        ],
        writingFrame:
          "Die Szene ist nicht bloß privat, weil in ihr ... und ... zugleich präsent bleiben.",
        relatedTheoryIds: ["gute-geschichte", "werkueberblick"]
      }
    ]
  },
  {
    id: "zwischenraum",
    title: "Das Schiff als Zwischenraum",
    lens: "Paradoxe Sicherheit, Bürokratie, Ambivalenz",
    briefing:
      "Untersuche das Schiff als scheinbaren Schutzraum: serviceorientiert, geordnet und zugleich von Gewalt, Kontrolle und Abschiebelogik durchzogen.",
    task:
      "Arbeite heraus, wie die St. Louis als widersprüchlicher Raum zwischen Rettung, Illusion und fortgesetzter Bedrohung erscheint.",
    relatedTheoryIds: ["historischer-kontext", "dokumentartheater", "gute-geschichte"],
    entries: [
      {
        id: "zwischenraum-1",
        title: "Ankunft an Bord als falsche Normalität",
        pageHint: "S. 9",
        pageNumber: 9,
        passageLabel: "Komfort unter Fluchtbedingungen",
        context:
          "Pozner erlebt an Bord etwas wie Würde und Normalität, doch gerade diese Zivilität macht die Gewaltgeschichte dahinter umso spürbarer.",
        signalWords: ["Kabine", "Fiebertraum", "wohlfühlen", "Kinder"],
        prompts: [
          "Warum wirkt der Bordkomfort zugleich erleichternd und verstörend?",
          "Wie zeigt die Szene, dass Sicherheit nur provisorisch ist?",
          "Welche Spannung entsteht zwischen äußerer Höflichkeit und innerer Angst?"
        ],
        writingFrame:
          "Die Szene wirkt paradox, weil das Schiff einerseits ... und andererseits ...",
        relatedTheoryIds: ["historischer-kontext", "gute-geschichte"]
      },
      {
        id: "zwischenraum-2",
        title: "Holthusen erklärt das Geschäft mit der Flucht",
        pageHint: "S. 9-12",
        pageNumber: 10,
        passageLabel: "Bürokratie und Zynismus",
        context:
          "Die Zuschauer erfahren, wie Bürokratie, Profit und antisemitische Politik zusammenarbeiten. Die Passage entlarvt Systemlogik statt einzelne Bosheit.",
        signalWords: ["Bürokratie", "Rückfahrt", "Coup", "korrekte Buchhaltung"],
        prompts: [
          "Wie wird ökonomisches Denken hier mit Verfolgung verknüpft?",
          "Welche Wirkung hat die offen zynische Sprache Holthusens?",
          "Warum ist diese Szene für dokumentarisches Theater besonders ergiebig?"
        ],
        writingFrame:
          "Die Passage entlarvt das System, weil sie zeigt, wie ... als normale Verwaltungslogik erscheint.",
        relatedTheoryIds: ["dokumentartheater", "historischer-kontext"]
      },
      {
        id: "zwischenraum-3",
        title: "Gerüchte, Hilfsorganisationen, erste Gegenkräfte",
        pageHint: "S. 11-13",
        pageNumber: 13,
        passageLabel: "Hilfe im Netzwerk der Abhängigkeiten",
        context:
          "Zwischen HAPAG, Hilfsorganisationen und Gerüchten entsteht ein Geflecht aus Hoffnung, Information und Ohnmacht.",
        signalWords: ["Gerüchte", "Anwalt", "helfen", "gleichen Strang"],
        prompts: [
          "Wie zeigt die Passage, dass Hilfe immer schon von Machtverhältnissen abhängt?",
          "Welche Rolle spielen Informationslücken für die Spannung?",
          "Wie montiert das Stück private und institutionelle Stimmen?"
        ],
        writingFrame:
          "Die Szene macht Hoffnung sichtbar, aber sie bleibt unsicher, weil ...",
        relatedTheoryIds: ["werkueberblick", "gute-geschichte"]
      },
      {
        id: "zwischenraum-4",
        title: "Jockl, Schröder und Schiendick",
        pageHint: "S. 14-16",
        pageNumber: 15,
        passageLabel: "Moralische Linien an Bord",
        context:
          "Zwischen Crewmitgliedern und Kapitän entstehen unterschiedliche Haltungen: Mitgefühl, Pflicht, Angst und politische Durchdringung des Schiffsraums.",
        signalWords: ["Gerüchte", "sicher", "Gericht", "Seerecht"],
        prompts: [
          "Wie werden Schröder, Jockl und Schiendick kontrastiv gezeichnet?",
          "Welche Handlungsspielräume zeigen sich und wo enden sie?",
          "Wie organisiert das Stück moralische Differenzen nicht nur über Worte, sondern über Funktionsrollen?"
        ],
        writingFrame:
          "Die Passage zeigt unterschiedliche Haltungen, indem ... einander scharf gegenübergestellt werden.",
        relatedTheoryIds: ["episches-theater", "historischer-kontext"]
      }
    ]
  },
  {
    id: "havanna",
    title: "Havanna: Korruption, Politik und Warteschleife",
    lens: "Machtlogik, Willkür, inszenierte Hoffnung",
    briefing:
      "Arbeite die Kuba-Sequenz als politische Bühne heraus: Bestechung, Dekrete, Spielräume und private Verzweiflung greifen hier ständig ineinander.",
    task:
      "Zeige, wie das Stück den verweigerten Landgang zugleich als politische Farce und als existentielle Katastrophe gestaltet.",
    relatedTheoryIds: ["historischer-kontext", "dokumentartheater", "episches-theater"],
    entries: [
      {
        id: "havanna-1",
        title: "Benitez und die erfundene Genehmigung",
        pageHint: "S. 17-19",
        pageNumber: 17,
        passageLabel: "Korruption als System",
        context:
          "Benitez erklärt offen seine Bestechlichkeit und macht sichtbar, dass rechtliche Verfahren hier bewusst in Grauzonen verwandelt werden.",
        signalWords: ["bestechlich", "Landegenehmigungen", "erfunden", "Stempel"],
        prompts: [
          "Wie wirkt Benitez' offene Selbstentlarvung auf das Publikum?",
          "Was zeigt die Passage über Recht, Willkür und politische Sprache?",
          "Warum passt diese Szene besonders gut zur Linse Dokumentartheater?"
        ],
        writingFrame:
          "Die Szene zeigt Willkür nicht als Ausnahme, sondern als ...",
        relatedTheoryIds: ["dokumentartheater", "historischer-kontext"]
      },
      {
        id: "havanna-2",
        title: "Bru und das politische Kalkül",
        pageHint: "S. 20-22",
        pageNumber: 20,
        passageLabel: "Das Land ist voll",
        context:
          "Bru formuliert genau jene Abwehrlogik, die bis heute als politische Formel wiederkehrt: Aufnahmegrenzen, nationale Interessen und öffentliche Wirkung.",
        signalWords: ["überfüllt", "letzte", "nein sagen", "Schiff"],
        prompts: [
          "Wie wird politische Verantwortung in Sachzwangsprache übersetzt?",
          "Welche Aktualität gewinnt die Passage gerade durch diese Formulierungen?",
          "Wie baut Kehlmann Distanz auf, damit man die Logik analysiert statt nur mitzuleiden?"
        ],
        writingFrame:
          "Die Passage wirkt politisch scharf, weil sie Ausgrenzung in scheinbar vernünftige Sprache kleidet: ...",
        relatedTheoryIds: ["episches-theater", "historischer-kontext"]
      },
      {
        id: "havanna-3",
        title: "Max Aber und die zerschnittene Familie",
        pageHint: "S. 23-24",
        pageNumber: 23,
        passageLabel: "Privates Schicksal unter politischen Entscheidungen",
        context:
          "Die Geschichte Max Abers zeigt exemplarisch, wie politische Grenzentscheidungen Familien zerteilen und individuelle Lebenswege zerstören.",
        signalWords: ["Kinderheim", "Mädchen", "wiedersehen", "Angst"],
        prompts: [
          "Wie verbindet die Passage Einzelschicksal und Systemgewalt?",
          "Wodurch wirkt Max Abers Stimme exemplarisch und zugleich individuell?",
          "Welche dramaturgische Funktion hat diese Verschiebung ins Private?"
        ],
        writingFrame:
          "Gerade durch die konkrete Familiengeschichte zeigt die Passage, dass ...",
        relatedTheoryIds: ["historischer-kontext", "gute-geschichte"]
      },
      {
        id: "havanna-4",
        title: "Jockl und Pozner über zivilisierte Vertreibung",
        pageHint: "S. 25-28",
        pageNumber: 25,
        passageLabel: "Höflichkeit im Unrecht",
        context:
          "Die Szene macht die zynische Form des Unrechts sichtbar: gepflegte Versorgung, gutes Essen und höflicher Service ändern nichts an Enteignung, Vertreibung und Gewalt.",
        signalWords: ["Komödie", "Hauptgerichte", "anständiger Mensch", "falsche Seite"],
        prompts: [
          "Wie arbeitet die Passage mit dem Kontrast zwischen Service und Verfolgung?",
          "Warum ist gerade Höflichkeit hier moralisch verstörend?",
          "Welche Rolle spielt Jockl als Figur zwischen Mitgefühl und Systemzugehörigkeit?"
        ],
        writingFrame:
          "Die Szene entlarvt scheinbare Menschlichkeit, weil ... nicht aufhebt, dass ...",
        relatedTheoryIds: ["historischer-kontext", "gute-geschichte"]
      }
    ]
  },
  {
    id: "hafenkrise",
    title: "Hafenkrise und zerfallende Hoffnung",
    lens: "Warten, Gewalt, Sichtbarkeit, Familie",
    briefing:
      "Lies diese Passagen als Verdichtung des Stillstands: Hoffnungsschübe, Gewaltmomente und einzelne Bilder von Nähe oder Trennung wechseln sich rasch ab.",
    task:
      "Arbeite heraus, wie das Stück aus Warten, Gerücht und Blickszenen eine immer größere Spannung erzeugt.",
    relatedTheoryIds: ["werkueberblick", "gute-geschichte", "episches-theater"],
    entries: [
      {
        id: "hafenkrise-1",
        title: "Komitee, Telegramm und Rückkehrangst",
        pageHint: "S. 29-30",
        pageNumber: 29,
        passageLabel: "Organisierte Hoffnung",
        context:
          "Mit dem Komitee wird Handlungsfähigkeit behauptet, doch die Szene macht zugleich klar, wie prekär und fremdbestimmt diese Hoffnung ist.",
        signalWords: ["Komitee", "Wort", "Telegramm", "Deutschland"],
        prompts: [
          "Wie versucht die Szene, Ordnung in die Krise zu bringen?",
          "Welche Rolle spielt Schröders Versprechen?",
          "Wodurch bleibt die Hoffnung trotz Organisation brüchig?"
        ],
        writingFrame:
          "Die Passage zeigt organisierte Hoffnung, aber sie bleibt fragil, weil ...",
        relatedTheoryIds: ["werkueberblick", "historischer-kontext"]
      },
      {
        id: "hafenkrise-2",
        title: "Hakenkreuz, Einschüchterung, Alltagsgewalt",
        pageHint: "S. 31-32",
        pageNumber: 32,
        passageLabel: "Nazigewalt an Bord",
        context:
          "Die nationalsozialistische Gewalt ist nicht bloß Hintergrund, sondern dringt in den Bordalltag selbst ein und zerstört jeden Rest von Sicherheit.",
        signalWords: ["Hakenkreuz", "Judensau", "Arm", "festhalten"],
        prompts: [
          "Wie macht die Szene die Grenze zwischen Schiff und Verfolgungsraum porös?",
          "Welche Wirkung hat die direkte körperliche Aggression?",
          "Wie verändert sich dein Bild des Schiffsraums durch diese Passage?"
        ],
        writingFrame:
          "Die Szene zeigt, dass das Schiff kein Schutzraum mehr ist, weil ...",
        relatedTheoryIds: ["historischer-kontext", "episches-theater"]
      },
      {
        id: "hafenkrise-3",
        title: "Havanna als Bild aus der Distanz",
        pageHint: "S. 33-36",
        pageNumber: 35,
        passageLabel: "Stadt in Sicht, Landgang verwehrt",
        context:
          "Die Passagiere sehen Kuba, aber sie erreichen es nicht. Die Nähe des ersehnten Landes steigert die Qual des Wartens.",
        signalWords: ["Reling", "Hafen", "niemand", "unklar"],
        prompts: [
          "Welche Funktion hat das Motiv des Sehens ohne Ankommen?",
          "Wie arbeitet die Szene mit räumlicher Nähe und politischer Unerreichbarkeit?",
          "Warum ist dieses Bühnenbild besonders wirkungsvoll?"
        ],
        writingFrame:
          "Die Passage verschärft die Krise, weil ... sichtbar und zugleich unerreichbar bleibt.",
        relatedTheoryIds: ["gute-geschichte", "werkueberblick"]
      },
      {
        id: "hafenkrise-4",
        title: "Max Aber sieht seine Töchter",
        pageHint: "S. 37-40",
        pageNumber: 37,
        passageLabel: "Blickszene und familiale Trennung",
        context:
          "Die Szene verbindet politisches Drama mit einem fast unerträglich konkreten Augenblick der familialen Distanz.",
        signalWords: ["Reling", "Kinder", "Visa", "auf Wiedersehen"],
        prompts: [
          "Warum ist gerade die Blickszene so stark?",
          "Wie verdichtet das Stück hier Politik in ein einzelnes Bild?",
          "Welche Rolle spielt Sprache unter Bedingungen von Panik, Distanz und Zeitdruck?"
        ],
        writingFrame:
          "Die Szene wirkt so intensiv, weil der politische Konflikt in einem einzigen Bild von ... konzentriert wird.",
        relatedTheoryIds: ["gute-geschichte", "historischer-kontext", "im-steinbruch"]
      }
    ]
  },
  {
    id: "diplomatie",
    title: "Diplomatie, Presse und Grenzen des Handelns",
    lens: "Verhandlung, Öffentlichkeit, Ohnmacht",
    briefing:
      "Untersuche, wie das Stück politische Macht nicht als abstraktes System, sondern als Abfolge von Gesprächen, Erpressungen, Pressebildern und unterlassenen Entscheidungen zeigt.",
    task:
      "Zeige, wie Verhandlungsszenen politische Verantwortung zugleich konkretisieren und zerstreuen.",
    relatedTheoryIds: ["dokumentartheater", "episches-theater", "im-steinbruch"],
    entries: [
      {
        id: "diplomatie-1",
        title: "Gesicht wahren, Akten führen, Intrigen spinnen",
        pageHint: "S. 41-48",
        pageNumber: 41,
        passageLabel: "Politik als Bühne",
        context:
          "Die Akteure verhandeln nicht nur Inhalte, sondern Ansehen, Pressewirkung und Machtpositionen. Politik erscheint als strategische Inszenierung.",
        signalWords: ["Gesicht wahren", "Bericht", "Telegramme", "Wahlen"],
        prompts: [
          "Wie zeigt die Passage Politik als Mischung aus Information, Image und Macht?",
          "Welche Wirkung haben die schnellen Szenenwechsel auf dein Verständnis?",
          "Warum eignet sich diese Passage für die Linse des epischen Theaters?"
        ],
        writingFrame:
          "Die Szene macht Politik als Inszenierung sichtbar, weil ... nicht weniger wichtig ist als ...",
        relatedTheoryIds: ["episches-theater", "dokumentartheater"]
      },
      {
        id: "diplomatie-2",
        title: "Suizidversuche und Patrouillen",
        pageHint: "S. 49-53",
        pageNumber: 49,
        passageLabel: "Verzweiflung als Kollektivzustand",
        context:
          "Die psychische Belastung an Bord wird so groß, dass das Stück nicht mehr nur politisch argumentiert, sondern existentielle Zerbrechlichkeit zeigt.",
        signalWords: ["Pulsader", "springen", "Patrouillen", "inständig"],
        prompts: [
          "Wie verändert sich die Stimmung des Stücks in diesen Szenen?",
          "Welche Grenzen von Schröders Verantwortung werden sichtbar?",
          "Wie verbindet Kehlmann individuelles Leid mit strukturellem Versagen?"
        ],
        writingFrame:
          "Die Passage zeigt Verzweiflung nicht als Einzelfall, sondern als Folge davon, dass ...",
        relatedTheoryIds: ["historischer-kontext", "gute-geschichte"]
      },
      {
        id: "diplomatie-3",
        title: "Berenson, Bru, Batista und das Geschäft mit den Flüchtlingen",
        pageHint: "S. 50-60",
        pageNumber: 57,
        passageLabel: "Humanität im Modus des Deals",
        context:
          "Die Rettung der Flüchtlinge hängt an Summen, Garantien, Bildern und politischem Kalkül. Humanität erscheint als verhandelbare Größe.",
        signalWords: ["halbe Million", "Garantie", "Fotograf", "Gefängnisinsel"],
        prompts: [
          "Wie entlarvt die Passage den Warencharakter politischer Rettung?",
          "Welche Rolle spielen Bilder, Öffentlichkeit und Inszenierung?",
          "Wie wird aus humanitärer Hilfe ein zähes Tauschgeschäft?"
        ],
        writingFrame:
          "Die Passage ist so bitter, weil sie Rettung an ... bindet und dadurch ... sichtbar macht.",
        relatedTheoryIds: ["dokumentartheater", "im-steinbruch", "historischer-kontext"]
      },
      {
        id: "diplomatie-4",
        title: "USA, Großbritannien und das Nicht-Handeln",
        pageHint: "S. 61-71",
        pageNumber: 65,
        passageLabel: "Verantwortung wird weitergereicht",
        context:
          "Die Gespräche zwischen Ministerien und Botschaften machen sichtbar, wie Verantwortung durch Zuständigkeiten, Verzögerung und politische Rücksichtnahme verdünnt wird.",
        signalWords: ["Spielraum", "Virgin Islands", "nichts tun", "Frieden mit Hitler"],
        prompts: [
          "Wie zeigt die Passage Unterlassung als politische Handlung?",
          "Welche sprachlichen Formen des Ausweichens fallen auf?",
          "Warum ist gerade das unspektakuläre Nicht-Handeln dramatisch so wichtig?"
        ],
        writingFrame:
          "Die Szene zeigt politische Schuld als Unterlassung, weil ... immer wieder verschoben wird.",
        relatedTheoryIds: ["historischer-kontext", "episches-theater", "im-steinbruch"]
      }
    ]
  },
  {
    id: "rueckweg",
    title: "Rückweg, letzte Optionen und Nachgeschichte",
    lens: "Handlungsspielraum, Montage, Erinnerung",
    briefing:
      "Im letzten Abschnitt verschiebt sich das Stück von der unmittelbaren Krise zur Frage, was überhaupt noch getan werden kann und wie sich die Geschichte nach 1939 fortsetzt.",
    task:
      "Arbeite heraus, wie das Ende zwischen verpasster Rettung, begrenztem Glück und bitterer historischer Bilanz gebaut ist.",
    relatedTheoryIds: ["episches-theater", "werkueberblick", "im-steinbruch", "gute-geschichte"],
    entries: [
      {
        id: "rueckweg-1",
        title: "Propaganda, Geheimdienst, britische Grenzen",
        pageHint: "S. 67-72",
        pageNumber: 67,
        passageLabel: "Die Welt reagiert und reagiert doch nicht",
        context:
          "Goebbels' Propaganda, britische Zurückhaltung und Schiendicks Rolle zeigen, wie eng ideologische Deutung, staatliche Interessen und konkrete Lebensgefahr zusammenhängen.",
        signalWords: ["Goebbels", "Abwehr", "Telegramm", "England"],
        prompts: [
          "Wie verbindet das Stück Propaganda und politische Realentscheidung?",
          "Welche Funktion hat Schiendick im letzten Drittel des Dramas?",
          "Wie entsteht hier eine besonders epische, kommentierende Struktur?"
        ],
        writingFrame:
          "Die Passage verschärft die historische Anklage, weil ... und ... gleichzeitig sichtbar werden.",
        relatedTheoryIds: ["episches-theater", "historischer-kontext"]
      },
      {
        id: "rueckweg-2",
        title: "Pozners Plan und Schröders Grenze",
        pageHint: "S. 72-74",
        pageNumber: 73,
        passageLabel: "Meuterei oder Pflicht",
        context:
          "Die Szene stellt noch einmal radikal die Frage nach Handlungsspielraum. Schröders Berufsethos erscheint zugleich ehrenhaft, tragisch begrenzt und historisch unzureichend.",
        signalWords: ["Manövrierfehler", "Küstenwache", "ich kann das nicht", "Kapitän"],
        prompts: [
          "Wie wird Schröders innere Grenze sprachlich sichtbar?",
          "Warum ist Pozners Vorschlag dramaturgisch so stark?",
          "Wie lässt sich die Szene zwischen moralischer Größe und historischem Versagen lesen?"
        ],
        writingFrame:
          "Die Szene ist zentral, weil sie zeigt, dass Schröders Haltung ... und ... zugleich ist.",
        relatedTheoryIds: ["gute-geschichte", "historischer-kontext", "episches-theater"]
      },
      {
        id: "rueckweg-3",
        title: "Belgien als verspäteter Ausweg",
        pageHint: "S. 74-76",
        pageNumber: 75,
        passageLabel: "Erleichterung unter Vorbehalt",
        context:
          "Die Nachricht aus Belgien bringt keine Auflösung im klassischen Sinn, sondern nur begrenzte Rettung unter historischem Vorbehalt.",
        signalWords: ["Belgien", "anlächeln", "Erleichterung", "Broschüre"],
        prompts: [
          "Warum ist diese Erleichterung nicht wirklich entlastend?",
          "Wie setzt das Stück Hoffnung und spätere Bedrohung gleichzeitig in den Raum?",
          "Welche Funktion hat diese Übergangsstimmung vor dem Schluss?"
        ],
        writingFrame:
          "Die Passage wirkt doppeldeutig, weil sie Rettung andeutet, aber zugleich ... mitschwingen lässt.",
        relatedTheoryIds: ["werkueberblick", "historischer-kontext"]
      },
      {
        id: "rueckweg-4",
        title: "Epilog der Überlebenden und Schiendicks Karriere",
        pageHint: "S. 77-80",
        pageNumber: 77,
        passageLabel: "Nachgeschichte statt Katharsis",
        context:
          "Der Schluss verweigert einen versöhnlichen Ausklang. Stattdessen montiert das Stück Überlebenswege, Lagererfahrungen, spätere Rettung und Täterkarriere zu einer bitteren historischen Bilanz.",
        signalWords: ["Westerborg", "London", "überlebt", "Karriere gemacht"],
        prompts: [
          "Warum endet das Stück mit Nachgeschichten statt mit einem einzelnen Schlussbild?",
          "Wie verändert Schiendicks Schlussrede deine Deutung des gesamten Dramas?",
          "Inwiefern ist dieses Ende episch, dokumentarisch und erinnerungspolitisch zugleich?"
        ],
        writingFrame:
          "Der Schluss verweigert Katharsis, weil er ... nicht abschließt, sondern in die Geschichte hinein offen hält.",
        relatedTheoryIds: ["episches-theater", "dokumentartheater", "im-steinbruch"]
      }
    ]
  }
];

export const lessonSets = [
  {
    id: "lesson-01-auftakt",
    title: "Lektion 1 · Täterauftakt und Spezialfahrt",
    summary:
      "Schiendicks Auftaktrede und die institutionelle Exposition der Fahrt als belastete Ausnahme.",
    entryIds: ["abfahrt-1", "abfahrt-2"],
    moduleIds: ["abfahrt"],
    reviewFocus: "Achte auf Täterrede, Publikumseffekt, institutionelle Sprache und die frühe politische Rahmung der Fahrt.",
    sebPrompt:
      "Analysiere die Eröffnung und die Vorbereitung der Fahrt. Zeige am Wortlaut, wie Täteransprache, Unternehmenslogik und politische Bedrohung von Beginn an zusammenwirken."
  },
  {
    id: "lesson-02-fluchtstimmen",
    title: "Lektion 2 · Fluchtstimmen und fragile Hoffnung",
    summary:
      "Pozners Zeugenschaft, private Hoffnungsbilder und erste provisorische Sicherheit an Bord.",
    entryIds: ["abfahrt-3", "abfahrt-4", "zwischenraum-1"],
    moduleIds: ["abfahrt", "zwischenraum"],
    reviewFocus: "Arbeite genau an Zeugenschaft, Familienmotiven und der paradoxen Normalität an Bord.",
    sebPrompt:
      "Zeige, wie Kehlmann frühe Opferstimmen und private Hoffnungsbilder gestaltet, ohne die politische Bedrohung aus dem Blick zu verlieren.",
    recommendedTheoryIds: ["bilddossier-reise", "historischer-kontext", "gute-geschichte"],
    resourceAssignments: [
      {
        resourceId: "bilddossier-reise",
        title: "Bildauftrag: Schiff, Passagiere und Bordraum konkret sehen",
        summary:
          "Die Bilder der St. Louis, Schröders und der Passagiere helfen, das frühe Bordgeschehen nicht nur sprachlich, sondern räumlich und menschlich zu konkretisieren.",
        task:
          "Nutze das Bilddossier, um die frühen Passagen genauer zu lesen. Zeige, wie Schiff, Blick und Passagiernähe die Hoffnungs- und Bedrohungslage sichtbar machen.",
        questions: [
          "Welches Bild passt am besten zu den frühen Hoffnungs- und Fluchtszenen?",
          "Wie schärft das Bild dein Verständnis des Bordraums?",
          "Was wird durch das Bild deutlicher als durch eine bloß abstrakte Beschreibung?"
        ]
      }
    ]
  },
  {
    id: "lesson-03-schiffssystem",
    title: "Lektion 3 · Das Schiff als Systemraum",
    summary:
      "Bürokratie, Gerüchte und moralische Linien an Bord zwischen Service, Zynismus und Mitgefühl.",
    entryIds: ["zwischenraum-2", "zwischenraum-3", "zwischenraum-4"],
    moduleIds: ["zwischenraum"],
    reviewFocus: "Analysiere das Schiff als widersprüchlichen Raum aus Ordnung, Gerücht und fortgesetzter Gewalt.",
    sebPrompt:
      "Untersuche, wie das Stück auf dem Schiff ökonomische, moralische und politische Konfliktlinien gleichzeitig sichtbar macht."
  },
  {
    id: "lesson-04-havanna-macht",
    title: "Lektion 4 · Havanna als Machtbühne",
    summary:
      "Korruption, Scheinlegalität und politische Abwehrformeln in den ersten Kuba-Szenen.",
    entryIds: ["havanna-1", "havanna-2"],
    moduleIds: ["havanna"],
    reviewFocus: "Achte auf politische Sprache, offene Selbstentlarvung und Willkür im Gewand von Verfahren.",
    sebPrompt:
      "Zeige an zwei Passagen, wie Havanna als Bühne von Bestechung, Machtkalkül und verweigerter Aufnahme aufgebaut wird.",
    recommendedTheoryIds: ["bilddossier-akteure", "historischer-kontext", "dokumentartheater"],
    resourceAssignments: [
      {
        resourceId: "bilddossier-akteure",
        title: "Bildauftrag: Havanna, Bru und die Gesichter politischer Entscheidung",
        summary:
          "Die Porträts von Laredo Brú und Batista ziehen die Kuba-Szenen weg von abstrakter Staatsmacht hin zu konkreten politischen Akteuren und Machtfeldern.",
        task:
          "Nutze das Bilddossier, um die Havanna-Szenen politisch zu präzisieren. Zeige, wie Korruption, Abwehr und staatliche Entscheidungsmacht im Drama personell greifbar werden.",
        questions: [
          "Welches Porträt schärft die Havanna-Szenen am stärksten?",
          "Wie hilft dir das Bild, Staatsmacht konkreter zu denken?",
          "Welche Machtfigur oder welches Machtfeld steht hinter der Passage?"
        ]
      }
    ]
  },
  {
    id: "lesson-05-havanna-menschen",
    title: "Lektion 5 · Havanna und die zerschnittenen Familien",
    summary:
      "Einzelschicksale, Höflichkeit im Unrecht und menschliche Katastrophe unter politischen Entscheidungen.",
    entryIds: ["havanna-3", "havanna-4"],
    moduleIds: ["havanna"],
    reviewFocus: "Arbeite heraus, wie das Stück Einzelschicksale gegen die kalte politische Logik stellt.",
    sebPrompt:
      "Untersuche, wie private Verluste und höflich organisierte Vertreibung die politische Katastrophe noch schärfer sichtbar machen."
  },
  {
    id: "lesson-06-hafen-hoffnung",
    title: "Lektion 6 · Organisierte Hoffnung und offene Gewalt",
    summary:
      "Komitee, Telegramme und zugleich die Eskalation der Gewalt an Bord.",
    entryIds: ["hafenkrise-1", "hafenkrise-2"],
    moduleIds: ["hafenkrise"],
    reviewFocus: "Verbinde Hoffnungstechniken, Gerüchte, Gewalt und Raumerfahrung präzise mit dem Wortlaut.",
    sebPrompt:
      "Zeige, wie Kehlmann in der Hafenkrise Hoffnung organisiert und im selben Zug wieder zerstört."
  },
  {
    id: "lesson-07-hafen-blickszenen",
    title: "Lektion 7 · Blickszenen, Distanz und Trennung",
    summary:
      "Havanna bleibt sichtbar und unerreichbar; politische Krise verdichtet sich zu Familienbildern und Distanzszenen.",
    entryIds: ["hafenkrise-3", "hafenkrise-4"],
    moduleIds: ["hafenkrise"],
    reviewFocus: "Achte auf Blickregie, Distanz, Bühnenraum und die Übersetzung von Politik in einzelne Bilder.",
    sebPrompt:
      "Analysiere, wie das Drama mit Sichtbarkeit ohne Ankunft arbeitet und dadurch die Unmenschlichkeit der Situation steigert."
  },
  {
    id: "lesson-08-diplomatie-inszenierung",
    title: "Lektion 8 · Politik als Inszenierung",
    summary:
      "Gesichtswahrung, Presse, Verhandlungen und kollektive Verzweiflung als zweite große Zuspitzung.",
    entryIds: ["diplomatie-1", "diplomatie-2"],
    moduleIds: ["diplomatie"],
    reviewFocus: "Untersuche Politik als Bühne und frage, wie öffentliches Handeln und psychische Zerstörung zusammenhängen.",
    sebPrompt:
      "Zeige an zwei Passagen, wie das Stück Verhandlungsszenen und Verzweiflung montiert, um politische Ohnmacht sichtbar zu machen."
  },
  {
    id: "lesson-09-diplomatie-blockade",
    title: "Lektion 9 · Deals, Unterlassung und Blockade",
    summary:
      "Humanität als Deal und Verantwortung als Kette des Nicht-Handelns.",
    entryIds: ["diplomatie-3", "diplomatie-4", "rueckweg-1"],
    moduleIds: ["diplomatie", "rueckweg"],
    reviewFocus: "Arbeite an den Sprachformen der Verzögerung, des Dealens und der politischen Schuld durch Unterlassung.",
    sebPrompt:
      "Analysiere die politische Blockade im letzten Drittel des Dramas und zeige, wie Verantwortung immer weiter verschoben wird.",
    recommendedTheoryIds: ["evian-konferenz", "evian-deutschlandfunk", "ushmm-voyage", "ndr-st-louis", "bilddossier-akteure", "historischer-kontext"],
    resourceAssignments: [
      {
        resourceId: "ushmm-voyage",
        title: "USHMM-Auftrag: Die Krise war politisch längst bekannt",
        summary:
          "Die USHMM-Seite zeigt die Reise nicht als plötzliches Missgeschick, sondern als bereits vorbereitete Krise: ungültige Papiere, informierte Behörden, kubanische Machtkämpfe und eine Reise, deren Risiko vor Havanna sichtbar war.",
        task:
          "Verbinde die diplomatischen Passagen mit dem USHMM-Dossier. Zeige, wie das Drama eine Krise verdichtet, die politisch schon vor der sichtbaren Blockade angelegt war.",
        questions: [
          "Welche Vorentscheidung des Dossiers schärft die Passage am stärksten?",
          "Wo zeigt das Drama, dass Wissen und Handeln auseinanderfallen?",
          "Wie macht die Szene aus politischer Kenntnis trotzdem unterlassene Rettung?"
        ]
      },
      {
        resourceId: "evian-konferenz",
        title: "Historischer Tiefenauftrag: Évian als Vorstruktur der St. Louis",
        summary:
          "Das Dossier zu Évian dient hier als direkte Vergleichsfolie für Havanna, Florida und den Rückweg: internationale Beratung, aber keine belastbare Aufnahmebereitschaft.",
        task:
          "Zeige an den Passagen, wie das Drama dieselbe Struktur sichtbar macht wie Évian 1938: beraten, verschieben, nicht retten.",
        questions: [
          "Welche Parallele zwischen Évian und den diplomatischen Szenen ist am klarsten?",
          "Warum liest du die Blockade mit Évian stärker als System denn als Ausnahme?",
          "Wo zeigt das Drama politisch organisierte Aufnahmeverweigerung?"
        ]
      },
      {
        resourceId: "evian-deutschlandfunk",
        title: "Quellenauftrag: Die Sprache der verweigerten Hilfe",
        summary:
          "Die Deutschlandfunk-Rezension lenkt den Blick auf die Sprache von Entlastung, Arbeitsmarktargumenten und diplomatischem Ausweichen.",
        task:
          "Vergleiche die Wortlogik des DLF-Beitrags mit den Passagen der Lektion. Zeige, wie Untätigkeit über Sachzwangssprache legitimiert wird.",
        questions: [
          "Welche Ausweichformel erkennst du im Beitrag und im Drama?",
          "Warum ist die Wortwahl 'Flüchtlinge' historisch und sprachkritisch brisant?",
          "Liest du Unterlassung nach der Quelle noch als Zufall oder als politisch codierte Entscheidung?"
        ]
      },
      {
        resourceId: "ndr-st-louis",
        title: "Chronologie-Auftrag: Die Irrfahrt als historische Sequenz",
        summary:
          "Die NDR-Chronologie bindet die diplomatischen und maritimen Szenen an einen klaren historischen Ablauf von Hamburg über Havanna und Florida bis Antwerpen zurück.",
        task:
          "Nutze den NDR-Beitrag, um die Lektion als Folge realer Wendepunkte zu lesen. Zeige, wie aus Stationen eine Blockadekette wird.",
        questions: [
          "Welche Station der Chronologie wird hier verdichtet?",
          "Wie trennt der Artikel Schröders Rolle von staatlicher Untätigkeit?",
          "Wo wird aus Chronologie im Drama moralische Eskalation?"
        ]
      },
      {
        resourceId: "bilddossier-akteure",
        title: "Bildauftrag: Diplomatie und politische Verantwortung bekommen Gesichter",
        summary:
          "Die Porträts von Wright, Hull, Morgenthau, Brú und Batista helfen, die Verhandlungsszenen als konkrete Machtkonstellation zu lesen.",
        task:
          "Nutze das Bilddossier, um die Diplomatieszenen politisch zu konkretisieren. Ordne die Passage einem Machtzentrum oder Akteur zu und zeige, wie dadurch Unterlassung und Verantwortungsverschiebung greifbarer werden.",
        questions: [
          "Welcher Akteur passt am ehesten zur Passage?",
          "Wie verändert das Porträt deine Deutung der Verhandlungsszene?",
          "Welche Form von Macht oder Verantwortung wird dadurch sichtbarer?"
        ]
      }
    ]
  },
  {
    id: "lesson-10-rueckweg-erinnerung",
    title: "Lektion 10 · Rückweg, Epilog und Erinnerung",
    summary:
      "Grenzen des Handelns, begrenzte Rettung und ein Schluss ohne Katharsis.",
    entryIds: ["rueckweg-2", "rueckweg-3", "rueckweg-4"],
    moduleIds: ["rueckweg"],
    reviewFocus: "Begründe am Schlusswort und an den Nachgeschichten, wie das Stück Erinnerung politisch offen hält.",
    sebPrompt:
      "Formuliere eine belastbare Deutung des Endes und verbinde sie mit epischem Theater, dokumentarischer Form oder Kehlmanns Rede „Im Steinbruch“.",
    recommendedTheoryIds: ["im-steinbruch", "episches-theater", "dokumentartheater", "susanne-heim-grenzen", "ndr-st-louis", "fritz-buff-reisebericht", "ushmm-return-europe", "ushmm-wartime-fate"],
    resourceAssignments: [
      {
        resourceId: "ushmm-return-europe",
        title: "USHMM-Auftrag: Rückkehr nach Europa ist nur vorläufige Aufnahme",
        summary:
          "Das USHMM-Dossier legt offen, wie die Passagiere auf vier Länder verteilt wurden und dort nur befristeten Schutz erhielten. Gerade diese Vorläufigkeit macht den Schluss historisch scharf.",
        task:
          "Arbeite den Schluss mit dem USHMM-Dossier durch. Zeige, warum Antwerpen und die Verteilung auf vier Länder keine Rettung abschließen, sondern nur eine neue prekäre Phase eröffnen.",
        questions: [
          "Welche Zahl oder Verteilungsinformation musst du im Blick behalten, um die Schlusssequenz richtig zu lesen?",
          "Wo zeigt das Drama Sicherheit nur als Übergang?",
          "Wie verändert das Dossier deine Bewertung des Wortes Rettung?"
        ]
      },
      {
        resourceId: "ushmm-wartime-fate",
        title: "USHMM-Auftrag: Nachgeschichte gegen falsche Entlastung",
        summary:
          "Die USHMM-Seite zu den Kriegsschicksalen verfolgt, was nach 1939 geschieht: Internierung, blockierte Fluchtwege, Deportation, Überleben und Ermordung. Damit wird der Schluss des Dramas radikal entlastungsresistent.",
        task:
          "Verbinde den Epilog und die Rückwegspassagen mit dem USHMM-Dossier. Zeige, wie das Drama bewusst kein beruhigendes Ende zulässt, weil die eigentliche Gefährdung erst weitergeht.",
        questions: [
          "Welche der Zahlen 532, 278 und 254 schärft den Schluss am stärksten, und warum?",
          "Wo macht das Drama Nachgeschichte als offene Bedrohung sichtbar?",
          "Wie verhindern die Fälle Seligmann und Hermanns ein pauschales Urteil über die Rückkehr?"
        ]
      },
      {
        resourceId: "im-steinbruch",
        title: "Sekundärtext-Auftrag: Erinnerung als Gegenwartsfrage",
        summary:
          "Lies Kehlmanns Rede parallel zum Schluss des Dramas und prüfe, wie Erinnerung dort nicht beruhigt, sondern politisch offen gehalten wird.",
        task:
          "Verbinde die letzten Szenen des Dramas mit Kehlmanns Überlegungen aus „Im Steinbruch“. Zeige, wie aus Nachgeschichte, Namen und Überlebensspuren eine Form von Erinnerung entsteht, die Verantwortung nicht abschließt.",
        questions: [
          "Welche Aussagen aus „Im Steinbruch“ helfen dir, den offenen Schluss als bewusste ethische Form zu verstehen?",
          "Wo widersetzt sich das Drama einer versöhnlichen Abrundung und hält stattdessen historische Unruhe fest?",
          "Wie verändert der Sekundärtext deine Deutung der letzten Passagen im Hinblick auf Gegenwart und Verantwortung?"
        ]
      },
      {
        resourceId: "susanne-heim-grenzen",
        title: "Historischer Vertiefungsauftrag: Zwischenräume, Grenzen, Rückweg",
        summary:
          "Der Republik-Text von Susanne Heim verschärft den historischen Blick auf Transit, Grenzregime und das Hin- und Hergeschobensein zwischen Staaten.",
        task:
          "Lies den Schluss des Dramas zusammen mit Susanne Heim. Zeige, wie Rückweg und Verteilung Teil eines Grenzregimes bleiben.",
        questions: [
          "Wie macht die Quelle den Rückweg zur Grenz- und Zuständigkeitskrise?",
          "Wo zeigt das Drama strukturelles Feststecken statt bloßer Verzweiflung?",
          "Wie verändert diese Perspektive deine Deutung der scheinbaren Rettung?"
        ]
      },
      {
        resourceId: "ndr-st-louis",
        title: "Chronologie-Auftrag: Antwerpen und die begrenzte Rettung",
        summary:
          "Der NDR-Beitrag macht sichtbar, wie die Ankunft in Antwerpen nicht das Ende der Gefahr, sondern nur eine späte und brüchige Verteilung markiert.",
        task:
          "Arbeite mit dem NDR-Beitrag, um den Schluss historisch genau einzuordnen. Zeige, wie das Stück Erleichterung und fortgesetzte Gefährdung zusammenhält.",
        questions: [
          "Was ändert Antwerpen tatsächlich und was bleibt offen?",
          "Warum verhindert die Chronologie ein Happy-End-Lesen des Schlusses?",
          "Welche Nachgeschichte wird dadurch im Drama besonders scharf?"
        ]
      },
      {
        resourceId: "fritz-buff-reisebericht",
        title: "Primärquellen-Auftrag: Hoffnung, Angst und Erleichterung von innen",
        summary:
          "Fritz Buffs Bericht zeigt den Rückweg und die Nachricht von Antwerpen aus einer Passagierperspektive, die die letzten Szenen des Dramas historisch und emotional verdichtet.",
        task:
          "Vergleiche den Schluss des Dramas mit Fritz Buffs Bericht. Arbeite die Spannung zwischen Erleichterung, Unsicherheit und späterer Bedrohung heraus.",
        questions: [
          "Welche Formulierung des Berichts schärft das Ende des Dramas am stärksten?",
          "Wo unterscheidet sich Buffs Binnenperspektive von der epischen Anlage des Dramas?",
          "Wie verändert die Primärquelle deine Bewertung des Schlusses?"
        ]
      }
    ]
  },
  {
    id: "lesson-11-kehlmann-haltung",
    title: "Lektion 11 · Kehlmanns Haltung und persönliche Involvierung",
    summary:
      "Kehlmann als Autor des Stoffs: Verdichtung, Verantwortung, Erinnerungskultur und Gegenwartsbezug mit Podcast und „Im Steinbruch“.",
    entryIds: ["havanna-3", "diplomatie-3", "diplomatie-4", "rueckweg-4"],
    moduleIds: ["havanna", "diplomatie", "rueckweg"],
    reviewFocus: "Arbeite daran, wie Kehlmann historische Stoffbearbeitung, ethische Verantwortung und persönliche Haltung im Drama lesbar macht.",
    sebPrompt:
      "Beziehe die Passagen ausdrücklich auf Kehlmanns Aussagen aus dem Interview und aus „Im Steinbruch“. Zeige, wie sein Zugang zu Geschichte, Kunst und Gegenwart das Drama prägt.",
    recommendedTheoryIds: ["gute-geschichte", "im-steinbruch", "werkueberblick"],
    resourceAssignments: [
      {
        resourceId: "gute-geschichte",
        title: "Podcast-Auftrag: Verdichtung und Verantwortung",
        summary:
          "Der Podcast wird hier nicht ergänzend, sondern als Deutungsschlüssel genutzt: Wie spricht Kehlmann über Erzählen, Auswahl und Formung von Wirklichkeit?",
        task:
          "Arbeite mit dem Podcast wie mit einem Sekundärtext zur Werkpoetik. Zeige an den ausgewählten Szenen, wie Kehlmann historische Wirklichkeit dramatisch verdichtet, ohne sie in bloße Nacherzählung oder Sensation zu verwandeln.",
        questions: [
          "Welche Aussagen Kehlmanns über gute Geschichten helfen dir, den Szenenbau des Dramas genauer zu verstehen?",
          "Wo wird sichtbar, dass das Drama auswählt, rhythmisiert und zuspitzt, um Verantwortung lesbar zu machen?",
          "Wie verhindert die Form des Stücks, dass der historische Stoff bloß illustriert oder emotional konsumierbar wird?"
        ]
      },
      {
        resourceId: "im-steinbruch",
        title: "Sekundärtext-Auftrag: Haltung, Erinnerung und Gegenwart",
        summary:
          "„Im Steinbruch“ macht Kehlmanns persönliche Position zu Kunst, Gedenken und politischer Gegenwart sichtbar und soll direkt mitgelesen werden.",
        task:
          "Vergleiche die Rede mit den Passagen der Lektion. Arbeite heraus, wie Kehlmann Erinnerung nicht museal denkt, sondern als gegenwärtige Zumutung und ethische Verpflichtung.",
        questions: [
          "Welche Begriffe oder Gedanken aus „Im Steinbruch“ kehren im Drama als Haltung des Autors wieder?",
          "Wie verbinden sich im Stück historische Fakten, poetische Form und gegenwärtige Verantwortung?",
          "An welchen Stellen wird deutlich, dass Kehlmann persönliche Involvierung nicht sentimental, sondern analytisch und politisch gestaltet?"
        ]
      },
      {
        resourceId: "evian-deutschlandfunk",
        title: "Kontextauftrag: Historische Analyse als Werkhintergrund",
        summary:
          "Die Deutschlandfunk-Rezension zu Jochen Thies schärft die Frage, welche historischen Sprach- und Verantwortungsmuster Kehlmann im Drama sichtbar macht.",
        task:
          "Nutze die Quelle als historischen Resonanzraum für Kehlmanns Autorhaltung. Zeige, wie das Drama nicht nur Geschichte erzählt, sondern Mechanismen internationaler Verweigerung, Sprachverharmlosung und politischer Untätigkeit aufdeckt.",
        questions: [
          "Welche Punkte aus dem DLF-Beitrag kehren im Drama als strukturelle Kritik wieder?",
          "Wie passt Kehlmanns ästhetische Verdichtung zu einer historischen Analyse, die auf Protokolle, Reden und Sprachformen blickt?",
          "Wo wird sichtbar, dass persönliche Involvierung bei Kehlmann nicht vom historischen Befund getrennt ist?"
        ]
      }
    ]
  },
  {
    id: "lesson-12-theaterformen",
    title: "Lektion 12 · Episches Theater und Dokumentartheater",
    summary:
      "Theorieeinheit zu den beiden zentralen Theaterformen des Dramas mit gezielten Vergleichspassagen über das ganze Werk.",
    entryIds: ["abfahrt-1", "zwischenraum-2", "havanna-1", "diplomatie-1", "rueckweg-4"],
    moduleIds: ["abfahrt", "zwischenraum", "havanna", "diplomatie", "rueckweg"],
    reviewFocus: "Vergleiche genau, wo das Stück dokumentarisch arbeitet und wo es epische Distanz, Kommentar und Verfremdung erzeugt.",
    sebPrompt:
      "Ordne die ausgewählten Passagen systematisch epischem Theater und Dokumentartheater zu. Zeige am Wortlaut, an der Figurenführung und an der Zuschaueradressierung, welche Verfahren dominieren.",
    recommendedTheoryIds: ["dokumentartheater", "episches-theater", "im-steinbruch"],
    resourceAssignments: [
      {
        resourceId: "dokumentartheater",
        title: "Theorie-Auftrag: Dokumentartheater",
        summary:
          "Das Video dient hier als Analysefolie dafür, wie historische Faktizität, reale Personen und protokollnahe Sprache auf der Bühne wirksam werden.",
        task:
          "Ordne die ausgewählten Passagen gezielt dokumentarischen Verfahren zu. Zeige, wo das Stück historische Realität ausstellt, statt sie in rein private Fiktion aufzulösen.",
        questions: [
          "Welche Szenen wirken wie historisch belegte Konstellationen, Berichte oder Akten auf der Bühne?",
          "Wie arbeitet das Drama mit Authentizität, ohne bloß dokumentarisch trocken zu werden?",
          "Wo wird sichtbar, dass Figuren auch Träger historischer Aussagen und Strukturen sind?"
        ]
      },
      {
        resourceId: "episches-theater",
        title: "Theorie-Auftrag: Episches Theater",
        summary:
          "Das Video wird hier als konkrete Vergleichsfolie für Verfremdung, Kommentar und politische Zuschaueradressierung verwendet.",
        task:
          "Prüfe an denselben Passagen, wo das Drama episch arbeitet: also Distanz erzeugt, kommentiert, montiert und das Publikum zum Urteil zwingt.",
        questions: [
          "Welche Verfahren verhindern bloßes Mitleiden und verschieben die Wahrnehmung in Richtung Analyse?",
          "Wo erzeugt das Stück Distanz statt psychologischer Verschmelzung?",
          "Wie helfen Montage, direkte Redeformen oder Perspektivwechsel dabei, politische Strukturen sichtbar zu machen?"
        ]
      },
      {
        resourceId: "im-steinbruch",
        title: "Transfer-Auftrag: Warum diese Form politisch notwendig ist",
        summary:
          "Mit Kehlmanns Rede lässt sich fragen, warum gerade dokumentarische und epische Mittel für diesen Stoff angemessen sind.",
        task:
          "Verbinde die beiden Theatermodelle mit Kehlmanns Rede. Zeige, weshalb diese Form des Erinnerns und Darstellens für einen Stoff wie die St. Louis nicht ästhetisch neutral sein kann.",
        questions: [
          "Wie stützt „Im Steinbruch“ die Wahl einer Form, die Distanz, Schärfe und politische Offenheit erzeugt?",
          "Warum wäre ein rein geschlossenes, versöhnliches Drama für diesen Stoff problematisch?",
          "Wie hängen Theaterform und ethischer Anspruch des Stücks zusammen?"
        ]
      }
    ]
  },
  {
    id: "lesson-13-evian-grenzen-verantwortung",
    title: "Lektion 13 · Évian, Grenzen und internationale Verantwortung",
    summary:
      "Historische Vertiefung zu Konferenzlogik, Grenzregime und politischer Unterlassung als Unterbau des Dramas.",
    entryIds: ["havanna-2", "havanna-3", "diplomatie-3", "rueckweg-1", "rueckweg-4"],
    moduleIds: ["havanna", "diplomatie", "rueckweg"],
    reviewFocus: "Arbeite historisch präzise heraus, wie das Drama internationale Verweigerung, Grenzpolitik und Zuständigkeitsverschiebung sichtbar macht.",
    sebPrompt:
      "Verbinde die ausgewählten Passagen ausdrücklich mit Évian 1938, mit der Sprache des politischen Ausweichens und mit historischen Grenzregimen. Zeige, wie das Drama diese Zusammenhänge verdichtet.",
    recommendedTheoryIds: ["evian-konferenz", "evian-deutschlandfunk", "ushmm-voyage", "ushmm-return-europe", "susanne-heim-grenzen", "ndr-st-louis", "fritz-buff-reisebericht", "historischer-kontext"],
    resourceAssignments: [
      {
        resourceId: "evian-konferenz",
        title: "Historisches Dossier: Évian 1938 als Vorentscheidung",
        summary:
          "Die Konferenz von Évian wird hier als Vorkonstellation des Dramas gelesen: internationale Beratung, fast keine Aufnahmebereitschaft und institutionalisierte Ohnmacht.",
        task:
          "Zeige an den Passagen der Lektion, dass die St. Louis nicht an einem Einzelfall scheitert, sondern an einer etablierten Politik verweigerter Aufnahme.",
        questions: [
          "Welches Detail aus Évian hilft dir am stärksten, Havanna historisch vorzuprägen?",
          "Warum ist die Ergebnislosigkeit der Konferenz für das Drama zentral?",
          "Wie macht das Stück aus dieser Struktur eine Bühnensituation?"
        ]
      },
      {
        resourceId: "evian-deutschlandfunk",
        title: "Audio- und Quellenauftrag: Sprache des Verrats",
        summary:
          "Der Deutschlandfunk-Beitrag schärft die sprachkritische Dimension: Antisemitismus, Beschönigung, Nicht-Benennung und Arbeitsmarktargumente prägen die Verweigerung.",
        task:
          "Arbeite heraus, wie das Drama dieselbe Sprache des Ausweichens und Nicht-Benennens inszeniert wie der Deutschlandfunk-Beitrag.",
        questions: [
          "Welche Formulierung im Drama entspricht dem Muster des Nicht-Offen-Sprechens?",
          "Wie wird Unterlassung sprachlich kaschiert oder sachlich verkleidet?",
          "Warum ist diese Sprache historisch so wichtig wie die Entscheidung selbst?"
        ]
      },
      {
        resourceId: "susanne-heim-grenzen",
        title: "Grenzregime-Auftrag: Transit, Warten, Feststecken",
        summary:
          "Mit Susanne Heim wird die Erfahrung vertieft, zwischen Grenzen, Zuständigkeiten und politischen Räumen hin- und hergeschoben zu werden.",
        task:
          "Verbinde den Republik-Text mit den ausgewählten Szenen. Zeige, wie Transit, Warten und Rückweg als Grenzregime erscheinen.",
        questions: [
          "Wo zeigt das Drama Feststecken zwischen politischen Räumen besonders deutlich?",
          "Wie verändert die Quelle dein Verständnis von Grenze?",
          "Welche Passage zeigt am klarsten, dass Sichtbarkeit und Aufnahme nicht identisch sind?"
        ]
      },
      {
        resourceId: "ndr-st-louis",
        title: "Chronologie-Auftrag: Die historische Sequenz der Verweigerung",
        summary:
          "Die NDR-Chronologie verbindet die Reisephasen zu einer zusammenhängenden Struktur internationaler Verantwortungslosigkeit.",
        task:
          "Arbeite die ausgewählten Passagen entlang der realen Reisebewegung durch. Zeige, wie aus Hamburg, Havanna, Florida und Antwerpen eine Dramaturgie der verweigerten Aufnahme entsteht.",
        questions: [
          "Welche Stationen des NDR-Artikels ruft die Lektion auf?",
          "Wie macht die Chronologie Unterlassung als Prozess sichtbar?",
          "Wo wird aus geografischer Bewegung moralische Sackgasse?"
        ]
      },
      {
        resourceId: "ushmm-voyage",
        title: "USHMM-Auftrag: Politisch bekannte Krise statt Einzelfall",
        summary:
          "Das USHMM-Dossier zeigt, dass die Reise schon vor Havanna von Machtkampf, ungültigen Papieren und informierten Behörden geprägt war. Damit wirkt die St. Louis als Strukturfall, nicht als überraschender Unfall.",
        task:
          "Prüfe die Lektion mit dem USHMM-Dossier gegen ein Einzelfall-Lesen. Arbeite heraus, wie das Drama politische Vorstruktur und sichtbare Blockade zusammenführt.",
        questions: [
          "Welche historische Vorentscheidung musst du nennen, um die Passage präzise zu verorten?",
          "Wo wird aus einer Verwaltungsentscheidung eine existenzielle Krise?",
          "Wie macht das Stück aus bekannter Gefahr trotzdem öffentliches Wegsehen?"
        ]
      },
      {
        resourceId: "ushmm-return-europe",
        title: "USHMM-Auftrag: Verteilung statt Lösung",
        summary:
          "Die Rückkehr nach Europa zeigt, dass auch die spätere Aufnahme in vier Ländern nur vorläufig, kontrolliert und ohne Präzedenzwirkung erfolgt.",
        task:
          "Nutze das USHMM-Dossier, um die Lektion nicht nur als Hafen- oder Diplomatieszene, sondern als Beginn einer prekären europäischen Verteilung zu lesen.",
        questions: [
          "Wie verändert die Verteilungslogik deine Sicht auf die diplomatischen Szenen?",
          "Warum ist vorläufiges Asyl nicht mit Sicherheit gleichzusetzen?",
          "Wo deutet das Drama schon an, dass nach der Rückkehr keine Ruhe eintritt?"
        ]
      },
      {
        resourceId: "fritz-buff-reisebericht",
        title: "Primärquellen-Auftrag: Passagierstimme gegen Abstraktion",
        summary:
          "Fritz Buffs Reisebericht gibt der historischen Analyse eine unmittelbare Stimme und verhindert, dass Grenz- und Konferenzpolitik zu abstrakt gelesen wird.",
        task:
          "Verbinde die Lektion mit Fritz Buffs Bericht. Zeige, wie politische Entscheidungen als konkrete Erfahrung an Bord sichtbar werden.",
        questions: [
          "Welche Stelle des Berichts macht politische Entscheidung als Erfahrung sichtbar?",
          "Wo arbeitet das Drama stärker verdichtend oder montierend als die Primärquelle?",
          "Wie verändert Buffs Perspektive deine historische Deutung der Lektion?"
        ]
      }
    ]
  },
  {
    id: "lesson-14-fritz-buff-primärquelle",
    title: "Lektion 14 · Fritz Buff, NDR-Chronologie und historische Nahperspektive",
    summary:
      "Primärquellen-Einheit mit Reisebericht, Bilddokumenten, Soundfile und historischer Chronologie zur St. Louis. Fritz Buff war dabei erst 17 und allein unterwegs.",
    entryIds: ["abfahrt-1", "havanna-3", "rueckweg-2", "rueckweg-4"],
    moduleIds: ["abfahrt", "havanna", "rueckweg"],
    reviewFocus: "Arbeite präzise mit Primärquelle, Chronologie und Dramentext zusammen und zeige, wie das Stück historische Erfahrung zugleich verdichtet und erweitert. Behalte dabei im Blick, dass Fritz Buff als 17-Jähriger allein reiste und damit jünger war als manche Lerngruppenmitglieder.",
    sebPrompt:
      "Verbinde die ausgewählten Passagen ausdrücklich mit Fritz Buffs Reisebericht, mit den Bildseiten und mit der NDR-Chronologie. Zeige, wie das Drama Binnenperspektive und historische Gesamtbewegung zusammenführt, und arbeite ausdrücklich heraus, welche Wirkung es hat, dass Buff erst 17 war und allein reiste.",
    recommendedTheoryIds: ["fritz-buff-reisebericht", "gerda-blachmann", "bilddossier-reise", "ndr-st-louis", "historischer-kontext"],
    resourceAssignments: [
      {
        resourceId: "fritz-buff-reisebericht",
        title: "Primärquellenauftrag: Reisebericht, Bildseiten und Soundfile",
        summary:
          "Der Reisebericht von Fritz Buff führt in die Binnenperspektive der Passagiere und lässt sich direkt mit ausgewählten Szenen des Dramas vergleichen. Entscheidend ist dabei, dass Buff erst 17 war und allein reiste.",
        task:
          "Nutze Bildseiten, Bericht und Soundfile, um die Passagen historisch und perspektivisch zu schärfen. Zeige, wie Hoffen, Warten, Gerüchte und Erleichterung verdichtet werden, und arbeite ausdrücklich mit dem Umstand, dass Fritz Buff als 17-Jähriger allein unterwegs war.",
        questions: [
          "Welche Stimmungslagen der Quelle kehren im Drama wieder?",
          "Wie verändert es deine Lektüre, dass Fritz Buff erst 17 war und ohne Familie reiste?",
          "Wo übernimmt das Stück die Passagierperspektive, wo formt es sie um?",
          "Welche Bild- oder Tonspur schärft die Passage am stärksten?"
        ]
      },
      {
        resourceId: "gerda-blachmann",
        title: "Videostimmen-Auftrag: Gerda Blachmann und die Erfahrung des Wartens",
        summary:
          "Gerda Blachmanns Video bringt Depression, Hoffnung, Suizidversuch, Newsletter an Bord und die Lichter von Miami in eine knappe, eindringliche Binnenperspektive. Dadurch lässt sich die St.-Louis-Erfahrung noch enger an die Passagierwahrnehmung binden.",
        task:
          "Öffne ausdrücklich das Gerda-Blachmann-Video und verbinde ihre Erinnerung mit den ausgewählten Passagen. Zeige, wie Angst, Hoffnung und politische Blockade aus Passagiersicht erlebt werden.",
        questions: [
          "Welches Detail aus Gerdas Erinnerung schärft deine Passage am stärksten?",
          "Wie verändert die Videostimme deinen Blick auf das Warten an Bord?",
          "Wo stimmen Gerda und Fritz Buff überein, wo setzen sie andere Akzente?"
        ]
      },
      {
        resourceId: "ndr-st-louis",
        title: "Chronologieauftrag: Historische Orientierung",
        summary:
          "Die NDR-Chronologie ordnet die Binnenperspektive Fritz Buffs in den größeren Bewegungsverlauf der Irrfahrt ein.",
        task:
          "Verbinde den Reisebericht mit der NDR-Chronologie. Zeige, wie persönliche Erfahrung und politische Ereignisfolge ineinandergreifen.",
        questions: [
          "Welche Station der Irrfahrt steht hinter den ausgewählten Passagen?",
          "Wie verhindert die Chronologie ein isoliertes Lesen von Buffs Bericht?",
          "Wo macht das Drama aus historischer Abfolge politische Zuspitzung?"
        ]
      },
      {
        resourceId: "bilddossier-reise",
        title: "Bildauftrag: Schiff, Passagiere und Kapitän noch einmal zusammendenken",
        summary:
          "Die Bilder der St. Louis, der Passagiere und Schröders bündeln Raum, Verantwortung und Ausgeliefertsein in einer eigenen visuellen Spur.",
        task:
          "Verbinde die Schluss- und Rückwegspassagen mit dem Bilddossier. Zeige, wie sich in den Bildern Bordraum, Blickbeziehung und Verantwortungsfigur noch einmal zuspitzen.",
        questions: [
          "Welches Bild schärft die Schluss- oder Rückwegspassage am stärksten?",
          "Wie verändert sich dein Blick auf Schröder, wenn du sein Porträt mit der Passage zusammendenkst?",
          "Wie machen die Bilder Passagierperspektive und Ausgeliefertsein sichtbarer?"
        ]
      }
    ]
  },
  {
    id: "lesson-15-ushmm-nachgeschichte",
    title: "Lektion 15 · USHMM, Gerda Blachmann und die Nachgeschichte der Passagiere",
    summary:
      "USHMM-Schlusseinheit zur gesamten St.-Louis-Bewegung: politische Vorstruktur, Gerda Blachmanns Videostimme, die Verteilung nach Europa und die ungleichen Kriegsschicksale der Passagiere.",
    entryIds: ["havanna-3", "diplomatie-4", "rueckweg-2", "rueckweg-4"],
    moduleIds: ["havanna", "diplomatie", "rueckweg"],
    reviewFocus: "Verbinde die dramatische Krise mit ihrer Nachgeschichte: Gerda Blachmann, Verteilung auf vier Länder, blockierte Fluchtwege, ungleiche Überlebenschancen und die offene Verantwortung des Schlusses.",
    sebPrompt:
      "Arbeite die ausgewählten Passagen zusammen mit den USHMM-Dossiers durch. Zeige präzise, wie Havanna, Rückkehr nach Europa, provisorische Aufnahme, spätere Besatzung und Kriegsschicksale ineinandergreifen. Nutze ausdrücklich Gerdas Videostimme und mindestens eine der zentralen Zahlen zur Nachgeschichte.",
    recommendedTheoryIds: ["ushmm-voyage", "gerda-blachmann", "ushmm-return-europe", "ushmm-wartime-fate", "fritz-buff-reisebericht", "ndr-st-louis"],
    resourceAssignments: [
      {
        resourceId: "ushmm-voyage",
        title: "USHMM-Auftrag: Die St. Louis als vorbereitete Krise",
        summary:
          "Die Reise beginnt nicht erst mit der sichtbaren Blockade in Havanna. Das Dossier macht deutlich, wie ungültige Papiere, kubanischer Machtkampf und informierte Behörden den Verlauf vorprägen.",
        task:
          "Arbeite mit dem USHMM-Dossier zur Reise und zeige, wie das Drama aus bekannter politischer Vorstruktur eine Bühnensituation der späten Erkenntnis macht.",
        questions: [
          "Welche historische Vorentscheidung musst du nennen, um die Passage präzise zu rahmen?",
          "Wie macht das Drama sichtbar, dass Wissen vorhanden ist, Rettung aber ausbleibt?",
          "Wo wird aus Reiseorganisation politische Falle?"
        ]
      },
      {
        resourceId: "gerda-blachmann",
        title: "Videostimmen-Auftrag: Gerda Blachmann als Binnenperspektive",
        summary:
          "Gerda Blachmann verdichtet Angst, Hoffnung, Depression, den Suizidversuch an Bord, die Newsletter und die Lichter von Miami zu einer Erinnerung, die den politischen Stoff von innen her lesbar macht.",
        task:
          "Nutze Gerdas Video als zentrale Quelle der Lektion. Zeige, wie ihre Erinnerung die ausgewählten Passagen auflädt und wie sie den Weg von Havanna zur europäischen Nachgeschichte öffnet.",
        questions: [
          "Welches Detail aus Gerdas Aussage musst du in deine Deutung aufnehmen?",
          "Wie verändert der Blick auf die Lichter von Miami deine Lesart der Passage?",
          "Warum ist die Videostimme analytisch mehr als bloße Illustration?"
        ]
      },
      {
        resourceId: "ushmm-return-europe",
        title: "USHMM-Auftrag: Verteilung auf vier Länder",
        summary:
          "Die Rückkehr nach Europa wird hier als administrative, prekäre und ungleiche Verteilung lesbar: Großbritannien, Frankreich, Belgien und die Niederlande nehmen auf, aber nur vorläufig und ausdrücklich ohne Präzedenzfall.",
        task:
          "Arbeite die Passage mit der Verteilungslogik des USHMM-Dossiers durch. Benenne die vier Länder und erkläre, warum diese Verteilung historisch keine Entwarnung bedeutet.",
        questions: [
          "Welche vier Länder musst du nennen, um die Nachgeschichte korrekt zu erfassen?",
          "Wie macht die Quelle die Aufnahme als provisorische Lösung sichtbar?",
          "Wo trägt die Passage schon die spätere Gefährdung in sich?"
        ]
      },
      {
        resourceId: "ushmm-wartime-fate",
        title: "USHMM-Auftrag: 532, 278, 254 und die ungleichen Schicksale",
        summary:
          "Das Dossier verfolgt, wie sich die scheinbare Rettung in sehr unterschiedliche Kriegsschicksale auflöst. Die Zahlen und die Fälle Seligmann und Hermanns schärfen das Ende des Dramas historisch radikal nach.",
        task:
          "Binde mindestens eine Zahl und einen Fallvergleich aus dem USHMM-Dossier in deine Deutung ein. Zeige, wie das Drama aus offener Form und Nachgeschichte eine besonders harte politische Erinnerung macht.",
        questions: [
          "Welche der Zahlen 532, 278 und 254 musst du in deiner Antwort erklären?",
          "Was zeigt der Vergleich von Seligmann und Hermanns über Zuflucht, Bürokratie und Gefahr?",
          "Warum verhindert diese Nachgeschichte ein beruhigendes Schlusslesen des Dramas?"
        ]
      }
    ]
  }
];

export const starterPrompt = {
  title: "Arbeitsauftrag",
  items: [
    "Arbeite das Drama entlang von fünfzehn eng geführten Lektionen im eingebetteten PDF durch und notiere Beobachtungen immer szenennah.",
    "Sichere zuerst Wortlaut, Rollenrede, Regieanweisung oder Bühnenkonstellation, bevor du deutest.",
    "Nutze pro Passage mindestens eine Linse: historischer Kontext, Dokumentartheater, episches Theater, Dramengang oder Kehlmanns Sekundärtext.",
    "Ziehe in den erweiterten Theorie-Lektionen ausdrücklich die Dropbox-Ressourcen zu Kehlmann, Dokumentartheater und epischem Theater heran.",
    "Nutze für die historische Vertiefung zusätzlich die Dossiers zu Évian, den Deutschlandfunk-Beitrag samt Audio-Link, den NDR-Überblick, Fritz Buffs Reisebericht mit Bildseiten und Soundfile, die USHMM-Dossiers zur Reise, zur Rückkehr nach Europa und zu den Kriegsschicksalen sowie Gerdas Blachmanns Videostimme und den Text von Susanne Heim.",
    "Halte im Revisionsfeld fest, welche Deutung du nach erneuter Lektüre schärfen oder gegenlesen willst."
  ]
};

export const pdfSource = "/reader/assets/die-reise-der-verlorenen.pdf";

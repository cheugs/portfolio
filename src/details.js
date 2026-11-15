// The detailed sheet shown when a project or an experience is opened.
// Each sheet has: what (the project), how (the steps), tools (name + what it is used for), results.

const L = (fr, en) => ({ fr, en });

// Same order as `projects` in content.js
export const projectDetails = [
  {
    // Smart City
    what: L(
      'Une ville reçoit en continu les mesures de ses capteurs routiers et les positions de ses bus et tramways. Le centre de mobilité doit savoir en quelques secondes où le trafic ralentit, quelles lignes sont en retard et quels capteurs ne répondent plus. J’ai construit la plateforme qui transforme ce flux imparfait en indicateurs fiables. Les données sont simulées : 60 capteurs et 5 lignes de bus et tram.',
      'A city receives a continuous flow of readings from its road sensors and positions from its buses and trams. The mobility centre must know within seconds where traffic is slowing, which lines are late and which sensors have gone silent. I built the platform that turns this imperfect flow into reliable indicators. The data is simulated: 60 sensors and 5 bus and tram lines.'
    ),
    how: [
      L('Un programme Python simule les capteurs et les véhicules, avec des défauts volontaires : retards, doublons, valeurs impossibles.', 'A Python program simulates the sensors and vehicles, with deliberate flaws: late data, duplicates, impossible values.'),
      L('Les événements sont lus en continu, vérifiés, dédoublonnés et regroupés par minute.', 'Events are read continuously, checked, de-duplicated and grouped by minute.'),
      L('Chaque mesure est rattachée à la bonne rue et au bon quartier grâce à des jointures géographiques.', 'Each reading is attached to the right street and district with geographic joins.'),
      L('Un capteur silencieux est détecté et suivi comme un incident, de son ouverture à sa fermeture.', 'A silent sensor is detected and tracked as an incident, from opening to closing.'),
    ],
    tools: [
      ['Kafka', L('reçoit le flux d’événements', 'receives the stream of events')],
      ['PySpark Structured Streaming', L('traite les données en continu', 'processes the data continuously')],
      ['PostgreSQL + PostGIS', L('stocke les résultats et la carte de la ville', 'stores the results and the city map')],
      ['Airflow', L('lance les traitements planifiés et les contrôles qualité', 'runs the scheduled jobs and quality checks')],
      ['Grafana', L('surveille le pipeline', 'monitors the pipeline')],
      ['FastAPI', L('sert le tableau de bord web', 'serves the web dashboard')],
      ['Docker', L('lance toute la chaîne en une commande', 'starts the whole chain with one command')],
    ],
    results: [
      L('1 000 000 d’événements traités avec 0 perte et 0 doublon', '1,000,000 events processed with 0 lost and 0 duplicated'),
      L('1 300 à 1 800 événements par seconde de bout en bout', '1,300 to 1,800 events per second end to end'),
      L('Latence médiane d’environ 4,3 secondes en charge normale', 'Median latency of about 4.3 seconds under normal load'),
      L('Reprise après panne sans perte ni double comptage', 'Recovery after a crash with no loss and no double counting'),
      L('72 tests automatisés et 10 contrôles qualité, relancés à chaque modification', '72 automated tests and 10 quality checks, rerun on every change'),
    ],
  },
  {
    // Real-time financial
    what: L(
      'Les banques et sociétés de paiement doivent savoir en quelques secondes combien d’argent circule et si une activité semble inhabituelle. J’ai construit un pipeline qui transforme un flux de paiements imparfait en chiffres fiables : chaque paiement est compté une seule fois, dans la minute où il a vraiment eu lieu. Les paiements sont fictifs.',
      'Banks and payment companies need to know within seconds how much money is moving and whether some activity looks unusual. I built a pipeline that turns an imperfect flow of payments into reliable figures: each payment is counted once, in the minute it really happened. The payments are fictional.'
    ),
    how: [
      L('Un programme Python envoie de faux paiements par carte, y compris des doublons, des retards et des messages cassés.', 'A Python program sends fake card payments, including duplicates, late arrivals and broken messages.'),
      L('Les paiements sont vérifiés, dédoublonnés, convertis en euros et comptés par minute.', 'Payments are checked, de-duplicated, converted to euros and counted per minute.'),
      L('Les données invalides sont mises de côté avec leur motif, au lieu d’être perdues.', 'Invalid data is set aside with its reason instead of being lost.'),
      L('Un tableau de bord affiche les volumes, les délais et les alertes en direct.', 'A dashboard shows volumes, delays and alerts live.'),
    ],
    tools: [
      ['Kafka', L('reçoit le flux de paiements', 'receives the stream of payments')],
      ['PySpark Structured Streaming', L('traite les paiements en continu', 'processes payments continuously')],
      ['PostgreSQL', L('stocke les résultats', 'stores the results')],
      ['dbt', L('construit les tables d’analyse', 'builds the analysis tables')],
      ['Streamlit', L('affiche le tableau de bord en direct', 'displays the live dashboard')],
      ['Docker', L('lance l’ensemble en une commande', 'starts everything with one command')],
    ],
    results: [
      L('Environ 3 000 événements par seconde de bout en bout, sur un ordinateur portable', 'About 3,000 events per second end to end, on a laptop'),
      L('1 000 000 d’événements traités avec 0 perte et 0 doublon', '1,000,000 events processed with 0 lost and 0 duplicated'),
      L('Latence médiane de 2,5 secondes', 'Median latency of 2.5 seconds'),
      L('Aucune transaction perdue ou comptée deux fois après une panne', 'No transaction lost or counted twice after a crash'),
      L('52 tests automatisés et 26 tests de données', '52 automated tests and 26 data tests'),
    ],
  },
  {
    // Retail warehouse
    what: L(
      'Dans une chaîne de magasins, les données sont éparpillées : la caisse connaît les ventes, le stock connaît les quantités, les achats connaissent les commandes. Pour savoir pourquoi un rayon est vide, il faut tout croiser. J’ai construit l’entrepôt de données qui réunit tout cela pour une chaîne simulée de 6 magasins, 150 produits et 12 fournisseurs.',
      'In a retail chain, data is scattered: the till knows sales, the stock system knows quantities, purchasing knows orders. To find out why a shelf is empty, you have to cross it all. I built the data warehouse that brings this together for a simulated chain of 6 shops, 150 products and 12 suppliers.'
    ),
    how: [
      L('Chaque jour, les fichiers de ventes, de stock, de commandes et de livraisons sont chargés automatiquement.', 'Every day, the sales, stock, order and delivery files are loaded automatically.'),
      L('Les données sont nettoyées et organisées en schéma en étoile : 3 tables de faits et 4 dimensions.', 'The data is cleaned and organised as a star schema: 3 fact tables and 4 dimensions.'),
      L('L’historique des prix et des fournisseurs est conservé, pour appliquer le bon prix à la bonne date.', 'Price and supplier history is kept, so the right price applies on the right date.'),
      L('Les totaux de l’entrepôt sont comparés à ceux de la source, pour prouver que rien ne se perd.', 'The warehouse totals are compared with the source totals, to prove nothing is lost.'),
    ],
    tools: [
      ['dbt', L('nettoie et transforme les données', 'cleans and transforms the data')],
      ['PostgreSQL', L('héberge l’entrepôt', 'hosts the warehouse')],
      ['Airflow', L('orchestre le chargement quotidien', 'orchestrates the daily load')],
      ['GitHub Actions', L('met à jour la démo en ligne chaque matin', 'refreshes the live demo every morning')],
      ['Docker', L('lance toute la chaîne en local', 'runs the whole chain locally')],
      ['Python', L('simule les magasins et charge les fichiers', 'simulates the shops and loads the files')],
    ],
    results: [
      L('14 contrôles de rapprochement sur 14 validés', '14 out of 14 reconciliation checks pass'),
      L('Trois réponses métier : où le stock manque, quels fournisseurs livrent à l’heure, à quelle vitesse le stock tourne', 'Three business answers: where stock is missing, which suppliers deliver on time, how fast stock turns'),
      L('Environ 161 000 lignes de vente et 77 000 relevés de stock traités', 'About 161,000 sales lines and 77,000 stock readings processed'),
      L('Tableau de bord en ligne, rafraîchi automatiquement chaque matin', 'Live dashboard, refreshed automatically every morning'),
      L('36 tests automatisés et 48 tests de données', '36 automated tests and 48 data tests'),
    ],
  },
  {
    // Electricity
    what: L(
      'Un réseau électrique doit prévoir la consommation du lendemain pour produire ni trop ni trop peu. J’ai étudié comment la météo, le calendrier et la demande passée influencent la consommation et la production renouvelable en Allemagne, puis j’ai construit des modèles pour les prévoir. Données publiques réelles, de 2015 à 2019.',
      'A power grid has to forecast the next day’s consumption to produce neither too much nor too little. I studied how weather, the calendar and past demand influence consumption and renewable production in Germany, then built models to forecast them. Real public data, 2015 to 2019.'
    ),
    how: [
      L('Récupération des données horaires du réseau et de la météo via deux API ouvertes, puis nettoyage et fusion.', 'Collected hourly grid and weather data from two open APIs, then cleaned and merged it.'),
      L('Analyse des saisons, des jours de la semaine et des pics de demande.', 'Analysed seasons, weekdays and demand peaks.'),
      L('Comparaison de plusieurs modèles, entraînés sur 2015 à 2018 et testés sur 2019.', 'Compared several models, trained on 2015 to 2018 and tested on 2019.'),
      L('Traduction des erreurs de prévision en besoins de réserve pour le réseau.', 'Translated forecast errors into reserve requirements for the grid.'),
    ],
    tools: [
      ['Python + pandas', L('collecte et préparation des données', 'data collection and preparation')],
      ['XGBoost', L('le modèle de prévision final', 'the final forecasting model')],
      ['SARIMA (statsmodels)', L('le modèle statistique de comparaison', 'the statistical model used for comparison')],
      ['Jupyter', L('le notebook d’analyse, en français et en anglais', 'the analysis notebook, in French and English')],
    ],
    results: [
      L('1,9 % d’erreur sur la demande du lendemain, contre 4,3 % pour la référence naïve et 2,6 % pour SARIMA', '1.9% error on next-day demand, against 4.3% for the naive baseline and 2.6% for SARIMA'),
      L('Réserve nécessaire réduite de 256 à 66 GWh par jour grâce à de meilleures prévisions', 'Required reserve cut from 256 to 66 GWh per day thanks to better forecasts'),
      L('Pour l’éolien et le solaire, les données météo divisent l’erreur par deux', 'For wind and solar, weather data halves the error'),
      L('Constat : le dimanche, la demande est 22 % plus basse qu’en semaine', 'Finding: on Sundays, demand is 22% lower than on weekdays'),
    ],
  },
  {
    // Credit risk
    what: L(
      'Quels facteurs sont liés au défaut de remboursement, et comment une banque peut-elle évaluer équitablement ses clients ? J’ai analysé 1 000 vrais crédits bancaires (données publiques) et construit un modèle transparent, testé sur des clients qu’il n’avait jamais vus, avec un audit d’équité.',
      'Which factors are linked to loan default, and how can a bank assess its customers fairly? I analysed 1,000 real bank loans (public data) and built a transparent model, tested on customers it had never seen, with a fairness audit.'
    ),
    how: [
      L('Nettoyage des données et correction d’une erreur dans la documentation d’origine, repérée parce que les premiers résultats n’avaient pas de sens.', 'Cleaned the data and fixed an error in the original documentation, spotted because the first results made no sense.'),
      L('Tests statistiques pour identifier les facteurs réellement liés au défaut.', 'Statistical tests to identify the factors genuinely linked to default.'),
      L('Modèle simple et explicable, avec un seuil de décision fondé sur les coûts réels pour la banque.', 'A simple, explainable model, with a decision threshold based on real costs for the bank.'),
      L('Explication de chaque décision et audit d’équité par tranche d’âge.', 'Explanation of each decision and a fairness audit by age group.'),
    ],
    tools: [
      ['Python + pandas', L('préparation des données', 'data preparation')],
      ['SQL (SQLite)', L('requêtes d’analyse', 'analysis queries')],
      ['SciPy + statsmodels', L('tests statistiques', 'statistical tests')],
      ['scikit-learn', L('le modèle de prédiction', 'the prediction model')],
      ['SHAP', L('explique chaque décision du modèle', 'explains each decision of the model')],
    ],
    results: [
      L('Le modèle classe correctement 4 paires de clients sur 5 (ROC-AUC de 0,80)', 'The model ranks 4 out of 5 customer pairs correctly (ROC-AUC of 0.80)'),
      L('Le seuil choisi réduit les pertes de 22 % par rapport à la meilleure règle simple', 'The chosen threshold cuts losses by 22% compared with the best simple rule'),
      L('Le taux de défaut passe de 6,5 % pour le groupe le plus sûr à 62,5 % pour le plus risqué', 'The default rate goes from 6.5% for the safest group to 62.5% for the riskiest'),
      L('L’audit montre un écart lié à l’âge : 28 % d’acceptation pour les moins de 25 ans, contre 43 % pour les autres', 'The audit shows an age gap: 28% acceptance for under-25s, against 43% for others'),
      L('Rapport complet en français et en anglais', 'Full report in French and English'),
    ],
  },
  {
    // Climate
    what: L(
      'Les régions au climat le plus extrême sont-elles aussi celles où le développement humain est le plus faible ? J’ai comparé 105 régions en France, en Inde et aux États-Unis (1,8 milliard d’habitants) à partir de données publiques : NASA, Banque mondiale, Commission européenne.',
      'Are the regions with the most extreme climate also those with the lowest human development? I compared 105 regions in France, India and the USA (1.8 billion people) using public data: NASA, World Bank, European Commission.'
    ),
    how: [
      L('Collecte automatique de 5 sources publiques, avec contrôles de qualité.', 'Automatic collection from 5 public sources, with quality checks.'),
      L('Construction d’un indice de risque par région : aléa climatique, population exposée, vulnérabilité.', 'Built a risk index per region: climate hazard, exposed population, vulnerability.'),
      L('Trois hypothèses testées statistiquement, en comparant aussi chaque région à celles de son propre pays.', 'Three hypotheses tested statistically, also comparing each region with those of its own country.'),
      L('Tableau de bord interactif, 11 cartes et un rapport en deux langues.', 'Interactive dashboard, 11 maps and a report in two languages.'),
    ],
    tools: [
      ['Python + pandas', L('collecte et analyse', 'collection and analysis')],
      ['GeoPandas + PostGIS', L('cartes et calculs géographiques', 'maps and geographic calculations')],
      ['SciPy + statsmodels', L('tests statistiques', 'statistical tests')],
      ['Plotly Dash', L('le tableau de bord en ligne', 'the live dashboard')],
      ['Docker', L('rend l’analyse reproductible en une commande', 'makes the analysis reproducible with one command')],
    ],
    results: [
      L('Les régions les plus exposées au climat sont moins développées : indice médian de 0,79 contre 0,94', 'The most climate-exposed regions are less developed: median index of 0.79 against 0.94'),
      L('L’essentiel de l’écart se situe entre les pays : à l’intérieur d’un pays, le lien est environ quatre fois plus faible', 'Most of the gap is between countries: inside a country, the link is about four times weaker'),
      L('Les dix régions les plus à risque sont toutes en Inde', 'The ten most at-risk regions are all in India'),
      L('Classement solide : trois formules différentes donnent au moins 9 des 10 mêmes régions en tête', 'A robust ranking: three different formulas give at least 9 of the same top 10 regions'),
      L('33 tests automatisés et un tableau de bord accessible en ligne', '33 automated tests and a dashboard available online'),
    ],
  },
  {
    // Intelligent Document Processing (in progress)
    what: L(
      'Dans une compagnie d’assurance ou un cabinet comptable, des personnes passent des heures à recopier des factures, des reçus et des dossiers de sinistre. Ce projet, en cours de réalisation, lit ces documents à leur place, en extrait les informations utiles et signale ce qui manque ou ne colle pas, pour qu’un humain ne vérifie que les cas douteux.',
      'In an insurance company or an accounting firm, people spend hours retyping invoices, receipts and claim documents. This project, currently in progress, reads those documents for them, extracts the useful information and flags what is missing or inconsistent, so a person only checks the doubtful cases.'
    ),
    how: [
      L('Lecture du document, qu’il soit numérique ou scanné, puis extraction des champs : montant, date, numéro, nom.', 'Reads the document, digital or scanned, then extracts the fields: amount, date, number, name.'),
      L('Chaque information doit respecter un format strict ; sinon elle est rejetée et l’extraction est relancée.', 'Each piece of information must match a strict format; otherwise it is rejected and the extraction is retried.'),
      L('Un score de confiance décide : au-dessus du seuil, c’est validé ; en dessous, le document part dans une file de relecture humaine.', 'A confidence score decides: above the threshold it is accepted; below it, the document goes to a human review queue.'),
      L('Chaque valeur extraite garde la référence de l’endroit du document d’où elle vient, pour pouvoir la vérifier.', 'Each extracted value keeps a reference to where in the document it came from, so it can be checked.'),
    ],
    tools: [
      ['Python + FastAPI', L('l’API qui reçoit et traite les documents', 'the API that receives and processes the documents')],
      ['OCR', L('lit le texte des documents scannés', 'reads the text of scanned documents')],
      ['LLM', L('comprend le document et en sort des données structurées', 'understands the document and outputs structured data')],
      ['Pydantic', L('vérifie que chaque donnée a le bon format', 'checks that each value has the right format')],
      ['PostgreSQL', L('stocke les documents traités et la file de relecture', 'stores processed documents and the review queue')],
      ['Docker', L('lance l’ensemble en une commande', 'starts everything with one command')],
    ],
    results: [
      L('Une API de traitement de documents et une interface de relecture', 'A document-processing API and a review interface'),
      L('Testées sur un jeu de documents annotés à la main', 'Tested on a hand-labelled set of documents'),
      L('Mesures prévues : précision et rappel champ par champ, taux de correspondance exacte', 'Planned measures: precision and recall field by field, exact-match rate'),
      L('Mesures prévues : coût par document et part des documents corrigés par un humain', 'Planned measures: cost per document and share of documents corrected by a person'),
    ],
  },
  {
    // Workforce analytics (in progress)
    what: L(
      'Quand trop de salariés quittent une entreprise, il faut comprendre où, quand et pourquoi avant d’agir. Ce projet, en cours de réalisation, étudie les départs, le recrutement, l’absentéisme et la fidélisation dans les différents services d’une entreprise. Les données sont synthétiques ou anonymisées.',
      'When too many employees leave a company, you need to understand where, when and why before acting. This project, currently in progress, studies departures, recruitment, absenteeism and retention across a company’s departments. The data is synthetic or anonymised.'
    ),
    how: [
      L('Calcul des indicateurs RH : taux de départ, ancienneté, étapes du recrutement.', 'Computes the HR indicators: attrition rate, tenure, hiring funnel.'),
      L('Analyse par cohorte : suivre dans le temps les salariés arrivés à la même période.', 'Cohort analysis: follows over time the employees who joined in the same period.'),
      L('Comparaison par service et par sous-groupe, pour ne pas tirer de conclusion d’une simple moyenne.', 'Comparison by department and subgroup, so no conclusion rests on a simple average.'),
      L('Distinction claire entre ce qui est lié aux départs et ce qui les cause réellement.', 'A clear distinction between what is linked to departures and what actually causes them.'),
    ],
    tools: [
      ['SQL', L('interroge les données RH', 'queries the HR data')],
      ['Python + pandas', L('nettoyage et analyses', 'cleaning and analysis')],
      ['Power BI', L('le tableau de bord', 'the dashboard')],
      ['Excel', L('vérifications et tableaux de synthèse', 'checks and summary tables')],
    ],
    results: [
      L('Un tableau de bord RH : départs, ancienneté, recrutement, absentéisme', 'An HR dashboard: departures, tenure, recruitment, absenteeism'),
      L('Des recommandations appuyées sur l’analyse par sous-groupe', 'Recommendations grounded in subgroup analysis'),
      L('Une démarche responsable : les caractéristiques sensibles des salariés ne servent pas d’indicateurs de performance', 'A responsible approach: sensitive employee attributes are not used as performance indicators'),
    ],
  },
  {
    // Logistics analytics (in progress)
    what: L(
      'Un colis en retard coûte de l’argent et un client. Ce projet, en cours de réalisation, cherche où et pourquoi les livraisons prennent du retard : traitement des commandes, coûts d’expédition, performance de chaque transporteur.',
      'A late parcel costs money and a customer. This project, currently in progress, looks for where and why deliveries run late: order fulfilment, shipping costs, the performance of each carrier.'
    ),
    how: [
      L('Calcul des indicateurs clés : taux de livraison à l’heure, durée du cycle de commande, coût par livraison.', 'Computes the key indicators: on-time delivery rate, order cycle time, cost per delivery.'),
      L('Vérification du respect des engagements de service (SLA) par transporteur.', 'Checks whether service commitments (SLA) are met, carrier by carrier.'),
      L('Comparaison par transporteur et par région pour repérer les goulets d’étranglement.', 'Comparison by carrier and by region to spot the bottlenecks.'),
      L('Analyse détaillée des retards : où ils se produisent et à quelle étape.', 'Detailed delay analysis: where they happen and at which step.'),
    ],
    tools: [
      ['SQL', L('interroge les données de commandes et de livraisons', 'queries the order and delivery data')],
      ['Python + pandas', L('nettoyage et analyses', 'cleaning and analysis')],
      ['Power BI', L('le tableau de bord', 'the dashboard')],
      ['Excel', L('vérifications et tableaux de synthèse', 'checks and summary tables')],
    ],
    results: [
      L('Un tableau de bord des opérations avec l’analyse des retards', 'An operations dashboard with delay analysis'),
      L('Des comparaisons par transporteur et par région', 'Comparisons by carrier and by region'),
      L('Des recommandations concrètes pour améliorer le niveau de service', 'Practical recommendations to improve service levels'),
    ],
  },
];

// Same order as `more` in content.js
export const teamDetails = [
  {
    // Logistics
    what: L(
      'Une plateforme de livraison et de suivi de colis, réalisée en équipe de 5. Une seule application web sert trois types d’utilisateurs : les clients qui envoient et suivent leurs colis, les livreurs qui les transportent et les administrateurs qui supervisent l’ensemble.',
      'A parcel delivery and tracking platform, built in a team of 5. One web application serves three kinds of users: customers who send and follow parcels, delivery agents who carry them and administrators who supervise everything.'
    ),
    how: [
      L('J’ai construit l’interface web : espace client, tableau de bord des livreurs et tableau de bord administrateur.', 'I built the web interface: customer area, delivery-agent dashboard and administrator dashboard.'),
      L('Envoi de colis en plusieurs étapes guidées, avec calcul du prix et suivi sur une carte.', 'A guided, step-by-step parcel form, with price calculation and tracking on a map.'),
      L('Accès sécurisé selon le rôle : chaque utilisateur ne voit que son espace.', 'Role-based secure access: each user only sees their own area.'),
      L('J’ai aussi contribué à des fonctionnalités du backend, organisé en microservices Java.', 'I also contributed features to the backend, organised as Java microservices.'),
    ],
    tools: [
      ['Angular + TypeScript', L('l’application web', 'the web application')],
      ['Leaflet + OpenStreetMap', L('les cartes de suivi', 'the tracking maps')],
      ['JWT', L('la connexion sécurisée et les rôles', 'secure sign-in and roles')],
      ['Java (microservices)', L('colis, livraison, paiement, notifications', 'parcels, delivery, payment, notifications')],
      ['Docker Compose', L('lance tous les services ensemble', 'starts all the services together')],
      ['Vitest', L('les tests automatisés', 'the automated tests')],
    ],
    results: [
      L('Trois espaces complets : client, livreur, administrateur', 'Three complete areas: customer, agent, administrator'),
      L('29 fichiers de tests sur l’interface', '29 test files on the interface'),
      L('Un aperçu de l’interface publié en ligne', 'A preview of the interface published online'),
    ],
  },
  {
    // Gestion immobilière
    what: L(
      'Une application de gestion locative pour trois rôles : super administrateur, propriétaire et locataire. Le propriétaire suit l’occupation de ses logements et les loyers ; le locataire retrouve son contrat et ses quittances.',
      'A rental management application for three roles: super administrator, owner and tenant. The owner follows room occupancy and rents; the tenant finds their contract and receipts.'
    ),
    how: [
      L('J’ai construit l’interface Angular, organisée par fonctionnalité.', 'I built the Angular interface, organised by feature.'),
      L('Pages propriétaire : occupation des chambres, impayés et relances.', 'Owner pages: room occupancy, arrears and reminders.'),
      L('Pages locataire, avec génération des contrats et des quittances de loyer en PDF.', 'Tenant pages, with contracts and rent receipts generated as PDF.'),
      L('J’ai aussi contribué à des fonctionnalités du backend Java.', 'I also contributed features to the Java backend.'),
    ],
    tools: [
      ['Angular + TypeScript', L('l’interface web', 'the web interface')],
      ['Java (Maven)', L('le backend', 'the backend')],
      ['SQL', L('la base de données', 'the database')],
    ],
    results: [
      L('Authentification et parcours complets pour les trois rôles', 'Authentication and complete flows for the three roles'),
      L('Contrats et quittances générés en PDF', 'Contracts and receipts generated as PDF'),
      L('Suivi des impayés avec relances', 'Arrears tracking with reminders'),
    ],
  },
  {
    // MeetIn
    what: L(
      'Un système de réservation de salles de réunion pour les entreprises, développé en équipe.',
      'A meeting-room booking system for companies, built in a team.'
    ),
    how: [
      L('J’ai conçu et développé le côté administrateur de l’interface.', 'I designed and built the administrator side of the interface.'),
      L('Tableau de bord, gestion des utilisateurs, des salles et des réservations.', 'Dashboard, plus user, room and booking management.'),
      L('J’ai aussi contribué à des fonctionnalités du backend Java.', 'I also contributed features to the Java backend.'),
    ],
    tools: [
      ['Angular + TypeScript', L('l’interface web', 'the web interface')],
      ['Java', L('le backend', 'the backend')],
    ],
    results: [
      L('Un espace administrateur complet : tableau de bord, utilisateurs, salles, réservations', 'A complete admin area: dashboard, users, rooms, bookings'),
    ],
  },
  {
    // EQuiz
    what: L(
      'Une plateforme de quiz en ligne pour une école ou une université, avec un tableau de bord web, une application mobile et un backend. Le personnel y prépare les quiz, gère la banque de questions, organise les cours et consulte les réponses des étudiants.',
      'An online quiz platform for a school or university, with a web dashboard, a mobile app and a backend. Staff use it to prepare quizzes, manage the question bank, organise courses and read students’ answers.'
    ),
    how: [
      L('J’ai construit le tableau de bord d’administration web, en neuf sections.', 'I built the web administration dashboard, in nine sections.'),
      L('Chaque section est un module chargé uniquement quand on l’ouvre.', 'Each section is a module loaded only when it is opened.'),
      L('Contrôle d’accès par rôle, avec une section réservée au super administrateur.', 'Role-based access control, with one section reserved for the super administrator.'),
      L('J’ai aussi contribué à des fonctionnalités du backend.', 'I also contributed features to the backend.'),
    ],
    tools: [
      ['Angular + TypeScript', L('le tableau de bord', 'the dashboard')],
      ['Angular Material', L('les composants d’interface', 'the interface components')],
      ['Chart.js', L('les graphiques', 'the charts')],
      ['JWT', L('la connexion et les rôles', 'sign-in and roles')],
      ['Angular SSR', L('le rendu côté serveur', 'server-side rendering')],
    ],
    results: [
      L('Neuf sections : quiz, banque de questions, cours, étudiants, réponses, notifications, utilisateurs…', 'Nine sections: quizzes, question bank, courses, students, answers, notifications, users…'),
      L('Quatre types de questions : choix multiple, vrai/faux, réponse courte, rédaction', 'Four question types: multiple choice, true/false, short answer, essay'),
    ],
  },
  {
    // Online reservation
    what: L(
      'Une application web de réservation, développée avec Spring Boot en équipe de 4.',
      'A web reservation application, built with Spring Boot in a team of 4.'
    ),
    how: [
      L('J’ai travaillé sur les maquettes des pages et l’interface utilisateur.', 'I worked on the page designs and the user interface.'),
      L('J’ai aussi contribué à des fonctionnalités du backend Spring Boot.', 'I also contributed features to the Spring Boot backend.'),
    ],
    tools: [
      ['Spring Boot + Java', L('l’application et sa logique', 'the application and its logic')],
      ['HTML', L('les pages', 'the pages')],
    ],
    results: [L('Une application de réservation fonctionnelle, livrée en équipe', 'A working reservation application, delivered as a team')],
  },
];

// Keyed by position in `timeline` in content.js
export const xpDetails = {
  4: {
    // Openxtech
    what: L(
      'Stage de quatre mois à Yaoundé. J’ai conçu un middleware d’intelligence artificielle pour Blucash, une plateforme fintech : une couche qui se place entre l’application et les modèles de langage, pour que les utilisateurs obtiennent des réponses en posant simplement leurs questions.',
      'A four-month internship in Yaoundé. I designed an artificial intelligence middleware for Blucash, a fintech platform: a layer that sits between the application and the language models, so users get answers simply by asking their questions.'
    ),
    how: [
      L('Assistant RAG : il répond en langage naturel à partir de la documentation interne.', 'RAG assistant: it answers in plain language from the internal documentation.'),
      L('Analytique en langage naturel : la question de l’utilisateur est traduite en requête SQL, puis le résultat lui est restitué.', 'Plain-language analytics: the user’s question is translated into a SQL query, then the result is returned to them.'),
      L('Tableau de bord d’administration : gestion de la base de connaissances, des sources de données et suivi de l’activité.', 'Admin dashboard: management of the knowledge base and data sources, plus activity monitoring.'),
      L('Architecture backend, développement des API, base de données, tests, documentation et déploiement cloud.', 'Backend architecture, API development, database, tests, documentation and cloud deployment.'),
    ],
    tools: [
      ['RAG', L('recherche dans les documents, puis génération de la réponse', 'searches the documents, then generates the answer')],
      ['Embeddings + recherche vectorielle et hybride', L('retrouvent les bons passages', 'find the right passages')],
      ['Reranking', L('classe les passages les plus utiles en premier', 'ranks the most useful passages first')],
      ['LLM', L('rédige la réponse', 'writes the answer')],
      ['Text-to-SQL', L('transforme une question en requête', 'turns a question into a query')],
      ['SQL', L('la base de données', 'the database')],
    ],
    results: [
      L('Un assistant qui répond à partir des documents de l’entreprise', 'An assistant that answers from the company’s documents'),
      L('Des analyses accessibles sans écrire de SQL', 'Analytics available without writing SQL'),
      L('Un tableau de bord pour piloter l’ensemble', 'A dashboard to manage it all'),
    ],
  },
  3: {
    // ITIAD
    what: L(
      'Poste à temps partiel et à distance pendant quatre mois, en parallèle de mes études. J’ai contribué au développement d’une application web au sein d’une équipe.',
      'A part-time, remote position for four months, alongside my studies. I contributed to the development of a web application within a team.'
    ),
    how: [
      L('Développement de nouvelles fonctionnalités et correction de bugs à partir de spécifications.', 'Built new features and fixed bugs from specifications.'),
      L('Travail par tickets avec le chef de projet : priorisation, suivi, points d’avancement.', 'Ticket-based work with the project manager: prioritisation, tracking, progress updates.'),
      L('Demandes de fusion et revues de code avec l’équipe.', 'Merge requests and code reviews with the team.'),
    ],
    tools: [
      ['Next.js (React)', L('l’interface', 'the interface')],
      ['NestJS', L('le backend', 'the backend')],
      ['GitLab', L('tickets, demandes de fusion, revues de code', 'tickets, merge requests, code reviews')],
      ['Git', L('le travail en équipe sur le code', 'team work on the code')],
    ],
    results: [
      L('Des fonctionnalités livrées en méthode agile, dans une équipe à distance', 'Features delivered with an agile workflow, in a remote team'),
      L('Une habitude du travail asynchrone et des revues de code', 'A habit of asynchronous work and code reviews'),
    ],
  },
  2: {
    // Vision Finance 2024
    what: L(
      'Stage de deux mois à Yaoundé, au département Systèmes d’information et développement. J’étais chargée de concevoir et de développer une application d’archivage.',
      'A two-month internship in Yaoundé, in the Information Systems and Development department. I was responsible for designing and developing an archiving application.'
    ),
    how: [
      L('Conception de l’application et de sa base de données.', 'Designed the application and its database.'),
      L('Système de connexion pour contrôler l’accès aux archives.', 'A sign-in system to control access to the archives.'),
      L('Gestion et organisation des documents.', 'Document management and organisation.'),
    ],
    tools: [
      ['C#', L('l’application', 'the application')],
      ['SQL', L('la base de données', 'the database')],
    ],
    results: [L('Une application d’archivage avec accès sécurisé, pour mieux organiser les documents', 'An archiving application with secure access, to organise documents better')],
  },
  1: {
    // Vision Finance 2023
    what: L(
      'Premier stage, deux mois à Yaoundé, au service de maintenance informatique.',
      'First internship, two months in Yaoundé, in the IT maintenance service.'
    ),
    how: [
      L('Diagnostic et résolution de pannes matérielles et logicielles.', 'Diagnosed and fixed hardware and software problems.'),
      L('Suivi du bon fonctionnement des postes et soutien aux équipes.', 'Kept workstations running and supported the teams.'),
    ],
    tools: [],
    results: [L('Une première expérience du terrain et du support aux utilisateurs', 'A first experience of field work and user support')],
  },
};

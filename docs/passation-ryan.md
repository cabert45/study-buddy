# Passation — Ryan (3e année), état au 26 septembre 2026

Pour la prochaine session. Écrit à la fin d'une session du 22 au 26 sept. 2026.
Tout ce qui est chiffré ici vient de la base ou d'un test rejoué, pas de mémoire.

---

## 1. Ce que le parent veut vraiment

Sa phrase, le 24 sept. : **« Je suis fatigué. Dans ma tête. C'est une lutte de
le faire s'asseoir, mais quand il s'assoit, tu devrais déjà savoir quoi
travailler avec lui. »**

C'est la commande. Tout le reste en découle :

- **Ne lui faire prendre aucune décision.** Proposer, trancher, annoncer.
- **Quand Ryan s'assoit, l'app sait déjà quoi faire.** C'est le rôle du Coach
  (« Ma semaine » sur son écran d'accueil).
- Il écrit en anglais, l'app est en français. **Lui répondre en anglais.**

Règles posées le 20 sept. et toujours valides (voir `app-structure-quotidienne`
en mémoire) : 1 h/jour la semaine, 2 h la fin de semaine, aucune pause, la
liste AVANT les exercices, l'accueil doit rester court.

**Il pleure quand il se trompe.** Ça n'est pas une note de couleur, c'est une
contrainte de conception : une correction commence par ce qu'il a réussi, puis
au plus deux erreurs expliquées, puis les oublis en une ligne neutre. Un mur de
rouge est un bug, même si chaque ligne est exacte.

---

## 2. Où il en est, mesuré

Cumul : **2 145 / 2 524**. Source : `/api/progress?profile=ryan`.

**Les plus faibles** (≥ 10 réponses) :

| catégorie | score | |
|---|---|---|
| `terme` | 27/54 | 50 % |
| `passe_compose` | 84/128 | 66 % |
| `dictee` | 14/21 | 67 % |
| `t1_nom` | 12/18 | 67 % |
| `t1_determinant` | 37/55 | 67 % |
| `present_indicatif` | 59/83 | 71 % |
| `relational` | 41/56 | 73 % |

**Les plus fortes** : `strategies` 30/30, `mental` 45/45, `adjectif` 54/54,
`english_oral` 75/76.

### Le piège à connaître avant de croire ces chiffres

`matcha_nombres` affiche **30/34 (88 %)**. Sur la feuille papier du même sujet
(Matcha AS.1.02), il a fait **environ 4/13**.

L'écart n'est pas lui. Mesuré dans le générateur :

- `lettres_chiffres` lui donne **quatre réponses à choisir**. La feuille demande
  d'écrire dans une case vide. Reconnaître *8504* parmi quatre n'est pas la même
  compétence que le produire.
- `ajouter` ne posait que des consignes **à une seule étape**. La feuille en
  demande deux (« ajoute 2 um **ET** 4 dizaines »). C'est exactement la question
  qu'il a ratée, et l'app ne la lui avait jamais posée. (Corrigé : type
  `ajouter_deux`.)

**Conséquence pour la suite : tout score de l'app sur une compétence de
production est optimiste tant que la réponse est un choix multiple.**

**Corrigé le 26 sept.** — ces questions-là se tapent maintenant (voir §3). Mais
les chiffres ci-dessus, eux, **mélangent les deux régimes**: tout ce qui a été
répondu avant le 26 septembre a été CHOISI parmi quatre. Ne pas comparer un
pourcentage d'octobre à un pourcentage de septembre sans le savoir; le vrai
niveau de départ, ce sont ses feuilles papier, pas la base.

### Ses trois malentendus, vus sur ses vraies feuilles

1. **Quelle lettre est muette.** Il sait qu'il y en a une, il ne trie pas
   laquelle. Sur la liste 2 il a mis *gentil* (l), *rond* (d) et *renard* (d)
   dans la colonne du « t ». → 3/6.
2. **Il n'échange pas à 10.** Dix plaques, pour lui, c'est « dix », pas
   « mille ». Quatre questions de la feuille Matcha perdues pour cette seule
   raison (4b, 4c, 4d, 4e).
3. **Il fait la moitié d'une consigne à deux temps.** 2 358 au lieu de 2 398 :
   il a ajouté les milliers et laissé tomber les dizaines. Exactement 40
   d'écart. Même réflexe dans son cahier de français.

---

## 3. Ce qui a été construit (et qui marche)

- **Les réponses de production se TAPENT, dans le moteur quotidien** (26 sept.).
  C'était le point 1 de la liste ci-dessous; il est fait. Voir
  `utils/reponseTapee.js`, branché dans `PracticeSession.jsx`.
  - Ce qui n'a plus de choix: `terme` (sa catégorie la plus faible), `mental`,
    `relational`, les 11 types de production de `matcha_nombres` (blocs, jetons,
    abaque, tableau, lettres→chiffres, ajouter, ajouter_deux, groupements,
    sacs, valeur de position, plus grand/plus petit), et la conjugaison écrite
    (`passe_compose` conjugate_er/etre, `present_indicatif`, `futur_simple`,
    `futur_etre_avoir`, `conjugaison`). Mesuré: 300/400 questions Matcha,
    400/400 en terme, 137/400 en passé composé.
  - Ce qui garde ses choix, exprès: les questions de CLASSEMENT (`comparer`
    `< > =`, `position_nom`, `ordre`, `auxiliary`, `chiffres_lettres`, les
    terminaisons). Choisir y est la tâche, comme dans le cahier — et taper
    « quatre mille quatre-vingt-dix » serait un test d'orthographe déguisé.
  - Le pavé de chiffres accepte **plus** de chiffres que la bonne réponse: s'il
    écrit 6200 pour « six cent vingt », l'app doit le laisser faire et le lui
    montrer. Une case à la bonne longueur lui soufflerait la réponse.
  - Le champ texte coupe l'autocorrection du téléphone (`autoCorrect`,
    `spellCheck`, `autoCapitalize`) — sinon iOS répare son orthographe et on ne
    mesure plus rien — et offre une rangée d'accents (é è ê à â ç ô î û ’),
    parce que l'accent doit rester une question de français, pas de clavier.
  - Ce qu'on accepte: majuscules, espaces, apostrophe courbe, pronom omis
    (« ai mangé » = « j'ai mangé »). Ce qu'on refuse: l'accent manquant.
  - **La correction commence par « Presque! » quand l'erreur est une des
    siennes** (zéro en trop, colonne vide sans son 0, moitié d'une consigne à
    deux temps, un chiffre à la mauvaise place, à un près). Le bloc passe en
    ambre au lieu du rouge. Il pleure quand il se trompe: un mur de rouge le
    fait fermer l'app, même quand chaque ligne est exacte.
- **Dictée tapée branchée sur ses listes de 3e** — `DicteeFlashcard` accepte les
  clés `ortho_lN` via `dicteeDeLaListe()` dans `data/orthographeQuotidien.js`.
  169 phrases à trou, listes 1 à 10. Mode `dictee_liste` intercepté dans
  `App.startPractice`. **Résultat réel : 10/10 le 24 sept.**
- **`components/Feuille.jsx`** — la feuille Liste 2 du cahier, les 7 questions
  dans l'ordre, une à la fois. Données dans `data/feuilleListe2.js`.
- **`components/FeuilleMatcha.jsx`** — la feuille AS.1.02, avec de vrais blocs
  base 10 (`Numeration.jsx`, dessinés en code) qu'il doit **échanger** avant de
  pouvoir écrire quoi que ce soit. `data/feuilleMatcha.js`.
- **Nouveaux types de questions** dans `generators/orthographe.js` :
  `quelle_muette`, `son_oi`, `adj_masculin`, `alpha_adjectifs` ; et
  `verbe_phrase` dans `generators/infinitif.js`.
- **File d'attente hors-ligne** (`utils/storage.js`) — une session qui ne part
  pas est gardée sur l'appareil et renvoyée plus tard.
- **`docs/semaine-28-sept-2026.html` / `.pdf`** — la feuille papier de la
  semaine du 28. Regénérer avec headless Chrome (commande en tête du commit).

### Bugs corrigés qui valent d'être connus

- **`jumelles` enseignait le faux.** L'app répondait « gentil » à « quel mot a
  des consonnes jumelles » ; c'est *gentille*, les deux l n'existent qu'au
  féminin. Le générateur regarde maintenant la forme au lieu de se fier à
  l'étiquette `jum`.
- **Le score de dictée était gonflé de 1** (un `+ 1` en trop à la fin).
- **Le menu s'ouvrait sur Mathématiques**, donc tout le français était caché
  derrière un onglet — d'où « je ne vois plus les flashcards ».
- **`initDb().then(() => app.listen())`** : une base injoignable empêchait le
  serveur d'écouter. L'app entière tombait en 502 alors que les exercices
  tournent dans le navigateur. Corrigé le 26 sept.

---

## 4. Ce qui reste à faire, par ordre d'utilité

1. ~~Réponses tapées dans le moteur quotidien.~~ **Fait le 26 sept.** (§3).
   Ce qui reste dans cette veine, si on veut aller plus loin: `strategies` et
   `calcul_rapide_3` gardent leurs choix alors que ce sont aussi des
   productions — laissés de côté parce que leurs réponses ne sont pas toutes
   des nombres (« Vrai/Faux », « quelle addition t'aide »), donc il faut les
   trier type par type, comme on l'a fait pour Matcha.
2. **Le moteur de décision** : après chaque session, décider — refaire,
   passer au suivant, changer pour les maths, terminé. Les données par question
   arrivent enfin au serveur, donc c'est possible maintenant.
3. **Prévenir le parent sans qu'il ait à regarder** : un push après une
   session, pas seulement le rappel de 19 h « il n'a rien fait ».
4. **Le tuteur qui parle — porter celui de Nyla vers Ryan.** La plomberie
   (micro, transcription, jugement) est déjà construite et vérifiée. Voir §6.
5. **La barre du haut** : 13 boutons sur deux rangées, contre la règle du parent
   (« l'accueil doit rester court »). En garder 4, le reste dans « ✨ Plus ».

---

## 5. Pièges de l'environnement

- **Plusieurs sessions partagent ce dossier de travail.** Toujours `git add`
  des chemins explicites, jamais `git add -A`. Pendant cette session, une autre
  session travaillait sur Nyla et le Coach. **Et c'est arrivé**: le 26 sept.,
  le commit « Ryan epelle a voix haute » a emporté au passage les fichiers des
  réponses tapées, encore en cours d'écriture dans le dossier. Rien n'est
  perdu, mais l'historique ment sur qui a fait quoi — ne pas s'y fier pour
  comprendre une fonctionnalité, lire le code et ce document.
- **Railway → Neon est instable.** Deux coupures le 26 sept. (ETIMEDOUT en IPv4,
  ENETUNREACH en IPv6, vers les bonnes adresses ; la base répondait très bien
  de l'extérieur). L'app y survit maintenant. Diagnostic en 3 s :
  `curl <app>/api/health`. Si ça se reproduit souvent, la vraie solution est le
  driver HTTP de Neon (port 443 au lieu de 5432).
- **`vite build` ne prouve rien.** Il passe sur des composants qui plantent au
  rendu. Trois scripts, du plus rapide au plus complet:
  - `node scripts/verif-reponses-tapees.mjs` — ce qui se tape, ce qu'on accepte,
    ce qu'on explique. Ne demande rien d'autre que node.
  - `node scripts/verif-session.mjs <url> "Mathématiques||Terme manquant" 6` —
    joue une vraie session dans Chrome. Il a trouvé deux corrections qui
    enseignaient le faux (« la deuxième moitié de la consigne » sur une
    question qui n'en a qu'une; « la colonne vide » à un enfant qui a répondu 1
    au lieu de 10).
  - `scripts/verif-telephone.mjs` — une page, un écran, les débordements. Il a
    trouvé cinq bugs que le build a laissés passer.
- **Il n'y a toujours pas de sauvegarde de la base.** `scripts/backup-db.js`
  vise un fichier SQLite d'avant le passage à Neon.
- **Ne jamais compter des objets sur une image** (les siennes ou celles d'une
  IA) : c'est faux une fois sur deux. Les blocs et les jetons se dessinent en
  code — `Numeration.jsx`.

---

## 6. « Comme Prepara » — la plomberie EXISTE DÉJÀ

Le parent a demandé un tuteur-avatar qui **parle avec** Ryan, comme le
`/parler` de son autre projet.

**Ne repars pas de zéro : une autre session l'a construit pour Nyla le
26 sept. 2026, et ça marche.** Tout est dans ce dépôt :

| pièce | fichier |
|---|---|
| l'écran qui parle et écoute | `components/NylaTuteur.jsx` |
| transcription (ElevenLabs `scribe_v1`) | `POST /api/ecoute` dans `server.js` |
| jugement des réponses ouvertes | `POST /api/oral` dans `server.js` |
| correction locale, sans modèle | `utils/nylaOralCheck.js` |
| la voix qui attend d'avoir fini | `speakAndWait()` dans `utils/speech.js` |

Le montage : la voix pose la question → le micro s'ouvre → `MediaRecorder` →
l'audio brut part en POST → `scribe_v1` → texte → jugement → la voix réagit.
Sans état, rien n'est conservé.

**FAIT VÉRIFIÉ le 26 sept. : la clé ElevenLabs partagée A le droit de
transcrire** (`scribe_v1`, `language_code=fra` → 200). Elle n'a toujours pas
`voices_read` (401). Ne pas re-supposer le contraire — c'est ce qui décidait si
un tuteur parlant était possible du tout.

**Pièges déjà payés, à ne pas repayer :**

- `speak()` est *fire-and-forget*. Sans `speakAndWait()`, le micro s'ouvre
  pendant que l'app parle et la transcription renvoie **la question**.
- Une transcription d'enfant n'est jamais propre : normaliser dur (accents,
  tirets, « euh ») et juger **l'ordre**, pas l'exhaustivité.
- La plupart des questions se jugent **en local, sans Claude**. Le modèle ne
  sert qu'aux questions vraiment ouvertes.
- `ANTHROPIC_API_KEY` du `.env` local fait 26 caractères → 401. Une vraie clé
  en fait ~108. Celle de Railway est bonne.

**Ce qu'il reste pour Ryan**, donc, ce n'est plus la plomberie mais le contenu
et le ton :

- des questions orales de 3e année (la liste de la semaine à l'oral, les verbes,
  la lecture à voix haute) plutôt que compter jusqu'à 20 ;
- reprendre de Prepara les deux règles qui comptent : **on ne corrige jamais
  pendant la conversation** (tout est gardé pour un bilan de fin, formulé comme
  une réécriture) et **un `focus` repris du bilan précédent** ;
- `/api/tutor` existe mais ne parle que de maths et son prompt dit encore
  « Ryan, 7 ans, 2e année ». À corriger en même temps.

Référence d'origine : `Documents/Prepara/app/backend/src/services/conversation.service.js`
et `lib/tts.js`.

## 7. Comptes et accès

- Prod : `https://study-buddy-production-79f1.up.railway.app` — santé :
  `/api/health`.
- Railway CLI déjà connecté (`railway status` → projet `worthy-truth`, service
  `study-buddy`). `railway logs`, `railway redeploy --yes`, `railway variables`.
- **Attention** : `railway variables` imprime les secrets en clair. Le
  26 sept., `ANTHROPIC_API_KEY` et le mot de passe Neon se sont retrouvés dans
  un terminal. Filtrer la sortie, ou n'en lire que les noms.

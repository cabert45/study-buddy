import React, { useEffect, useState } from 'react';
import { getProgress } from '../utils/storage';
import { nylaWeekList } from '../data/nylaFlashcards';
import { sonsList } from '../data/nyla1reAnnee';
import { themeDuJour } from '../data/nylaPlanQuotidien';
import { coachFaitAujourdhui } from '../utils/coachAvancement';
import { CAHIER_THEMES, CAHIER_SEMAINES, moduleCetteSemaine, moduleSemaineProchaine, titreModule } from '../data/cahierFrancais';
import { listeCetteSemaine, semaineCourante, listesVues, cleDictee } from '../data/orthographeQuotidien';
import { strategiesCetteSemaine } from '../data/tablesStrategies';
import { syncSkillStats, weakSkills } from '../utils/skillStats';
import { NotificationBell } from './Notifications';
import { BarChart3, BookOpen, Users, Clock, Moon, Sun, BookMarked, Mic2, Target, ListTodo, Sparkles, GraduationCap, ChevronRight, Send, Calendar, Trophy, RefreshCw, Settings } from 'lucide-react';
import Mascot from './Mascots';
import { useSettings, mascotFor } from '../utils/settings';

// SVG icons for modules — clean, no emojis
const icons = {
  calcul: { bg: '#fef0e4', color: '#c74a15', svg: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="2" width="6" height="14" rx="1" stroke="currentColor" strokeWidth="1.4"/><rect x="10" y="5" width="6" height="11" rx="1" stroke="currentColor" strokeWidth="1.4"/><line x1="4" y1="9" x2="6" y2="9" stroke="currentColor" strokeWidth="1.4"/><line x1="5" y1="8" x2="5" y2="10" stroke="currentColor" strokeWidth="1.4"/></svg> },
  terme: { bg: '#f0ecfb', color: '#6d28d9', svg: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.4"/><text x="9" y="13" textAnchor="middle" fontSize="11" fontWeight="700" fill="currentColor">?</text></svg> },
  multi_step: { bg: '#e6f5f0', color: '#0f766e', svg: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="2" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><rect x="10" y="2" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><rect x="6" y="10" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/></svg> },
  relational: { bg: '#e8eef8', color: '#3a5bc7', svg: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4 13L9 4L14 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><line x1="6" y1="9.5" x2="12" y2="9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg> },
  compare: { bg: '#fef5e4', color: '#b85d1a', svg: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 14L9 4L15 14H3Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/><line x1="7" y1="11" x2="11" y2="11" stroke="currentColor" strokeWidth="1.4"/></svg> },
  pair_impair: { bg: '#fce8ec', color: '#c74a60', svg: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="6.5" cy="9" r="4.5" stroke="currentColor" strokeWidth="1.4"/><circle cx="11.5" cy="9" r="4.5" stroke="currentColor" strokeWidth="1.4"/></svg> },
  mental: { bg: '#eef0f4', color: '#5c6378', svg: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.4"/><path d="M9 4.5V9L12 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg> },
  statistique: { bg: '#e8f5ea', color: '#2d7a3a', svg: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="3" y="11" width="3" height="4.5" rx=".5" fill="currentColor"/><rect x="7.5" y="7.5" width="3" height="8" rx=".5" fill="currentColor"/><rect x="12" y="4" width="3" height="11.5" rx=".5" fill="currentColor"/></svg> },
  dictee: { bg: '#fce8ec', color: '#c74a60', svg: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 3C6 3 4 5 4 7C4 9 6 10 6 12H12C12 10 14 9 14 7C14 5 12 3 9 3Z" stroke="currentColor" strokeWidth="1.4"/><path d="M7 14H11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><path d="M8 16H10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg> },
  determinant: { bg: '#e8eef8', color: '#3a5bc7', svg: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="3" y="3" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.4"/><text x="9" y="13" textAnchor="middle" fontSize="10" fontWeight="700" fill="currentColor">A</text></svg> },
  verbes: { bg: '#f0ecfb', color: '#6d28d9', svg: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4 14L7 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><path d="M7 4L14 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><path d="M10 4V14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg> },
  adjectif: { bg: '#fef0e4', color: '#b85d1a', svg: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="6" r="3" stroke="currentColor" strokeWidth="1.4"/><path d="M4 16C4 12.7 6.2 10.5 9 10.5C11.8 10.5 14 12.7 14 16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg> },
  pemdas: { bg: '#fef0e4', color: '#c74a15', svg: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><text x="9" y="13" textAnchor="middle" fontSize="12" fontWeight="800" fill="currentColor">()</text></svg> },
  accord_etre: { bg: '#fef0e4', color: '#c74a15', svg: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.4"/><circle cx="9" cy="9" r="3" fill="currentColor"/></svg> },
  dictees_group: { bg: '#fce8ec', color: '#c74a60', svg: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 3C6 3 4 5 4 7C4 9 6 10 6 12H12C12 10 14 9 14 7C14 5 12 3 9 3Z" stroke="currentColor" strokeWidth="1.4"/><path d="M7 14H11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><path d="M8 16H10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg> },
  apostrophe: { bg: '#fce8ec', color: '#c74a60', svg: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><text x="9" y="13" textAnchor="middle" fontSize="14" fontWeight="800" fill="currentColor">'</text></svg> },
  m_devant_bmp: { bg: '#e6f5f0', color: '#0f766e', svg: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><text x="9" y="12" textAnchor="middle" fontSize="9" fontWeight="800" fill="currentColor">m+b</text></svg> },
  on_ont: { bg: '#fef5e4', color: '#b85d1a', svg: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><text x="3" y="11" fontSize="7" fontWeight="700" fill="currentColor">ON</text><text x="10" y="11" fontSize="7" fontWeight="700" fill="currentColor">T</text></svg> },
  groupe_nom: { bg: '#e6f5f0', color: '#0f766e', svg: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="6" width="14" height="6" rx="2" stroke="currentColor" strokeWidth="1.4"/><line x1="7" y1="6" x2="7" y2="12" stroke="currentColor" strokeWidth="1" strokeDasharray="2 1"/><line x1="12" y1="6" x2="12" y2="12" stroke="currentColor" strokeWidth="1" strokeDasharray="2 1"/></svg> },
  conjugaison: { bg: '#f0ecfb', color: '#6d28d9', svg: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 5H15M3 9H12M3 13H9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg> },
  futur_simple: { bg: '#e8eef8', color: '#3a5bc7', svg: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M5 9H13M13 9L10 6M13 9L10 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  futur_etre_avoir: { bg: '#fef0e4', color: '#c74a15', svg: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 2L11 7L16 7L12 10L13.5 15L9 12L4.5 15L6 10L2 7L7 7L9 2Z" stroke="currentColor" strokeWidth="1.2" fill="currentColor" fillOpacity="0.15" strokeLinejoin="round"/></svg> },
  passe_compose: { bg: '#f0ecfb', color: '#6d28d9', svg: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M13 9H5M5 9L8 6M5 9L8 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  biographie_jr: { bg: '#e8f5ea', color: '#2d7a3a', svg: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 4C3 3.4 3.4 3 4 3H14C14.6 3 15 3.4 15 4V14C15 14.6 14.6 15 14 15H4C3.4 15 3 14.6 3 14V4Z" stroke="currentColor" strokeWidth="1.4"/><line x1="6" y1="7" x2="12" y2="7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><line x1="6" y1="10" x2="12" y2="10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><line x1="6" y1="13" x2="9" y2="13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg> },
  classe_de_mots: { bg: '#f0ecfb', color: '#6d28d9', svg: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2.5" y="3.5" width="13" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><line x1="2.5" y1="7" x2="15.5" y2="7" stroke="currentColor" strokeWidth="1.4"/><line x1="9" y1="7" x2="9" y2="14.5" stroke="currentColor" strokeWidth="1.4"/></svg> },
  pluriels_cayla: { bg: '#fef0e4', color: '#c74a15', svg: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><text x="3" y="13" fontSize="9" fontWeight="700" fill="currentColor">×s</text><text x="10" y="13" fontSize="9" fontWeight="700" fill="currentColor">×x</text></svg> },
  homophones: { bg: '#fce8ec', color: '#c74a60', svg: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M5 5L13 13M13 5L5 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg> },
  present_indicatif: { bg: '#f0ecfb', color: '#6d28d9', svg: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.4"/><circle cx="9" cy="9" r="1.5" fill="currentColor"/></svg> },
  fractions: { bg: '#e6f5f0', color: '#0f766e', svg: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><text x="9" y="8" textAnchor="middle" fontSize="7" fontWeight="800" fill="currentColor">1</text><line x1="4" y1="9" x2="14" y2="9" stroke="currentColor" strokeWidth="1.4"/><text x="9" y="15" textAnchor="middle" fontSize="7" fontWeight="800" fill="currentColor">2</text></svg> },
  suites: { bg: '#fef0e4', color: '#c74a15', svg: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="4" cy="9" r="1.5" fill="currentColor"/><circle cx="8" cy="9" r="1.5" fill="currentColor"/><circle cx="12" cy="9" r="1.5" fill="currentColor"/><text x="15.5" y="11" fontSize="6" fontWeight="700" fill="currentColor">?</text></svg> },
  mult_div: { bg: '#fce8ec', color: '#c74a60', svg: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><text x="5" y="11" fontSize="9" fontWeight="800" fill="currentColor">×</text><text x="11" y="11" fontSize="9" fontWeight="800" fill="currentColor">÷</text></svg> },
  representer: { bg: '#e8eef8', color: '#3a5bc7', svg: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="3" y="6" width="3" height="9" fill="currentColor"/><rect x="7" y="9" width="3" height="6" fill="currentColor"/><rect x="11" y="3" width="3" height="12" fill="currentColor"/></svg> },
  figures: { bg: '#f0ecfb', color: '#6d28d9', svg: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2.5" y="9" width="5" height="5" stroke="currentColor" strokeWidth="1.4"/><circle cx="13" cy="11.5" r="2.8" stroke="currentColor" strokeWidth="1.4"/><polygon points="9,3 13,8 5,8" stroke="currentColor" strokeWidth="1.4" fill="none"/></svg> },
  mesure: { bg: '#e8f5ea', color: '#2d7a3a', svg: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="6" width="14" height="6" stroke="currentColor" strokeWidth="1.4"/><line x1="5" y1="6" x2="5" y2="9" stroke="currentColor" strokeWidth="1.2"/><line x1="8" y1="6" x2="8" y2="9" stroke="currentColor" strokeWidth="1.2"/><line x1="11" y1="6" x2="11" y2="9" stroke="currentColor" strokeWidth="1.2"/><line x1="14" y1="6" x2="14" y2="9" stroke="currentColor" strokeWidth="1.2"/></svg> },
  pluriels_ryan: { bg: '#fef0e4', color: '#c74a15', svg: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><text x="3" y="13" fontSize="9" fontWeight="700" fill="currentColor">×s</text><text x="10" y="13" fontSize="9" fontWeight="700" fill="currentColor">×x</text></svg> },
  histoire: { bg: '#e6f5f0', color: '#0f766e', svg: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 4C3 3.4 3.4 3 4 3H14C14.6 3 15 3.4 15 4V15L9 12L3 15V4Z" stroke="currentColor" strokeWidth="1.4" fill="none"/></svg> },
  english_oral: { bg: '#e8eef8', color: '#3a5bc7', svg: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.4"/><path d="M2 9H16M9 2C7 4 6 6 6 9C6 12 7 14 9 16C11 14 12 12 12 9C12 6 11 4 9 2Z" stroke="currentColor" strokeWidth="1.2" fill="none"/></svg> },
  mots_savants_jr: { bg: '#f0ecfb', color: '#6d28d9', svg: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 9C7 7 4 6 4 9C4 12 7 13 9 11C11 13 14 12 14 9C14 6 11 7 9 9Z" stroke="currentColor" strokeWidth="1.4" fill="none"/><line x1="9" y1="3" x2="9" y2="9" stroke="currentColor" strokeWidth="1.4"/></svg> },
};

const ryanMathModes = [
  { id: 'mixed', label: 'Pratique ciblée', desc: 'Mix de tous tes exercices', featured: true },
  { id: 'fractions', label: '🍕 Fractions', desc: 'Examen final — nouveau concept', badge: 'Examen' },
  { id: 'mult_div', label: '✖️ Multiplication & division', desc: 'Sens: groupes égaux, partage', badge: 'Examen' },
  { id: 'suites', label: '🔢 Suites & régularités', desc: 'Patterns: trouve le prochain nombre', badge: 'Examen' },
  { id: 'representer', label: '📏 Représenter un nombre', desc: 'Dizaines, unités, décomposition', badge: 'Examen' },
  { id: 'figures', label: '⬜ Figures & solides', desc: 'Carré, cube, cône, cylindre...', badge: 'Examen' },
  { id: 'mesure', label: '📐 Mesure en cm', desc: 'Estimer, comparer, lire la règle', badge: 'Examen' },
  { id: 'calcul', label: 'Calcul', desc: 'Addition et soustraction', badge: 'Priorité' },
  { id: 'terme', label: 'Terme manquant', desc: 'Trouve le nombre mystère', badge: 'Priorité' },
  { id: 'multi_step', label: 'Problèmes', desc: 'Problèmes à étapes', badge: 'À travailler' },
  { id: 'statistique', label: 'Diagrammes', desc: 'Légendes, fin de semaine, totaux' },
  { id: 'relational', label: 'De plus / moins', desc: 'Comparaisons' },
  { id: 'compare', label: 'Compare', desc: '>, < ou =' },
  { id: 'pair_impair', label: 'Pair / Impair', desc: 'Nombres pairs et impairs' },
  { id: 'mental', label: 'Mental', desc: 'Calcul rapide' },
  { id: 'calcul_rapide_3', label: '⚡ Calcul rapide 3 chiffres', desc: '±9 / ±10 sur les centaines — 12/30 au dernier test!', badge: 'Test' },
  { id: 'probabilite', label: '🎲 Probabilité', desc: 'Certain / possible / impossible — 6.5/13 au dernier test', badge: 'Examen' },
];

const ryanFrenchModes = [
  { id: 'biographie_jr', label: '📖 Biographie Jean Rostand', desc: 'CRITIQUE — il faut 90%+ pour passer', featured: true, special: true },
  { id: 'biographie_jr_flashcard', label: '✍️ Biographie — Écris la réponse', desc: 'Flashcard: tape ta réponse, on cycle les manquées', special: true, badge: 'Étude' },
  { id: 'mots_savants_jr', label: '🦋 Mots savants (Insectes/Fleurs)', desc: 'ciseler, discret, prospérer, pattes de mouche — accompagne le test biographie', special: true, badge: 'Critique' },
  { id: 'english_oral', label: '🇬🇧 Anglais — days/months/seasons', desc: 'TEST oral mercredi 13 mai + examen 10 juin', special: true, badge: 'Examen' },
  { id: 'dictee_s1', label: '🎧 Dictée mardi 26 mai', desc: 'Thème 7 S1 — consonnes doubles (arroser, carotte, mettre, patte...)', special: true, badge: 'Mardi' },
  { id: 'dictees_group', label: 'Dictées', desc: 'Thème 7 — toutes les semaines (1, 2, 3, 4, révision)', isGroup: true, special: true },
  { id: 'homophones', label: '🔀 Homophones', desc: 'a/à · et/est · son/sont · ont/on — cahier bleu + examen', badge: 'Examen' },
  { id: 'present_indicatif', label: 'Présent — 1er groupe', desc: 'je chante, tu chantes... — cahier bleu', badge: 'Examen' },
  { id: 'pluriels_ryan', label: 'Pluriel & Féminin', desc: 'chevaux, gâteaux, heureuse, première...', badge: 'Examen' },
  { id: 'histoire', label: "📖 Parties d'une histoire", desc: 'Préparation pour la rédaction (27 mai)', badge: 'Examen' },
  { id: 'comprehension', label: '📖 Compréhension de lecture', desc: 'Lis un texte et réponds — examen vendredi 5 juin', badge: 'Examen' },
  { id: 'futur_etre_avoir', label: '⚡ Futur Être & Avoir', desc: 'TEST mercredi 20 mai — je serai, j\'aurai... (D-T Rouge)', special: true, badge: 'Test mercredi' },
  { id: 'futur_simple', label: 'Futur simple', desc: 'Verbes -er au futur — TEST mercredi 13 mai', special: true },
  { id: 'passe_compose', label: 'Passé composé', desc: 'Verbes -er + finir — révision jeudi' },
  { id: 'francais_mix', label: 'Mix Français', desc: 'Grammaire, verbes, adjectifs' },
  { id: 'determinant', label: 'Déterminants', desc: 'le, la, un, une, mon...' },
  { id: 'verbes', label: 'Verbes', desc: 'être, avoir, aller, faire...' },
  { id: 'adjectif', label: 'Adjectifs', desc: 'Accord et familles de mots' },
  { id: 'on_ont', label: 'ON / ONT', desc: 'Pronom ou verbe avoir?' },
  { id: 'groupe_nom', label: 'Groupe du nom', desc: 'GN: nom seul, dét+nom, dét+nom+adj' },
];

// ===== 3e année (2026-2027) =====
// Rentrée septembre 2026. En attendant les cahiers/le calendrier de la nouvelle
// enseignante, la fenêtre 3e année sert de révision active: on garde les acquis
// de 2e année et on attaque en priorité ce qui a coulé aux examens de juin
// (situations-problèmes 2.95/11, passé composé 9/17, vitesse de calcul).
const grade3MathModes = [
  { id: 'feuille_matcha', label: '📐 Ma feuille de maths', desc: 'Matcha AS.1.02 — échanger les blocs, poser les colonnes', badge: 'À revoir' },
  { id: 'matcha_nombres', label: '📘 Mon cahier Matcha', desc: 'Thème 1 en classe: blocs, valeur de position, nombres jusqu\'à 9 999', featured: true },
  { id: 'mixed', label: 'Pratique ciblée', desc: 'Mix de tous tes exercices' },
  { id: 'multi_step', label: '🧩 Problèmes', desc: 'Problèmes à étapes — le gros morceau de juin', badge: 'Priorité' },
  { id: 'calcul_rapide_3', label: '⚡ Calcul rapide 3 chiffres', desc: 'Garde ta vitesse: ±9 / ±10 sur les centaines', badge: 'Vitesse' },
  { id: 'mult_div', label: '✖️ Multiplication & division', desc: 'La base des tables — au cœur de la 3e année', badge: 'Clé 3e' },
  { id: 'calcul', label: '🔢 Calcul', desc: 'Addition et soustraction avec échange', badge: 'Clé 3e' },
  { id: 'terme', label: '➕ Terme manquant', desc: 'Trouve le nombre mystère' },
  { id: 'fractions', label: '🍕 Fractions', desc: 'Demi, tiers, quart — ça continue en 3e' },
  { id: 'representer', label: '📏 Représenter un nombre', desc: 'Centaines, dizaines, unités, décomposition' },
  { id: 'suites', label: '🔢 Suites & régularités', desc: 'Trouve la règle et le prochain nombre' },
  { id: 'mesure', label: '📐 Mesure en cm', desc: 'Estimer, comparer, lire la règle' },
  { id: 'figures', label: '⬜ Figures & solides', desc: 'Carré, cube, cône, cylindre...' },
  { id: 'statistique', label: '📊 Diagrammes', desc: 'Légendes, tableaux, totaux' },
  { id: 'probabilite', label: '🎲 Probabilité', desc: 'Certain / possible / impossible' },
  { id: 'relational', label: '⚖️ De plus / moins', desc: 'Comparaisons' },
  { id: 'compare', label: '↔️ Compare', desc: '>, < ou =' },
  { id: 'mental', label: '🧠 Mental', desc: 'Calcul rapide' },
];

const grade3FrenchModes = [
  { id: 'dictee_orale', label: '🎙️ Dictée à voix haute', desc: 'Épelle les mots tout haut — le coach t’écoute' },
  { id: 'cahier_jazz', label: '📒 Mon cahier Jazz', desc: 'Ce que tu fais en classe — et un pas d\'avance', featured: true, groupKind: 'cahier' },
  { id: 'feuille_l2', label: '📄 Ma feuille — Liste 2', desc: 'La vraie feuille du cahier, question par question', badge: 'À remettre' },
  { id: 'dictee_liste', label: '🎧 Dictée de la liste', desc: 'La liste, puis tu tapes chaque mot que tu entends', badge: 'Cette semaine' },
  { id: 'dictees_group', label: '🎴 Toutes mes dictées', desc: 'Les listes déjà vues + les dictées de 2e année', isGroup: true },
  { id: 'quatre_classes', label: '🔤 Nom, adjectif ou verbe?', desc: 'Les reconnaître dans une phrase — avec le test qui décide', badge: 'À travailler' },
  { id: 't1_revision', label: '📝 Classes de mots', desc: 'Nom, déterminant, adjectif, verbe, pronom — Thème 1', badge: 'En classe' },
  { id: 'francais_mix', label: 'Mix Français', desc: 'Grammaire, verbes, adjectifs' },
  { id: 'passe_compose', label: '⏪ Passé composé', desc: 'Auxiliaire être/avoir — 9/17 au dernier examen', badge: 'Priorité' },
  { id: 'present_indicatif', label: '✏️ Présent — 1er groupe', desc: 'je chante, tu chantes...' },
  { id: 'futur_simple', label: '➡️ Futur simple', desc: 'Verbes -er au futur' },
  { id: 'homophones', label: '🔀 Homophones', desc: 'a/à · et/est · son/sont · ont/on' },
  { id: 'pluriels_ryan', label: '🔤 Pluriel & Féminin', desc: 'chevaux, gâteaux, heureuse, première...' },
  { id: 'adjectif', label: '🎨 Adjectifs', desc: 'Accord en genre et en nombre' },
  { id: 'groupe_nom', label: '🧱 Groupe du nom', desc: 'GN: dét + nom + adjectif' },
  { id: 'apostrophe', label: "' Apostrophe", desc: "l'ami, j'ai, c'est..." },
  { id: 'm_devant_bmp', label: 'm devant b/m/p', desc: 'tomber, immense, campagne' },
  { id: 'on_ont', label: 'ON / ONT', desc: 'Pronom ou verbe avoir?' },
  { id: 'determinant', label: 'Déterminants', desc: 'le, la, un, une, mon...' },
  { id: 'verbes', label: 'Verbes', desc: 'être, avoir, aller, faire...' },
  { id: 'comprehension', label: '📖 Compréhension de lecture', desc: 'Lis un texte et réponds' },
  { id: 'histoire', label: "📖 Parties d'une histoire", desc: 'Début, milieu, fin — pour la rédaction' },
];

// Été — révision quotidienne (mix des maillons faibles de Ryan)
const summerModes = [
  { id: 'multi_step', label: 'Problèmes', desc: 'Problèmes à étapes' },
  { id: 'calcul_rapide_3', label: '⚡ Calcul rapide', desc: '3 chiffres ±9 / ±10' },
  { id: 'calcul', label: 'Addition', desc: 'Avec échange (retenue)' },
  { id: 'terme', label: 'Terme manquant', desc: 'Le nombre mystère' },
  { id: 'relational', label: 'De plus / moins', desc: 'Comparaisons' },
  { id: 'mult_div', label: 'Multiplication', desc: 'Sens × et ÷' },
  { id: 'suites', label: 'Suites', desc: 'Trouve le prochain' },
  { id: 'passe_compose', label: 'Passé composé', desc: 'Verbes -er + finir' },
  { id: 'homophones', label: 'Homophones', desc: 'a/à · et/est · son/sont' },
  { id: 'adjectif', label: 'Adjectifs', desc: 'Accord féminin/pluriel' },
  { id: 'present_indicatif', label: 'Présent', desc: '1er groupe' },
  { id: 'pluriels_ryan', label: 'Pluriel & féminin', desc: 'chevaux, heureuse...' },
];

const dicteeWeeksList = [
  { id: 'dictee_revision', label: 'Révision TOUTES dictées', desc: 'Préparer la dictée cumulative', highlight: true },
  { id: 'dictee_s1', label: 'Semaine 1 — consonnes doubles', desc: 'arroser, carotte, mettre, patte, cannelle...', current: true },
  { id: 'dictee_s2', label: 'Semaine 2 — lettre muette (féminin)', desc: 'bas/basse, charmant/charmante, haut/haute...' },
  { id: 'dictee_s3', label: 'Semaine 3 — s muet final', desc: 'alors, jamais, parfois, toujours...' },
  { id: 'dictee_s4', label: "Semaine 4 — ne s'écrit pas comme se prononce", desc: 'automne, femme, monsieur, soixante...' },
];

const caylaMathModes = [
  { id: 'pemdas', label: 'PEMDAS', desc: 'Ordre des opérations', featured: true },
];

// Cayla — secondaire 1 depuis sept. 2026. Priorité de la rentrée: les verbes.
const caylaFrenchModes = [
  { id: 'univers_social', label: '🏺 Univers social — Dossier 1', desc: 'La sédentarisation: 29 mots de vocabulaire — TEST bientôt', featured: true, badge: 'Priorité' },
  { id: 'sciences_labo', label: '🧪 Sciences — Instruments de labo', desc: 'Nom + utilité de 14 instruments, les montages — TEST', badge: 'Priorité' },
  { id: 'verbes_avoir_etre', label: '📗 Verbes avoir & être', desc: 'Tous les modes et temps — tableau, écrire, choix multiple' },
  { id: 'conjugaison', label: 'Conjugaison — autres verbes', desc: 'manger, finir, prendre, venir, pouvoir...' },
  { id: 'classe_de_mots', label: '📝 Classe de mots', desc: 'Nom, verbe, adjectif, déterminant, pronom' },
  { id: 'pluriels_cayla', label: 'Pluriels — cas particuliers', desc: 'corail→coraux, chevreuil→chevreuils, les 7 -oux' },
  { id: 'cayla_dictees_group', label: 'Dictées (archive 6e)', desc: "Thème 6 de l'an dernier — révision", isGroup: true },
];

const caylaDicteeWeeksList = [
  { id: 'cayla_t6_s1', label: 'Semaine 1 — son [eur]', desc: 'acteur, danseur, vendeur, courageux...' },
  { id: 'cayla_t6_s2', label: 'Semaine 2 — verbes en -ER', desc: 'conserver, demeurer, déranger...' },
  { id: 'cayla_t6_s3', label: 'Semaine 3 — finales BLE/LE/ME', desc: 'agréable, marmite, vaste...' },
];

// ===== Nyla — maternelle 5 ans (rentrée septembre 2026) =====
// Programme-cycle de l'éducation préscolaire. Les exercices montent en
// difficulté tout seuls (utils/nylaNiveau): un palier s'ouvre quand le
// précédent est solide, donc rien ne reste « trop facile » très longtemps.
const nylaMathModes = [
  { id: 'nyla_numbers_flash', label: '🔢 Mes chiffres (cartes)', desc: 'Reconnaître les nombres — niveaux jusqu\'à 50', featured: true },
  { id: 'nyla_count', label: '🍎 Je compte', desc: 'Jusqu\'à 30, les dés, avant/après, combien il manque' },
  { id: 'nyla_speed', label: '⚡ Calcul rapide', desc: 'Vite vite! Compte, +1, le plus...' },
  { id: 'nyla_compare', label: '⚖️ Plus, moins, autant', desc: 'Compare des groupes et des nombres' },
  { id: 'nyla_addition', label: '➕ Additions (Numberblocks)', desc: 'Compte les blocs — niveaux jusqu\'à 20' },
  { id: 'nyla_add', label: '➖ Ajouter et enlever', desc: 'Il en arrive, il en part, il en reste combien' },
  { id: 'nyla_shapes', label: '⬜ Les formes', desc: 'Figures, côtés, solides, objets du quotidien' },
  { id: 'nyla_tri', label: '🧺 Trier et comparer', desc: 'L\'intrus, le plus gros, le plus long' },
  { id: 'nyla_patterns', label: '🔄 Suites logiques', desc: 'Le motif, le nombre qui manque' },
  { id: 'nyla_saisons', label: '🌦️ Saisons et météo', desc: 'Le calendrier du matin' },
  { id: 'nyla_couleurs', label: '🎨 Les couleurs', desc: 'Trouve la couleur, de quelle couleur c\'est' },
];

const nylaFrenchModes = [
  // En vedette: c'est le seul endroit ou elle REPOND, au lieu de choisir parmi
  // des mots qu'elle ne sait pas encore lire.
  { id: 'nyla_oral', label: '🗣️ On parle ensemble', desc: 'Je te pose des questions, tu me réponds à voix haute', featured: true },
  { id: 'nyla_letters_flash', label: '🔤 Mes lettres MAJUSCULES', desc: 'Apprends à nommer A à Z' },
  { id: 'nyla_letters_lower_flash', label: '🔡 lettres minuscules', desc: 'a à z — après les majuscules' },
  { id: 'nyla_prenom', label: '✍️ Mon prénom', desc: 'Reconnaître Nyla, Ryan, Cayla, papa, maman' },
  { id: 'nyla_syllabes', label: '👏 Mes syllabes', desc: 'Tape les syllabes: ba-na-ne' },
  { id: 'nyla_rhymes', label: '🎵 Rimes et sons', desc: 'Finit pareil, commence pareil, l\'intrus' },
  { id: 'nyla_words_group', label: '⭐ Mots de la semaine', desc: '5 nouveaux mots à reconnaître', groupKind: 'nylawords' },
  { id: 'nyla_letters', label: '🔍 Le premier son', desc: 'Par quel son ça commence?' },
  { id: 'nyla_songs', label: '🎵 Apprends une chanson', desc: 'Les comptines de l\'école' },
  { id: 'nyla_boukili', label: '📚 Boukili', desc: 'Lis tes livres préférés' },
  { id: 'nyla_sight_words', label: '🃏 Mots-étoiles (jeu)', desc: 'Associe le mot et le dessin' },
  { id: 'nyla_logiciel', label: '🎮 Logiciel Éducatif', desc: 'Jeux pour apprendre' },
];

// Le pont vers la 1re année (septembre 2027). Rangé à part, et dit comme tel:
// c'est du bonus, pas ce qu'on attend d'elle en maternelle.
const nylaPont1reModes = [
  { id: 'nyla_sons_group', label: '🔊 Mes sons', desc: 'Un son par semaine: [a], [ou], [ch]...', groupKind: 'nylasons' },
  { id: 'nyla_fusion', label: '🧩 Je fusionne', desc: 'm + a = « ma » — le début de la lecture' },
  { id: 'nyla_1re_lecture', label: '📖 Je lis une phrase', desc: 'Les petits mots, puis de vraies phrases' },
];

// Les mascottes (lion de Ryan, renard, ours…) sont dans ./Mascots — choisies dans ⚙️ Réglages.

export default function Menu({ profile, onStartPractice, onOpenBlocs, onOpenVerbes, onOpenUniversSocial, onOpenSciences, onOpenJeux, onStartTutor, onStartTimer, onStartChores, onStartCoach, onStartPresentation, onStartFable, onOpenDashboard, onOpenNotifications, onOpenStudyReminder, onStartFlashcard, onOpenFamily, onOpenAgenda, onOpenBioFlashcard, onOpenTestResults, onOpenBoukili, onStartJournal, onStartReading, onStartNylaFlashcard, onStartNylaSpeed, onStartNylaSongs, onStartNylaAddition, onStartNylaCompare, onOpenCompose, onOpenSettings, onSwitchProfile, darkMode, onToggleDark }) {
  // Dispatch a tile click — special-case modes that open their own screen instead of the practice flow
  const launchMode = (id) => {
    if (id === 'biographie_jr_flashcard') return onOpenBioFlashcard && onOpenBioFlashcard();
    if (id === 'verbes_avoir_etre' && onOpenVerbes) return onOpenVerbes();
    if (id === 'univers_social' && onOpenUniversSocial) return onOpenUniversSocial();
    if (id === 'sciences_labo' && onOpenSciences) return onOpenSciences();
    if (id === 'nyla_boukili') return onOpenBoukili && onOpenBoukili();
    if (id === 'nyla_logiciel') return window.open('https://www.logicieleducatif.fr/', '_blank', 'noopener,noreferrer');
    if (id === 'nyla_letters_flash') return onStartNylaFlashcard && onStartNylaFlashcard('letters_upper');
    if (id === 'nyla_letters_lower_flash') return onStartNylaFlashcard && onStartNylaFlashcard('letters_lower');
    if (id === 'nyla_numbers_flash') return onStartNylaFlashcard && onStartNylaFlashcard('numbers');
    if (id === 'nyla_speed') return onStartNylaSpeed && onStartNylaSpeed();
    if (id === 'nyla_songs') return onStartNylaSongs && onStartNylaSongs();
    if (id === 'nyla_addition') return onStartNylaAddition && onStartNylaAddition();
    if (id === 'nyla_compare') return onStartNylaCompare && onStartNylaCompare();
    return onStartPractice(id);
  };
  const [stats, setStats] = useState(null);
  // Le commentaire disait depuis la rentrée « le mode 3e année bascule sur
  // french (voir plus bas) » — et ce code n'a jamais existé. Résultat: le menu
  // de Ryan s'ouvrait sur Mathématiques et TOUT le français (dictées
  // comprises) vivait derrière un onglet qu'il fallait savoir toucher. Sa
  // semaine est français d'abord: on ouvre sur le français.
  const [tab, setTab] = useState(
    profile === 'ryan' && new Date() >= new Date(2026, 8, 1) ? 'french' : 'math'
  );
  const [dicteesOpen, setDicteesOpen] = useState(false);
  const [nylaWordsOpen, setNylaWordsOpen] = useState(false);
  const [nylaSonsOpen, setNylaSonsOpen] = useState(false);
  const [cahierOpen, setCahierOpen] = useState(false);
  const [plusOpen, setPlusOpen] = useState(false);
  const [defis, setDefis] = useState(() => weakSkills(['t1_', 'matcha_']));
  const [refreshing, setRefreshing] = useState(false);
  const mascot = mascotFor(profile, useSettings(profile));
  const openGroup = (m) => (m.groupKind === 'nylawords' ? setNylaWordsOpen(true)
    : m.groupKind === 'nylasons' ? setNylaSonsOpen(true)
    : m.groupKind === 'cahier' ? setCahierOpen(true)
    : m.isGroup ? setDicteesOpen(true) : launchMode(m.id));

  // Cahier Jazz: module en classe cette semaine / la semaine prochaine / déjà vus
  // Le dimanche soir, on affiche déjà la semaine qui commence (comme le Coach).
  const refSemaine = (() => {
    const d = new Date();
    return d.getDay() === 0 ? new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1) : d;
  })();
  const listeSemaine = listeCetteSemaine(refSemaine);

  // ===== Toutes les dictées, les deux années au même endroit =====
  // Quand Ryan est passé en 3e le 1er sept., son menu a basculé sur la liste
  // 3e année — et la tuile « Dictées », qui n'existait que dans la liste de
  // 2e, a disparu de son écran. Les flashcards du Thème 7 n'avaient pas été
  // supprimées, elles étaient juste devenues introuvables sans passer par la
  // puce « 2e année (archive) ». Une seule porte, maintenant, avec les deux.
  //
  // `flashKey` = ce qu'on passe à DicteeFlashcard; `practiceMode` = le choix
  // multiple, qui n'existe que pour la liste EN COURS (le générateur
  // d'orthographe suit toujours la semaine, il ne sait pas remonter le temps).
  const dicteesDeRyan = (() => {
    const courante = listeCetteSemaine(refSemaine);
    const listes = listesVues(refSemaine).filter(Boolean).reverse().map((l) => ({
      id: cleDictee(l.id),
      flashKey: cleDictee(l.id),
      practiceMode: l.id === courante.id ? 'orthographe' : null,
      current: l.id === courante.id,
      groupe: '3e année — mon cahier d’orthographe',
      label: `Liste ${l.numero} — ${l.titre.toLowerCase()}`,
      desc: l.mots.slice(0, 5).map((m) => m.mot).join(', ') + '…',
    }));
    const archive = dicteeWeeksList.map((d) => ({
      ...d, flashKey: d.id, practiceMode: d.id, current: false,
      groupe: '2e année — Thème 7 (révision)',
    }));
    return [...listes, ...archive];
  })();
  const stratsSemaine = strategiesCetteSemaine(refSemaine);
  const remiseSemaine = (() => {
    const w = semaineCourante(refSemaine);
    if (!w || !w.remise) return null;
    const jour = new Date(w.remise[0], w.remise[1] - 1, w.remise[2]);
    const t = new Date(refSemaine.getFullYear(), refSemaine.getMonth(), refSemaine.getDate());
    const j = Math.round((jour - t) / 86400000);
    if (j < 0) return null;
    const JOURS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
    return j === 0 ? "à remettre aujourd'hui" : j === 1 ? 'à remettre demain' : `à remettre ${JOURS[jour.getDay()]}`;
  })();

  const cahierActuel = moduleCetteSemaine();
  const cahierProchain = moduleSemaineProchaine();
  const cahierFaits = new Set();
  for (const w of CAHIER_SEMAINES) {
    if (w.module === cahierActuel?.id) break;
    cahierFaits.add(w.module);
  }

  // Dans l'app installée (mode standalone) il n'y a ni bouton recharger ni
  // tirer-pour-rafraîchir. Ce bouton force la mise à jour: on redemande au
  // service worker de se mettre à jour, on vide les caches Workbox, puis on
  // recharge. Le localStorage (identifiants, préférences) n'est jamais touché.
  async function hardRefresh() {
    if (refreshing) return;
    setRefreshing(true);
    try {
      if ('serviceWorker' in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map(async (r) => {
          try { await r.update(); } catch {}
          if (r.waiting) r.waiting.postMessage({ type: 'SKIP_WAITING' });
        }));
      }
      // Hors ligne, vider le précache rendrait l'app illisible: on s'abstient.
      if (window.caches && navigator.onLine !== false) {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      }
    } catch {
      // peu importe la raison — on recharge quand même
    }
    // Un paramètre unique garantit une URL que le service worker n'a pas en
    // cache: le document est forcément retéléchargé.
    window.location.replace(`${window.location.pathname}?v=${Date.now()}`);
  }


  // Grade / saison "fenêtres" — Ryan seulement (3e année · Été · 2e année en archive)
  const ryanGraded = profile === 'ryan';
  const inSummer = (() => { const n = new Date(); return n >= new Date(2026, 5, 27) && n < new Date(2026, 8, 1); })();
  const inGrade3 = (() => new Date() >= new Date(2026, 8, 1))();
  const [section, setSection] = useState(
    ryanGraded ? (inSummer ? 'summer' : inGrade3 ? 'grade3' : 'grade2') : 'grade2'
  );

  useEffect(() => {
    getProgress().then(setStats).catch(() => {});
    // Stats par type de question → les cahiers ramènent ce qu'il rate (tous appareils)
    if (profile === 'ryan') syncSkillStats().then(() => setDefis(weakSkills(['t1_', 'matcha_']))).catch(() => {});
  }, []);

  const totalCorrect = stats?.totals?.correct || 0;
  const totalQuestions = stats?.totals?.total || 0;
  const pct = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  const isCayla = profile === 'cayla';
  const isNyla = profile === 'nyla';
  const isDemo = profile === 'demo';
  const isRyan = profile === 'ryan' || isDemo; // demo gets Ryan's 2e année content
  const name = isDemo ? 'Mon ami' : profile === 'ryan' ? 'Ryan' : isCayla ? 'Cayla' : 'Nyla';
  const isGrade3 = ryanGraded && section === 'grade3';
  const grade = isCayla ? 'Secondaire 1' : isNyla ? 'Maternelle 5 ans' : ryanGraded ? '3e année' : '2e année';
  // Ce que Nyla a à faire aujourd'hui, annoncé dès l'accueil.
  const nylaSousTitre = (() => {
    if (!isNyla) return '';
    const t = themeDuJour();
    const fait = coachFaitAujourdhui('nyla');
    return fait > 0 ? `${t.jour} — ${t.theme} · ${fait} de fait` : `${t.jour} — ${t.theme}`;
  })();
  const mathModes = isCayla ? caylaMathModes : isNyla ? nylaMathModes : isGrade3 ? grade3MathModes : ryanMathModes;
  const frenchModes = isCayla ? caylaFrenchModes : isNyla ? nylaFrenchModes : isGrade3 ? grade3FrenchModes : ryanFrenchModes;
  const modes = tab === 'math' ? mathModes : frenchModes;
  const featured = modes.find(m => m.featured);
  // `m !== featured`, et pas `!m.featured`: une liste avec DEUX modules
  // vedettes n'en affichait qu'un — l'autre disparaissait de l'écran sans rien
  // dire. Un module invisible est pire qu'un module mal placé.
  const grid = modes.filter(m => m !== featured);

  return (
    <div className="relative z-[1] max-w-3xl mx-auto px-4 pt-4 pb-12">
      {/* Top bar
          Onze à treize boutons dans une rangée qui ne passait jamais à la ligne:
          sur un téléphone de 390 px, la page faisait 695 px de large. Tout le
          reste se retrouvait écrasé dans 320 px avec une bande morte à droite,
          et il fallait scroller de côté pour voir son propre menu.
          La rangée passe à la ligne, et le logo rétrécit sur petit écran. */}
      <div className="flex justify-between items-center gap-2 flex-wrap gap-y-2 mb-4">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm text-white flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #c74a15, #ffc24d)' }}>
            <Sun size={20} />
          </div>
          <span className="font-heading text-xl sm:text-2xl font-extrabold text-stone tracking-tight truncate">Study Buddy</span>
        </div>
        <div className="flex flex-wrap justify-end gap-2 min-w-0">
          <button onClick={hardRefresh} disabled={refreshing} aria-label="Rafraîchir l'app"
            title="Rafraîchir — va chercher la dernière version"
            className="bg-white border-2 border-s2 rounded-xl p-2 text-s6 hover:border-lava hover:text-lava transition-all disabled:opacity-50">
            <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
          </button>
          {onStartTimer && (
            <button onClick={onStartTimer}
              className="bg-white border-2 border-s2 rounded-xl p-2 text-s6 hover:border-lava hover:text-lava transition-all">
              <Clock size={18} />
            </button>
          )}
          {onToggleDark && (
            <button onClick={onToggleDark}
              className="bg-white border-2 border-s2 rounded-xl p-2 text-s6 hover:border-lava hover:text-lava transition-all">
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          )}
          {onOpenCompose && !isDemo && (
            <button onClick={onOpenCompose}
              className="bg-white border-2 border-s2 rounded-xl p-2 text-s6 hover:border-lava hover:text-lava transition-all">
              <Send size={18} />
            </button>
          )}
          {onOpenFamily && !isDemo && (
            <button onClick={onOpenFamily}
              className="bg-white border-2 border-s2 rounded-xl p-2 text-s6 hover:border-lava hover:text-lava transition-all">
              <Users size={18} />
            </button>
          )}
          {onOpenStudyReminder && (
            <button onClick={onOpenStudyReminder}
              className="bg-white border-2 border-s2 rounded-xl p-2 text-s6 hover:border-lava hover:text-lava transition-all">
              <BookOpen size={18} />
            </button>
          )}
          {onOpenNotifications && <NotificationBell onClick={onOpenNotifications} />}
          {onOpenAgenda && isRyan && (
            <button onClick={onOpenAgenda}
              className="bg-gradient-to-br from-lava to-fox rounded-xl p-2 text-white shadow-sm hover:opacity-90 transition-all"
              title="Agenda & examens">
              <Calendar size={18} />
            </button>
          )}
          {onOpenTestResults && isRyan && (
            <button onClick={onOpenTestResults}
              className="bg-white border-2 border-s2 rounded-xl p-2 text-s6 hover:border-lava hover:text-lava transition-all"
              title="Résultats d'examens">
              <Trophy size={18} />
            </button>
          )}
          <button onClick={onOpenDashboard}
            className="bg-white border-2 border-s2 rounded-xl p-2 text-s6 hover:border-lava hover:text-lava transition-all">
            <BarChart3 size={18} />
          </button>
          {onOpenSettings && (
            <button onClick={onOpenSettings} aria-label="Réglages" title="Réglages: voix, couleur, mascotte, écriture"
              className="bg-white border-2 border-s2 rounded-xl p-2 text-s6 hover:border-lava hover:text-lava transition-all">
              <Settings size={18} />
            </button>
          )}
          <button onClick={onSwitchProfile}
            className="bg-white border-2 border-s2 rounded-xl px-3 py-2 text-sm font-bold text-s6 hover:border-lava hover:text-lava transition-all">
            👤 {name}
          </button>
        </div>
      </div>

      {/* Greeting banner with fox */}
      <div className="rounded-3xl mb-4 overflow-hidden flex items-end min-h-[165px]"
        style={{ background: 'linear-gradient(135deg, #fff3e0, #ffe6c4 55%, #ffd8b0)' }}>
        <div className="flex-1 p-6 z-[1]">
          <div className="font-heading text-sm font-bold text-fox-d mb-0.5 tracking-wide">
            {ryanGraded ? '🦁 3e année · Try again' : isCayla ? 'Secondaire 1 · Collège Laval' : '🍁 Rentrée'}
          </div>
          <h1 className="font-heading text-3xl font-extrabold text-stone leading-tight mb-1">Bonjour {name}!</h1>
          <p className="text-sm font-semibold text-s4">
            {pct >= 70 ? 'Nouvelle année, tu es en feu! 🔥' :
             totalQuestions > 0 ? 'On repart du bon pied — tu progresses! 📗' :
             isCayla ? 'Tes révisions d’examens t’attendent.' : 'Nouvelle année, nouveau départ. On commence? 🍁'}
          </p>
        </div>
        <div className="flex-shrink-0 mr-2 z-[1]">
          <Mascot id={mascot} />
        </div>
      </div>

      {/* Cayla's Journal — featured pink card */}
      {isCayla && onStartJournal && (
        <button onClick={onStartJournal}
          className="w-full rounded-2xl p-5 mb-3 flex items-center gap-4 transition-all hover:-translate-y-0.5 active:scale-[0.98]"
          style={{ background: 'linear-gradient(135deg, #e84393, #fbc2eb)', boxShadow: '0 6px 24px rgba(232,67,147,0.25)' }}>
          <div className="w-14 h-14 rounded-2xl bg-white/25 flex items-center justify-center flex-shrink-0 text-white">
            <BookMarked size={26} />
          </div>
          <div className="text-left flex-1">
            <div className="font-heading text-xl font-extrabold text-white leading-tight">Mon journal</div>
            <div className="text-xs font-semibold text-white/85">Gratitude, défis, motivation</div>
          </div>
          <ChevronRight className="text-white/60" size={24} strokeWidth={3} />
        </button>
      )}

      {/* Coach button — the BIG one (Ryan: lives in the ☀️ Été window instead).
          Nyla l'a en haut de son écran: c'est SA porte d'entrée. À 5 ans, on ne
          choisit pas parmi onze tuiles — on suit le chemin du jour. */}
      {onStartCoach && !isDemo && (!ryanGraded || isNyla) && (
        <button onClick={onStartCoach}
          className="w-full rounded-2xl p-5 mb-3 flex items-center gap-4 transition-all hover:-translate-y-0.5 active:scale-[0.98]"
          style={{ background: 'linear-gradient(135deg, #c74a15, #e8622a 50%, #fdcb6e)', boxShadow: '0 6px 24px rgba(199,74,21,0.25)' }}>
          <div className="w-14 h-14 rounded-2xl bg-white/25 flex items-center justify-center flex-shrink-0 text-white">
            <Target size={26} />
          </div>
          <div className="text-left flex-1">
            <div className="font-heading text-xl font-extrabold text-white leading-tight">
              {isNyla ? 'Mon chemin du jour' : 'Mon Coach'}
            </div>
            <div className="text-xs font-semibold text-white/85">
              {isNyla ? nylaSousTitre : 'Suis le plan, ne réfléchis pas — juste GO!'}
            </div>
          </div>
          <ChevronRight className="text-white/60" size={24} strokeWidth={3} />
        </button>
      )}

      {/* Tasks button */}
      {onStartChores && !isDemo && (
        <button onClick={onStartChores}
          className="w-full rounded-2xl p-4 mb-4 flex items-center gap-4 transition-all hover:-translate-y-0.5 active:scale-[0.98]"
          style={{ background: 'linear-gradient(135deg, #2d7a3a, #4ca65b)', boxShadow: '0 5px 22px rgba(45,122,58,0.15)' }}>
          <div className="w-11 h-11 rounded-xl bg-white/25 flex items-center justify-center flex-shrink-0 text-white">
            <ListTodo size={22} />
          </div>
          <div className="text-left flex-1">
            <div className="font-heading text-lg font-extrabold text-white leading-tight">Mes tâches du jour</div>
            <div className="text-xs font-semibold text-white/80">Coche tes tâches une par une</div>
          </div>
          <ChevronRight className="text-white/40" size={20} strokeWidth={3} />
        </button>
      )}

      {/* Grade / saison "fenêtres" — Ryan seulement */}
      {ryanGraded && (
        <div className="flex gap-2 mb-4 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {[
            { id: 'grade3', label: '📗 3e année' },
            { id: 'grade2', label: '📘 2e année (archive)' },
            { id: 'summer', label: '☀️ Été' },
          ].map(s => (
            <button key={s.id} onClick={() => setSection(s.id)}
              className={`flex-shrink-0 rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${
                section === s.id ? 'bg-stone text-white' : 'bg-white border-2 border-s2 text-s6 hover:border-lava hover:text-lava'
              }`}>
              {s.label}
            </button>
          ))}
        </div>
      )}

      {/* ☀️ Fenêtre Été — Coach du jour + exercices clés */}
      {ryanGraded && section === 'summer' && (
        <>
          {onStartCoach && (
            <button onClick={onStartCoach}
              className="w-full rounded-2xl p-5 mb-3 flex items-center gap-4 transition-all hover:-translate-y-0.5 active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg, #3aa0e8, #ffc24d)', boxShadow: '0 6px 24px rgba(58,160,232,0.22)' }}>
              <div className="w-12 h-12 rounded-2xl bg-white/25 flex items-center justify-center flex-shrink-0 text-white text-2xl">☀️</div>
              <div className="text-left flex-1">
                <div className="font-heading text-xl font-extrabold text-white leading-tight">Mon Coach d'été</div>
                <div className="text-xs font-semibold text-white/90">Suis le plan du jour · ~25 min, puis va jouer dehors!</div>
              </div>
              <ChevronRight className="text-white/60" size={24} strokeWidth={3} />
            </button>
          )}
          <div className="text-xs font-bold text-s4 uppercase tracking-wide mb-2 mt-1 px-1">Exercices d'été</div>
          <div className="grid grid-cols-2 gap-2.5 mb-6">
            {summerModes.map(mode => (
              <button key={mode.id} onClick={() => launchMode(mode.id)}
                className="bg-white border-2 border-s1 rounded-2xl p-4 text-left transition-all
                  hover:border-fox hover:shadow-md hover:-translate-y-0.5 active:scale-[0.97]">
                {icons[mode.id] && (
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-2"
                    style={{ background: icons[mode.id].bg, color: icons[mode.id].color }}>
                    {icons[mode.id].svg}
                  </div>
                )}
                <div className="font-heading text-base font-bold text-stone leading-tight">{mode.label}</div>
                <div className="text-xs font-semibold text-s4 mt-0.5">{mode.desc}</div>
              </button>
            ))}
          </div>
        </>
      )}

      {/* 📗 Fenêtre 3e année — Coach du jour, puis les modules (tabs partagés) */}
      {isGrade3 && (
        <>
          {onStartCoach && (
            <button onClick={onStartCoach}
              className="w-full rounded-2xl p-5 mb-3 flex items-center gap-4 transition-all hover:-translate-y-0.5 active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg, #c74a15, #e8a33a)', boxShadow: '0 6px 24px rgba(199,74,21,0.22)' }}>
              <div className="w-12 h-12 rounded-2xl bg-white/25 flex items-center justify-center flex-shrink-0 text-white text-2xl">🍁</div>
              <div className="text-left flex-1">
                <div className="font-heading text-xl font-extrabold text-white leading-tight">Ma semaine — le plan du jour</div>
                <div className="text-xs font-semibold text-white/90 leading-snug">
                  Liste {listeSemaine.numero} · {listeSemaine.titre.toLowerCase()}<br />
                  Stratégie{stratsSemaine.length > 1 ? 's' : ''} {stratsSemaine.map((x) => x.id).join(' et ')} · {cahierActuel ? cahierActuel.notions[0].toLowerCase() : 'cahier Jazz'}
                </div>
                {remiseSemaine && (
                  <div className="inline-block mt-1.5 text-[11px] font-extrabold bg-white/25 text-white rounded-full px-2.5 py-0.5">
                    📌 Feuille {remiseSemaine}
                  </div>
                )}
              </div>
              <ChevronRight className="text-white/60" size={24} strokeWidth={3} />
            </button>
          )}

        </>
      )}

      {/* 📘 Fenêtre 2e année (archive) + Cayla / Nyla — partage les mêmes onglets */}
      {(!ryanGraded || section === 'grade2' || section === 'grade3') && (
        <>
      {/* Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
        <button onClick={() => setTab('math')}
          className={`flex-shrink-0 rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${
            tab === 'math' ? 'bg-stone text-white' : 'bg-white border-2 border-s2 text-s6 hover:border-lava hover:text-lava'
          }`}>
          Mathématiques
        </button>
        <button onClick={() => setTab('french')}
          className={`flex-shrink-0 rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${
            tab === 'french' ? 'bg-stone text-white' : 'bg-white border-2 border-s2 text-s6 hover:border-lava hover:text-lava'
          }`}>
          Français
        </button>
      </div>

      {/* Featured mode */}
      {featured && (
        <button onClick={() => openGroup(featured)}
          className="w-full rounded-2xl p-5 mb-3 flex items-center gap-4 transition-all hover:-translate-y-0.5 active:scale-[0.98]"
          style={{ background: 'linear-gradient(135deg, #c74a15, #e8622a)', boxShadow: '0 5px 22px rgba(199,74,21,0.15)' }}>
          <div className="w-11 h-11 rounded-xl bg-white/25 flex items-center justify-center flex-shrink-0 text-white">
            <Sparkles size={22} />
          </div>
          <div className="text-left flex-1">
            <div className="font-heading text-xl font-extrabold text-white leading-tight">{featured.label}</div>
            <div className="text-sm font-semibold text-white/70">
              {featured.groupKind === 'cahier' && cahierActuel ? `Cette semaine: ${titreModule(cahierActuel)}` : featured.desc}
            </div>
          </div>
          <ChevronRight className="text-white/40" size={20} strokeWidth={3} />
        </button>
      )}

      {/* Module grid */}
      <div className="grid grid-cols-2 gap-2.5 mb-6">
        {grid.map(mode => (
          <button key={mode.id}
            onClick={() => openGroup(mode)}
            className="bg-white border-2 border-s1 rounded-2xl p-4 text-left transition-all
              hover:border-fox hover:shadow-md hover:-translate-y-0.5 active:scale-[0.97]">
            {/* La pastille était en `absolute` dans le coin: sur les cartes sans
                icône elle se posait PAR-DESSUS le titre (« Classes de mots »,
                « Dictée de la liste »). Elle prend maintenant sa place dans le
                flux, donc elle ne peut plus rien recouvrir, quelle que soit la
                largeur de l'écran. */}
            {mode.badge && (
              <span className={`inline-block mb-1.5 text-[10px] font-bold px-2 py-0.5 rounded-lg ${
                mode.badge === 'Priorité' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'
              }`}>{mode.badge}</span>
            )}
            {icons[mode.id] && (
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-2"
                style={{ background: icons[mode.id].bg, color: icons[mode.id].color }}>
                {icons[mode.id].svg}
              </div>
            )}
            <div className="font-heading text-base font-bold text-stone leading-tight">{mode.label}</div>
            <div className="text-xs font-semibold text-s4 mt-0.5">{mode.desc}</div>
          </button>
        ))}
      </div>

      {/* Nyla — le pont vers la 1re année. Sous les exercices de son année, et
          annoncé comme du bonus: elle est en maternelle, pas en retard. */}
      {isNyla && tab === 'french' && (
        <div className="mb-6">
          <div className="flex items-baseline gap-2 mb-2">
            <h3 className="font-heading text-base font-extrabold text-stone">🚀 Je me prépare pour la 1re année</h3>
            <span className="text-[11px] font-bold text-s4">bonus — septembre 2027</span>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {nylaPont1reModes.map((mode) => (
              <button key={mode.id}
                onClick={() => openGroup(mode)}
                className="bg-white border-2 border-dashed border-purple-200 rounded-2xl p-4 text-left transition-all
                  hover:border-purple-400 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.97]">
                <div className="font-heading text-base font-bold text-stone leading-tight">{mode.label}</div>
                <div className="text-xs font-semibold text-s4 mt-0.5">{mode.desc}</div>
              </button>
            ))}
          </div>
        </div>
      )}
        </>
      )}

      {/* Nyla — le son de la semaine (picker → pratique sur ce son) */}
      {nylaSonsOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4"
          onClick={() => setNylaSonsOpen(false)}>
          <div onClick={(e) => e.stopPropagation()}
            className="bg-cream rounded-2xl p-5 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border-2 border-s1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-xl font-extrabold text-stone">🔊 Mes sons</h3>
              <button onClick={() => setNylaSonsOpen(false)}
                className="w-9 h-9 rounded-full bg-white border-2 border-s2 text-s4 font-bold hover:border-lava hover:text-lava">
                ✕
              </button>
            </div>
            <p className="text-xs font-bold text-purple-700 bg-purple-50 border-2 border-purple-200 rounded-xl p-3 mb-3 text-center">
              Un son à la fois, dans l'ordre. Les voyelles d'abord, les sons complexes ([ou], [ch], [oi]) à la fin.
            </p>
            <div className="space-y-2">
              {sonsList.map((s, i) => (
                <button key={s.id}
                  onClick={() => { setNylaSonsOpen(false); onStartPractice(`nyla_son:${s.id}`); }}
                  className="w-full text-left rounded-2xl p-3 border-2 bg-white border-s1 hover:border-purple-400 hover:shadow-sm transition-all flex items-center gap-3">
                  <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-purple-50 text-purple-700 font-heading font-extrabold flex items-center justify-center text-xs">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-heading font-bold text-stone text-base">{s.label}</div>
                    <div className="text-xs text-s4 font-semibold mt-0.5">{s.desc}</div>
                  </div>
                  <ChevronRight className="text-s3" size={18} strokeWidth={3} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Nyla — mots de la semaine (week picker → flashcards) */}
      {nylaWordsOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4"
          onClick={() => setNylaWordsOpen(false)}>
          <div onClick={(e) => e.stopPropagation()}
            className="bg-cream rounded-2xl p-5 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border-2 border-s1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-xl font-extrabold text-stone">⭐ Mots de la semaine</h3>
              <button onClick={() => setNylaWordsOpen(false)}
                className="w-9 h-9 rounded-full bg-white border-2 border-s2 text-s4 font-bold hover:border-lava hover:text-lava">
                ✕
              </button>
            </div>
            <p className="text-xs font-bold text-purple-700 bg-purple-50 border-2 border-purple-200 rounded-xl p-3 mb-3 text-center">
              5 mots par semaine — cartes à reconnaître (le son joue tout seul). On répète les mots pas encore sus.
            </p>
            <div className="space-y-2">
              {nylaWeekList.map((w) => (
                <button key={w.id}
                  onClick={() => { setNylaWordsOpen(false); onStartNylaFlashcard && onStartNylaFlashcard(w.id); }}
                  className="w-full text-left rounded-2xl p-3 border-2 bg-white border-s1 hover:border-purple-400 hover:shadow-sm transition-all flex items-center gap-3">
                  <div className="flex-shrink-0 text-2xl">
                    {w.words.map((x) => x.icon).slice(0, 3).join('')}
                  </div>
                  <div className="flex-1">
                    <div className="font-heading font-bold text-stone text-base">{w.label}</div>
                    <div className="text-xs text-s4 font-semibold mt-0.5">{w.desc}</div>
                  </div>
                  <ChevronRight className="text-s3" size={18} strokeWidth={3} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 📒 Cahier Jazz — table des matières, module de la semaine + un pas d'avance */}
      {cahierOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4"
          onClick={() => setCahierOpen(false)}>
          <div onClick={(e) => e.stopPropagation()}
            className="bg-cream rounded-2xl p-5 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border-2 border-s1">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-heading text-xl font-extrabold text-stone">📒 Mon cahier Jazz</h3>
              <button onClick={() => setCahierOpen(false)}
                className="w-9 h-9 rounded-full bg-white border-2 border-s2 text-s4 font-bold hover:border-lava hover:text-lava">
                ✕
              </button>
            </div>
            <p className="text-xs font-bold text-fox-d bg-orange-50 border-2 border-orange-200 rounded-xl p-3 mb-4 text-center">
              Pratique ce que tu fais en classe cette semaine, puis prends un pas d'avance sur la semaine prochaine. 🦁
            </p>
            {defis.length > 0 && (
              <div className="bg-white border-2 border-s1 rounded-xl p-3 mb-4">
                <div className="text-xs font-extrabold text-stone mb-1">🔁 Tes défis du moment</div>
                <p className="text-[11px] font-semibold text-s4 mb-2">
                  Ces questions reviennent plus souvent jusqu'à ce que tu les réussisses. Try again — tu es capable!
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {defis.map((d) => (
                    <span key={d.key} className="text-[11px] font-bold bg-orange-50 text-fox-d border border-orange-200 rounded-full px-2 py-0.5">
                      {d.label}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {CAHIER_THEMES.map((theme) => (
              <div key={theme.id} className="mb-4">
                <div className="text-xs font-extrabold text-s4 uppercase tracking-wide mb-2 px-1">
                  {theme.numero ? `Thème ${theme.numero} — ${theme.titre}` : theme.titre} · p. {theme.page}
                </div>
                <div className="space-y-2">
                  {theme.modules.map((m) => {
                    const actuel = m.id === cahierActuel?.id;
                    const prochain = m.id === cahierProchain?.id;
                    const fait = cahierFaits.has(m.id);
                    return (
                      <div key={m.id}
                        className={`rounded-2xl p-3 border-2 ${actuel ? 'bg-orange-50 border-lava' : prochain ? 'bg-white border-fox' : 'bg-white border-s1'} ${!m.mode ? 'opacity-60' : ''}`}>
                        <div className="flex items-start gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="font-heading font-bold text-stone text-sm flex flex-wrap items-center gap-1.5">
                              {m.numero ? `Module ${m.numero} — ${m.notions[0]}` : m.label}
                              {actuel && <span className="text-[10px] font-bold bg-lava text-white px-2 py-0.5 rounded-full">CETTE SEMAINE</span>}
                              {prochain && <span className="text-[10px] font-bold bg-fox text-white px-2 py-0.5 rounded-full">🚀 SEMAINE PROCHAINE</span>}
                              {fait && <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">✓ VU EN CLASSE</span>}
                            </div>
                            <div className="text-xs text-s4 font-semibold mt-0.5">
                              {m.lecture ? `« ${m.lecture} » · ` : ''}p. {m.pages}
                              {m.notions.length > 1 ? ` · ${m.notions.slice(1).join(' · ')}` : ''}
                            </div>
                          </div>
                          {m.mode ? (
                            <div className="flex flex-col gap-1.5 flex-shrink-0">
                              <button onClick={() => { setCahierOpen(false); launchMode(m.mode); }}
                                className="px-3 py-1.5 rounded-lg font-bold text-white text-xs"
                                style={{ background: 'linear-gradient(90deg, #c74a15, #e8622a)' }}>
                                ▶ {m.extra ? m.notions[0].replace(/^(Le |La |L')/, '') : 'Pratiquer'}
                              </button>
                              {m.extra && (
                                <button onClick={() => { setCahierOpen(false); launchMode(m.extra.mode); }}
                                  className="px-3 py-1.5 rounded-lg font-bold text-fox-d text-xs bg-orange-50 border-2 border-orange-200">
                                  ▶ {m.extra.label}
                                </button>
                              )}
                            </div>
                          ) : (
                            <span className="text-[10px] font-bold text-s4 flex-shrink-0 mt-1">bientôt</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Panneau « Plus » — ce qui ne sert pas tous les jours */}
      {plusOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4"
          onClick={() => setPlusOpen(false)}>
          <div onClick={(e) => e.stopPropagation()}
            className="bg-cream rounded-2xl p-5 max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl border-2 border-s1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-xl font-extrabold text-stone">✨ Plus</h3>
              <button onClick={() => setPlusOpen(false)}
                className="w-9 h-9 rounded-full bg-white border-2 border-s2 text-s4 font-bold hover:border-lava hover:text-lava">
                ✕
              </button>
            </div>
            <div className="space-y-2.5">
              {onOpenJeux && !isDemo && (
                <button onClick={() => { setPlusOpen(false); onOpenJeux(); }}
                  className="w-full rounded-2xl p-4 flex items-center gap-4 transition-all hover:-translate-y-0.5 active:scale-[0.98]"
                  style={{ background: 'linear-gradient(135deg, #0f766e, #14b8a6)' }}>
                  <div className="w-11 h-11 rounded-xl bg-white/25 flex items-center justify-center flex-shrink-0 text-white text-2xl">🎮</div>
                  <div className="text-left flex-1">
                    <div className="font-heading text-lg font-extrabold text-white leading-tight">Les jeux</div>
                    <div className="text-xs font-semibold text-white/85">Tic-tac-toe, Puissance 4, échecs</div>
                  </div>
                  <ChevronRight className="text-white/40" size={20} strokeWidth={3} />
                </button>
              )}
              {onOpenBlocs && (
                <button onClick={() => { setPlusOpen(false); onOpenBlocs(); }}
                  className="w-full rounded-2xl p-4 flex items-center gap-4 transition-all hover:-translate-y-0.5 active:scale-[0.98]"
                  style={{ background: 'linear-gradient(135deg, #1b7f4b, #46b877)' }}>
                  <div className="w-11 h-11 rounded-xl bg-white/25 flex items-center justify-center flex-shrink-0 text-white text-2xl">🧱</div>
                  <div className="text-left flex-1">
                    <div className="font-heading text-lg font-extrabold text-white leading-tight">Mes blocs</div>
                    <div className="text-xs font-semibold text-white/85">Construis ta fondation — un bloc à la fois</div>
                  </div>
                  <ChevronRight className="text-white/40" size={20} strokeWidth={3} />
                </button>
              )}
              {onStartReading && !isDemo && (
                <button onClick={() => { setPlusOpen(false); onStartReading(); }}
                  className="w-full rounded-2xl p-4 flex items-center gap-4 transition-all hover:-translate-y-0.5 active:scale-[0.98]"
                  style={{ background: 'linear-gradient(135deg, #2d7a3a, #6cc24a)' }}>
                  <div className="w-11 h-11 rounded-xl bg-white/25 flex items-center justify-center flex-shrink-0 text-white text-2xl">📚</div>
                  <div className="text-left flex-1">
                    <div className="font-heading text-lg font-extrabold text-white leading-tight">Mes lectures · 20$/livre</div>
                    <div className="text-xs font-semibold text-white/85">Lis un livre, gagne de l'argent! 💰</div>
                  </div>
                  <ChevronRight className="text-white/40" size={20} strokeWidth={3} />
                </button>
              )}
              {isRyan && onStartTutor && (
                <button onClick={() => { setPlusOpen(false); onStartTutor(); }}
                  className="w-full flex items-center gap-4 bg-white border-2 border-s1 rounded-2xl p-4 transition-all hover:border-info hover:shadow-md">
                  <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm text-white"
                    style={{ background: 'linear-gradient(135deg, #3a5bc7, #5b4ad4)' }}>
                    <GraduationCap size={22} />
                  </div>
                  <div className="text-left">
                    <div className="font-heading text-lg font-bold text-stone leading-tight">Tuteur personnel</div>
                    <div className="text-xs font-semibold text-s4">Apprends pas à pas avec ton professeur</div>
                  </div>
                </button>
              )}
              {isRyan && onStartPresentation && (
                <button onClick={() => { setPlusOpen(false); onStartPresentation(); }}
                  className="w-full flex items-center gap-4 bg-white border-2 border-s1 rounded-2xl p-4 transition-all hover:border-fox hover:shadow-md">
                  <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm text-white"
                    style={{ background: 'linear-gradient(135deg, #b85d1a, #e2762b)' }}>
                    <Mic2 size={22} />
                  </div>
                  <div className="text-left">
                    <div className="font-heading text-lg font-bold text-stone leading-tight">Présentation orale</div>
                    <div className="text-xs font-semibold text-s4">Pratique pour ta prochaine présentation</div>
                  </div>
                </button>
              )}
            </div>
            {isRyan && (
              <div className="mt-4 bg-white border-2 border-s1 rounded-xl p-3 flex items-start gap-2.5">
                <div className="text-xl flex-shrink-0">🎯</div>
                <p className="text-[11px] font-semibold text-s5 leading-relaxed">
                  <b>L'école privée:</b> le français compte <b>60&nbsp;%</b> et les maths 40&nbsp;%,
                  et il faut au moins 60&nbsp;% dans les deux. C'est pour ça qu'on fait du français
                  en premier chaque jour. 💪
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Dictées sub-menu modal */}
      {dicteesOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4"
          onClick={() => setDicteesOpen(false)}>
          <div onClick={(e) => e.stopPropagation()}
            className="bg-cream rounded-2xl p-5 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border-2 border-s1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-xl font-extrabold text-stone">🎧 Dictées</h3>
              <button onClick={() => setDicteesOpen(false)}
                className="w-9 h-9 rounded-full bg-white border-2 border-s2 text-s4 font-bold hover:border-lava hover:text-lava">
                ✕
              </button>
            </div>
            {/* Mode picker */}
            <div className="bg-orange-50 rounded-xl p-3 mb-3 border-2 border-orange-200">
              <p className="text-xs font-bold text-fox-d mb-2 text-center">Choisis un mode pour chaque semaine:</p>
              <div className="flex gap-2 text-xs justify-center">
                <span className="px-2 py-1 bg-white rounded-full font-bold">▶ = Choix multiple</span>
                <span className="px-2 py-1 bg-white rounded-full font-bold">🃏 = Flashcard (tape)</span>
              </div>
            </div>

            <div className="space-y-2">
              {(isCayla ? caylaDicteeWeeksList : isGrade3 ? dicteesDeRyan : dicteeWeeksList).map((d, i, tout) => (
                <React.Fragment key={d.id}>
                  {d.groupe && d.groupe !== tout[i - 1]?.groupe && (
                    <p className="text-[11px] font-extrabold text-s4 uppercase tracking-wide pt-2 pb-0.5">
                      {d.groupe}
                    </p>
                  )}
                  <div
                    className={`w-full text-left rounded-2xl p-3 border-2 ${
                      d.highlight ? 'bg-orange-50 border-lava' :
                      d.current ? 'bg-white border-fox shadow-sm' :
                      'bg-white border-s1'
                    }`}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex-1">
                        <div className="font-heading font-bold text-stone text-base flex items-center gap-2">
                          {d.label}
                          {d.current && <span className="text-[10px] font-bold bg-fox text-white px-2 py-0.5 rounded-full">CETTE SEMAINE</span>}
                        </div>
                        <div className="text-xs text-s4 font-semibold mt-0.5">{d.desc}</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {(d.practiceMode || !isGrade3) && (
                        <button onClick={() => { setDicteesOpen(false); onStartPractice(d.practiceMode || d.id); }}
                          className="flex-1 py-2 rounded-lg font-bold text-white text-sm"
                          style={{ background: 'linear-gradient(90deg, #c74a15, #e8622a)' }}>
                          ▶ Choix multiple
                        </button>
                      )}
                      {onStartFlashcard && d.id !== 'dictee_revision' && (
                        <button onClick={() => { setDicteesOpen(false); onStartFlashcard(d.flashKey || d.id); }}
                          className="flex-1 py-2 rounded-lg font-bold text-fox-d text-sm bg-orange-50 border-2 border-orange-200 hover:border-fox">
                          🃏 Écris les mots
                        </button>
                      )}
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tout le reste tient dans un seul bouton: le menu de Ryan doit rester
          court. Lectures, tuteur et présentation orale servent quelques fois
          par mois, pas tous les jours. */}
      <button onClick={() => setPlusOpen(true)}
        className="w-full flex items-center gap-3 bg-white border-2 border-s1 rounded-2xl p-3.5 mb-6 transition-all hover:border-fox hover:shadow-md">
        <div className="w-10 h-10 rounded-xl bg-s1 flex items-center justify-center flex-shrink-0 text-xl">✨</div>
        <div className="text-left flex-1">
          <div className="font-heading text-base font-bold text-stone leading-tight">Plus</div>
          <div className="text-xs font-semibold text-s4">{isRyan ? 'Mes blocs, mes lectures, tuteur, présentation' : 'Mes lectures'}</div>
        </div>
        <ChevronRight className="text-s3" size={20} strokeWidth={3} />
      </button>

      <div className="text-center text-[10px] font-semibold text-s3 mt-8 mb-2 select-none">
        version {typeof __BUILD_ID__ !== 'undefined' ? __BUILD_ID__ : 'dev'}
      </div>

      <style>{`
        @keyframes tailwag { 0%,100%{transform:rotate(-5deg)} 50%{transform:rotate(15deg)} }
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
      `}</style>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { getProgress } from '../utils/storage';
import { nylaWeekList } from '../data/nylaFlashcards';
import { NotificationBell } from './Notifications';
import { BarChart3, BookOpen, Users, Clock, Moon, Sun, BookMarked, Mic2, Target, ListTodo, Sparkles, Fish, Zap, Layers, GraduationCap, ChevronRight, Send, Calendar, Trophy } from 'lucide-react';

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

const caylaFrenchModes = [
  { id: 'classe_de_mots', label: '📝 Classe de mots', desc: 'Test 43/57 (75%) — drill les confusions', featured: true },
  { id: 'cayla_dictees_group', label: 'Dictées de la semaine', desc: 'Mots du test de mardi (T6)', isGroup: true },
  { id: 'pluriels_cayla', label: 'Pluriels — cas particuliers', desc: 'corail→coraux, chevreuil→chevreuils, les 7 -oux' },
  { id: 'conjugaison', label: 'Conjugaison', desc: 'Verbes et temps' },
];

const caylaDicteeWeeksList = [
  { id: 'cayla_t6_s1', label: 'Semaine 1 — son [eur]', desc: 'acteur, danseur, vendeur, courageux...', current: true },
  { id: 'cayla_t6_s2', label: 'Semaine 2 — verbes en -ER', desc: 'conserver, demeurer, déranger...' },
  { id: 'cayla_t6_s3', label: 'Semaine 3 — finales BLE/LE/ME', desc: 'agréable, marmite, vaste...' },
];

// ===== Nyla — pré-maternelle (5 ans) =====
// Built from Quebec maternelle 5 ans curriculum (éveil mathématique + langagier)
const nylaMathModes = [
  { id: 'nyla_numbers_flash', label: '🔢 Mes chiffres (cartes)', desc: 'Reconnaître les nombres — niveaux jusqu\'à 50', featured: true },
  { id: 'nyla_speed', label: '⚡ Calcul rapide', desc: 'Vite vite! Compte, +1, le plus...' },
  { id: 'nyla_count', label: '🍎 Compte les objets', desc: 'De 1 à 10' },
  { id: 'nyla_compare', label: '⚖️ Plus ou moins?', desc: 'Compare deux groupes' },
  { id: 'nyla_shapes', label: '⬜ Les formes', desc: 'Carré, cercle, triangle...' },
  { id: 'nyla_patterns', label: '🔄 Suites logiques', desc: 'Qu\'est-ce qui vient ensuite?' },
  { id: 'nyla_add', label: '➕ Combien en tout?', desc: 'Combine deux groupes (avec dessins)' },
];

const nylaFrenchModes = [
  { id: 'nyla_letters_flash', label: '🔤 Mes lettres MAJUSCULES', desc: 'Apprends à nommer A à Z', featured: true },
  { id: 'nyla_letters_lower_flash', label: '🔡 lettres minuscules', desc: 'a à z — après les majuscules' },
  { id: 'nyla_words_group', label: '⭐ Mots de la semaine', desc: '5 nouveaux mots à reconnaître', groupKind: 'nylawords' },
  { id: 'nyla_letters', label: '🔍 Le premier son', desc: 'Par quel son ça commence? (quand tu connais tes lettres)' },
  { id: 'nyla_boukili', label: '📚 Boukili', desc: 'Lis tes livres préférés' },
  { id: 'nyla_sight_words', label: '🃏 Mots-étoiles (jeu)', desc: 'Associe le mot et le dessin' },
  { id: 'nyla_rhymes', label: '🎵 Les rimes', desc: 'Mots qui finissent pareil' },
  { id: 'nyla_logiciel', label: '🎮 Logiciel Éducatif', desc: 'Jeux pour apprendre' },
];

function FoxMascot() {
  return (
    <svg className="fox-svg" viewBox="0 0 130 160" width="120" height="150" fill="none" style={{ animation: 'bounce 3s ease-in-out infinite' }}>
      <g style={{ transformOrigin: '25px 45px', animation: 'tailwag 1.5s ease-in-out infinite' }}>
        <path d="M25 110Q5 95 10 75Q15 60 30 70Q20 80 28 95Z" fill="#e2762b"/>
        <path d="M10 75Q13 65 22 68Q15 73 18 82Z" fill="white" opacity=".7"/>
      </g>
      <ellipse cx="65" cy="115" rx="32" ry="28" fill="#e2762b"/>
      <ellipse cx="65" cy="120" rx="22" ry="20" fill="#fde8cc"/>
      <rect x="48" y="128" width="10" height="22" rx="5" fill="#e2762b"/>
      <rect x="72" y="128" width="10" height="22" rx="5" fill="#e2762b"/>
      <ellipse cx="53" cy="150" rx="7" ry="3.5" fill="#2c2017"/>
      <ellipse cx="77" cy="150" rx="7" ry="3.5" fill="#2c2017"/>
      <ellipse cx="65" cy="72" rx="28" ry="24" fill="#e2762b"/>
      <ellipse cx="65" cy="76" rx="20" ry="16" fill="#fde8cc"/>
      <path d="M40 60L35 35L52 52Z" fill="#e2762b"/><path d="M42 57L38 40L50 52Z" fill="#ffc68a"/>
      <path d="M90 60L95 35L78 52Z" fill="#e2762b"/><path d="M88 57L92 40L80 52Z" fill="#ffc68a"/>
      <ellipse cx="55" cy="68" rx="4.5" ry="5" fill="#2c2017"/><ellipse cx="56.5" cy="66.5" rx="1.5" ry="1.8" fill="white"/>
      <ellipse cx="75" cy="68" rx="4.5" ry="5" fill="#2c2017"/><ellipse cx="76.5" cy="66.5" rx="1.5" ry="1.8" fill="white"/>
      <ellipse cx="65" cy="78" rx="3.5" ry="2.5" fill="#2c2017"/>
      <path d="M62 81Q65 85 68 81" stroke="#2c2017" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      <ellipse cx="48" cy="76" rx="5" ry="3" fill="#f4a84a" opacity=".35"/>
      <ellipse cx="82" cy="76" rx="5" ry="3" fill="#f4a84a" opacity=".35"/>
    </svg>
  );
}

export default function Menu({ profile, onStartPractice, onStartTutor, onStartAquarium, onStartSpeed, onStartMemory, onStartTimer, onStartChores, onStartCoach, onStartPresentation, onStartFable, onOpenDashboard, onOpenNotifications, onOpenStudyReminder, onStartFlashcard, onOpenFamily, onOpenAgenda, onOpenBioFlashcard, onOpenTestResults, onOpenBoukili, onStartJournal, onStartReading, onStartNylaFlashcard, onStartNylaSpeed, onOpenCompose, onSwitchProfile, darkMode, onToggleDark }) {
  // Dispatch a tile click — special-case modes that open their own screen instead of the practice flow
  const launchMode = (id) => {
    if (id === 'biographie_jr_flashcard') return onOpenBioFlashcard && onOpenBioFlashcard();
    if (id === 'nyla_boukili') return onOpenBoukili && onOpenBoukili();
    if (id === 'nyla_logiciel') return window.open('https://www.logicieleducatif.fr/', '_blank', 'noopener,noreferrer');
    if (id === 'nyla_letters_flash') return onStartNylaFlashcard && onStartNylaFlashcard('letters_upper');
    if (id === 'nyla_letters_lower_flash') return onStartNylaFlashcard && onStartNylaFlashcard('letters_lower');
    if (id === 'nyla_numbers_flash') return onStartNylaFlashcard && onStartNylaFlashcard('numbers');
    if (id === 'nyla_speed') return onStartNylaSpeed && onStartNylaSpeed();
    return onStartPractice(id);
  };
  const [stats, setStats] = useState(null);
  const [tab, setTab] = useState('math');
  const [dicteesOpen, setDicteesOpen] = useState(false);
  const [nylaWordsOpen, setNylaWordsOpen] = useState(false);

  // Grade / saison "fenêtres" — Ryan seulement (2e année · Été · 3e année à venir)
  const ryanGraded = profile === 'ryan';
  const inSummer = (() => { const n = new Date(); return n >= new Date(2026, 5, 27) && n < new Date(2026, 8, 2); })();
  const [section, setSection] = useState(ryanGraded && inSummer ? 'summer' : 'grade2');

  useEffect(() => {
    getProgress().then(setStats).catch(() => {});
  }, []);

  const totalCorrect = stats?.totals?.correct || 0;
  const totalQuestions = stats?.totals?.total || 0;
  const pct = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  const sessionCount = stats?.sessions?.length || 0;

  const isCayla = profile === 'cayla';
  const isNyla = profile === 'nyla';
  const isDemo = profile === 'demo';
  const isRyan = profile === 'ryan' || isDemo; // demo gets Ryan's 2e année content
  const name = isDemo ? 'Mon ami' : profile === 'ryan' ? 'Ryan' : isCayla ? 'Cayla' : 'Nyla';
  const grade = isCayla ? '6e année' : isNyla ? 'Pré-maternelle' : '2e année';
  const mathModes = isCayla ? caylaMathModes : isNyla ? nylaMathModes : ryanMathModes;
  const frenchModes = isCayla ? caylaFrenchModes : isNyla ? nylaFrenchModes : ryanFrenchModes;
  const modes = tab === 'math' ? mathModes : frenchModes;
  const featured = modes.find(m => m.featured);
  const grid = modes.filter(m => !m.featured);

  return (
    <div className="relative z-[1] max-w-3xl mx-auto px-4 pt-4 pb-12">
      {/* Top bar */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm text-white"
            style={{ background: 'linear-gradient(135deg, #3aa0e8, #ffc24d)' }}>
            <Sun size={20} />
          </div>
          <span className="font-heading text-2xl font-extrabold text-stone tracking-tight">Study Buddy</span>
        </div>
        <div className="flex gap-2">
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
          <button onClick={onSwitchProfile}
            className="bg-white border-2 border-s2 rounded-xl px-3 py-2 text-sm font-bold text-s6 hover:border-lava hover:text-lava transition-all">
            👤 {name}
          </button>
        </div>
      </div>

      {/* Greeting banner with fox */}
      <div className="rounded-3xl mb-4 overflow-hidden flex items-end min-h-[165px]"
        style={{ background: 'linear-gradient(135deg, #e8f6ff, #fff3d6 55%, #ffe0b3)' }}>
        <div className="flex-1 p-6 z-[1]">
          <div className="font-heading text-sm font-bold text-fox-d mb-0.5 tracking-wide">☀️ Mode été</div>
          <h1 className="font-heading text-3xl font-extrabold text-stone leading-tight mb-1">Bonjour {name}!</h1>
          <p className="text-sm font-semibold text-s4">
            {pct >= 70 ? "Belle journée d'été — tu es en feu! ☀️" :
             totalQuestions > 0 ? "Un peu de révision d'été, tu progresses! 🏖️" :
             "C'est l'été! Prêt pour un peu de révision? 🌴"}
          </p>
        </div>
        <div className="flex-shrink-0 mr-2 z-[1]">
          <FoxMascot />
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

      {/* Coach button — the BIG one (Ryan: lives in the ☀️ Été window instead) */}
      {onStartCoach && !isDemo && !ryanGraded && !isNyla && (
        <button onClick={onStartCoach}
          className="w-full rounded-2xl p-5 mb-3 flex items-center gap-4 transition-all hover:-translate-y-0.5 active:scale-[0.98]"
          style={{ background: 'linear-gradient(135deg, #c74a15, #e8622a 50%, #fdcb6e)', boxShadow: '0 6px 24px rgba(199,74,21,0.25)' }}>
          <div className="w-14 h-14 rounded-2xl bg-white/25 flex items-center justify-center flex-shrink-0 text-white">
            <Target size={26} />
          </div>
          <div className="text-left flex-1">
            <div className="font-heading text-xl font-extrabold text-white leading-tight">Mon Coach</div>
            <div className="text-xs font-semibold text-white/85">Suis le plan, ne réfléchis pas — juste GO!</div>
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

      {/* Mes lectures — read-to-earn, encourage books over screens */}
      {onStartReading && !isDemo && (
        <button onClick={onStartReading}
          className="w-full rounded-2xl p-4 mb-3 flex items-center gap-4 transition-all hover:-translate-y-0.5 active:scale-[0.98]"
          style={{ background: 'linear-gradient(135deg, #2d7a3a, #6cc24a)', boxShadow: '0 5px 22px rgba(45,122,58,0.18)' }}>
          <div className="w-11 h-11 rounded-xl bg-white/25 flex items-center justify-center flex-shrink-0 text-white text-2xl">📚</div>
          <div className="text-left flex-1">
            <div className="font-heading text-lg font-extrabold text-white leading-tight">Mes lectures · 20$/livre</div>
            <div className="text-xs font-semibold text-white/85">Lis un livre, gagne de l'argent! 💰</div>
          </div>
          <ChevronRight className="text-white/40" size={20} strokeWidth={3} />
        </button>
      )}

      {/* Grade / saison "fenêtres" — Ryan seulement */}
      {ryanGraded && (
        <div className="flex gap-2 mb-4 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {[
            { id: 'grade2', label: '📘 2e année' },
            { id: 'summer', label: '☀️ Été' },
            { id: 'grade3', label: '📗 3e année' },
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

      {/* 📗 Fenêtre 3e année (à venir) */}
      {ryanGraded && section === 'grade3' && (
        <div className="bg-white border-2 border-s1 rounded-2xl p-8 mb-6 text-center">
          <div className="text-5xl mb-3">📗</div>
          <h3 className="font-heading text-2xl font-extrabold text-stone mb-1">3e année</h3>
          <p className="text-sm font-semibold text-s4 leading-relaxed">
            Bientôt! Ton contenu de 3e année arrive à la rentrée. 🍁<br/>
            Pour l'instant, profite de l'été! ☀️
          </p>
        </div>
      )}

      {/* 📘 Fenêtre 2e année (+ Cayla / Nyla) */}
      {(!ryanGraded || section === 'grade2') && (
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
        <button onClick={() => featured.groupKind === 'nylawords' ? setNylaWordsOpen(true) : featured.isGroup ? setDicteesOpen(true) : launchMode(featured.id)}
          className="w-full rounded-2xl p-5 mb-3 flex items-center gap-4 transition-all hover:-translate-y-0.5 active:scale-[0.98]"
          style={{ background: 'linear-gradient(135deg, #c74a15, #e8622a)', boxShadow: '0 5px 22px rgba(199,74,21,0.15)' }}>
          <div className="w-11 h-11 rounded-xl bg-white/25 flex items-center justify-center flex-shrink-0 text-white">
            <Sparkles size={22} />
          </div>
          <div className="text-left flex-1">
            <div className="font-heading text-xl font-extrabold text-white leading-tight">{featured.label}</div>
            <div className="text-sm font-semibold text-white/70">{featured.desc}</div>
          </div>
          <ChevronRight className="text-white/40" size={20} strokeWidth={3} />
        </button>
      )}

      {/* Module grid */}
      <div className="grid grid-cols-2 gap-2.5 mb-6">
        {grid.map(mode => (
          <button key={mode.id}
            onClick={() => mode.groupKind === 'nylawords' ? setNylaWordsOpen(true) : mode.isGroup ? setDicteesOpen(true) : launchMode(mode.id)}
            className="bg-white border-2 border-s1 rounded-2xl p-4 text-left transition-all
              hover:border-fox hover:shadow-md hover:-translate-y-0.5 active:scale-[0.97] relative">
            {mode.badge && (
              <span className={`absolute top-2.5 right-2.5 text-[10px] font-bold px-2 py-0.5 rounded-lg ${
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
        </>
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
              {(isCayla ? caylaDicteeWeeksList : dicteeWeeksList).map((d) => (
                <div key={d.id}
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
                    <button onClick={() => { setDicteesOpen(false); onStartPractice(d.id); }}
                      className="flex-1 py-2 rounded-lg font-bold text-white text-sm"
                      style={{ background: 'linear-gradient(90deg, #c74a15, #e8622a)' }}>
                      ▶ Choix multiple
                    </button>
                    {onStartFlashcard && d.id !== 'dictee_revision' && (
                      <button onClick={() => { setDicteesOpen(false); onStartFlashcard(d.id); }}
                        className="flex-1 py-2 rounded-lg font-bold text-fox-d text-sm bg-orange-50 border-2 border-orange-200 hover:border-fox">
                        🃏 Flashcard
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* AI Tutor */}
      {isRyan && (
        <button onClick={onStartTutor}
          className="w-full flex items-center gap-4 bg-white border-2 border-s1 rounded-2xl p-4 mb-3 transition-all hover:border-info hover:shadow-md">
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

      {/* Presentation tool — discreet, available for next presentation */}
      {isRyan && onStartPresentation && (
        <button onClick={onStartPresentation}
          className="w-full flex items-center gap-4 bg-white border-2 border-s1 rounded-2xl p-4 mb-6 transition-all hover:border-fox hover:shadow-md">
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

      {/* Games — not for Nyla (Ryan/Cayla level) */}
      {!isNyla && (<>
      <div className="font-heading text-base font-bold text-s4 mb-3">Jeux</div>
      <div className="grid grid-cols-3 gap-2.5 mb-6">
        <button onClick={onStartAquarium}
          className="bg-white border-2 border-s1 rounded-2xl p-4 text-center transition-all hover:border-fox hover:-translate-y-0.5 active:scale-95">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2" style={{ background: '#e6f5f0', color: '#0f766e' }}>
            <Fish size={20} />
          </div>
          <div className="text-xs font-bold text-s6">Aquarium</div>
        </button>
        <button onClick={onStartSpeed}
          className="bg-white border-2 border-s1 rounded-2xl p-4 text-center transition-all hover:border-fox hover:-translate-y-0.5 active:scale-95">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2" style={{ background: '#fef0e4', color: '#c74a15' }}>
            <Zap size={20} />
          </div>
          <div className="text-xs font-bold text-s6">Course</div>
        </button>
        <button onClick={onStartMemory}
          className="bg-white border-2 border-s1 rounded-2xl p-4 text-center transition-all hover:border-fox hover:-translate-y-0.5 active:scale-95">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2" style={{ background: '#f0ecfb', color: '#6d28d9' }}>
            <Layers size={20} />
          </div>
          <div className="text-xs font-bold text-s6">Mémoire</div>
        </button>
      </div>
      </>)}

      {/* Stats */}
      {totalQuestions > 0 && (
        <>
          <div className="font-heading text-base font-bold text-s4 mb-3">Progrès</div>
          <div className="grid grid-cols-3 gap-2.5 mb-4">
            <div className="bg-white border-2 border-s1 rounded-xl p-3 text-center">
              <div className="font-heading text-3xl font-extrabold text-ok">{pct}%</div>
              <div className="text-[10px] font-bold text-s4 uppercase tracking-wide">Score</div>
            </div>
            <div className="bg-white border-2 border-s1 rounded-xl p-3 text-center">
              <div className="font-heading text-3xl font-extrabold text-lava">{totalQuestions}</div>
              <div className="text-[10px] font-bold text-s4 uppercase tracking-wide">Questions</div>
            </div>
            <div className="bg-white border-2 border-s1 rounded-xl p-3 text-center">
              <div className="font-heading text-3xl font-extrabold text-fox">{sessionCount}</div>
              <div className="text-[10px] font-bold text-s4 uppercase tracking-wide">Sessions</div>
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes tailwag { 0%,100%{transform:rotate(-5deg)} 50%{transform:rotate(15deg)} }
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
      `}</style>
    </div>
  );
}

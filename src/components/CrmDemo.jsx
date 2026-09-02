import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, Users, Calendar as CalendarIcon, Plus, X, TrendingUp, Phone,
  ShieldCheck, Search, Wallet, Receipt, ListChecks, Check, ImageIcon,
  Inbox, PhoneCall, CalendarCheck, Stethoscope, FileText, Megaphone,
  History as HistoryIcon, Eye, Heart, MessageCircle, Share2, Play,
  CalendarPlus, Target, Upload, Sparkles,
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts';

const STAGES = ['Nový dopyt', 'Kontaktovaný', 'Konzultácia naplánovaná', 'Pacient'];

const STAGE_STYLE = {
  'Nový dopyt': { color: '#5B7FA6', bg: '#EAF0F7' },
  'Kontaktovaný': { color: '#B8791F', bg: '#FBF0DD' },
  'Konzultácia naplánovaná': { color: '#3E8F76', bg: '#E4F3EE' },
  'Pacient': { color: '#12403E', bg: '#DCE8E5' },
};

const INVOICE_STYLE = {
  'Zaplatená': { color: '#3E8F76', bg: '#E4F3EE' },
  'Čaká na úhradu': { color: '#B8791F', bg: '#FBF0DD' },
  'Po splatnosti': { color: '#B84A3E', bg: '#FBE4E1' },
};

const EVENT_META = {
  dopyt: { icon: Inbox, color: '#5B7FA6', bg: '#EAF0F7' },
  kontakt: { icon: PhoneCall, color: '#B8791F', bg: '#FBF0DD' },
  konzultacia: { icon: CalendarCheck, color: '#3E8F76', bg: '#E4F3EE' },
  rtg: { icon: ImageIcon, color: '#5C716C', bg: '#EFF4F3' },
  zakrok: { icon: Stethoscope, color: '#12403E', bg: '#DCE8E5' },
  faktura: { icon: Receipt, color: '#C98A2E', bg: '#F3E4C8' },
  poznamka: { icon: FileText, color: '#8A9C97', bg: '#F5F8F7' },
};

const EVENT_DETAIL_META = {
  dopyt: { fields: [['Zdroj dopytu', 'Web formulár / telefón / sociálne siete'], ['Zaznamenal', 'Recepcia'], ['Ďalší krok', 'Telefonický kontakt do 24 hodín']], dropzone: false },
  kontakt: { fields: [['Spôsob kontaktu', 'Telefonicky'], ['Výsledok hovoru', 'Dohodnutý ďalší krok'], ['Zaznamenal', 'Recepcia']], dropzone: false },
  konzultacia: { fields: [['Lekár', 'MUDr. Katarína Novotná'], ['Očakávané trvanie', '30 min'], ['Miestnosť', 'Ambulancia 1']], dropzone: true, dropLabel: 'Priložiť súhlas alebo poznámky z konzultácie' },
  rtg: { fields: [['Vyžiadal', 'Ošetrujúci lekár'], ['Zariadenie', 'Interné RTG kliniky']], dropzone: true, dropLabel: 'Priložiť RTG snímok (DICOM / JPG / PDF)' },
  zakrok: { fields: [['Vykonal', 'Ošetrujúci lekár'], ['Použitý materiál', 'Podľa zdravotnej dokumentácie']], dropzone: true, dropLabel: 'Priložiť správu zo zákroku' },
  faktura: { fields: [], dropzone: false, linkToInvoice: true },
  poznamka: { fields: [], dropzone: false },
};

const SERVICES = ['Implantáty', 'Zubná hygiena', 'Rovnátka', 'Estetická stomatológia', 'Vstupná prehliadka'];
const DOCTORS = ['MUDr. Katarína Novotná', 'MUDr. Roman Beňo'];
const BOOKING_SLOTS = {
  'MUDr. Katarína Novotná': ['Po 9:00', 'Po 11:00', 'St 10:00', 'Št 14:00'],
  'MUDr. Roman Beňo': ['Ut 9:00', 'Ut 13:00', 'St 15:00', 'Pi 10:00'],
};

const SUPPLIER = {
  name: 'Template Klinika s.r.o.',
  address: 'Ukážková 1, 811 01 Bratislava',
  ico: '00 000 000',
  dic: '2000000000',
  icDph: 'SK2000000000',
  iban: 'SK00 0000 0000 0000 0000 0000',
};

const TAB_INTRO = {
  dashboard: 'Toto je Prehľad — rýchly pohľad na to, čo sa v klinike deje tento týždeň: nové dopyty, konzultácie a ich vývoj v čase. V reálnom nasadení má každý člen tímu svoj vlastný prístupový kód a CRM presne podľa toho, čo potrebuje — recepcia, lekár aj majiteľ majú svoj pohľad.',
  patients: 'Tu vidíte cestu každého pacienta — od prvého dopytu až po pravidelnú starostlivosť. Kliknutím na kartu otvoríte celý detail vrátane RTG a dokumentácie.',
  calendar: 'Týždenný prehľad termínov. Kliknutím na termín sa dostanete priamo k danému pacientovi.',
  tasks: 'Jednoduchý zoznam vecí na vybavenie — objednávky materiálu, papierovanie, čokoľvek prevádzkové.',
  archive: 'Zadajte meno pacienta a uvidíte celú jeho históriu na jednom mieste — dopyty, snímky, zákroky aj faktúry.',
  booking: 'Verejná rezervačná stránka pre recepciu aj pacientov — vyberiete službu, lekára a voľný termín, systém urobí zvyšok.',
  content: 'Prehľad toho, ako funguje váš organický obsah — dosah, zobrazenia aj najlepšie príspevky.',
  plan: 'Mesačný prehľad podľa služby — kde rastiete, kde je priestor na zlepšenie, a konkrétne kroky ako to dosiahnuť.',
  finance: 'Peniaze na jednom mieste — tržby, priemerná hodnota pacienta aj to, čo ešte len príde.',
  invoices: 'Platby od pacientov aj platby, ktoré robíte vy sami (materiál, laboratórium) — prehľadne oddelené na jednom mieste.',
};

const INITIAL_PATIENTS = [
  { id: 1, name: 'Jana Kováčová', phone: '+421 905 111 222', service: 'Implantáty', stage: 'Nový dopyt', note: '28. 7.',
    checklist: [{ label: 'Odporúčanie od lekára', done: false }, { label: 'Vstupný RTG snímok', done: false }, { label: 'Preukaz poistenca', done: false }, { label: 'Podpísaný súhlas s ošetrením', done: false }],
    xrays: [], notes: 'Prvý kontakt cez formulár na webe. Zatiaľ nekontaktovaná.' },
  { id: 2, name: 'Martin Sedlák', phone: '+421 903 222 333', service: 'Vstupná prehliadka', stage: 'Nový dopyt', note: '28. 7.',
    checklist: [{ label: 'Odporúčanie od lekára', done: false }, { label: 'Vstupný RTG snímok', done: false }, { label: 'Preukaz poistenca', done: false }, { label: 'Podpísaný súhlas s ošetrením', done: false }],
    xrays: [], notes: 'Dopyt cez telefón, žiada termín v poobedňajších hodinách.' },
  { id: 3, name: 'Andrea Šimková', phone: '+421 910 333 444', service: 'Rovnátka', stage: 'Nový dopyt', note: '27. 7.',
    checklist: [{ label: 'Odporúčanie od lekára', done: false }, { label: 'Vstupný RTG snímok', done: false }, { label: 'Preukaz poistenca', done: false }, { label: 'Podpísaný súhlas s ošetrením', done: false }],
    xrays: [], notes: 'Záujem po zhliadnutí Instagram videa o rovnátkach.' },
  { id: 4, name: 'Eva Horváthová', phone: '+421 907 444 555', service: 'Rovnátka', stage: 'Kontaktovaný', note: '26. 7.',
    checklist: [{ label: 'Odporúčanie od lekára', done: true }, { label: 'Vstupný RTG snímok', done: false }, { label: 'Preukaz poistenca', done: false }, { label: 'Podpísaný súhlas s ošetrením', done: false }],
    xrays: [], notes: 'Čaká na termín, uprednostňuje utorky.' },
  { id: 5, name: 'Peter Malík', phone: '+421 911 555 666', service: 'Implantáty', stage: 'Kontaktovaný', note: '25. 7.',
    checklist: [{ label: 'Odporúčanie od lekára', done: true }, { label: 'Vstupný RTG snímok', done: true }, { label: 'Preukaz poistenca', done: false }, { label: 'Podpísaný súhlas s ošetrením', done: false }],
    xrays: [{ label: 'Panoramatický RTG', date: '22. 7. 2026' }], notes: 'Platba za predchádzajúcu faktúru je po splatnosti — pripomenúť.' },
  { id: 6, name: 'Lucia Bartošová', phone: '+421 904 666 777', service: 'Estetická stomatológia', stage: 'Konzultácia naplánovaná', note: '30. 7. o 9:00',
    checklist: [{ label: 'Odporúčanie od lekára', done: true }, { label: 'Vstupný RTG snímok', done: true }, { label: 'Preukaz poistenca', done: true }, { label: 'Podpísaný súhlas s ošetrením', done: false }],
    xrays: [{ label: 'Panoramatický RTG', date: '20. 7. 2026' }], notes: 'Konzultácia potvrdená, poslať pripomienku deň vopred.' },
  { id: 7, name: 'Tomáš Novák', phone: '+421 908 777 888', service: 'Implantáty', stage: 'Konzultácia naplánovaná', note: '31. 7. o 11:00',
    checklist: [{ label: 'Odporúčanie od lekára', done: true }, { label: 'Vstupný RTG snímok', done: true }, { label: 'Preukaz poistenca', done: true }, { label: 'Podpísaný súhlas s ošetrením', done: true }],
    xrays: [{ label: 'CBCT sken', date: '18. 7. 2026' }], notes: 'Zaujíma sa aj o bielenie zubov po dokončení implantátu.' },
  { id: 8, name: 'Zuzana Krajčovičová', phone: '+421 902 888 999', service: 'Zubná hygiena', stage: 'Pacient', note: 'pacientka od 3/2026',
    checklist: [{ label: 'Odporúčanie od lekára', done: true }, { label: 'Vstupný RTG snímok', done: true }, { label: 'Preukaz poistenca', done: true }, { label: 'Podpísaný súhlas s ošetrením', done: true }],
    xrays: [{ label: 'Panoramatický RTG', date: '3. 3. 2026' }, { label: 'Kontrolný RTG', date: '10. 6. 2026' }], notes: 'Pravidelná hygiena každých 6 mesiacov, ďalší termín november 2026.' },
  { id: 9, name: 'Ján Vareha', phone: '+421 918 999 000', service: 'Implantáty', stage: 'Pacient', note: 'pacient od 1/2026',
    checklist: [{ label: 'Odporúčanie od lekára', done: true }, { label: 'Vstupný RTG snímok', done: true }, { label: 'Preukaz poistenca', done: true }, { label: 'Podpísaný súhlas s ošetrením', done: true }],
    xrays: [{ label: 'CBCT sken', date: '5. 1. 2026' }, { label: 'Kontrolný RTG', date: '15. 5. 2026' }], notes: 'Implantát zavedený, hojenie prebieha bez komplikácií.' },
];

const TIMELINES = {
  'Jana Kováčová': [{ date: '28. 7. 2026', type: 'dopyt', label: 'Dopyt prijatý cez web formulár — záujem o implantáty' }],
  'Martin Sedlák': [{ date: '28. 7. 2026', type: 'dopyt', label: 'Dopyt prijatý telefonicky — vstupná prehliadka' }],
  'Andrea Šimková': [{ date: '27. 7. 2026', type: 'dopyt', label: 'Dopyt prijatý — reakcia na Instagram video o rovnátkach' }],
  'Eva Horváthová': [
    { date: '24. 7. 2026', type: 'dopyt', label: 'Dopyt prijatý — záujem o rovnátka' },
    { date: '26. 7. 2026', type: 'kontakt', label: 'Telefonicky kontaktovaná, čaká sa na termín' },
  ],
  'Peter Malík': [
    { date: '10. 7. 2026', type: 'faktura', label: 'Faktúra F2026-0145 — 1 200 € (predchádzajúce ošetrenie, po splatnosti)' },
    { date: '20. 7. 2026', type: 'dopyt', label: 'Nový dopyt — záujem o implantáty' },
    { date: '22. 7. 2026', type: 'rtg', label: 'Nahratý panoramatický RTG snímok' },
    { date: '25. 7. 2026', type: 'kontakt', label: 'Kontaktovaný, čaká sa na potvrdenie termínu' },
  ],
  'Lucia Bartošová': [
    { date: '18. 7. 2026', type: 'dopyt', label: 'Dopyt — estetická stomatológia' },
    { date: '20. 7. 2026', type: 'rtg', label: 'Nahratý panoramatický RTG snímok' },
    { date: '22. 7. 2026', type: 'kontakt', label: 'Kontaktovaná, termín dohodnutý' },
    { date: '25. 7. 2026', type: 'faktura', label: 'Faktúra F2026-0144 — 420 € (čaká na úhradu)' },
    { date: '30. 7. 2026', type: 'konzultacia', label: 'Naplánovaná konzultácia o 9:00' },
  ],
  'Tomáš Novák': [
    { date: '12. 7. 2026', type: 'dopyt', label: 'Dopyt — implantáty' },
    { date: '18. 7. 2026', type: 'rtg', label: 'Nahratý CBCT sken' },
    { date: '20. 7. 2026', type: 'kontakt', label: 'Kontaktovaný, prejavil záujem aj o bielenie zubov' },
    { date: '27. 7. 2026', type: 'faktura', label: 'Faktúra F2026-0146 — 680 € (čaká na úhradu)' },
    { date: '31. 7. 2026', type: 'konzultacia', label: 'Naplánovaná konzultácia o 11:00' },
  ],
  'Zuzana Krajčovičová': [
    { date: '3. 3. 2026', type: 'dopyt', label: 'Dopyt — zubná hygiena' },
    { date: '3. 3. 2026', type: 'rtg', label: 'Nahratý panoramatický RTG snímok' },
    { date: '10. 3. 2026', type: 'zakrok', label: 'Vykonaná vstupná hygiena chrupu' },
    { date: '10. 6. 2026', type: 'rtg', label: 'Kontrolný RTG snímok' },
    { date: '10. 6. 2026', type: 'zakrok', label: 'Kontrolná hygiena chrupu' },
    { date: '20. 7. 2026', type: 'faktura', label: 'Faktúra F2026-0142 — 85 € (zaplatená)' },
    { date: '', type: 'poznamka', label: 'Ďalší termín naplánovaný na november 2026' },
  ],
  'Ján Vareha': [
    { date: '5. 1. 2026', type: 'dopyt', label: 'Dopyt — implantáty' },
    { date: '5. 1. 2026', type: 'rtg', label: 'Nahratý CBCT sken' },
    { date: '20. 1. 2026', type: 'zakrok', label: 'Zavedenie implantátu' },
    { date: '15. 5. 2026', type: 'rtg', label: 'Kontrolný RTG snímok' },
    { date: '15. 5. 2026', type: 'zakrok', label: 'Kontrola hojenia' },
    { date: '22. 7. 2026', type: 'faktura', label: 'Faktúra F2026-0143 — 950 € (zaplatená)' },
    { date: '', type: 'poznamka', label: 'Hojenie prebieha bez komplikácií' },
  ],
};

const WEEKLY = [
  { week: '1', dopyty: 6 }, { week: '2', dopyty: 8 }, { week: '3', dopyty: 7 },
  { week: '4', dopyty: 11 }, { week: '5', dopyty: 9 }, { week: '6', dopyty: 13 },
  { week: '7', dopyty: 12 }, { week: '8', dopyty: 14 },
];

const CONTENT_WEEKLY = [
  { week: '1', dosah: 9200 }, { week: '2', dosah: 11400 }, { week: '3', dosah: 10100 },
  { week: '4', dosah: 14800 }, { week: '5', dosah: 13200 }, { week: '6', dosah: 18900 },
  { week: '7', dosah: 21300 }, { week: '8', dosah: 24800 },
];

const REVENUE_BY_SERVICE = [
  { service: 'Implantáty', trzby: 8400 }, { service: 'Rovnátka', trzby: 3200 },
  { service: 'Zubná hygiena', trzby: 1100 }, { service: 'Estetika', trzby: 2600 },
  { service: 'Prehliadka', trzby: 400 },
];

const SERVICE_PLAN = [
  { service: 'Implantáty', count: 9, trend: 12, note: 'Funguje veľmi dobre — pokračovať v aktuálnom obsahu a reklame.' },
  { service: 'Vstupná prehliadka', count: 11, trend: 18, note: 'Silný vstupný kanál do lievika, udržať frekvenciu obsahu.' },
  { service: 'Zubná hygiena', count: 14, trend: 5, note: 'Stabilné — vhodné na pripomienkové kampane (6-mesačné kontroly).' },
  { service: 'Rovnátka', count: 3, trend: -8, note: 'Pokles oproti minulému mesiacu — odporúčame 2 nové videá o priebehu liečby.' },
  { service: 'Estetická stomatológia', count: 2, trend: -20, note: 'Najslabšia služba tento mesiac — potrebuje cielenú pozornosť.' },
];

const PLAN_RECOMMENDATIONS = [
  'Reel nápad: 3 prípady „pred a po" za posledný mesiac, trendy hudba, text „Toto sa dá zmeniť za jednu návštevu."',
  'Doplnok pre callera: pri každom dopyte sa opýtať aj „Riešili ste niekedy aj estetiku úsmevu?" — cross-sell do existujúcich dopytov.',
  'Reklama: cielenie 5–10 km okolo kliniky, vek 25–45, záujem beauty/estetika, rozpočet cca 15 €/deň na 2 týždne.',
];

const INITIAL_INVOICES = [
  { id: 1, number: 'F2026-0142', patient: 'Zuzana Krajčovičová', companyName: 'Zuzana Krajčovičová', ico: '', dic: '', vatPayer: false, service: 'Zubná hygiena', amount: 85, date: '20. 7. 2026', status: 'Zaplatená' },
  { id: 2, number: 'F2026-0143', patient: 'Ján Vareha', companyName: 'Ján Vareha', ico: '', dic: '', vatPayer: false, service: 'Implantát — zavedenie', amount: 950, date: '22. 7. 2026', status: 'Zaplatená' },
  { id: 3, number: 'F2026-0144', patient: 'Lucia Bartošová', companyName: 'Lucia Bartošová', ico: '', dic: '', vatPayer: false, service: 'Estetická stomatológia — konzultácia', amount: 420, date: '25. 7. 2026', status: 'Čaká na úhradu' },
  { id: 4, number: 'F2026-0145', patient: 'Peter Malík', companyName: 'Peter Malík', ico: '', dic: '', vatPayer: false, service: 'Implantáty — vstupné ošetrenie', amount: 1200, date: '10. 7. 2026', status: 'Po splatnosti' },
  { id: 5, number: 'F2026-0146', patient: 'Tomáš Novák', companyName: 'Tomáš Novák', ico: '', dic: '', vatPayer: false, service: 'Implantáty — konzultácia', amount: 680, date: '27. 7. 2026', status: 'Čaká na úhradu' },
];

const RECEIVED_INVOICES = [
  { id: 1, number: 'D2026-088', supplier: 'Dentálne laboratórium Novák s.r.o.', amount: 640, date: '18. 7. 2026', status: 'Čaká na úhradu' },
  { id: 2, number: 'D2026-089', supplier: 'MedMat s.r.o. — zdravotnícky materiál', amount: 310, date: '15. 7. 2026', status: 'Zaplatená' },
  { id: 3, number: 'M2026-014', supplier: 'Miraculum — marketing a obsah', amount: 890, date: '1. 7. 2026', status: 'Zaplatená' },
  { id: 4, number: 'D2026-090', supplier: 'Zubotechnika Šulek', amount: 480, date: '22. 7. 2026', status: 'Po splatnosti' },
];

const APPOINTMENTS = [
  { day: 'Po', time: '9:00', name: 'Lucia Bartošová', service: 'Estetická stomatológia' },
  { day: 'Po', time: '13:00', name: 'Ján Vareha', service: 'Kontrola — implantát' },
  { day: 'Ut', time: '10:00', name: 'Tomáš Novák', service: 'Konzultácia — implantáty' },
  { day: 'St', time: '9:00', name: 'Zuzana Krajčovičová', service: 'Zubná hygiena' },
  { day: 'St', time: '14:00', name: 'Nový pacient', service: 'Konzultácia — rovnátka' },
  { day: 'Št', time: '11:00', name: 'Peter Malík', service: 'Implantáty — 2. fáza' },
  { day: 'Pi', time: '9:00', name: 'Andrea Šimková', service: 'Vstupná konzultácia' },
];

const DAYS = ['Po', 'Ut', 'St', 'Št', 'Pi'];
const HOURS = ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];

function formatSk(d) { return `${d.getDate()}. ${d.getMonth() + 1}. ${d.getFullYear()}`; }
function getWeekRange(d) {
  const day = (d.getDay() + 6) % 7;
  const monday = new Date(d); monday.setDate(d.getDate() - day);
  const sunday = new Date(monday); sunday.setDate(monday.getDate() + 6);
  return `${monday.getDate()}. ${monday.getMonth() + 1}. – ${sunday.getDate()}. ${sunday.getMonth() + 1}.`;
}

function AnimatedNumber({ value, suffix = '', duration = 800, decimals = 0 }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let raf; let start = null;
    function step(ts) {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(value * eased);
      if (progress < 1) raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return <span>{display.toLocaleString('sk-SK', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</span>;
}

const STYLE = `


.tk-root { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; background: #F5F8F7; color: #142420; min-height: 100vh; display: flex; }
.tk-root * { box-sizing: border-box; }
.tk-mono { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
.tk-display { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }

.tk-sidebar { width: 240px; flex-shrink: 0; background: #FFFFFF; border-right: 1px solid #E2E9E7; padding: 24px 16px; display: flex; flex-direction: column; gap: 16px; }
.tk-logo-row { display: flex; align-items: center; gap: 10px; padding: 0 8px; }
.tk-logo-mark { width: 38px; height: 38px; border-radius: 12px; background: linear-gradient(135deg, #17534F, #0D302E); color: #F5F8F7; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 4px 12px -2px rgba(18,64,62,0.4); }
.tk-logo-text { line-height: 1.15; }
.tk-logo-text .name { font-weight: 600; font-size: 15px; }
.tk-badge { display: inline-flex; align-items: center; gap: 5px; font-size: 10.5px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: #B8791F; background: #FBF0DD; border: 1px solid #F0DDB2; padding: 4px 8px; border-radius: 6px; margin: 8px 8px 0; }
.tk-tour-banner { background: #E4F3EE; border: 1px solid #C7E2D8; border-radius: 10px; padding: 9px 10px; font-size: 11.5px; color: #12403E; line-height: 1.4; display: flex; gap: 6px; align-items: flex-start; margin: 0 8px; }
.tk-tour-banner button { background: none; border: none; color: #3E8F76; cursor: pointer; font-size: 13px; flex-shrink: 0; margin-left: auto; }
.tk-nav { display: flex; flex-direction: column; gap: 2px; overflow-y: auto; }
.tk-nav-group-label { font-size: 10.5px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: #8A9C97; padding: 10px 12px 4px; }
.tk-nav-item { position: relative; display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500; color: #5C716C; background: transparent; border: none; text-align: left; width: 100%; transition: background 0.15s ease, color 0.15s ease; }
.tk-nav-item:hover { background: #EFF4F3; color: #142420; }
.tk-nav-item.active { background: linear-gradient(135deg, #DCE8E5, #CBE0DB); color: #0D302E; box-shadow: inset 0 0 0 1px rgba(18,64,62,0.06); }
.tk-nav-item:focus-visible { outline: 2px solid #12403E; outline-offset: 2px; }
.tk-nav-dot { position: absolute; left: 25px; top: 7px; width: 7px; height: 7px; border-radius: 50%; background: #3E8F76; animation: tk-pulse 1.6s ease-in-out infinite; }

.tk-sidebar-foot { margin-top: auto; padding: 12px; border-radius: 10px; background: #EFF4F3; font-size: 12px; color: #5C716C; display: flex; gap: 8px; align-items: flex-start; line-height: 1.4; }

.tk-main { flex: 1; padding: 32px 40px; overflow-y: auto; }
.tk-page-head { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 24px; gap: 16px; flex-wrap: wrap; }
.tk-page-title { font-size: 24px; font-weight: 600; }
.tk-page-sub { color: #5C716C; font-size: 14px; margin-top: 4px; }

.tk-intro-card { display: flex; gap: 12px; align-items: flex-start; background: #FFFFFF; border: 1px solid #DCE8E5; border-left: 3px solid #3E8F76; border-radius: 12px; padding: 13px 16px; margin-bottom: 20px; animation: tk-fade-up 0.3s ease both; }
.tk-intro-text { font-size: 13px; color: #3E5E5A; line-height: 1.55; flex: 1; }
.tk-intro-dismiss { background: #DCE8E5; color: #12403E; border: none; padding: 6px 12px; border-radius: 7px; font-size: 12px; font-weight: 600; cursor: pointer; flex-shrink: 0; }
.tk-intro-dismiss:hover { background: #C7DCD7; }

.tk-btn { display: inline-flex; align-items: center; gap: 6px; background: linear-gradient(135deg, #17534F, #0D302E); color: #F5F8F7; border: none; padding: 10px 17px; border-radius: 11px; font-size: 13.5px; font-weight: 500; cursor: pointer; transition: all 0.2s cubic-bezier(.16,1,.3,1); box-shadow: 0 2px 8px -2px rgba(18,64,62,0.35); }
.tk-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 16px -4px rgba(18,64,62,0.45); }
.tk-btn:disabled { opacity: 0.45; cursor: not-allowed; }
.tk-btn:focus-visible { outline: 2px solid #12403E; outline-offset: 2px; }

.tk-toggle { background: #FFFFFF; border: 1px solid #E2E9E7; color: #5C716C; padding: 8px 14px; border-radius: 8px; font-size: 12.5px; font-weight: 600; cursor: pointer; }
.tk-toggle.active { background: #12403E; color: #F5F8F7; border-color: #12403E; }
.tk-toggle.small { padding: 5px 10px; font-size: 11.5px; }

.tk-search { display: flex; align-items: center; gap: 8px; background: #FFFFFF; border: 1px solid #E2E9E7; border-radius: 12px; padding: 9px 12px; font-size: 13.5px; color: #5C716C; min-width: 220px; transition: border-color 0.2s ease, box-shadow 0.2s ease; }
.tk-search:focus-within { border-color: #9FC2BB; box-shadow: 0 0 0 3px rgba(62,143,118,0.12); }

.tk-kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
.tk-card { background: #FFFFFF; border: 1px solid #EAF0EE; border-radius: 18px; padding: 18px 20px; animation: tk-fade-up 0.4s ease both; box-shadow: 0 1px 2px rgba(20,36,32,0.03), 0 10px 24px -14px rgba(20,36,32,0.12); transition: transform 0.25s cubic-bezier(.16,1,.3,1), box-shadow 0.25s ease; }
.tk-card:hover { transform: translateY(-2px); box-shadow: 0 4px 8px rgba(20,36,32,0.04), 0 16px 32px -12px rgba(20,36,32,0.16); }
.tk-kpi-label { font-size: 12.5px; color: #5C716C; font-weight: 500; }
.tk-kpi-value { font-size: 30px; font-weight: 600; margin-top: 6px; }
.tk-kpi-trend { display: flex; align-items: center; gap: 4px; font-size: 12px; color: #3E8F76; margin-top: 6px; font-weight: 500; }
.tk-live-dot { width: 7px; height: 7px; border-radius: 50%; background: #3E8F76; display: inline-block; animation: tk-pulse 1.6s ease-in-out infinite; }

.tk-panel { background: #FFFFFF; border: 1px solid #EAF0EE; border-radius: 18px; padding: 20px 24px; box-shadow: 0 1px 2px rgba(20,36,32,0.03), 0 10px 24px -16px rgba(20,36,32,0.1); }
.tk-panel-title { font-size: 15px; font-weight: 600; margin-bottom: 4px; }
.tk-panel-sub { font-size: 12.5px; color: #5C716C; margin-bottom: 12px; }

.tk-pipeline { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
.tk-stage-col { display: flex; flex-direction: column; gap: 10px; }
.tk-stage-head { display: flex; align-items: center; justify-content: space-between; padding: 0 2px; }
.tk-stage-name { font-size: 12.5px; font-weight: 600; }
.tk-pill { font-size: 11px; font-weight: 600; padding: 2px 7px; border-radius: 999px; }
.tk-pcard { background: #FFFFFF; border: 1px solid #EAF0EE; border-radius: 14px; padding: 12px 13px; animation: tk-fade-up 0.35s ease both; cursor: pointer; transition: all 0.2s cubic-bezier(.16,1,.3,1); box-shadow: 0 1px 2px rgba(20,36,32,0.03); }
.tk-pcard:hover { box-shadow: 0 10px 24px -8px rgba(18,64,62,0.16); border-color: #C7D8D4; transform: translateY(-2px); }
.tk-pcard-name { font-size: 13.5px; font-weight: 600; }
.tk-pcard-service { font-size: 12px; color: #5C716C; margin-top: 3px; }
.tk-pcard-foot { display: flex; align-items: center; justify-content: space-between; margin-top: 9px; font-size: 11.5px; color: #8A9C97; }
.tk-pcard-phone { display: flex; align-items: center; gap: 4px; }

.tk-cal-grid { display: grid; grid-template-columns: 64px repeat(5, 1fr); border-top: 1px solid #E2E9E7; border-left: 1px solid #E2E9E7; border-radius: 10px; overflow: hidden; }
.tk-cal-head { background: #EFF4F3; font-size: 12.5px; font-weight: 600; padding: 10px 8px; border-right: 1px solid #E2E9E7; border-bottom: 1px solid #E2E9E7; text-align: center; }
.tk-cal-time { font-size: 11px; color: #8A9C97; padding: 10px 8px; border-right: 1px solid #E2E9E7; border-bottom: 1px solid #E2E9E7; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
.tk-cal-cell { min-height: 52px; border-right: 1px solid #E2E9E7; border-bottom: 1px solid #E2E9E7; padding: 4px; }
.tk-cal-appt { background: #DCE8E5; color: #12403E; border-radius: 7px; padding: 5px 7px; font-size: 11px; font-weight: 600; line-height: 1.3; height: 100%; cursor: pointer; transition: background 0.15s ease; }
.tk-cal-appt:hover { background: #C7DCD7; }
.tk-cal-appt-sub { font-weight: 400; color: #3E5E5A; }

.tk-table { width: 100%; border-collapse: collapse; }
.tk-table th { text-align: left; font-size: 11.5px; font-weight: 600; letter-spacing: 0.03em; text-transform: uppercase; color: #8A9C97; padding: 0 10px 10px; border-bottom: 1px solid #E2E9E7; }
.tk-table td { padding: 12px 10px; border-bottom: 1px solid #EFF4F3; font-size: 13.5px; }
.tk-table tr:last-child td { border-bottom: none; }

.tk-task-item { display: flex; align-items: center; gap: 12px; padding: 12px 4px; border-bottom: 1px solid #EFF4F3; }
.tk-task-item:last-child { border-bottom: none; }
.tk-check-box { width: 20px; height: 20px; border-radius: 6px; border: 1.5px solid #C7D8D4; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; background: #FFFFFF; }
.tk-check-box.done { background: #12403E; border-color: #12403E; color: #F5F8F7; }
.tk-task-text { font-size: 13.5px; flex: 1; }
.tk-task-text.done { color: #8A9C97; text-decoration: line-through; }
.tk-task-tag { font-size: 11px; font-weight: 600; color: #5B7FA6; background: #EAF0F7; padding: 3px 8px; border-radius: 999px; }

.tk-call-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 12px 4px; border-bottom: 1px solid #EFF4F3; }
.tk-call-row:last-child { border-bottom: none; }

.tk-modal-backdrop { position: fixed; inset: 0; background: rgba(13, 26, 24, 0.45); backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; z-index: 40; animation: tk-fade-in 0.2s ease both; padding: 20px; }
.tk-modal { background: #FFFFFF; border-radius: 22px; width: 380px; padding: 24px; animation: tk-pop-in 0.25s cubic-bezier(.16,1,.3,1) both; box-shadow: 0 24px 64px -16px rgba(13,26,24,0.35); }
.tk-modal.wide { width: 540px; max-height: 85vh; overflow-y: auto; }
.tk-modal-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.tk-modal-title { font-size: 16px; font-weight: 600; }
.tk-close { background: none; border: none; cursor: pointer; color: #8A9C97; padding: 4px; border-radius: 6px; }
.tk-close:hover { background: #EFF4F3; }
.tk-field { margin-bottom: 14px; }
.tk-field label { display: block; font-size: 12.5px; font-weight: 500; color: #5C716C; margin-bottom: 5px; }
.tk-field input, .tk-field select { width: 100%; padding: 9px 11px; border: 1px solid #E2E9E7; border-radius: 10px; font-size: 13.5px; font-family: inherit; color: #142420; background: #FFFFFF; transition: border-color 0.2s ease, box-shadow 0.2s ease; }
.tk-field input:focus, .tk-field select:focus { outline: none; border-color: #3E8F76; box-shadow: 0 0 0 3px rgba(62,143,118,0.15); }

.tk-slot { background: #FFFFFF; border: 1px solid #E2E9E7; color: #142420; padding: 7px 12px; border-radius: 999px; font-size: 12.5px; font-weight: 500; cursor: pointer; }
.tk-slot.active { background: #12403E; color: #F5F8F7; border-color: #12403E; }

.tk-detail-section { margin-bottom: 18px; }
.tk-detail-label { font-size: 11.5px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; color: #8A9C97; margin-bottom: 8px; }
.tk-checklist-item { display: flex; align-items: center; gap: 8px; padding: 5px 0; font-size: 13px; }
.tk-checklist-item.done { color: #142420; }
.tk-checklist-item.pending { color: #8A9C97; }
.tk-checklist-dot { width: 16px; height: 16px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.tk-checklist-dot.done { background: #DCE8E5; color: #12403E; }
.tk-checklist-dot.pending { background: #EFF4F3; color: #C7D8D4; border: 1.5px dashed #C7D8D4; }
.tk-doc-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.tk-doc-card { border: 1px solid #E2E9E7; border-radius: 10px; padding: 10px; background: #FAFCFB; text-align: center; }
.tk-doc-card svg { color: #8A9C97; margin-bottom: 4px; }
.tk-doc-label { font-size: 11px; font-weight: 600; }
.tk-doc-date { font-size: 10.5px; color: #8A9C97; margin-top: 2px; }
.tk-empty-note { font-size: 12.5px; color: #8A9C97; font-style: italic; }
.tk-notes-box { background: #FAFCFB; border: 1px solid #E2E9E7; border-radius: 10px; padding: 12px; font-size: 13px; color: #3E5E5A; line-height: 1.5; }

.tk-archive-suggestion { padding: 9px 10px; border-radius: 8px; cursor: pointer; font-size: 13.5px; font-weight: 500; }
.tk-archive-suggestion:hover { background: #EFF4F3; }
.tk-timeline { position: relative; padding-left: 4px; }
.tk-timeline-item { display: flex; gap: 14px; position: relative; padding-bottom: 24px; }
.tk-timeline-item:last-child { padding-bottom: 0; }
.tk-timeline-item:last-child .tk-timeline-line { display: none; }
.tk-timeline-dot { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; z-index: 1; }
.tk-timeline-line { position: absolute; left: 13px; top: 28px; bottom: -24px; width: 2px; background: #E2E9E7; }
.tk-timeline-content { padding-top: 4px; }
.tk-timeline-date { font-size: 11px; color: #8A9C97; margin-bottom: 2px; }
.tk-timeline-label { font-size: 13.5px; font-weight: 500; }
.tk-timeline-clickable { cursor: pointer; }
.tk-timeline-clickable:hover .tk-timeline-content { opacity: 0.75; }

.tk-dropzone { border: 2px dashed #C7D8D4; border-radius: 12px; padding: 18px; text-align: center; color: #8A9C97; font-size: 12.5px; cursor: pointer; transition: border-color 0.15s ease, background 0.15s ease; margin-top: 10px; }
.tk-dropzone svg { margin-bottom: 6px; color: #8A9C97; }
.tk-dropzone.active { border-color: #3E8F76; background: #E4F3EE; color: #3E8F76; }
.tk-dropzone.active svg { color: #3E8F76; }
.tk-dropzone-sub { font-size: 11px; margin-top: 2px; color: #B7C4C0; }

.tk-top-post-thumb { width: 100%; aspect-ratio: 16/9; background: linear-gradient(135deg, #12403E, #3E8F76); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #F5F8F7; }

.tk-toast { position: fixed; bottom: 24px; right: 24px; z-index: 50; background: #12403E; color: #F5F8F7; border-radius: 13px; padding: 14px 16px; display: flex; gap: 10px; max-width: 320px; box-shadow: 0 12px 30px rgba(18, 64, 62, 0.25); animation: tk-slide-in 0.3s ease both; }
.tk-toast-title { font-size: 13px; font-weight: 600; margin-bottom: 3px; }
.tk-toast-body { font-size: 12px; color: #B9CEC9; line-height: 1.4; }
.tk-toast-close { background: none; border: none; color: #B9CEC9; cursor: pointer; flex-shrink: 0; }

@keyframes tk-fade-up { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
@keyframes tk-fade-in { from { opacity: 0; } to { opacity: 1; } }
@keyframes tk-pop-in { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
@keyframes tk-slide-in { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
@keyframes tk-pulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(62,143,118,0.5); } 50% { box-shadow: 0 0 0 5px rgba(62,143,118,0); } }

@media (prefers-reduced-motion: reduce) { .tk-card, .tk-pcard, .tk-modal-backdrop, .tk-modal, .tk-toast, .tk-live-dot, .tk-nav-dot { animation: none !important; } }

.tk-ai-loading { display: flex; align-items: center; gap: 10px; font-size: 12.5px; color: #3E8F76; margin-top: 10px; }
.tk-ai-spinner { width: 14px; height: 14px; border-radius: 50%; border: 2px solid #DCE8E5; border-top-color: #3E8F76; animation: tk-spin 0.8s linear infinite; flex-shrink: 0; }
.tk-ai-summary { margin-top: 12px; background: #FAFCFB; border: 1px solid #DCE8E5; border-radius: 10px; padding: 12px 14px; animation: tk-fade-up 0.3s ease both; }
.tk-ai-summary-title { display: flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 600; color: #3E8F76; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.04em; }
.tk-ai-summary-row { font-size: 12.5px; line-height: 1.6; margin-bottom: 3px; }
.tk-ai-summary-note { font-size: 11px; color: #8A9C97; font-style: italic; margin-top: 6px; }
@keyframes tk-spin { to { transform: rotate(360deg); } }

.tk-welcome { min-height: 100vh; width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; background: linear-gradient(160deg, #0D302E, #12403E 45%, #1A5450); color: #F5F8F7; text-align: center; padding: 40px; font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; animation: tk-fade-in 0.4s ease both; position: relative; overflow: hidden; }
.tk-welcome::before { content: ''; position: absolute; width: 600px; height: 600px; border-radius: 50%; background: radial-gradient(circle, rgba(201,138,46,0.18), transparent 70%); top: -220px; right: -160px; pointer-events: none; }
.tk-welcome::after { content: ''; position: absolute; width: 500px; height: 500px; border-radius: 50%; background: radial-gradient(circle, rgba(62,143,118,0.22), transparent 70%); bottom: -200px; left: -140px; pointer-events: none; }
.tk-welcome > * { position: relative; z-index: 1; }
.tk-welcome-badge { display: inline-flex; align-items: center; gap: 5px; font-size: 10.5px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #F0DDB2; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.2); padding: 5px 12px; border-radius: 999px; margin-bottom: 28px; animation: tk-fade-up 0.5s ease both; }
.tk-welcome-logo { width: 64px; height: 64px; border-radius: 16px; background: #F5F8F7; color: #12403E; display: flex; align-items: center; justify-content: center; font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; font-weight: 700; font-size: 24px; margin-bottom: 24px; animation: tk-fade-up 0.5s ease both; animation-delay: 0.08s; }
.tk-welcome-title { font-size: 36px; font-weight: 600; margin-bottom: 14px; animation: tk-fade-up 0.5s ease both; animation-delay: 0.15s; }
.tk-welcome-sub { font-size: 15px; color: #C7DCD7; max-width: 480px; line-height: 1.65; margin-bottom: 30px; animation: tk-fade-up 0.5s ease both; animation-delay: 0.2s; }
.tk-welcome-hook { font-size: 19px; color: #F5F8F7; font-weight: 500; max-width: 460px; margin-bottom: 22px; }
.tk-welcome-pills { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; margin-bottom: 32px; animation: tk-fade-up 0.5s ease both; animation-delay: 0.22s; }
.tk-welcome-pill { font-size: 11.5px; font-weight: 500; color: #E4F3EE; background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.14); padding: 6px 12px; border-radius: 999px; }
.tk-welcome-btn { padding: 13px 26px; font-size: 14.5px; background: #F5F8F7 !important; color: #12403E !important; animation: tk-fade-up 0.5s ease both; animation-delay: 0.28s; }
.tk-welcome-btn:hover { background: #E4F3EE !important; }
.tk-welcome-foot { margin-top: 36px; font-size: 11.5px; color: rgba(245,248,247,0.5); animation: tk-fade-up 0.5s ease both; animation-delay: 0.34s; }

@media (max-width: 860px) {
  .tk-sidebar { width: 72px; }
  .tk-logo-text, .tk-badge, .tk-nav-item span, .tk-sidebar-foot, .tk-nav-group-label, .tk-tour-banner { display: none; }
  .tk-nav-item { justify-content: center; }
  .tk-main { padding: 20px; }
  .tk-kpi-grid, .tk-pipeline, .tk-doc-grid { grid-template-columns: 1fr 1fr; }
}
`;

export default function CrmDemo() {
  const today = new Date();
  const [showWelcome, setShowWelcome] = useState(true);
  const [tab, setTab] = useState('dashboard');
  const [patients, setPatients] = useState(INITIAL_PATIENTS);
  const [invoices, setInvoices] = useState(INITIAL_INVOICES);
  const patientDelta = Math.max(0, patients.length - INITIAL_PATIENTS.length);
  const unpaidTotal = invoices.filter((i) => i.status !== 'Zaplatená').reduce((sum, i) => sum + i.amount, 0);
  const [tasks, setTasks] = useState(INITIAL_TASKS_SAFE());
  const [invoiceView, setInvoiceView] = useState('issued');
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [openPatient, setOpenPatient] = useState(null);
  const [openInvoice, setOpenInvoice] = useState(null);
  const [openEvent, setOpenEvent] = useState(null);
  const [toast, setToast] = useState(null);
  const [patientForm, setPatientForm] = useState({ name: '', phone: '', service: SERVICES[0], notes: '' });
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiSummary, setAiSummary] = useState(null);
  const [invoiceForm, setInvoiceForm] = useState({ patient: INITIAL_PATIENTS[0].name, companyName: INITIAL_PATIENTS[0].name, ico: '', dic: '', vatPayer: false, amount: '', showCompanyFields: false });
  const [taskForm, setTaskForm] = useState({ text: '' });
  const [archiveQuery, setArchiveQuery] = useState('');
  const [archivePatient, setArchivePatient] = useState(null);
  const [visited, setVisited] = useState({});
  const [dismissedIntro, setDismissedIntro] = useState({});
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [confirmed, setConfirmed] = useState({});
  const [booking, setBooking] = useState({ service: SERVICES[0], doctor: DOCTORS[0], slot: '', name: '', phone: '' });
  const [bookingDone, setBookingDone] = useState(false);

  function INITIAL_TASKS_SAFE() {
    return [
      { id: 1, text: 'Objednať materiál na implantáty na budúci týždeň', done: false, patient: null },
      { id: 2, text: 'Pripraviť podklady pre poisťovňu', done: false, patient: 'Peter Malík' },
      { id: 3, text: 'Potvrdiť dodanie zubnej protézy z laboratória', done: true, patient: null },
      { id: 4, text: 'Zavolať pacientom s omeškanou platbou', done: false, patient: 'Peter Malík' },
      { id: 5, text: 'Skontrolovať zásoby anestetík', done: true, patient: null },
    ];
  }

  function showDisclaimer(title) {
    setToast({ title, body: 'Toto je ukážkový template určený na demonštráciu. Vo vašom vlastnom systéme by boli tieto dáta súkromné a viditeľné len pre vašu kliniku.' });
  }

  function selectTab(id) { setTab(id); setVisited((v) => ({ ...v, [id]: true })); }

  function addPatient(e) {
    e.preventDefault();
    if (!patientForm.name.trim()) return;
    const entry = {
      id: Date.now(), name: patientForm.name.trim(), phone: patientForm.phone.trim() || '—',
      service: patientForm.service, stage: 'Nový dopyt', note: formatSk(today),
      checklist: [{ label: 'Odporúčanie od lekára', done: !!aiSummary }, { label: 'Vstupný RTG snímok', done: false }, { label: 'Preukaz poistenca', done: false }, { label: 'Podpísaný súhlas s ošetrením', done: false }],
      xrays: [], notes: patientForm.notes.trim() || 'Zatiaľ bez poznámok.',
    };
    setPatients((p) => [entry, ...p]);
    closePatientForm();
    showDisclaimer('Pacient pridaný');
  }

  function closePatientForm() {
    setShowPatientForm(false);
    setAiAnalyzing(false);
    setAiSummary(null);
    setPatientForm({ name: '', phone: '', service: SERVICES[0], notes: '' });
  }

  function runAiAgent() {
    setAiAnalyzing(true);
    setAiSummary(null);
    setTimeout(() => {
      const summary = {
        diagnoses: 'Hypertenzia (liečená), bez známych alergií na lokálne anestetiká',
        procedures: 'Extrakcia zuba múdrosti (2021), 2× výplň (2023)',
        allergies: 'Alergia na penicilín',
        note: 'Predchádzajúci lekár odporúča pred zákrokom skontrolovať krvný tlak.',
      };
      setAiAnalyzing(false);
      setAiSummary(summary);
      setPatientForm((f) => ({ ...f, notes: `${summary.diagnoses}. Doterajšie zákroky: ${summary.procedures}. Alergie: ${summary.allergies}. ${summary.note}` }));
    }, 1400);
  }

  function addInvoice(e) {
    e.preventDefault();
    if (!invoiceForm.amount || !invoiceForm.companyName.trim()) return;
    const linkedPatient = patients.find((p) => p.name === invoiceForm.patient);
    const entry = {
      id: Date.now(), number: `F2026-0${140 + invoices.length + 1}`, patient: invoiceForm.patient,
      companyName: invoiceForm.companyName.trim(), ico: invoiceForm.ico.trim(), dic: invoiceForm.dic.trim(),
      vatPayer: invoiceForm.vatPayer, service: linkedPatient?.service || 'Stomatologické ošetrenie',
      amount: Number(invoiceForm.amount), date: formatSk(today), status: 'Čaká na úhradu',
    };
    setInvoices((i) => [entry, ...i]);
    setInvoiceForm({ patient: patients[0]?.name || '', companyName: patients[0]?.name || '', ico: '', dic: '', vatPayer: false, amount: '', showCompanyFields: false });
    setShowInvoiceForm(false);
    showDisclaimer('Platba zaznamenaná');
  }

  function addTask(e) {
    e.preventDefault();
    if (!taskForm.text.trim()) return;
    setTasks((t) => [{ id: Date.now(), text: taskForm.text.trim(), done: false, patient: null }, ...t]);
    setTaskForm({ text: '' });
    setShowTaskForm(false);
    showDisclaimer('Úloha pridaná');
  }

  function toggleTask(id) { setTasks((t) => t.map((x) => (x.id === id ? { ...x, done: !x.done } : x))); }
  function openPatientByName(name) { const found = patients.find((p) => p.name === name); if (found) setOpenPatient(found); }
  function confirmBooking() { setBookingDone(true); showDisclaimer('Termín zarezervovaný'); }

  const nav = [
    { group: 'Prehľad', items: [{ id: 'dashboard', label: 'Prehľad', icon: LayoutDashboard }] },
    { group: 'Starostlivosť', items: [
      { id: 'patients', label: 'Pacienti', icon: Users },
      { id: 'calendar', label: 'Kalendár', icon: CalendarIcon },
      { id: 'tasks', label: 'Na vybavenie', icon: ListChecks },
      { id: 'archive', label: 'Archív pacientov', icon: HistoryIcon },
      { id: 'booking', label: 'Rezervácie', icon: CalendarPlus },
    ]},
    { group: 'Marketing', items: [
      { id: 'content', label: 'Obsah', icon: Megaphone },
      { id: 'plan', label: 'Plán na mesiac', icon: Target },
    ]},
    { group: 'Financie', items: [
      { id: 'finance', label: 'Financie', icon: Wallet },
      { id: 'invoices', label: 'Platby', icon: Receipt },
    ]},
  ];
  const totalNavItems = nav.reduce((acc, g) => acc + g.items.length, 0);

  function IntroCard({ id }) {
    if (dismissedIntro[id]) return null;
    return (
      <div className="tk-intro-card">
        <div className="tk-intro-text">{TAB_INTRO[id]}</div>
        <button className="tk-intro-dismiss" onClick={() => setDismissedIntro((d) => ({ ...d, [id]: true }))}>Rozumiem</button>
      </div>
    );
  }

  function Dropzone({ label, onDropFile }) {
    const [active, setActive] = useState(false);
    function handle() { if (onDropFile) onDropFile(); else showDisclaimer('Súbor pripravený na nahratie'); }
    return (
      <div
        className={`tk-dropzone ${active ? 'active' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setActive(true); }}
        onDragLeave={() => setActive(false)}
        onDrop={(e) => { e.preventDefault(); setActive(false); handle(); }}
        onClick={handle}
      >
        <Upload size={18} />
        <div>{label}</div>
        <div className="tk-dropzone-sub">Pretiahnite súbor sem alebo kliknite pre výber</div>
      </div>
    );
  }

  function findInvoiceByLabel(label) {
    const m = label.match(/F2026-\d+/);
    if (!m) return null;
    return invoices.find((i) => i.number === m[0]);
  }

  if (showWelcome) {
    return (
      <div className="tk-welcome">
        <style>{STYLE}</style>
        <div className="tk-welcome-badge"><ShieldCheck size={11} /> Ukážkový template</div>
        <div className="tk-welcome-logo"><Sparkles size={26} /></div>
        <div className="tk-welcome-title tk-display">Vitajte</div>
        <div className="tk-welcome-sub tk-welcome-hook">Chcete mať všetko na jednom mieste — a ešte aj moderne spracované?<br />Tak ste na správnom mieste.</div>
        <div className="tk-welcome-sub" style={{ fontSize: 13.5, marginTop: -14 }}>Takto by mohol vyzerať kompletný systém pre vašu kliniku — pacienti, kalendár, financie, obsah aj rezervácie na jednom mieste, prehľadne prepojené.</div>
        <div className="tk-welcome-pills">
          <span className="tk-welcome-pill">Pacienti a archív</span>
          <span className="tk-welcome-pill">Kalendár a rezervácie</span>
          <span className="tk-welcome-pill">Financie a platby</span>
          <span className="tk-welcome-pill">Obsah a plán</span>
        </div>
        <button className="tk-btn tk-welcome-btn" onClick={() => setShowWelcome(false)}>Vstúpiť do systému →</button>
        <div className="tk-welcome-foot">Pripravené pre kliniky — Miraculum</div>
      </div>
    );
  }

  return (
    <div className="tk-root">
      <style>{STYLE}</style>

      <aside className="tk-sidebar">
        <div>
          <div className="tk-logo-row"><div className="tk-logo-mark"><Sparkles size={17} /></div></div>
          <div className="tk-badge"><ShieldCheck size={11} /> Ukážkový template</div>
        </div>

        {Object.keys(visited).length < totalNavItems && !bannerDismissed && (
          <div className="tk-tour-banner">👉 Klikni na zelené bodky v menu — každá časť ti krátko povie, čo robí.<button onClick={() => setBannerDismissed(true)}><X size={13} /></button></div>
        )}

        <nav className="tk-nav">
          {nav.map((group) => (
            <div key={group.group}>
              <div className="tk-nav-group-label">{group.group}</div>
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <button key={item.id} className={`tk-nav-item ${tab === item.id ? 'active' : ''}`} onClick={() => selectTab(item.id)}>
                    <Icon size={17} />{!visited[item.id] && <span className="tk-nav-dot" />}<span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
        <div className="tk-sidebar-foot"><ShieldCheck size={14} style={{ flexShrink: 0, marginTop: 1 }} /><span>Ukážka pripravená pre kliniky — Miraculum. Žiadne reálne dáta klientov. Toto je zároveň základ toho, ako by vyzeral reálny systém pre vašu kliniku.</span></div>
      </aside>

      <main className="tk-main">
        {tab === 'dashboard' && (
          <>
            <div className="tk-page-head"><div><div className="tk-page-title tk-display">Prehľad kliniky</div><div className="tk-page-sub">Tento týždeň — {getWeekRange(today)}</div></div></div>
            <IntroCard id="dashboard" />
            <div className="tk-kpi-grid">
              <div className="tk-card"><div className="tk-kpi-label">Nové dopyty tento týždeň</div><div className="tk-kpi-value tk-mono"><AnimatedNumber value={14 + patientDelta} /></div><div className="tk-kpi-trend"><TrendingUp size={13} /> +17 % oproti minulému týždňu</div></div>
              <div className="tk-card" style={{ animationDelay: '0.05s' }}><div className="tk-kpi-label">Naplánované konzultácie</div><div className="tk-kpi-value tk-mono"><AnimatedNumber value={6} /></div><div className="tk-kpi-trend"><TrendingUp size={13} /> +2 oproti minulému týždňu</div></div>
              <div className="tk-card" style={{ animationDelay: '0.1s' }}><div className="tk-kpi-label">Konverzný pomer (dopyt → pacient)</div><div className="tk-kpi-value tk-mono"><AnimatedNumber value={32} suffix=" %" /></div><div className="tk-kpi-trend"><TrendingUp size={13} /> +4 p. b.</div></div>
              <div className="tk-card" style={{ animationDelay: '0.15s' }}><div className="tk-kpi-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>Aktívni pacienti <span className="tk-live-dot" /></div><div className="tk-kpi-value tk-mono"><AnimatedNumber value={128 + patientDelta} /></div><div className="tk-kpi-trend"><TrendingUp size={13} /> +9 tento mesiac</div></div>
            </div>
            <div className="tk-panel">
              <div className="tk-panel-title">Dopyty podľa týždňa</div><div className="tk-panel-sub">Posledných 8 týždňov</div>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={WEEKLY}><XAxis dataKey="week" tick={{ fontSize: 12, fill: '#8A9C97' }} axisLine={false} tickLine={false} /><Tooltip cursor={{ fill: '#EFF4F3' }} contentStyle={{ borderRadius: 10, border: '1px solid #E2E9E7', fontSize: 12.5, fontFamily: 'Inter, sans-serif' }} /><Bar dataKey="dopyty" fill="#12403E" radius={[6, 6, 0, 0]} /></BarChart>
              </ResponsiveContainer>
            </div>
            <div className="tk-panel" style={{ marginTop: 16 }}>
              <div className="tk-panel-title">Volania na potvrdenie termínu</div><div className="tk-panel-sub">Pacienti s naplánovanou konzultáciou tento týždeň</div>
              {patients.filter((p) => p.stage === 'Konzultácia naplánovaná').map((p) => {
                const missing = p.checklist.filter((c) => !c.done).map((c) => c.label);
                return (
                  <div key={p.id} className="tk-call-row">
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13.5 }}>{p.name} <span style={{ fontWeight: 400, color: '#8A9C97' }}>· {p.note}</span></div>
                      {missing.length > 0 && <div style={{ fontSize: 12, color: '#B8791F', marginTop: 2 }}>Pripomenúť doniesť: {missing.join(', ')}</div>}
                    </div>
                    <button className={`tk-toggle small ${confirmed[p.id] ? 'active' : ''}`} onClick={() => setConfirmed((c) => ({ ...c, [p.id]: !c[p.id] }))}>{confirmed[p.id] ? 'Potvrdené ✓' : 'Zavolať a potvrdiť'}</button>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {tab === 'patients' && (
          <>
            <div className="tk-page-head">
              <div><div className="tk-page-title tk-display">Pacienti</div><div className="tk-page-sub">Cesta pacienta od prvého dopytu po starostlivosť — klikni na kartu pre detail</div></div>
              <div style={{ display: 'flex', gap: 10 }}><div className="tk-search"><Search size={15} /> Hľadať pacienta…</div><button className="tk-btn" onClick={() => setShowPatientForm(true)}><Plus size={15} /> Pridať pacienta</button></div>
            </div>
            <IntroCard id="patients" />
            <div className="tk-pipeline">
              {STAGES.map((stage) => {
                const items = patients.filter((p) => p.stage === stage);
                const s = STAGE_STYLE[stage];
                return (
                  <div className="tk-stage-col" key={stage}>
                    <div className="tk-stage-head"><div className="tk-stage-name">{stage}</div><div className="tk-pill" style={{ color: s.color, background: s.bg }}>{items.length}</div></div>
                    {items.map((p) => (
                      <div className="tk-pcard" key={p.id} onClick={() => setOpenPatient(p)}>
                        <div className="tk-pcard-name">{p.name}</div><div className="tk-pcard-service">{p.service}</div>
                        <div className="tk-pcard-foot"><span className="tk-pcard-phone"><Phone size={11} /> {p.phone}</span><span>{p.note}</span></div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {tab === 'calendar' && (
          <>
            <div className="tk-page-head"><div><div className="tk-page-title tk-display">Kalendár</div><div className="tk-page-sub">Tento týždeň — {getWeekRange(today)} — klikni na termín pre detail pacienta</div></div></div>
            <IntroCard id="calendar" />
            <div className="tk-cal-grid">
              <div className="tk-cal-head" style={{ background: '#FFFFFF' }} />
              {DAYS.map((d) => <div className="tk-cal-head" key={d}>{d}</div>)}
              {HOURS.map((h) => (
                <React.Fragment key={h}>
                  <div className="tk-cal-time">{h}</div>
                  {DAYS.map((d) => {
                    const appt = APPOINTMENTS.find((a) => a.day === d && a.time === h);
                    return <div className="tk-cal-cell" key={d + h}>{appt && <div className="tk-cal-appt" onClick={() => openPatientByName(appt.name)}>{appt.name}<div className="tk-cal-appt-sub">{appt.service}</div></div>}</div>;
                  })}
                </React.Fragment>
              ))}
            </div>
          </>
        )}

        {tab === 'tasks' && (
          <>
            <div className="tk-page-head"><div><div className="tk-page-title tk-display">Na vybavenie</div><div className="tk-page-sub">Prevádzkové úlohy kliniky</div></div><button className="tk-btn" onClick={() => setShowTaskForm(true)}><Plus size={15} /> Pridať úlohu</button></div>
            <IntroCard id="tasks" />
            <div className="tk-panel">
              {tasks.map((t) => (
                <div className="tk-task-item" key={t.id}>
                  <div className={`tk-check-box ${t.done ? 'done' : ''}`} onClick={() => toggleTask(t.id)}>{t.done && <Check size={13} />}</div>
                  <div className={`tk-task-text ${t.done ? 'done' : ''}`}>{t.text}</div>
                  {t.patient && <div className="tk-task-tag" style={{ cursor: 'pointer' }} onClick={() => openPatientByName(t.patient)}>{t.patient}</div>}
                </div>
              ))}
            </div>
          </>
        )}

        {tab === 'archive' && (
          <>
            <div className="tk-page-head"><div><div className="tk-page-title tk-display">Archív pacientov</div><div className="tk-page-sub">Zadajte meno a zobrazí sa celá história — dopyty, kontakty, snímky, zákroky aj faktúry na jednom mieste</div></div></div>
            <IntroCard id="archive" />
            <div className="tk-panel" style={{ marginBottom: 20 }}>
              <div className="tk-search" style={{ width: '100%', maxWidth: 420 }}>
                <Search size={15} />
                <input value={archiveQuery} onChange={(e) => { setArchiveQuery(e.target.value); setArchivePatient(null); }} placeholder="Hľadať podľa mena pacienta…" style={{ border: 'none', outline: 'none', width: '100%', fontSize: 13.5, fontFamily: 'inherit', background: 'transparent', color: '#142420' }} />
              </div>
              {archiveQuery && !archivePatient && (
                <div style={{ marginTop: 10 }}>
                  {patients.filter((p) => p.name.toLowerCase().includes(archiveQuery.toLowerCase())).map((p) => (
                    <div key={p.id} className="tk-archive-suggestion" onClick={() => { setArchivePatient(p); setArchiveQuery(p.name); }}>{p.name} <span style={{ color: '#8A9C97', fontWeight: 400 }}>· {p.service}</span></div>
                  ))}
                </div>
              )}
            </div>
            {archivePatient ? (
              <>
                <div className="tk-page-head">
                  <div><div className="tk-page-title tk-display" style={{ fontSize: 20 }}>{archivePatient.name}</div><div className="tk-page-sub">{archivePatient.service} · <span className="tk-pill" style={{ color: STAGE_STYLE[archivePatient.stage].color, background: STAGE_STYLE[archivePatient.stage].bg }}>{archivePatient.stage}</span></div></div>
                  <button className="tk-btn" onClick={() => { setInvoiceForm({ patient: archivePatient.name, companyName: archivePatient.name, ico: '', dic: '', vatPayer: false, amount: '', showCompanyFields: false }); setShowInvoiceForm(true); }}><Plus size={15} /> Zaznamenať platbu</button>
                </div>
                <div className="tk-panel">
                  <div className="tk-timeline">
                    {(TIMELINES[archivePatient.name] || []).map((ev, i) => {
                      const meta = EVENT_META[ev.type]; const Icon = meta.icon;
                      return (
                        <div className="tk-timeline-item tk-timeline-clickable" key={i} onClick={() => setOpenEvent(ev)}>
                          <div className="tk-timeline-dot" style={{ background: meta.bg, color: meta.color }}><Icon size={13} /></div>
                          <div className="tk-timeline-line" />
                          <div className="tk-timeline-content"><div className="tk-timeline-date tk-mono">{ev.date}</div><div className="tk-timeline-label">{ev.label}</div></div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            ) : <div className="tk-panel"><div className="tk-empty-note">Zadajte meno pacienta vyššie pre zobrazenie jeho histórie.</div></div>}
          </>
        )}

        {tab === 'booking' && (
          <>
            <div className="tk-page-head"><div><div className="tk-page-title tk-display">Rezervačná stránka</div><div className="tk-page-sub">Verejný odkaz pre pacientov aj rýchlu rezerváciu na recepcii</div></div></div>
            <IntroCard id="booking" />
            <div className="tk-panel" style={{ maxWidth: 460 }}>
              {!bookingDone ? (
                <>
                  <div className="tk-field"><label>Služba</label><select value={booking.service} onChange={(e) => setBooking({ ...booking, service: e.target.value })}>{SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}</select></div>
                  <div className="tk-field"><label>Lekár</label><select value={booking.doctor} onChange={(e) => setBooking({ ...booking, doctor: e.target.value, slot: '' })}>{DOCTORS.map((d) => <option key={d} value={d}>{d}</option>)}</select></div>
                  <div className="tk-field">
                    <label>Voľný termín</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {(BOOKING_SLOTS[booking.doctor] || []).map((slot) => <button key={slot} type="button" className={`tk-slot ${booking.slot === slot ? 'active' : ''}`} onClick={() => setBooking({ ...booking, slot })}>{slot}</button>)}
                    </div>
                  </div>
                  <div className="tk-field"><label>Meno pacienta</label><input value={booking.name} onChange={(e) => setBooking({ ...booking, name: e.target.value })} placeholder="napr. Mária Nová" /></div>
                  <div className="tk-field"><label>Telefón</label><input value={booking.phone} onChange={(e) => setBooking({ ...booking, phone: e.target.value })} placeholder="+421 9xx xxx xxx" /></div>
                  <button className="tk-btn" style={{ width: '100%', justifyContent: 'center' }} disabled={!booking.slot || !booking.name.trim()} onClick={confirmBooking}>Rezervovať termín</button>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <CalendarCheck size={32} style={{ color: '#3E8F76', marginBottom: 10 }} />
                  <div style={{ fontWeight: 600, fontSize: 15 }}>Termín zarezervovaný</div>
                  <div style={{ fontSize: 13, color: '#5C716C', marginTop: 4 }}>{booking.service} · {booking.doctor} · {booking.slot}</div>
                  <button className="tk-btn" style={{ marginTop: 16 }} onClick={() => { setBookingDone(false); setBooking({ service: SERVICES[0], doctor: DOCTORS[0], slot: '', name: '', phone: '' }); }}>Nová rezervácia</button>
                </div>
              )}
            </div>
          </>
        )}

        {tab === 'content' && (
          <>
            <div className="tk-page-head"><div><div className="tk-page-title tk-display">Obsah a dosah</div><div className="tk-page-sub">Organický výkon — tento týždeň ({getWeekRange(today)})</div></div></div>
            <IntroCard id="content" />
            <div className="tk-kpi-grid">
              <div className="tk-card"><div className="tk-kpi-label">Dosah tento týždeň</div><div className="tk-kpi-value tk-mono"><AnimatedNumber value={24800} /></div><div className="tk-kpi-trend"><TrendingUp size={13} /> +22 % oproti minulému týždňu</div></div>
              <div className="tk-card" style={{ animationDelay: '0.05s' }}><div className="tk-kpi-label">Zobrazenia (impressions)</div><div className="tk-kpi-value tk-mono"><AnimatedNumber value={61200} /></div><div className="tk-kpi-trend"><TrendingUp size={13} /> +15 % oproti minulému týždňu</div></div>
              <div className="tk-card" style={{ animationDelay: '0.1s' }}><div className="tk-kpi-label">Priemerný engagement rate</div><div className="tk-kpi-value tk-mono"><AnimatedNumber value={6.8} decimals={1} suffix=" %" /></div><div className="tk-kpi-trend"><TrendingUp size={13} /> +1,2 p. b.</div></div>
              <div className="tk-card" style={{ animationDelay: '0.15s' }}><div className="tk-kpi-label">Noví sledovatelia</div><div className="tk-kpi-value tk-mono">+<AnimatedNumber value={142} /></div><div className="tk-kpi-trend"><TrendingUp size={13} /> +38 tento týždeň</div></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16 }}>
              <div className="tk-panel">
                <div className="tk-panel-title">Dosah podľa týždňa</div><div className="tk-panel-sub">Posledných 8 týždňov</div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={CONTENT_WEEKLY}><XAxis dataKey="week" tick={{ fontSize: 12, fill: '#8A9C97' }} axisLine={false} tickLine={false} /><Tooltip cursor={{ fill: '#EFF4F3' }} contentStyle={{ borderRadius: 10, border: '1px solid #E2E9E7', fontSize: 12.5, fontFamily: 'Inter, sans-serif' }} /><Bar dataKey="dosah" fill="#3E8F76" radius={[6, 6, 0, 0]} /></BarChart>
                </ResponsiveContainer>
              </div>
              <div className="tk-panel">
                <div className="tk-panel-title">Najlepší príspevok tohto týždňa</div><div className="tk-panel-sub">Video — implantáty</div>
                <div className="tk-top-post-thumb"><Play size={22} /></div>
                <div style={{ fontSize: 13.5, fontWeight: 600, marginTop: 10 }}>Ako prebieha zavedenie implantátu</div>
                <div style={{ fontSize: 12, color: '#5C716C', marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Eye size={13} /> 18 400 zhliadnutí</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Heart size={13} /> 890 lajkov</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><MessageCircle size={13} /> 64 komentárov</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Share2 size={13} /> 210 zdieľaní</span>
                </div>
              </div>
            </div>
          </>
        )}

        {tab === 'plan' && (
          <>
            <div className="tk-page-head"><div><div className="tk-page-title tk-display">Plán na budúci mesiac</div><div className="tk-page-sub">Výkon podľa služby a odporúčané kroky</div></div></div>
            <IntroCard id="plan" />
            <div className="tk-panel" style={{ marginBottom: 16 }}>
              <table className="tk-table">
                <thead><tr><th>Služba</th><th>Počet tento mesiac</th><th>Trend</th><th>Odporúčanie</th></tr></thead>
                <tbody>
                  {SERVICE_PLAN.map((s, i) => (
                    <tr key={i}><td style={{ fontWeight: 600 }}>{s.service}</td><td className="tk-mono">{s.count}</td><td style={{ color: s.trend >= 0 ? '#3E8F76' : '#B84A3E', fontWeight: 600 }}>{s.trend >= 0 ? '+' : ''}{s.trend} %</td><td style={{ fontSize: 12.5, color: '#5C716C', maxWidth: 300 }}>{s.note}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="tk-panel">
              <div className="tk-panel-title">Odporúčania na tento týždeň — Estetická stomatológia</div><div className="tk-panel-sub">Najslabšia služba tento mesiac (-20 %)</div>
              {PLAN_RECOMMENDATIONS.map((rec, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, padding: '9px 0', borderBottom: i < PLAN_RECOMMENDATIONS.length - 1 ? '1px solid #EFF4F3' : 'none' }}>
                  <div style={{ fontSize: 13.5, lineHeight: 1.6 }}>{rec}</div>
                  <button className="tk-toggle small" style={{ flexShrink: 0 }} onClick={() => { setTasks((t) => [{ id: Date.now() + i, text: rec, done: false, patient: null }, ...t]); showDisclaimer('Úloha pridaná'); }}>+ Ako úloha</button>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === 'finance' && (
          <>
            <div className="tk-page-head"><div><div className="tk-page-title tk-display">Financie</div><div className="tk-page-sub">Tento mesiac — {today.toLocaleDateString('sk-SK', { month: 'long', year: 'numeric' })}</div></div></div>
            <IntroCard id="finance" />
            <div className="tk-kpi-grid">
              <div className="tk-card"><div className="tk-kpi-label">Tržby tento mesiac</div><div className="tk-kpi-value tk-mono"><AnimatedNumber value={15700} suffix=" €" /></div><div className="tk-kpi-trend"><TrendingUp size={13} /> +11 % oproti minulému mesiacu</div></div>
              <div className="tk-card" style={{ animationDelay: '0.05s' }}><div className="tk-kpi-label">Priemerná hodnota pacienta</div><div className="tk-kpi-value tk-mono"><AnimatedNumber value={640} suffix=" €" /></div><div className="tk-kpi-trend"><TrendingUp size={13} /> +6 % oproti minulému mesiacu</div></div>
              <div className="tk-card" style={{ animationDelay: '0.1s' }}><div className="tk-kpi-label">Neuhradené platby</div><div className="tk-kpi-value tk-mono"><AnimatedNumber value={unpaidTotal} suffix=" €" /></div><div className="tk-kpi-trend" style={{ color: '#B8791F' }}><TrendingUp size={13} /> {invoices.filter((i) => i.status === 'Po splatnosti').length} po splatnosti</div></div>
              <div className="tk-card" style={{ animationDelay: '0.15s' }}><div className="tk-kpi-label">Očakávané tržby (budúci mesiac)</div><div className="tk-kpi-value tk-mono"><AnimatedNumber value={18200} suffix=" €" /></div><div className="tk-kpi-trend"><TrendingUp size={13} /> podľa naplánovaných konzultácií</div></div>
            </div>
            <div className="tk-panel">
              <div className="tk-panel-title">Tržby podľa služby</div><div className="tk-panel-sub">Aktuálny mesiac</div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={REVENUE_BY_SERVICE}><XAxis dataKey="service" tick={{ fontSize: 11.5, fill: '#8A9C97' }} axisLine={false} tickLine={false} /><Tooltip cursor={{ fill: '#EFF4F3' }} contentStyle={{ borderRadius: 10, border: '1px solid #E2E9E7', fontSize: 12.5, fontFamily: 'Inter, sans-serif' }} /><Bar dataKey="trzby" fill="#C98A2E" radius={[6, 6, 0, 0]} /></BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {tab === 'invoices' && (
          <>
            <div className="tk-page-head"><div><div className="tk-page-title tk-display">Platby</div><div className="tk-page-sub">Čo platia pacienti aj čo platíte vy — na jednom mieste</div></div>{invoiceView === 'issued' && <button className="tk-btn" onClick={() => setShowInvoiceForm(true)}><Plus size={15} /> Zaznamenať platbu</button>}</div>
            <IntroCard id="invoices" />
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <button className={`tk-toggle ${invoiceView === 'issued' ? 'active' : ''}`} onClick={() => setInvoiceView('issued')}>Platby od pacientov</button>
              <button className={`tk-toggle ${invoiceView === 'received' ? 'active' : ''}`} onClick={() => setInvoiceView('received')}>Naše platby (materiál, labor.)</button>
            </div>
            {invoiceView === 'issued' ? (
              <div className="tk-panel">
                <table className="tk-table">
                  <thead><tr><th>Číslo</th><th>Pacient</th><th>Suma</th><th>Dátum</th><th>Stav</th></tr></thead>
                  <tbody>{invoices.map((inv) => { const s = INVOICE_STYLE[inv.status]; return (
                    <tr key={inv.id} style={{ cursor: 'pointer' }} onClick={() => setOpenInvoice(inv)}><td className="tk-mono">{inv.number}</td><td><span style={{ textDecoration: 'underline', textDecorationStyle: 'dotted', textDecorationColor: '#C7D8D4' }} onClick={(e) => { e.stopPropagation(); openPatientByName(inv.patient); }}>{inv.companyName || inv.patient}</span></td><td className="tk-mono">{inv.amount} €</td><td>{inv.date}</td><td><span className="tk-pill" style={{ color: s.color, background: s.bg }}>{inv.status}</span></td></tr>
                  ); })}</tbody>
                </table>
                <div className="tk-empty-note" style={{ marginTop: 10 }}>Klikni na riadok pre detail platby, na meno pacienta pre jeho kartu.</div>
              </div>
            ) : (
              <div className="tk-panel">
                <table className="tk-table">
                  <thead><tr><th>Číslo</th><th>Dodávateľ</th><th>Suma</th><th>Dátum</th><th>Stav</th></tr></thead>
                  <tbody>{RECEIVED_INVOICES.map((inv) => { const s = INVOICE_STYLE[inv.status]; return (
                    <tr key={inv.id}><td className="tk-mono">{inv.number}</td><td>{inv.supplier}</td><td className="tk-mono">{inv.amount} €</td><td>{inv.date}</td><td><span className="tk-pill" style={{ color: s.color, background: s.bg }}>{inv.status}</span></td></tr>
                  ); })}</tbody>
                </table>
              </div>
            )}
          </>
        )}
      </main>

      {showPatientForm && (
        <div className="tk-modal-backdrop" onClick={closePatientForm}>
          <div className="tk-modal" onClick={(e) => e.stopPropagation()}>
            <div className="tk-modal-head"><div className="tk-modal-title">Pridať pacienta</div><button className="tk-close" onClick={closePatientForm}><X size={18} /></button></div>
            <form onSubmit={addPatient}>
              <div className="tk-field"><label>Meno a priezvisko</label><input value={patientForm.name} onChange={(e) => setPatientForm({ ...patientForm, name: e.target.value })} placeholder="napr. Mária Nová" autoFocus /></div>
              <div className="tk-field"><label>Telefón</label><input value={patientForm.phone} onChange={(e) => setPatientForm({ ...patientForm, phone: e.target.value })} placeholder="+421 9xx xxx xxx" /></div>
              <div className="tk-field"><label>Služba</label><select value={patientForm.service} onChange={(e) => setPatientForm({ ...patientForm, service: e.target.value })}>{SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}</select></div>
              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: '#5C716C', marginBottom: 5 }}>Zdravotná dokumentácia od predchádzajúceho lekára (voliteľné)</label>
              <Dropzone label="Priložiť dokumentáciu — AI agent ju spracuje" onDropFile={runAiAgent} />
              {aiAnalyzing && (
                <div className="tk-ai-loading"><div className="tk-ai-spinner" /><span>AI agent číta dokumentáciu…</span></div>
              )}
              {aiSummary && (
                <div className="tk-ai-summary">
                  <div className="tk-ai-summary-title"><Sparkles size={13} /> AI zhrnutie pacienta</div>
                  <div className="tk-ai-summary-row"><strong>Diagnózy:</strong> {aiSummary.diagnoses}</div>
                  <div className="tk-ai-summary-row"><strong>Doterajšie zákroky:</strong> {aiSummary.procedures}</div>
                  <div className="tk-ai-summary-row"><strong>Alergie:</strong> {aiSummary.allergies}</div>
                  <div className="tk-ai-summary-row"><strong>Poznámka lekára:</strong> {aiSummary.note}</div>
                  <div className="tk-ai-summary-note">Vygenerované AI agentom z priloženého dokumentu — pred uložením prosím overte správnosť.</div>
                </div>
              )}
              <div style={{ marginTop: 14 }} />
              <button className="tk-btn" type="submit" style={{ width: '100%', justifyContent: 'center' }}>Pridať do „Nový dopyt"</button>
            </form>
          </div>
        </div>
      )}

      {showInvoiceForm && (
        <div className="tk-modal-backdrop" onClick={() => setShowInvoiceForm(false)}>
          <div className="tk-modal" onClick={(e) => e.stopPropagation()}>
            <div className="tk-modal-head"><div className="tk-modal-title">Zaznamenať platbu</div><button className="tk-close" onClick={() => setShowInvoiceForm(false)}><X size={18} /></button></div>
            <form onSubmit={addInvoice}>
              <div className="tk-field"><label>Pacient</label><select value={invoiceForm.patient} onChange={(e) => setInvoiceForm({ ...invoiceForm, patient: e.target.value, companyName: e.target.value })}>{patients.map((p) => <option key={p.id} value={p.name}>{p.name}</option>)}</select></div>
              <div className="tk-field"><label>Suma (€)</label><input value={invoiceForm.amount} onChange={(e) => setInvoiceForm({ ...invoiceForm, amount: e.target.value })} placeholder="napr. 450" /></div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: '#5C716C', marginBottom: invoiceForm.showCompanyFields ? 12 : 4, cursor: 'pointer' }}>
                <input type="checkbox" checked={invoiceForm.showCompanyFields} onChange={(e) => setInvoiceForm({ ...invoiceForm, showCompanyFields: e.target.checked })} style={{ width: 'auto' }} />
                Fakturovať firme / poisťovni (IČO, DIČ, DPH)
              </label>
              {invoiceForm.showCompanyFields && (
                <>
                  <div className="tk-field"><label>Názov firmy</label><input value={invoiceForm.companyName} onChange={(e) => setInvoiceForm({ ...invoiceForm, companyName: e.target.value })} placeholder="napr. Firma s.r.o." /></div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div className="tk-field"><label>IČO</label><input value={invoiceForm.ico} onChange={(e) => setInvoiceForm({ ...invoiceForm, ico: e.target.value })} /></div>
                    <div className="tk-field"><label>DIČ</label><input value={invoiceForm.dic} onChange={(e) => setInvoiceForm({ ...invoiceForm, dic: e.target.value })} /></div>
                  </div>
                  <div className="tk-field"><label>Platca DPH</label><select value={invoiceForm.vatPayer ? 'ano' : 'nie'} onChange={(e) => setInvoiceForm({ ...invoiceForm, vatPayer: e.target.value === 'ano' })}><option value="nie">Nie je platca DPH</option><option value="ano">Platca DPH</option></select></div>
                </>
              )}
              <button className="tk-btn" type="submit" style={{ width: '100%', justifyContent: 'center' }}>Uložiť platbu</button>
            </form>
          </div>
        </div>
      )}

      {showTaskForm && (
        <div className="tk-modal-backdrop" onClick={() => setShowTaskForm(false)}>
          <div className="tk-modal" onClick={(e) => e.stopPropagation()}>
            <div className="tk-modal-head"><div className="tk-modal-title">Pridať úlohu</div><button className="tk-close" onClick={() => setShowTaskForm(false)}><X size={18} /></button></div>
            <form onSubmit={addTask}>
              <div className="tk-field"><label>Čo treba vybaviť</label><input value={taskForm.text} onChange={(e) => setTaskForm({ text: e.target.value })} placeholder="napr. Objednať materiál" autoFocus /></div>
              <button className="tk-btn" type="submit" style={{ width: '100%', justifyContent: 'center' }}>Pridať úlohu</button>
            </form>
          </div>
        </div>
      )}

      {openPatient && (
        <div className="tk-modal-backdrop" onClick={() => setOpenPatient(null)}>
          <div className="tk-modal wide" onClick={(e) => e.stopPropagation()}>
            <div className="tk-modal-head">
              <div><div className="tk-modal-title">{openPatient.name}</div><div style={{ fontSize: 12.5, color: '#5C716C', marginTop: 2 }}>{openPatient.service} · <span className="tk-pill" style={{ color: STAGE_STYLE[openPatient.stage].color, background: STAGE_STYLE[openPatient.stage].bg }}>{openPatient.stage}</span></div></div>
              <button className="tk-close" onClick={() => setOpenPatient(null)}><X size={18} /></button>
            </div>
            <div className="tk-detail-section"><div className="tk-detail-label">Kontakt</div><div style={{ fontSize: 13.5, display: 'flex', alignItems: 'center', gap: 6 }}><Phone size={13} /> {openPatient.phone}</div></div>
            <div className="tk-detail-section">
              <div className="tk-detail-label">Čo si mal priniesť</div>
              {openPatient.checklist.map((c, i) => <div key={i} className={`tk-checklist-item ${c.done ? 'done' : 'pending'}`}><div className={`tk-checklist-dot ${c.done ? 'done' : 'pending'}`}>{c.done && <Check size={10} />}</div>{c.label}</div>)}
            </div>
            <div className="tk-detail-section">
              <div className="tk-detail-label">Rentgenové snímky a dokumentácia</div>
              {openPatient.xrays.length > 0 ? (
                <div className="tk-doc-grid">{openPatient.xrays.map((x, i) => <div className="tk-doc-card" key={i}><ImageIcon size={20} /><div className="tk-doc-label">{x.label}</div><div className="tk-doc-date">{x.date}</div></div>)}</div>
              ) : <div className="tk-empty-note">Zatiaľ žiadne nahraté snímky.</div>}
              <Dropzone label="Pridať RTG snímok alebo dokument" />
            </div>
            <div className="tk-detail-section">
              <div className="tk-detail-label">Platby</div>
              {invoices.filter((i) => i.patient === openPatient.name).length > 0 ? (
                invoices.filter((i) => i.patient === openPatient.name).map((i) => {
                  const s = INVOICE_STYLE[i.status];
                  return <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '5px 0' }}><span>{i.service} · {i.date}</span><span className="tk-pill" style={{ color: s.color, background: s.bg }}>{i.amount} € · {i.status}</span></div>;
                })
              ) : <div className="tk-empty-note">Zatiaľ žiadne platby.</div>}
            </div>
            <div className="tk-detail-section">
              <div className="tk-detail-label">Súvisiace úlohy</div>
              {tasks.filter((t) => t.patient === openPatient.name).length > 0 ? (
                tasks.filter((t) => t.patient === openPatient.name).map((t) => (
                  <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, padding: '4px 0' }}>
                    <div className={`tk-check-box ${t.done ? 'done' : ''}`} style={{ width: 16, height: 16 }} onClick={() => toggleTask(t.id)}>{t.done && <Check size={10} />}</div>
                    <span className={t.done ? 'tk-task-text done' : ''}>{t.text}</span>
                  </div>
                ))
              ) : <div className="tk-empty-note">Žiadne naviazané úlohy.</div>}
            </div>
            <div className="tk-detail-section" style={{ marginBottom: 0 }}><div className="tk-detail-label">Poznámky</div><div className="tk-notes-box">{openPatient.notes}</div></div>
          </div>
        </div>
      )}

      {openInvoice && (
        <div className="tk-modal-backdrop" onClick={() => setOpenInvoice(null)}>
          <div className="tk-modal wide" onClick={(e) => e.stopPropagation()}>
            {(openInvoice.ico || openInvoice.dic || openInvoice.vatPayer) ? (
              <>
                <div className="tk-modal-head"><div className="tk-modal-title">Faktúra č. {openInvoice.number}</div><button className="tk-close" onClick={() => setOpenInvoice(null)}><X size={18} /></button></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 18 }}>
                  <div>
                    <div className="tk-detail-label">Dodávateľ</div>
                    <div style={{ fontSize: 13.5, fontWeight: 600 }}>{SUPPLIER.name}</div>
                    <div style={{ fontSize: 12.5, color: '#5C716C', lineHeight: 1.6 }}>{SUPPLIER.address}<br />IČO: {SUPPLIER.ico}<br />DIČ: {SUPPLIER.dic}<br />IČ DPH: {SUPPLIER.icDph}</div>
                  </div>
                  <div>
                    <div className="tk-detail-label">Odberateľ</div>
                    <div style={{ fontSize: 13.5, fontWeight: 600 }}>{openInvoice.companyName || openInvoice.patient}</div>
                    <div style={{ fontSize: 12.5, color: '#5C716C', lineHeight: 1.6 }}>
                      {openInvoice.ico ? <>IČO: {openInvoice.ico}<br /></> : null}
                      {openInvoice.dic ? <>DIČ: {openInvoice.dic}<br /></> : null}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 24, fontSize: 12.5, color: '#5C716C', marginBottom: 16 }}>
                  <div>Dátum vystavenia<br /><span style={{ color: '#142420', fontWeight: 500 }}>{openInvoice.date}</span></div>
                  <div>Splatnosť<br /><span style={{ color: '#142420', fontWeight: 500 }}>14 dní</span></div>
                  <div>Forma úhrady<br /><span style={{ color: '#142420', fontWeight: 500 }}>Prevodom</span></div>
                </div>
                <table className="tk-table" style={{ marginBottom: 14 }}>
                  <thead><tr><th>Popis</th><th>Suma</th></tr></thead>
                  <tbody><tr><td>{openInvoice.service}</td><td className="tk-mono">{openInvoice.amount.toFixed(2).replace('.', ',')} €</td></tr></tbody>
                </table>
                {openInvoice.vatPayer ? (
                  <div style={{ fontSize: 13, lineHeight: 1.8 }}>
                    <div>Základ dane: <span className="tk-mono">{openInvoice.amount.toFixed(2).replace('.', ',')} €</span></div>
                    <div>DPH 20 %: <span className="tk-mono">{(openInvoice.amount * 0.2).toFixed(2).replace('.', ',')} €</span></div>
                    <div style={{ fontWeight: 600, fontSize: 15, marginTop: 4 }}>Spolu s DPH: <span className="tk-mono">{(openInvoice.amount * 1.2).toFixed(2).replace('.', ',')} €</span></div>
                  </div>
                ) : (
                  <div style={{ fontSize: 13 }}>
                    <div style={{ color: '#8A9C97', marginBottom: 6 }}>Dodávateľ nie je platcom DPH.</div>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>Suma na úhradu: <span className="tk-mono">{openInvoice.amount.toFixed(2).replace('.', ',')} €</span></div>
                  </div>
                )}
                <div style={{ fontSize: 12, color: '#8A9C97', marginTop: 16, borderTop: '1px solid #E2E9E7', paddingTop: 12 }}>IBAN: {SUPPLIER.iban}</div>
              </>
            ) : (
              <>
                <div className="tk-modal-head"><div className="tk-modal-title">Potvrdenie o platbe</div><button className="tk-close" onClick={() => setOpenInvoice(null)}><X size={18} /></button></div>
                <div style={{ fontSize: 13.5, marginBottom: 10 }}>Pacient: <strong onClick={() => { openPatientByName(openInvoice.patient); setOpenInvoice(null); }} style={{ cursor: 'pointer', textDecoration: 'underline', textDecorationStyle: 'dotted' }}>{openInvoice.companyName || openInvoice.patient}</strong></div>
                <div style={{ fontSize: 13.5, marginBottom: 10 }}>Za: {openInvoice.service}</div>
                <div style={{ fontSize: 12.5, color: '#8A9C97', marginBottom: 16 }}>Dátum: {openInvoice.date}</div>
                <div style={{ fontWeight: 600, fontSize: 24 }} className="tk-mono">{openInvoice.amount.toFixed(2).replace('.', ',')} €</div>
                <span className="tk-pill" style={{ marginTop: 8, display: 'inline-block', color: INVOICE_STYLE[openInvoice.status].color, background: INVOICE_STYLE[openInvoice.status].bg }}>{openInvoice.status}</span>
              </>
            )}
          </div>
        </div>
      )}

      {openEvent && (
        <div className="tk-modal-backdrop" onClick={() => setOpenEvent(null)}>
          <div className="tk-modal" onClick={(e) => e.stopPropagation()}>
            <div className="tk-modal-head">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div className="tk-timeline-dot" style={{ background: EVENT_META[openEvent.type].bg, color: EVENT_META[openEvent.type].color, position: 'static' }}>
                  {React.createElement(EVENT_META[openEvent.type].icon, { size: 14 })}
                </div>
                <div className="tk-modal-title" style={{ fontSize: 15 }}>{openEvent.label}</div>
              </div>
              <button className="tk-close" onClick={() => setOpenEvent(null)}><X size={18} /></button>
            </div>
            {openEvent.date && <div style={{ fontSize: 12.5, color: '#8A9C97', marginBottom: 14 }}>{openEvent.date}</div>}
            {EVENT_DETAIL_META[openEvent.type].fields.map(([label, val], i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <div className="tk-detail-label" style={{ marginBottom: 2 }}>{label}</div>
                <div style={{ fontSize: 13.5 }}>{val}</div>
              </div>
            ))}
            {EVENT_DETAIL_META[openEvent.type].dropzone && <Dropzone label={EVENT_DETAIL_META[openEvent.type].dropLabel} />}
            {EVENT_DETAIL_META[openEvent.type].linkToInvoice && (() => {
              const inv = findInvoiceByLabel(openEvent.label);
              return inv ? <button className="tk-btn" style={{ marginTop: 4 }} onClick={() => { setOpenInvoice(inv); setOpenEvent(null); }}>Zobraziť platbu</button> : <div className="tk-empty-note">Platba sa nenašla v module Platby.</div>;
            })()}
          </div>
        </div>
      )}

      {toast && (
        <div className="tk-toast">
          <ShieldCheck size={18} style={{ flexShrink: 0, marginTop: 1 }} />
          <div style={{ flex: 1 }}><div className="tk-toast-title">{toast.title}</div><div className="tk-toast-body">{toast.body}</div></div>
          <button className="tk-toast-close" onClick={() => setToast(null)}><X size={15} /></button>
        </div>
      )}
    </div>
  );
}

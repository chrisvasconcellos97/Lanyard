import { useState, useEffect, useCallback, useMemo, useRef } from "react";

const C = {
  bg:"#0D1F1C", bgCard:"#142420", bgCardAlt:"#1A2E29", bgDark:"#0A1714",
  bgPill:"#1E3530", bgPillActive:"#2D5A4F", bgInput:"#0F1A18",
  accent:"#4A9B82", accentDim:"#2D6B5A", accentOrange:"#E8873A",
  border:"#1F3530", text:"#E8F0EE", textSub:"#7A9E98", textMuted:"#3D5C57",
  green:"#4ADE80", yellow:"#FBBF24", red:"#F87171", blue:"#67E8F9", purple:"#A5B4FC",
};

const DATA_VERSION = "4";

const TEAM = [
  { key:"C", name:"Chris Vasconcellos", title:"Sr. Account Manager", color:"#4A9B82" },
  { key:"K", name:"Kyle McChesney", title:"VP Operations", color:"#86EFAC" },
  { key:"T", name:"Tony Pisciotta", title:"Director of Aftermarket", color:"#E8873A" },
];

const DAYS = [
  { key:"mon", label:"Mon", date:"18", full:"Monday, May 18 — Arrival Day" },
  { key:"tue", label:"Tue", date:"19", full:"Tuesday, May 19" },
  { key:"wed", label:"Wed", date:"20", full:"Wednesday, May 20" },
  { key:"thu", label:"Thu", date:"21", full:"Thursday, May 21 — Departure" },
];

const TRACK_COLORS = {
  "Conference":"#67E8F9",
  "Meal/Reception":"#4ADE80",
  "Partner Meeting":"#E8873A",
  "Open Slot":"#A5B4FC",
  "Logistics":"#7A9E98",
  "Keynote":"#FBBF24",
};

const STATUS_COLORS = { green:"#4ADE80", yellow:"#FBBF24", red:"#F87171" };
const STATUS_LABELS = { green:"Healthy", yellow:"Watch", red:"At Risk" };
const TIER_COLORS   = { Major:"#67E8F9", Mid:"#A5B4FC", Growth:"#4ADE80" };
const MS_COLORS     = { upcoming:"#67E8F9", "in-progress":"#FBBF24", complete:"#4ADE80" };
const MS_LABELS     = { upcoming:"Upcoming", "in-progress":"In Progress", complete:"Complete" };

const VENUES = {
  "Grapefruit Basil":         { address:"45640 CA-74, Palm Desert, CA 92260", phone:"(760) 674-8666" },
  "Eureka Indian Wells":      { address:"44491 Indian Wells Ln, Indian Wells, CA 92210", phone:"(760) 834-6898" },
  "Vicky's of Santa Fe":      { address:"45100 Club Dr, Indian Wells, CA 92210", phone:"(760) 345-9770" },
  "Tommy Bahama Restaurant":  { address:"73595 El Paseo, Palm Desert, CA 92260", phone:"(760) 836-0188" },
  "Grand Ballroom":           { address:"Indian Wells Resort Hotel, 76661 Hwy 111, Indian Wells, CA 92210", phone:"" },
  "White Sands Terrace":      { address:"Indian Wells Resort Hotel, 76661 Hwy 111, Indian Wells, CA 92210", phone:"" },
  "Grand Lawn":               { address:"Indian Wells Resort Hotel, 76661 Hwy 111, Indian Wells, CA 92210", phone:"" },
  "Side Parking Lot":         { address:"Indian Wells Resort Hotel, 76661 Hwy 111, Indian Wells, CA 92210", phone:"" },
  "Resort Lobby":             { address:"Indian Wells Resort Hotel, 76661 Hwy 111, Indian Wells, CA 92210", phone:"" },
  "Lobby":                    { address:"Indian Wells Resort Hotel, 76661 Hwy 111, Indian Wells, CA 92210", phone:"" },
  "Foyer outside White Sands":{ address:"Indian Wells Resort Hotel, 76661 Hwy 111, Indian Wells, CA 92210", phone:"" },
};

const HOTEL_DEFAULT = {
  name:"Indian Wells Resort Hotel",
  address:"76661 Highway 111, Indian Wells, CA 92210",
  phone:"(760) 345-6466",
  checkIn:"May 18, 2026",
  checkOut:"May 21, 2026",
  roomNumber:"",
};

const INIT_PARTNERS = [
  { id:"p1", name:"LKQ", revenue:"$222M", tier:"Major", status:"red",
    objective:"Deliver root-cause analysis for the recent outage.",
    scheduledMeeting:"5/19 7:00 PM", unscheduled:false, rating:0, pastNotes:"",
    openItems:[{ id:"oi1", text:"Deliver root-cause analysis for the recent outage.", done:false }],
    attendees:[
      { id:"a1", name:"Mark Scafati", title:"VP Sales & Marketing", poc:true, notes:"Primary decision maker" },
      { id:"a2", name:"Justin Clark", title:"Sr. Director Strategic Sales", poc:false, notes:"Day to day" },
    ]},
  { id:"p2", name:"Empire Auto Parts", revenue:"$29M", tier:"Mid", status:"yellow",
    objective:"", scheduledMeeting:"", unscheduled:true, rating:0, pastNotes:"",
    openItems:[],
    attendees:[
      { id:"a3", name:"Dale", title:"", poc:true, notes:"" },
      { id:"a4", name:"CEO", title:"CEO", poc:false, notes:"" },
    ]},
  { id:"p3", name:"KSI", revenue:"$20M", tier:"Mid", status:"yellow",
    objective:"Finalize invoice feed and discuss CAPA certifications.",
    scheduledMeeting:"5/19 5:00 PM", unscheduled:false, rating:0, pastNotes:"",
    openItems:[
      { id:"oi2", text:"Finalize KSI invoice feed and remove non-serviced states.", done:false },
      { id:"oi3", text:"Shop audit in progress.", done:false },
      { id:"oi4", text:"Discuss missing CAPA certifications.", done:false },
    ],
    attendees:[
      { id:"a5", name:"Eric Taylor", title:"Sr. MSO Manager", poc:true, notes:"Operational lead" },
      { id:"a6", name:"Mike Ferguson", title:"President", poc:false, notes:"Executive sponsor" },
    ]},
  { id:"p4", name:"All Star Auto Parts", revenue:"$18.2M", tier:"Mid", status:"green",
    objective:"Classic Collision pilot go-live and Blackburn strategy.",
    scheduledMeeting:"5/20 1:00 PM", unscheduled:false, rating:0, pastNotes:"",
    openItems:[
      { id:"oi5", text:"Salvage pilot with Classic Collision approved — awaiting go-live outreach.", done:false },
      { id:"oi6", text:"Understand Blackburn plan — ASAP or more shops to BB.", done:false },
    ],
    attendees:[
      { id:"a7", name:"AJ Tyler", title:"VP of Sales", poc:true, notes:"Decision maker" },
      { id:"a8", name:"Carolyne Vasconcellos", title:"Sr. Account Manager", poc:false, notes:"" },
      { id:"a9", name:"Jessica Wanek", title:"Sr. Account Manager", poc:false, notes:"" },
    ]},
  { id:"p5", name:"Parts Authority", revenue:"$4.9M", tier:"Mid", status:"green",
    objective:"Support recent regional rollouts.",
    scheduledMeeting:"5/20 9:00 AM", unscheduled:false, rating:0, pastNotes:"",
    openItems:[{ id:"oi7", text:"Supporting all recent regional rollouts.", done:false }],
    attendees:[
      { id:"a10", name:"Chris Northrup", title:"", poc:true, notes:"Primary" },
      { id:"a11", name:"Dan Fernandez", title:"", poc:false, notes:"" },
      { id:"a12", name:"Eric Schwartz", title:"", poc:false, notes:"" },
      { id:"a13", name:"Mike Dolabi", title:"", poc:false, notes:"" },
      { id:"a14", name:"James White", title:"", poc:false, notes:"" },
    ]},
  { id:"p6", name:"UCC", revenue:"$3.8M", tier:"Mid", status:"green",
    objective:"Check in and relationship building.",
    scheduledMeeting:"5/19 11:00 AM", unscheduled:false, rating:0, pastNotes:"",
    openItems:[],
    attendees:[
      { id:"a15", name:"Joseph Tsai", title:"SVP", poc:true, notes:"Senior sponsor" },
      { id:"a16", name:"Donny Mason", title:"Director", poc:false, notes:"" },
    ]},
  { id:"p7", name:"Collision Auto Parts", revenue:"$2.9M", tier:"Growth", status:"green",
    objective:"Relationship check-in.",
    scheduledMeeting:"5/19 12:00 PM", unscheduled:false, rating:0, pastNotes:"",
    openItems:[],
    attendees:[
      { id:"a17", name:"Ray Tsai", title:"CTO", poc:false, notes:"" },
      { id:"a18", name:"Blake Kidwell", title:"CEO", poc:true, notes:"Decision maker" },
    ]},
  { id:"p8", name:"Pacific Best", revenue:"$2M", tier:"Growth", status:"yellow",
    objective:"Potential meet up with team members.",
    scheduledMeeting:"", unscheduled:true, rating:0, pastNotes:"",
    openItems:[], attendees:[]},
  { id:"p9", name:"1-800 Radiator", revenue:"$1.9M", tier:"Growth", status:"red",
    objective:"Review audit progress and warehouse corrections.",
    scheduledMeeting:"5/19 9:00 AM", unscheduled:false, rating:0, pastNotes:"",
    openItems:[
      { id:"oi8", text:"1,600 new integrations and 150+ corrections completed 5/13.", done:false },
      { id:"oi9", text:"3,000 shops still pending warehouse correction.", done:false },
    ],
    attendees:[
      { id:"a19", name:"Lindsay Klimek", title:"Sr. Manager Business Systems", poc:true, notes:"Day to day lead" },
      { id:"a20", name:"Braden Poole", title:"", poc:false, notes:"" },
      { id:"a21", name:"Jay Kurzman", title:"President / SVP Global Supply Chain", poc:false, notes:"Executive sponsor" },
    ]},
];

const INIT_SESSIONS = [
  { id:1,  day:"mon", time:"12:02 PM", end:"",         title:"Kyle Arrives",            location:"PSP Airport",               track:"Logistics",      attendees:["K"],        notes:"", status:"upcoming", partnerId:null, isParent:false, isChild:false },
  { id:2,  day:"mon", time:"1:44 PM",  end:"",         title:"Tony & Chris Arrive",     location:"PSP Airport",               track:"Logistics",      attendees:["C","T"],    notes:"", status:"upcoming", partnerId:null, isParent:false, isChild:false },
  { id:3,  day:"mon", time:"3:00 PM",  end:"",         title:"Registration Opens",      location:"Foyer outside White Sands", track:"Conference",     attendees:["C","K","T"],notes:"", status:"upcoming", partnerId:null, isParent:false, isChild:false },
  { id:4,  day:"mon", time:"6:00 PM",  end:"9:00 PM",  title:"Welcome Reception",       location:"White Sands Terrace",       track:"Meal/Reception", attendees:["C","K","T"],notes:"", status:"upcoming", partnerId:null, isParent:false, isChild:false },
  { id:5,  day:"tue", time:"9:00 AM",  end:"10:30 AM", title:"1-800 Radiator Breakfast",location:"Grapefruit Basil",          track:"Partner Meeting",attendees:["C","K","T"],notes:"", status:"upcoming", partnerId:"p9", isParent:false, isChild:false },
  { id:6,  day:"tue", time:"10:30 AM", end:"11:00 AM", title:"Open Slot",               location:"",                          track:"Open Slot",      attendees:["C","K","T"],notes:"Suggested meeting window", status:"upcoming", partnerId:null, isParent:false, isChild:false },
  { id:7,  day:"tue", time:"11:00 AM", end:"11:30 AM", title:"UCC Meeting",             location:"Resort Lobby",              track:"Partner Meeting",attendees:["C","K","T"],notes:"", status:"upcoming", partnerId:"p6", isParent:false, isChild:false },
  { id:8,  day:"tue", time:"12:00 PM", end:"1:30 PM",  title:"Collision Auto Parts Lunch",location:"Eureka Indian Wells",     track:"Partner Meeting",attendees:["C","K","T"],notes:"", status:"upcoming", partnerId:"p7", isParent:false, isChild:false },
  { id:9,  day:"tue", time:"3:00 PM",  end:"5:00 PM",  title:"Business Session with Keynote Speakers",location:"Grand Ballroom",track:"Conference",  attendees:["C","K","T"],notes:"", status:"upcoming", partnerId:null, isParent:true,  isChild:false },
  { id:10, day:"tue", time:"3:00 PM",  end:"3:30 PM",  title:"Edward Salamy — Opening Comments",location:"Grand Ballroom",track:"Keynote",           attendees:["C","K","T"],notes:"", status:"upcoming", partnerId:null, isParent:false, isChild:true  },
  { id:11, day:"tue", time:"3:30 PM",  end:"4:30 PM",  title:"Greg Horn, PartsTrader — Collision Industry Update",location:"Grand Ballroom",track:"Keynote",attendees:["C","K","T"],notes:"", status:"upcoming", partnerId:null, isParent:false, isChild:true },
  { id:12, day:"tue", time:"4:30 PM",  end:"5:00 PM",  title:"Justin Rzepka, CAR Coalition — Legislative Update",location:"Grand Ballroom",track:"Keynote",attendees:["C","K","T"],notes:"", status:"upcoming", partnerId:null, isParent:false, isChild:true },
  { id:13, day:"tue", time:"5:00 PM",  end:"6:00 PM",  title:"KSI Collision Meeting",   location:"TBD",                       track:"Partner Meeting",attendees:["C","K","T"],notes:"", status:"upcoming", partnerId:"p3", isParent:false, isChild:false },
  { id:14, day:"tue", time:"6:00 PM",  end:"7:00 PM",  title:"Cocktail Reception",      location:"Grand Lawn",                track:"Meal/Reception", attendees:["C","K","T"],notes:"", status:"upcoming", partnerId:null, isParent:false, isChild:false },
  { id:15, day:"tue", time:"7:00 PM",  end:"9:00 PM",  title:"LKQ Dinner",              location:"Vicky's of Santa Fe",       track:"Partner Meeting",attendees:["C","K","T"],notes:"", status:"upcoming", partnerId:"p1", isParent:false, isChild:false },
  { id:16, day:"wed", time:"9:00 AM",  end:"10:30 AM", title:"Parts Authority Breakfast",location:"Grapefruit Basil",         track:"Partner Meeting",attendees:["C","K","T"],notes:"", status:"upcoming", partnerId:"p5", isParent:false, isChild:false },
  { id:17, day:"wed", time:"10:30 AM", end:"11:00 AM", title:"Open Slot",               location:"",                          track:"Open Slot",      attendees:["C","K","T"],notes:"Suggested meeting window", status:"upcoming", partnerId:null, isParent:false, isChild:false },
  { id:18, day:"wed", time:"11:00 AM", end:"11:30 AM", title:"Open Slot",               location:"",                          track:"Open Slot",      attendees:["C","K","T"],notes:"Suggested meeting window", status:"upcoming", partnerId:null, isParent:false, isChild:false },
  { id:19, day:"wed", time:"11:30 AM", end:"12:00 PM", title:"Introduction to Board Candidates",location:"Grand Ballroom",   track:"Conference",     attendees:["C","K","T"],notes:"Supporting Joseph Tsai's introduction", status:"upcoming", partnerId:null, isParent:false, isChild:false },
  { id:20, day:"wed", time:"12:00 PM", end:"1:00 PM",  title:"Open Slot",               location:"",                          track:"Open Slot",      attendees:["C","K","T"],notes:"Suggested meeting window", status:"upcoming", partnerId:null, isParent:false, isChild:false },
  { id:21, day:"wed", time:"1:00 PM",  end:"2:30 PM",  title:"All Star Auto Parts Lunch",location:"Tommy Bahama Restaurant",  track:"Partner Meeting",attendees:["C","K","T"],notes:"", status:"upcoming", partnerId:"p4", isParent:false, isChild:false },
  { id:22, day:"wed", time:"3:00 PM",  end:"3:30 PM",  title:"XL / TPH Meeting",        location:"Lobby",                     track:"Partner Meeting",attendees:["C","K","T"],notes:"Delvis Rodriguez · Michael Krause", status:"upcoming", partnerId:null, isParent:false, isChild:false },
  { id:23, day:"wed", time:"4:00 PM",  end:"5:00 PM",  title:"Open Slot",               location:"",                          track:"Open Slot",      attendees:["C","K","T"],notes:"Suggested meeting window", status:"upcoming", partnerId:null, isParent:false, isChild:false },
  { id:24, day:"wed", time:"5:00 PM",  end:"6:00 PM",  title:"NABC Vehicle Giveaway",   location:"Side Parking Lot",          track:"Conference",     attendees:["C","K","T"],notes:"", status:"upcoming", partnerId:null, isParent:false, isChild:false },
  { id:25, day:"wed", time:"7:00 PM",  end:"10:00 PM", title:"Offsite Dinner — Shots in the Night",location:"TBD",           track:"Meal/Reception", attendees:["C","K","T"],notes:"", status:"upcoming", partnerId:null, isParent:false, isChild:false },
  { id:26, day:"thu", time:"",         end:"",         title:"Travel Day",              location:"",                          track:"Logistics",      attendees:["C","K","T"],notes:"Safe travels!", status:"upcoming", partnerId:null, isParent:false, isChild:false },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function toRgb(hex) {
  if (!hex || hex[0] !== "#") return "0,0,0";
  return parseInt(hex.slice(1,3),16)+","+parseInt(hex.slice(3,5),16)+","+parseInt(hex.slice(5,7),16);
}
function getVenueKey(loc) {
  return loc ? Object.keys(VENUES).find(v => loc.includes(v)) || null : null;
}
function parseTime(t) {
  if (!t) return 0;
  const parts = t.split(" ");
  const period = parts[1];
  const hm = parts[0].split(":");
  const h = parseInt(hm[0]);
  const m = parseInt(hm[1]) || 0;
  const hour = (period === "PM" && h !== 12) ? h + 12 : (period === "AM" && h === 12) ? 0 : h;
  return hour * 60 + m;
}
function getConferenceDayKey(now) {
  const m = now.getMonth();
  const d = now.getDate();
  const y = now.getFullYear();
  if (y === 2026 && m === 4) {
    if (d === 18) return "mon";
    if (d === 19) return "tue";
    if (d === 20) return "wed";
    if (d === 21) return "thu";
  }
  return null;
}
function getCurrentDayKey() {
  return getConferenceDayKey(new Date()) || "tue";
}
// ─── SUPABASE ─────────────────────────────────────────────────────────────────
const SUPABASE_URL = "https://yrpdjmyfidhxlpmxasao.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlycGRqbXlmaWRoeGxwbXhhc2FvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5Nzg3NDQsImV4cCI6MjA5NDU1NDc0NH0.tutTq1raFxA3HKUWsfYsUJtCZeQfswc3tFh7sqUM2RA";

function sbHeaders() {
  return { "Content-Type":"application/json", "apikey":SUPABASE_KEY, "Authorization":"Bearer "+SUPABASE_KEY };
}

function getUserId() {
  try {
    let id = localStorage.getItem("lanyard_user_id");
    if (!id) { id = "user_" + Math.random().toString(36).slice(2,11); localStorage.setItem("lanyard_user_id", id); }
    return id;
  } catch(e) { return "user_default"; }
}

async function sbLoad() {
  const uid = getUserId();
  try {
    const [sRes, pRes, prRes] = await Promise.all([
      fetch(SUPABASE_URL+"/rest/v1/sessions?user_id=eq."+uid+"&select=id,data", { headers:sbHeaders() }),
      fetch(SUPABASE_URL+"/rest/v1/partners?user_id=eq."+uid+"&select=id,data", { headers:sbHeaders() }),
      fetch(SUPABASE_URL+"/rest/v1/user_prefs?user_id=eq."+uid+"&select=hotel,quick_note", { headers:sbHeaders() }),
    ]);
    const sessions  = await sRes.json();
    const partners  = await pRes.json();
    const prefs     = await prRes.json();
    return {
      sessions: Array.isArray(sessions) && sessions.length > 0 ? sessions.map(r => r.data) : null,
      partners: Array.isArray(partners) && partners.length > 0 ? partners.map(r => r.data) : null,
      hotel:     prefs[0] ? prefs[0].hotel : null,
      quickNote: prefs[0] ? prefs[0].quick_note : null,
    };
  } catch(e) { return null; }
}

async function sbSaveSessions(sessions) {
  const uid = getUserId();
  try {
    await fetch(SUPABASE_URL+"/rest/v1/sessions?user_id=eq."+uid, {
      method:"DELETE", headers:sbHeaders(),
    });
    if (sessions.length > 0) {
      const rows = sessions.map(s => ({ id:String(s.id)+"_"+uid, user_id:uid, data:s }));
      await fetch(SUPABASE_URL+"/rest/v1/sessions", {
        method:"POST",
        headers:{ ...sbHeaders(), "Prefer":"resolution=merge-duplicates" },
        body:JSON.stringify(rows),
      });
    }
  } catch(e) {}
}

async function sbSavePartners(partners) {
  const uid = getUserId();
  try {
    await fetch(SUPABASE_URL+"/rest/v1/partners?user_id=eq."+uid, {
      method:"DELETE", headers:sbHeaders(),
    });
    if (partners.length > 0) {
      const rows = partners.map(p => ({ id:String(p.id)+"_"+uid, user_id:uid, data:p }));
      await fetch(SUPABASE_URL+"/rest/v1/partners", {
        method:"POST",
        headers:{ ...sbHeaders(), "Prefer":"resolution=merge-duplicates" },
        body:JSON.stringify(rows),
      });
    }
  } catch(e) {}
}

async function sbSavePrefs(hotel, quickNote) {
  const uid = getUserId();
  try {
    await fetch(SUPABASE_URL+"/rest/v1/user_prefs", {
      method:"POST",
      headers:{ ...sbHeaders(), "Prefer":"resolution=merge-duplicates" },
      body:JSON.stringify({ user_id:uid, hotel, quick_note:quickNote }),
    });
  } catch(e) {}
}

// Local storage fallback
function loadState() {
  try {
    const raw = localStorage.getItem("lanyard_v" + DATA_VERSION);
    if (raw) return JSON.parse(raw);
  } catch(e) {}
  return null;
}
function saveState(s) {
  try { localStorage.setItem("lanyard_v" + DATA_VERSION, JSON.stringify(s)); } catch(e) {}
}
function getWeatherIcon(code) {
  if (!code && code !== 0) return "🌤";
  if (code <= 1) return "☀️";
  if (code <= 3) return "🌤";
  if (code <= 48) return "🌫";
  if (code <= 67) return "🌧";
  if (code <= 77) return "❄️";
  if (code <= 82) return "🌧";
  return "⛈";
}
function getWeatherDesc(code) {
  if (!code && code !== 0) return "Partly Cloudy";
  if (code <= 1) return "Sunny";
  if (code <= 3) return "Partly Cloudy";
  if (code <= 48) return "Foggy";
  if (code <= 67) return "Rainy";
  if (code <= 77) return "Snowy";
  if (code <= 82) return "Showers";
  return "Thunderstorms";
}
function makeStars(n) { return "★".repeat(n) + "☆".repeat(5 - n); }

// ─── STYLES ───────────────────────────────────────────────────────────────────
const inp = {
  width:"100%", background:"#0F1A18", border:"1px solid #1F3530",
  borderRadius:8, padding:"9px 12px", color:"#E8F0EE", fontSize:13,
  fontFamily:"'DM Sans',sans-serif", boxSizing:"border-box", outline:"none",
};
const ta = { ...inp, resize:"vertical", minHeight:68 };
const btnBase = {
  cursor:"pointer", fontFamily:"'DM Sans',sans-serif",
  fontWeight:600, fontSize:12, borderRadius:24, padding:"8px 16px", border:"none",
};

// ─── SMALL COMPONENTS ─────────────────────────────────────────────────────────
function PipMark({ size=12, color="#4A9B82", opacity=1, glow=false, pulse=false }) {
  const s = { animation: pulse ? "pipPulse 2s ease-in-out infinite" : "none" };
  return (
    <svg width={size} height={size*2} viewBox="0 0 10 20" fill="none" style={s}>
      {glow && <circle cx="5" cy="5" r="7" fill={color} fillOpacity="0.1"/>}
      <circle cx="5" cy="5" r="4" fill={color} fillOpacity={opacity}/>
      {glow && <circle cx="5" cy="15" r="5" fill={color} fillOpacity="0.07"/>}
      <circle cx="5" cy="15" r="2.8" fill={color} fillOpacity={opacity*0.42}/>
    </svg>
  );
}

function LanyardLogo({ size=28, color="#4A9B82" }) {
  return (
    <svg width={size*0.7} height={size*1.3} viewBox="0 0 28 52" fill="none">
      <path d="M14 5 L8 1 M14 5 L20 1" stroke={color} strokeWidth="1.8" strokeLinecap="round" opacity="0.85"/>
      <circle cx="14" cy="5" r="2.2" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1.2"/>
      <circle cx="14" cy="5" r="0.9" fill={color} opacity="0.8"/>
      <rect x="2" y="8" width="24" height="42" rx="4" fill={color} fillOpacity="0.09" stroke={color} strokeWidth="1.4"/>
      <rect x="2" y="8" width="24" height="8" rx="4" fill={color} fillOpacity="0.2"/>
      <rect x="2" y="13" width="24" height="3" fill={color} fillOpacity="0.1"/>
      <rect x="6" y="20" width="16" height="2" rx="1" fill={color} opacity="0.6"/>
      <rect x="8" y="24" width="12" height="1.5" rx="0.75" fill={color} opacity="0.35"/>
      <line x1="5" y1="29" x2="23" y2="29" stroke={color} strokeWidth="0.7" opacity="0.15"/>
      <circle cx="14" cy="36" r="5" fill={color} fillOpacity="0.12" stroke={color} strokeWidth="1" strokeOpacity="0.35"/>
      <circle cx="14" cy="36" r="2.2" fill={color} opacity="0.7"/>
      <circle cx="14" cy="44" r="3.5" fill={color} fillOpacity="0.07" stroke={color} strokeWidth="0.8" strokeOpacity="0.2"/>
      <circle cx="14" cy="44" r="1.5" fill={color} opacity="0.32"/>
    </svg>
  );
}

function Pill({ color, children }) {
  return (
    <span style={{
      background:"rgba("+toRgb(color)+",0.15)", color,
      fontSize:10, fontWeight:600, padding:"3px 9px", borderRadius:20,
      border:"1px solid rgba("+toRgb(color)+",0.2)", whiteSpace:"nowrap",
    }}>
      {children}
    </span>
  );
}

function FL({ children }) {
  return <div style={{ fontSize:10, color:C.textMuted, marginBottom:4, textTransform:"uppercase", letterSpacing:"0.08em" }}>{children}</div>;
}

function Card({ children, style={}, accent, onClick }) {
  return (
    <div onClick={onClick} style={{
      background:C.bgCard,
      border:"1px solid " + C.border,
      borderLeft: accent ? "3px solid " + accent : "1px solid " + C.border,
      borderRadius:12, ...style,
    }}>
      {children}
    </div>
  );
}

function GreenBtn({ children, style={}, onClick, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{ ...btnBase, background:C.accent, color:"#fff", opacity:disabled?0.6:1, ...style }}>
      {children}
    </button>
  );
}

function SecBtn({ children, style={}, onClick }) {
  return (
    <button onClick={onClick} style={{ ...btnBase, background:C.bgCardAlt, color:C.textSub, border:"1px solid "+C.border, ...style }}>
      {children}
    </button>
  );
}

function Toast({ message }) {
  if (!message) return null;
  return (
    <div style={{
      position:"fixed", top:20, right:20, zIndex:9999,
      background:C.accent, color:"#fff", padding:"11px 18px",
      borderRadius:24, fontWeight:600, fontSize:13,
      boxShadow:"0 4px 20px rgba("+toRgb(C.accent)+",0.4)",
      fontFamily:"'DM Sans',sans-serif",
    }}>
      ✓ {message}
    </div>
  );
}

function Modal({ onClose, title, children, wide }) {
  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.75)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}
    >
      <div style={{
        background:C.bgCard, border:"1px solid "+C.border,
        borderRadius:16, padding:22, width:"100%",
        maxWidth: wide ? 620 : 460,
        maxHeight:"92vh", overflowY:"auto",
        boxShadow:"0 24px 64px rgba(0,0,0,0.7)",
      }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
          <div style={{ fontSize:15, fontWeight:600, color:C.text }}>{title}</div>
          <button onClick={onClose} style={{ background:"none", border:"none", color:C.textMuted, cursor:"pointer", fontSize:20, lineHeight:1 }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function EmptyState({ title, body, action, onAction }) {
  return (
    <div style={{ textAlign:"center", padding:"48px 24px" }}>
      <div style={{ display:"flex", justifyContent:"center", marginBottom:16 }}>
        <PipMark size={18} color={C.accent} opacity={0.4} glow/>
      </div>
      <div style={{ fontSize:14, fontWeight:500, color:C.textSub, marginBottom:8 }}>{title}</div>
      <div style={{ fontSize:12, color:C.textMuted, lineHeight:1.7, marginBottom: action ? 20 : 0 }}>{body}</div>
      {action && <GreenBtn onClick={onAction} style={{ fontSize:12, padding:"8px 20px" }}>{action}</GreenBtn>}
    </div>
  );
}

// ─── ADDRESS SEARCH ───────────────────────────────────────────────────────────
const KNOWN_VENUES = [
  { name:"Indian Wells Resort Hotel", address:"76661 Highway 111, Indian Wells, CA 92210" },
  { name:"Grapefruit Basil", address:"45640 CA-74, Palm Desert, CA 92260" },
  { name:"Eureka Indian Wells", address:"44491 Indian Wells Ln, Indian Wells, CA 92210" },
  { name:"Vicky's of Santa Fe", address:"45100 Club Dr, Indian Wells, CA 92210" },
  { name:"Tommy Bahama Restaurant", address:"73595 El Paseo, Palm Desert, CA 92260" },
  { name:"PSP Airport", address:"3400 E Tahquitz Canyon Way, Palm Springs, CA 92262" },
  { name:"Grand Ballroom", address:"Indian Wells Resort Hotel, 76661 Hwy 111" },
  { name:"Grand Lawn", address:"Indian Wells Resort Hotel, 76661 Hwy 111" },
  { name:"Resort Lobby", address:"Indian Wells Resort Hotel, 76661 Hwy 111" },
];

function AddressSearch({ value, onChange, placeholder }) {
  const [query, setQuery] = useState(value || "");
  const [suggestions, setSugs] = useState([]);
  const timer = useRef(null);

  useEffect(() => {
    if (query.length < 2) { setSugs([]); return; }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const q = query.toLowerCase();
      setSugs(KNOWN_VENUES.filter(k => k.name.toLowerCase().includes(q) || k.address.toLowerCase().includes(q)).slice(0, 4));
    }, 200);
    return () => clearTimeout(timer.current);
  }, [query]);

  return (
    <div style={{ position:"relative" }}>
      <input
        value={query}
        onChange={e => { setQuery(e.target.value); onChange(e.target.value); }}
        placeholder={placeholder || "Search venue or address..."}
        style={inp}
      />
      {suggestions.length > 0 && (
        <div style={{ position:"absolute", top:"100%", left:0, right:0, background:C.bgDark, border:"1px solid "+C.border, borderRadius:8, zIndex:100, marginTop:2 }}>
          {suggestions.map((s, i) => (
            <div
              key={i}
              onClick={() => { setQuery(s.name); onChange(s.name); setSugs([]); }}
              style={{ padding:"10px 12px", borderBottom:"1px solid "+C.border, cursor:"pointer", fontSize:12 }}
            >
              <div style={{ color:C.text, fontWeight:500 }}>{s.name}</div>
              <div style={{ color:C.textMuted, fontSize:10, marginTop:2 }}>{s.address}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── ATTENDEES & OPEN ITEMS ───────────────────────────────────────────────────
function AttendeeList({ attendees }) {
  if (!attendees || !attendees.length) return null;
  const sorted = [...attendees].sort((a, b) => (b.poc ? 1 : 0) - (a.poc ? 1 : 0));
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:6, marginTop:6 }}>
      {sorted.map(a => (
        <div key={a.id} style={{ background:C.bgDark, border:"1px solid "+C.border, borderRadius:8, padding:"8px 12px", display:"flex", alignItems:"center", gap:9 }}>
          <div style={{ width:28, height:28, borderRadius:"50%", background:"rgba("+toRgb(C.accent)+","+(a.poc?"0.2":"0.08")+")", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:600, color:a.poc?C.accent:C.textMuted, flexShrink:0 }}>
            {(a.name || "?").charAt(0)}
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:12, fontWeight:500, color:C.text }}>
              {a.name}
              {a.poc && <span style={{ color:C.yellow, fontSize:10, marginLeft:5 }}>⭐ POC</span>}
            </div>
            {a.title ? <div style={{ fontSize:10, color:C.textMuted }}>{a.title}</div> : null}
          </div>
        </div>
      ))}
    </div>
  );
}

function OpenItemsList({ items, onToggle }) {
  if (!items || !items.length) return <div style={{ fontSize:12, color:C.textMuted, fontStyle:"italic" }}>No open items</div>;
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
      {items.map(oi => (
        <div key={oi.id} style={{ display:"flex", alignItems:"flex-start", gap:8 }}>
          <input type="checkbox" checked={!!oi.done} onChange={() => onToggle && onToggle(oi.id)} style={{ marginTop:3, cursor:"pointer", flexShrink:0 }}/>
          <span style={{ fontSize:12, color:oi.done?C.textMuted:C.textSub, textDecoration:oi.done?"line-through":"none", lineHeight:1.5 }}>{oi.text}</span>
        </div>
      ))}
    </div>
  );
}

function PartnerBlock({ partner, onToggleItem }) {
  if (!partner) return null;
  return (
    <div style={{ background:C.bgDark, border:"1px solid "+C.border, borderRadius:10, padding:"13px 15px" }}>
      <div style={{ fontSize:10, fontWeight:600, color:C.accent, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:10 }}>Partner — {partner.name}</div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:10 }}>
        <div><FL>Revenue</FL><div style={{ fontSize:16, fontWeight:600, color:C.text }}>{partner.revenue}</div></div>
        <div><FL>Tier</FL><Pill color={TIER_COLORS[partner.tier]}>{partner.tier}</Pill></div>
        <div><FL>Status</FL><Pill color={STATUS_COLORS[partner.status]}>{STATUS_LABELS[partner.status]}</Pill></div>
      </div>
      {partner.objective ? <div style={{ marginBottom:10 }}><FL>Objective</FL><div style={{ fontSize:12, color:C.textSub, lineHeight:1.6 }}>{partner.objective}</div></div> : null}
      {partner.openItems && partner.openItems.length > 0 ? (
        <div style={{ marginBottom:10 }}>
          <FL>Open Items</FL>
          <OpenItemsList items={partner.openItems} onToggle={onToggleItem}/>
        </div>
      ) : null}
      {partner.pastNotes ? (
        <div style={{ marginBottom:10 }}>
          <FL>Previous Conference Notes</FL>
          <div style={{ fontSize:12, color:C.textSub, lineHeight:1.6, fontStyle:"italic" }}>{partner.pastNotes}</div>
        </div>
      ) : null}
      {partner.attendees && partner.attendees.length > 0 ? (
        <div><FL>Their Team</FL><AttendeeList attendees={partner.attendees}/></div>
      ) : null}
    </div>
  );
}

// ─── VENUE MODAL ──────────────────────────────────────────────────────────────
function VenueModal({ locationName, onClose }) {
  const key = getVenueKey(locationName);
  const venue = key ? VENUES[key] : null;
  const addr = venue ? venue.address : locationName;
  const mapsUrl = "https://maps.google.com/?q=" + encodeURIComponent(addr);
  const uberUrl = "https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[formatted_address]=" + encodeURIComponent(addr);
  const lyftUrl = "https://lyft.com/ride?destination[address]=" + encodeURIComponent(addr);
  return (
    <Modal onClose={onClose} title={locationName || "Venue"}>
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        <div><FL>Address</FL><div style={{ fontSize:13, color:C.text, lineHeight:1.7 }}>{addr}</div></div>
        {venue && venue.phone ? <div><FL>Phone</FL><div style={{ fontSize:13, color:C.text }}>{venue.phone}</div></div> : null}
        <a href={mapsUrl} target="_blank" rel="noopener noreferrer" style={{ display:"block", textAlign:"center", background:C.accent, color:"#fff", borderRadius:24, padding:"11px", fontSize:13, fontWeight:600, fontFamily:"'DM Sans',sans-serif", textDecoration:"none" }}>🗺 Get Directions</a>
        <div style={{ display:"flex", gap:8 }}>
          <a href={uberUrl} target="_blank" rel="noopener noreferrer" style={{ flex:1, display:"block", textAlign:"center", background:C.bgCardAlt, color:C.textSub, border:"1px solid "+C.border, borderRadius:24, padding:"10px", fontSize:12, fontWeight:600, fontFamily:"'DM Sans',sans-serif", textDecoration:"none" }}>🚗 Uber</a>
          <a href={lyftUrl} target="_blank" rel="noopener noreferrer" style={{ flex:1, display:"block", textAlign:"center", background:C.bgCardAlt, color:C.textSub, border:"1px solid "+C.border, borderRadius:24, padding:"10px", fontSize:12, fontWeight:600, fontFamily:"'DM Sans',sans-serif", textDecoration:"none" }}>🚗 Lyft</a>
        </div>
      </div>
    </Modal>
  );
}

// ─── PIP DAY MODAL ────────────────────────────────────────────────────────────
function PipDayModal({ sessions, partners, now, onClose, onSelectS }) {
  const pMap = {};
  partners.forEach(p => { pMap[p.id] = p; });
  const todayKey = getConferenceDayKey(now) || "tue";
  const todaySessions = sessions
    .filter(s => s.day === todayKey && !s.isChild && s.track !== "Open Slot" && s.track !== "Logistics")
    .sort((a, b) => parseTime(a.time) - parseTime(b.time));
  const upcoming = todaySessions.filter(s => s.status !== "complete");
  const partnerCount = todaySessions.filter(s => s.track === "Partner Meeting").length;

  return (
    <Modal onClose={onClose} title="" wide>
      <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
        <div style={{ textAlign:"center", paddingBottom:8, borderBottom:"1px solid "+C.border }}>
          <div style={{ display:"flex", justifyContent:"center", marginBottom:10 }}>
            <PipMark size={22} color={C.accent} glow pulse/>
          </div>
          <div style={{ fontSize:16, fontWeight:600, color:C.text, marginBottom:4 }}>Pip's Day Overview</div>
          <div style={{ fontSize:12, color:C.textSub }}>{DAYS.find(d => d.key === todayKey) ? DAYS.find(d => d.key === todayKey).full : ""}</div>
        </div>
        <div style={{ background:C.bgDark, border:"1px solid "+C.border, borderRadius:10, padding:"12px 14px" }}>
          <div style={{ fontSize:11, color:C.accent, fontWeight:600, marginBottom:6, textTransform:"uppercase", letterSpacing:"0.07em" }}>Today at a Glance</div>
          <div style={{ fontSize:13, color:C.textSub, lineHeight:1.7 }}>
            You have <span style={{ color:C.text, fontWeight:500 }}>{todaySessions.length} events</span> today including{" "}
            <span style={{ color:C.accentOrange, fontWeight:500 }}>{partnerCount} partner meetings</span>.
            {upcoming.length > 0 ? (
              <span> Next up: <span style={{ color:C.text, fontWeight:500 }}>{upcoming[0].title}</span> at <span style={{ color:C.accent }}>{upcoming[0].time}</span>.</span>
            ) : null}
          </div>
        </div>
        <div>
          <div style={{ fontSize:11, color:C.textMuted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:10 }}>Your Day</div>
          <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
            {todaySessions.map(s => {
              const color = TRACK_COLORS[s.track] || C.accent;
              const p = s.partnerId ? pMap[s.partnerId] : null;
              const openCount = p ? p.openItems.filter(o => !o.done).length : 0;
              return (
                <div key={s.id} onClick={() => { onSelectS(s); onClose(); }} style={{ background:C.bgDark, border:"1px solid "+C.border, borderLeft:"3px solid "+color, borderRadius:10, padding:"11px 14px", cursor:"pointer" }}>
                  <div style={{ fontSize:13, fontWeight:500, color:C.text, marginBottom:4 }}>{s.title}</div>
                  <div style={{ fontSize:11, color:C.textMuted }}>
                    {"🕐 " + s.time + (s.end ? " – " + s.end : "") + (s.location ? " · 📍 " + s.location : "")}
                  </div>
                  {p ? <div style={{ fontSize:11, color:C.textSub, marginTop:3 }}>{"💰 " + p.revenue + " · " + (p.attendees.filter(a => a.poc).map(a => a.name).join(", ") || "No POC set")}</div> : null}
                  {openCount > 0 ? <div style={{ fontSize:10, color:C.accentOrange, marginTop:3 }}>{"⚠ " + openCount + " open item" + (openCount > 1 ? "s" : "")}</div> : null}
                </div>
              );
            })}
            {todaySessions.length === 0 ? <div style={{ textAlign:"center", padding:"20px", color:C.textMuted, fontSize:13 }}>No events scheduled for today</div> : null}
          </div>
        </div>
      </div>
    </Modal>
  );
}

// ─── MEETING MODAL ────────────────────────────────────────────────────────────
function MeetingModal({ session, pMap, hasConflict, onClose, onUpdateS, onUpdateP }) {
  const [venueModal, setVM] = useState(null);
  const partner = session.partnerId ? pMap[session.partnerId] : null;
  const upd = (f, v) => onUpdateS(session.id, f, v);
  const vKey = getVenueKey(session.location);

  return (
    <Modal onClose={onClose} title={session.title} wide>
      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
        <div style={{ display:"flex", gap:7, flexWrap:"wrap" }}>
          <Pill color={TRACK_COLORS[session.track] || C.accent}>{session.track}</Pill>
          <Pill color={MS_COLORS[session.status] || C.blue}>{MS_LABELS[session.status] || "Upcoming"}</Pill>
          {hasConflict ? <Pill color={C.red}>⚠ Conflict</Pill> : null}
        </div>
        <div style={{ display:"flex", gap:14, flexWrap:"wrap" }}>
          {session.time ? <div style={{ fontSize:12, color:C.textSub }}>{"🕐 " + session.time + (session.end ? " – " + session.end : "")}</div> : null}
          {session.location ? (
            <div onClick={() => { if (vKey) setVM(session.location); }} style={{ fontSize:12, color:vKey?C.accent:C.textSub, cursor:vKey?"pointer":"default" }}>
              {"📍 " + session.location + (vKey ? " ›" : "")}
            </div>
          ) : null}
        </div>
        <div>
          <FL>Update Location</FL>
          <AddressSearch value={session.location || ""} onChange={v => upd("location", v)} placeholder="Search venue or address..."/>
        </div>
        <div>
          <FL>Meeting Status</FL>
          <div style={{ display:"flex", gap:6 }}>
            {["upcoming","in-progress","complete"].map(st => (
              <button key={st} onClick={() => upd("status", st)} style={{ flex:1, padding:"7px 4px", borderRadius:20, cursor:"pointer", fontSize:10, fontWeight:600, fontFamily:"'DM Sans',sans-serif", background:session.status===st?MS_COLORS[st]:C.bgDark, color:session.status===st?"#fff":C.textMuted, border:"1px solid "+(session.status===st?MS_COLORS[st]:C.border) }}>
                {MS_LABELS[st]}
              </button>
            ))}
          </div>
        </div>
        {partner ? (
          <PartnerBlock
            partner={partner}
            onToggleItem={id => onUpdateP(partner.id, "openItems", partner.openItems.map(x => x.id===id ? {...x,done:!x.done} : x))}
          />
        ) : null}
        <div style={{ borderTop:"1px solid "+C.border, paddingTop:12 }}>
          <div style={{ fontSize:11, fontWeight:600, color:C.textMuted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:12 }}>Meeting Notes</div>
          {[
            { f:"takeaways", l:"Takeaways", p:"Key things you learned..." },
            { f:"actionItems", l:"Action Items", p:"Who does what by when..." },
            { f:"commitmentsMade", l:"Commitments Made", p:"What did you promise them..." },
            { f:"followUpDate", l:"Follow Up Date", p:"When are you reconnecting..." },
          ].map(x => (
            <div key={x.f} style={{ marginBottom:10 }}>
              <FL>{x.l}</FL>
              <textarea value={session[x.f] || ""} onChange={e => upd(x.f, e.target.value)} placeholder={x.p} style={ta}/>
            </div>
          ))}
          <div>
            <FL>Meeting Rating</FL>
            <div style={{ display:"flex", gap:4 }}>
              {[1,2,3,4,5].map(n => (
                <button key={n} onClick={() => upd("rating", n)} style={{ background:"none", border:"none", cursor:"pointer", fontSize:22, color:(session.rating||0)>=n?C.yellow:C.textMuted, padding:"2px" }}>★</button>
              ))}
            </div>
          </div>
        </div>
      </div>
      {venueModal ? <VenueModal locationName={venueModal} onClose={() => setVM(null)}/> : null}
    </Modal>
  );
}

// ─── PARTNER MODAL ────────────────────────────────────────────────────────────
function PartnerModal({ partner, onClose, onUpdate, onSchedule, onEdit }) {
  const toggle = id => onUpdate(partner.id, "openItems", partner.openItems.map(x => x.id===id?{...x,done:!x.done}:x));
  return (
    <Modal onClose={onClose} title={partner.name} wide>
      <div style={{ display:"flex", flexDirection:"column", gap:13 }}>
        <div style={{ display:"flex", gap:7, flexWrap:"wrap" }}>
          <Pill color={TIER_COLORS[partner.tier]}>{partner.tier}</Pill>
          <Pill color={STATUS_COLORS[partner.status]}>{STATUS_LABELS[partner.status]}</Pill>
          {partner.rating > 0 ? <span style={{ color:C.yellow, fontSize:13 }}>{makeStars(partner.rating)}</span> : null}
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <div><FL>YTD Revenue</FL><div style={{ fontSize:20, fontWeight:600, color:C.text }}>{partner.revenue}</div></div>
          <div><FL>Scheduled</FL><div style={{ fontSize:13, color:C.textSub }}>{partner.scheduledMeeting || "Not scheduled"}</div></div>
        </div>
        <div>
          <FL>Account Status</FL>
          <div style={{ display:"flex", gap:6 }}>
            {["green","yellow","red"].map(s => (
              <button key={s} onClick={() => onUpdate(partner.id,"status",s)} style={{ flex:1, padding:"7px", borderRadius:20, cursor:"pointer", fontSize:11, fontWeight:600, fontFamily:"'DM Sans',sans-serif", background:partner.status===s?STATUS_COLORS[s]:C.bgDark, color:partner.status===s?"#fff":C.textMuted, border:"1px solid "+(partner.status===s?STATUS_COLORS[s]:C.border) }}>
                {STATUS_LABELS[s]}
              </button>
            ))}
          </div>
        </div>
        {partner.objective ? <div><FL>Meeting Objective</FL><div style={{ fontSize:13, color:C.textSub, lineHeight:1.6 }}>{partner.objective}</div></div> : null}
        <div><FL>Open Items</FL><OpenItemsList items={partner.openItems} onToggle={toggle}/></div>
        {partner.pastNotes ? (
          <div><FL>Previous Conference Notes</FL><div style={{ fontSize:12, color:C.textSub, lineHeight:1.6, background:C.bgDark, padding:"10px 12px", borderRadius:8, fontStyle:"italic" }}>{partner.pastNotes}</div></div>
        ) : null}
        {partner.attendees && partner.attendees.length > 0 ? <div><FL>Their Team</FL><AttendeeList attendees={partner.attendees}/></div> : null}
        <div style={{ display:"flex", gap:8, marginTop:4 }}>
          <GreenBtn onClick={() => onSchedule(partner)} style={{ flex:1, borderRadius:24, fontSize:12 }}>📅 Schedule Meeting</GreenBtn>
          <SecBtn onClick={() => onEdit(partner)} style={{ flex:1, borderRadius:24, fontSize:12 }}>✏️ Edit</SecBtn>
        </div>
      </div>
    </Modal>
  );
}

// ─── EDIT PARTNER MODAL ───────────────────────────────────────────────────────
function EditPartnerModal({ partner, onClose, onSave }) {
  const [d, setD] = useState({ ...partner, openItems:[...(partner.openItems||[])], attendees:[...(partner.attendees||[])] });
  const sf = (k, v) => setD(p => ({ ...p, [k]:v }));
  return (
    <Modal onClose={onClose} title={"Edit — " + d.name} wide>
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {[{l:"Company Name",k:"name"},{l:"YTD Revenue",k:"revenue"},{l:"Meeting Objective",k:"objective"},{l:"Previous Conference Notes",k:"pastNotes"}].map(f => (
          <div key={f.k}><FL>{f.l}</FL><input value={d[f.k]||""} onChange={e=>sf(f.k,e.target.value)} style={inp}/></div>
        ))}
        <div>
          <FL>Tier</FL>
          <div style={{ display:"flex", gap:6 }}>
            {["Major","Mid","Growth"].map(t => (
              <button key={t} onClick={() => sf("tier",t)} style={{ flex:1, padding:"7px", borderRadius:20, cursor:"pointer", fontSize:11, fontWeight:600, fontFamily:"'DM Sans',sans-serif", background:d.tier===t?TIER_COLORS[t]:C.bgDark, color:d.tier===t?"#fff":C.textMuted, border:"1px solid "+(d.tier===t?TIER_COLORS[t]:C.border) }}>{t}</button>
            ))}
          </div>
        </div>
        <div>
          <FL>Status</FL>
          <div style={{ display:"flex", gap:6 }}>
            {["green","yellow","red"].map(s => (
              <button key={s} onClick={() => sf("status",s)} style={{ flex:1, padding:"7px", borderRadius:20, cursor:"pointer", fontSize:11, fontWeight:600, fontFamily:"'DM Sans',sans-serif", background:d.status===s?STATUS_COLORS[s]:C.bgDark, color:d.status===s?"#fff":C.textMuted, border:"1px solid "+(d.status===s?STATUS_COLORS[s]:C.border) }}>{STATUS_LABELS[s]}</button>
            ))}
          </div>
        </div>
        <div>
          <FL>Open Items</FL>
          {d.openItems.map((oi, i) => (
            <div key={oi.id} style={{ display:"flex", gap:6, marginBottom:6, alignItems:"center" }}>
              <input value={oi.text} onChange={e => setD(p => ({...p, openItems:p.openItems.map((x,j)=>j===i?{...x,text:e.target.value}:x)}))} style={{...inp,flex:1}}/>
              <button onClick={() => setD(p => ({...p,openItems:p.openItems.filter((_,j)=>j!==i)}))} style={{ background:"rgba(248,113,113,0.1)", color:C.red, border:"none", borderRadius:6, padding:"6px 10px", cursor:"pointer", fontSize:13 }}>✕</button>
            </div>
          ))}
          <button onClick={() => setD(p => ({...p,openItems:[...(p.openItems||[]),{id:"oi"+Date.now(),text:"",done:false}]}))} style={{ background:C.bgDark, color:C.textMuted, border:"1px dashed "+C.border, borderRadius:20, padding:"7px 14px", cursor:"pointer", fontSize:12, fontFamily:"'DM Sans',sans-serif", width:"100%", marginTop:4 }}>+ Add Item</button>
        </div>
        <div>
          <FL>Their Team</FL>
          {d.attendees.map((a, i) => (
            <div key={a.id} style={{ background:C.bgDark, border:"1px solid "+C.border, borderRadius:8, padding:"10px 12px", marginBottom:6 }}>
              <div style={{ display:"flex", gap:6, marginBottom:6 }}>
                <input value={a.name} onChange={e => setD(p=>({...p,attendees:p.attendees.map((x,j)=>j===i?{...x,name:e.target.value}:x)}))} placeholder="Name" style={{...inp,flex:1}}/>
                <input value={a.title} onChange={e => setD(p=>({...p,attendees:p.attendees.map((x,j)=>j===i?{...x,title:e.target.value}:x)}))} placeholder="Title" style={{...inp,flex:1}}/>
                <button onClick={() => setD(p=>({...p,attendees:p.attendees.filter((_,j)=>j!==i)}))} style={{ background:"rgba(248,113,113,0.1)", color:C.red, border:"none", borderRadius:6, padding:"6px 10px", cursor:"pointer", fontSize:13 }}>✕</button>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <input type="checkbox" checked={!!a.poc} onChange={() => setD(p=>({...p,attendees:p.attendees.map((x,j)=>j===i?{...x,poc:!x.poc}:x)}))} style={{ cursor:"pointer" }}/>
                <span style={{ fontSize:11, color:C.textSub }}>Primary Point of Contact ⭐</span>
              </div>
            </div>
          ))}
          <button onClick={() => setD(p=>({...p,attendees:[...(p.attendees||[]),{id:"a"+Date.now(),name:"",title:"",poc:false,notes:""}]}))} style={{ background:C.bgDark, color:C.textMuted, border:"1px dashed "+C.border, borderRadius:20, padding:"7px 14px", cursor:"pointer", fontSize:12, fontFamily:"'DM Sans',sans-serif", width:"100%", marginTop:4 }}>+ Add Contact</button>
        </div>
        <GreenBtn onClick={() => onSave(d)} style={{ width:"100%", padding:"12px", fontSize:14, borderRadius:24 }}>Save Changes</GreenBtn>
      </div>
    </Modal>
  );
}

// ─── SCHEDULE MEETING MODAL ───────────────────────────────────────────────────
function ScheduleMeetingModal({ partner, openSlots, onClose, onAdd }) {
  const [f, setF] = useState({ title:partner.name+" Meeting", time:"", end:"", location:"", day:"tue", type:"Partner Meeting", partnerId:partner.id });
  const sf = (k, v) => setF(p => ({...p,[k]:v}));
  return (
    <Modal onClose={onClose} title={"Schedule — "+partner.name}>
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        <div style={{ background:C.bgDark, border:"1px solid "+C.border, borderRadius:10, padding:"10px 14px", fontSize:12, color:C.textSub, lineHeight:1.6 }}>
          <div style={{ fontWeight:600, color:C.accentOrange, marginBottom:4 }}>Auto-populated:</div>
          {partner.attendees && partner.attendees.length > 0 ? <div>{"👤 "+partner.attendees.map(a=>a.name).join(", ")}</div> : null}
          {partner.objective ? <div>{"🎯 "+partner.objective}</div> : null}
        </div>
        {[{l:"Start Time *",k:"time",p:"e.g. 10:30 AM"},{l:"End Time",k:"end",p:"e.g. 11:00 AM"}].map(x => (
          <div key={x.k}><FL>{x.l}</FL><input value={f[x.k]} onChange={e=>sf(x.k,e.target.value)} placeholder={x.p} style={inp}/></div>
        ))}
        <div><FL>Location</FL><AddressSearch value={f.location} onChange={v=>sf("location",v)} placeholder="Search venue or address..."/></div>
        <div>
          <FL>Day</FL>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
            {DAYS.filter(d=>d.key!=="thu").map(d => (
              <button key={d.key} onClick={()=>sf("day",d.key)} style={{ padding:"6px 12px", borderRadius:20, cursor:"pointer", fontSize:11, fontWeight:600, fontFamily:"'DM Sans',sans-serif", background:f.day===d.key?C.accent:C.bgDark, color:f.day===d.key?"#fff":C.textMuted, border:"1px solid "+(f.day===d.key?C.accent:C.border) }}>{d.label+" "+d.date}</button>
            ))}
          </div>
        </div>
        {openSlots.length > 0 ? (
          <div>
            <div style={{ fontSize:11, color:C.textMuted, fontWeight:600, marginBottom:4 }}>💡 Open slots:</div>
            {openSlots.map(s => <div key={s.id} style={{ fontSize:11, color:C.purple }}>{"· "+(DAYS.find(d=>d.key===s.day)||{label:""}).label+" "+s.time+"–"+s.end}</div>)}
          </div>
        ) : null}
        <GreenBtn onClick={()=>onAdd(f)} style={{ width:"100%", padding:"12px", fontSize:14, borderRadius:24 }}>Add to Schedule</GreenBtn>
      </div>
    </Modal>
  );
}

// ─── ADD EVENT MODAL ──────────────────────────────────────────────────────────
function AddEventModal({ partners, openSlots, onClose, onAdd }) {
  const [f, setF] = useState({ title:"", time:"", end:"", location:"", day:"tue", type:"Partner Meeting", partnerId:"" });
  const sf = (k, v) => setF(p => ({...p,[k]:v}));
  return (
    <Modal onClose={onClose} title="Add Event">
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        <div>
          <FL>Event Type</FL>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
            {["Partner Meeting","Conference","Meal/Reception","Networking","Other"].map(t => (
              <button key={t} onClick={()=>sf("type",t)} style={{ padding:"6px 10px", borderRadius:20, cursor:"pointer", fontSize:11, fontWeight:600, fontFamily:"'DM Sans',sans-serif", background:f.type===t?(TRACK_COLORS[t]||C.accent):C.bgDark, color:f.type===t?"#fff":C.textMuted, border:"1px solid "+(f.type===t?(TRACK_COLORS[t]||C.accent):C.border) }}>{t}</button>
            ))}
          </div>
        </div>
        {[{l:"Title *",k:"title",p:"Event name"},{l:"Start Time *",k:"time",p:"e.g. 10:30 AM"},{l:"End Time",k:"end",p:"e.g. 11:00 AM"}].map(x => (
          <div key={x.k}><FL>{x.l}</FL><input value={f[x.k]} onChange={e=>sf(x.k,e.target.value)} placeholder={x.p} style={inp}/></div>
        ))}
        <div><FL>Location</FL><AddressSearch value={f.location} onChange={v=>sf("location",v)} placeholder="Search venue or address..."/></div>
        {f.type==="Partner Meeting" ? (
          <div>
            <FL>Link to Partner</FL>
            <select value={f.partnerId} onChange={e=>sf("partnerId",e.target.value)} style={inp}>
              <option value="">— Select —</option>
              {partners.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
        ) : null}
        <div>
          <FL>Day</FL>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
            {DAYS.filter(d=>d.key!=="thu").map(d => (
              <button key={d.key} onClick={()=>sf("day",d.key)} style={{ padding:"6px 12px", borderRadius:20, cursor:"pointer", fontSize:11, fontWeight:600, fontFamily:"'DM Sans',sans-serif", background:f.day===d.key?C.accent:C.bgDark, color:f.day===d.key?"#fff":C.textMuted, border:"1px solid "+(f.day===d.key?C.accent:C.border) }}>{d.label+" "+d.date}</button>
            ))}
          </div>
        </div>
        <GreenBtn onClick={()=>onAdd(f)} style={{ width:"100%", padding:"12px", fontSize:14, borderRadius:24 }}>Add to Schedule</GreenBtn>
      </div>
    </Modal>
  );
}

// ─── MISC MODALS ──────────────────────────────────────────────────────────────
function AddPartnerModal({ onClose, onAdd }) {
  const [f, setF] = useState({ name:"", revenue:"", tier:"Mid", status:"green", objective:"" });
  const sf = (k, v) => setF(p => ({...p,[k]:v}));
  return (
    <Modal onClose={onClose} title="Add Partner">
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {[{l:"Company Name *",k:"name",p:"e.g. Acme Parts"},{l:"YTD Revenue",k:"revenue",p:"e.g. $5M"},{l:"Meeting Objective",k:"objective",p:"Goal of this meeting"}].map(x => (
          <div key={x.k}><FL>{x.l}</FL><input value={f[x.k]||""} onChange={e=>sf(x.k,e.target.value)} placeholder={x.p} style={inp}/></div>
        ))}
        <div><FL>Tier</FL><div style={{display:"flex",gap:6}}>{["Major","Mid","Growth"].map(t=><button key={t} onClick={()=>sf("tier",t)} style={{flex:1,padding:"7px",borderRadius:20,cursor:"pointer",fontSize:11,fontWeight:600,fontFamily:"'DM Sans',sans-serif",background:f.tier===t?TIER_COLORS[t]:C.bgDark,color:f.tier===t?"#fff":C.textMuted,border:"1px solid "+(f.tier===t?TIER_COLORS[t]:C.border)}}>{t}</button>)}</div></div>
        <div><FL>Status</FL><div style={{display:"flex",gap:6}}>{["green","yellow","red"].map(s=><button key={s} onClick={()=>sf("status",s)} style={{flex:1,padding:"7px",borderRadius:20,cursor:"pointer",fontSize:11,fontWeight:600,fontFamily:"'DM Sans',sans-serif",background:f.status===s?STATUS_COLORS[s]:C.bgDark,color:f.status===s?"#fff":C.textMuted,border:"1px solid "+(f.status===s?STATUS_COLORS[s]:C.border)}}>{STATUS_LABELS[s]}</button>)}</div></div>
        <GreenBtn onClick={()=>onAdd(f)} style={{width:"100%",padding:"12px",fontSize:14,borderRadius:24}}>Add Partner</GreenBtn>
      </div>
    </Modal>
  );
}

function QuickNotesModal({ notes, onChange, onClose }) {
  return (
    <Modal onClose={onClose} title="Quick Notes">
      <textarea value={notes} onChange={e=>onChange(e.target.value)} placeholder="Jot anything down..." style={{...ta,minHeight:160,fontSize:14}}/>
      <GreenBtn onClick={onClose} style={{width:"100%",padding:"11px",fontSize:13,borderRadius:24,marginTop:8}}>Save & Close</GreenBtn>
    </Modal>
  );
}

function HotelModal({ hotel, onChange, onClose }) {
  const [d, setD] = useState({...hotel});
  const sf = (k, v) => setD(p => ({...p,[k]:v}));
  return (
    <Modal onClose={onClose} title="Hotel Info">
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {[{l:"Hotel Name",k:"name"},{l:"Phone",k:"phone"},{l:"Check-in",k:"checkIn"},{l:"Check-out",k:"checkOut"},{l:"My Room Number",k:"roomNumber"}].map(x => (
          <div key={x.k}><FL>{x.l}</FL><input value={d[x.k]||""} onChange={e=>sf(x.k,e.target.value)} style={inp}/></div>
        ))}
        <div><FL>Address</FL><AddressSearch value={d.address||""} onChange={v=>sf("address",v)} placeholder="Search hotel name or address..."/></div>
        <GreenBtn onClick={()=>{onChange(d);onClose();}} style={{width:"100%",padding:"11px",fontSize:13,borderRadius:24}}>Save</GreenBtn>
      </div>
    </Modal>
  );
}

function ExportModal({ sessions, partners, onClose }) {
  const pm = sessions.filter(s => s.track==="Partner Meeting" && !s.isChild);
  const lines = pm.map(s => {
    const parts = [
      "── " + s.title + " (" + (s.day||"").toUpperCase() + " " + s.time + ")",
      s.takeaways ? "   Takeaways: " + s.takeaways : null,
      s.actionItems ? "   Actions: " + s.actionItems : null,
      s.commitmentsMade ? "   Commitments: " + s.commitmentsMade : null,
      s.followUpDate ? "   Follow Up: " + s.followUpDate : null,
      s.rating > 0 ? "   Rating: " + "★".repeat(s.rating) : null,
    ];
    return parts.filter(Boolean).join("\n");
  }).join("\n\n");
  const divider = "=".repeat(54);
  const summary = "ABPA ANNUAL CONFERENCE 2026 — POST CONFERENCE SUMMARY\n" + divider + "\n\n" + (lines || "No partner meetings recorded yet.") + "\n\n" + divider + "\nGenerated by Lanyard";
  return (
    <Modal onClose={onClose} title="Post-Conference Export" wide>
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        <textarea readOnly value={summary} style={{...ta,minHeight:260,fontSize:11,fontFamily:"monospace",color:C.textSub}}/>
        <GreenBtn onClick={() => { try { navigator.clipboard.writeText(summary); } catch(e) {} }} style={{width:"100%",padding:"11px",fontSize:13,borderRadius:24}}>📋 Copy to Clipboard</GreenBtn>
      </div>
    </Modal>
  );
}

// ─── AI IMPORT MODAL ──────────────────────────────────────────────────────────
function AIImportModal({ onClose, onImport }) {
  const [mode, setMode] = useState(null);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  function runImport() {
    if (!inputText.trim()) return;
    setIsLoading(true);
    setErrorMsg("");
    const prompt = "Extract all conference sessions/events from this text. Return ONLY a JSON array with objects having: title, day (use Day 1 Day 2 Day 3 etc), time (like 9:00 AM), end (like 10:00 AM), location, track (one of: Conference, Partner Meeting, Meal/Reception, Keynote, Logistics, Open Slot). Return ONLY the JSON array.\n\n" + inputText.slice(0, 3000);
    fetch("https://api.anthropic.com/v1/messages", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000, messages:[{role:"user",content:prompt}] }),
    })
    .then(r => r.json())
    .then(data => {
      const text = (data.content && data.content[0] && data.content[0].text) || "";
      const clean = text.replace(/```json|```/g,"").trim();
      const parsed = JSON.parse(clean);
      if (Array.isArray(parsed) && parsed.length > 0) {
        onImport(parsed);
      } else {
        setErrorMsg("Couldn't find any events. Try pasting more of your schedule.");
      }
    })
    .catch(() => setErrorMsg("Something went wrong. Try pasting as plain text."))
    .finally(() => setIsLoading(false));
  }

  if (!mode) return (
    <Modal onClose={onClose} title="Import Your Schedule">
      <div style={{ textAlign:"center", marginBottom:20 }}>
        <div style={{ display:"flex", justifyContent:"center", marginBottom:12 }}><PipMark size={16} color={C.accent} glow pulse/></div>
        <div style={{ fontSize:13, color:C.textSub, lineHeight:1.7 }}>Pip will read your schedule and load all events automatically.</div>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {[
          {id:"paste",icon:"📋",label:"Paste your schedule",desc:"Copy from email, Word, or anywhere"},
          {id:"url",icon:"🔗",label:"Drop in a URL",desc:"Paste a link to your conference agenda"},
          {id:"file",icon:"📎",label:"Upload a file",desc:"PDF, Word doc, or spreadsheet"},
        ].map(opt => (
          <button key={opt.id} onClick={() => setMode(opt.id)} style={{ background:C.bgCardAlt, border:"1px solid "+C.border, borderRadius:12, padding:"14px 16px", cursor:"pointer", display:"flex", alignItems:"center", gap:14, textAlign:"left" }}>
            <div style={{ fontSize:24, flexShrink:0 }}>{opt.icon}</div>
            <div>
              <div style={{ fontSize:13, fontWeight:500, color:C.text, marginBottom:3 }}>{opt.label}</div>
              <div style={{ fontSize:11, color:C.textMuted }}>{opt.desc}</div>
            </div>
          </button>
        ))}
        <button onClick={onClose} style={{ background:"none", border:"none", color:C.textMuted, cursor:"pointer", fontSize:12, fontFamily:"'DM Sans',sans-serif", padding:"8px" }}>✍️ I'll build it manually</button>
      </div>
    </Modal>
  );

  return (
    <Modal onClose={() => setMode(null)} title={mode==="paste"?"Paste Schedule":mode==="url"?"Conference URL":"Upload File"}>
      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
        <div style={{ display:"flex", justifyContent:"center" }}><PipMark size={14} color={C.accent} glow pulse/></div>
        {mode==="url" ? (
          <input value={inputText} onChange={e=>setInputText(e.target.value)} placeholder="https://conference.com/agenda" style={inp}/>
        ) : (
          <textarea value={inputText} onChange={e=>setInputText(e.target.value)} placeholder="Paste your schedule here..." style={{...ta,minHeight:180}}/>
        )}
        {errorMsg ? <div style={{ fontSize:12, color:C.red, background:"rgba(248,113,113,0.1)", border:"1px solid rgba(248,113,113,0.2)", borderRadius:8, padding:"10px 12px" }}>{errorMsg}</div> : null}
        <GreenBtn onClick={runImport} style={{ width:"100%", padding:"12px", fontSize:14, borderRadius:24 }} disabled={isLoading}>
          {isLoading ? "Pip is reading..." : "Let Pip Read It"}
        </GreenBtn>
        <button onClick={() => setMode(null)} style={{ background:"none", border:"none", color:C.textMuted, cursor:"pointer", fontSize:12, fontFamily:"'DM Sans',sans-serif" }}>← Back</button>
      </div>
    </Modal>
  );
}

// ─── SESSION PICKER ───────────────────────────────────────────────────────────
function SessionPickerModal({ importedSessions, onConfirm, onClose }) {
  const [sel, setSel] = useState(new Set(importedSessions.map((_,i) => i)));
  const toggle = i => setSel(p => { const n = new Set(p); n.has(i)?n.delete(i):n.add(i); return n; });
  return (
    <Modal onClose={onClose} title="Build Your Agenda" wide>
      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
        <div style={{ display:"flex", justifyContent:"center" }}><PipMark size={14} color={C.accent} glow/></div>
        <div style={{ fontSize:12, color:C.textSub, textAlign:"center", lineHeight:1.7 }}>Pip found {importedSessions.length} events. Tap what you want to attend.</div>
        <div style={{ display:"flex", gap:8, justifyContent:"center" }}>
          <button onClick={() => setSel(new Set(importedSessions.map((_,i)=>i)))} style={{ background:C.bgDark, color:C.textSub, border:"1px solid "+C.border, borderRadius:20, padding:"5px 12px", cursor:"pointer", fontSize:11, fontFamily:"'DM Sans',sans-serif" }}>Select All</button>
          <button onClick={() => setSel(new Set())} style={{ background:C.bgDark, color:C.textMuted, border:"1px solid "+C.border, borderRadius:20, padding:"5px 12px", cursor:"pointer", fontSize:11, fontFamily:"'DM Sans',sans-serif" }}>Clear</button>
          <span style={{ fontSize:11, color:C.textMuted, display:"flex", alignItems:"center" }}>{sel.size} selected</span>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:6, maxHeight:360, overflowY:"auto" }}>
          {importedSessions.map((s, i) => {
            const color = TRACK_COLORS[s.track] || C.accent;
            const isSelected = sel.has(i);
            return (
              <div key={i} onClick={() => toggle(i)} style={{ background:isSelected?"rgba("+toRgb(color)+",0.1)":C.bgDark, border:"1px solid "+(isSelected?color+"40":C.border), borderLeft:"3px solid "+(isSelected?color:"transparent"), borderRadius:10, padding:"11px 14px", cursor:"pointer", display:"flex", gap:12, alignItems:"center" }}>
                <div style={{ width:20, height:20, borderRadius:"50%", border:"1.5px solid "+(isSelected?color:C.textMuted), background:isSelected?color:"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  {isSelected ? <span style={{ color:"#fff", fontSize:11, fontWeight:700 }}>✓</span> : null}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:500, color:isSelected?C.text:C.textSub, marginBottom:3, lineHeight:1.3 }}>{s.title}</div>
                  <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                    {s.time ? <span style={{ fontSize:10, color:C.textMuted }}>{"🕐 "+s.time}</span> : null}
                    {s.location ? <span style={{ fontSize:10, color:C.textMuted }}>{"📍 "+s.location}</span> : null}
                    <Pill color={color}>{s.track}</Pill>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <GreenBtn onClick={() => onConfirm(importedSessions.filter((_,i) => sel.has(i)))} style={{ width:"100%", padding:"13px", fontSize:14, borderRadius:24 }}>
          {"Build My Agenda ("+sel.size+" events)"}
        </GreenBtn>
      </div>
    </Modal>
  );
}

// ─── ONBOARDING ───────────────────────────────────────────────────────────────
function Onboarding({ onDone, onImport }) {
  const [step, setStep] = useState(0);
  const [showImport, setShowImport] = useState(false);
  const [imported, setImported] = useState(null);

  if (imported) return (
    <div style={{ fontFamily:"'DM Sans',sans-serif", background:C.bg, minHeight:"100vh", color:C.text }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap" rel="stylesheet"/>
      <SessionPickerModal importedSessions={imported} onConfirm={sel => { onImport(sel); onDone(); }} onClose={() => setImported(null)}/>
    </div>
  );

  if (showImport) return (
    <div style={{ fontFamily:"'DM Sans',sans-serif", background:C.bg, minHeight:"100vh", color:C.text }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap" rel="stylesheet"/>
      <AIImportModal onClose={() => setShowImport(false)} onImport={s => { setImported(s); setShowImport(false); }}/>
    </div>
  );

  const totalSteps = 5;

  function renderStep() {
    if (step === 0) return (
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", flex:1, textAlign:"center", padding:"0 32px" }}>
        <div style={{ marginBottom:28 }}><LanyardLogo size={72} color={C.accent}/></div>
        <div style={{ fontFamily:"'Syne',sans-serif", fontSize:32, fontWeight:800, color:C.text, letterSpacing:"-0.5px", marginBottom:12 }}>LANYARD</div>
        <div style={{ fontSize:15, color:C.textSub, fontWeight:300, letterSpacing:"0.04em" }}>Your conference. Fully loaded.</div>
      </div>
    );
    if (step === 1) return (
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", flex:1, textAlign:"center", padding:"0 32px" }}>
        <div style={{ marginBottom:28, position:"relative" }}>
          <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:100, height:100, borderRadius:"50%", background:"rgba(74,155,130,0.06)", animation:"pipRing 2.5s ease-in-out infinite" }}/>
          <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:70, height:70, borderRadius:"50%", background:"rgba(74,155,130,0.1)", animation:"pipRing 2.5s ease-in-out infinite 0.4s" }}/>
          <div style={{ position:"relative", zIndex:1, display:"flex", justifyContent:"center" }}>
            <PipMark size={32} color={C.accent} glow pulse/>
          </div>
        </div>
        <div style={{ fontSize:24, fontWeight:600, color:C.text, marginBottom:12 }}>Meet Pip</div>
        <div style={{ fontSize:14, color:C.textSub, lineHeight:1.8, maxWidth:280 }}>
          Hi, I'm Pip — your AI conference assistant.<br/>
          <span style={{ color:C.textMuted }}>I'll help you prep for meetings, take notes, and keep you one step ahead all conference long.</span>
        </div>
      </div>
    );
    if (step === 2) return (
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", flex:1, textAlign:"center", padding:"0 32px" }}>
        <div style={{ marginBottom:20 }}><PipMark size={18} color={C.accent} glow/></div>
        <div style={{ fontSize:20, fontWeight:600, color:C.text, marginBottom:16, lineHeight:1.3 }}>Everything before you walk in the room</div>
        <div style={{ display:"flex", flexDirection:"column", gap:10, width:"100%", maxWidth:300 }}>
          {[{icon:"📋",text:"Full conference schedule in one place"},{icon:"🤝",text:"Partner profiles with revenue and open items"},{icon:"📝",text:"Meeting notes, action items, follow ups"},{icon:"✨",text:"Powered by Pip"}].map(item => (
            <div key={item.text} style={{ display:"flex", alignItems:"center", gap:12, background:C.bgCard, border:"1px solid "+C.border, borderRadius:10, padding:"12px 14px", textAlign:"left" }}>
              <span style={{ fontSize:18, flexShrink:0 }}>{item.icon}</span>
              <span style={{ fontSize:12, color:C.textSub, lineHeight:1.4 }}>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    );
    if (step === 3) return (
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", flex:1, textAlign:"center", padding:"0 32px" }}>
        <div style={{ marginBottom:16 }}><PipMark size={18} color={C.accent} glow/></div>
        <div style={{ fontSize:20, fontWeight:600, color:C.text, marginBottom:8 }}>Load your schedule</div>
        <div style={{ fontSize:13, color:C.textMuted, marginBottom:24, lineHeight:1.7 }}>Pip reads any format automatically</div>
        <div style={{ display:"flex", flexDirection:"column", gap:9, width:"100%", maxWidth:300 }}>
          {[{icon:"📋",label:"Paste your schedule"},{icon:"🔗",label:"Drop in a URL"},{icon:"📎",label:"Upload a file"}].map(opt => (
            <div key={opt.label} style={{ background:C.bgCard, border:"1px solid "+C.border, borderRadius:10, padding:"11px 14px", display:"flex", alignItems:"center", gap:12 }}>
              <span style={{ fontSize:16 }}>{opt.icon}</span>
              <span style={{ fontSize:12, color:C.textSub }}>{opt.label}</span>
            </div>
          ))}
        </div>
        <GreenBtn onClick={() => setShowImport(true)} style={{ marginTop:20, padding:"12px 32px", fontSize:14 }}>Import with Pip</GreenBtn>
        <button onClick={() => setStep(4)} style={{ background:"none", border:"none", color:C.textMuted, cursor:"pointer", fontSize:12, fontFamily:"'DM Sans',sans-serif", marginTop:12 }}>Skip — add manually</button>
      </div>
    );
    return (
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", flex:1, textAlign:"center", padding:"0 32px" }}>
        <div style={{ marginBottom:24 }}><PipMark size={26} color={C.accent} glow pulse/></div>
        <div style={{ fontSize:24, fontWeight:600, color:C.text, marginBottom:12 }}>You're all set</div>
        <div style={{ fontSize:14, color:C.textSub, lineHeight:1.7, marginBottom:32 }}>Your ABPA 2026 schedule is loaded.<br/>Pip is ready when you need him.</div>
        <GreenBtn onClick={onDone} style={{ padding:"14px 48px", fontSize:15, borderRadius:24 }}>Let's go →</GreenBtn>
      </div>
    );
  }

  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif", background:C.bg, minHeight:"100vh", display:"flex", flexDirection:"column", color:C.text }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap" rel="stylesheet"/>
      <div style={{ flex:1, display:"flex", flexDirection:"column", maxWidth:400, margin:"0 auto", width:"100%", paddingTop:60, paddingBottom:40 }}>
        {renderStep()}
        <div style={{ padding:"0 32px" }}>
          <div style={{ display:"flex", gap:6, justifyContent:"center", marginBottom:24 }}>
            {Array.from({length:totalSteps}).map((_,i) => (
              <div key={i} style={{ width:i===step?24:6, height:6, borderRadius:3, background:i===step?C.accent:C.bgPillActive, transition:"all 0.2s" }}/>
            ))}
          </div>
          {step < totalSteps-1 && step !== 3 ? (
            <GreenBtn onClick={() => setStep(s=>s+1)} style={{ width:"100%", padding:"13px", fontSize:15, borderRadius:24 }}>Continue →</GreenBtn>
          ) : null}
          {step > 0 ? (
            <button onClick={() => setStep(s=>s-1)} style={{ background:"none", border:"none", color:C.textMuted, cursor:"pointer", fontSize:13, fontFamily:"'DM Sans',sans-serif", display:"block", width:"100%", marginTop:12, textAlign:"center" }}>← Back</button>
          ) : null}
          {step === 0 ? (
            <button onClick={onDone} style={{ background:"none", border:"none", color:C.textMuted, cursor:"pointer", fontSize:12, fontFamily:"'DM Sans',sans-serif", display:"block", width:"100%", marginTop:12, textAlign:"center" }}>Skip intro</button>
          ) : null}
        </div>
      </div>
      <style>{`
        @keyframes pipPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.7;transform:scale(0.92)} }
        @keyframes pipRing { 0%,100%{opacity:0.6;transform:translate(-50%,-50%) scale(1)} 50%{opacity:0.2;transform:translate(-50%,-50%) scale(1.15)} }
      `}</style>
    </div>
  );
}

// ─── VIEWS ────────────────────────────────────────────────────────────────────
function HomeView({ sessions, partners, now, hotel, weather, onSelectP, onHotel, onExport, quickNote, onQuickNote, onPipDay }) {
  const timeStr = now.toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" });
  const dateStr = now.toLocaleDateString([], { weekday:"long", month:"long", day:"numeric" });
  const todayKey = getConferenceDayKey(now) || "tue";
  const nextUp = sessions.find(s => !s.isChild && s.time && ["Partner Meeting","Conference","Meal/Reception"].includes(s.track) && s.day === todayKey && s.status === "upcoming");

  return (
    <div>
      <Card style={{ padding:"14px 16px", marginBottom:10, background:C.bgCardAlt }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ fontSize:28, fontWeight:300, color:C.text, letterSpacing:"-0.5px" }}>{timeStr}</div>
            <div style={{ fontSize:11, color:C.textSub, marginTop:2 }}>{dateStr}</div>
          </div>
          {weather ? (
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:28, lineHeight:1 }}>{getWeatherIcon(weather.code)}</div>
              <div style={{ fontSize:16, fontWeight:500, color:C.text }}>{weather.temp}°F</div>
              <div style={{ fontSize:10, color:C.textMuted }}>{getWeatherDesc(weather.code)}</div>
              <div style={{ fontSize:9, color:C.textMuted }}>Indian Wells</div>
            </div>
          ) : (
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:13, fontWeight:500, color:C.accent }}>May 18–21</div>
              <div style={{ fontSize:10, color:C.textMuted, marginTop:2 }}>Indian Wells, CA</div>
            </div>
          )}
        </div>
      </Card>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:10 }}>
        {[
          { l:"Meetings", v:sessions.filter(s=>s.track==="Partner Meeting").length, c:C.accentOrange },
          { l:"Partners", v:partners.length, c:C.accent },
          { l:"Pending",  v:partners.filter(p=>p.unscheduled).length, c:C.yellow },
          { l:"At Risk",  v:partners.filter(p=>p.status==="red").length, c:C.red },
        ].map(s => (
          <Card key={s.l} style={{ padding:"13px 15px" }}>
            <div style={{ fontSize:22, fontWeight:600, color:s.c }}>{s.v}</div>
            <div style={{ fontSize:10, color:C.textMuted, marginTop:3 }}>{s.l}</div>
          </Card>
        ))}
      </div>

      <div onClick={onPipDay} style={{ background:"linear-gradient(135deg,rgba(74,155,130,0.12),rgba(45,107,90,0.08))", border:"1px solid rgba(74,155,130,0.25)", borderRadius:12, padding:"14px 16px", marginBottom:10, cursor:"pointer" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ flexShrink:0 }}><PipMark size={18} color={C.accent} glow pulse/></div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:10, color:C.accent, fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:4 }}>Pip · Your Day</div>
            {nextUp ? (
              <div>
                <div style={{ fontSize:14, fontWeight:500, color:C.text, marginBottom:2 }}>{nextUp.title}</div>
                <div style={{ fontSize:11, color:C.textSub }}>{"🕐 "+nextUp.time+(nextUp.location?" · 📍 "+nextUp.location:"")}</div>
              </div>
            ) : (
              <div style={{ fontSize:13, color:C.textSub }}>Tap for your full day overview</div>
            )}
          </div>
          <div style={{ fontSize:13, color:C.textMuted }}>›</div>
        </div>
      </div>

      <Card style={{ padding:"12px 16px", marginBottom:10, cursor:"pointer", background:quickNote?C.bgCardAlt:C.bgCard }} onClick={onQuickNote}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ fontSize:18 }}>📝</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:12, fontWeight:500, color:C.text }}>Quick Notes</div>
            <div style={{ fontSize:11, color:C.textMuted, marginTop:1 }}>{quickNote ? quickNote.slice(0,40)+(quickNote.length>40?"...":"") : "Tap to jot something down"}</div>
          </div>
          <div style={{ fontSize:13, color:C.textMuted }}>›</div>
        </div>
      </Card>

      <Card style={{ padding:"13px 15px", marginBottom:10 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:10, color:C.textMuted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:5 }}>🏨 Conference Hotel</div>
            <div style={{ fontSize:13, fontWeight:500, color:C.text, marginBottom:3 }}>{hotel.name}</div>
            <div style={{ fontSize:11, color:C.textSub, lineHeight:1.6 }}>
              {hotel.address}<br/>
              {"📞 "+hotel.phone}<br/>
              {"📅 "+hotel.checkIn+" → "+hotel.checkOut}
              {hotel.roomNumber ? <span><br/>{"🚪 Room "+hotel.roomNumber}</span> : null}
            </div>
          </div>
          <button onClick={onHotel} style={{ background:"none", border:"none", color:C.textMuted, cursor:"pointer", fontSize:13, padding:"2px 6px" }}>✏️</button>
        </div>
      </Card>

      <div style={{ fontSize:10, color:C.textMuted, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:10 }}>Partner Health</div>
      {partners.length === 0 ? (
        <EmptyState title="No partners yet" body="Add partner profiles to track relationships."/>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
          {partners.map(p => (
            <Card key={p.id} accent={STATUS_COLORS[p.status]} style={{ padding:"10px 14px", display:"flex", alignItems:"center", gap:12, cursor:"pointer" }} onClick={() => onSelectP(p)}>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:500, color:C.text }}>{p.name}</div>
                <div style={{ fontSize:10, color:C.textMuted, marginTop:1 }}>{p.revenue+" · "+(p.scheduledMeeting||"Not scheduled")}</div>
              </div>
              <Pill color={STATUS_COLORS[p.status]}>{STATUS_LABELS[p.status]}</Pill>
              <Pill color={TIER_COLORS[p.tier]}>{p.tier}</Pill>
            </Card>
          ))}
        </div>
      )}
      <button onClick={onExport} style={{ width:"100%", marginTop:16, background:C.bgDark, color:C.textSub, border:"1px solid "+C.border, borderRadius:24, padding:"11px", cursor:"pointer", fontSize:12, fontWeight:600, fontFamily:"'DM Sans',sans-serif" }}>
        📄 Export Post-Conference Summary
      </button>
      <div style={{ display:"flex", justifyContent:"center", marginTop:24, opacity:0.15 }}>
        <PipMark size={10} color={C.accent}/>
      </div>
    </div>
  );
}

function ScheduleView({ sessions, day, onSelectS, onSelectV, conflicts }) {
  const [expandedId, setExp] = useState(null);
  const [qf, setQf] = useState(false);
  const [filters, setFilters] = useState({ "Partner Meeting":true, "Conference":true, "Meal/Reception":true, "Open Slot":true, "Logistics":true, "Keynote":true });

  if (day === "thu") return (
    <div style={{ textAlign:"center", padding:"60px 20px", background:C.bgCard, border:"1px solid "+C.border, borderRadius:14 }}>
      <div style={{ fontSize:40, marginBottom:12 }}>✈️</div>
      <div style={{ fontSize:18, fontWeight:500, color:C.text, marginBottom:8 }}>Travel Day</div>
      <div style={{ fontSize:13, color:C.textMuted }}>Safe travels!</div>
    </div>
  );

  const di = sessions.filter(s => s.day === day);
  const vis = qf ? di.filter(s => ["Partner Meeting","Meal/Reception"].includes(s.track) && !s.isChild) : di.filter(s => !s.isChild && filters[s.track]);
  const kids = sessions.filter(s => s.isChild && s.day === day);

  return (
    <div>
      <div style={{ display:"flex", gap:5, marginBottom:12, flexWrap:"wrap", alignItems:"center" }}>
        <button onClick={() => setQf(!qf)} style={{ background:qf?C.accent:C.bgDark, color:qf?"#fff":C.textSub, border:"1px solid "+(qf?C.accent:C.border), borderRadius:20, padding:"5px 12px", cursor:"pointer", fontSize:11, fontWeight:600, fontFamily:"'DM Sans',sans-serif" }}>My Meetings</button>
        {!qf ? Object.keys(filters).map(track => (
          <button key={track} onClick={() => setFilters(p=>({...p,[track]:!p[track]}))} style={{ background:filters[track]?"rgba("+toRgb(TRACK_COLORS[track]||C.accent)+",0.12)":C.bgDark, color:filters[track]?(TRACK_COLORS[track]||C.accent):C.textMuted, border:"1px solid "+(filters[track]?(TRACK_COLORS[track]||C.accent)+"40":C.border), borderRadius:20, padding:"4px 9px", cursor:"pointer", fontSize:10, fontWeight:600, fontFamily:"'DM Sans',sans-serif" }}>{track}</button>
        )) : null}
      </div>
      <div style={{ fontSize:11, color:C.textMuted, marginBottom:10 }}>{(DAYS.find(d=>d.key===day)||{full:""}).full}</div>
      {vis.length === 0 ? <EmptyState title="No events match filters" body="Try adjusting the filters above."/> : (
        <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
          {vis.map(s => {
            const color = TRACK_COLORS[s.track] || C.accent;
            const isOpen = s.track === "Open Slot";
            const hasC = conflicts.has(s.id);
            const isExp = expandedId === s.id;
            const hasKids = s.isParent && kids.length > 0;
            const vKey = getVenueKey(s.location);
            return (
              <div key={s.id}>
                <Card
                  accent={hasC?C.red:isOpen?undefined:color}
                  style={{ padding:"11px 14px", display:"flex", gap:12, alignItems:"flex-start", cursor:isOpen?"default":"pointer", opacity:isOpen?0.7:1 }}
                  onClick={() => { if (!isOpen && !s.isParent) onSelectS(s); if (hasKids) setExp(isExp?null:s.id); }}
                >
                  <div style={{ minWidth:60, textAlign:"right", paddingTop:2, flexShrink:0 }}>
                    {s.time ? (
                      <div>
                        <div style={{ fontSize:11, fontWeight:500, color:C.textSub }}>{s.time}</div>
                        {s.end ? <div style={{ fontSize:9, color:C.textMuted, marginTop:1 }}>{"→ "+s.end}</div> : null}
                      </div>
                    ) : <div style={{ fontSize:10, color:C.textMuted }}>—</div>}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:5, marginBottom:4, flexWrap:"wrap" }}>
                      <Pill color={color}>{s.track}</Pill>
                      {!isOpen ? <Pill color={MS_COLORS[s.status]||C.blue}>{MS_LABELS[s.status]||"Upcoming"}</Pill> : null}
                      {hasC ? <Pill color={C.red}>⚠ Conflict</Pill> : null}
                      {hasKids ? <span style={{ fontSize:10, color:C.accent, marginLeft:"auto" }}>{isExp?"▲ hide":"▼ speakers"}</span> : null}
                    </div>
                    <div style={{ fontSize:13, fontWeight:isOpen?400:500, fontStyle:isOpen?"italic":"normal", color:isOpen?C.textMuted:C.text, lineHeight:1.4 }}>
                      {isOpen ? ("— "+s.notes) : s.title}
                    </div>
                    {s.location ? (
                      <div onClick={e => { e.stopPropagation(); if (vKey) onSelectV(s.location); }} style={{ fontSize:10, color:vKey?C.accent:C.textMuted, marginTop:3, cursor:vKey?"pointer":"default" }}>
                        {"📍 "+s.location+(vKey?" ›":"")}
                      </div>
                    ) : null}
                    {s.notes && !isOpen ? <div style={{ fontSize:10, color:C.textMuted, marginTop:3, lineHeight:1.5 }}>{"👤 "+s.notes}</div> : null}
                    {!isOpen ? (
                      <div style={{ display:"flex", gap:4, marginTop:5, flexWrap:"wrap" }}>
                        {TEAM.filter(t => s.attendees && s.attendees.includes(t.key)).map(t => (
                          <span key={t.key} style={{ background:"rgba("+toRgb(t.color)+",0.12)", color:t.color, fontSize:9, fontWeight:600, padding:"2px 7px", borderRadius:20 }}>{t.name}</span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                  {!isOpen ? <div style={{ fontSize:14, color:C.textMuted, paddingTop:2, flexShrink:0 }}>›</div> : null}
                </Card>
                {hasKids && isExp ? (
                  <div style={{ marginLeft:16, marginTop:3, display:"flex", flexDirection:"column", gap:3 }}>
                    {kids.map(child => (
                      <div key={child.id} style={{ background:C.bgDark, border:"1px solid "+C.border, borderLeft:"2px solid "+C.yellow, borderRadius:8, padding:"8px 12px", display:"flex", gap:10 }}>
                        <div style={{ minWidth:54, textAlign:"right", flexShrink:0 }}>
                          <div style={{ fontSize:10, color:C.textSub }}>{child.time}</div>
                          <div style={{ fontSize:9, color:C.textMuted }}>{"→ "+child.end}</div>
                        </div>
                        <div style={{ fontSize:11, color:C.textSub, lineHeight:1.5 }}>{child.title}</div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function TeamView({ sessions, day }) {
  const di = sessions.filter(s => s.day === day && !s.isChild);
  return (
    <div>
      <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap" }}>
        {TEAM.map(t => (
          <Card key={t.key} style={{ padding:"10px 14px", display:"flex", alignItems:"center", gap:8, flex:1 }}>
            <div style={{ width:8, height:8, borderRadius:"50%", background:t.color, flexShrink:0 }}/>
            <div>
              <div style={{ fontSize:12, fontWeight:500, color:C.text }}>{t.name}</div>
              <div style={{ fontSize:10, color:C.textMuted }}>{t.title}</div>
            </div>
          </Card>
        ))}
      </div>
      <div style={{ fontSize:11, color:C.textMuted, marginBottom:10 }}>{(DAYS.find(d=>d.key===day)||{full:""}).full}</div>
      {di.length === 0 ? <EmptyState title="No events this day" body="Check another day."/> : (
        <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
          {di.map(s => {
            const color = TRACK_COLORS[s.track] || C.accent;
            return (
              <Card key={s.id} style={{ padding:"10px 14px", display:"flex", gap:12, alignItems:"center" }}>
                <div style={{ minWidth:60, textAlign:"right", flexShrink:0 }}>
                  <div style={{ fontSize:11, color:C.textSub }}>{s.time || "—"}</div>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:12, fontWeight:500, color:C.text, marginBottom:4, lineHeight:1.3 }}>
                    {s.track === "Open Slot" ? <em style={{ color:C.textMuted }}>Open Slot</em> : s.title}
                  </div>
                  <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
                    {TEAM.filter(t => s.attendees && s.attendees.includes(t.key)).map(t => (
                      <span key={t.key} style={{ background:"rgba("+toRgb(t.color)+",0.12)", color:t.color, fontSize:9, fontWeight:600, padding:"2px 7px", borderRadius:20 }}>{t.name}</span>
                    ))}
                  </div>
                </div>
                <Pill color={color}>{s.track}</Pill>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function PartnersView({ partners, onSelect, onSchedule, onEdit, onAdd }) {
  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
        <div style={{ fontSize:11, color:C.textMuted }}>{partners.length} partners</div>
        <GreenBtn onClick={onAdd} style={{ fontSize:11, padding:"7px 14px" }}>+ Add Partner</GreenBtn>
      </div>
      {partners.length === 0 ? (
        <EmptyState title="No partners yet" body="Add partner profiles to track relationships, revenue, and meeting notes." action="Add Your First Partner" onAction={onAdd}/>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
          {partners.map(p => (
            <Card key={p.id} accent={STATUS_COLORS[p.status]} style={{ padding:"12px 15px", cursor:"pointer" }} onClick={() => onSelect(p)}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8 }}>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:5, flexWrap:"wrap" }}>
                    <div style={{ fontSize:14, fontWeight:500, color:C.text }}>{p.name}</div>
                    <Pill color={TIER_COLORS[p.tier]}>{p.tier}</Pill>
                    <Pill color={STATUS_COLORS[p.status]}>{STATUS_LABELS[p.status]}</Pill>
                    {p.rating > 0 ? <span style={{ color:C.yellow, fontSize:11 }}>{"★".repeat(p.rating)}</span> : null}
                  </div>
                  <div style={{ fontSize:11, color:C.textMuted, marginBottom:2 }}>{"💰 "+p.revenue+" YTD"}</div>
                  {p.scheduledMeeting ? <div style={{ fontSize:10, color:C.textMuted }}>{"📅 "+p.scheduledMeeting}</div> : null}
                  <div style={{ display:"flex", gap:4, marginTop:6, flexWrap:"wrap" }}>
                    {p.attendees && p.attendees.filter(a=>a.poc).map(a => <span key={a.id} style={{ background:"rgba("+toRgb(C.accent)+",0.1)", color:C.accent, fontSize:9, fontWeight:600, padding:"2px 7px", borderRadius:20 }}>{"⭐ "+a.name}</span>)}
                    {p.attendees && p.attendees.filter(a=>!a.poc).slice(0,2).map(a => <span key={a.id} style={{ background:C.bgDark, color:C.textSub, fontSize:9, padding:"2px 7px", borderRadius:20 }}>{a.name}</span>)}
                    {p.attendees && p.attendees.filter(a=>!a.poc).length > 2 ? <span style={{ fontSize:9, color:C.textMuted }}>{"+"+(p.attendees.filter(a=>!a.poc).length-2)}</span> : null}
                  </div>
                </div>
              </div>
              <div style={{ display:"flex", gap:7, marginTop:10 }} onClick={e => e.stopPropagation()}>
                <GreenBtn onClick={() => onSchedule(p)} style={{ fontSize:11, padding:"6px 12px" }}>📅 Schedule</GreenBtn>
                <SecBtn onClick={() => onEdit(p)} style={{ fontSize:11, padding:"6px 12px" }}>✏️ Edit</SecBtn>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function PendingView({ partners, sessions, onSchedule }) {
  const unsched = partners.filter(p => p.unscheduled);
  const openSlots = sessions.filter(s => s.track === "Open Slot");
  return (
    <div>
      <Card style={{ padding:"13px 16px", marginBottom:16, background:C.bgCardAlt }}>
        <div style={{ fontSize:10, fontWeight:600, color:C.purple, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8 }}>📅 Available Open Slots</div>
        {openSlots.length === 0 ? (
          <div style={{ fontSize:12, color:C.textMuted, fontStyle:"italic" }}>No open slots</div>
        ) : (
          openSlots.map(s => {
            const d = DAYS.find(x => x.key === s.day) || { label:"", date:"" };
            return (
              <div key={s.id} style={{ display:"flex", gap:10, marginBottom:4, fontSize:12 }}>
                <span style={{ color:C.purple, fontWeight:500, minWidth:64 }}>{d.label+" "+d.date}</span>
                <span style={{ color:C.textSub }}>{s.time+" – "+s.end}</span>
              </div>
            );
          })
        )}
      </Card>
      {unsched.length === 0 ? (
        <EmptyState title="All partners scheduled!" body="Every partner has a meeting slot."/>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
          {unsched.map(p => (
            <Card key={p.id} accent={C.accentOrange} style={{ padding:"13px 16px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:10, marginBottom:10 }}>
                <div>
                  <div style={{ fontSize:14, fontWeight:500, color:C.text, marginBottom:4 }}>{p.name}</div>
                  <div style={{ fontSize:11, color:C.textSub }}>{"💰 "+p.revenue}</div>
                  {p.openItems && p.openItems.length > 0 ? <div style={{ fontSize:11, color:C.textMuted, marginTop:3 }}>{"· "+p.openItems[0].text}</div> : null}
                  <div style={{ display:"flex", gap:4, marginTop:5, flexWrap:"wrap" }}>
                    {p.attendees && p.attendees.slice(0,3).map(a => <span key={a.id} style={{ background:C.bgDark, color:C.textSub, fontSize:9, padding:"2px 7px", borderRadius:20 }}>{a.name}</span>)}
                  </div>
                  <div style={{ marginTop:8, fontSize:10, color:C.textMuted, fontWeight:600 }}>💡 Fits:</div>
                  {openSlots.map(s => {
                    const d = DAYS.find(x => x.key === s.day) || { label:"" };
                    return <div key={s.id} style={{ fontSize:10, color:C.purple, marginTop:2 }}>{"· "+d.label+" "+s.time+"–"+s.end}</div>;
                  })}
                </div>
                <Pill color={C.accentOrange}>Pending</Pill>
              </div>
              <GreenBtn onClick={() => onSchedule(p)} style={{ width:"100%", fontSize:12 }}>📅 Schedule Meeting</GreenBtn>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function Lanyard() {
  const [onboarded, setOnboarded] = useState(() => {
    try { return !!localStorage.getItem("lanyard_onboarded"); } catch(e) { return false; }
  });
  const [view, setView]         = useState("home");
  const [day, setDay]           = useState(getCurrentDayKey);
  const [sessions, setSess]     = useState(() => { const s = loadState(); return s ? s.sessions : INIT_SESSIONS; });
  const [partners, setPart]     = useState(() => { const s = loadState(); return s ? s.partners : INIT_PARTNERS; });
  const [hotel, setHotel]       = useState(() => { const s = loadState(); return s ? s.hotel : HOTEL_DEFAULT; });
  const [quickNote, setQN]      = useState(() => { const s = loadState(); return s ? s.quickNote : ""; });
  const [weather, setWeather]   = useState(null);
  const [selS, setSelS]         = useState(null);
  const [selP, setSelP]         = useState(null);
  const [editP, setEditP]       = useState(null);
  const [schedP, setSchedP]     = useState(null);
  const [venueModal, setVM]     = useState(null);
  const [toast, setToast]       = useState(null);
  const [showAddE, setAddE]     = useState(false);
  const [showAddP, setAddP]     = useState(false);
  const [showHotel, setHotelM]  = useState(false);
  const [showQN, setShowQN]     = useState(false);
  const [showExport, setExport] = useState(false);
  const [showSearch, setSearch] = useState(false);
  const [showImport, setImport] = useState(false);
  const [showPipDay, setPipDay] = useState(false);
  const [srchQ, setSrchQ]       = useState("");
  const [now, setNow]           = useState(new Date());
  const [alertMsg, setAlertMsg] = useState(null);

  // Load from Supabase on mount
  useEffect(() => {
    sbLoad().then(data => {
      if (data) {
        if (data.sessions && data.sessions.length > 0) setSess(data.sessions);
        if (data.partners && data.partners.length > 0) setPart(data.partners);
        if (data.hotel) setHotel(data.hotel);
        if (data.quickNote) setQN(data.quickNote);
      }
    });
  }, []);

  // Save to both Supabase and local storage
  useEffect(() => {
    saveState({ sessions, partners, hotel, quickNote });
    const t = setTimeout(() => {
      sbSaveSessions(sessions);
      sbSavePartners(partners);
      sbSavePrefs(hotel, quickNote);
    }, 1500);
    return () => clearTimeout(t);
  }, [sessions, partners, hotel, quickNote]);
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 30000); return () => clearInterval(t); }, []);

  // Fixed time logic
  useEffect(() => {
    const confDay = getConferenceDayKey(now);
    if (!confDay) return;
    const nowMins = now.getHours() * 60 + now.getMinutes();
    setSess(prev => prev.map(s => {
      if (!s.time || s.isChild || s.day !== confDay) return s;
      const start = parseTime(s.time);
      const end   = s.end ? parseTime(s.end) : start + 60;
      const status = nowMins >= start && nowMins < end ? "in-progress" : nowMins >= end ? "complete" : "upcoming";
      return status !== s.status ? {...s, status} : s;
    }));
  }, [now]);

  useEffect(() => {
    const confDay = getConferenceDayKey(now);
    if (!confDay) return;
    const nowMins = now.getHours() * 60 + now.getMinutes();
    for (const s of sessions.filter(x => !x.isChild && x.time && x.status === "upcoming" && x.day === confDay)) {
      const diff = parseTime(s.time) - nowMins;
      if (diff === 10) { setAlertMsg("⏰ " + s.title + " starts in 10 minutes"); break; }
      if (diff === 5)  { setAlertMsg("🔔 " + s.title + " starts in 5 minutes");  break; }
    }
  }, [now, sessions]);

  useEffect(() => {
    if (alertMsg) { const t = setTimeout(() => setAlertMsg(null), 6000); return () => clearTimeout(t); }
  }, [alertMsg]);

  useEffect(() => {
    fetch("https://api.open-meteo.com/v1/forecast?latitude=33.7175&longitude=-116.3422&current=temperature_2m,weathercode&temperature_unit=fahrenheit&forecast_days=1")
      .then(r => r.json())
      .then(d => { if (d && d.current) setWeather({ temp:Math.round(d.current.temperature_2m), code:d.current.weathercode }); })
      .catch(() => {});
  }, []);

  const notify = useCallback(msg => { setToast(msg); setTimeout(() => setToast(null), 2800); }, []);

  const updateS = useCallback((id, f, v) => {
    setSess(p => p.map(s => s.id===id ? {...s,[f]:v} : s));
    setSelS(p => p && p.id===id ? {...p,[f]:v} : p);
  }, []);

  const updateP = useCallback((id, f, v) => {
    setPart(p => p.map(x => x.id===id ? {...x,[f]:v} : x));
    setSelP(p => p && p.id===id ? {...p,[f]:v} : p);
  }, []);

  const saveEditP = useCallback(draft => {
    setPart(p => p.map(x => x.id===draft.id ? {...draft} : x));
    setSelP(p => p && p.id===draft.id ? {...draft} : p);
    setEditP(null);
    notify("Partner updated!");
  }, [notify]);

  const addEvent = useCallback(f => {
    if (!f.title || !f.time) return;
    const s = { ...f, id:Date.now(), track:f.type, attendees:["C","K","T"], isParent:false, isChild:false, status:"upcoming", partnerId:f.partnerId||null };
    setSess(p => [...p, s]);
    if (f.partnerId) updateP(f.partnerId, "unscheduled", false);
    setAddE(false); setSchedP(null);
    notify("Event added!");
  }, [notify, updateP]);

  const addPartner = useCallback(f => {
    if (!f.name) return;
    setPart(p => [...p, { ...f, id:"p"+Date.now(), openItems:[], attendees:[], rating:0, pastNotes:"", unscheduled:true, scheduledMeeting:"" }]);
    setAddP(false);
    notify("Partner added!");
  }, [notify]);

  const handleImport = useCallback(importedSessions => {
    const mapped = importedSessions.map((s, i) => ({
      id: "import_"+Date.now()+"_"+i,
      day: s.day && s.day.toString().includes("1") ? "mon" : s.day && s.day.toString().includes("2") ? "tue" : s.day && s.day.toString().includes("3") ? "wed" : "thu",
      time: s.time || "9:00 AM",
      end: s.end || "",
      title: s.title || "Untitled",
      location: s.location || "",
      track: s.track || "Conference",
      attendees: ["C","K","T"],
      notes: "", status:"upcoming", partnerId:null, isParent:false, isChild:false,
    }));
    setSess(p => [...p, ...mapped]);
    notify(mapped.length + " events imported!");
  }, [notify]);

  const conflicts = useMemo(() => {
    const ids = new Set();
    const g = {};
    sessions.forEach(s => { if (!s.time || s.isChild) return; if (!g[s.day]) g[s.day]=[]; g[s.day].push(s); });
    Object.values(g).forEach(arr => {
      for (let i=0; i<arr.length; i++) {
        for (let j=i+1; j<arr.length; j++) {
          if (arr[i].time === arr[j].time) { ids.add(arr[i].id); ids.add(arr[j].id); }
        }
      }
    });
    return ids;
  }, [sessions]);

  const pMap = useMemo(() => { const m = {}; partners.forEach(p => { m[p.id]=p; }); return m; }, [partners]);
  const openSlots = sessions.filter(s => s.track === "Open Slot");
  const showDayTabs = view === "schedule" || view === "team";

  const srchRes = useMemo(() => {
    if (!srchQ.trim()) return { s:[], p:[] };
    const q = srchQ.toLowerCase();
    return {
      s: sessions.filter(x => x.title.toLowerCase().includes(q) || (x.location||"").toLowerCase().includes(q)),
      p: partners.filter(x => x.name.toLowerCase().includes(q)),
    };
  }, [srchQ, sessions, partners]);

  const handleDone = () => {
    try { localStorage.setItem("lanyard_onboarded","1"); } catch(e) {}
    setOnboarded(true);
  };

  if (!onboarded) return <Onboarding onDone={handleDone} onImport={handleImport}/>;

  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif", background:C.bg, minHeight:"100vh", color:C.text }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap" rel="stylesheet"/>

      <Toast message={toast}/>

      {alertMsg ? (
        <div style={{ position:"fixed", top:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:480, zIndex:9998, background:C.accentOrange, color:"#fff", padding:"12px 20px", textAlign:"center", fontSize:13, fontWeight:600, fontFamily:"'DM Sans',sans-serif" }}>
          {alertMsg}
        </div>
      ) : null}

      <div style={{ background:C.bg, borderBottom:"1px solid "+C.border, padding:"14px 18px 10px", position:"sticky", top:0, zIndex:50 }}>
        <div style={{ maxWidth:480, margin:"0 auto" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
            <div style={{ display:"flex", alignItems:"center", gap:9, cursor:"pointer" }} onClick={() => setView("home")}>
              <LanyardLogo size={28} color={C.accent}/>
              <div>
                <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <div style={{ fontSize:17, fontWeight:500, color:C.text, letterSpacing:"0.02em" }}>Lanyard</div>
                  <PipMark size={7} color={C.accent} opacity={0.5}/>
                </div>
                <div style={{ fontSize:9, color:C.textMuted, letterSpacing:"0.1em" }}>ABPA 2026 · INDIAN WELLS</div>
              </div>
            </div>
            <div style={{ display:"flex", gap:6, alignItems:"center" }}>
              <button onClick={() => setSearch(!showSearch)} style={{ background:"none", border:"none", color:C.textMuted, cursor:"pointer", fontSize:16, padding:"4px" }}>🔍</button>
              <button onClick={() => setImport(true)} style={{ ...btnBase, background:C.bgCardAlt, color:C.textSub, border:"1px solid "+C.border, fontSize:11, padding:"6px 10px" }}>↑ Import</button>
              <GreenBtn onClick={() => setAddE(true)} style={{ fontSize:11, padding:"7px 13px" }}>+ Add</GreenBtn>
            </div>
          </div>

          {showSearch ? (
            <div style={{ paddingBottom:8 }}>
              <input autoFocus value={srchQ} onChange={e=>setSrchQ(e.target.value)} placeholder="Search..." style={{...inp,fontSize:13}}/>
              {srchQ ? (
                <div style={{ background:C.bgDark, border:"1px solid "+C.border, borderRadius:10, marginTop:4 }}>
                  {srchRes.s.map(s => (
                    <div key={s.id} onClick={() => { setSelS(s); setSearch(false); setSrchQ(""); }} style={{ padding:"9px 14px", borderBottom:"1px solid "+C.border, cursor:"pointer", fontSize:12, color:C.text }}>
                      {"📋 "+s.title}
                      <span style={{ color:C.textMuted, marginLeft:6 }}>{(DAYS.find(d=>d.key===s.day)||{label:""}).label+" "+s.time}</span>
                    </div>
                  ))}
                  {srchRes.p.map(p => (
                    <div key={p.id} onClick={() => { setSelP(p); setSearch(false); setSrchQ(""); }} style={{ padding:"9px 14px", borderBottom:"1px solid "+C.border, cursor:"pointer", fontSize:12, color:C.text }}>
                      {"🤝 "+p.name+" — "+p.revenue}
                    </div>
                  ))}
                  {!srchRes.s.length && !srchRes.p.length ? <div style={{ padding:"11px 14px", fontSize:12, color:C.textMuted }}>No results</div> : null}
                </div>
              ) : null}
            </div>
          ) : null}

          <div style={{ display:"flex", background:"rgba(0,0,0,0.2)", borderRadius:10, padding:3, gap:2 }}>
            {[["home","🏠","Home"],["schedule","📋","Schedule"],["team","👥","Team"],["partners","🤝","Partners"],["pending","⏳","Pending"]].map(([k,icon,label]) => (
              <button key={k} onClick={() => setView(k)} style={{ flex:1, padding:"6px 4px", borderRadius:8, cursor:"pointer", fontSize:9, fontWeight:600, fontFamily:"'DM Sans',sans-serif", background:view===k?C.bgPillActive:"transparent", color:view===k?C.accent:C.textMuted, border:"1px solid "+(view===k?C.border:"transparent"), transition:"all 0.15s" }}>
                <div style={{ fontSize:14, marginBottom:1 }}>{icon}</div>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {showDayTabs ? (
        <div style={{ padding:"12px 18px 0", maxWidth:480, margin:"0 auto" }}>
          <div style={{ display:"flex", gap:5 }}>
            {DAYS.map(d => (
              <button key={d.key} onClick={() => setDay(d.key)} style={{ flex:1, padding:"8px 4px", borderRadius:10, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", border:"none", background:day===d.key?C.bgPillActive:C.bgPill, transition:"all 0.15s" }}>
                <div style={{ fontSize:9, color:day===d.key?C.textSub:C.textMuted, marginBottom:2 }}>{d.label}</div>
                <div style={{ fontSize:14, fontWeight:day===d.key?600:400, color:day===d.key?C.text:C.textSub }}>{d.date}</div>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div style={{ padding:"16px 18px 100px", maxWidth:480, margin:"0 auto" }}>
        {view === "home"     && <HomeView sessions={sessions} partners={partners} now={now} hotel={hotel} weather={weather} onSelectP={setSelP} onHotel={() => setHotelM(true)} onExport={() => setExport(true)} quickNote={quickNote} onQuickNote={() => setShowQN(true)} onPipDay={() => setPipDay(true)}/>}
        {view === "schedule" && <ScheduleView sessions={sessions} day={day} onSelectS={setSelS} onSelectV={setVM} conflicts={conflicts}/>}
        {view === "team"     && <TeamView sessions={sessions} day={day}/>}
        {view === "partners" && <PartnersView partners={partners} onSelect={setSelP} onSchedule={p => { setSchedP(p); setSelP(null); }} onEdit={p => setEditP({...p})} onAdd={() => setAddP(true)}/>}
        {view === "pending"  && <PendingView partners={partners} sessions={sessions} onSchedule={setSchedP}/>}
      </div>

      <div style={{ maxWidth:480, margin:"0 auto", padding:"0 18px 28px" }}>
        <div style={{ borderTop:"1px solid "+C.border, paddingTop:12, display:"flex", gap:12, flexWrap:"wrap" }}>
          {Object.entries(TRACK_COLORS).map(([track,color]) => (
            <div key={track} style={{ display:"flex", alignItems:"center", gap:4 }}>
              <div style={{ width:7, height:7, borderRadius:2, background:color }}/>
              <span style={{ fontSize:10, color:C.textMuted }}>{track}</span>
            </div>
          ))}
        </div>
      </div>

      {selS ? <MeetingModal session={selS} pMap={pMap} hasConflict={conflicts.has(selS.id)} onClose={() => setSelS(null)} onUpdateS={updateS} onUpdateP={updateP}/> : null}
      {selP && !editP ? <PartnerModal partner={selP} onClose={() => setSelP(null)} onUpdate={updateP} onSchedule={p => { setSchedP(p); setSelP(null); }} onEdit={p => setEditP({...p})}/> : null}
      {editP ? <EditPartnerModal partner={editP} onClose={() => setEditP(null)} onSave={saveEditP}/> : null}
      {schedP ? <ScheduleMeetingModal partner={schedP} openSlots={openSlots} onClose={() => setSchedP(null)} onAdd={addEvent}/> : null}
      {showAddE ? <AddEventModal partners={partners} openSlots={openSlots} onClose={() => setAddE(false)} onAdd={addEvent}/> : null}
      {showAddP ? <AddPartnerModal onClose={() => setAddP(false)} onAdd={addPartner}/> : null}
      {venueModal ? <VenueModal locationName={venueModal} onClose={() => setVM(null)}/> : null}
      {showHotel ? <HotelModal hotel={hotel} onChange={setHotel} onClose={() => setHotelM(false)}/> : null}
      {showQN ? <QuickNotesModal notes={quickNote} onChange={setQN} onClose={() => setShowQN(false)}/> : null}
      {showExport ? <ExportModal sessions={sessions} partners={partners} onClose={() => setExport(false)}/> : null}
      {showImport ? <AIImportModal onClose={() => setImport(false)} onImport={handleImport}/> : null}
      {showPipDay ? <PipDayModal sessions={sessions} partners={partners} now={now} onClose={() => setPipDay(false)} onSelectS={s => { setSelS(s); setPipDay(false); }}/> : null}

      <style>{`
        * { box-sizing: border-box; }
        select option { background: #142420; color: #E8F0EE; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-thumb { background: #2D5A4F; border-radius: 4px; }
        @keyframes pipPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.7;transform:scale(0.92)} }
        @keyframes pipRing { 0%,100%{opacity:0.6;transform:translate(-50%,-50%) scale(1)} 50%{opacity:0.2;transform:translate(-50%,-50%) scale(1.15)} }
      `}</style>
    </div>
  );
}

// File: src/app/(main)/page.tsx
'use client';
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapIcon, PlusIcon } from "lucide-react";

const AREAS = [
  { id: "ima1", name: "IMA Floor 1", status: "green" },
  { id: "ima2", name: "IMA Floor 2", status: "yellow" },
  { id: "fieldA", name: "Rainier Vista Field A", status: "red" },
];

const areaStatusColors = {
  green: "#6FCF97",
  yellow: "#F2C94C",
  red: "#EB5757",
};

export default function PulsePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [reportChoice, setReportChoice] = useState<"green"|"yellow"|"red"|null>(null);

  return (
    <div className="relative min-h-screen bg-[#f7f8fb] overflow-x-hidden pb-24">
      <div className="px-4 py-8">
        <h1 className="text-2xl font-semibold text-[#4B2E83] mb-2">Pulse</h1>
        <p className="mb-6 text-gray-500 text-sm">Real-time activity at UW facilities</p>
        
        {/* SVG Gym Map */}
        <div className="rounded-2xl bg-white/60 backdrop-blur-md shadow-xl p-4 mb-6">
          <svg
            viewBox="0 0 340 160"
            width="100%"
            height="120"
            className="mx-auto"
            style={{ display: 'block' }}
          >
            <g>
              {/* IMA Floor 1 */}
              <motion.rect
                x="15" y="30" width="120" height="40" rx="9"
                fill={areaStatusColors[AREAS[0].status]}
                stroke="#4B2E83" strokeWidth="2"
                initial={{ opacity: 0.7, scale: 1 }}
                animate={{
                  opacity: 1,
                  scale: [1, 1.03, 1],
                  boxShadow: "0 0 32px #4b2e833a"
                }}
                transition={{
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 2,
                  delay: 0
                }}
              />
              <text
                x="75"
                y="54"
                textAnchor="middle"
                fill="#4B2E83"
                fontSize="14"
                fontWeight="bold"
              >
                IMA Floor 1
              </text>
              {/* IMA Floor 2 */}
              <motion.rect
                x="185" y="30" width="120" height="40" rx="9"
                fill={areaStatusColors[AREAS[1].status]}
                stroke="#4B2E83" strokeWidth="2"
                initial={{ opacity: 0.7, scale: 1 }}
                animate={{
                  opacity: 1,
                  scale: [1, 1.03, 1],
                  boxShadow: "0 0 32px #4b2e833a"
                }}
                transition={{
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 2.5,
                  delay: 0.5
                }}
              />
              <text
                x="245"
                y="54"
                textAnchor="middle"
                fill="#4B2E83"
                fontSize="14"
                fontWeight="bold"
              >
                IMA Floor 2
              </text>
              {/* Field A */}
              <motion.rect
                x="90" y="100" width="160" height="38" rx="13"
                fill={areaStatusColors[AREAS[2].status]}
                stroke="#4B2E83" strokeWidth="2"
                initial={{ opacity: 0.7, scale: 1 }}
                animate={{
                  opacity: 1,
                  scale: [1, 1.04, 1],
                  boxShadow: "0 0 32px #4b2e833a"
                }}
                transition={{
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 3,
                  delay: 0.8
                }}
              />
              <text
                x="170"
                y="124"
                textAnchor="middle"
                fill="#4B2E83"
                fontSize="14"
                fontWeight="bold"
              >
                Field A
              </text>
            </g>
          </svg>
          {/* Crowd level legend */}
          <div className="flex justify-center gap-5 mt-4 text-xs">
            <div className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full mr-1" style={{background:areaStatusColors.green}} /> Quiet</div>
            <div className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full mr-1" style={{background:areaStatusColors.yellow}} /> Active</div>
            <div className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-full mr-1" style={{background:areaStatusColors.red}} /> Full</div>
          </div>
        </div>
      </div>
      {/* Floating Action Button */}
      <button
        className="fixed bottom-24 right-5 z-30 bg-[#4B2E83] shadow-xl text-white rounded-full flex items-center gap-2 px-5 py-3 font-semibold text-lg transition-transform active:scale-95"
        style={{
          backdropFilter: "blur(8px)",
          boxShadow: "0 4px 32px #4b2e8333"
        }}
        onClick={()=>setModalOpen(true)}
      >
        <PlusIcon size={25} />
        Check-in
      </button>
      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{opacity: 0}}
            className="fixed inset-0 z-40 flex items-end justify-center bg-black/40"
            onClick={()=>setModalOpen(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 400, damping: 36 }}
              className="w-full max-w-[390px] rounded-t-xl relative mx-auto p-6 bg-white/30 backdrop-blur-[16px] shadow-2xl"
              style={{
                background: "rgba(255,255,255,0.4)",
                border: "1.5px solid #eee",
                boxShadow: "0 8px 40px -8px #4B2E8330,0 2px 16px 0 #4B2E8330,0 0px 0px 1px #fff inset",
              }}
              onClick={e=>e.stopPropagation()}
            >
              <div className="text-center mb-4 text-sm font-semibold text-[#4B2E83]">Report Crowd Level</div>
              <div className="flex justify-around my-6 gap-2">
                <button
                  className={`flex-1 mx-1 py-4 rounded-lg border-2 border-[#6FCF97] bg-white/70
                    ${reportChoice === "green" ? "ring-2 ring-[#4B2E83]" : ""}
                  `}
                  onClick={()=>setReportChoice("green")}
                >
                  <span role="img" aria-label="Quiet" className="block text-2xl mb-2">🟢</span>
                  It's quiet
                </button>
                <button
                  className={`flex-1 mx-1 py-4 rounded-lg border-2 border-[#F2C94C] bg-white/70
                    ${reportChoice === "yellow" ? "ring-2 ring-[#4B2E83]" : ""}
                  `}
                  onClick={()=>setReportChoice("yellow")}
                >
                  <span role="img" aria-label="Active" className="block text-2xl mb-2">🟡</span>
                  It's busy
                </button>
                <button
                  className={`flex-1 mx-1 py-4 rounded-lg border-2 border-[#EB5757] bg-white/70
                    ${reportChoice === "red" ? "ring-2 ring-[#4B2E83]" : ""}
                  `}
                  onClick={()=>setReportChoice("red")}
                >
                  <span role="img" aria-label="Full" className="block text-2xl mb-2">🔴</span>
                  It's full
                </button>
              </div>
              <button
                className={`w-full py-2 mt-2 rounded-lg font-bold text-white transition ${reportChoice? "bg-[#4B2E83]" : "bg-gray-300"}`}
                disabled={!reportChoice}
                onClick={()=>{
                  setModalOpen(false);
                  setReportChoice(null);
                  // Simulate report submission
                }}
              >
                Report
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// File: src/app/(main)/matches/page.tsx
'use client';
import React, { useState } from "react";
import {
  BasketballIcon,
  BadmintonIcon,
  CalendarClockIcon,
  User2Icon,
  MapPinIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const sportsList = [
  { id: "basketball", label: "Basketball", icon: <BasketballIcon /> },
  { id: "badminton", label: "Badminton", icon: <BadmintonIcon /> }
];
const skillLevels = [
  "Beginner", "Intermediate", "Advanced", "National Level"
];
const times = [
  { text: "Now", value: "now" },
  { text: "Today", value: "today" },
  { text: "Weekend", value: "weekend" }
];

const matchCards = [
  {
    id: 1,
    title: "Basketball | Co-ed Pickup",
    sport: "basketball",
    skill: "Intermediate",
    needed: 3,
    location: "IMA Field A",
    icon: <BasketballIcon />,
    datetime: "Today, 4:00 PM",
    state: "idle"
  },
  {
    id: 2,
    title: "Badminton Doubles",
    sport: "badminton",
    skill: "Advanced",
    needed: 1,
    location: "IMA Court 2",
    icon: <BadmintonIcon />,
    datetime: "Today, 8:30 PM",
    state: "idle"
  }
];

const activeColor = "#E8D3A2";

export default function MatchesPage() {
  const [filter, setFilter] = useState({
    sport: null as string|null,
    skill: null as string|null,
    time: null as string|null
  });
  const [createOpen, setCreateOpen] = useState(false);
  const [cards, setCards] = useState(matchCards);
  const [pendingId, setPendingId] = useState<number | null>(null);

  // For simplicity, just one new event form state
  const [newEvent, setNewEvent] = useState<any>({
    sport: "",
    time: "",
    needed: "",
    sameSex: false,
    openAll: true
  });

  return (
    <div className="min-h-screen bg-[#f9fafb] pt-2 pb-24 px-2 max-w-lg mx-auto">
      <div className="mb-2 mt-4">
        {/* Filter Tag Row */}
        <div className="flex gap-2 overflow-x-auto custom-scroll p-1">
          {sportsList.map(sport => (
            <button
              key={sport.id}
              onClick={()=>setFilter(f=>({...f, sport: f.sport === sport.id ? null : sport.id}))}
              className={`flex items-center gap-1 px-4 py-2 rounded-full
                ${
                  filter.sport === sport.id
                    ? `bg-[${activeColor}] text-[#4B2E83]`
                    : "bg-white/60 backdrop-blur border border-gray-300 text-gray-700"
                }
                font-medium shadow`}
            >
              {sport.icon}
              {sport.label}
            </button>
          ))}
          {/* Skill Level Filter */}
          <div className="flex items-center gap-1">
            {skillLevels.map(level => (
              <button
                key={level}
                onClick={()=>setFilter(f=>({...f, skill: f.skill === level ? null : level}))}
                className={`px-3 py-2 rounded-full text-xs
                ${
                  filter.skill === level
                    ? `bg-[${activeColor}] text-[#4B2E83]`
                    : "bg-white/60 backdrop-blur border border-gray-300 text-gray-700"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
          {/* Time Filter */}
          {times.map(t => (
            <button
              key={t.value}
              onClick={()=>setFilter(f=>({...f, time: f.time === t.value ? null : t.value}))}
              className={`flex items-center gap-1 px-3 py-2 rounded-full text-xs
                ${
                  filter.time === t.value
                    ? `bg-[${activeColor}] text-[#4B2E83]`
                    : "bg-white/60 backdrop-blur border border-gray-300 text-gray-700"
                }`}
            >
              <CalendarClockIcon size={16}/>
              {t.text}
            </button>
          ))}
        </div>
      </div>
      {/* Cards */}
      <div className="mt-4 space-y-6">
        {cards.map(card => (
          <div key={card.id} className="rounded-xl bg-white/70 backdrop-blur shadow-md px-4 py-5 flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <div className="text-2xl text-[#4B2E83]">{card.icon}</div>
              <div className="font-bold text-[#4B2E83] text-sm">{card.title}</div>
              <div className="ml-auto px-2 py-1 bg-[#F2C94C]/70 rounded-full text-xs text-gray-800">{card.skill}</div>
            </div>
            <div className="flex items-center gap-3 mt-1 text-sm">
              <User2Icon size={16}/><span>{card.needed} needed</span>
              <MapPinIcon size={16}/><span>{card.location}</span>
              <CalendarClockIcon size={16}/><span>{card.datetime}</span>
            </div>
            <div>
              <button
                className={`mt-2 w-full py-2 rounded-xl font-semibold text-sm shadow transition
                  ${pendingId === card.id
                    ? "bg-gray-300 text-gray-700"
                    : "bg-[#4B2E83] text-white hover:bg-[#6B55B9]"}
                `}
                disabled={pendingId === card.id}
                onClick={()=>setPendingId(card.id)}
              >
                {pendingId === card.id ? "Pending" : "Request to Join"}
              </button>
            </div>
          </div>
        ))}
      </div>
      <button
        className="w-full py-3 mt-8 rounded-xl bg-[#E8D3A2] text-[#4B2E83] font-bold text-lg shadow-lg hover:bg-[#f3e3c8]"
        onClick={()=>setCreateOpen(true)}
      >
        Create Event
      </button>
      <AnimatePresence>
      {createOpen && (
        <motion.div
          initial={{opacity:0}}
          animate={{opacity:1}}
          exit={{opacity:0}}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/30"
          onClick={()=>setCreateOpen(false)}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 480, damping: 36 }}
            className="w-full max-w-[390px] rounded-t-xl relative mx-auto p-7 bg-white/80 backdrop-blur-xl border-t border-gray-200"
            onClick={e=>e.stopPropagation()}
          >
            <h2 className="text-[#4B2E83] text-lg font-bold mb-2 text-center">Create New Match</h2>
            <form className="flex flex-col gap-3">
              <div>
                <label className="block text-xs mb-1">Sport</label>
                <select className="w-full rounded border px-2 py-2" value={newEvent.sport} onChange={e=>setNewEvent({...newEvent, sport: e.target.value})}>
                  <option value="">Select sport</option>
                  {sportsList.map(s=><option value={s.id} key={s.id}>{s.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs mb-1">Time</label>
                <input type="datetime-local" className="w-full rounded border px-2 py-2" value={newEvent.time} onChange={e=>setNewEvent({...newEvent, time: e.target.value})}/>
              </div>
              <div>
                <label className="block text-xs mb-1">Players Needed</label>
                <input type="number" min={1} max={10} className="w-full rounded border px-2 py-2" value={newEvent.needed} onChange={e=>setNewEvent({...newEvent, needed: e.target.value})}/>
              </div>
              <div className="flex gap-3 my-2">
                <label className="flex items-center gap-2 text-xs">
                  <input type="checkbox" checked={newEvent.sameSex} onChange={()=>setNewEvent(n=>({...n, sameSex:!n.sameSex}))}/>
                  Same-Sex Only
                </label>
                <label className="flex items-center gap-2 text-xs">
                  <input type="checkbox" checked={newEvent.openAll} onChange={()=>setNewEvent(n=>({...n, openAll:!n.openAll}))}/>
                  Open to All
                </label>
              </div>
              <button
                type="button"
                className="w-full py-2 rounded-xl bg-[#4B2E83] text-white font-bold mt-2"
                onClick={()=>{
                  // Simulate new event
                  setCreateOpen(false);
                }}
              >
                Create
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}

// File: src/app/(main)/inbox/page.tsx
'use client';
import React, { useState } from "react";
import { Tabs } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2Icon, QrCodeIcon } from "lucide-react";

type Notification = {
  id: string;
  type: 'host' | 'participant';
  text: string;
  status?: 'pending' | 'approved';
};

const notifications: Notification[] = [
  {
    id: "1",
    type: "host",
    text: "Kexuan requested to join your match",
    status: "pending"
  },
  {
    id: "2",
    type: "participant",
    text: "Approved!"
  }
];

const upcomingMatches = [
  {
    id: "100",
    for: "host",
    title: "Basketball | Pickup",
    location: "IMA Field A",
    time: "Today, 4:00 PM",
    soon: true // within 2 hours
  },
  {
    id: "101",
    for: "participant",
    title: "Badminton Doubles",
    location: "IMA Court 3",
    time: "Today, 8:15 PM",
    soon: false
  }
];

export default function InboxPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [showQR, setShowQR] = useState(false);
  const [showScan, setShowScan] = useState(false);

  return (
    <div className="max-w-lg mx-auto pt-6 pb-28 px-4 bg-[#f9fafc] min-h-screen">
      <Tabs selectedIndex={activeTab} onChange={setActiveTab}>
        <div className="flex gap-2 mb-6">
          <Tabs.List className="flex w-full bg-white/70 shadow rounded-xl">
            <Tabs.Tab className={({ selected }) =>
                `flex-1 p-2 rounded-xl font-semibold text-sm 
                ${selected ? 'bg-[#4B2E83] text-white' : 'text-[#4B2E83]'}
                transition`
              }>
              Pending Requests
            </Tabs.Tab>
            <Tabs.Tab className={({ selected }) =>
                `flex-1 p-2 rounded-xl font-semibold text-sm 
                ${selected ? 'bg-[#4B2E83] text-white' : 'text-[#4B2E83]'}
                transition`
              }>
              Upcoming Matches
            </Tabs.Tab>
          </Tabs.List>
        </div>

        <Tabs.Panels>
          <Tabs.Panel>
            <div className="space-y-4">
              {notifications.filter(n => n.type === "host").map(n => (
                <div key={n.id} className="bg-white/80 rounded-xl p-4 shadow flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-[#4B2E83]">{n.text}</div>
                  </div>
                  {n.status === "pending" ? (
                    <div className="flex gap-1">
                      <button className="px-3 py-1 rounded bg-[#6FCF97] text-white font-bold shadow active:scale-95">Approve</button>
                      <button className="px-3 py-1 rounded bg-[#EB5757] text-white font-bold shadow active:scale-95">Decline</button>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </Tabs.Panel>
          <Tabs.Panel>
            <div className="space-y-6">
              {upcomingMatches.map(match => (
                <div key={match.id} className="bg-white/80 rounded-xl shadow px-4 py-4 flex flex-col gap-2 relative">
                  <div className="font-bold text-[#4B2E83] text-sm">{match.title}</div>
                  <div className="flex items-center gap-2 text-xs text-gray-700 mb-1">
                    <span>{match.location}</span>
                    <span>{match.time}</span>
                  </div>
                  {match.soon && (
                    <span className="absolute right-3 top-2 px-2 py-1 bg-[#F2C94C] text-xs font-bold rounded">
                      Last chance to cancel without penalty
                    </span>
                  )}
                  <button
                    className="mt-2 w-full py-2 rounded-xl font-semibold text-sm shadow bg-[#4B2E83] text-white flex items-center justify-center gap-2 transition active:scale-95"
                    onClick={() => {
                      if (match.for === "host") setShowQR(true);
                      else setShowScan(true);
                    }}
                  >
                    {match.for === "host"
                      ? (<><QrCodeIcon size={20}/> QR Code for Check-in</>)
                      : (<><CheckCircle2Icon size={20}/> Scan to Confirm</>)}
                  </button>
                </div>
              ))}
            </div>
          </Tabs.Panel>
        </Tabs.Panels>
      </Tabs>
      {/* Modals */}
      <AnimatePresence>
        {showQR && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center" onClick={()=>setShowQR(false)}>
            <motion.div
              initial={{scale:0.7}} animate={{scale:1}} exit={{scale:0.7}}
              className="bg-white/90 rounded-2xl p-6 shadow-xl" onClick={e=>e.stopPropagation()}
            >
              <div className="text-center text-lg font-bold mb-2 text-[#4B2E83]">Match Check-in QR</div>
              <div className="bg-[#E8D3A2] p-6 rounded-xl mx-auto flex w-full justify-center items-center">
                {/* Place QR code mockup (use SVG) */}
                <svg width="120" height="120"><rect width="120" height="120" rx="16" fill="#fff"/><text x="60" y="65" fontSize="20" textAnchor="middle" fill="#4B2E83">QR</text></svg>
              </div>
              <button className="w-full mt-5 rounded-lg py-2 bg-[#4B2E83] text-white font-bold" onClick={()=>setShowQR(false)}>
                Done
              </button>
            </motion.div>
          </motion.div>
        )}
        {showScan && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center" onClick={()=>setShowScan(false)}>
            <motion.div
              initial={{y: 128}} animate={{y:0}} exit={{y:128}}
              className="bg-white/90 rounded-2xl p-6 shadow-xl flex flex-col" onClick={e=>e.stopPropagation()}
            >
              <div className="text-center text-lg font-bold mb-2 text-[#4B2E83]">Scan Host QR to Check-in</div>
              <div className="w-[180px] h-[180px] bg-black/10 rounded-xl mx-auto mb-8 flex items-center justify-center">
                {/* Simulate camera with icon */}
                <svg height="80" width="80"><circle cx="40" cy="40" r="38" fill="#E8D3A2"/><text x="40" y="50" fontSize="18" textAnchor="middle" fill="#4B2E83">CAM</text></svg>
              </div>
              <button className="w-full mt-1 rounded-lg py-2 bg-[#4B2E83] text-white font-bold" onClick={()=>setShowScan(false)}>
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Participant notifications */}
      <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50">
        <AnimatePresence>
          {notifications.filter(n=>n.type === "participant").map(n => (
            <motion.div
              key={n.id}
              initial={{y:40, opacity:0}}
              animate={{y:0, opacity:1}}
              exit={{y:40, opacity:0}}
              className="rounded-full px-6 py-2 bg-[#6FCF97] shadow text-white text-base font-bold"
            >
              {n.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

// File: src/app/(main)/profile/page.tsx
'use client';
import React from "react";
import { UserCircleIcon, CheckCircle2Icon, MedalIcon, ArrowDownLeftIcon, ArrowUpRightIcon } from "lucide-react";

function ReliabilityGauge({ score }: { score: number }) {
  // SVG semi-circle gauge
  const max = 100;
  const val = Math.max(0, Math.min(score, 100));
  const pct = val / max;
  const R = 60;
  const C = 2 * Math.PI * R;
  const arc = C / 2;
  const offset = arc * (1-pct);

  let color = "#4B2E83";
  if (score<90 && score>=70) color="#E8D3A2";
  if (score<70) color="#EB5757";

  return (
    <svg width="140" height="76" viewBox="0 0 140 76">
      <path
        d="M20,70a60,60,0,0,1,100,0"
        fill="none"
        stroke="#e4e1ec"
        strokeWidth="11"
        strokeLinecap="round"
      />
      <path
        d="M20,70a60,60,0,0,1,100,0"
        fill="none"
        stroke={color}
        strokeWidth="11"
        strokeLinecap="round"
        strokeDasharray={arc}
        strokeDashoffset={offset}
      />
      <text x="70" y="52" textAnchor="middle" fontSize="22" fontWeight="bold" fill={color}>{score}</text>
    </svg>
  );
}

const rewards = [
  {
    id: "r1", amount: "+5 Credits", desc: "Scanned Host QR", type: "plus"
  },
  {
    id: "r2", amount: "+2 Credits", desc: "Reported Heat Map Data", type: "plus"
  },
  {
    id: "r3", amount: "-10 Credits", desc: "No-Show Penalty", type: "minus"
  }
];

export default function ProfilePage() {
  const score = 100;

  return (
    <div className="bg-[#f9fafc] min-h-screen max-w-lg mx-auto pt-10 px-4 pb-24">
      {/* Profile Header */}
      <div className="flex flex-col items-center mb-6">
        <UserCircleIcon size={88} className="text-[#4B2E83]" />
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xl font-semibold text-[#4B2E83]">Kexuan Z.</span>
          <span className="inline-flex items-center gap-1 bg-[#6FCF97] text-white text-xs rounded px-2 py-1 font-bold ml-1">
            <CheckCircle2Icon size={16}/> Verified Husky
          </span>
        </div>
        <div className="flex gap-2 mt-2">
          <span className="px-2 py-1 rounded-xl bg-[#E8D3A2]/70 text-[#4B2E83] text-xs font-medium shadow">Badminton</span>
          <span className="px-2 py-1 rounded-xl bg-[#E8D3A2]/70 text-[#4B2E83] text-xs font-medium shadow">Basketball</span>
        </div>
      </div>
      {/* Reliability Score */}
      <div className="mb-7">
        <div className="bg-white/80 rounded-2xl p-4 flex flex-col items-center shadow-lg relative">
          <div className="font-bold text-[#4B2E83] mb-1">Reliability Score</div>
          <ReliabilityGauge score={score} />
          <div className="text-xs mt-1 text-[#4B2E83]">Score drops for No-Shows</div>
        </div>
      </div>
      {/* Husky Credits */}
      <div>
        <div className="bg-white/80 rounded-2xl p-4 shadow-lg mb-4">
          <div className="flex items-center gap-2 mb-1">
            <MedalIcon size={20} className="text-[#E8D3A2]" />
            <span className="font-bold text-[#4B2E83] text-base">Husky Credits</span>
          </div>
          <div className="text-3xl font-extrabold text-[#4B2E83] mb-2">18</div>
          <div className="text-xs text-[#4B2E83] mb-2 font-medium">Rewarded for active participation</div>
          <div className="border-t pt-2 mt-1">
            <ul className="space-y-2">
              {rewards.map(r => (
                <li key={r.id} className="flex items-center gap-2">
                  {r.type === "plus"
                    ? <ArrowUpRightIcon size={16} className="text-[#6FCF97]"/>
                    : <ArrowDownLeftIcon size={16} className="text-[#EB5757]"/>
                  }
                  <span className={`font-bold ${r.type==="plus"?"text-[#6FCF97]":"text-[#EB5757]"}`}>{r.amount}</span>
                  <span className="text-sm text-[#4B2E83]">{r.desc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// File: src/app/(auth)/login/page.tsx
'use client';
import React from "react";
import { LockIcon, UserCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#4B2E83]/95 via-[#E8D3A2] to-white flex flex-col items-center justify-center px-4">
      <UserCircleIcon size={90} className="text-[#4B2E83] my-8 drop-shadow" />
      <h1 className="text-2xl font-extrabold text-[#4B2E83] mb-4">UW Sport Pulse</h1>
      <div className="bg-white/30 backdrop-blur-md p-6 rounded-xl shadow-xl max-w-xs w-full flex flex-col items-center">
        <button
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-[#4B2E83] text-white font-bold text-lg shadow active:scale-95"
          onClick={() => router.push("/app/(auth)/onboarding")}
        >
          <LockIcon size={20} />
          Sign in with UW NetID
        </button>
        <p className="mt-3 text-xs text-[#4B2E83]">UW Students Only</p>
      </div>
    </div>
  );
}

// File: src/app/(auth)/onboarding/page.tsx
'use client';
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const SPORTS = [
  "Badminton", "Basketball", "Soccer", "Volleyball", "Tennis", "Table Tennis"
];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [skill, setSkill] = useState(1);
  const [agree, setAgree] = useState(false);
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#4B2E83]/85 via-[#E8D3A2]/10 to-[#fcfafc] flex flex-col items-center justify-center px-4">
      <div className="bg-white/40 backdrop-blur-[14px] rounded-2xl shadow-2xl p-7 w-full max-w-md mt-14 mb-14">
        <div className="mb-6 flex items-center gap-3 justify-center">
          {Array.from({length: 3}).map((_, idx) => (
            <div
              key={idx}
              className={`w-3 h-3 rounded-full mx-1 ${step === idx+1
                ? "bg-[#4B2E83] shadow-lg"
                : "bg-[#E8D3A2]"}`}
            />
          ))}
        </div>
        {step === 1 && (
          <div>
            <h2 className="text-[#4B2E83] text-lg font-bold mb-2">What are your main sports?</h2>
            <div className="grid grid-cols-2 gap-3 mt-4 mb-5">
              {SPORTS.map(s => (
                <button
                  key={s}
                  className={`px-4 py-3 rounded-xl font-semibold text-[#4B2E83] border-2 border-[#4B2E83] bg-white/70 shadow active:scale-95
                    ${selectedSports.includes(s) ? "bg-[#4B2E83] text-white" : ""}
                  `}
                  onClick={() =>
                    setSelectedSports((cur) =>
                      cur.includes(s)
                        ? cur.filter(x => x !== s)
                        : [...cur, s]
                    )
                  }
                >{s}</button>
              ))}
            </div>
            <button
              className={`w-full py-2 rounded-lg mt-3 font-bold ${
                selectedSports.length
                  ? "bg-[#4B2E83] text-white"
                  : "bg-gray-300 text-gray-400"
              }`}
              disabled={selectedSports.length === 0}
              onClick={()=>setStep(2)}
            >Continue</button>
          </div>
        )}
        {step === 2 && (
          <div>
            <h2 className="text-[#4B2E83] text-lg font-bold mb-4">Declare your skill level</h2>
            <div className="relative h-16 flex items-center justify-center mt-7 mb-2">
              {/* Gradient Slider Track */}
              <input
                type="range"
                min={1}
                max={4}
                value={skill}
                onChange={e=>setSkill(Number(e.target.value))}
                className="w-full accent-[#4B2E83] h-2"
                style={{
                  background: "linear-gradient(90deg, #F2C94C, #4B2E83 65%)",
                  height: "8px",
                  borderRadius: "10px"
                }}
              />
              <span
                className="absolute left-0 text-xs -top-7 text-[#F2C94C]">Beginner</span>
              <span
                className="absolute right-0 text-xs -top-7 text-[#4B2E83]">National Level</span>
            </div>
            <div className="my-5 text-center text-[#4B2E83] text-lg font-semibold">
              {["Beginner", "Intermediate", "Advanced", "National Level"][skill - 1]}
            </div>
            <button
              className="w-full py-2 mt-2 rounded-lg font-bold bg-[#4B2E83] text-white"
              onClick={()=>setStep(3)}
            >Continue</button>
          </div>
        )}
        {step === 3 && (
          <div>
            <h2 className="text-[#4B2E83] text-lg font-bold mb-4">Terms of Service</h2>
            <div className="glass-card p-4 rounded-xl shadow mb-3 bg-white/60 border-l-4 border-[#4B2E83]">
              <div className="text-[#4B2E83] font-semibold mb-1">No-show Credit Penalty</div>
              <div className="text-xs text-gray-700">
                If you sign up for an event and do not check-in, your Reliability Score and Husky Credits will decrease.
              </div>
            </div>
            <label className="flex items-center gap-2 mt-4 font-semibold text-[#4B2E83] text-sm">
              <input type="checkbox" checked={agree} onChange={()=>setAgree(a=>!a)} />
              I agree to the above policy.
            </label>
            <button
              className={`w-full py-2 rounded-lg mt-5 font-bold ${agree ? "bg-[#4B2E83] text-white" : "bg-gray-300 text-gray-400"}`}
              disabled={!agree}
              onClick={()=>router.replace("/app/(main)")}
            >Get Started</button>
          </div>
        )}
      </div>
    </div>
  );
}

// File: src/app/(main)/index.tsx
export { default } from "./page";

// File: src/app/(main)/matches/index.tsx
export { default } from "./page";

// File: src/app/(main)/inbox/index.tsx
export { default } from "./page";

// File: src/app/(main)/profile/index.tsx
export { default } from "./page";

// File: src/app/(auth)/login/index.tsx
export { default } from "./page";

// File: src/app/(auth)/onboarding/index.tsx
export { default } from "./page";

// File: src/components/Navigation/BottomNavBar.tsx
'use client';
import React from 'react';
import { usePathname, useRouter } from "next/navigation";
import {
  FlameIcon,
  UsersIcon,
  MailIcon,
  UserCircle2Icon
} from "lucide-react";

const navItems = [
  {
    label: "Pulse",
    href: "/app/(main)",
    icon: FlameIcon
  },
  {
    label: "Matches",
    href: "/app/(main)/matches",
    icon: UsersIcon
  },
  {
    label: "Inbox",
    href: "/app/(main)/inbox",
    icon: MailIcon
  },
  {
    label: "Profile",
    href: "/app/(main)/profile",
    icon: UserCircle2Icon
  }
];

export default function BottomNavBar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 flex justify-around items-center h-[66px] px-2"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        boxShadow: "0 -2px 12px 2px #4b2e8340"
      }}
    >
      {navItems.map(({label, icon: Icon, href}) => {
        const active = pathname === href;
        return (
          <button
            key={href}
            onClick={()=>router.push(href)}
            aria-label={label}
            className="flex flex-col items-center flex-1 focus:outline-none"
          >
            <Icon
              size={27}
              strokeWidth={2.3}
              color={active ? "#4B2E83" : "#9c8bb1"}
              className={`mx-auto transition-all ${active ? "scale-110" : ""}`}
              style={{
                background: active ? "rgba(75,46,131,0.03)" : undefined,
                borderRadius: "9999px",
                boxShadow: active ? `0 2px 10px 0 #4B2E8388` : undefined,
                fill: active ? "#4B2E83" : "none"
              }}
            />
            <span
              className={`text-xs mt-1 font-semibold ${active ? "text-[#4B2E83]" : "text-[#9c8bb1]"}`}
            >
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

// Directory structure (to establish context):
// src/
//   app/
//     (main)/
//       page.tsx        <-- Pulse landing page
//       matches/
//         page.tsx
//       inbox/
//         page.tsx
//       profile/
//         page.tsx
//     (auth)/
//       login/
//         page.tsx
//       onboarding/
//         page.tsx
//   components/
//     Navigation/
//       BottomNavBar.tsx

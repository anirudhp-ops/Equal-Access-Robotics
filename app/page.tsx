"use client";

import { useMemo, useState } from "react";

type Session = { id: number; day: string; date: string; time: string; title: string; tutor: string; students: number; level: string; color: string };

const sessions: Session[] = [
  { id: 1, day: "MON", date: "14", time: "4:00 PM", title: "Python Pioneers", tutor: "Maya Chen", students: 8, level: "Ages 11–14", color: "orange" },
  { id: 2, day: "TUE", date: "15", time: "5:30 PM", title: "Web Builders", tutor: "David Okafor", students: 6, level: "Ages 13–16", color: "blue" },
  { id: 3, day: "WED", date: "16", time: "4:00 PM", title: "Robotics Lab", tutor: "Sofia Martinez", students: 10, level: "Ages 9–12", color: "green" },
  { id: 4, day: "THU", date: "17", time: "6:00 PM", title: "Scratch Creators", tutor: "Leo Williams", students: 7, level: "Ages 8–11", color: "purple" },
];

const students = [
  ["AK", "Amara K.", "Python Pioneers", "12", "92%", "Nairobi, Kenya"],
  ["JM", "Javier M.", "Web Builders", "14", "88%", "Lima, Peru"],
  ["NP", "Nia P.", "Robotics Lab", "10", "96%", "Atlanta, USA"],
  ["RS", "Rohan S.", "Scratch Creators", "9", "90%", "Mumbai, India"],
];

export default function Home() {
  const [view, setView] = useState<"dashboard" | "schedule" | "students" | "programs">("dashboard");
  const [notice, setNotice] = useState("");
  const [modal, setModal] = useState(false);
  const title = useMemo(() => ({ dashboard: "Good morning, Anirudh", schedule: "Program schedule", students: "Student community", programs: "Programs & curriculum" })[view], [view]);

  function toast(message: string) { setNotice(message); window.setTimeout(() => setNotice(""), 2800); }

  return (
    <main>
      {notice && <div className="toast" role="status">✓ {notice}</div>}
      <header className="topbar">
        <button className="brand" onClick={() => setView("dashboard")}><span className="brandmark">E</span><span>Equal Access<br/><b>Robotics</b></span></button>
        <nav aria-label="Main navigation">
          {(["dashboard", "schedule", "students", "programs"] as const).map(item => <button key={item} className={view === item ? "active" : ""} onClick={() => setView(item)}>{item}</button>)}
        </nav>
        <div className="headerActions"><button className="iconBtn" aria-label="Notifications">●</button><span className="avatar">AP</span><span className="profile">Anirudh P.<small>Administrator</small></span></div>
      </header>

      {view === "dashboard" && <>
        <section className="hero">
          <div className="heroCopy"><span className="eyebrow">BUILDING FUTURES SINCE 2020</span><h1>Code is a language.<br/><em>Everyone deserves to speak it.</em></h1><p>Equal Access Robotics connects passionate tutors with young creators—turning curiosity into confidence, one line of code at a time.</p><div className="heroButtons"><button className="primary" onClick={() => setView("schedule")}>Manage classes →</button><button className="textBtn" onClick={() => setView("programs")}>Explore our impact</button></div></div>
          <div className="heroArt" aria-label="Abstract illustration of children learning robotics"><div className="sun"/><div className="codeCard">&lt; hello<br/><b>&nbsp; future /&gt;</b></div><div className="robot"><i/><span>•‿•</span></div><div className="kid one">✦</div><div className="kid two">⌁</div></div>
        </section>

        <section className="impactStrip">
          <div><strong>1,000+</strong><span>young creators</span></div><div><strong>40</strong><span>volunteer tutors</span></div><div><strong>16</strong><span>countries reached</span></div><div><strong>6</strong><span>years of impact</span></div><p>Every number is a story<br/><b>still being written.</b></p>
        </section>
      </>}

      <section className="workspace">
        <div className="pageHeading"><div><span className="eyebrow">EAR OPERATIONS</span><h2>{title}{view === "dashboard" && <span className="wave">✦</span>}</h2><p>{view === "dashboard" ? "Here’s what’s happening across your programs this week." : view === "schedule" ? "Coordinate every class across time zones in one place." : view === "students" ? "Track participation, progress, and the learners behind the numbers." : "Learning paths designed to help every student build something real."}</p></div><button className="primary compact" onClick={() => setModal(true)}>+ Schedule a class</button></div>

        {(view === "dashboard" || view === "schedule") && <>
          <div className="statsGrid">
            <article><span className="statIcon purple">◷</span><small>SESSIONS THIS WEEK</small><strong>24</strong><p><b>↑ 12%</b> from last week</p></article>
            <article><span className="statIcon orange">♧</span><small>ACTIVE STUDENTS</small><strong>186</strong><p><b>+18</b> this month</p></article>
            <article><span className="statIcon green">✓</span><small>ATTENDANCE RATE</small><strong>91%</strong><p><b>↑ 3%</b> from last month</p></article>
            <article><span className="statIcon blue">◎</span><small>TUTOR HOURS</small><strong>142</strong><p><b>38 tutors</b> active</p></article>
          </div>
          <div className="contentGrid">
            <article className="panel sessions"><div className="panelHead"><div><h3>Upcoming sessions</h3><p>July 14–20, 2026</p></div><button onClick={() => setView("schedule")}>View full calendar →</button></div>
              {sessions.map(s => <div className="session" key={s.id}><div className="date"><small>{s.day}</small><b>{s.date}</b></div><span className={`line ${s.color}`}/><div className="sessionInfo"><b>{s.title}</b><span>{s.time} · {s.level}</span></div><div className="tutor"><span>{s.tutor.split(" ").map(x=>x[0]).join("")}</span>{s.tutor}</div><span className="seats">{s.students} students</span><button className="more" aria-label={`Options for ${s.title}`} onClick={() => toast(`${s.title} selected`)}>•••</button></div>)}
            </article>
            <aside className="panel attention"><div className="panelHead"><div><h3>Needs attention</h3><p>3 items to review</p></div><span className="badge">3</span></div>
              <button onClick={() => toast("Opening tutor matching queue")}><i className="warn">!</i><span><b>2 classes need tutors</b><small>Starting within 7 days</small></span><em>→</em></button>
              <button onClick={() => toast("Attendance reminders queued")}><i className="info">◷</i><span><b>8 attendance records</b><small>Waiting to be completed</small></span><em>→</em></button>
              <button onClick={() => toast("Application review opened")}><i className="new">✦</i><span><b>5 new applications</b><small>Student forms to review</small></span><em>→</em></button>
              <div className="quote">“The best way to predict the future is to invent it.”<small>— Alan Kay</small></div>
            </aside>
          </div>
        </>}

        {view === "students" && <article className="panel tablePanel"><div className="panelHead"><div><h3>Active learners</h3><p>186 enrolled across 16 countries</p></div><button onClick={() => toast("Student report prepared")}>Export report</button></div><div className="studentTable"><div className="tableRow tableHeader"><span>Student</span><span>Program</span><span>Age</span><span>Attendance</span><span>Location</span></div>{students.map(s=><div className="tableRow" key={s[1]}><span><i className="studentAvatar">{s[0]}</i><b>{s[1]}</b></span><span>{s[2]}</span><span>{s[3]}</span><span><b className="good">{s[4]}</b></span><span>{s[5]}</span></div>)}</div></article>}

        {view === "programs" && <div className="programGrid">{[
          ["01", "Code Explorers", "Scratch · Ages 8–11", "Build stories, games, and confidence through visual coding."],
          ["02", "Python Pioneers", "Python · Ages 11–14", "Turn ideas into working programs while learning core computer science."],
          ["03", "Web Builders", "HTML, CSS & JS · Ages 13–16", "Design and publish accessible websites for causes students care about."],
          ["04", "Robotics Lab", "Hardware · Ages 9–14", "Bring code into the real world with sensors, motors, and team challenges."],
        ].map(p=><article className="programCard" key={p[0]}><span>{p[0]}</span><h3>{p[1]}</h3><small>{p[2]}</small><p>{p[3]}</p><button onClick={() => toast(`${p[1]} curriculum opened`)}>View curriculum →</button></article>)}</div>}
      </section>

      <section className="mission"><span className="eyebrow">OUR PROMISE</span><h2>Talent is everywhere.<br/><em>Opportunity should be too.</em></h2><p>From online tutoring to in-person robotics labs, we remove the barriers between young people and the technology shaping their world.</p><div><button className="primary" onClick={() => toast("Volunteer interest form opened")}>Become a tutor →</button><button className="lightBtn" onClick={() => toast("Donation flow opened")}>Support the mission</button></div></section>

      <footer><div className="brand"><span className="brandmark">E</span><span>Equal Access<br/><b>Robotics</b></span></div><p>Teaching the next generation to build the future.</p><small>© 2026 Equal Access Robotics · Registered nonprofit</small></footer>

      {modal && <div className="modalBack" role="presentation" onMouseDown={() => setModal(false)}><form className="modal" onMouseDown={e=>e.stopPropagation()} onSubmit={e=>{e.preventDefault();setModal(false);toast("Class added to the schedule")}}><button type="button" className="close" onClick={()=>setModal(false)}>×</button><span className="eyebrow">NEW SESSION</span><h2>Schedule a class</h2><label>Class name<input required placeholder="e.g. Python Pioneers"/></label><div className="formRow"><label>Date<input required type="date"/></label><label>Time<input required type="time"/></label></div><label>Assign a tutor<select defaultValue=""><option value="" disabled>Select an available tutor</option><option>Maya Chen</option><option>David Okafor</option><option>Sofia Martinez</option></select></label><button className="primary" type="submit">Create session</button></form></div>}
    </main>
  );
}

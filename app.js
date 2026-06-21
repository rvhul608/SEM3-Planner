// ============================================================
// APP LOGIC — Rvhul's Sem 3 Almanac
// ============================================================

(function () {
  "use strict";

  const today = TODAY_OVERRIDE || new Date();
  const todayStr = fmtISO(today);

  function fmtISO(d) {
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function parseISO(s) {
    const [y, m, d] = s.split("-").map(Number);
    return new Date(y, m - 1, d);
  }
  function daysBetween(a, b) {
    const MS = 86400000;
    return Math.round((parseISO(b) - parseISO(a)) / MS);
  }
  function fmtNice(s) {
    const d = parseISO(s);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  }
  function fmtShort(s) {
    const d = parseISO(s);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  }

  // ============================================================
  // THEME
  // ============================================================
  function initTheme() {
    const saved = localStorage.getItem("almanac-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = saved || (prefersDark ? "dark" : "light");
    applyTheme(theme);
    document.getElementById("themeToggle").addEventListener("click", () => {
      const cur = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
      const next = cur === "dark" ? "light" : "dark";
      applyTheme(next);
      localStorage.setItem("almanac-theme", next);
    });
  }
  function applyTheme(theme) {
    if (theme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
      document.getElementById("sunIcon").style.display = "none";
      document.getElementById("moonIcon").style.display = "block";
    } else {
      document.documentElement.removeAttribute("data-theme");
      document.getElementById("sunIcon").style.display = "block";
      document.getElementById("moonIcon").style.display = "none";
    }
  }

  // ============================================================
  // TABS
  // ============================================================
  function initTabs() {
    document.querySelectorAll(".tab").forEach(tab => {
      tab.addEventListener("click", () => {
        document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
        document.querySelectorAll(".panel").forEach(p => p.classList.remove("active"));
        tab.classList.add("active");
        document.getElementById("panel-" + tab.dataset.tab).classList.add("active");
        window.scrollTo({ top: 0, behavior: "instant" });
      });
    });
  }

  // ============================================================
  // TODAY PILL
  // ============================================================
  function renderTodayPill() {
    document.getElementById("todayPill").textContent = today.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
  }

  // ============================================================
  // CURRENT PHASE LOOKUP
  // ============================================================
  function getCurrentPhase() {
    for (const ph of PHASES) {
      if (todayStr >= ph.start && todayStr <= ph.end) return ph;
    }
    if (todayStr < PHASES[0].start) return null;
    return PHASES[PHASES.length - 1];
  }

  // ============================================================
  // TODAY VIEW
  // ============================================================
  function renderHero() {
    const phase = getCurrentPhase();
    const hero = document.getElementById("heroStrip");
    let headline, sub, badge;

    if (!phase) {
      headline = "Semester hasn't started yet";
      sub = "Classes begin 22 June 2026.";
      badge = "Pre-semester";
    } else {
      headline = phase.title;
      sub = phase.desc;
      badge = "Phase " + phase.id + " of 7 · " + phase.range;
    }

    hero.innerHTML = `
      <div class="hero-date">${today.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</div>
      <div class="hero-headline">${headline}</div>
      <div class="hero-sub">${sub}</div>
      <div class="hero-badge">${badge}</div>
    `;
  }

  function renderTodayClasses() {
    const dayKey = DAY_KEYS[today.getDay()];
    const container = document.getElementById("todayClasses");
    const blocks = TIMETABLE[dayKey];

    if (!blocks) {
      container.innerHTML = `<div class="class-empty">No classes today — weekend.</div>`;
      return;
    }

    container.innerHTML = blocks.map(b => {
      const course = COURSES[b.course];
      const period = PERIODS.find(p => p.n === b.p);
      const endPeriod = PERIODS.find(p => p.n === b.p + b.span - 1) || period;
      const timeRange = period.start + "–" + endPeriod.end;
      const dotColor = course.color === "free" ? "var(--free-border)" : course.color === "lunch" ? "var(--ink-faint)" : `var(--${course.color})`;
      return `
        <div class="class-item">
          <span class="class-time">${timeRange}</span>
          <span class="class-dot" style="background:${dotColor}"></span>
          <span class="class-name">${course.name}</span>
        </div>
      `;
    }).join("");
  }

  function renderUpcoming() {
    const container = document.getElementById("upcomingDeadlines");
    const upcoming = TIMELINE
      .filter(item => item.date >= todayStr)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 6);

    if (upcoming.length === 0) {
      container.innerHTML = `<div class="class-empty">Nothing scheduled ahead.</div>`;
      return;
    }

    container.innerHTML = upcoming.map(item => {
      const days = daysBetween(todayStr, item.date);
      const type = TIMELINE_TYPES[item.type];
      const daysLabel = days === 0 ? "Today" : days === 1 ? "1 day" : days + " days";
      return `
        <div class="upcoming-item">
          <span class="upcoming-days c-${type.color}-bg c-${type.color}-text">${daysLabel}</span>
          <div class="upcoming-body">
            <div class="upcoming-title">${item.title}</div>
            <div class="upcoming-date">${fmtShort(item.date)}${item.end ? " – " + fmtShort(item.end) : ""}</div>
          </div>
        </div>
      `;
    }).join("");
  }

  function renderPhaseStatus() {
    const container = document.getElementById("phaseStatus");
    const currentPhase = getCurrentPhase();
    const currentIdx = currentPhase ? PHASES.findIndex(p => p.id === currentPhase.id) : -1;

    const bar = PHASES.map((ph, i) => {
      let cls = "";
      if (i === currentIdx) cls = "active";
      else if (i < currentIdx) cls = "passed";
      return `<div class="phase-status-seg ${cls}" title="${ph.title}"></div>`;
    }).join("");

    const text = currentPhase
      ? `Currently in <strong>Phase ${currentPhase.id}: ${currentPhase.title}</strong> (${currentPhase.range}). Availability: <strong>${currentPhase.availability}</strong>.`
      : `Semester hasn't begun. Starts 22 June 2026.`;

    container.innerHTML = `
      <div class="phase-status-bar">${bar}</div>
      <div class="phase-status-text">${text}</div>
    `;
  }

  // ============================================================
  // WEEKLY GRID VIEW
  // ============================================================
  function renderLegend() {
    const container = document.getElementById("courseLegend");
    const seen = new Set();
    let html = "";
    Object.entries(COURSES).forEach(([key, c]) => {
      if (key === "FREE" || key === "LUNCH") return;
      if (seen.has(c.color)) return;
      seen.add(c.color);
      html += `<div class="legend-chip c-${c.color}-bg c-${c.color}-text"><span class="legend-dot c-${c.color}-dot"></span>${c.name}</div>`;
    });
    html += `<div class="legend-chip" style="background:var(--free-bg);color:var(--ink-soft)"><span class="legend-dot" style="background:var(--free-border)"></span>Free period</div>`;
    container.innerHTML = html;
  }

  function renderWeekGrid() {
    const container = document.getElementById("weekGrid");
    const dayKeys = ["Mon", "Tue", "Wed", "Thu", "Fri"];
    const todayDayKey = DAY_KEYS[today.getDay()];

    // build occupancy map per day: period number -> block (or null if covered by a span)
    const occupancy = {};
    dayKeys.forEach(day => {
      occupancy[day] = {};
      TIMETABLE[day].forEach(b => {
        for (let i = 0; i < b.span; i++) {
          occupancy[day][b.p + i] = (i === 0) ? b : "covered";
        }
      });
    });

    let html = `<div class="wg-corner"></div>`;
    dayKeys.forEach(day => {
      const isToday = day === todayDayKey;
      html += `<div class="wg-daycol-head ${isToday ? "is-today" : ""}">${day}</div>`;
    });

    PERIODS.forEach(period => {
      html += `<div class="wg-time">${period.start}</div>`;
      dayKeys.forEach(day => {
        const cell = occupancy[day][period.n];
        if (cell === "covered") return; // part of a spanning block already rendered
        if (!cell) {
          html += `<div class="wg-cell is-empty"></div>`;
          return;
        }
        const course = COURSES[cell.course];
        const rowSpan = cell.span;
        let classes = "wg-cell";
        if (cell.course === "FREE") classes += " is-free";
        if (cell.course === "LUNCH") classes += " is-lunch";
        let style = `grid-row: span ${rowSpan};`;
        if (course.color !== "free" && course.color !== "lunch") {
          style += `background:var(--${course.color}-bg);color:var(--${course.color}-text);`;
        }
        html += `
          <div class="${classes}" style="${style}">
            <div class="wg-cell-course">${course.name}</div>
            ${course.code !== "—" ? `<div class="wg-cell-code">${course.code}</div>` : ""}
          </div>
        `;
      });
    });

    container.style.gridTemplateRows = `auto repeat(${PERIODS.length}, minmax(46px, auto))`;
    container.innerHTML = html;
  }

  // ============================================================
  // TIMELINE VIEW
  // ============================================================
  let activeFilters = new Set(Object.keys(TIMELINE_TYPES));
  let searchQuery = "";

  function renderFilterChips() {
    const container = document.getElementById("filterChips");
    container.innerHTML = Object.entries(TIMELINE_TYPES).map(([key, t]) => `
      <button class="filter-chip on" data-filter="${key}">${t.label}</button>
    `).join("");

    container.querySelectorAll(".filter-chip").forEach(chip => {
      chip.addEventListener("click", () => {
        const key = chip.dataset.filter;
        if (activeFilters.has(key)) {
          activeFilters.delete(key);
          chip.classList.remove("on");
        } else {
          activeFilters.add(key);
          chip.classList.add("on");
        }
        renderTimeline();
      });
    });
  }

  function renderTimeline() {
    const container = document.getElementById("timelineList");
    const sorted = [...TIMELINE].sort((a, b) => a.date.localeCompare(b.date));

    container.innerHTML = sorted.map(item => {
      const type = TIMELINE_TYPES[item.type];
      const matchesFilter = activeFilters.has(item.type);
      const matchesSearch = !searchQuery ||
        item.title.toLowerCase().includes(searchQuery) ||
        item.desc.toLowerCase().includes(searchQuery);
      const visible = matchesFilter && matchesSearch;
      const isPast = item.date < todayStr;

      return `
        <div class="tl-item ${visible ? "" : "hidden"}">
          <div class="tl-date">${fmtNice(item.date)}${item.end ? " → " + fmtNice(item.end) : ""}</div>
          <div class="tl-card border-${type.color}" style="opacity:${isPast ? 0.55 : 1}">
            <div class="tl-title">${item.title}</div>
            <div class="tl-desc">${item.desc}</div>
            <div class="tl-tags">
              <span class="tl-tag c-${type.color}-bg c-${type.color}-text">${type.label}</span>
              ${item.tags.map(t => `<span class="tl-tag c-gray-bg c-gray-text">${t}</span>`).join("")}
            </div>
          </div>
        </div>
      `;
    }).join("");
  }

  function initTimelineSearch() {
    document.getElementById("timelineSearch").addEventListener("input", (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      renderTimeline();
    });
  }

  // ============================================================
  // INTERNSHIPS VIEW
  // ============================================================
  function renderInternships() {
    const container = document.getElementById("internshipList");
    container.innerHTML = INTERNSHIPS.map((item, idx) => `
      <div class="rank-card" data-idx="${idx}">
        <div class="rank-card-head">
          <div class="rank-number c-${item.color}-bg c-${item.color}-text">#${item.rank}</div>
          <div class="rank-title-block">
            <div class="rank-name">${item.name}</div>
            <div class="rank-type">${item.type}</div>
          </div>
          <svg class="rank-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
        </div>
        <div class="rank-meta-grid">
          <div class="rank-meta-item"><div class="rank-meta-label">Apply</div><div class="rank-meta-val">${item.apply}</div></div>
          <div class="rank-meta-item"><div class="rank-meta-label">Runs</div><div class="rank-meta-val">${item.runs}</div></div>
          <div class="rank-meta-item"><div class="rank-meta-label">Stipend</div><div class="rank-meta-val">${item.stipend}</div></div>
          <div class="rank-meta-item"><div class="rank-meta-label">Commitment</div><div class="rank-meta-val">${item.commitment}</div></div>
        </div>
        <div class="prob-track"><div class="prob-fill-bar" style="width:${item.probability}%;background:var(--${item.color})"></div></div>
        <div class="prob-text c-${item.color}-text">Probability: ~${item.probability}%</div>
        <div class="rank-detail">
          <div class="rank-desc-text">${item.desc}</div>
          <div class="rank-badges">
            ${item.badges.map(b => `<span class="rank-badge c-${item.color}-bg c-${item.color}-text">${b}</span>`).join("")}
          </div>
        </div>
      </div>
    `).join("");

    container.querySelectorAll(".rank-card").forEach(card => {
      card.addEventListener("click", () => card.classList.toggle("open"));
    });
  }

  // ============================================================
  // DSA TRACKER VIEW (with localStorage persistence)
  // ============================================================
  function getDsaProgress() {
    try {
      return JSON.parse(localStorage.getItem("almanac-dsa-progress") || "{}");
    } catch (e) { return {}; }
  }
  function setDsaProgress(progress) {
    localStorage.setItem("almanac-dsa-progress", JSON.stringify(progress));
  }

  function renderDsaTracker() {
    const container = document.getElementById("dsaPhaseList");
    const progress = getDsaProgress();

    container.innerHTML = DSA_PHASES.map(phase => `
      <div class="dsa-phase-block">
        <div class="dsa-phase-title">${phase.title}</div>
        ${phase.topics.map(topic => `
          <div class="dsa-topic ${progress[topic.id] ? "done" : ""}" data-id="${topic.id}">
            <div class="dsa-checkbox">
              ${progress[topic.id] ? '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><path d="M5 13l4 4L19 7"/></svg>' : ""}
            </div>
            <div>
              <div class="dsa-topic-name">${topic.name}</div>
              <div class="dsa-topic-desc">${topic.desc}</div>
            </div>
          </div>
        `).join("")}
      </div>
    `).join("");

    container.querySelectorAll(".dsa-topic").forEach(el => {
      el.addEventListener("click", () => {
        const id = el.dataset.id;
        const progress = getDsaProgress();
        progress[id] = !progress[id];
        setDsaProgress(progress);
        renderDsaTracker();
        renderDsaProgressBar();
      });
    });
  }

  function renderDsaProgressBar() {
    const progress = getDsaProgress();
    const allTopics = DSA_PHASES.flatMap(p => p.topics);
    const done = allTopics.filter(t => progress[t.id]).length;
    const total = allTopics.length;
    const pct = total ? Math.round((done / total) * 100) : 0;

    document.getElementById("dsaProgressText").textContent = `${done} of ${total} topics`;
    document.getElementById("dsaProgressPct").textContent = `${pct}%`;
    document.getElementById("dsaProgressFill").style.width = pct + "%";
  }

  // ============================================================
  // PHASES VIEW
  // ============================================================
  function renderPhases() {
    const container = document.getElementById("phasesList");
    const currentPhase = getCurrentPhase();

    const availLabel = {
      high: { text: "High availability", color: "teal" },
      medium: { text: "Medium availability", color: "amber" },
      low: { text: "Low availability", color: "coral" },
      none: { text: "No availability", color: "red" },
    };

    container.innerHTML = PHASES.map(ph => {
      const isCurrent = currentPhase && ph.id === currentPhase.id;
      const a = availLabel[ph.availability];
      return `
        <div class="phase-card ${isCurrent ? "is-current" : ""}">
          <div class="phase-num">${String(ph.id).padStart(2, "0")}</div>
          <div class="phase-body">
            <div class="phase-range">${ph.range}${isCurrent ? " · CURRENT" : ""}</div>
            <div class="phase-title">${ph.title}</div>
            <div class="phase-desc">${ph.desc}</div>
            <span class="avail-badge c-${a.color}-bg c-${a.color}-text">${a.text}</span>
          </div>
        </div>
      `;
    }).join("");
  }

  // ============================================================
  // INIT
  // ============================================================
  function init() {
    initTheme();
    initTabs();
    renderTodayPill();
    renderHero();
    renderTodayClasses();
    renderUpcoming();
    renderPhaseStatus();
    renderLegend();
    renderWeekGrid();
    renderFilterChips();
    renderTimeline();
    initTimelineSearch();
    renderInternships();
    renderDsaTracker();
    renderDsaProgressBar();
    renderPhases();
  }

  document.addEventListener("DOMContentLoaded", init);
})();

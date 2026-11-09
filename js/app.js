/* IITC 高级备考台 · 应用逻辑 */
(function () {
  "use strict";

  /* ---------- 基础工具 ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const store = {
    get(k, d) {
      try {
        const v = localStorage.getItem("iitc." + k);
        return v == null ? d : JSON.parse(v);
      } catch (e) { return d; }
    },
    set(k, v) {
      try { localStorage.setItem("iitc." + k, JSON.stringify(v)); } catch (e) { }
    }
  };

  const CHAPTERS = [].concat(
    (window.KB_CORE || {}).chapters || [],
    (window.KB_TECH || {}).chapters || [],
    (window.KB_OPS || {}).chapters || []
  );
  const CH_MAP = {};
  CHAPTERS.forEach((c, i) => { c._idx = i + 1; CH_MAP[c.id] = c; });

  const QUESTIONS = (window.QUESTIONS || []).map((q) => Object.assign({}, q));
  const Q_MAP = {};
  QUESTIONS.forEach((q) => { Q_MAP[q.id] = q; });

  const EXAM = window.EXAM || { structure: [], tips: [], rules: [], blueprint: [] };
  const PLAN = window.PLAN || { days: [] };
  const FLASH = window.FLASH || [];
  const SUBJECTIVE = window.SUBJECTIVE || [];
  const REPORT = window.REPORT || { topics: [], structure: [], rubric: [], checklist: [] };
  const DEFENSE = window.DEFENSE || [];

  const TYPE_NAME = { single: "单选题", multiple: "多选题", judge: "判断题" };
  const TYPE_PTS = { single: 0.5, multiple: 0.5, judge: 0.5 };

  /* ---------- 图标 ---------- */
  const ICON = {
    home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/>',
    book: '<path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v18H6.5A2.5 2.5 0 0 0 4 22z"/><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.4"/>',
    timer: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 1.5M9 2h6"/>',
    edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
    doc: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/>',
    calendar: '<rect x="3" y="4.5" width="18" height="17" rx="2.5"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4"/>',
    cards: '<rect x="3" y="6" width="13" height="15" rx="2"/><path d="M8 3h11a2 2 0 0 1 2 2v12"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    chevron: '<path d="m6 9 6 6 6-6"/>',
    spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8"/>',
    flag: '<path d="M4 22V3h13l-2.5 5L17 13H4"/>',
    layers: '<path d="m12 2 9 5-9 5-9-5z"/><path d="m3 12 9 5 9-5M3 17l9 5 9-5"/>',
    alert: '<path d="M10.3 3.4 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.4a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
    print: '<path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8" rx="1"/>'
  };
  const icon = (name, size = 18) =>
    '<svg viewBox="0 0 24 24" width="' + size + '" height="' + size + '" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICON[name] || "") + "</svg>";

  /* ---------- 进度存储 ---------- */
  const progress = {
    read: new Set(store.get("read", [])),
    wrong: new Set(store.get("wrong", [])),
    stats: store.get("stats", { attempts: 0, correct: 0, byChapter: {}, mockBest: 0, mockCount: 0 }),
    plan: new Set(store.get("plan", [])),
    lastChapter: store.get("lastChapter", "")
  };
  function saveProgress() {
    store.set("read", Array.from(progress.read));
    store.set("wrong", Array.from(progress.wrong));
    store.set("stats", progress.stats);
    store.set("plan", Array.from(progress.plan));
  }
  function accuracy() {
    const a = progress.stats.attempts;
    return a ? Math.round((progress.stats.correct / a) * 100) : 0;
  }
  function planTotal() {
    return (PLAN.days || []).reduce((n, d) => n + d.tasks.length, 0);
  }

  /* ---------- 通用渲染 ---------- */
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => t.classList.remove("show"), 1800);
  }

  function openModal(html) {
    $("#modalBox").innerHTML = html;
    $("#modalMask").classList.add("show");
  }
  function closeModal() { $("#modalMask").classList.remove("show"); }

  function weightDots(w) {
    let s = '<span class="weight-dots" title="重要度 ' + w + '/5">';
    for (let i = 1; i <= 5; i++) s += '<i class="' + (i <= w ? "on" : "") + '"></i>';
    return s + "</span>";
  }

  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function prepareQuestion(q) {
    const out = Object.assign({}, q, { options: q.options.slice(), answer: q.answer.slice() });
    if (q.type !== "judge") {
      const order = q.options.map((_, i) => i);
      shuffle(order);
      out.options = order.map((i) => q.options[i]);
      out.answer = q.answer.map((a) => order.indexOf(a)).sort((x, y) => x - y);
    }
    return out;
  }

  function sameSet(a, b) {
    if (a.length !== b.length) return false;
    const x = a.slice().sort(), y = b.slice().sort();
    return x.every((v, i) => v === y[i]);
  }

  function examDate() { return store.get("examDate", ""); }
  function daysLeft() {
    const d = examDate();
    if (!d) return null;
    const target = new Date(d + "T09:00:00+08:00").getTime();
    return Math.ceil((target - Date.now()) / 86400000);
  }

  /* ---------- 视图容器 ---------- */
  const view = $("#view");
  let cleanup = function () { };

  function navigate() {
    const hash = location.hash.replace(/^#\/?/, "") || "home";
    const parts = hash.split("/");
    const name = parts[0];
    const arg = parts[1];
    cleanup();
    document.onkeydown = null;
    if (name === "drill") drill = null;
    window.scrollTo(0, 0);
    document.body.classList.remove("nav-open");
    $("#sidebar").classList.remove("open");

    const map = {
      home: [viewHome, "学习概览", "先看清考试，再安排投入"],
      chapters: [viewChapters, "考点精讲", "12 章 · 按重要度排序学习"],
      chapter: [() => viewChapter(arg), "考点精讲", "精读 + 必背 + 易错"],
      drill: [viewDrill, "章节刷题", "120 道客观题 · 即时解析"],
      mock: [viewMock, "模拟考试", "40 题 · 20 分制 · 60 分钟"],
      subjective: [viewSubjective, "主观题", "科目二 30 分 · 答题框架"],
      report: [viewReport, "工程实践", "科目三 50 分 · 报告与答辩"],
      plan: [viewPlan, "冲刺计划", "14 天 · 每天 60 分钟"],
      flash: [viewFlash, "速记卡", "考前 10 分钟过一遍"]
    };
    const entry = map[name] || map.home;
    $("#pageTitle").textContent = entry[1];
    $("#pageSub").textContent = entry[2];
    view.innerHTML = '<div class="view">' + entry[0]() + "</div>";
    $$("#mainNav a").forEach((a) => {
      a.classList.toggle("active", a.dataset.route === (name === "chapter" ? "chapters" : name));
    });
    bindView(name, arg);
  }

  /* ====================== 首页 ====================== */
  function viewHome() {
    const dl = daysLeft();
    const readN = progress.read.size;
    const planDone = progress.plan.size;
    const nextChapter = CHAPTERS.find((c) => !progress.read.has(c.id)) || CHAPTERS[0];
    const todayPlan = (PLAN.days || []).find((d) => d.tasks.some((_, i) => !progress.plan.has("d" + d.d + "t" + i))) || (PLAN.days && PLAN.days[0]) || { theme: "开始学习", tasks: [] };

    let html = "";
    html += '<section class="hero"><div class="hero-inner">';
    html += '<div class="hero-main">';
    html += '<span class="eyebrow">' + icon("spark", 13) + ' 工业和信息化部人才交流中心 · IITC</span>';
    html += '<h2>智能体开发工程师<em>（高级）</em><br>备考作战台</h2>';
    html += '<p>三科 20 / 30 / 50 分，一半分数在工程实践。先读考点、再刷客观题、最后把报告和答辩打磨到能上台。</p>';
    html += '<div class="hero-meta"><span>12 章考点</span><span>120 道题库</span><span>10 道主观题模板</span><span>18 个答辩追问</span></div>';
    html += '<div class="hero-actions"><a class="btn primary lg" href="#/chapters">' + icon("book", 17) + ' 开始精读</a>';
    html += '<a class="btn ghost lg" href="#/mock">' + icon("timer", 17) + ' 先测一次</a></div>';
    html += "</div>";
    html += '<div class="count-box"><div class="lab"><span>距考试还有</span><span>DAY</span></div>';
    html += '<div class="num">' + (dl == null ? "—" : Math.max(dl, 0)) + '<small>' + (dl == null ? "未设置" : "天") + "</small></div>";
    html += '<div class="date" id="dateLabel">' + (examDate() ? examDate() + " 09:00" : "设置考试日期后可倒计时") + "</div>";
    html += '<input type="date" id="examDateInput" value="' + esc(examDate()) + '" aria-label="考试日期">';
    html += "</div></div></section>";

    html += '<div class="stat-strip">';
    html += statCard(readN + "/12", "已读章节", (readN / 12) * 100);
    html += statCard(accuracy() + "%", "刷题正确率", accuracy());
    html += statCard(progress.stats.mockCount ? progress.stats.mockBest + "/20" : "—", "模拟最高分", (progress.stats.mockBest / 20) * 100);
    html += statCard(planDone + "/" + planTotal(), "计划完成", planTotal() ? (planDone / planTotal()) * 100 : 0);
    html += "</div>";

    html += '<div class="grid g2" style="margin-top:18px">';
    html += '<div class="card card-pad"><div class="sec-head"><h2><span class="bar"></span>今天先做这三件事</h2><a class="more" href="#/plan">完整计划 →</a></div>';
    html += '<div style="font-size:13px;color:var(--muted);margin-bottom:10px">来自「' + esc(todayPlan.theme) + '」</div>';
    html += '<div class="task"><input type="checkbox" disabled><span>' + esc(todayPlan.tasks[0] || "打开考点精讲，读第一章") + "</span></div>";
    html += '<div class="task"><input type="checkbox" disabled><span>' + esc(todayPlan.tasks[1] || "完成对应章节练习") + "</span></div>";
    html += '<div class="task"><input type="checkbox" disabled><span>' + esc(todayPlan.tasks[2] || "记录 3 个还说不清的概念") + "</span></div>";
    html += '<div style="margin-top:16px"><a class="btn primary sm" href="#/chapter/' + nextChapter.id + '">继续读「' + esc(nextChapter.short) + '」' + icon("arrow", 15) + "</a></div></div>";

    html += '<div class="card card-pad"><div class="sec-head"><h2><span class="bar"></span>分值结构</h2><span class="chip gold">报告占一半</span></div>';
    html += '<div style="display:flex;height:14px;border-radius:8px;overflow:hidden;margin:16px 0 14px;background:var(--bg-soft)">';
    html += '<i style="width:20%;background:var(--brand)"></i><i style="width:30%;background:var(--gold)"></i><i style="width:50%;background:var(--violet)"></i></div>';
    html += '<div style="display:flex;flex-direction:column;gap:8px;font-size:12.5px">';
    html += '<div style="display:flex;gap:8px;align-items:center"><span class="dot" style="color:var(--brand)"></span>科目一 专业知识 <b style="margin-left:auto">20 分</b></div>';
    html += '<div style="display:flex;gap:8px;align-items:center"><span class="dot" style="color:var(--gold)"></span>科目二 技术技能 <b style="margin-left:auto">30 分</b></div>';
    html += '<div style="display:flex;gap:8px;align-items:center"><span class="dot" style="color:var(--violet)"></span>科目三 工程实践 <b style="margin-left:auto">50 分</b></div>';
    html += "</div>";
    html += '<p class="small muted" style="margin:14px 0 0">先读考点，再刷题；报告尽早起稿，别留到最后一周。</p>';
    html += "</div></div>";

    html += '<div style="margin-top:26px" class="sec-head"><h2><span class="bar"></span>三科考什么</h2><p>分值与形式以当期通知为准</p></div>';
    html += '<div class="exam-cards">';
    (EXAM.structure || []).forEach((s) => {
      html += '<div class="exam-card ' + s.accent + '"><span class="pct">' + s.score + "</span>";
      html += '<h4>' + esc(s.name) + ' <span class="chip blue">' + esc(s.no) + "</span></h4>";
      html += '<div class="weight">' + esc(s.format) + " · " + esc(s.mode) + "</div>";
      html += '<div class="desc">' + esc(s.desc) + "</div>";
      html += '<div class="tags">' + (s.tags || []).map((t) => '<span class="chip">' + esc(t) + "</span>").join("") + "</div></div>";
    });
    html += "</div>";

    html += '<div class="grid g2" style="margin-top:26px">';
    html += '<div class="card card-pad"><div class="sec-head"><h2><span class="bar"></span>高频分值分布</h2><p>按考点重要性估算</p></div>';
    (EXAM.blueprint || []).forEach((b) => {
      html += '<div class="bar-row"><span class="lb">' + esc(b.name) + '</span><span class="bar"><i style="width:' + b.w * 5 + '%"></i></span><span class="vl">' + b.w + "%</span></div>";
    });
    html += "</div>";

    html += '<div class="card card-pad"><div class="sec-head"><h2><span class="bar"></span>高分策略</h2></div>';
    (EXAM.tips || []).forEach((t) => {
      html += '<div style="padding:11px 0;border-bottom:1px solid var(--line)"><b style="font-size:13px">' + esc(t.k) + '</b><div class="small muted" style="margin-top:3px">' + esc(t.v) + "</div></div>";
    });
    html += "</div></div>";

    html += '<div style="margin-top:26px" class="sec-head"><h2><span class="bar"></span>四步路线</h2><p>从看懂到能上场</p></div>';
    html += '<div class="card card-pad"><div class="roadmap">';
    [["01", "读考点", "按重要度过 12 章，标记说不清的概念", "约 7 天"],
     ["02", "刷客观题", "章节练习 + 错题本，目标正确率 85%", "约 3 天"],
     ["03", "背框架", "10 道主观题模板 + 18 个答辩追问", "约 2 天"],
     ["04", "磨报告", "按六段结构成稿，计时演练答辩", "约 2 天"]].forEach((r) => {
      html += '<div class="road-step"><div class="no">' + r[0] + '</div><div class="t">' + r[3] + "</div><h5>" + r[1] + "</h5><p>" + r[2] + "</p></div>";
    });
    html += "</div></div>";

    html += '<div style="margin-top:26px" class="sec-head"><h2><span class="bar"></span>考前必背</h2><a class="more" href="#/flash">全部 35 张 →</a></div>';
    html += '<div class="flash-grid">';
    FLASH.slice(0, 4).forEach((f) => {
      html += '<div class="flash"><b>' + esc(f.t) + "</b><p>" + esc(f.d) + "</p></div>";
    });
    html += "</div>";

    html += footNote();
    return html;
  }

  function statCard(v, label, pct) {
    return '<div class="stat"><b>' + esc(v) + "</b><span>" + esc(label) + '</span><div class="mini-bar"><i style="width:' + Math.min(100, Math.max(0, pct || 0)) + '%"></i></div></div>';
  }

  function footNote() {
    return '<div class="foot-note"><span>IITC 工信人才岗位能力评价 · 智能体开发工程师（高级）备考台</span>' +
      '<a href="https://rencai.gxbxxpt.org.cn/" target="_blank" rel="noopener">官方学习平台</a>' +
      '<span>内容依据公开资料整理，具体以官方当期通知为准</span><span>数据保存在本机浏览器</span></div>';
  }

  /* ====================== 章节列表 ====================== */
  function viewChapters() {
    let html = '<div class="sec-head"><h2><span class="bar"></span>12 章考点</h2><p>按重要度排序，先读 5 星</p><a class="more" href="#/drill">去刷题 →</a></div>';
    html += '<div class="chapter-grid">';
    const sorted = CHAPTERS.slice().sort((a, b) => (b.weight - a.weight) || (a._idx - b._idx));
    sorted.forEach((c) => {
      const done = progress.read.has(c.id);
      html += '<a class="chapter-card" href="#/chapter/' + c.id + '">';
      html += '<div class="top"><span class="idx">' + String(c._idx).padStart(2, "0") + '</span><h4>' + esc(c.title) + "</h4></div>";
      html += "<p>" + esc(c.summary) + "</p>";
      html += '<div class="foot">' + weightDots(c.weight) + '<span>' + c.minutes + ' 分钟</span><span style="margin-left:auto">' + (done ? '<span class="done">' + icon("check", 12) + " 已读</span>" : "未读") + "</span></div>";
      html += "</a>";
    });
    html += "</div>";
    html += footNote();
    return html;
  }

  /* ====================== 单章 ====================== */
  function viewChapter(id) {
    const c = CH_MAP[id] || CHAPTERS[0];
    const idx = CHAPTERS.indexOf(c);
    const prev = CHAPTERS[idx - 1], next = CHAPTERS[idx + 1];
    let toc = "";
    c.sections.forEach((s, i) => { toc += '<a href="#sec' + i + '" data-sec="sec' + i + '">' + esc(s.h) + "</a>"; });

    let html = '<div class="article-layout"><article class="article" id="article">';
    html += '<div class="article-head"><div class="crumb"><a href="#/chapters">考点精讲</a> / <span>' + esc(c.short) + "</span></div>";
    html += "<h2>" + esc(c.title) + "</h2><p class=\"lead\">" + esc(c.summary) + "</p>";
    html += '<div class="meta"><span class="chip blue">第 ' + c._idx + " 章</span><span class=\"chip\">" + c.minutes + ' 分钟</span><span class="chip gold">重要度 ' + c.weight + "/5</span>" + (progress.read.has(c.id) ? '<span class="chip green">已读</span>' : "") + "</div>";
    html += '<div class="read-progress"><i id="readBar"></i></div></div>';

    c.sections.forEach((s, i) => {
      html += '<h4 id="sec' + i + '">' + esc(s.h) + "</h4>";
      html += s.html;
    });

    html += '<div class="kp"><h5>' + icon("check", 13) + " 必背考点</h5><ul>" + c.keypoints.map((k) => "<li>" + esc(k) + "</li>").join("") + "</ul></div>";
    if (c.traps && c.traps.length) {
      html += '<div class="trap"><h5>' + icon("alert", 13) + " 易错点</h5><ul>" + c.traps.map((k) => "<li>" + esc(k) + "</li>").join("") + "</ul></div>";
    }
    if (c.examTip) {
      html += '<div class="exam-tip"><b>怎么考</b>' + esc(c.examTip) + "</div>";
    }

    html += '<div class="article-foot">';
    html += '<button class="btn primary" id="markRead">' + (progress.read.has(c.id) ? "已标记已读" : "标记本章已读") + "</button>";
    html += '<a class="btn" href="#/drill?ch=' + c.id + '">做本章练习' + icon("arrow", 15) + "</a>";
    html += '<button class="btn ghost sm" id="printArticle">打印本章</button>';
    html += '<span class="spacer" style="flex:1"></span>';
    if (prev) html += '<a class="btn ghost sm" href="#/chapter/' + prev.id + '">← ' + esc(prev.short) + "</a>";
    if (next) html += '<a class="btn ghost sm" href="#/chapter/' + next.id + '">' + esc(next.short) + " →</a>";
    html += "</div></article>";

    html += '<aside class="article-toc"><h5>本章目录</h5>' + toc + "</aside></div>";
    html += footNote();
    return html;
  }

  function bindChapter(id) {
    const article = $("#article");
    const bar = $("#readBar");
    const links = $$(".article-toc a");
    const secs = $$("h4[id^=sec]", article);

    function onScroll() {
      const rect = article.getBoundingClientRect();
      const total = Math.max(article.offsetHeight - window.innerHeight * 0.6, 1);
      const passed = Math.min(Math.max(-rect.top + 120, 0), total);
      if (bar) bar.style.width = (passed / total) * 100 + "%";
      let active = secs[0] ? secs[0].id : "";
      secs.forEach((s) => { if (s.getBoundingClientRect().top < 140) active = s.id; });
      links.forEach((a) => a.classList.toggle("on", a.dataset.sec === active));
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    cleanup = () => window.removeEventListener("scroll", onScroll);

    const printBtn = $("#printArticle");
    if (printBtn) printBtn.addEventListener("click", () => window.print());

    $("#markRead").addEventListener("click", function () {
      progress.read.add(id);
      progress.lastChapter = id;
      saveProgress();
      this.textContent = "已标记已读";
      this.classList.remove("primary");
      toast("已记录：本章读完");
      refreshSidebar();
    });
  }

  /* ====================== 刷题 ====================== */
  let drill = null;

  function viewDrill() {
    const params = new URLSearchParams((location.hash.split("?")[1] || ""));
    const presetCh = params.get("ch") || store.get("drillCh", "all");
    if (!drill) {
      drill = { queue: [], idx: 0, picked: [], answered: false, mode: "all", ch: presetCh, type: "all", done: 0, right: 0 };
      buildDrillQueue();
    }
    const q = drill.queue[drill.idx];
    let html = '<div class="panel">';
    html += '<div class="toolbar">';
    html += '<div class="seg" id="typeSeg">' + ["all", "single", "multiple", "judge"].map((t) => '<button data-type="' + t + '" class="' + (drill.type === t ? "on" : "") + '">' + (t === "all" ? "全部" : TYPE_NAME[t]) + "</button>").join("") + "</div>";
    html += '<select id="chSelect"><option value="all">全部章节</option>' + CHAPTERS.map((c) => '<option value="' + c.id + '"' + (drill.ch === c.id ? " selected" : "") + ">" + esc(c.short) + "</option>").join("") + "</select>";
    html += '<div class="seg" id="modeSeg"><button data-mode="all" class="' + (drill.mode === "all" ? "on" : "") + '">顺序</button><button data-mode="random" class="' + (drill.mode === "random" ? "on" : "") + '">随机</button><button data-mode="wrong" class="' + (drill.mode === "wrong" ? "on" : "") + '">错题本 (' + progress.wrong.size + ")</button></div>";
    html += '<span class="spacer" style="flex:1"></span><span class="streak">本轮 <b>' + drill.right + "</b>/" + drill.done + " 正确</span>";
    html += "</div>";

    html += '<div class="quiz-wrap" id="quizWrap">' + renderQuestion(q) + "</div></div>";
    html += footNote();
    return html;
  }

  function buildDrillQueue() {
    let list = QUESTIONS.slice();
    if (drill.mode === "wrong") list = list.filter((q) => progress.wrong.has(q.id));
    if (drill.ch !== "all") list = list.filter((q) => q.chapter === drill.ch);
    if (drill.type !== "all") list = list.filter((q) => q.type === drill.type);
    if (drill.mode === "random") shuffle(list);
    drill.queue = list.map(prepareQuestion);
    drill.idx = 0; drill.picked = []; drill.answered = false;
  }

  function renderQuestion(q) {
    if (!q) {
      return '<div class="quiz-empty"><h4>没有符合条件的题目</h4><p>换个筛选条件，或先去错题本积累几道题。</p><button class="btn primary" id="resetDrill">重新开始</button></div>';
    }
    let html = '<div class="quiz-meta"><span class="q-index">第 ' + (drill.idx + 1) + " / " + drill.queue.length + ' 题</span>';
    html += '<span class="chip blue">' + TYPE_NAME[q.type] + '</span><span class="chip">' + esc(CH_MAP[q.chapter] ? CH_MAP[q.chapter].short : q.chapter) + "</span>";
    html += '<span class="chip">' + "★".repeat(q.level) + "</span>";
    const isWrong = progress.wrong.has(q.id);
    if (isWrong) html += '<span class="chip red">错题</span>';
    html += "</div>";
    html += '<div class="q-stem">' + esc(q.stem) + "</div>";
    html += '<div class="options" id="options">';
    const letters = "ABCDE";
    q.options.forEach((o, i) => {
      let cls = "opt";
      if (drill.answered) {
        cls += " disabled";
        if (q.answer.indexOf(i) >= 0) cls += " correct";
        else if (drill.picked.indexOf(i) >= 0) cls += " wrong";
      } else if (drill.picked.indexOf(i) >= 0) cls += " sel";
      html += '<div class="' + cls + '" data-i="' + i + '"><span class="mark">' + letters[i] + "</span><span>" + esc(o) + "</span></div>";
    });
    html += "</div>";

    html += '<div class="feedback" id="feedback"></div>';
    html += '<div class="quiz-actions">';
    if (!drill.answered) {
      html += '<button class="btn primary" id="submitBtn" disabled>提交答案</button>';
      if (q.type === "multiple") html += '<span class="small muted">多选题：选全才得分</span>';
      html += '<span class="spacer"></span><span class="small muted">快捷键 <span class="kbd">1</span>~<span class="kbd">4</span> 选择，<span class="kbd">Enter</span> 提交</span>';
    } else {
      html += '<button class="btn primary" id="nextBtn">' + (drill.idx + 1 >= drill.queue.length ? "查看本轮结果" : "下一题") + " " + icon("arrow", 15) + "</button>";
      html += '<span class="spacer"></span><button class="btn ghost sm" id="finishBtn">结束本轮</button>';
    }
    html += "</div>";
    return html;
  }

  function bindDrill() {
    const wrap = $("#quizWrap");
    if (!wrap) return;

    $$("#typeSeg button").forEach((b) => {
      b.onclick = () => {
        drill.type = b.dataset.type;
        buildDrillQueue(); view.innerHTML = '<div class="view">' + viewDrill() + "</div>"; bindDrill();
      };
    });
    $$("#modeSeg button").forEach((b) => {
      b.onclick = () => {
        drill.mode = b.dataset.mode; buildDrillQueue();
        view.innerHTML = '<div class="view">' + viewDrill() + "</div>"; bindDrill();
      };
    });
    const sel = $("#chSelect");
    if (sel) sel.onchange = () => {
      drill.ch = sel.value; store.set("drillCh", drill.ch); buildDrillQueue();
      view.innerHTML = '<div class="view">' + viewDrill() + "</div>"; bindDrill();
    };

    const reset = $("#resetDrill");
    if (reset) reset.onclick = () => { drill.mode = "all"; drill.ch = "all"; drill.type = "all"; buildDrillQueue(); view.innerHTML = '<div class="view">' + viewDrill() + "</div>"; bindDrill(); };

    $$("#options .opt").forEach((o) => {
      o.onclick = () => {
        if (drill.answered) return;
        const i = Number(o.dataset.i);
        const q = drill.queue[drill.idx];
        if (q.type === "multiple") {
          const p = drill.picked.indexOf(i);
          if (p >= 0) drill.picked.splice(p, 1); else drill.picked.push(i);
        } else {
          drill.picked = [i];
        }
        $$("#options .opt").forEach((x) => {
          const xi = Number(x.dataset.i);
          x.classList.toggle("sel", drill.picked.indexOf(xi) >= 0);
        });
        const sub = $("#submitBtn");
        if (sub) sub.disabled = drill.picked.length === 0;
      };
    });

    const sub = $("#submitBtn");
    if (sub) sub.onclick = submitQuestion;

    const next = $("#nextBtn");
    if (next) next.onclick = () => {
      if (drill.idx + 1 >= drill.queue.length) return showDrillSummary();
      drill.idx++; drill.picked = []; drill.answered = false;
      $("#quizWrap").innerHTML = renderQuestion(drill.queue[drill.idx]);
      bindDrill();
    };
    const fin = $("#finishBtn");
    if (fin) fin.onclick = showDrillSummary;

    document.onkeydown = (e) => {
      if (!drill || !drill.queue || !drill.queue.length) return;
      if (!document.querySelector(".quiz-wrap")) return;
      const q = drill.queue[drill.idx];
      if (!q) return;
      if (e.key >= "1" && e.key <= "5" && !drill.answered) {
        const i = Number(e.key) - 1;
        if (i < q.options.length) {
          const node = document.querySelector('.opt[data-i="' + i + '"]');
          if (node) node.click();
        }
      } else if (e.key === "Enter") {
        if (!drill.answered && drill.picked.length) submitQuestion();
        else if (drill.answered && $("#nextBtn")) $("#nextBtn").click();
      }
    };
  }

  function submitQuestion() {
    const q = drill.queue[drill.idx];
    if (!q || drill.answered) return;
    drill.answered = true;
    const ok = sameSet(drill.picked, q.answer);
    drill.done++;
    if (ok) drill.right++;
    progress.stats.attempts++;
    if (ok) progress.stats.correct++;
    const bc = progress.stats.byChapter[q.chapter] || { a: 0, c: 0 };
    bc.a++; if (ok) bc.c++;
    progress.stats.byChapter[q.chapter] = bc;
    if (ok) {
      if (drill.mode === "wrong") progress.wrong.delete(q.id);
    } else {
      progress.wrong.add(q.id);
    }
    saveProgress();
    refreshSidebar();

    $$("#options .opt").forEach((x) => {
      const i = Number(x.dataset.i);
      x.classList.add("disabled");
      x.classList.toggle("correct", q.answer.indexOf(i) >= 0);
      x.classList.toggle("wrong", q.answer.indexOf(i) < 0 && drill.picked.indexOf(i) >= 0);
      if (drill.picked.indexOf(i) >= 0) x.classList.add("sel");
    });
    const fb = $("#feedback");
    const letters = "ABCDE";
    fb.className = "feedback show " + (ok ? "ok" : "no");
    fb.innerHTML = '<div class="fb-head">' + icon(ok ? "check" : "alert", 16) + (ok ? "回答正确" : "回答错误") + "</div>" +
      '<div class="fb-body"><b>正确答案：' + q.answer.map((i) => letters[i]).join("、") + "</b><br>" + esc(q.explain) + "</div>";
    const actions = document.querySelector(".quiz-actions");
    actions.innerHTML = '<button class="btn primary" id="nextBtn">' + (drill.idx + 1 >= drill.queue.length ? "查看本轮结果" : "下一题") + " " + icon("arrow", 15) + '</button><span class="spacer"></span><button class="btn ghost sm" id="finishBtn">结束本轮</button>';
    $("#nextBtn").addEventListener("click", () => {
      if (drill.idx + 1 >= drill.queue.length) return showDrillSummary();
      drill.idx++; drill.picked = []; drill.answered = false;
      $("#quizWrap").innerHTML = renderQuestion(drill.queue[drill.idx]);
      bindDrill();
    });
    $("#finishBtn").addEventListener("click", showDrillSummary);
    const removed = $("#submitBtn"); if (removed) removed.remove();
    document.onkeydown = (e) => { if (e.key === "Enter" && $("#nextBtn")) $("#nextBtn").click(); };
  }

  function showDrillSummary() {
    const acc = drill.done ? Math.round((drill.right / drill.done) * 100) : 0;
    openModal(
      '<h3>本轮完成</h3><p>共作答 ' + drill.done + " 题，答对 " + drill.right + " 题，正确率 <b style=\"color:var(--brand)\">" + acc + "%</b>。</p>" +
      '<div class="bar-row"><span class="lb">正确率</span><span class="bar"><i style="width:' + acc + '%"></i></span><span class="vl">' + acc + "%</span></div>" +
      '<p class="small muted" style="margin-top:14px">错题已自动加入错题本，可在筛选栏切到「错题本」重做。</p>' +
      '<div class="actions"><button class="btn" id="mClose">留在本页</button><button class="btn primary" id="mAgain">再来一轮</button></div>'
    );
    $("#mClose").addEventListener("click", closeModal);
    $("#mAgain").addEventListener("click", () => {
      closeModal(); drill.done = 0; drill.right = 0; buildDrillQueue();
      view.innerHTML = '<div class="view">' + viewDrill() + "</div>"; bindDrill();
    });
  }

  /* ====================== 模拟考 ====================== */
  let mock = null;

  function buildMock() {
    const pick = (t, n) => shuffle(QUESTIONS.filter((q) => q.type === t)).slice(0, n).map(prepareQuestion);
    const qs = pick("single", 20).concat(pick("multiple", 10)).concat(pick("judge", 10));
    return {
      questions: qs,
      answers: qs.map(() => []),
      idx: 0,
      deadline: Date.now() + 60 * 60 * 1000,
      submitted: false,
      score: 0,
      byType: { single: { r: 0, n: 20 }, multiple: { r: 0, n: 10 }, judge: { r: 0, n: 10 } }
    };
  }

  function viewMock() {
    if (!mock) {
      let html = '<div class="card card-pad" style="text-align:center;padding:46px 24px">';
      html += '<div style="width:64px;height:64px;border-radius:20px;background:var(--brand-soft);color:var(--brand);display:grid;place-items:center;margin:0 auto 18px">' + icon("timer", 30) + "</div>";
      html += '<h2 style="font-size:22px;margin-bottom:8px">模拟考试 · 客观题</h2>';
      html += '<p class="muted" style="max-width:520px;margin:0 auto 6px">按高级「科目一」20 分结构自拟：20 道单选 + 10 道多选 + 10 道判断，每题 0.5 分，满分 20 分，限时 60 分钟。</p>';
      html += '<p class="small muted" style="margin-bottom:22px">多选题全部选对才得分；交卷后可逐题看解析。</p>';
      html += '<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">';
      html += '<button class="btn primary lg" id="startMock">' + icon("timer", 17) + " 开始考试</button>";
      html += '<a class="btn lg" href="#/drill">先做章节练习</a></div>';
      if (progress.stats.mockCount) {
        html += '<p class="small muted" style="margin-top:18px">历史最高：<b>' + progress.stats.mockBest + " / 20</b> · 已考 " + progress.stats.mockCount + " 次</p>";
      }
      html += "</div>";
      html += footNote();
      return html;
    }
    if (mock.submitted) return mockResult();
    return mockExam();
  }

  function mockExam() {
    const q = mock.questions[mock.idx];
    const picked = mock.answers[mock.idx];
    let html = '<div class="mock-shell"><div class="panel"><div class="quiz-wrap">';
    html += '<div class="quiz-meta"><span class="q-index">第 ' + (mock.idx + 1) + " / " + mock.questions.length + ' 题</span><span class="chip blue">' + TYPE_NAME[q.type] + '</span><span class="chip">' + (TYPE_PTS[q.type] * 1).toFixed(1) + " 分</span><span class='chip'>" + esc(CH_MAP[q.chapter] ? CH_MAP[q.chapter].short : q.chapter) + "</span></div>";
    html += '<div class="q-stem">' + esc(q.stem) + "</div><div class=\"options\">";
    const letters = "ABCDE";
    q.options.forEach((o, i) => {
      html += '<div class="opt ' + (picked.indexOf(i) >= 0 ? "sel" : "") + '" data-i="' + i + '"><span class="mark">' + letters[i] + "</span><span>" + esc(o) + "</span></div>";
    });
    html += "</div>";
    html += '<div class="quiz-actions"><button class="btn" id="prevQ"' + (mock.idx === 0 ? " disabled" : "") + ">上一题</button>";
    html += '<button class="btn" id="nextQ"' + (mock.idx + 1 >= mock.questions.length ? " disabled" : "") + ">下一题</button>";
    html += '<span class="spacer"></span><button class="btn primary" id="submitMock">交卷</button></div>';
    html += "</div></div>";

    html += '<aside class="mock-side"><div class="card timer-card"><div class="timer-lab">剩余时间</div><div class="timer-big" id="mockTimer">60:00</div><div class="small muted" style="margin-top:4px">交卷后自动评分</div></div>';
    html += '<div class="card card-pad"><div class="sec-head" style="margin-bottom:10px"><h2 style="font-size:13px">答题卡</h2><span class="small muted" id="answeredCount">0/40</span></div>';
    html += '<div class="qgrid" id="qgrid">';
    mock.questions.forEach((_, i) => {
      let cls = "qcell";
      if (mock.answers[i].length) cls += " answered";
      if (i === mock.idx) cls += " cur";
      html += '<button class="' + cls + '" data-q="' + i + '">' + (i + 1) + "</button>";
    });
    html += "</div></div></aside></div>";
    return html;
  }

  function bindMock() {
    if (!mock) {
      const btn = $("#startMock");
      if (btn) btn.addEventListener("click", () => {
        mock = buildMock();
        view.innerHTML = '<div class="view">' + viewMock() + "</div>";
        bindMock();
        startMockTimer();
      });
      return;
    }
    if (mock.submitted) {
      const again = $("#mockAgain");
      if (again) again.addEventListener("click", () => { mock = null; view.innerHTML = '<div class="view">' + viewMock() + "</div>"; bindMock(); });
      return;
    }

    $$(".opt").forEach((o) => o.addEventListener("click", () => {
      const i = Number(o.dataset.i);
      const q = mock.questions[mock.idx];
      const arr = mock.answers[mock.idx];
      if (q.type === "multiple") {
        const p = arr.indexOf(i);
        if (p >= 0) arr.splice(p, 1); else arr.push(i);
      } else {
        mock.answers[mock.idx] = [i];
      }
      $$(".opt").forEach((x) => x.classList.toggle("sel", mock.answers[mock.idx].indexOf(Number(x.dataset.i)) >= 0));
      const cell = document.querySelector('.qcell[data-q="' + mock.idx + '"]');
      if (cell) cell.classList.toggle("answered", mock.answers[mock.idx].length > 0);
      updateAnsweredCount();
    }));
    const prev = $("#prevQ"); if (prev) prev.addEventListener("click", () => { if (mock.idx > 0) { mock.idx--; rerenderMock(); } });
    const next = $("#nextQ"); if (next) next.addEventListener("click", () => { if (mock.idx < 39) { mock.idx++; rerenderMock(); } });
    const sub = $("#submitMock"); if (sub) sub.addEventListener("click", () => confirmSubmit());
    $$("#qgrid .qcell").forEach((c) => c.addEventListener("click", () => { mock.idx = Number(c.dataset.q); rerenderMock(); }));
    startMockTimer();
  }

  function rerenderMock() {
    view.innerHTML = '<div class="view">' + mockExam() + "</div>";
    bindMock();
    updateAnsweredCount();
    tickTimer();
  }

  function updateAnsweredCount() {
    const n = mock.answers.filter((a) => a.length).length;
    const el = $("#answeredCount");
    if (el) el.textContent = n + "/40";
  }

  let timerHandle = null;
  function startMockTimer() {
    if (timerHandle) clearInterval(timerHandle);
    tickTimer();
    timerHandle = setInterval(tickTimer, 1000);
    cleanup = () => { if (timerHandle) { clearInterval(timerHandle); timerHandle = null; } };
  }
  function tickTimer() {
    if (!mock || mock.submitted) { if (timerHandle) clearInterval(timerHandle); return; }
    const left = Math.max(0, Math.floor((mock.deadline - Date.now()) / 1000));
    const el = $("#mockTimer");
    if (el) {
      const m = String(Math.floor(left / 60)).padStart(2, "0");
      const s = String(left % 60).padStart(2, "0");
      el.textContent = m + ":" + s;
      el.classList.toggle("low", left <= 300);
    }
    if (left <= 0) { toast("时间到，自动交卷"); submitMock(); }
  }

  function confirmSubmit() {
    const n = mock.answers.filter((a) => a.length).length;
    if (n < 40) {
      openModal('<h3>还有 ' + (40 - n) + " 题未答</h3><p>未答题目按 0 分计。确定交卷吗？</p><div class=\"actions\"><button class=\"btn\" id=\"mCancel\">继续作答</button><button class=\"btn primary\" id=\"mOk\">确定交卷</button></div>");
      $("#mCancel").addEventListener("click", closeModal);
      $("#mOk").addEventListener("click", () => { closeModal(); submitMock(); });
    } else {
      submitMock();
    }
  }

  function submitMock() {
    if (!mock || mock.submitted) return;
    mock.submitted = true;
    if (timerHandle) { clearInterval(timerHandle); timerHandle = null; }
    let score = 0;
    mock.questions.forEach((q, i) => {
      const ok = sameSet(mock.answers[i], q.answer);
      if (ok) {
        score += TYPE_PTS[q.type];
        mock.byType[q.type].r++;
      }
    });
    mock.score = Math.round(score * 10) / 10;
    progress.stats.mockCount++;
    if (mock.score > progress.stats.mockBest) progress.stats.mockBest = mock.score;
    saveProgress();
    refreshSidebar();
    cleanup = function () { };
    view.innerHTML = '<div class="view">' + mockResult() + "</div>";
    bindMock();
  }

  function mockResult() {
    const pct = Math.round((mock.score / 20) * 100);
    let html = '<div class="card"><div class="result-hero"><div class="score-big">' + mock.score.toFixed(1) + "<small> / 20</small></div>";
    html += '<div class="score-sub">得分率 ' + pct + "% · " + (pct >= 85 ? "稳了，保持手感" : pct >= 70 ? "接近及格线，重点补错题" : "需要回到考点精讲补基础") + "</div></div>";
    html += '<div style="padding:0 26px 24px">';
    html += '<div class="bar-row"><span class="lb">单选</span><span class="bar"><i style="width:' + (mock.byType.single.r / 20 * 100) + '%"></i></span><span class="vl">' + mock.byType.single.r + "/20</span></div>";
    html += '<div class="bar-row"><span class="lb">多选</span><span class="bar"><i style="width:' + (mock.byType.multiple.r / 10 * 100) + '%"></i></span><span class="vl">' + mock.byType.multiple.r + "/10</span></div>";
    html += '<div class="bar-row"><span class="lb">判断</span><span class="bar"><i style="width:' + (mock.byType.judge.r / 10 * 100) + '%"></i></span><span class="vl">' + mock.byType.judge.r + "/10</span></div>";
    html += '<div style="display:flex;gap:10px;margin-top:18px;flex-wrap:wrap"><button class="btn primary" id="mockAgain">再考一次</button><a class="btn" href="#/drill">去刷错题</a></div>';
    html += "</div></div>";

    html += '<div class="sec-head" style="margin-top:26px"><h2><span class="bar"></span>逐题解析</h2><p>红叉为你的选择</p></div>';
    const letters = "ABCDE";
    mock.questions.forEach((q, i) => {
      const mine = mock.answers[i];
      const ok = sameSet(mine, q.answer);
      html += '<div class="card card-pad" style="margin-bottom:12px;border-left:3px solid ' + (ok ? "var(--green)" : "var(--red)") + '">';
      html += '<div style="display:flex;gap:10px;align-items:flex-start"><span class="chip ' + (ok ? "green" : "red") + '">' + (i + 1) + "</span><div style=\"flex:1\">";
      html += '<div style="font-weight:600;font-size:14px;margin-bottom:8px">' + esc(q.stem) + "</div>";
      html += '<div class="small" style="color:var(--muted)">你选：' + (mine.length ? mine.map((x) => letters[x]).join("、") : "未答") + " · 正确：" + q.answer.map((x) => letters[x]).join("、") + "</div>";
      html += '<div class="small" style="margin-top:6px;color:var(--ink-2)">' + esc(q.explain) + "</div>";
      html += "</div></div></div>";
    });
    html += footNote();
    return html;
  }

  /* ====================== 主观题 ====================== */
  function viewSubjective() {
    let html = '<div class="card card-pad" style="margin-bottom:18px">';
    html += '<div class="sec-head" style="margin-bottom:8px"><h2><span class="bar"></span>科目二答题公式</h2><span class="chip gold">30 分</span></div>';
    html += '<div class="grid g3" style="gap:12px">';
    [["结论先行", "第一句给判断和方案名，别让评委猜。"], ["分层展开", "架构 / 数据 / 权限 / 评测，一层一段。"], ["量化收尾", "给指标、阈值、验证方法，证明可落地。"]].forEach((x) => {
      html += '<div style="background:var(--bg-soft);border-radius:12px;padding:14px 16px"><b style="font-size:13px">' + x[0] + '</b><div class="small muted" style="margin-top:4px">' + x[1] + "</div></div>";
    });
    html += "</div></div>";

    html += '<div class="sec-head"><h2><span class="bar"></span>10 道高频题</h2><p>点击展开：答题框架 + 参考答案</p></div>';
    html += '<div class="qa-list">';
    SUBJECTIVE.forEach((s, i) => {
      html += '<div class="qa" data-qa="' + i + '"><div class="qa-q"><span class="no">Q' + (i + 1) + '</span><h4>' + esc(s.q) + '</h4><span class="tg"><span class="chip blue">' + esc(s.tag) + '</span></span><span class="arrow">' + icon("chevron", 16) + "</span></div>";
      html += '<div class="qa-a"><div class="label">答题框架</div><ol>' + s.framework.map((f) => "<li>" + esc(f) + "</li>").join("") + "</ol>";
      html += '<div class="label">参考答案</div><div class="sample">' + esc(s.sample) + "</div></div></div>";
    });
    html += "</div>";
    html += footNote();
    return html;
  }

  /* ====================== 工程实践 ====================== */
  function viewReport() {
    let html = '<div class="card card-pad" style="margin-bottom:18px">';
    html += '<div class="sec-head"><h2><span class="bar"></span>50 分怎么拿</h2><span class="chip violet">报告 + 答辩</span></div>';
    html += '<p class="muted" style="margin:0">' + esc(REPORT.intro) + "</p></div>";

    html += '<div class="sec-head"><h2><span class="bar"></span>选一个能写深的题</h2><p>优先选你真实做过的项目</p></div>';
    html += '<div class="chapter-grid">';
    REPORT.topics.forEach((t) => {
      html += '<div class="chapter-card" style="cursor:default"><h4 style="margin-bottom:8px">' + esc(t.t) + "</h4><p style=\"margin:0\">" + esc(t.d) + "</p></div>";
    });
    html += "</div>";

    html += '<div class="grid g2" style="margin-top:26px;align-items:start">';
    html += '<div class="card card-pad"><div class="sec-head"><h2><span class="bar"></span>报告六段结构</h2></div>';
    REPORT.structure.forEach((s) => {
      html += '<div style="padding:12px 0;border-bottom:1px solid var(--line)"><div style="display:flex;gap:10px;align-items:baseline"><b style="font-size:13.5px">' + esc(s.part) + '</b><span class="chip blue" style="margin-left:auto">' + esc(s.pct) + "</span></div>";
      html += '<div class="small" style="margin-top:5px;color:var(--ink-2)">' + esc(s.must) + "</div>";
      html += '<div class="small muted" style="margin-top:3px">' + esc(s.tip) + "</div></div>";
    });
    html += "</div>";

    html += '<div class="card card-pad"><div class="sec-head"><h2><span class="bar"></span>评分维度对照</h2></div>';
    html += '<table class="rubric"><thead><tr><th>维度</th><th>权重</th><th>满分表现</th></tr></thead><tbody>';
    REPORT.rubric.forEach((r) => {
      html += "<tr><td>" + esc(r.dim) + "</td><td>" + esc(r.w) + "</td><td>" + esc(r.full) + "</td></tr>";
    });
    html += "</tbody></table></div></div>";

    html += '<div class="grid g2" style="margin-top:18px;align-items:start">';
    html += '<div class="card card-pad"><div class="sec-head"><h2><span class="bar"></span>提交前清单</h2></div><div>';
    REPORT.checklist.forEach((c) => {
      html += '<div class="task"><input type="checkbox" disabled><span>' + esc(c) + "</span></div>";
    });
    html += "</div></div>";

    html += '<div class="card card-pad"><div class="sec-head"><h2><span class="bar"></span>答辩 18 问</h2><p>点开看回答方向</p></div><div class="qa-list">';
    DEFENSE.forEach((d, i) => {
      html += '<div class="qa" data-qa="d' + i + '"><div class="qa-q"><span class="no">' + String(i + 1).padStart(2, "0") + '</span><h4>' + esc(d.q) + '</h4><span class="arrow">' + icon("chevron", 16) + "</span></div>";
      html += '<div class="qa-a"><div class="label">回答方向</div><p style="margin:0;font-size:13.5px;color:var(--ink-2)">' + esc(d.a) + "</p></div></div>";
    });
    html += "</div></div></div>";
    html += footNote();
    return html;
  }

  /* ====================== 冲刺计划 ====================== */
  function viewPlan() {
    const total = planTotal();
    const done = progress.plan.size;
    let html = '<div class="card card-pad" style="margin-bottom:18px"><div style="display:flex;align-items:center;gap:18px;flex-wrap:wrap">';
    html += '<div><div style="font-size:12px;color:var(--muted)">' + esc(PLAN.name) + "</div><div style=\"font-size:24px;font-weight:800\">" + done + " / " + total + " 项已完成</div></div>";
    html += '<div style="flex:1;min-width:180px"><div class="mini-bar" style="height:8px;border-radius:6px;background:var(--bg-soft);overflow:hidden"><i style="display:block;height:100%;width:' + (total ? done / total * 100 : 0) + '%;background:linear-gradient(90deg,var(--brand-2),var(--brand))"></i></div></div>';
    html += '<button class="btn sm" id="resetPlan">重置进度</button></div>';
    html += '<p class="small muted" style="margin:12px 0 0">' + esc(PLAN.subtitle) + "</p></div>";

    html += '<div style="display:flex;flex-direction:column;gap:10px">';
    PLAN.days.forEach((d) => {
      const keys = d.tasks.map((_, i) => "d" + d.d + "t" + i);
      const dn = keys.filter((k) => progress.plan.has(k)).length;
      html += '<details class="plan-day"' + (d.d === 1 ? " open" : "") + '><summary><span class="d">DAY ' + d.d + '</span>' + esc(d.theme) + '<span class="chip ' + (dn === d.tasks.length ? "green" : "") + '" style="margin-left:auto">' + dn + "/" + d.tasks.length + "</span></summary><div class=\"inner\">";
      d.tasks.forEach((t, i) => {
        html += '<label class="task"><input type="checkbox" data-key="' + keys[i] + '"' + (progress.plan.has(keys[i]) ? " checked" : "") + "><span>" + esc(t) + "</span></label>";
      });
      html += "</div></details>";
    });
    html += "</div>";
    html += footNote();
    return html;
  }

  function bindPlan() {
    $$(".task input[data-key]").forEach((cb) => cb.addEventListener("change", () => {
      if (cb.checked) progress.plan.add(cb.dataset.key); else progress.plan.delete(cb.dataset.key);
      saveProgress(); refreshSidebar();
      const day = cb.closest(".plan-day");
      const all = $$(".task input", day);
      const n = all.filter((x) => x.checked).length;
      const chip = $("summary .chip", day);
      if (chip) { chip.textContent = n + "/" + all.length; chip.className = "chip" + (n === all.length ? " green" : ""); chip.style.marginLeft = "auto"; }
    }));
    const r = $("#resetPlan");
    if (r) r.addEventListener("click", () => {
      openModal('<h3>重置计划进度？</h3><p>只会清空勾选状态，不影响刷题与阅读记录。</p><div class="actions"><button class="btn" id="mCancel">取消</button><button class="btn primary" id="mOk">确定重置</button></div>');
      $("#mCancel").addEventListener("click", closeModal);
      $("#mOk").addEventListener("click", () => {
        progress.plan.clear(); saveProgress(); closeModal(); refreshSidebar();
        view.innerHTML = '<div class="view">' + viewPlan() + "</div>"; bindPlan();
        toast("已重置");
      });
    });
  }

  /* ====================== 速记卡 ====================== */
  function viewFlash() {
    let html = '<div class="sec-head"><h2><span class="bar"></span>' + FLASH.length + ' 张速记卡</h2><p>考前 10 分钟快速过一遍</p></div>';
    html += '<div class="flash-grid">';
    FLASH.forEach((f) => {
      html += '<div class="flash"><b>' + esc(f.t) + '</b><p>' + esc(f.d) + "</p></div>";
    });
    html += "</div>";
    html += footNote();
    return html;
  }

  /* ====================== 绑定与启动 ====================== */
  function bindView(name, arg) {
    if (name === "chapter") bindChapter(arg);
    if (name === "drill") bindDrill();
    if (name === "mock") bindMock();
    if (name === "plan") bindPlan();
    if (name === "home") {
      const input = $("#examDateInput");
      if (input) input.addEventListener("change", () => {
        store.set("examDate", input.value);
        toast(input.value ? "考试日期已保存" : "已清除考试日期");
        navigate();
      });
    }
    $$(".qa-q").forEach((q) => q.addEventListener("click", () => q.parentElement.classList.toggle("open")));
  }

  function refreshSidebar() {
    const ring = $("#ringFg");
    if (ring) {
      const c = 2 * Math.PI * 18;
      const p = progress.read.size / 12;
      ring.style.strokeDasharray = c;
      ring.style.strokeDashoffset = c * (1 - p);
    }
    const t = $("#sideProgressText");
    if (t) t.textContent = progress.read.size + "/12 章";
    const dc = $("#drillCount");
    if (dc) dc.textContent = progress.wrong.size ? progress.wrong.size : QUESTIONS.length;
    const chip = $("#countdownChip");
    if (chip) {
      const d = daysLeft();
      chip.textContent = d == null ? "设置日期" : Math.max(d, 0) + " 天";
    }
  }

  function initTheme() {
    const saved = store.get("theme", "light");
    document.documentElement.setAttribute("data-theme", saved);
    const btn = $("#themeBtn");
    if (btn) btn.addEventListener("click", () => {
      const cur = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", cur);
      store.set("theme", cur);
      btn.innerHTML = icon(cur === "dark" ? "sun" : "moon", 17);
    });
    btn.innerHTML = icon(saved === "dark" ? "sun" : "moon", 17);
  }

  function boot() {
    initTheme();
    $("#menuBtn").addEventListener("click", () => $("#sidebar").classList.toggle("open"));
    $("#modalMask").addEventListener("click", (e) => { if (e.target.id === "modalMask") closeModal(); });
    window.addEventListener("hashchange", navigate);
    refreshSidebar();
    navigate();
  }

  window.IITC = { CHAPTERS, QUESTIONS, progress, refreshSidebar };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();

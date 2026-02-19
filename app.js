// ===== STATE MANAGEMENT =====
const STORAGE_KEY = 'obsidian-mastery-progress';
const NOTES_KEY = 'obsidian-mastery-notes';
const ONBOARD_KEY = 'obsidian-mastery-onboarded';
const MILESTONE_KEY = 'obsidian-mastery-milestones';

function loadProgress() {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
}

function saveProgress(progress) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function toggleDay(day) {
    const progress = loadProgress();
    if (progress[day]) {
        delete progress[day];
    } else {
        progress[day] = new Date().toISOString();
    }
    saveProgress(progress);
    renderAll();
}

function isDayCompleted(day) {
    return !!loadProgress()[day];
}

function getStreak() {
    const progress = loadProgress();
    let streak = 0;
    const sortedDays = Object.keys(progress).map(Number).sort((a, b) => b - a);
    if (sortedDays.length > 0) {
        for (let i = 0; i < sortedDays.length; i++) {
            if (i === 0 || sortedDays[i] === sortedDays[i - 1] - 1) {
                streak++;
            } else {
                break;
            }
        }
    }
    return streak;
}

// ===== LEARNING NOTES =====
function loadNotes() {
    const saved = localStorage.getItem(NOTES_KEY);
    return saved ? JSON.parse(saved) : {};
}

function saveNote(day, text) {
    const notes = loadNotes();
    if (text.trim()) {
        notes[day] = text;
    } else {
        delete notes[day];
    }
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
}

function getNote(day) {
    return loadNotes()[day] || '';
}

function getNoteCount() {
    return Object.keys(loadNotes()).filter(k => loadNotes()[k].trim()).length;
}

// ===== ONBOARDING =====
function showOnboarding() {
    if (!localStorage.getItem(ONBOARD_KEY)) {
        document.getElementById('onboardingOverlay').style.display = 'flex';
    }
}

function dismissOnboarding() {
    localStorage.setItem(ONBOARD_KEY, '1');
    document.getElementById('onboardingOverlay').style.display = 'none';
}

// ===== STATS =====
function updateStats() {
    const progress = loadProgress();
    const completed = Object.keys(progress).length;
    const percent = Math.round((completed / 30) * 100);
    const week = completed <= 7 ? '1주차' : completed <= 14 ? '2주차' : completed <= 21 ? '3주차' : '4주차';
    const streak = getStreak();

    document.getElementById('completedDays').textContent = completed;
    document.getElementById('progressPercent').textContent = percent + '%';
    document.getElementById('currentWeek').textContent = week;
    document.getElementById('streak').textContent = streak;
    document.getElementById('mainProgressBar').style.width = percent + '%';
    document.getElementById('progressBarText').textContent = percent + '%';

    checkMilestones(completed, percent);
}

// ===== MILESTONES & CELEBRATION =====
function checkMilestones(completed, percent) {
    const shown = JSON.parse(localStorage.getItem(MILESTONE_KEY) || '[]');
    const milestones = [
        { at: 25, msg: '25% 달성! 기초를 마스터하고 있어요!' },
        { at: 50, msg: '절반 완료! 대단해요!' },
        { at: 75, msg: '75% 달성! 거의 마스터!' },
        { at: 100, msg: '축하합니다! 옵시디언 마스터!' }
    ];

    for (const m of milestones) {
        if (percent >= m.at && !shown.includes(m.at)) {
            shown.push(m.at);
            localStorage.setItem(MILESTONE_KEY, JSON.stringify(shown));
            celebrate(m.msg);
            if (m.at === 100) {
                setTimeout(() => showCertificate(), 3500);
            }
            break;
        }
    }
}

function celebrate(message) {
    const overlay = document.getElementById('celebrationOverlay');
    overlay.style.display = 'block';
    overlay.innerHTML = '';

    // Confetti
    const colors = ['#7c3aed', '#a78bfa', '#7ee787', '#ffa657', '#79c0ff', '#f78166', '#d2a8ff'];
    for (let i = 0; i < 60; i++) {
        const conf = document.createElement('div');
        conf.className = 'confetti';
        conf.style.left = Math.random() * 100 + '%';
        conf.style.background = colors[Math.floor(Math.random() * colors.length)];
        conf.style.animationDuration = (1.5 + Math.random() * 2) + 's';
        conf.style.animationDelay = Math.random() * 0.5 + 's';
        conf.style.width = (6 + Math.random() * 8) + 'px';
        conf.style.height = (6 + Math.random() * 8) + 'px';
        overlay.appendChild(conf);
    }

    // Message
    const text = document.createElement('div');
    text.className = 'celebration-text';
    text.textContent = message;
    overlay.appendChild(text);

    setTimeout(() => {
        overlay.style.display = 'none';
        overlay.innerHTML = '';
    }, 3000);
}

// ===== CERTIFICATE =====
function showCertificate() {
    const existing = document.querySelector('.certificate-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.className = 'certificate-overlay';
    const today = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
    overlay.innerHTML = `
        <div class="certificate">
            <span class="cert-icon">🏆</span>
            <h2>수료 인증서</h2>
            <p class="cert-name">NEXT COWORK with Obsidian</p>
            <p class="cert-desc">
                30일 옵시디언 마스터 과정을 성공적으로 완료하였습니다.<br>
                기초부터 Claude Code 자동화까지, 전 과정을 수료한 것을 인증합니다.
            </p>
            <p class="cert-date">${today}</p>
            <button class="cert-close" onclick="this.closest('.certificate-overlay').remove()">닫기</button>
        </div>
    `;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
}

// ===== ACHIEVEMENTS =====
function renderAchievements() {
    const grid = document.getElementById('badgesGrid');
    grid.innerHTML = '';
    const progress = loadProgress();
    const streak = getStreak();
    const noteCount = getNoteCount();

    ACHIEVEMENTS_DATA.forEach(a => {
        const unlocked = a.check(progress, streak, noteCount);
        const card = document.createElement('div');
        card.className = 'badge-card' + (unlocked ? ' unlocked' : '');
        card.innerHTML = `
            <span class="badge-icon">${a.icon}</span>
            <div class="badge-title">${a.title}</div>
            <div class="badge-desc">${a.desc}</div>
        `;
        card.title = a.desc;
        grid.appendChild(card);
    });
}

// ===== CALENDAR =====
function renderCalendar() {
    const grid = document.getElementById('calendarGrid');
    grid.innerHTML = '';

    const labels = ['월', '화', '수', '목', '금', '토', '일'];
    labels.forEach(label => {
        const el = document.createElement('div');
        el.className = 'cal-label';
        el.textContent = label;
        grid.appendChild(el);
    });

    for (let i = 0; i < 2; i++) {
        const empty = document.createElement('div');
        empty.className = 'cal-day empty';
        grid.appendChild(empty);
    }

    const progress = loadProgress();
    const allDays = CURRICULUM.flatMap(w => w.days);

    for (let d = 1; d <= 30; d++) {
        const el = document.createElement('div');
        el.className = 'cal-day';
        el.tabIndex = 0;
        el.setAttribute('role', 'checkbox');
        el.setAttribute('aria-checked', progress[d] ? 'true' : 'false');

        if (progress[d]) el.classList.add('completed');

        const dayData = allDays.find(x => x.day === d);
        let shortTitle = '';
        if (dayData) {
            const words = dayData.title.split(/[\s&]+/);
            shortTitle = words[0].length > 6 ? words[0].substring(0, 6) + '..' : words[0];
        }

        el.innerHTML = `<span class="day-num">${d}</span><span class="day-label">${shortTitle}</span>`;
        el.title = dayData ? `Day ${d}: ${dayData.title}` : `Day ${d}`;
        el.setAttribute('aria-label', dayData ? `Day ${d}: ${dayData.title}` : `Day ${d}`);
        el.addEventListener('click', () => toggleDay(d));
        el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleDay(d); } });
        grid.appendChild(el);
    }
}

// ===== WEEKLY OVERVIEW =====
function renderWeeks() {
    const container = document.getElementById('weeksContainer');
    container.innerHTML = '';

    CURRICULUM.forEach((week, wi) => {
        const card = document.createElement('div');
        card.className = 'week-card';

        const completedInWeek = week.days.filter(d => isDayCompleted(d.day)).length;
        const totalInWeek = week.days.length;
        const weekPercent = Math.round((completedInWeek / totalInWeek) * 100);

        let badgeClass = 'none';
        if (completedInWeek === totalInWeek) badgeClass = 'done';
        else if (completedInWeek > 0) badgeClass = 'partial';

        const objectives = WEEK_OBJECTIVES[week.week] || [];
        const objectivesHtml = objectives.length ? `
            <div class="week-objectives">
                <strong>학습 목표</strong>
                <ul>${objectives.map(o => `<li>${o}</li>`).join('')}</ul>
            </div>` : '';

        card.innerHTML = `
            <div class="week-header" data-week="${wi}" role="button" tabindex="0" aria-expanded="${wi === 0}">
                <span class="week-title">${week.title}</span>
                <div class="week-progress-mini"><div class="week-progress-mini-bar" style="width:${weekPercent}%"></div></div>
                <span class="week-badge ${badgeClass}">${completedInWeek}/${totalInWeek}</span>
            </div>
            <div class="week-body ${wi === 0 ? 'open' : ''}" id="weekBody${wi}">
                ${objectivesHtml}
                ${week.days.map(d => {
                    const meta = DAY_META[d.day] || {};
                    const stars = meta.d ? '★'.repeat(meta.d) + '☆'.repeat(5 - meta.d) : '';
                    return `
                    <div class="day-item">
                        <div class="day-check ${isDayCompleted(d.day) ? 'checked' : ''}" data-day="${d.day}" role="checkbox" tabindex="0" aria-checked="${isDayCompleted(d.day)}" aria-label="Day ${d.day} 완료 체크">&#10003;</div>
                        <div class="day-info">
                            <h4>Day ${d.day}: ${d.title}</h4>
                            <p>${d.summary}</p>
                            <div class="day-meta">
                                ${meta.d ? `<span class="difficulty" title="난이도 ${meta.d}/5">${stars}</span>` : ''}
                                ${meta.t ? `<span class="time">⏱ ${meta.t}분</span>` : ''}
                            </div>
                            <div class="tags">
                                ${d.tags.map(t => `<span class="tag ${t}">${t}</span>`).join('')}
                            </div>
                        </div>
                    </div>`;
                }).join('')}
            </div>
        `;
        container.appendChild(card);
    });

    // Week toggle
    document.querySelectorAll('.week-header').forEach(header => {
        const toggle = () => {
            const wi = header.dataset.week;
            const body = document.getElementById('weekBody' + wi);
            const isOpen = body.classList.toggle('open');
            header.setAttribute('aria-expanded', isOpen);
        };
        header.addEventListener('click', toggle);
        header.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
    });

    // Day checkboxes
    document.querySelectorAll('.day-check').forEach(check => {
        const handler = (e) => {
            e.stopPropagation();
            toggleDay(parseInt(check.dataset.day));
        };
        check.addEventListener('click', handler);
        check.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(e); } });
    });
}

// ===== CURRICULUM PAGE =====
function renderCurriculum() {
    const container = document.getElementById('curriculumContent');
    container.innerHTML = `
        <h1 style="margin-bottom:0.5rem;color:#a78bfa;font-size:1.4rem;">30일 옵시디언 마스터 커리큘럼</h1>
        <p style="color:#8b949e;margin-bottom:1.5rem;font-size:0.85rem;">초보에서 마스터까지 | 매일 실습 포함 | Claude Code 자동화 통합</p>

        <div class="curr-week" style="margin-bottom:1.5rem;">
            <div class="curr-week-header">
                <h2>핵심 플러그인 로드맵</h2>
                <p>이 커리큘럼에서 설치하게 될 주요 플러그인 목록</p>
            </div>
            <div style="padding:1rem 1.5rem;font-size:0.82rem;color:#8b949e;line-height:1.8;">
                <strong style="color:#c9d1d9;">2주차 설치:</strong> Calendar, Periodic Notes, Templater, Dataview, Excalidraw, QuickAdd, Kanban, Tasks, Linter, Commander, Style Settings<br>
                <strong style="color:#c9d1d9;">3주차 설치:</strong> Digital Garden / Quartz, Web Clipper, Obsidian Git, DB Folder, Advanced Tables<br>
                <strong style="color:#c9d1d9;">4주차 설치:</strong> Smart Connections, Obsidian Copilot, Text Generator, Local REST API, Metadata Menu
            </div>
        </div>
    `;

    CURRICULUM.forEach(week => {
        const objectives = WEEK_OBJECTIVES[week.week] || [];
        const objectivesHtml = objectives.length ? `
            <div class="curr-objectives">
                <strong>🎯 이번 주 학습 목표</strong>
                <ul>${objectives.map(o => `<li>${o}</li>`).join('')}</ul>
            </div>` : '';

        const section = document.createElement('div');
        section.className = 'curr-week';
        section.innerHTML = `
            <div class="curr-week-header">
                <h2>${week.title}</h2>
                <p>${week.description}</p>
            </div>
            ${objectivesHtml}
            ${week.days.map(d => {
                const meta = DAY_META[d.day] || {};
                const stars = meta.d ? '★'.repeat(meta.d) + '☆'.repeat(5 - meta.d) : '';
                const noteVal = getNote(d.day).replace(/</g, '&lt;').replace(/>/g, '&gt;');
                return `
                <div class="curr-day">
                    <h3>
                        <span>Day ${d.day}</span> - ${d.title}
                        <span class="curr-meta">
                            ${meta.d ? `<span class="curr-diff" title="난이도 ${meta.d}/5">${stars}</span>` : ''}
                            ${meta.t ? `<span class="curr-time">⏱ ${meta.t}분</span>` : ''}
                        </span>
                    </h3>
                    <div class="curr-detail">
                        <p>${d.summary}</p>
                        <ul>
                            ${d.details.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                        ${d.practice ? `
                        <div class="practice-box">
                            <div class="practice-header" onclick="this.parentElement.classList.toggle('open')" role="button" tabindex="0" aria-expanded="false">
                                <span>&#9997; 오늘의 실습 과제 (상세)</span>
                                <span class="practice-toggle">&#9660;</span>
                            </div>
                            <div class="practice-content">
                                <p>${d.practice}</p>
                            </div>
                        </div>` : ''}
                        ${d.prompt ? `
                        <button class="claude-prompt-btn" onclick="openClaudePrompt(${d.day})" aria-label="Day ${d.day} Claude 프롬프트 열기">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                            Claude에서 실습하기
                        </button>` : ''}
                        <div class="learning-note">
                            <div class="learning-note-header">
                                <span>📝 학습 노트</span>
                                <span class="note-saved" id="noteSaved${d.day}">저장됨</span>
                            </div>
                            <textarea placeholder="오늘 배운 내용, 느낀 점을 메모하세요..." data-day="${d.day}" oninput="handleNoteInput(this)">${noteVal}</textarea>
                        </div>
                        <div class="tags" style="margin-top:0.5rem;">
                            ${d.tags.map(t => `<span class="tag ${t}">${t}</span>`).join('')}
                        </div>
                    </div>
                </div>`;
            }).join('')}
        `;
        container.appendChild(section);
    });
}

let noteDebounce = {};
function handleNoteInput(textarea) {
    const day = textarea.dataset.day;
    clearTimeout(noteDebounce[day]);
    noteDebounce[day] = setTimeout(() => {
        saveNote(day, textarea.value);
        const indicator = document.getElementById('noteSaved' + day);
        if (indicator) {
            indicator.classList.add('show');
            setTimeout(() => indicator.classList.remove('show'), 1500);
        }
    }, 500);
}

// ===== YOUTUBE PAGE =====
function renderYoutube() {
    const container = document.getElementById('youtubeContent');
    container.innerHTML = `
        <h1 style="margin-bottom:0.5rem;color:#a78bfa;font-size:1.4rem;">옵시디언 YouTube 강의 가이드</h1>
        <p style="color:#8b949e;margin-bottom:1.5rem;font-size:0.85rem;">
            검색 키워드를 클릭하면 YouTube에서 바로 검색할 수 있습니다.
        </p>
    `;

    YOUTUBE_DATA.korean.forEach(section => {
        const el = document.createElement('div');
        el.className = 'yt-section';
        el.innerHTML = `
            <h2>${section.section} <span class="yt-badge kr">한국어</span></h2>
            ${section.items.map(item => `
                <div class="yt-item">
                    <div class="yt-title">${item.title}</div>
                    <div class="yt-channel">${item.channel}</div>
                    <div class="yt-desc">${item.desc}</div>
                    <div style="margin-top:0.35rem;">
                        <a href="https://www.youtube.com/results?search_query=${encodeURIComponent(item.search)}" target="_blank" rel="noopener">
                            YouTube에서 검색 &rarr;
                        </a>
                    </div>
                </div>
            `).join('')}
        `;
        container.appendChild(el);
    });

    // Community resources
    const communityEl = document.createElement('div');
    communityEl.className = 'yt-section';
    communityEl.innerHTML = `
        <h2>옵시디언 커뮤니티 & 추가 리소스</h2>
        <div class="yt-item">
            <div class="yt-title">Obsidian 공식 포럼</div>
            <div class="yt-desc">플러그인 소개, 워크플로우 공유, 문제 해결</div>
            <div style="margin-top:0.35rem;"><a href="https://forum.obsidian.md" target="_blank" rel="noopener">forum.obsidian.md &rarr;</a></div>
        </div>
        <div class="yt-item">
            <div class="yt-title">r/ObsidianMD (Reddit)</div>
            <div class="yt-desc">글로벌 옵시디언 커뮤니티. Vault 셋업 공유, 플러그인 추천</div>
            <div style="margin-top:0.35rem;"><a href="https://reddit.com/r/ObsidianMD" target="_blank" rel="noopener">reddit.com/r/ObsidianMD &rarr;</a></div>
        </div>
        <div class="yt-item">
            <div class="yt-title">Obsidian Roundup 뉴스레터</div>
            <div class="yt-desc">매주 옵시디언 업데이트, 새 플러그인, 팁을 정리해주는 뉴스레터</div>
            <div style="margin-top:0.35rem;"><a href="https://www.obsidianroundup.org" target="_blank" rel="noopener">obsidianroundup.org &rarr;</a></div>
        </div>
        <div class="yt-item">
            <div class="yt-title">Obsidian Discord</div>
            <div class="yt-desc">실시간 질의응답, 플러그인 개발자와 소통</div>
            <div style="margin-top:0.35rem;"><a href="https://discord.gg/obsidianmd" target="_blank" rel="noopener">Obsidian Discord &rarr;</a></div>
        </div>
    `;
    container.appendChild(communityEl);

    YOUTUBE_DATA.international.forEach(section => {
        const el = document.createElement('div');
        el.className = 'yt-section';
        el.innerHTML = `
            <h2>${section.section} <span class="yt-badge en">English</span></h2>
            ${section.items.map(item => `
                <div class="yt-item">
                    <div class="yt-title">${item.title}</div>
                    <div class="yt-channel">${item.channel} ${item.url ? `<a href="${item.url}" target="_blank" rel="noopener">[채널]</a>` : ''}</div>
                    <div class="yt-desc">${item.desc}</div>
                    <div style="margin-top:0.35rem;">
                        <a href="https://www.youtube.com/results?search_query=${encodeURIComponent(item.search)}" target="_blank" rel="noopener">
                            YouTube에서 검색 &rarr;
                        </a>
                    </div>
                </div>
            `).join('')}
        `;
        container.appendChild(el);
    });
}

// ===== NAVIGATION =====
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.nav-btn').forEach(b => { b.classList.remove('active'); b.removeAttribute('aria-current'); });
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        btn.setAttribute('aria-current', 'page');
        const page = document.getElementById(btn.dataset.page);
        page.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

// ===== RESET =====
document.getElementById('resetBtn').addEventListener('click', () => {
    if (confirm('모든 진행률과 학습 노트를 초기화하시겠습니까?\n이 작업은 되돌릴 수 없습니다.')) {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(NOTES_KEY);
        localStorage.removeItem(MILESTONE_KEY);
        renderAll();
        renderCurriculum();
    }
});

// ===== DATA EXPORT / IMPORT =====
function exportData() {
    const data = {
        version: 1,
        exportedAt: new Date().toISOString(),
        progress: loadProgress(),
        notes: loadNotes(),
        milestones: JSON.parse(localStorage.getItem(MILESTONE_KEY) || '[]')
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `obsidian-mastery-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('데이터가 내보내기 되었습니다!');
}

function importData(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            if (data.progress) {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(data.progress));
            }
            if (data.notes) {
                localStorage.setItem(NOTES_KEY, JSON.stringify(data.notes));
            }
            if (data.milestones) {
                localStorage.setItem(MILESTONE_KEY, JSON.stringify(data.milestones));
            }
            renderAll();
            renderCurriculum();
            showToast('데이터를 성공적으로 가져왔습니다!');
        } catch {
            showToast('파일을 읽을 수 없습니다. 올바른 백업 파일인지 확인하세요.');
        }
    };
    reader.readAsText(file);
}

// ===== CLAUDE PROMPT =====
function openClaudePrompt(day) {
    const allDays = CURRICULUM.flatMap(w => w.days);
    const dayData = allDays.find(d => d.day === day);
    if (!dayData || !dayData.prompt) return;

    const promptText = `[Obsidian 30일 마스터 - Day ${day}: ${dayData.title}]\n\n${dayData.prompt}`;
    const encoded = encodeURIComponent(promptText);
    const claudeUrl = `https://claude.ai/new?q=${encoded}`;

    if (claudeUrl.length > 8000) {
        navigator.clipboard.writeText(promptText).then(() => {
            showToast('프롬프트가 클립보드에 복사되었습니다! Claude.ai에서 붙여넣기(Ctrl+V) 하세요.');
            window.open('https://claude.ai/new', '_blank');
        }).catch(() => {
            showPromptModal(day, promptText);
        });
    } else {
        window.open(claudeUrl, '_blank');
    }
}

function showToast(message) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = 'position:fixed;bottom:1.5rem;left:50%;transform:translateX(-50%);background:#238636;color:#fff;padding:0.7rem 1.2rem;border-radius:8px;font-size:0.82rem;font-weight:600;z-index:2000;animation:slideUp 0.3s ease;box-shadow:0 4px 12px rgba(0,0,0,0.3);max-width:90%;text-align:center;';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function showPromptModal(day, promptText) {
    const existing = document.getElementById('promptModal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'promptModal';
    modal.className = 'prompt-modal-overlay';
    modal.innerHTML = `
        <div class="prompt-modal">
            <div class="prompt-modal-header">
                <h3>Day ${day} Claude 프롬프트</h3>
                <button class="prompt-modal-close" onclick="document.getElementById('promptModal').remove()" aria-label="닫기">&times;</button>
            </div>
            <pre class="prompt-modal-content">${promptText.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
            <div class="prompt-modal-actions">
                <button onclick="navigator.clipboard.writeText(document.querySelector('.prompt-modal-content').textContent).then(()=>{this.textContent='복사 완료!';setTimeout(()=>{this.textContent='프롬프트 복사'},1500)})" class="copy-btn">프롬프트 복사</button>
                <button onclick="window.open('https://claude.ai/new','_blank')" class="open-btn">Claude.ai 열기</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
    document.addEventListener('keydown', function escHandler(e) { if (e.key === 'Escape') { modal.remove(); document.removeEventListener('keydown', escHandler); } });
}

// ===== SHARE =====
const SITE_URL = 'https://chancenote.github.io/obsidian-master/';
const SHARE_TITLE = 'NEXT COWORK with Obsidian';
const SHARE_DESC = '30일 만에 옵시디언 마스터하기 — 초보에서 전문가까지, Claude Code 자동화 통합 커리큘럼';

function shareKakao() {
    const kakaoUrl = `https://sharer.kakao.com/talk/friends/picker/link?url=${encodeURIComponent(SITE_URL)}&text=${encodeURIComponent(SHARE_TITLE + ' - ' + SHARE_DESC)}`;
    window.open(kakaoUrl, '_blank', 'width=600,height=700');
}

function shareTwitter() {
    const text = `${SHARE_TITLE}\n${SHARE_DESC}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(SITE_URL)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=500');
}

function shareFacebook() {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(SITE_URL)}`;
    window.open(fbUrl, '_blank', 'width=600,height=500');
}

function shareCopyLink() {
    navigator.clipboard.writeText(SITE_URL).then(() => {
        showToast('링크가 클립보드에 복사되었습니다!');
    }).catch(() => {
        const input = document.createElement('input');
        input.value = SITE_URL;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        showToast('링크가 클립보드에 복사되었습니다!');
    });
}

// ===== RENDER ALL =====
function renderAll() {
    updateStats();
    renderCalendar();
    renderWeeks();
    renderAchievements();
}

// ===== INIT =====
renderAll();
renderCurriculum();
renderYoutube();
showOnboarding();

// PWA Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
}

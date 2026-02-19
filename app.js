// ===== STATE MANAGEMENT =====
const STORAGE_KEY = 'obsidian-mastery-progress';

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

// ===== STATS =====
function updateStats() {
    const progress = loadProgress();
    const completed = Object.keys(progress).length;
    const percent = Math.round((completed / 30) * 100);
    const week = completed <= 7 ? '1주차' : completed <= 14 ? '2주차' : completed <= 21 ? '3주차' : '4주차';

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

    document.getElementById('completedDays').textContent = completed;
    document.getElementById('progressPercent').textContent = percent + '%';
    document.getElementById('currentWeek').textContent = week;
    document.getElementById('streak').textContent = streak;
    document.getElementById('mainProgressBar').style.width = percent + '%';
    document.getElementById('progressBarText').textContent = percent + '%';
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
        // Truncate Korean-safe: split by space or use full short title
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

        card.innerHTML = `
            <div class="week-header" data-week="${wi}" role="button" tabindex="0" aria-expanded="${wi === 0}">
                <span class="week-title">${week.title}</span>
                <div class="week-progress-mini"><div class="week-progress-mini-bar" style="width:${weekPercent}%"></div></div>
                <span class="week-badge ${badgeClass}">${completedInWeek}/${totalInWeek}</span>
            </div>
            <div class="week-body ${wi === 0 ? 'open' : ''}" id="weekBody${wi}">
                ${week.days.map(d => `
                    <div class="day-item">
                        <div class="day-check ${isDayCompleted(d.day) ? 'checked' : ''}" data-day="${d.day}" role="checkbox" tabindex="0" aria-checked="${isDayCompleted(d.day)}" aria-label="Day ${d.day} 완료 체크">&#10003;</div>
                        <div class="day-info">
                            <h4>Day ${d.day}: ${d.title}</h4>
                            <p>${d.summary}</p>
                            <div class="tags">
                                ${d.tags.map(t => `<span class="tag ${t}">${t}</span>`).join('')}
                            </div>
                        </div>
                    </div>
                `).join('')}
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
        const section = document.createElement('div');
        section.className = 'curr-week';
        section.innerHTML = `
            <div class="curr-week-header">
                <h2>${week.title}</h2>
                <p>${week.description}</p>
            </div>
            ${week.days.map(d => `
                <div class="curr-day">
                    <h3><span>Day ${d.day}</span> - ${d.title}</h3>
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
                        <div class="tags" style="margin-top:0.5rem;">
                            ${d.tags.map(t => `<span class="tag ${t}">${t}</span>`).join('')}
                        </div>
                    </div>
                </div>
            `).join('')}
        `;
        container.appendChild(section);
    });
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
    if (confirm('모든 진행률을 초기화하시겠습니까?\n이 작업은 되돌릴 수 없습니다.')) {
        localStorage.removeItem(STORAGE_KEY);
        renderAll();
    }
});

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
    toast.style.cssText = 'position:fixed;bottom:1.5rem;left:50%;transform:translateX(-50%);background:#238636;color:#fff;padding:0.7rem 1.2rem;border-radius:8px;font-size:0.82rem;font-weight:600;z-index:2000;animation:slideUp 0.3s ease;box-shadow:0 4px 12px rgba(0,0,0,0.3);';
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

// ===== RENDER ALL =====
function renderAll() {
    updateStats();
    renderCalendar();
    renderWeeks();
}

// ===== INIT =====
renderAll();
renderCurriculum();
renderYoutube();

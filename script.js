/**
 * 치이카와 학급 1인 1역할 배정 웹 애플리케이션 - script.js
 * GitHub Pages 및 브라우저에서 순수 Vanilla JS로 완벽 동작
 */

// 1. 치이카와 스타일 기본 초기 데이터 (학생 12명, 역할 12개)
const DEFAULT_STUDENTS = [
  "김민준", "이서연", "박도윤", "최지우", 
  "정하은", "강서준", "조예은", "윤시우", 
  "장수아", "임지호", "한유진", "오준서"
];

const DEFAULT_ROLES = [
  { id: 1, name: "칠판 뽀송 도우미", icon: "🧼", desc: "쉬는 시간마다 칠판을 반짝반짝 깨끗이 지워요 와아~!" },
  { id: 2, name: "우유 냠냠 급식 도우미", icon: "🥛", desc: "아침 우유를 차례대로 나누어주고 빈 상자를 착착 정리해요!" },
  { id: 3, name: "줄서기 골목 대장", icon: "🚶", desc: "이동 수업 갈 때 친구들과 바르고 얌전하게 두 줄로 서요!" },
  { id: 4, name: "학급 책방 사서 요정", icon: "📚", desc: "학급 문고 책장을 알록달록 깔끔하게 정리해요!" },
  { id: 5, name: "에너지 번개 지킴이", icon: "⚡", desc: "교실을 비울 때 전등과 냉난방기를 톡! 끄는 든든한 지킴이!" },
  { id: 6, name: "초록 식물 집사", icon: "🌱", desc: "화분에 다정하게 물을 퐁퐁 주고 마른 잎을 다정하게 살펴요!" },
  { id: 7, name: "먼지 토벌 청소 대장", icon: "🧹", desc: "빗자루와 쓰레받기를 챙기고 교실 바닥 먼지를 쓱싹 토벌해요!" },
  { id: 8, name: "배움 학습지 나눔이", icon: "📝", desc: "선생님께서 주신 학습지를 친구들에게 소중히 전달해요!" },
  { id: 9, name: "맑은 바람 환기 요정", icon: "🪟", desc: "창문을 활짝 열어 교실에 상쾌하고 맑은 공기를 선물해요!" },
  { id: 10, name: "분리배출 환경 지킴이", icon: "♻️", desc: "깡통 페트병 종이를 바르게 쏙쏙 분리배출해요!" },
  { id: 11, name: "출석·달력 알리미", icon: "📅", desc: "아침마다 날짜판을 톡 넘기고 오늘의 기분 좋은 하루를 열어요!" },
  { id: 12, name: "칭찬 스티커 배달원", icon: "💌", desc: "친구들의 착한 마음을 찾아 칭찬나무에 사랑을 전해요!" }
];

// 치이카와 친구들 테마 컬러 (치이카와 핑크, 하치와레 블루, 우사기 옐로우, 모몽가 퍼플, 쿠리만주 오렌지, 라코 민트)
const CARD_THEMES = ['pink', 'blue', 'yellow', 'purple', 'orange', 'mint'];

// 치이카와 친구들 얼굴 이모티콘
const CHEEK_EMOJIS = ['( •ㅅ• )', '( ^ㅅ^ )', '( ◕ ᵜ ◕ )', '( *´꒳`* )', '( •̀ω•́ )', '( ˶•̀_•́˶ )'];

// 2. 전역 상태 관리
let state = {
  students: [],
  roles: [],
  assignments: [], // [{ studentIndex, studentName, role, cheek }]
  className: "우리들의 행복한 3학년 2반",
  termName: "2025학년도 1학기",
  appsScriptUrl: ""
};

// 3. 로컬 스토리지 동기화
function loadSavedData() {
  try {
    const savedStudents = localStorage.getItem('role_app_students');
    state.students = savedStudents ? JSON.parse(savedStudents) : [...DEFAULT_STUDENTS];

    const savedRoles = localStorage.getItem('role_app_roles');
    state.roles = savedRoles ? JSON.parse(savedRoles) : [...DEFAULT_ROLES];

    const savedAssignments = localStorage.getItem('role_app_assignments');
    state.assignments = savedAssignments ? JSON.parse(savedAssignments) : [];

    const savedConfig = localStorage.getItem('role_app_config');
    if (savedConfig) {
      const parsed = JSON.parse(savedConfig);
      if (parsed.className) state.className = parsed.className;
      if (parsed.termName) state.termName = parsed.termName;
      if (parsed.appsScriptUrl) state.appsScriptUrl = parsed.appsScriptUrl;
    }
  } catch (e) {
    console.error("데이터 로드 중 오류:", e);
    state.students = [...DEFAULT_STUDENTS];
    state.roles = [...DEFAULT_ROLES];
    state.assignments = [];
  }
}

function saveData() {
  try {
    localStorage.setItem('role_app_students', JSON.stringify(state.students));
    localStorage.setItem('role_app_roles', JSON.stringify(state.roles));
    localStorage.setItem('role_app_assignments', JSON.stringify(state.assignments));
    localStorage.setItem('role_app_config', JSON.stringify({
      className: state.className,
      termName: state.termName,
      appsScriptUrl: state.appsScriptUrl
    }));
  } catch (e) {
    console.error("데이터 저장 중 오류:", e);
  }
}

// 4. 귀여운 치이카와 뽀용 사운드 효과 (Web Audio API)
function playSound(type = 'pop') {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    if (type === 'pop') {
      // 뽀-용! 스프링 탄성 사운드
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(840, ctx.currentTime + 0.12);
      osc.frequency.exponentialRampToValueAtTime(560, ctx.currentTime + 0.25);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.36);

      // 맑은 차임벨 하모니
      [659.25, 880, 1046.5].forEach((freq, idx) => {
        const hOsc = ctx.createOscillator();
        const hGain = ctx.createGain();
        hOsc.type = 'triangle';
        hOsc.frequency.setValueAtTime(freq, ctx.currentTime + 0.08 + idx * 0.07);

        hGain.gain.setValueAtTime(0.12, ctx.currentTime + 0.08 + idx * 0.07);
        hGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4 + idx * 0.07);

        hOsc.connect(hGain);
        hGain.connect(ctx.destination);

        hOsc.start(ctx.currentTime + 0.08 + idx * 0.07);
        hOsc.stop(ctx.currentTime + 0.45 + idx * 0.07);
      });
    } else if (type === 'click') {
      // 뾱! 귀여운 클릭음
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(950, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(450, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.08);
    }
  } catch (e) {
    // 오디오 실패 시 무시
  }
}

// 5. 알록달록 파스텔 하트 & 별 폭죽 애니메이션 (Confetti Canvas)
function triggerConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const colors = ['#ff8da1', '#ffb6c1', '#7dd3fc', '#fde047', '#d8b4fe', '#86efac', '#fdba74'];

  for (let i = 0; i < 80; i++) {
    particles.push({
      x: canvas.width / 2 + (Math.random() - 0.5) * 220,
      y: canvas.height * 0.32,
      size: Math.random() * 8 + 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 14,
      vy: Math.random() * -12 - 5,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 12,
      opacity: 1
    });
  }

  function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.38; // gravity
      p.rotation += p.rotationSpeed;
      p.opacity -= 0.012;

      if (p.opacity > 0) {
        alive = true;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.beginPath();
        // 둥글둥글 귀여운 꽃잎 사각형
        ctx.roundRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.3, 4);
        ctx.fill();
        ctx.restore();
      }
    });

    if (alive) {
      requestAnimationFrame(update);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  update();
}

// 6. 무작위 셔플 (Fisher-Yates 알고리즘)
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// 7. 역할 1:1 배정 실행
function executeAssignment() {
  if (state.students.length === 0) {
    showToast("⚠️ 등록된 친구가 없어요! 명단을 먼저 확인해주세요 (｡•́︿•̀｡)");
    return;
  }
  if (state.roles.length === 0) {
    showToast("⚠️ 등록된 학급 역할이 없습니다!");
    return;
  }

  // 셔플된 역할 목록 생성
  const shuffledRoles = shuffleArray(state.roles);
  
  const newAssignments = state.students.map((studentName, idx) => {
    const assignedRole = shuffledRoles[idx % shuffledRoles.length];
    const cheekEmoji = CHEEK_EMOJIS[idx % CHEEK_EMOJIS.length];
    return {
      studentIndex: idx + 1,
      studentName: studentName.trim(),
      role: assignedRole,
      cheek: cheekEmoji
    };
  });

  state.assignments = newAssignments;
  saveData();

  // 뽀용 사운드 및 폭죽
  playSound('pop');
  triggerConfetti();

  // 화면 렌더링
  renderCards();
  renderPrintView();
  showToast("🎉 뽀용! 치이카와 역할이 예쁘게 배정되었습니다! 와아~");
}

// 8. 화면 카드 렌더링 (치이카와 몽글몽글 스타일)
function renderCards() {
  const container = document.getElementById('assignmentGrid');
  const emptyState = document.getElementById('emptyState');
  const boardMeta = document.getElementById('boardMeta');
  const btnReshuffle = document.getElementById('btnReshuffle');
  const btnPrint = document.getElementById('btnPrint');
  const btnCopyText = document.getElementById('btnCopyText');

  updateStatusCounts();

  if (!state.assignments || state.assignments.length === 0) {
    if (emptyState) emptyState.style.display = 'block';
    if (container) container.innerHTML = '';
    if (boardMeta) boardMeta.textContent = '아직 배정된 결과가 없어요.';
    if (btnReshuffle) btnReshuffle.disabled = true;
    if (btnPrint) btnPrint.disabled = true;
    if (btnCopyText) btnCopyText.disabled = true;
    return;
  }

  if (emptyState) emptyState.style.display = 'none';
  if (btnReshuffle) btnReshuffle.disabled = false;
  if (btnPrint) btnPrint.disabled = false;
  if (btnCopyText) btnCopyText.disabled = false;

  const now = new Date();
  const timeStr = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} 배정됨`;
  if (boardMeta) boardMeta.textContent = `총 ${state.assignments.length}명 배정 완료 • ${timeStr}`;

  container.innerHTML = '';

  state.assignments.forEach((item, index) => {
    const theme = CARD_THEMES[index % CARD_THEMES.length];
    const card = document.createElement('div');
    card.className = `role-card theme-${theme}`;
    card.dataset.index = index;
    // 카드 톡-톡 순차 등장 딜레이
    card.style.animationDelay = `${index * 0.04}s`;

    card.innerHTML = `
      <div class="card-header-row">
        <span class="student-badge">
          <span>🐾 ${item.studentIndex}번</span>
        </span>
        <button type="button" class="btn-mini-swap" title="다른 역할로 변경" onclick="openSwapRoleModal(${index})">
          🔄
        </button>
      </div>
      <div class="student-name-box">
        <h3 class="student-name">${escapeHtml(item.studentName)}</h3>
        <span class="student-cheek">${item.cheek || '( •ㅅ• )'}</span>
      </div>
      <div class="role-assigned-box">
        <div class="role-icon-wrapper">
          <span class="role-icon">${item.role.icon || '⭐'}</span>
        </div>
        <strong class="role-label">${escapeHtml(item.role.name)}</strong>
      </div>
      <div class="role-duty-desc">
        <span class="duty-bullet">✔</span>
        <span>${escapeHtml(item.role.desc || '맡은 역할을 성실하게 실천해요!')}</span>
      </div>
    `;

    container.appendChild(card);
  });
}

// 9. A4 게시판 인쇄용 화면 렌더링
function renderPrintView() {
  const printGrid = document.getElementById('printGrid');
  const printClassTitle = document.getElementById('printClassTitle');
  const printMetaDate = document.getElementById('printMetaDate');

  if (printClassTitle) printClassTitle.textContent = `${state.className} 1인 1역할 게시판`;
  if (printMetaDate) {
    const today = new Date();
    const dateStr = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일 기준`;
    printMetaDate.textContent = `${state.termName} | ${dateStr}`;
  }

  if (!printGrid) return;
  printGrid.innerHTML = '';

  state.assignments.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'print-card';
    card.innerHTML = `
      <div class="print-card-header">
        <span class="print-student-name">${escapeHtml(item.studentName)}</span>
        <span class="print-num-badge">🐾 ${item.studentIndex}번</span>
      </div>
      <div class="print-role-box">
        <span class="print-role-icon">${item.role.icon || '⭐'}</span>
        <span class="print-role-name">${escapeHtml(item.role.name)}</span>
      </div>
      <div class="print-duty-desc">
        ${escapeHtml(item.role.desc || '학급 규칙을 잘 지키며 역할을 완수해요.')}
      </div>
    `;
    printGrid.appendChild(card);
  });
}

// 10. 상단 상태 요약 카운트 업데이트
function updateStatusCounts() {
  const studentCountEl = document.getElementById('studentCount');
  const roleCountEl = document.getElementById('roleCount');
  const countStatusPill = document.getElementById('countStatusPill');

  if (studentCountEl) studentCountEl.textContent = state.students.length;
  if (roleCountEl) roleCountEl.textContent = state.roles.length;

  if (countStatusPill) {
    if (state.students.length === state.roles.length && state.students.length > 0) {
      countStatusPill.className = 'count-pill match';
      countStatusPill.innerHTML = `<span>✨ 1:1 배정 준비 완료! (와아~)</span>`;
    } else if (state.students.length > state.roles.length) {
      countStatusPill.className = 'count-pill mismatch';
      countStatusPill.innerHTML = `<span>⚠️ 친구가 역할보다 ${state.students.length - state.roles.length}명 더 많아요 (일부 중복)</span>`;
    } else {
      countStatusPill.className = 'count-pill match';
      countStatusPill.innerHTML = `<span>💡 역할이 친구들보다 ${state.roles.length - state.students.length}개 더 여유있어요</span>`;
    }
  }
}

// 11. 역할 변경 (개별 수동 조정 모달)
let currentSwappingIndex = null;

window.openSwapRoleModal = function(assignmentIndex) {
  currentSwappingIndex = assignmentIndex;
  const currentItem = state.assignments[assignmentIndex];
  if (!currentItem) return;

  const modal = document.getElementById('swapRoleModal');
  const modalDesc = document.getElementById('swapModalDesc');
  const roleSelect = document.getElementById('swapRoleSelect');

  if (modalDesc) {
    modalDesc.textContent = `${currentItem.studentName} 친구(현재: ${currentItem.role.name})의 새로운 역할을 선택해 주세요.`;
  }

  if (roleSelect) {
    roleSelect.innerHTML = '';
    state.roles.forEach((r, idx) => {
      const option = document.createElement('option');
      option.value = idx;
      option.textContent = `${r.icon || '⭐'} ${r.name} - ${r.desc ? r.desc.substring(0, 24) + '...' : ''}`;
      if (r.name === currentItem.role.name) {
        option.selected = true;
      }
      roleSelect.appendChild(option);
    });
  }

  openModal('swapRoleModal');
};

function confirmSwapRole() {
  if (currentSwappingIndex === null) return;
  const roleSelect = document.getElementById('swapRoleSelect');
  if (!roleSelect) return;

  const selectedIdx = parseInt(roleSelect.value, 10);
  const newRole = state.roles[selectedIdx];
  if (newRole && state.assignments[currentSwappingIndex]) {
    state.assignments[currentSwappingIndex].role = newRole;
    saveData();
    renderCards();
    renderPrintView();
    showToast(`✅ ${state.assignments[currentSwappingIndex].studentName} 친구의 역할이 변경되었습니다!`);
  }

  closeModal('swapRoleModal');
  currentSwappingIndex = null;
}

// 12. 구글 스프레드시트 (Apps Script) 연동
async function handleLoadFromSheet() {
  playSound('click');
  
  if (!state.appsScriptUrl) {
    openSettingsModal('tab-sheet');
    showToast("ℹ️ 구글 Apps Script Web App URL을 먼저 등록해 주세요.");
    return;
  }

  showToast("🔄 구글 스프레드시트에서 데이터를 가져오는 중...");
  try {
    const response = await fetch(state.appsScriptUrl + '?action=getData', {
      method: 'GET',
      mode: 'cors'
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    if (data.students && Array.isArray(data.students)) {
      state.students = data.students;
    }
    if (data.roles && Array.isArray(data.roles)) {
      state.roles = data.roles;
    }
    if (data.className) state.className = data.className;

    saveData();
    updateStatusCounts();
    showToast("🎉 구글 스프레드시트 데이터를 성공적으로 불러왔습니다!");
  } catch (error) {
    console.warn("Apps Script 연동 실패:", error);
    openSettingsModal('tab-sheet');
    showToast("⚠️ 시트 연결 실패. Apps Script URL과 배포 설정을 확인해주세요.");
  }
}

async function handleSaveToSheet() {
  playSound('click');

  if (!state.assignments || state.assignments.length === 0) {
    showToast("⚠️ 먼저 [🎲 역할 배정하기]를 진행해 주세요.");
    return;
  }

  if (!state.appsScriptUrl) {
    openSettingsModal('tab-sheet');
    showToast("ℹ️ 시트 저장을 위해 구글 Apps Script Web App URL을 등록해 주세요.");
    return;
  }

  showToast("💾 구글 스프레드시트로 배정 결과를 전송 중...");
  try {
    const payload = {
      action: 'saveAssignments',
      className: state.className,
      termName: state.termName,
      timestamp: new Date().toISOString(),
      assignments: state.assignments.map(a => ({
        index: a.studentIndex,
        studentName: a.studentName,
        roleName: a.role.name,
        roleIcon: a.role.icon,
        roleDesc: a.role.desc
      }))
    };

    await fetch(state.appsScriptUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    showToast("💾 구글 스프레드시트에 배정 결과가 저장 요청되었습니다!");
  } catch (error) {
    console.error("시트 저장 오류:", error);
    showToast("⚠️ 저장 중 오류가 발생했습니다. URL을 확인해 주세요.");
  }
}

// 13. 텍스트 복사 (알림장, 쿨메신저, 학부모 공지용)
function copyAssignmentsToClipboard() {
  if (!state.assignments || state.assignments.length === 0) {
    showToast("⚠️ 복사할 배정 결과가 없습니다.");
    return;
  }

  let text = `[🏫 ${state.className} 치이카와 1인 1역할 배정 결과]\n`;
  text += `📅 ${state.termName}\n`;
  text += `------------------------------------\n`;
  state.assignments.forEach(a => {
    text += `${a.studentIndex}번 ${a.studentName}: ${a.role.icon || '⭐'} ${a.role.name} (${a.role.desc})\n`;
  });
  text += `------------------------------------\n`;
  text += `우리 모두 맡은 역할을 씩씩하게 실천해요! 와아~( ˶ˆᗜˆ˵ )`;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast("📋 배정 결과가 클립보드에 복사되었습니다!");
    }).catch(() => {
      fallbackCopy(text);
    });
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand('copy');
    showToast("📋 배정 결과가 클립보드에 복사되었습니다!");
  } catch (err) {
    showToast("⚠️ 클립보드 복사에 실패했습니다.");
  }
  document.body.removeChild(textarea);
}

// 14. 설정 및 관리 모달 제어
function openSettingsModal(defaultTab = 'tab-students') {
  const studentsTextarea = document.getElementById('inputStudentsText');
  const appsScriptInput = document.getElementById('inputAppsScriptUrl');
  const classNameInput = document.getElementById('inputClassName');
  const termNameInput = document.getElementById('inputTermName');

  if (studentsTextarea) {
    studentsTextarea.value = state.students.join('\n');
  }
  if (appsScriptInput) {
    appsScriptInput.value = state.appsScriptUrl || '';
  }
  if (classNameInput) {
    classNameInput.value = state.className || '';
  }
  if (termNameInput) {
    termNameInput.value = state.termName || '';
  }

  renderRolesFormList();
  switchTab(defaultTab);
  openModal('settingsModal');
}

function renderRolesFormList() {
  const rolesContainer = document.getElementById('rolesInputList');
  if (!rolesContainer) return;
  rolesContainer.innerHTML = '';

  state.roles.forEach((role, idx) => {
    const row = document.createElement('div');
    row.style.cssText = 'display:flex; gap:8px; align-items:center; margin-bottom:10px; background:#fff5f7; padding:10px 14px; border-radius:14px; border:2px solid #ffd6e0;';
    row.innerHTML = `
      <span style="font-weight:bold; font-size:0.9rem; color:#ff6b8b; min-width:24px;">${idx + 1}</span>
      <input type="text" class="form-input role-icon-input" value="${escapeHtml(role.icon || '⭐')}" style="width:52px; text-align:center; padding:6px 4px;" title="이모지">
      <input type="text" class="form-input role-name-input" value="${escapeHtml(role.name)}" style="width:145px; font-weight:bold; padding:6px 10px;" placeholder="역할 이름">
      <input type="text" class="form-input role-desc-input" value="${escapeHtml(role.desc)}" style="flex-grow:1; padding:6px 10px;" placeholder="역할 설명 및 임무">
      <button type="button" style="background:#fee2e2; border:none; color:#dc2626; border-radius:8px; padding:6px 10px; cursor:pointer;" onclick="deleteRoleRow(${idx})">🗑️</button>
    `;
    rolesContainer.appendChild(row);
  });
}

window.deleteRoleRow = function(idx) {
  state.roles.splice(idx, 1);
  renderRolesFormList();
};

window.addNewRoleRow = function() {
  state.roles.push({
    id: Date.now(),
    name: "새 학급 역할",
    icon: "🌟",
    desc: "친구들을 다정하게 돕고 솔선수범해요 와아~!"
  });
  renderRolesFormList();
};

function saveSettings() {
  const studentsTextarea = document.getElementById('inputStudentsText');
  const appsScriptInput = document.getElementById('inputAppsScriptUrl');
  const classNameInput = document.getElementById('inputClassName');
  const termNameInput = document.getElementById('inputTermName');

  if (studentsTextarea) {
    const rawLines = studentsTextarea.value.split('\n');
    const cleaned = rawLines.map(s => s.trim()).filter(s => s.length > 0);
    state.students = cleaned;
  }

  const rolesContainer = document.getElementById('rolesInputList');
  if (rolesContainer) {
    const rows = rolesContainer.children;
    const newRoles = [];
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const icon = row.querySelector('.role-icon-input')?.value.trim() || '⭐';
      const name = row.querySelector('.role-name-input')?.value.trim() || '역할';
      const desc = row.querySelector('.role-desc-input')?.value.trim() || '';
      if (name) {
        newRoles.push({ id: i + 1, name, icon, desc });
      }
    }
    state.roles = newRoles;
  }

  if (appsScriptInput) state.appsScriptUrl = appsScriptInput.value.trim();
  if (classNameInput) state.className = classNameInput.value.trim() || "우리 반";
  if (termNameInput) state.termName = termNameInput.value.trim() || "1학기";

  saveData();
  updateStatusCounts();
  renderPrintView();

  const schoolTag = document.getElementById('headerClassTitle');
  if (schoolTag) schoolTag.textContent = state.className;

  closeModal('settingsModal');
  showToast("💾 설정이 성공적으로 저장되었습니다!");
}

function resetToDefaultData() {
  if (confirm("치이카와 12명 학생과 12개 기본 역할로 초기화하시겠습니까?")) {
    state.students = [...DEFAULT_STUDENTS];
    state.roles = [...DEFAULT_ROLES];
    state.assignments = [];
    saveData();
    renderCards();
    renderPrintView();
    updateStatusCounts();
    closeModal('settingsModal');
    showToast("🔄 치이카와 기본 예시 데이터로 초기화되었습니다.");
  }
}

// 15. 모달 도우미 함수
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add('active');
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove('active');
}

function switchTab(targetTabId) {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === targetTabId);
  });
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.toggle('active', content.id === targetTabId);
  });
}

// 16. 토스트 알림 표시
function showToast(message) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(15px)';
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, 2800);
}

// 17. 보안을 위한 HTML 엔티티 이스케이프
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// 18. 페이지 초기화 및 이벤트 리스너 바인딩
document.addEventListener('DOMContentLoaded', () => {
  loadSavedData();

  const headerClassTitle = document.getElementById('headerClassTitle');
  if (headerClassTitle) headerClassTitle.textContent = state.className;

  // 배정 버튼 이벤트
  const btnAssign = document.getElementById('btnAssign');
  if (btnAssign) btnAssign.addEventListener('click', executeAssignment);

  const btnReshuffle = document.getElementById('btnReshuffle');
  if (btnReshuffle) btnReshuffle.addEventListener('click', () => {
    playSound('click');
    executeAssignment();
  });

  // 인쇄 버튼 이벤트
  const btnPrint = document.getElementById('btnPrint');
  if (btnPrint) btnPrint.addEventListener('click', () => {
    playSound('click');
    renderPrintView();
    window.print();
  });

  // 텍스트 복사 버튼
  const btnCopyText = document.getElementById('btnCopyText');
  if (btnCopyText) btnCopyText.addEventListener('click', () => {
    playSound('click');
    copyAssignmentsToClipboard();
  });

  // 시트 불러오기 및 저장 버튼
  const btnLoadSheet = document.getElementById('btnLoadSheet');
  if (btnLoadSheet) btnLoadSheet.addEventListener('click', handleLoadFromSheet);

  const btnSaveSheet = document.getElementById('btnSaveSheet');
  if (btnSaveSheet) btnSaveSheet.addEventListener('click', handleSaveToSheet);

  // 설정 모달 열기
  const btnOpenSettings = document.getElementById('btnOpenSettings');
  if (btnOpenSettings) btnOpenSettings.addEventListener('click', () => {
    playSound('click');
    openSettingsModal('tab-students');
  });

  const btnConfigSheet = document.getElementById('btnConfigSheet');
  if (btnConfigSheet) btnConfigSheet.addEventListener('click', () => {
    playSound('click');
    openSettingsModal('tab-sheet');
  });

  // 모달 탭 클릭 이벤트
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      switchTab(e.target.dataset.tab);
    });
  });

  // 모달 닫기 버튼들
  document.querySelectorAll('.btn-close-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const modal = e.target.closest('.modal-backdrop');
      if (modal) modal.classList.remove('active');
    });
  });

  // 모달 외부 클릭 닫기
  document.querySelectorAll('.modal-backdrop').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  });

  // 설정 저장 버튼
  const btnSaveSettings = document.getElementById('btnSaveSettings');
  if (btnSaveSettings) btnSaveSettings.addEventListener('click', saveSettings);

  // 기본값 복원 버튼
  const btnResetDefaults = document.getElementById('btnResetDefaults');
  if (btnResetDefaults) btnResetDefaults.addEventListener('click', resetToDefaultData);

  // 역할 수동 스왑 확인
  const btnConfirmSwap = document.getElementById('btnConfirmSwap');
  if (btnConfirmSwap) btnConfirmSwap.addEventListener('click', confirmSwapRole);

  // 첫 화면 렌더링
  if (state.assignments.length === 0) {
    executeAssignment();
  } else {
    renderCards();
    renderPrintView();
  }
});

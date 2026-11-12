import { GameManager } from './game_manager.js';
import { CONFIG, NARRATIVE } from './game_data.js';

export class DeskUI {
  constructor(gameManager, options = {}) {
    this.gm = gameManager;
    this.options = options;
    this.currentPendingAction = null;
    this.docOpenedTimestamp = 0;
    this.displayedAchievements = new Set();

    this.initDOMElements();
    this.bindEvents();
    this.startBackgroundSimulations();
    this.updateAllDisplays();
  }

  initDOMElements() {
    this.container = document.getElementById('office-desk-container');
    this.dioramaWrapper = document.getElementById('diorama-3d-wrapper');
    this.ledBudget = document.getElementById('led-budget-val');
    this.barTourism = document.getElementById('bar-tourism-fill');
    this.valTourism = document.getElementById('val-tourism');
    this.barAdmin = document.getElementById('bar-admin-fill');
    this.valAdmin = document.getElementById('val-admin');
    this.barComplaints = document.getElementById('bar-complaints-fill');
    this.valComplaints = document.getElementById('val-complaints');
    this.turnText = document.getElementById('turn-text');
    this.chapterText = document.getElementById('chapter-text');

    // News banner
    this.newsTicker = document.getElementById('news-ticker-text');
    this.mayorQuote = document.getElementById('mayor-quote-text');
    this.interpreterFace = document.getElementById('interpreter-face');
    this.interpreterMood = document.getElementById('interpreter-mood');

    // Props & modals
    this.stickyNotesZone = document.getElementById('sticky-notes-zone');
    this.meltdownProps = document.getElementById('director-meltdown-props');
    this.zoneModal = document.getElementById('zone-picker-modal');
    this.zoneOptionsGrid = document.getElementById('zone-options-grid');
    this.docModal = document.getElementById('document-overlay-modal');
    this.officialDoc = document.getElementById('official-document');
    this.toastContainer = document.getElementById('achievement-toast-container');
  }

  bindEvents() {
    // Action drawer buttons
    document.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const actionType = e.currentTarget.dataset.action;
        this.handleActionClick(actionType);
      });
    });

    document.getElementById('zone-modal-cancel')?.addEventListener('click', () => {
      this.closeZoneModal();
    });
  }

  handleActionClick(type) {
    if (this.gm.finished) return;

    if (type === 'rest') {
      this.executeTurnAction({ type: 'rest' });
    } else if (type === 'hearing') {
      this.executeTurnAction({ type: 'hearing' });
    } else if (type === 'repay') {
      const repayAmount = Math.min(this.gm.debt, this.gm.budget, 2);
      this.executeTurnAction({ type: 'repay', amount: repayAmount });
    } else if (['wheel', 'market', 'event'].includes(type)) {
      this.openZoneModal(type, (chosenZone) => {
        this.executeTurnAction({ type: type, zone: chosenZone });
      });
    } else if (type === 'shuttle') {
      this.openShuttleModal((fromZone, toZone) => {
        this.executeTurnAction({ type: 'shuttle', zone: fromZone, to_zone: toZone });
      });
    }
  }

  openZoneModal(actionType, callback) {
    const titles = {
      wheel: '🎡 選擇摩天輪空投行政區 (花費 $8 億)',
      market: '🏪 選擇愛情商圈進駐行政區 (花費 $3 億)',
      event: '💕 選擇免洗巡迴活動舉辦區 (花費 $2 億)'
    };
    document.getElementById('zone-modal-title').textContent = titles[actionType] || '選擇目標區域';
    this.zoneOptionsGrid.innerHTML = '';

    for (const z of CONFIG.zones) {
      const meta = CONFIG.zone_metadata[z];
      const card = document.createElement('div');
      card.className = 'zone-select-card';
      
      const count = this.gm.count_zone(actionType, z);
      let statusText = `現有: ${count}`;
      if (actionType === 'wheel' && z === '舊城區') {
        statusText += ' (上限 3 座可穿模)';
      }
      
      card.innerHTML = `
        <div>
          <strong>${meta.display_name}</strong> (高度 ${meta.elevation})
          <div style="font-size:11px;color:#666;">${meta.description}</div>
        </div>
        <span style="font-size:12px;color:#d9480f;font-weight:bold;">${statusText}</span>
      `;

      card.addEventListener('click', () => {
        this.closeZoneModal();
        callback(z);
      });
      this.zoneOptionsGrid.appendChild(card);
    }
    this.zoneModal.style.display = 'block';
  }

  openShuttleModal(callback) {
    document.getElementById('zone-modal-title').textContent = '🚌 選擇長官紅筆接駁軌道端點 (花費 $3 億)';
    this.zoneOptionsGrid.innerHTML = '';

    const pairs = [];
    for (let i = 0; i < CONFIG.zones.length; i++) {
      for (let j = i + 1; j < CONFIG.zones.length; j++) {
        const z1 = CONFIG.zones[i];
        const z2 = CONFIG.zones[j];
        const exists = this.gm.buildings.some(b => 
          b.type === 'shuttle' && 
          ((b.zone === z1 && b.to_zone === z2) || (b.zone === z2 && b.to_zone === z1))
        );
        pairs.push({ z1, z2, exists });
      }
    }

    for (const p of pairs) {
      const card = document.createElement('div');
      card.className = 'zone-select-card';
      if (p.exists) card.style.opacity = '0.5';

      let specialTag = '';
      if ([p.z1, p.z2].includes('港灣區') && [p.z1, p.z2].includes('山城區')) {
        specialTag = '<span style="color:#e03131;font-weight:bold;"> [80度落差-解鎖牛頓眼淚]</span>';
      }

      card.innerHTML = `
        <div>
          <strong>${CONFIG.zone_metadata[p.z1].display_name} ⟷ ${CONFIG.zone_metadata[p.z2].display_name}</strong>${specialTag}
        </div>
        <span style="font-size:12px;color:#2b8a3e;font-weight:bold;">${p.exists ? '已連通' : '點擊拉線'}</span>
      `;

      if (!p.exists) {
        card.addEventListener('click', () => {
          this.closeZoneModal();
          callback(p.z1, p.z2);
        });
      }
      this.zoneOptionsGrid.appendChild(card);
    }
    this.zoneModal.style.display = 'block';
  }

  closeZoneModal() {
    this.zoneModal.style.display = 'none';
  }

  executeTurnAction(action) {
    this.currentPendingAction = action;
    // Broadcast action event for 3D diorama VFX in Stage 3
    if (this.options.onActionChosen) {
      this.options.onActionChosen(action);
    }
    // Present the event document for stamping
    this.presentEventDocument();
  }

  presentEventDocument() {
    // Select the event for this turn
    let ev;
    try {
      ev = this.gm.select_event();
    } catch (err) {
      console.error(err);
      return;
    }

    this.currentEvent = ev;
    this.docOpenedTimestamp = performance.now();

    // Trigger Bokeh Blur on 3D Diorama
    this.dioramaWrapper.classList.add('bokeh-blur');

    // Populate document content
    document.getElementById('doc-id').textContent = ev.id;
    document.getElementById('doc-chapter-label').textContent = `第 ${ev.chapter} 章決行`;
    document.getElementById('doc-title').textContent = `主旨：${ev.title}`;

    const choicesContainer = document.getElementById('doc-choices');
    choicesContainer.innerHTML = '';

    ev.choices.forEach(ch => {
      const box = document.createElement('div');
      box.className = 'choice-box';
      box.id = `choice-box-${ch.id}`;

      const deltaSpans = [];
      if (ch.delta.budget !== 0) deltaSpans.push(`<span class="delta-budget">預算 ${ch.delta.budget > 0 ? '+' : ''}${ch.delta.budget}億</span>`);
      if (ch.delta.tourism !== 0) deltaSpans.push(`<span class="delta-tourism">觀光 ${ch.delta.tourism > 0 ? '+' : ''}${ch.delta.tourism}</span>`);
      if (ch.delta.admin !== 0) deltaSpans.push(`<span class="delta-admin">行政負擔 ${ch.delta.admin > 0 ? '+' : ''}${ch.delta.admin}</span>`);
      if (ch.delta.complaints !== 0) deltaSpans.push(`<span class="delta-complaints">陳情 ${ch.delta.complaints > 0 ? '+' : ''}${ch.delta.complaints}</span>`);

      box.innerHTML = `
        <div class="choice-label-row">
          <span class="choice-name">【方案 ${ch.id}】 ${ch.label}</span>
          <div class="choice-deltas">${deltaSpans.join('') || '<span style="color:#888;">無數值異動</span>'}</div>
        </div>
        <div class="stamp-seal" id="seal-${ch.id}">如擬</div>
      `;

      box.addEventListener('click', () => {
        this.stampDocumentDecision(ch.id);
      });

      choicesContainer.appendChild(box);
    });

    this.docModal.style.display = 'flex';
    requestAnimationFrame(() => {
      this.officialDoc.classList.add('doc-active');
    });

    // Notify Audio engine of document slide-in (ducking)
    if (this.options.onDocumentOpen) {
      this.options.onDocumentOpen();
    }
  }

  stampDocumentDecision(choiceId) {
    const elapsedMs = performance.now() - this.docOpenedTimestamp;
    const seal = document.getElementById(`seal-${choiceId}`);
    const otherChoiceId = choiceId === 'A' ? 'B' : 'A';
    const otherBox = document.getElementById(`choice-box-${otherChoiceId}`);

    // Wooden seal slam animation
    if (seal) seal.classList.add('stamp-active');
    // Struck-out red pen line on rejected choice
    if (otherBox) otherBox.classList.add('struck-out');

    // 0.2s Screen shake
    this.container.classList.add('screen-shake');
    setTimeout(() => {
      this.container.classList.remove('screen-shake');
    }, 250);

    // Audio callback on stamp slam
    if (this.options.onStampSlam) {
      this.options.onStampSlam();
    }

    // Resolve turn after stamp animation finishes
    setTimeout(() => {
      this.officialDoc.classList.remove('doc-active');
      this.dioramaWrapper.classList.remove('bokeh-blur');
      this.docModal.style.display = 'none';

      // Execute in GameManager
      try {
        const turnResult = this.gm.play(this.currentPendingAction, choiceId, elapsedMs);
        this.onTurnResolved(turnResult);
      } catch (err) {
        console.error('Play error:', err);
      }
    }, 700);
  }

  onTurnResolved(result) {
    this.updateAllDisplays();

    // Trigger VFX callback for 3D stage
    if (this.options.onVfxCallback && result.vfx_callback) {
      this.options.onVfxCallback(result.vfx_callback);
    }

    // Check newly unlocked achievements
    for (const achId of result.achievements) {
      if (!this.displayedAchievements.has(achId)) {
        this.displayedAchievements.add(achId);
        this.showAchievementToast(achId);
      }
    }

    // Game Finished check
    if (this.gm.finished) {
      setTimeout(() => {
        if (this.options.onGameFinished) {
          this.options.onGameFinished(this.gm.ending(), this.gm.snapshot());
        }
      }, 1000);
    }
  }

  showAchievementToast(achId) {
    const ach = NARRATIVE.achievements.find(a => a.id === achId);
    if (!ach) return;

    const toast = document.createElement('div');
    toast.className = 'achievement-toast';
    toast.innerHTML = `
      <div class="toast-icon">${ach.icon}</div>
      <div class="toast-text">
        <span class="toast-sub">★ 達成成就 UNLOCKED</span>
        <span class="toast-title">${ach.title}：${ach.description}</span>
      </div>
    `;

    this.toastContainer.appendChild(toast);
    requestAnimationFrame(() => {
      toast.classList.add('toast-show');
    });

    setTimeout(() => {
      toast.classList.remove('toast-show');
      setTimeout(() => toast.remove(), 400);
    }, 4500);
  }

  updateAllDisplays() {
    // LED Budget
    const nb = this.gm.net_budget;
    this.ledBudget.textContent = `${nb >= 0 ? '$' : '-$'}${Math.abs(nb).toFixed(1)} 億`;
    if (nb < 0) {
      this.ledBudget.classList.add('led-deficit');
    } else {
      this.ledBudget.classList.remove('led-deficit');
    }

    // Stats progress bars
    this.barTourism.style.width = `${this.gm.tourism}%`;
    this.valTourism.textContent = `${this.gm.tourism}`;
    this.barAdmin.style.width = `${this.gm.admin}%`;
    this.valAdmin.textContent = `${this.gm.admin}`;
    this.barComplaints.style.width = `${this.gm.complaints}%`;
    this.valComplaints.textContent = `${this.gm.complaints}`;

    // Turn / Chapter
    const currentChapter = Math.min(4, Math.floor((this.gm.turn - 1) / 3) + 1);
    const displayTurn = Math.min(12, this.gm.turn);
    this.turnText.textContent = `第 ${displayTurn} / 12 回合`;
    this.chapterText.textContent = `第 ${currentChapter} 章`;

    // Dynamic sticky notes based on Admin burden
    this.renderStickyNotes();

    // Finance director meltdown props
    this.renderMeltdownProps();

    // Disable unaffordable build actions
    this.updateActionButtonsAvailability();
  }

  updateActionButtonsAvailability() {
    document.querySelectorAll('[data-action]').forEach(btn => {
      const type = btn.dataset.action;
      const bInfo = CONFIG.buildings[type];
      if (bInfo) {
        const shortfall = Math.max(0, bInfo.cost - this.gm.budget);
        if (this.gm.debt + shortfall > 12) {
          btn.classList.add('btn-disabled');
        } else {
          btn.classList.remove('btn-disabled');
        }
      }
    });
  }

  renderStickyNotes() {
    this.stickyNotesZone.innerHTML = '';
    const noteCount = Math.floor(this.gm.admin / 18);
    const phrases = [
      '急件！市長要求摩天輪粉紅色霓虹燈必須在下週完工！',
      '特急！舊城區居民集體抗議日照權遭巨輪遮蔽！',
      '極機密：經發局報告建議將香腸攤納入高科技產業！',
      '長官震怒！80度接駁公車被拍到在空中翻轉兩圈！',
      '請速簽：山城區居民要求每戶配置個人高空滑索！',
      '限今日下班前回覆：五區代表要求重新計算平等指標！'
    ];
    const colors = ['note-yellow', 'note-pink', 'note-orange'];

    for (let i = 0; i < noteCount; i++) {
      const note = document.createElement('div');
      note.className = `sticky-note ${colors[i % colors.length]}`;
      const rot = (i % 2 === 0 ? -1 : 1) * (5 + (i * 4) % 15);
      
      // Position around perimeter
      if (i < 2) {
        note.style.left = `${15 + i * 160}px`;
        note.style.top = '70px';
      } else if (i < 4) {
        note.style.right = `${260 + (i - 2) * 160}px`;
        note.style.top = '70px';
      } else {
        note.style.left = '20px';
        note.style.bottom = `${120 + (i - 4) * 110}px`;
      }
      note.style.transform = `rotate(${rot}deg)`;
      note.textContent = phrases[i % phrases.length];
      this.stickyNotesZone.appendChild(note);
    }
  }

  renderMeltdownProps() {
    this.meltdownProps.innerHTML = '';
    const stage = this.gm.meltdown_stage;

    if (stage === 1) {
      const note = document.createElement('div');
      note.className = 'sticky-note note-blue';
      note.textContent = NARRATIVE.finance_director_notes.stage_1[0];
      this.meltdownProps.appendChild(note);
    } else if (stage === 2) {
      const note = document.createElement('div');
      note.className = 'sticky-note note-yellow';
      note.style.borderColor = '#fa5252';
      note.innerHTML = `<strong>⚠️ 財政嚴重告急！</strong><br>${NARRATIVE.finance_director_notes.stage_2[1]}`;
      this.meltdownProps.appendChild(note);
    } else if (stage === 3) {
      this.meltdownProps.innerHTML = `
        <div class="iv-drip-bag">
          <div style="font-size:9px;font-weight:bold;color:#fa5252;">緊急預備金</div>
          <div class="iv-liquid"></div>
        </div>
        <div class="hospital-chart">
          🏥 高雄榮總診斷書<br>
          病患：財政局長<br>
          症狀：急性摩天輪赤字焦慮症<br>
          醫囑：請勿再提愛情經濟
        </div>
      `;
    }
  }

  startBackgroundSimulations() {
    // Mayor quote rotation every 10 seconds
    let quoteIdx = 0;
    setInterval(() => {
      quoteIdx = (quoteIdx + 1) % NARRATIVE.mayor_quotes.length;
      if (this.mayorQuote) {
        this.mayorQuote.textContent = NARRATIVE.mayor_quotes[quoteIdx];
      }
      // Update interpreter avatar based on quote content
      if (quoteIdx % 4 === 0) {
        this.setInterpreterState('facepalm');
      } else if (quoteIdx % 3 === 0) {
        this.setInterpreterState('frown');
      } else if (quoteIdx % 5 === 0) {
        this.setInterpreterState('strike_x');
      } else {
        this.setInterpreterState('calm');
      }
    }, 9000);

    // News ticker rotation
    let tickerIdx = 0;
    setInterval(() => {
      tickerIdx = (tickerIdx + 1) % NARRATIVE.news_ticker.length;
      if (this.newsTicker) {
        this.newsTicker.textContent = NARRATIVE.news_ticker[tickerIdx].text;
      }
    }, 12000);
  }

  setInterpreterState(stateKey) {
    const state = NARRATIVE.interpreter_states[stateKey] || NARRATIVE.interpreter_states.calm;
    if (this.interpreterFace) this.interpreterFace.textContent = state.icon;
    if (this.interpreterMood) this.interpreterMood.textContent = state.mood;
  }
}

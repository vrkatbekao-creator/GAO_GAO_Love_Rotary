import { GameManager } from './game_manager.js';
import { CONFIG, NARRATIVE } from './game_data.js';
import { t, getLocale, setLocale, ZONE_NAMES, MAYOR_QUOTES, NEWS_TICKER, INTERPRETER_MOODS } from './i18n.js';
import { getLocalizedEvent } from './i18n_events.js';
import { ACHIEVEMENTS_I18N } from './i18n_endings.js';

export class DeskUI {
  constructor(gameManager, options = {}) {
    this.gm = gameManager;
    this.options = options;
    this.currentPendingAction = null;
    this.docOpenedTimestamp = 0;
    this.displayedAchievements = new Set();
    this.quoteIdx = 0;
    this.tickerIdx = 0;

    this.initDOMElements();
    this.bindEvents();
    this.startBackgroundSimulations();
    this.updateLanguageStrings();
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
    this.newsBadge = document.querySelector('.news-badge');
    this.newsTicker = document.getElementById('news-ticker-text');
    this.mayorQuote = document.getElementById('mayor-quote-text');
    this.interpreterFace = document.getElementById('interpreter-face');
    this.interpreterMood = document.getElementById('interpreter-mood');
    this.interpreterTitle = document.getElementById('label-interpreter-title');
    this.langSelect = document.getElementById('lang-select');

    // Props & modals
    this.stickyNotesZone = document.getElementById('sticky-notes-zone');
    this.meltdownProps = document.getElementById('director-meltdown-props');
    this.zoneModal = document.getElementById('zone-picker-modal');
    this.zoneOptionsGrid = document.getElementById('zone-options-grid');
    this.docModal = document.getElementById('document-overlay-modal');
    this.officialDoc = document.getElementById('official-document');
    this.toastContainer = document.getElementById('achievement-toast-container');

    if (this.langSelect) {
      this.langSelect.value = getLocale();
    }
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

    // Language dropdown change
    if (this.langSelect) {
      this.langSelect.addEventListener('change', (e) => {
        setLocale(e.target.value);
        this.updateLanguageStrings();
        this.updateAllDisplays();
      });
    }
  }

  updateLanguageStrings() {
    const lang = getLocale();
    document.title = t('app_title');

    if (this.newsBadge) this.newsBadge.textContent = t('news_badge');
    if (this.interpreterTitle) this.interpreterTitle.textContent = t('interpreter_title');

    // Dashboard labels
    const ledTitle = document.querySelector('.led-title');
    if (ledTitle) ledTitle.textContent = t('net_budget_label');

    const statLabels = document.querySelectorAll('.stat-label-wrap span:first-child');
    if (statLabels[0]) statLabels[0].textContent = t('tourism_label');
    if (statLabels[1]) statLabels[1].textContent = t('admin_label');
    if (statLabels[2]) statLabels[2].textContent = t('complaints_label');

    // Action buttons labels
    const actionDefs = [
      { type: 'wheel', title: 'act_wheel', cost: 'act_wheel_cost' },
      { type: 'shuttle', title: 'act_shuttle', cost: 'act_shuttle_cost' },
      { type: 'market', title: 'act_market', cost: 'act_market_cost' },
      { type: 'event', title: 'act_event', cost: 'act_event_cost' },
      { type: 'hearing', title: 'act_hearing', cost: 'act_hearing_cost' },
      { type: 'repay', title: 'act_repay', cost: 'act_repay_cost' },
      { type: 'rest', title: 'act_rest', cost: 'act_rest_cost' }
    ];

    actionDefs.forEach(def => {
      const btn = document.querySelector(`[data-action="${def.type}"]`);
      if (btn) {
        const titleSpan = btn.querySelector('span:first-child');
        const costBadge = btn.querySelector('.cost-badge');
        if (titleSpan) titleSpan.textContent = t(def.title);
        if (costBadge) costBadge.textContent = t(def.cost);
      }
    });

    // Modal cancel button
    const cancelBtn = document.getElementById('zone-modal-cancel');
    if (cancelBtn) cancelBtn.textContent = t('modal_cancel');

    // Current quotes & ticker
    const quotes = MAYOR_QUOTES[lang] || MAYOR_QUOTES.zh;
    if (this.mayorQuote) {
      this.mayorQuote.textContent = quotes[this.quoteIdx % quotes.length];
    }
    const tickers = NEWS_TICKER[lang] || NEWS_TICKER.zh;
    if (this.newsTicker) {
      this.newsTicker.textContent = tickers[this.tickerIdx % tickers.length];
    }
  }

  handleActionClick(type) {
    if (this.gm.finished) return;

    // Turn 1 mandatory constraint reminder
    if (this.gm.turn === 1 && type !== 'wheel') {
      alert(t('turn1_mandatory_alert'));
      return;
    }

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
    const lang = getLocale();
    const titles = {
      wheel: t('zone_select_title_wheel'),
      shuttle: t('zone_select_title_shuttle'),
      market: t('zone_select_title_market'),
      event: t('zone_select_title_event')
    };
    document.getElementById('zone-modal-title').textContent = titles[actionType] || 'Select Zone';
    this.zoneOptionsGrid.innerHTML = '';

    const zoneDict = ZONE_NAMES[lang] || ZONE_NAMES.zh;

    for (const z of CONFIG.zones) {
      const meta = CONFIG.zone_metadata[z];
      const zInfo = zoneDict[z] || { display: meta.display_name, desc: meta.description };

      const card = document.createElement('div');
      card.className = 'zone-select-card';
      
      const count = this.gm.count_zone(actionType, z);
      let statusText = t('zone_status_existing', count);
      if (actionType === 'wheel' && z === '舊城區') {
        statusText = t('zone_status_old_town', count);
      }
      
      card.innerHTML = `
        <div>
          <strong>${zInfo.display}</strong> (Elev. ${meta.elevation})
          <div style="font-size:11px;color:#666;">${zInfo.desc}</div>
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
    const lang = getLocale();
    document.getElementById('zone-modal-title').textContent = t('zone_select_title_shuttle');
    this.zoneOptionsGrid.innerHTML = '';

    const zoneDict = ZONE_NAMES[lang] || ZONE_NAMES.zh;

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
        specialTag = `<span style="color:#e03131;font-weight:bold;">${t('shuttle_newton_tag')}</span>`;
      }

      const name1 = zoneDict[p.z1]?.display || p.z1;
      const name2 = zoneDict[p.z2]?.display || p.z2;

      card.innerHTML = `
        <div>
          <strong>${name1} ⟷ ${name2}</strong>${specialTag}
        </div>
        <span style="font-size:12px;color:#2b8a3e;font-weight:bold;">${p.exists ? t('shuttle_connected') : t('shuttle_build')}</span>
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
    if (this.options.onActionChosen) {
      this.options.onActionChosen(action);
    }
    this.presentEventDocument();
  }

  presentEventDocument() {
    let rawEv;
    try {
      rawEv = this.gm.select_event();
    } catch (err) {
      console.error(err);
      return;
    }

    const lang = getLocale();
    const ev = getLocalizedEvent(rawEv, lang);
    this.currentEvent = rawEv; // Keep raw event for GameManager
    this.docOpenedTimestamp = performance.now();

    this.dioramaWrapper.classList.add('bokeh-blur');

    document.getElementById('doc-id').textContent = ev.id;
    document.getElementById('doc-chapter-label').textContent = t('chapter_format', ev.chapter);
    document.getElementById('doc-title').textContent = `${ev.title}`;

    const choicesContainer = document.getElementById('doc-choices');
    choicesContainer.innerHTML = '';

    ev.choices.forEach(ch => {
      const box = document.createElement('div');
      box.className = 'choice-box';
      box.id = `choice-box-${ch.id}`;

      const deltaSpans = [];
      const unit = t('unit_yi');
      if (ch.delta.budget !== 0) deltaSpans.push(`<span class="delta-budget">${t('net_budget_label')}: ${ch.delta.budget > 0 ? '+' : ''}${ch.delta.budget}${unit}</span>`);
      if (ch.delta.tourism !== 0) deltaSpans.push(`<span class="delta-tourism">${t('tourism_label')}: ${ch.delta.tourism > 0 ? '+' : ''}${ch.delta.tourism}</span>`);
      if (ch.delta.admin !== 0) deltaSpans.push(`<span class="delta-admin">${t('admin_label')}: ${ch.delta.admin > 0 ? '+' : ''}${ch.delta.admin}</span>`);
      if (ch.delta.complaints !== 0) deltaSpans.push(`<span class="delta-complaints">${t('complaints_label')}: ${ch.delta.complaints > 0 ? '+' : ''}${ch.delta.complaints}</span>`);

      box.innerHTML = `
        <div class="choice-label-row">
          <span class="choice-name">【${ch.id}】 ${ch.label}</span>
          <div class="choice-deltas">${deltaSpans.join(' | ') || '<span style="color:#888;">0</span>'}</div>
        </div>
        <div class="stamp-seal" id="seal-${ch.id}">${t('stamp_approved')}</div>
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

    if (this.options.onDocumentOpen) {
      this.options.onDocumentOpen();
    }
  }

  stampDocumentDecision(choiceId) {
    const elapsedMs = performance.now() - this.docOpenedTimestamp;
    const seal = document.getElementById(`seal-${choiceId}`);
    const otherChoiceId = choiceId === 'A' ? 'B' : 'A';
    const otherBox = document.getElementById(`choice-box-${otherChoiceId}`);

    if (seal) seal.classList.add('stamp-active');
    if (otherBox) otherBox.classList.add('struck-out');

    this.container.classList.add('screen-shake');
    setTimeout(() => {
      this.container.classList.remove('screen-shake');
    }, 250);

    if (this.options.onStampSlam) {
      this.options.onStampSlam();
    }

    setTimeout(() => {
      this.officialDoc.classList.remove('doc-active');
      this.dioramaWrapper.classList.remove('bokeh-blur');
      this.docModal.style.display = 'none';

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

    if (this.options.onVfxCallback && result.vfx_callback) {
      this.options.onVfxCallback(result.vfx_callback);
    }

    for (const achId of result.achievements) {
      if (!this.displayedAchievements.has(achId)) {
        this.displayedAchievements.add(achId);
        this.showAchievementToast(achId);
      }
    }

    if (this.gm.finished) {
      setTimeout(() => {
        if (this.options.onGameFinished) {
          this.options.onGameFinished(this.gm.ending(), this.gm.snapshot());
        }
      }, 1000);
    }
  }

  showAchievementToast(achId) {
    const lang = getLocale();
    const ach = ACHIEVEMENTS_I18N[achId]?.[lang] || ACHIEVEMENTS_I18N[achId]?.zh;
    if (!ach) return;

    const icons = {
      ACH01: '🎢', ACH02: '⚡', ACH03: '🎡', ACH04: '💤', ACH05: '🤖', ACH06: '🎯'
    };

    const toast = document.createElement('div');
    toast.className = 'achievement-toast';
    toast.innerHTML = `
      <div class="toast-icon">${icons[achId] || '🏆'}</div>
      <div class="toast-text">
        <span class="toast-sub">${t('unlocked_achievement')}</span>
        <span class="toast-title">${ach.title}：${ach.desc}</span>
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
    const nb = this.gm.net_budget;
    const unit = t('unit_yi');
    this.ledBudget.textContent = `${nb >= 0 ? '$' : '-$'}${Math.abs(nb).toFixed(1)} ${unit}`;
    if (nb < 0) {
      this.ledBudget.classList.add('led-deficit');
    } else {
      this.ledBudget.classList.remove('led-deficit');
    }

    this.barTourism.style.width = `${this.gm.tourism}%`;
    this.valTourism.textContent = `${this.gm.tourism}`;
    this.barAdmin.style.width = `${this.gm.admin}%`;
    this.valAdmin.textContent = `${this.gm.admin}`;
    this.barComplaints.style.width = `${this.gm.complaints}%`;
    this.valComplaints.textContent = `${this.gm.complaints}`;

    const currentChapter = Math.min(4, Math.floor((this.gm.turn - 1) / 3) + 1);
    const displayTurn = Math.min(12, this.gm.turn);
    this.turnText.textContent = t('turn_format', displayTurn);
    this.chapterText.textContent = t('chapter_format', currentChapter);

    this.renderStickyNotes();
    this.renderMeltdownProps();
    this.updateActionButtonsAvailability();
  }

  updateActionButtonsAvailability() {
    document.querySelectorAll('[data-action]').forEach(btn => {
      const type = btn.dataset.action;
      const bInfo = CONFIG.buildings[type];
      
      if (this.gm.turn === 1) {
        if (type === 'wheel') {
          btn.style.boxShadow = '0 0 15px #ffd43b, 0 4px 10px rgba(0,0,0,0.5)';
          btn.style.borderColor = '#f59f00';
          btn.style.background = '#fff9db';
        } else {
          btn.style.boxShadow = '';
          btn.style.borderColor = '';
          btn.style.background = '';
        }
      } else {
        btn.style.boxShadow = '';
        btn.style.borderColor = '';
        btn.style.background = '';
      }

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
    // Mayor quote rotation
    setInterval(() => {
      this.quoteIdx++;
      const lang = getLocale();
      const quotes = MAYOR_QUOTES[lang] || MAYOR_QUOTES.zh;
      if (this.mayorQuote) {
        this.mayorQuote.textContent = quotes[this.quoteIdx % quotes.length];
      }
      
      if (this.quoteIdx % 4 === 0) {
        this.setInterpreterState('facepalm');
      } else if (this.quoteIdx % 3 === 0) {
        this.setInterpreterState('frown');
      } else if (this.quoteIdx % 5 === 0) {
        this.setInterpreterState('strike_x');
      } else {
        this.setInterpreterState('calm');
      }
    }, 9000);

    // News ticker rotation
    setInterval(() => {
      this.tickerIdx++;
      const lang = getLocale();
      const tickers = NEWS_TICKER[lang] || NEWS_TICKER.zh;
      if (this.newsTicker) {
        this.newsTicker.textContent = tickers[this.tickerIdx % tickers.length];
      }
    }, 12000);
  }

  setInterpreterState(stateKey) {
    const lang = getLocale();
    const moodDict = INTERPRETER_MOODS[lang] || INTERPRETER_MOODS.zh;
    const state = moodDict[stateKey] || moodDict.calm;
    if (this.interpreterFace) this.interpreterFace.textContent = state.icon;
    if (this.interpreterMood) this.interpreterMood.textContent = state.mood;
  }
}

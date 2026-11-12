import { GameManager } from './game_manager.js';
import { CONFIG, NARRATIVE } from './game_data.js';
import { t, getLocale, setLocale, ZONE_NAMES, MAYOR_QUOTES, NEWS_TICKER, INTERPRETER_MOODS, STICKY_NOTES_PHRASES, FINANCE_DIRECTOR_NOTES } from './i18n.js';
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

    // Action Drawer elements
    this.actionDrawer = document.getElementById('action-drawer');
    this.drawerToggleBtn = document.getElementById('drawer-toggle-btn');
    this.drawerTabText = document.getElementById('drawer-tab-text');
    this.drawerTabArrow = document.getElementById('drawer-tab-arrow');
    this.drawerCloseBtn = document.getElementById('drawer-close-btn');
    this.drawerHeaderTitle = document.getElementById('drawer-header-title');

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
    // Action drawer toggle & close
    this.drawerToggleBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleActionDrawer();
    });

    this.drawerCloseBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.closeActionDrawer();
    });

    // Close drawer when clicking the 3D diorama canvas or desk outside drawer
    this.dioramaWrapper?.addEventListener('click', () => {
      if (this.actionDrawer?.classList.contains('drawer-open')) {
        this.closeActionDrawer();
      }
    });

    // Keyboard shortcut: 'B' toggles actions drawer, 'Escape' closes drawer
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (this.actionDrawer?.classList.contains('drawer-open')) {
          this.closeActionDrawer();
        }
      } else if ((e.key === 'b' || e.key === 'B') && !['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
        this.toggleActionDrawer();
      }
    });

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

  toggleActionDrawer() {
    if (this.actionDrawer?.classList.contains('drawer-open')) {
      this.closeActionDrawer();
    } else {
      this.openActionDrawer();
    }
  }

  openActionDrawer() {
    if (!this.actionDrawer) return;
    this.actionDrawer.classList.add('drawer-open');
    if (this.drawerToggleBtn) this.drawerToggleBtn.setAttribute('aria-expanded', 'true');
    if (this.drawerTabText) this.drawerTabText.textContent = t('drawer_tab_close');
    if (this.drawerTabArrow) this.drawerTabArrow.textContent = '▶';
  }

  closeActionDrawer() {
    if (!this.actionDrawer) return;
    this.actionDrawer.classList.remove('drawer-open');
    if (this.drawerToggleBtn) this.drawerToggleBtn.setAttribute('aria-expanded', 'false');
    if (this.drawerTabText) this.drawerTabText.textContent = t('drawer_tab_open');
    if (this.drawerTabArrow) this.drawerTabArrow.textContent = '◀';
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

    // Drawer tab & header
    const isOpen = this.actionDrawer?.classList.contains('drawer-open');
    if (this.drawerTabText) this.drawerTabText.textContent = t(isOpen ? 'drawer_tab_close' : 'drawer_tab_open');
    if (this.drawerTabArrow) this.drawerTabArrow.textContent = isOpen ? '▶' : '◀';
    if (this.drawerHeaderTitle) this.drawerHeaderTitle.textContent = t('drawer_header_title');

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

    // Auto-close drawer on choosing an action so modal & diorama have full visibility
    this.closeActionDrawer();

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
      this.closeActionDrawer();
      setTimeout(() => {
        if (this.options.onGameFinished) {
          try {
            const endingKey = this.gm.ending();
            const snapshot = this.gm.snapshot();
            this.options.onGameFinished(endingKey, snapshot);
          } catch (err) {
            console.error('Error triggering game ending:', err);
          }
        }
      }, 800);
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
    if (this.gm.finished) {
      document.querySelectorAll('[data-action]').forEach(btn => {
        btn.classList.add('btn-disabled');
      });
      return;
    }

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
    const lang = getLocale();
    const phrases = STICKY_NOTES_PHRASES[lang] || STICKY_NOTES_PHRASES.zh;
    const colors = ['note-yellow', 'note-pink', 'note-orange'];

    for (let i = 0; i < noteCount; i++) {
      const note = document.createElement('div');
      note.className = `sticky-note ${colors[i % colors.length]}`;
      const rot = (i % 2 === 0 ? -1 : 1) * (5 + (i * 4) % 15);
      
      // Position notes safely around top and mid borders, strictly avoiding the bottom dashboard
      if (i < 2) {
        note.style.left = `${15 + i * 160}px`;
        note.style.top = '70px';
      } else if (i < 4) {
        note.style.right = `${160 + (i - 2) * 160}px`;
        note.style.top = '70px';
      } else {
        note.style.left = '20px';
        note.style.top = `${220 + (i - 4) * 125}px`;
      }
      note.style.transform = `rotate(${rot}deg)`;
      note.textContent = phrases[i % phrases.length];
      this.makeDraggable(note);
      this.stickyNotesZone.appendChild(note);
    }
  }

  renderMeltdownProps() {
    this.meltdownProps.innerHTML = '';
    const stage = this.gm.meltdown_stage;
    const lang = getLocale();
    const notes = FINANCE_DIRECTOR_NOTES[lang] || FINANCE_DIRECTOR_NOTES.zh;

    if (stage === 1) {
      const note = document.createElement('div');
      note.className = 'sticky-note note-blue';
      note.textContent = notes.stage_1[0];
      this.makeDraggable(note);
      this.meltdownProps.appendChild(note);
    } else if (stage === 2) {
      const note = document.createElement('div');
      note.className = 'sticky-note note-yellow';
      note.style.borderColor = '#fa5252';
      note.innerHTML = `<strong>${notes.stage_2_warning}</strong><br>${notes.stage_2[1]}`;
      this.makeDraggable(note);
      this.meltdownProps.appendChild(note);
    } else if (stage === 3) {
      this.meltdownProps.innerHTML = `
        <div class="iv-drip-bag">
          <div style="font-size:9px;font-weight:bold;color:#fa5252;">${notes.stage_3_fund}</div>
          <div class="iv-liquid"></div>
        </div>
        <div class="hospital-chart">
          ${notes.stage_3_chart}
        </div>
      `;
    }
  }

  makeDraggable(element) {
    let startX = 0, startY = 0, initialLeft = 0, initialTop = 0;
    let isDragging = false;

    const onPointerDown = (e) => {
      if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A') return;
      isDragging = true;
      const clientX = e.clientX ?? (e.touches && e.touches[0].clientX);
      const clientY = e.clientY ?? (e.touches && e.touches[0].clientY);
      startX = clientX;
      startY = clientY;

      const rect = element.getBoundingClientRect();
      const parentRect = (element.offsetParent || document.body).getBoundingClientRect();
      initialLeft = rect.left - parentRect.left;
      initialTop = rect.top - parentRect.top;

      element.style.bottom = 'auto';
      element.style.right = 'auto';
      element.style.left = `${initialLeft}px`;
      element.style.top = `${initialTop}px`;
      element.style.zIndex = '99';

      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
    };

    const onPointerMove = (e) => {
      if (!isDragging) return;
      const clientX = e.clientX ?? (e.touches && e.touches[0].clientX);
      const clientY = e.clientY ?? (e.touches && e.touches[0].clientY);
      const dx = clientX - startX;
      const dy = clientY - startY;
      element.style.left = `${initialLeft + dx}px`;
      element.style.top = `${initialTop + dy}px`;
    };

    const onPointerUp = () => {
      if (!isDragging) return;
      isDragging = false;
      element.style.zIndex = '';
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    element.addEventListener('pointerdown', onPointerDown);
  }

  startBackgroundSimulations() {
    // Mayor quote rotation with smooth opacity fade
    setInterval(() => {
      this.quoteIdx++;
      const lang = getLocale();
      const quotes = MAYOR_QUOTES[lang] || MAYOR_QUOTES.zh;
      if (this.mayorQuote) {
        this.mayorQuote.style.opacity = '0';
        setTimeout(() => {
          this.mayorQuote.textContent = quotes[this.quoteIdx % quotes.length];
          this.mayorQuote.style.opacity = '1';
        }, 220);
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

    // News ticker rotation: strictly sequential via animationend, preventing double-flash
    if (this.newsTicker) {
      this.newsTicker.addEventListener('animationend', () => {
        this.tickerIdx++;
        const lang = getLocale();
        const tickers = NEWS_TICKER[lang] || NEWS_TICKER.zh;
        this.newsTicker.classList.remove('news-ticker-sliding');
        this.newsTicker.textContent = tickers[this.tickerIdx % tickers.length];
        // Force DOM reflow before re-adding class so animation restarts cleanly from right edge
        void this.newsTicker.offsetWidth;
        this.newsTicker.classList.add('news-ticker-sliding');
      });
    }
  }

  setInterpreterState(stateKey) {
    const lang = getLocale();
    const moodDict = INTERPRETER_MOODS[lang] || INTERPRETER_MOODS.zh;
    const state = moodDict[stateKey] || moodDict.calm;
    if (this.interpreterFace) this.interpreterFace.textContent = state.icon;
    if (this.interpreterMood) this.interpreterMood.textContent = state.mood;
  }
}

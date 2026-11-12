import { NARRATIVE } from './game_data.js';
import { t, getLocale } from './i18n.js';
import { ENDINGS_I18N, ACHIEVEMENTS_I18N } from './i18n_endings.js';

export class DossierEnding {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.options = options;
  }

  showEnding(endingKey, snapshot, dioramaCanvas) {
    const lang = getLocale();

    // 1. Capture live 3D diorama canvas snapshot as Polaroid image data URL
    let polaroidDataUrl = '';
    try {
      if (dioramaCanvas) {
        polaroidDataUrl = dioramaCanvas.toDataURL('image/png');
      }
    } catch (e) {
      console.warn('Could not capture diorama screenshot:', e);
    }

    const defaultDossier = NARRATIVE.endings_dossier[endingKey] || NARRATIVE.endings_dossier['仍在協商中的愛情城市'];
    const localizedDossier = ENDINGS_I18N[endingKey]?.[lang] || ENDINGS_I18N[endingKey]?.zh || {};

    const title = localizedDossier.title || defaultDossier.title;
    const goldStamp = localizedDossier.gold_stamp || defaultDossier.official_propaganda.gold_stamp;
    const headline = localizedDossier.official_headline || defaultDossier.official_propaganda.headline;
    const polaroidCaption = localizedDossier.polaroid_caption || defaultDossier.official_propaganda.polaroid_caption;
    const story = localizedDossier.story || defaultDossier.official_propaganda.story;
    const receiptTitle = localizedDossier.receipt_title || defaultDossier.thermal_receipt.title;
    const memo = localizedDossier.memo || defaultDossier.thermal_receipt.memo;
    const rank = defaultDossier.rank || 'A';

    // Build Blue Tarp & Dossier HTML
    const overlay = document.createElement('div');
    overlay.id = 'blue-tarp-ending-modal';
    overlay.className = 'tarp-drop-in';

    // Build receipt items list
    const receiptItemsHtml = defaultDossier.thermal_receipt.items.map(it => `
      <div class="receipt-row">
        <span>${it.name}</span>
        <span class="receipt-cost">${it.cost}</span>
      </div>
    `).join('');

    // Build achievements badges in current language
    const achBadgesHtml = (snapshot.achievements || []).map(achId => {
      const a = ACHIEVEMENTS_I18N[achId]?.[lang] || ACHIEVEMENTS_I18N[achId]?.zh;
      if (!a) return '';
      const icons = {
        ACH01: '🎢', ACH02: '⚡', ACH03: '🎡', ACH04: '💤', ACH05: '🤖', ACH06: '🎯'
      };
      return `
        <div class="ach-badge" title="${a.desc}">
          <span class="ach-badge-icon">${icons[achId] || '🏆'}</span>
          <span class="ach-badge-title">${a.title}</span>
        </div>
      `;
    }).join('') || `<span style="font-size:12px;color:#888;">${t('no_special_ach')}</span>`;

    const unit = t('unit_yi');

    overlay.innerHTML = `
      <div class="blue-tarp-curtain"></div>
      
      <div class="dossier-booklet">
        
        <!-- 左頁：官方大內宣 -->
        <div class="dossier-page page-left">
          <div class="propaganda-seal-gold">${goldStamp}</div>
          <div class="propaganda-rank-badge">${t('eval_rank', rank)}</div>
          <h2 class="propaganda-headline">${headline}</h2>
          
          <!-- 拍立得照片 -->
          <div class="polaroid-frame">
            <div class="polaroid-photo-box">
              ${polaroidDataUrl ? `<img src="${polaroidDataUrl}" class="polaroid-img" alt="沙盤截圖">` : '<div class="polaroid-placeholder">🎡 Diorama Snapshot</div>'}
            </div>
            <div class="polaroid-caption">${polaroidCaption}</div>
          </div>

          <p class="propaganda-story">${story}</p>
        </div>

        <!-- 右頁：基層真實帳單與甩鍋公文 -->
        <div class="dossier-page page-right">
          <div class="receipt-header">
            <h3>🧾 ${receiptTitle}</h3>
            <div style="font-size:11px;color:#666;">${t('audit_date')}</div>
          </div>

          <!-- 長條熱感應發票 -->
          <div class="thermal-receipt-scroll">
            <div class="receipt-items-list">
              ${receiptItemsHtml}
            </div>
            <div class="receipt-divider">==========================</div>
            <div class="receipt-total-row">
              <strong>${t('actual_balance')}</strong>
              <strong style="color:${snapshot.net_budget < 0 ? '#e03131' : '#2b8a3e'}">
                ${snapshot.net_budget >= 0 ? '$' : '-$'}${Math.abs(snapshot.net_budget).toFixed(1)} ${unit}
              </strong>
            </div>
            <div class="receipt-stats-row">
              ${t('tourism_label')}: ${snapshot.tourism} | ${t('admin_label')}: ${snapshot.admin} | ${t('complaints_label')}: ${snapshot.complaints}
            </div>
          </div>

          <!-- 長官甩鍋便籤 -->
          <div class="buck-passing-note">
            ${t('confidential_memo')}<br>
            ${memo}
          </div>

          <!-- 成就展示區 -->
          <div class="dossier-ach-section">
            <div style="font-size:12px;font-weight:900;color:#5c3b1e;margin-bottom:6px;">🏆 ${t('unlocked_achievement')}</div>
            <div class="ach-badges-grid">
              ${achBadgesHtml}
            </div>
          </div>

          <!-- 重啟遊戲按鈕 -->
          <button id="btn-dossier-restart" class="btn-dossier-restart">
            ${t('restart_game')}
          </button>
        </div>

      </div>
    `;

    document.body.appendChild(overlay);

    document.getElementById('btn-dossier-restart')?.addEventListener('click', () => {
      window.location.reload();
    });
  }
}

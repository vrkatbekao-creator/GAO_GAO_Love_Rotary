import { NARRATIVE } from './game_data.js';

export class DossierEnding {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.options = options;
  }

  showEnding(endingKey, snapshot, dioramaCanvas) {
    // 1. Capture live 3D diorama canvas snapshot as Polaroid image data URL
    let polaroidDataUrl = '';
    try {
      if (dioramaCanvas) {
        polaroidDataUrl = dioramaCanvas.toDataURL('image/png');
      }
    } catch (e) {
      console.warn('Could not capture diorama screenshot:', e);
    }

    const dossierInfo = NARRATIVE.endings_dossier[endingKey] || NARRATIVE.endings_dossier['仍在協商中的愛情城市'];
    const prop = dossierInfo.official_propaganda;
    const rcpt = dossierInfo.thermal_receipt;

    // Build Blue Tarp & Dossier HTML
    const overlay = document.createElement('div');
    overlay.id = 'blue-tarp-ending-modal';
    overlay.className = 'tarp-drop-in';

    // Build receipt items list
    const receiptItemsHtml = rcpt.items.map(it => `
      <div class="receipt-row">
        <span>${it.name}</span>
        <span class="receipt-cost">${it.cost}</span>
      </div>
    `).join('');

    // Build achievements badges
    const achBadgesHtml = (snapshot.achievements || []).map(achId => {
      const a = NARRATIVE.achievements.find(item => item.id === achId);
      if (!a) return '';
      return `
        <div class="ach-badge" title="${a.description}">
          <span class="ach-badge-icon">${a.icon}</span>
          <span class="ach-badge-title">${a.title}</span>
        </div>
      `;
    }).join('') || '<span style="font-size:12px;color:#888;">本局未達成特殊成就</span>';

    overlay.innerHTML = `
      <div class="blue-tarp-curtain"></div>
      
      <div class="dossier-booklet">
        
        <!-- 左頁：官方大內宣 -->
        <div class="dossier-page page-left">
          <div class="propaganda-seal-gold">${prop.gold_stamp}</div>
          <div class="propaganda-rank-badge">評定等第：【${dossierInfo.rank} 級】</div>
          <h2 class="propaganda-headline">${prop.headline}</h2>
          
          <!-- 拍立得照片 -->
          <div class="polaroid-frame">
            <div class="polaroid-photo-box">
              ${polaroidDataUrl ? `<img src="${polaroidDataUrl}" class="polaroid-img" alt="沙盤截圖">` : '<div class="polaroid-placeholder">🎡 微縮沙盤留影</div>'}
            </div>
            <div class="polaroid-caption">${prop.polaroid_caption}</div>
          </div>

          <p class="propaganda-story">${prop.story}</p>
        </div>

        <!-- 右頁：基層真實帳單與甩鍋公文 -->
        <div class="dossier-page page-right">
          <div class="receipt-header">
            <h3>🧾 ${rcpt.title}</h3>
            <div style="font-size:11px;color:#666;">決算日期：第 12 回合終局審查</div>
          </div>

          <!-- 長條熱感應發票 -->
          <div class="thermal-receipt-scroll">
            <div class="receipt-items-list">
              ${receiptItemsHtml}
            </div>
            <div class="receipt-divider">==========================</div>
            <div class="receipt-total-row">
              <strong>實質預算結餘</strong>
              <strong style="color:${snapshot.net_budget < 0 ? '#e03131' : '#2b8a3e'}">
                ${snapshot.net_budget >= 0 ? '$' : '-$'}${Math.abs(snapshot.net_budget).toFixed(1)} 億
              </strong>
            </div>
            <div class="receipt-stats-row">
              觀光: ${snapshot.tourism} | 行政負擔: ${snapshot.admin} | 陳情壓力: ${snapshot.complaints}
            </div>
          </div>

          <!-- 長官甩鍋便籤 -->
          <div class="buck-passing-note">
            📌 <strong>機密備忘錄：</strong><br>
            ${rcpt.memo}
          </div>

          <!-- 成就展示區 -->
          <div class="dossier-ach-section">
            <div style="font-size:12px;font-weight:900;color:#5c3b1e;margin-bottom:6px;">🏆 本局解鎖諷刺成就</div>
            <div class="ach-badges-grid">
              ${achBadgesHtml}
            </div>
          </div>

          <!-- 重啟遊戲按鈕 -->
          <button id="btn-restart-game" class="btn-dossier-restart">
            🔄 重新召開市政會議 (新局)
          </button>
        </div>

      </div>
    `;

    document.body.appendChild(overlay);

    // Bind restart button
    document.getElementById('btn-restart-game')?.addEventListener('click', () => {
      window.location.reload();
    });
  }
}

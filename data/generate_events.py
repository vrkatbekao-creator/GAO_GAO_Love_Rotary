import json
from pathlib import Path

# Event definitions transcribed from GDD v1.0 / v0.4 design; values are fictional game mechanics.
# Tuple: (title, choice A text, A delta [budget, tourism, admin, complaints], choice B text, B delta, precondition, vfx_callback)
raw = [
    ('市長要求超大型願景背板', '豪華製作', [-1, 5, 0, 0], '使用舊背板', [0, 0, 4, 0], None, 'SPAWN_BILLBOARD'),
    ('愛情地標命名爭議', '公開徵名', [-1, 0, 0, -6], '直接定名', [0, 0, -2, 5], None, 'BALLOT_BOX_TUMBLE'),
    ('開幕宣傳影片無人主演', '聘請演員', [-1, 5, 0, 0], '讓局長主演', [0, 2, 4, 0], None, 'DIRECTOR_CAMERA'),
    ('三個局處都說不是主管機關', '聯合審查', [-1, 0, -7, 0], '繼續公文往返', [0, 0, 9, 0], None, 'BUREAUCRATIC_STAMPEDE'),
    ('廣告標語寫著「戀愛保證成功」', '修正標語', [-1, 0, 0, -4], '保留標語', [0, 5, 0, 7], None, 'NEON_SIGN_FLICKER'),
    ('投資商要求優先看夜景', '夜間場勘', [-1, 4, 0, 0], '先交書面報告', [0, 0, 3, 0], None, 'NIGHT_SPOTLIGHT'),
    ('摩天輪模型比辦公室還大', '重新製作', [-1, 0, -3, 0], '直接放在廣場', [0, 4, 0, 3], None, 'OVERSIZED_MODEL_DROP'),
    ('市民要求公布可行性資訊', '開說明會', [-1, 0, 0, -8], '公告摘要', [0, 0, -2, 3], None, 'MEGAPHONE_BLAST'),
    ('首座摩天輪開幕', '盛大開幕', [-2, 12, 0, 0], '試營運', [0, 5, 0, -5], {'min_operational_wheels': 1}, 'HIGHLIGHT_ALL_WHEELS'),
    ('五區平等連署', '跨區協調', [-1, 0, 0, -8], '暫緩討論', [0, 0, -3, 8], None, 'PETITION_RAIN'),
    ('山城居民要求觀光接駁', '交通可行性調查', [-1, 0, -3, 0], '納入下次規劃', [0, 0, 0, 6], None, 'BUS_CLIFF_HONK'),
    ('舊城商圈要求旅客分流', '商圈導覽', [-1, 6, 0, 0], '保持原動線', [0, 0, 0, 5], None, 'CROWD_SLIME_MERGE'),
    ('科技區要求智慧摩天輪', '試辦數位導覽', [-2, 7, 0, 0], '維持傳統設施', [0, 0, -3, 0], None, 'CYBER_HOLOGRAM'),
    ('郊區要求自己的地標', '小型巡迴展示', [-1, 0, 0, -5], '強調共用設施', [0, 0, -2, 4], None, 'MINI_WHEEL_POPUP'),
    ('港灣區擔心人潮壅塞', '加派疏導', [-1, 0, 0, -7], '限制入場', [0, -4, 0, -2], None, 'TRAFFIC_CONE_WALL'),
    ('五區要求公平分配公式', '公開分配標準', [0, 0, 4, -8], '個別協商', [0, 0, 8, -3], None, 'PIE_CHART_CHAOS'),
    ('官方網站漏掉一個區', '緊急修正', [-1, 0, 0, -5], '留待例行更新', [0, 0, 0, 7], None, 'ERROR_404_GLITCH'),
    ('五區聯合聽證會', '提出跨區服務方案', [-1, 0, 3, -10], '各區自行提案', [0, 0, 7, -3], None, 'HEARING_HYPNOSIS_ZZZ'),
    ('摩天輪年度檢修提前', '額外保養', [-2, 0, 0, -5], '調整營運時段', [1, -6, 0, 0], {'min_operational_wheels': 1}, 'WHEEL_SPARK_MAINTENANCE'),
    ('下雨天遊客集體改行程', '室內活動', [-1, 4, 0, 0], '暫停活動', [0, -5, -2, 0], None, 'RAIN_STORM_DRIZZLE'),
    ('企業要求「霸道總裁之眼」冠名', '接受冠名', [4, 0, 0, 7], '拒絕冠名', [0, 2, 0, 0], None, 'SPONSOR_NEON_WHEEL'),
    ('夜市攤商要求延長營業', '配合夜間活動', [-1, 7, 0, 0], '維持原時段', [0, 0, 0, 4], None, 'NEON_STALL_LIGHTS'),
    ('摩天輪排隊超過兩小時', '增加現場管理', [-1, 0, 0, -8], '提供紀念貼紙', [-0.5, 2, 0, 3], {'min_operational_wheels': 1}, 'STICKER_FRENZY'),
    ('兩座摩天輪互搶客源', '推聯票', [-1, 7, 0, 0], '分開宣傳', [0, 3, 5, 0], {'min_operational_wheels': 2}, 'TICKET_RIBBON_CUT'),
    ('愛情接駁車誤點', '增派調度', [-1, 0, 0, -7], '公告延誤原因', [0, 0, -2, 5], {'min_shuttles': 1}, 'BUS_SMOKE_EXHAUST'),
    ('商圈投資商要求修改合約', '重新談判', [0, 0, 6, -4], '接受條件', [2, 0, 0, 5], {'min_markets': 1}, 'CONTRACT_SHREDDER'),
    ('財政審查', '公開財務檢討', [0, 0, 5, -10], '縮減宣傳', [2, -6, 0, 0], None, 'SEIZURE_TAPE_WARNING'),
    ('市長要求愛情 KPI', '委託研究', [-1, 0, -5, 0], '直接報告搭乘人次', [0, 0, 3, 4], None, 'CHART_ARROW_UP'),
    ('官方報告寫成「愛情產值無限大」', '修正數據', [0, 0, 3, -6], '改用宣傳口號', [0, 3, 0, 6], None, 'INFINITY_GLOW'),
    ('最後一項工程延誤', '加速工程', [-2, 0, 4, 0], '延後驗收', [0, -5, -2, 0], None, 'JACKHAMMER_NOISE'),
    ('觀光客不知道怎麼回家', '臨時接駁', [-1, 0, 0, -8], '增設指示牌', [-0.5, 0, 0, -3], None, 'LOST_TOURIST_BUBBLE'),
    ('智慧觀光 App 沒人下載', '改善資訊服務', [-1, 4, 0, 0], '停止推廣', [1, -3, 0, 0], None, 'APP_STORE_ONE_STAR'),
    ('摩天輪燈光與居民作息衝突', '調整照明', [0, -3, 0, -7], '維持夜景', [0, 5, 0, 8], None, 'DISCO_LIGHT_WAR'),
    ('五區代表要求參加成果發布', '共同發布', [-1, 0, 0, -7], '市府單獨發布', [0, 0, -3, 5], None, 'PODIUM_RUSH'),
    ('財政局要求最後結清', '提前償還部分債務', [-2, 0, 0, -3], '展延償還', [1, 0, 5, 0], None, 'PIGGY_BANK_CRACK'),
    ('最終成果發表會', '公布完整財政與服務報告', [0, 0, 3, -8], '舉辦大型慶祝活動', [-2, 10, 0, 0], None, 'CONFUSED_CONFETTI')
]

assert len(raw) == 36
fixed = {9: 3, 18: 6, 27: 9, 36: 12}
cards = []

for i, (title, a, da, b, db, pre, vfx) in enumerate(raw, 1):
    cards.append({
        'id': f'EV{i:02d}',
        'chapter': (i - 1) // 9 + 1,
        'fixed_turn': fixed.get(i),
        'title': title,
        'fictional': True,
        'precondition': pre or {},
        'vfx_callback': vfx,
        'choices': [
            {'id': 'A', 'label': a, 'delta': dict(zip(('budget', 'tourism', 'admin', 'complaints'), da))},
            {'id': 'B', 'label': b, 'delta': dict(zip(('budget', 'tourism', 'admin', 'complaints'), db))}
        ]
    })

p = Path(__file__).with_name('events.json')
p.write_text(json.dumps(cards, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(f'wrote {p} with {len(cards)} events')

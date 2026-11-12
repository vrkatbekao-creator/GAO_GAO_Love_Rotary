// Static canonical game data bundled for web runtime
export const CONFIG = {
  "disclaimer": "All budgets and behaviors are fictional gameplay numbers, not Kaohsiung policy cost estimates.",
  "zones": ["港灣區", "舊城區", "郊區", "科技區", "山城區"],
  "zone_metadata": {
    "港灣區": {"name": "港灣區", "display_name": "⚓ 港灣區", "elevation": 0.5, "type": "water", "description": "深藍色水面，低矮倉庫。空間小，交通難外連。"},
    "舊城區": {"name": "舊城區", "display_name": "🏘️ 舊城區", "elevation": 1.0, "type": "dense_grid", "description": "灰色擁擠建築網格。空間不足，強蓋設施會穿模。"},
    "郊區": {"name": "郊區", "display_name": "🚡 郊區發展區", "elevation": 1.5, "type": "flat_grass", "description": "淺綠色平坦草地。空間大但極度邊疆。"},
    "科技區": {"name": "科技區", "display_name": "🏙️ 科技區", "elevation": 2.0, "type": "neon_array", "description": "霓虹藍半透明方塊陣列。招商條件多。"},
    "山城區": {"name": "山城區", "display_name": "⛰️ 山城區", "elevation": 4.0, "type": "steep_mountain", "description": "陡峭深綠色幾何山體。制高點，交通可達性極低。"}
  },
  "buildings": {
    "wheel": {
      "cost": 8,
      "lead_turns": 2,
      "max_per_zone": 1,
      "max_per_zone_override": {"舊城區": 3},
      "operating_gross_per_round": 1,
      "maintenance_per_round": 1,
      "tourism_on_open": 8
    },
    "shuttle": {
      "cost": 3,
      "lead_turns": 0,
      "max_per_edge": 1,
      "maintenance_per_round": 0.5,
      "tourism_on_open": 2
    },
    "market": {
      "cost": 3,
      "lead_turns": 1,
      "max_per_zone": 1,
      "gross_if_covered_per_round": 1,
      "maintenance_per_round": 0,
      "tourism_on_open": 3
    },
    "event": {
      "cost": 2,
      "lead_turns": 0,
      "tourism_once": 5,
      "complaints_once": -2
    },
    "hearing": {
      "cost": 1,
      "lead_turns": 0,
      "admin_once": -4,
      "complaints_once": -7
    }
  },
  "start": {
    "budget": 24,
    "debt": 0,
    "tourism": 20,
    "admin": 20,
    "complaints": 20
  },
  "finance_director_meltdown": {
    "stage_1": {"threshold_net_budget_min": 10, "state": "calm", "note_color": "blue"},
    "stage_2": {"threshold_net_budget_min": 0, "threshold_net_budget_max": 9.99, "state": "anxious", "note_color": "neon_yellow"},
    "stage_3": {"threshold_net_budget_max": -0.01, "state": "meltdown", "note_color": "medical_red"}
  },
  "income_per_round": 2,
  "rounds": 12,
  "chapters": 4,
  "fixed_event_turns": [3, 6, 9, 12]
};

export const EVENTS = [
  {"id": "EV01", "chapter": 1, "fixed_turn": null, "title": "市長要求超大型願景背板", "fictional": true, "precondition": {}, "vfx_callback": "SPAWN_BILLBOARD", "choices": [{"id": "A", "label": "豪華製作", "delta": {"budget": -1, "tourism": 5, "admin": 0, "complaints": 0}}, {"id": "B", "label": "使用舊背板", "delta": {"budget": 0, "tourism": 0, "admin": 4, "complaints": 0}}]},
  {"id": "EV02", "chapter": 1, "fixed_turn": null, "title": "愛情地標命名爭議", "fictional": true, "precondition": {}, "vfx_callback": "BALLOT_BOX_TUMBLE", "choices": [{"id": "A", "label": "公開徵名", "delta": {"budget": -1, "tourism": 0, "admin": 0, "complaints": -6}}, {"id": "B", "label": "直接定名", "delta": {"budget": 0, "tourism": 0, "admin": -2, "complaints": 5}}]},
  {"id": "EV03", "chapter": 1, "fixed_turn": null, "title": "開幕宣傳影片無人主演", "fictional": true, "precondition": {}, "vfx_callback": "DIRECTOR_CAMERA", "choices": [{"id": "A", "label": "聘請演員", "delta": {"budget": -1, "tourism": 5, "admin": 0, "complaints": 0}}, {"id": "B", "label": "讓局長主演", "delta": {"budget": 0, "tourism": 2, "admin": 4, "complaints": 0}}]},
  {"id": "EV04", "chapter": 1, "fixed_turn": null, "title": "三個局處都說不是主管機關", "fictional": true, "precondition": {}, "vfx_callback": "BUREAUCRATIC_STAMPEDE", "choices": [{"id": "A", "label": "聯合審查", "delta": {"budget": -1, "tourism": 0, "admin": -7, "complaints": 0}}, {"id": "B", "label": "繼續公文往返", "delta": {"budget": 0, "tourism": 0, "admin": 9, "complaints": 0}}]},
  {"id": "EV05", "chapter": 1, "fixed_turn": null, "title": "廣告標語寫著「戀愛保證成功」", "fictional": true, "precondition": {}, "vfx_callback": "NEON_SIGN_FLICKER", "choices": [{"id": "A", "label": "修正標語", "delta": {"budget": -1, "tourism": 0, "admin": 0, "complaints": -4}}, {"id": "B", "label": "保留標語", "delta": {"budget": 0, "tourism": 5, "admin": 0, "complaints": 7}}]},
  {"id": "EV06", "chapter": 1, "fixed_turn": null, "title": "投資商要求優先看夜景", "fictional": true, "precondition": {}, "vfx_callback": "NIGHT_SPOTLIGHT", "choices": [{"id": "A", "label": "夜間場勘", "delta": {"budget": -1, "tourism": 4, "admin": 0, "complaints": 0}}, {"id": "B", "label": "先交書面報告", "delta": {"budget": 0, "tourism": 0, "admin": 3, "complaints": 0}}]},
  {"id": "EV07", "chapter": 1, "fixed_turn": null, "title": "摩天輪模型比辦公室還大", "fictional": true, "precondition": {}, "vfx_callback": "OVERSIZED_MODEL_DROP", "choices": [{"id": "A", "label": "重新製作", "delta": {"budget": -1, "tourism": 0, "admin": -3, "complaints": 0}}, {"id": "B", "label": "直接放在廣場", "delta": {"budget": 0, "tourism": 4, "admin": 0, "complaints": 3}}]},
  {"id": "EV08", "chapter": 1, "fixed_turn": null, "title": "市民要求公布可行性資訊", "fictional": true, "precondition": {}, "vfx_callback": "MEGAPHONE_BLAST", "choices": [{"id": "A", "label": "開說明會", "delta": {"budget": -1, "tourism": 0, "admin": 0, "complaints": -8}}, {"id": "B", "label": "公告摘要", "delta": {"budget": 0, "tourism": 0, "admin": -2, "complaints": 3}}]},
  {"id": "EV09", "chapter": 1, "fixed_turn": 3, "title": "首座摩天輪開幕", "fictional": true, "precondition": {"min_operational_wheels": 1}, "vfx_callback": "HIGHLIGHT_ALL_WHEELS", "choices": [{"id": "A", "label": "盛大開幕", "delta": {"budget": -2, "tourism": 12, "admin": 0, "complaints": 0}}, {"id": "B", "label": "試營運", "delta": {"budget": 0, "tourism": 5, "admin": 0, "complaints": -5}}]},
  {"id": "EV10", "chapter": 2, "fixed_turn": null, "title": "五區平等連署", "fictional": true, "precondition": {}, "vfx_callback": "PETITION_RAIN", "choices": [{"id": "A", "label": "跨區協調", "delta": {"budget": -1, "tourism": 0, "admin": 0, "complaints": -8}}, {"id": "B", "label": "暫緩討論", "delta": {"budget": 0, "tourism": 0, "admin": -3, "complaints": 8}}]},
  {"id": "EV11", "chapter": 2, "fixed_turn": null, "title": "山城居民要求觀光接駁", "fictional": true, "precondition": {}, "vfx_callback": "BUS_CLIFF_HONK", "choices": [{"id": "A", "label": "交通可行性調查", "delta": {"budget": -1, "tourism": 0, "admin": -3, "complaints": 0}}, {"id": "B", "label": "納入下次規劃", "delta": {"budget": 0, "tourism": 0, "admin": 0, "complaints": 6}}]},
  {"id": "EV12", "chapter": 2, "fixed_turn": null, "title": "舊城商圈要求旅客分流", "fictional": true, "precondition": {}, "vfx_callback": "CROWD_SLIME_MERGE", "choices": [{"id": "A", "label": "商圈導覽", "delta": {"budget": -1, "tourism": 6, "admin": 0, "complaints": 0}}, {"id": "B", "label": "保持原動線", "delta": {"budget": 0, "tourism": 0, "admin": 0, "complaints": 5}}]},
  {"id": "EV13", "chapter": 2, "fixed_turn": null, "title": "科技區要求智慧摩天輪", "fictional": true, "precondition": {}, "vfx_callback": "CYBER_HOLOGRAM", "choices": [{"id": "A", "label": "試辦數位導覽", "delta": {"budget": -2, "tourism": 7, "admin": 0, "complaints": 0}}, {"id": "B", "label": "維持傳統設施", "delta": {"budget": 0, "tourism": 0, "admin": -3, "complaints": 0}}]},
  {"id": "EV14", "chapter": 2, "fixed_turn": null, "title": "郊區要求自己的地標", "fictional": true, "precondition": {}, "vfx_callback": "MINI_WHEEL_POPUP", "choices": [{"id": "A", "label": "小型巡迴展示", "delta": {"budget": -1, "tourism": 0, "admin": 0, "complaints": -5}}, {"id": "B", "label": "強調共用設施", "delta": {"budget": 0, "tourism": 0, "admin": -2, "complaints": 4}}]},
  {"id": "EV15", "chapter": 2, "fixed_turn": null, "title": "港灣區擔心人潮壅塞", "fictional": true, "precondition": {}, "vfx_callback": "TRAFFIC_CONE_WALL", "choices": [{"id": "A", "label": "加派疏導", "delta": {"budget": -1, "tourism": 0, "admin": 0, "complaints": -7}}, {"id": "B", "label": "限制入場", "delta": {"budget": 0, "tourism": -4, "admin": 0, "complaints": -2}}]},
  {"id": "EV16", "chapter": 2, "fixed_turn": null, "title": "五區要求公平分配公式", "fictional": true, "precondition": {}, "vfx_callback": "PIE_CHART_CHAOS", "choices": [{"id": "A", "label": "公開分配標準", "delta": {"budget": 0, "tourism": 0, "admin": 4, "complaints": -8}}, {"id": "B", "label": "個別協商", "delta": {"budget": 0, "tourism": 0, "admin": 8, "complaints": -3}}]},
  {"id": "EV17", "chapter": 2, "fixed_turn": null, "title": "官方網站漏掉一個區", "fictional": true, "precondition": {}, "vfx_callback": "ERROR_404_GLITCH", "choices": [{"id": "A", "label": "緊急修正", "delta": {"budget": -1, "tourism": 0, "admin": 0, "complaints": -5}}, {"id": "B", "label": "留待例行更新", "delta": {"budget": 0, "tourism": 0, "admin": 0, "complaints": 7}}]},
  {"id": "EV18", "chapter": 2, "fixed_turn": 6, "title": "五區聯合聽證會", "fictional": true, "precondition": {}, "vfx_callback": "HEARING_HYPNOSIS_ZZZ", "choices": [{"id": "A", "label": "提出跨區服務方案", "delta": {"budget": -1, "tourism": 0, "admin": 3, "complaints": -10}}, {"id": "B", "label": "各區自行提案", "delta": {"budget": 0, "tourism": 0, "admin": 7, "complaints": -3}}]},
  {"id": "EV19", "chapter": 3, "fixed_turn": null, "title": "摩天輪年度檢修提前", "fictional": true, "precondition": {"min_operational_wheels": 1}, "vfx_callback": "WHEEL_SPARK_MAINTENANCE", "choices": [{"id": "A", "label": "額外保養", "delta": {"budget": -2, "tourism": 0, "admin": 0, "complaints": -5}}, {"id": "B", "label": "調整營運時段", "delta": {"budget": 1, "tourism": -6, "admin": 0, "complaints": 0}}]},
  {"id": "EV20", "chapter": 3, "fixed_turn": null, "title": "下雨天遊客集體改行程", "fictional": true, "precondition": {}, "vfx_callback": "RAIN_STORM_DRIZZLE", "choices": [{"id": "A", "label": "室內活動", "delta": {"budget": -1, "tourism": 4, "admin": 0, "complaints": 0}}, {"id": "B", "label": "暫停活動", "delta": {"budget": 0, "tourism": -5, "admin": -2, "complaints": 0}}]},
  {"id": "EV21", "chapter": 3, "fixed_turn": null, "title": "企業要求「霸道總裁之眼」冠名", "fictional": true, "precondition": {}, "vfx_callback": "SPONSOR_NEON_WHEEL", "choices": [{"id": "A", "label": "接受冠名", "delta": {"budget": 4, "tourism": 0, "admin": 0, "complaints": 7}}, {"id": "B", "label": "拒絕冠名", "delta": {"budget": 0, "tourism": 2, "admin": 0, "complaints": 0}}]},
  {"id": "EV22", "chapter": 3, "fixed_turn": null, "title": "夜市攤商要求延長營業", "fictional": true, "precondition": {}, "vfx_callback": "NEON_STALL_LIGHTS", "choices": [{"id": "A", "label": "配合夜間活動", "delta": {"budget": -1, "tourism": 7, "admin": 0, "complaints": 0}}, {"id": "B", "label": "維持原時段", "delta": {"budget": 0, "tourism": 0, "admin": 0, "complaints": 4}}]},
  {"id": "EV23", "chapter": 3, "fixed_turn": null, "title": "摩天輪排隊超過兩小時", "fictional": true, "precondition": {"min_operational_wheels": 1}, "vfx_callback": "STICKER_FRENZY", "choices": [{"id": "A", "label": "增加現場管理", "delta": {"budget": -1, "tourism": 0, "admin": 0, "complaints": -8}}, {"id": "B", "label": "提供紀念貼紙", "delta": {"budget": -0.5, "tourism": 2, "admin": 0, "complaints": 3}}]},
  {"id": "EV24", "chapter": 3, "fixed_turn": null, "title": "兩座摩天輪互搶客源", "fictional": true, "precondition": {"min_operational_wheels": 2}, "vfx_callback": "TICKET_RIBBON_CUT", "choices": [{"id": "A", "label": "推聯票", "delta": {"budget": -1, "tourism": 7, "admin": 0, "complaints": 0}}, {"id": "B", "label": "分開宣傳", "delta": {"budget": 0, "tourism": 3, "admin": 5, "complaints": 0}}]},
  {"id": "EV25", "chapter": 3, "fixed_turn": null, "title": "愛情接駁車誤點", "fictional": true, "precondition": {"min_shuttles": 1}, "vfx_callback": "BUS_SMOKE_EXHAUST", "choices": [{"id": "A", "label": "增派調度", "delta": {"budget": -1, "tourism": 0, "admin": 0, "complaints": -7}}, {"id": "B", "label": "公告延誤原因", "delta": {"budget": 0, "tourism": 0, "admin": -2, "complaints": 5}}]},
  {"id": "EV26", "chapter": 3, "fixed_turn": null, "title": "商圈投資商要求修改合約", "fictional": true, "precondition": {"min_markets": 1}, "vfx_callback": "CONTRACT_SHREDDER", "choices": [{"id": "A", "label": "重新談判", "delta": {"budget": 0, "tourism": 0, "admin": 6, "complaints": -4}}, {"id": "B", "label": "接受條件", "delta": {"budget": 2, "tourism": 0, "admin": 0, "complaints": 5}}]},
  {"id": "EV27", "chapter": 3, "fixed_turn": 9, "title": "財政審查", "fictional": true, "precondition": {}, "vfx_callback": "SEIZURE_TAPE_WARNING", "choices": [{"id": "A", "label": "公開財務檢討", "delta": {"budget": 0, "tourism": 0, "admin": 5, "complaints": -10}}, {"id": "B", "label": "縮減宣傳", "delta": {"budget": 2, "tourism": -6, "admin": 0, "complaints": 0}}]},
  {"id": "EV28", "chapter": 4, "fixed_turn": null, "title": "市長要求愛情 KPI", "fictional": true, "precondition": {}, "vfx_callback": "CHART_ARROW_UP", "choices": [{"id": "A", "label": "委託研究", "delta": {"budget": -1, "tourism": 0, "admin": -5, "complaints": 0}}, {"id": "B", "label": "直接報告搭乘人次", "delta": {"budget": 0, "tourism": 0, "admin": 3, "complaints": 4}}]},
  {"id": "EV29", "chapter": 4, "fixed_turn": null, "title": "官方報告寫成「愛情產值無限大」", "fictional": true, "precondition": {}, "vfx_callback": "INFINITY_GLOW", "choices": [{"id": "A", "label": "修正數據", "delta": {"budget": 0, "tourism": 0, "admin": 3, "complaints": -6}}, {"id": "B", "label": "改用宣傳口號", "delta": {"budget": 0, "tourism": 3, "admin": 0, "complaints": 6}}]},
  {"id": "EV30", "chapter": 4, "fixed_turn": null, "title": "最後一項工程延誤", "fictional": true, "precondition": {}, "vfx_callback": "JACKHAMMER_NOISE", "choices": [{"id": "A", "label": "加速工程", "delta": {"budget": -2, "tourism": 0, "admin": 4, "complaints": 0}}, {"id": "B", "label": "延後驗收", "delta": {"budget": 0, "tourism": -5, "admin": -2, "complaints": 0}}]},
  {"id": "EV31", "chapter": 4, "fixed_turn": null, "title": "觀光客不知道怎麼回家", "fictional": true, "precondition": {}, "vfx_callback": "LOST_TOURIST_BUBBLE", "choices": [{"id": "A", "label": "臨時接駁", "delta": {"budget": -1, "tourism": 0, "admin": 0, "complaints": -8}}, {"id": "B", "label": "增設指示牌", "delta": {"budget": -0.5, "tourism": 0, "admin": 0, "complaints": -3}}]},
  {"id": "EV32", "chapter": 4, "fixed_turn": null, "title": "智慧觀光 App 沒人下載", "fictional": true, "precondition": {}, "vfx_callback": "APP_STORE_ONE_STAR", "choices": [{"id": "A", "label": "改善資訊服務", "delta": {"budget": -1, "tourism": 4, "admin": 0, "complaints": 0}}, {"id": "B", "label": "停止推廣", "delta": {"budget": 1, "tourism": -3, "admin": 0, "complaints": 0}}]},
  {"id": "EV33", "chapter": 4, "fixed_turn": null, "title": "摩天輪燈光與居民作息衝突", "fictional": true, "precondition": {}, "vfx_callback": "DISCO_LIGHT_WAR", "choices": [{"id": "A", "label": "調整照明", "delta": {"budget": 0, "tourism": -3, "admin": 0, "complaints": -7}}, {"id": "B", "label": "維持夜景", "delta": {"budget": 0, "tourism": 5, "admin": 0, "complaints": 8}}]},
  {"id": "EV34", "chapter": 4, "fixed_turn": null, "title": "五區代表要求參加成果發布", "fictional": true, "precondition": {}, "vfx_callback": "PODIUM_RUSH", "choices": [{"id": "A", "label": "共同發布", "delta": {"budget": -1, "tourism": 0, "admin": 0, "complaints": -7}}, {"id": "B", "label": "市府單獨發布", "delta": {"budget": 0, "tourism": 0, "admin": -3, "complaints": 5}}]},
  {"id": "EV35", "chapter": 4, "fixed_turn": null, "title": "財政局要求最後結清", "fictional": true, "precondition": {}, "vfx_callback": "PIGGY_BANK_CRACK", "choices": [{"id": "A", "label": "提前償還部分債務", "delta": {"budget": -2, "tourism": 0, "admin": 0, "complaints": -3}}, {"id": "B", "label": "展延償還", "delta": {"budget": 1, "tourism": 0, "admin": 5, "complaints": 0}}]},
  {"id": "EV36", "chapter": 4, "fixed_turn": 12, "title": "最終成果發表會", "fictional": true, "precondition": {}, "vfx_callback": "CONFUSED_CONFETTI", "choices": [{"id": "A", "label": "公布完整財政與服務報告", "delta": {"budget": 0, "tourism": 0, "admin": 3, "complaints": -8}}, {"id": "B", "label": "舉辦大型慶祝活動", "delta": {"budget": -2, "tourism": 10, "admin": 0, "complaints": 0}}]}
];

export const NARRATIVE = {
  "mayor_quotes": [
    "愛情不是感覺，愛情是本市下個季度的 GDP！",
    "地球是圓的，經濟不能是平的！讓整座城市跟著摩天輪轉出偉大！",
    "這不叫浪費預算，這叫浪漫的基礎建設！",
    "貨櫃裡裝的不再是零件，而是純粹的愛情！",
    "年輕人談戀愛看存摺嗎？這不叫赤字，這叫愛情的先行投資！"
  ],
  "news_ticker": [
    {"type": "breaking", "text": "【快訊】舊城區天空消失第三天，居民自發舉辦「尋找太陽」燭光晚會。"},
    {"type": "department", "text": "【局處切割】交通局嚴正澄清：從未核准 80 度山城雲霄飛車式公車路線。"},
    {"type": "economy", "text": "【市場動態】愛情商圈香腸攤營收超越半導體封測廠，市府研擬課徵浪漫加值稅。"},
    {"type": "civil", "text": "【陳情速報】市民抗議大聲公音量突破 140 分貝，工務局表示將採購更大聲公反制。"},
    {"type": "tourism", "text": "【觀光熱潮】外地情侶搭乘摩天輪因卡死半空 6 小時，獲頒市府「堅定愛情認證書」。"},
    {"type": "finance", "text": "【財政預警】財政局辦公椅已被法院張貼查封封條，局長宣布全體同仁站立辦公以展現決心。"}
  ],
  "interpreter_states": {
    "calm": {"mood": "專業微笑", "icon": "😊", "description": "維持端莊的公務手語翻譯"},
    "frown": {"mood": "深鎖眉頭", "icon": "😟", "description": "翻譯市長幹話時不由自主嘴角抽搐"},
    "facepalm": {"mood": "扶額嘆氣", "icon": "🤦", "description": "聽到離譜政策直接暫停手語，扶額長嘆"},
    "strike_x": {"mood": "當機比叉", "icon": "🙅", "description": "雙手在胸前比出大大的Ｘ，宣布手語罷工"}
  },
  "finance_director_notes": {
    "stage_1": [
      "市長，目前帳目尚稱整齊，請務必按照進度撥款。",
      "公聽會的茶水費已經報銷，請長官放心。"
    ],
    "stage_2": [
      "國庫不是許願池，愛情也不能無卡分期！",
      "如果下個月沒長出浪漫，我們兩個都會被抓去關！",
      "我已經下令把市府二樓以上燈全關了，您現在滿意了嗎？！"
    ],
    "stage_3": [
      "銀行決定明天查封辦公椅，請您站著批公文...",
      "（氧氣罩喘息聲）緊急預備金在碎紙機下...別讓市長看到...（逼——）",
      "醫院說我的心電圖跟摩天輪的旋轉頻率完全同步了..."
    ]
  },
  "achievements": [
    {"id": "ACH01", "key": "newtons_tears", "title": "牛頓的眼淚", "description": "拉出一條連接最低海拔(港灣區0.5)與最高海拔(山城區4.0)的接駁軌道。", "icon": "🎢"},
    {"id": "ACH02", "key": "ruthless_stamp_machine", "title": "無情的蓋章機器", "description": "在公文飛入後 1 秒內連續三次盲目蓋章決行。", "icon": "⚡"},
    {"id": "ACH03", "key": "what_is_sunlight_right", "title": "日照權是什麼", "description": "在擁擠的舊城區強塞 3 座摩天輪，享受極限穿模。", "icon": "🎡"},
    {"id": "ACH04", "key": "hearing_time_freeze", "title": "會議時空暫停之術", "description": "單局花費 5 次以上預算召開「公聽會」讓市民集體入睡。", "icon": "💤"},
    {"id": "ACH05", "key": "cyber_night_market", "title": "高科技賽博夜市", "description": "科技區同時擁有商圈、摩天輪，並接受霸道總裁冠名。", "icon": "🤖"},
    {"id": "ACH06", "key": "treasury_actuary_master", "title": "國庫精算大師", "description": "第 12 回合結算時，淨預算 (預算減債務) 剛好為 $0 億。", "icon": "🎯"}
  ]
};

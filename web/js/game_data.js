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
  "endings_dossier": {
  "HIDDEN_S": {
    "id": "HIDDEN_S",
    "title": "《愛情無價，市府破產》",
    "rank": "S",
    "tagline": "極致浪漫的財政黑洞",
    "official_propaganda": {
      "headline": "【市政榮耀特報】浪漫之都奇蹟誕生！市民滿意度突破天際！",
      "gold_stamp": "千秋萬世・永垂不朽",
      "polaroid_caption": "「璀璨煙火點亮港灣，法院封條輝映星光。」",
      "story": "摩天輪的彩燈徹夜不息，整座城市沉浸在粉紅色的歡呼中。市長在市民震耳欲聾的歡呼聲中搭上專機進軍中央，留下全亞洲最浪漫的微縮廢墟。"
    },
    "thermal_receipt": {
      "title": "高雄地方法院民事執行處・拍賣清單",
      "items": [
        {
          "name": "市政大樓 1-10 樓",
          "cost": "-120.0 億"
        },
        {
          "name": "市長親筆簽名『如擬』官印",
          "cost": "-0.05 億"
        },
        {
          "name": "未拆封之 80 度雲霄飛車公車 10 輛",
          "cost": "-1.2 億"
        },
        {
          "name": "財政局長心臟加護病房看護費",
          "cost": "-0.02 億"
        },
        {
          "name": "累計愛情赤字總額",
          "cost": "無價"
        }
      ],
      "memo": "附註：市長已去選總統，請主任留在這向監察院彈劾委員會逐項說明。"
    }
  },
  "全市愛情接駁網": {
    "id": "全市愛情接駁網",
    "title": "《全市愛情接駁網》",
    "rank": "A",
    "tagline": "天羅地網的浪漫動線",
    "official_propaganda": {
      "headline": "【交通奇蹟】五區連成一線，市民出門即落入愛河！",
      "gold_stamp": "通達無阻",
      "polaroid_caption": "「穿透民宅客廳的透明軌道成為全新觀光景點。」",
      "story": "無論你身處險峻山城還是偏遠郊區，雙層紅色巴士隨時載著你在 80 度險坡上體會心跳加速的真諦。"
    },
    "thermal_receipt": {
      "title": "高高捷運公共運輸處・年度營運檢討",
      "items": [
        {
          "name": "民宅客廳穿模補償金",
          "cost": "-4.5 億"
        },
        {
          "name": "海中打撈脫軌公車費用",
          "cost": "-2.1 億"
        },
        {
          "name": "五區市民暈車藥公費補助",
          "cost": "-0.8 億"
        }
      ],
      "memo": "交通局長表示：只要沒人看儀表板，時速 120 度的山城接駁就是安全的。"
    }
  },
  "一城五輪": {
    "id": "一城五輪",
    "title": "《一城五輪》",
    "rank": "A",
    "tagline": "地平線上只有轉動的鋼鐵",
    "official_propaganda": {
      "headline": "【巨構奇觀】五座摩天輪拔地而起，高雄成為地球轉速控制器！",
      "gold_stamp": "輪蓋天下",
      "polaroid_caption": "「從太空衛星清晰可見五個旋轉的粉紅同心圓。」",
      "story": "市民每天起床推開窗，除了摩天輪鋼架什麼也看不見。白天遮蔽日照，夜晚霓虹刺眼，但觀光客的打卡照永遠排在熱搜第一。"
    },
    "thermal_receipt": {
      "title": "工務局違章建築拆除大隊・超載審查報告",
      "items": [
        {
          "name": "高壓電網超載維修",
          "cost": "-8.0 億"
        },
        {
          "name": "舊城區居民日照權求償團訟",
          "cost": "-15.0 億"
        },
        {
          "name": "鋼索潤滑油批發採購",
          "cost": "-3.2 億"
        }
      ],
      "memo": "經緯度已修正，市民表示已分不清現在是正午還是深夜。"
    }
  },
  "摩天輪旁的夜市": {
    "id": "摩天輪旁的夜市",
    "title": "《摩天輪旁的夜市》",
    "rank": "B",
    "tagline": "油煙與浪漫的和諧共生",
    "official_propaganda": {
      "headline": "【庶民經濟大勝利】愛情摩天輪帶動商圈烤香腸營收逆天！",
      "gold_stamp": "發大財",
      "polaroid_caption": "「炭烤黑輪的白煙巧妙遮蔽了摩天輪未完工的鏽斑。」",
      "story": "市民排隊兩個小時搭摩天輪，下來後正好排隊買雞排與珍奶。經濟數據一片大好，雖然排煙檢舉電話打爆了環保局。"
    },
    "thermal_receipt": {
      "title": "市場管理處・油水分離槽清理結算",
      "items": [
        {
          "name": "地面油垢刮除工程",
          "cost": "-1.5 億"
        },
        {
          "name": "發電機跳電維修",
          "cost": "-0.9 億"
        },
        {
          "name": "夜市管理費淨盈餘",
          "cost": "+12.0 億"
        }
      ],
      "memo": "經發局長評估：此模式已具備向全台推廣之潛力。"
    }
  },
  "預算追加申請中": {
    "id": "預算追加申請中",
    "title": "《預算追加申請中》",
    "rank": "C",
    "tagline": "在赤字深淵中打撈希望",
    "official_propaganda": {
      "headline": "【願景未完】重大建設進入深水區，市府力爭議會追加特別預算！",
      "gold_stamp": "審議中",
      "polaroid_caption": "「未完工的鋼架貼滿黃色封條，宛如當代裝置藝術。」",
      "story": "包商在市府門口舉白布條泡茶，工程吊車停在路中央變成流浪貓樂園。長官在議會備詢時頻繁喝水，強調這叫分期實踐。"
    },
    "thermal_receipt": {
      "title": "審計處・重大工程逾期催討公文",
      "items": [
        {
          "name": "銀行逾期利息",
          "cost": "-4.8 億"
        },
        {
          "name": "吊車租金違約金",
          "cost": "-3.1 億"
        },
        {
          "name": "議會公關說明餐費",
          "cost": "-0.3 億"
        }
      ],
      "memo": "主計處提醒：金庫鑰匙已抵押給民間租賃公司。"
    }
  },
  "永遠開不完的協調會": {
    "id": "永遠開不完的協調會",
    "title": "《永遠開不完的協調會》",
    "rank": "C",
    "tagline": "便當比建設更具影響力",
    "official_propaganda": {
      "headline": "【深耕溝通】跨局處協調會議突破 999 場，凝聚全民共識！",
      "gold_stamp": "研議中",
      "polaroid_caption": "「會議室白板寫滿『請再研議』與『洽悉』。」",
      "story": "五區代表每週固定齊聚大禮堂，公文在三個局處間旅行了兩萬公里。雖然什麼都沒蓋出來，但全體公務員保證每份便當都符合採購法。"
    },
    "thermal_receipt": {
      "title": "秘書處・公務便當與會議茶點明細",
      "items": [
        {
          "name": "雙主菜排骨便當 12,000 盒",
          "cost": "-0.15 億"
        },
        {
          "name": "白板筆與便利貼耗材",
          "cost": "-0.02 億"
        },
        {
          "name": "公文公差里程報銷",
          "cost": "-0.08 億"
        }
      ],
      "memo": "結論：下次會議預計於下個月第三個星期二繼續研商下次議程。"
    }
  },
  "招商成功，命名失敗": {
    "id": "招商成功，命名失敗",
    "title": "《招商成功，命名失敗》",
    "rank": "B",
    "tagline": "尊爵不凡的土豪美學",
    "official_propaganda": {
      "headline": "【民間注資】企業重金冠名！『霸道總裁極致奢華之眼』落成啟用！",
      "gold_stamp": "招商特優",
      "polaroid_caption": "「巨大跑馬燈每晚滾動播放贊助商董事長祝壽賀詞。」",
      "story": "市府一毛錢沒花就迎來金主，代價是摩天輪每個車廂都貼上養髮液廣告。市民拍照打卡時紛紛手動裁剪頂端刺眼的企業 Logo。"
    },
    "thermal_receipt": {
      "title": "財政局・冠名權權利金入帳證明",
      "items": [
        {
          "name": "企業冠名授權收入",
          "cost": "+8.0 億"
        },
        {
          "name": "市民美學心理創傷輔導費",
          "cost": "-1.2 億"
        },
        {
          "name": "夜間光害違規罰單(免罰待查)",
          "cost": "$0"
        }
      ],
      "memo": "贊助商要求下季將接駁公車全數漆為金色豹紋。"
    }
  },
  "低調完成任務": {
    "id": "低調完成任務",
    "title": "《低調完成任務》",
    "rank": "A",
    "tagline": "平安下莊的公務員傳奇",
    "official_propaganda": {
      "headline": "【準時驗收】各項指標如期交付，長官平安卸任榮調中央！",
      "gold_stamp": "圓滿下莊",
      "polaroid_caption": "「乾淨的辦公桌上只留下一盆常青植物與調職令。」",
      "story": "沒有浮誇的政績，也沒有暴雷的赤字。你精準踩著預算線，既沒讓市民抗議失控，也沒被檢調約談，成為市府史上極罕見的生還者。"
    },
    "thermal_receipt": {
      "title": "審計部・全案決算合格證書",
      "items": [
        {
          "name": "決算預算結餘",
          "cost": "+2.4 億"
        },
        {
          "name": "公務員退撫提撥款",
          "cost": "-0.6 億"
        },
        {
          "name": "考績甲等績效獎金",
          "cost": "+0.03 億"
        }
      ],
      "memo": "長官私下交代：別在受訪時提起摩天輪三個字。"
    }
  },
  "仍在協商中的愛情城市": {
    "id": "仍在協商中的愛情城市",
    "title": "《仍在協商中的愛情城市》",
    "rank": "D",
    "tagline": "如夢似幻的未竟之業",
    "official_propaganda": {
      "headline": "【留白之美】城市發展貴在沈澱，重大願景邁入下個五年規劃！",
      "gold_stamp": "存查結案",
      "polaroid_caption": "「沙盤上的模型有些積灰，但市長背板依舊神采奕奕。」",
      "story": "十二個回合過去了，第一座摩天輪孤零零轉動著，五個區依然各自獨立。市民依舊過著平凡的日子，彷彿那些宏大的口號只是一場午後雷陣雨。"
    },
    "thermal_receipt": {
      "title": "研考會・施政計畫列管追蹤表",
      "items": [
        {
          "name": "未執行工程預算保留款",
          "cost": "+18.0 億"
        },
        {
          "name": "期末成果手冊印製費",
          "cost": "-0.1 億"
        },
        {
          "name": "存查檔案歸檔規費",
          "cost": "-0.01 億"
        }
      ],
      "memo": "全案併同願景白皮書一併送檔案室永久典藏。"
    }
  }
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

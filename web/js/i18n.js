/**
 * 《高高平等：人人有輪坐》 多語言在地化系統 (i18n)
 * 支援：繁體中文 (zh), English (en), 日本語 (ja), Français (fr), Nederlands (nl)
 */

export const SUPPORTED_LANGS = [
  { code: 'zh', label: '繁體中文' },
  { code: 'en', label: 'English' },
  { code: 'ja', label: '日本語' },
  { code: 'fr', label: 'Français' },
  { code: 'nl', label: 'Nederlands' }
];

let currentLocale = (typeof localStorage !== 'undefined' ? localStorage.getItem('gaogao_lang') : null) || 'zh';
if (!SUPPORTED_LANGS.some(l => l.code === currentLocale)) {
  currentLocale = 'zh';
}

export function getLocale() {
  return currentLocale;
}

export function setLocale(lang) {
  if (SUPPORTED_LANGS.some(l => l.code === lang)) {
    currentLocale = lang;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('gaogao_lang', lang);
    }
  }
}

export const UI_STRINGS = {
  zh: {
    app_title: "《高高平等：人人有輪坐》",
    news_badge: "⚡ 獨家快訊",
    interpreter_title: "手語翻譯",
    net_budget_label: "NET BUDGET 淨預算餘額",
    tourism_label: "觀光活力",
    admin_label: "行政負擔",
    complaints_label: "陳情壓力",
    chapter_format: "第 {0} 章",
    turn_format: "第 {0} / 12 回合",
    act_wheel: "🎡 愛情摩天輪",
    act_wheel_cost: "$8億 / 2回",
    act_shuttle: "🚌 愛情接駁線",
    act_shuttle_cost: "$3億 / 即時",
    act_market: "🏪 愛情商圈",
    act_market_cost: "$3億 / 1回",
    act_event: "💕 巡迴充氣活動",
    act_event_cost: "$2億 / 即時",
    act_hearing: "📋 召開公聽會",
    act_hearing_cost: "$1億 / 催眠",
    act_repay: "💰 償還債務",
    act_repay_cost: "上限現金",
    act_rest: "☕ 暫停建設 (休息)",
    act_rest_cost: "$0",
    doc_gov_title: "高雄市市政重大決策簽呈",
    doc_disclaimer: "※ 備註：以下各項方案均屬虛構市政決策，後續影響將由主政首長承擔全責。",
    stamp_approved: "如擬",
    modal_cancel: "取消本項行動",
    zone_select_title_wheel: "🎡 選擇摩天輪空投行政區 (花費 $8 億)",
    zone_select_title_shuttle: "🚌 選擇長官紅筆接駁軌道端點 (花費 $3 億)",
    zone_select_title_market: "🏪 選擇愛情商圈進駐行政區 (花費 $3 億)",
    zone_select_title_event: "💕 選擇免洗巡迴活動舉辦區 (花費 $2 億)",
    zone_status_existing: "現有: {0}",
    zone_status_old_town: "現有: {0} (上限 3 座可穿模)",
    shuttle_connected: "已連通",
    shuttle_build: "點擊拉線",
    shuttle_newton_tag: " [80度落差-解鎖牛頓眼淚]",
    turn1_mandatory_alert: "【市長重大指示】第 1 回合為「愛情起飛」！\n長官要求必須先在某一行政區空投第一座「🎡 愛情摩天輪」作為城市標竿！",
    unit_yi: "億",
    unlocked_achievement: "★ 達成成就 UNLOCKED",
    restart_game: "🔄 重新召開市政會議 (新局)",
    no_special_ach: "本局未達成特殊成就",
    eval_rank: "評定等第：【{0} 級】",
    audit_date: "決算日期：第 12 回合終局審查",
    actual_balance: "實質預算結餘",
    confidential_memo: "📌 機密備忘錄：",
    drawer_tab_open: "建設行動",
    drawer_tab_close: "收起選單",
    drawer_header_title: "市政行動清單"
  },
  en: {
    app_title: "Kaohsiung Equality: Wheels for Everyone",
    news_badge: "⚡ BREAKING NEWS",
    interpreter_title: "Sign Language",
    net_budget_label: "NET BUDGET BALANCE",
    tourism_label: "Tourism Vitality",
    admin_label: "Admin Burden",
    complaints_label: "Petition Pressure",
    chapter_format: "Chapter {0}",
    turn_format: "Turn {0} / 12",
    act_wheel: "🎡 Love Ferris Wheel",
    act_wheel_cost: "$8B / 2 Turns",
    act_shuttle: "🚌 Love Shuttle Track",
    act_shuttle_cost: "$3B / Instant",
    act_market: "🏪 Love Night Market",
    act_market_cost: "$3B / 1 Turn",
    act_event: "💕 Inflatable Cupid Tour",
    act_event_cost: "$2B / Instant",
    act_hearing: "📋 Public Hearing",
    act_hearing_cost: "$1B / Hypnosis",
    act_repay: "💰 Repay Debt",
    act_repay_cost: "Up to Cash",
    act_rest: "☕ Pause Building (Rest)",
    act_rest_cost: "$0",
    doc_gov_title: "KAOHSIUNG CITY POLICY DECREE",
    doc_disclaimer: "※ Note: All options are satirical municipal policies; the Chief Executive bears all consequences.",
    stamp_approved: "APPROVED",
    modal_cancel: "Cancel Action",
    zone_select_title_wheel: "🎡 Choose Airdrop Zone for Ferris Wheel ($8B)",
    zone_select_title_shuttle: "🚌 Draw Chief's Red Pen Shuttle Track ($3B)",
    zone_select_title_market: "🏪 Choose Zone for Love Night Market ($3B)",
    zone_select_title_event: "💕 Choose Zone for Inflatable Cupid Event ($2B)",
    zone_status_existing: "Existing: {0}",
    zone_status_old_town: "Existing: {0} (Max 3 with clipping)",
    shuttle_connected: "Connected",
    shuttle_build: "Click to Draw",
    shuttle_newton_tag: " [80° Cliff - Newton's Tears]",
    turn1_mandatory_alert: "[Mayor's Directive] Turn 1 is 'Love Takes Off'!\nYou must airdrop your first Love Ferris Wheel as the city landmark!",
    unit_yi: "B",
    unlocked_achievement: "★ ACHIEVEMENT UNLOCKED",
    restart_game: "🔄 Convene New Council Meeting (Restart)",
    no_special_ach: "No special achievements unlocked this session",
    eval_rank: "Evaluation Grade: [Rank {0}]",
    audit_date: "Audit Date: Round 12 Final Settlement",
    actual_balance: "Net Budget Surplus",
    confidential_memo: "📌 CONFIDENTIAL MEMO:",
    drawer_tab_open: "Actions",
    drawer_tab_close: "Close",
    drawer_header_title: "Municipal Actions"
  },
  ja: {
    app_title: "『高高平等：みんなに乗る観覧車がある』",
    news_badge: "⚡ 独占速報",
    interpreter_title: "手話通訳",
    net_budget_label: "正味予算残高 (NET BUDGET)",
    tourism_label: "観光活力",
    admin_label: "行政負担",
    complaints_label: "陳情圧力",
    chapter_format: "第 {0} 章",
    turn_format: "第 {0} / 12 ターン",
    act_wheel: "🎡 愛の観覧車",
    act_wheel_cost: "8億 / 2回",
    act_shuttle: "🚌 愛のシャトル線",
    act_shuttle_cost: "3億 / 即時",
    act_market: "🏪 愛の商店街",
    act_market_cost: "3億 / 1回",
    act_event: "💕 バルーン巡回イベント",
    act_event_cost: "2億 / 即時",
    act_hearing: "📋 公聴会を開催",
    act_hearing_cost: "1億 / 催眠",
    act_repay: "💰 借入金を返済",
    act_repay_cost: "所持金上限",
    act_rest: "☕ 建設中止 (休憩)",
    act_rest_cost: "0億",
    doc_gov_title: "高雄市市政重大政策決裁書",
    doc_disclaimer: "※ 備考：以下の選択肢は全て架空の市政方針であり、結果責任は市長に帰属します。",
    stamp_approved: "可決",
    modal_cancel: "行動をキャンセル",
    zone_select_title_wheel: "🎡 観覧車を投下する行政区を選択 (費用 8億)",
    zone_select_title_shuttle: "🚌 赤ペンで引くシャトル軌道を選択 (費用 3億)",
    zone_select_title_market: "🏪 愛の商店街を開設する行政区を選択 (費用 3億)",
    zone_select_title_event: "💕 バルーンイベントの開催区を選択 (費用 2億)",
    zone_status_existing: "設置済: {0}",
    zone_status_old_town: "設置済: {0} (最大3基まで建物貫通可)",
    shuttle_connected: "接続済",
    shuttle_build: "クリックで敷設",
    shuttle_newton_tag: " [80度傾斜-ニュートンの涙]",
    turn1_mandatory_alert: "【市長訓示】第1ターンは「愛の離陸」です！\nまずシンボルとして最初の「🎡 愛の観覧車」を投下してください！",
    unit_yi: "億",
    unlocked_achievement: "★ 実績解除 UNLOCKED",
    restart_game: "🔄 新たな市政会議を招集 (再起動)",
    no_special_ach: "今局で解除された特別実績はありません",
    eval_rank: "総合評価判定：【ランク {0}】",
    audit_date: "決算期日：第12ターン終局監査",
    actual_balance: "実質予算余剰",
    confidential_memo: "📌 機密メモ：",
    drawer_tab_open: "建設行動",
    drawer_tab_close: "閉じる",
    drawer_header_title: "市政行動リスト"
  },
  fr: {
    app_title: "Égalité Kaohsiung : Une Grande Roue pour Tous",
    news_badge: "⚡ FLASH INFO",
    interpreter_title: "Langue des Signes",
    net_budget_label: "SOLDE BUDGÉTAIRE NET",
    tourism_label: "Vitalité Touristique",
    admin_label: "Fardeau Administratif",
    complaints_label: "Pression des Pétitions",
    chapter_format: "Chapitre {0}",
    turn_format: "Tour {0} / 12",
    act_wheel: "🎡 Grande Roue de l'Amour",
    act_wheel_cost: "8 Mrd / 2 Tours",
    act_shuttle: "🚌 Navette de l'Amour",
    act_shuttle_cost: "3 Mrd / Immédiat",
    act_market: "🏪 Marché de l'Amour",
    act_market_cost: "3 Mrd / 1 Tour",
    act_event: "💕 Événement Gonflable",
    act_event_cost: "2 Mrd / Immédiat",
    act_hearing: "📋 Audience Publique",
    act_hearing_cost: "1 Mrd / Hypnose",
    act_repay: "💰 Rembourser la Dette",
    act_repay_cost: "Max Disponible",
    act_rest: "☕ Pause Travaux (Repos)",
    act_rest_cost: "0 Mrd",
    doc_gov_title: "DÉCRET POLITIQUE MUNICIPAL DE KAOHSIUNG",
    doc_disclaimer: "※ Note : Toutes les options sont satiriques ; le maire assume toutes les retombées politiques.",
    stamp_approved: "APPROUVÉ",
    modal_cancel: "Annuler l'action",
    zone_select_title_wheel: "🎡 Choisir la zone pour la Grande Roue (8 Mrd)",
    zone_select_title_shuttle: "🚌 Tracer la navette au stylo rouge du Maire (3 Mrd)",
    zone_select_title_market: "🏪 Choisir la zone pour le Marché Nocturne (3 Mrd)",
    zone_select_title_event: "💕 Choisir la zone pour la tournée Cupidon (2 Mrd)",
    zone_status_existing: "Actuel : {0}",
    zone_status_old_town: "Actuel : {0} (Max 3 avec collision)",
    shuttle_connected: "Relié",
    shuttle_build: "Tracer la ligne",
    shuttle_newton_tag: " [Pente à 80° - Les Larmes de Newton]",
    turn1_mandatory_alert: "[Ordre du Maire] Le Tour 1 est 'L'Envol de l'Amour' !\nVous devez d'abord parachuter votre première Grande Roue !",
    unit_yi: "Mrd",
    unlocked_achievement: "★ SUCCÈS DÉVERROUILLÉ",
    restart_game: "🔄 Convoquer un Nouveau Conseil (Recommencer)",
    no_special_ach: "Aucun succès spécial déverrouillé lors de cette session",
    eval_rank: "Mention d'Évaluation : [Rang {0}]",
    audit_date: "Date d'Audit : Clôture du 12ème Tour",
    actual_balance: "Excédent Budgétaire Réel",
    confidential_memo: "📌 MÉMORANDUM CONFIDENTIEL :",
    drawer_tab_open: "Actions",
    drawer_tab_close: "Fermer",
    drawer_header_title: "Actions Municipales"
  },
  nl: {
    app_title: "Kaohsiung Gelijkheid: Reuzenraderen voor Iedereen",
    news_badge: "⚡ LAATSTE NIEUWS",
    interpreter_title: "Gebarentaal",
    net_budget_label: "NETTO BUDGETSALDO",
    tourism_label: "Toeristische Vitaliteit",
    admin_label: "Administratieve Last",
    complaints_label: "Klachten Druk",
    chapter_format: "Hoofdstuk {0}",
    turn_format: "Beurt {0} / 12",
    act_wheel: "🎡 Liefdesreuzenrad",
    act_wheel_cost: "€8 mrd / 2 Beurten",
    act_shuttle: "🚌 Liefdesshuttle Lijn",
    act_shuttle_cost: "€3 mrd / Direct",
    act_market: "🏪 Romantische Avondmarkt",
    act_market_cost: "€3 mrd / 1 Beurt",
    act_event: "💕 Opblaasbare Cupido Tour",
    act_event_cost: "€2 mrd / Direct",
    act_hearing: "📋 Hoorzitting Houden",
    act_hearing_cost: "€1 mrd / Hypnose",
    act_repay: "💰 Schuld Aflossen",
    act_repay_cost: "Max Beschikbaar",
    act_rest: "☕ Bouw Pauzeren (Rust)",
    act_rest_cost: "€0",
    doc_gov_title: "BELEIDSBESLUIT GEMEENTE KAOHSIUNG",
    doc_disclaimer: "※ Let op: Alle beleidskeuzes zijn satirisch; de burgemeester draagt de volle verantwoordelijkheid.",
    stamp_approved: "GOEDGEKEURD",
    modal_cancel: "Actie Annuleren",
    zone_select_title_wheel: "🎡 Kies wijk voor Reuzenrad Airdrop (€8 mrd)",
    zone_select_title_shuttle: "🚌 Trek shuttlelijn met burgemeesters rode pen (€3 mrd)",
    zone_select_title_market: "🏪 Kies wijk voor Romantische Avondmarkt (€3 mrd)",
    zone_select_title_event: "💕 Kies wijk voor Opblaasbare Cupido (€2 mrd)",
    zone_status_existing: "Aanwezig: {0}",
    zone_status_old_town: "Aanwezig: {0} (Max 3 met gebouw-clipping)",
    shuttle_connected: "Verbonden",
    shuttle_build: "Klik om te trekken",
    shuttle_newton_tag: " [80° Helling - Newtons Tranen]",
    turn1_mandatory_alert: "[Instructie Burgemeester] Beurt 1 is 'Liefde Stijgt Op'!\nU moet eerst een eerste Liefdesreuzenrad droppen als icoon!",
    unit_yi: "mrd",
    unlocked_achievement: "★ PRESTATIE ONTGRENDELD",
    restart_game: "🔄 Nieuwe Raadsvergadering Beleggen (Herstarten)",
    no_special_ach: "Geen speciale prestaties behaald in deze ronde",
    eval_rank: "Eindbeoordeling: [Rang {0}]",
    audit_date: "Auditdatum: Eindafrekening Ronde 12",
    actual_balance: "Reëel Begrotingsoverschot",
    confidential_memo: "📌 VERTROUWELIJK MEMORANDUM:",
    drawer_tab_open: "Acties",
    drawer_tab_close: "Sluiten",
    drawer_header_title: "Gemeentelijke Acties"
  }
};

export const STICKY_NOTES_PHRASES = {
  zh: [
    "急件！市長要求摩天輪粉紅色霓虹燈必須在下週完工！",
    "特急！舊城區居民集體抗議日照權遭巨輪遮蔽！",
    "極機密：經發局報告建議將香腸攤納入高科技產業！",
    "長官震怒！80度接駁公車被拍到在空中翻轉兩圈！",
    "請速簽：山城區居民要求每戶配置個人高空滑索！",
    "限今日下班前回覆：五區代表要求重新計算平等指標！"
  ],
  en: [
    "URGENT: Mayor demands pink neon lights on Ferris wheel finished next week!",
    "CRITICAL: Old Town residents protest sunlight completely blocked by giant wheel!",
    "TOP SECRET: Econ Bureau suggests reclassifying sausage stalls as high-tech!",
    "CHIEF ENRAGED: 80° shuttle bus filmed doing two aerial flips!",
    "PLEASE SIGN: Mountain residents demand personal zip lines for every household!",
    "REPLY TODAY: All district reps demand recalculation of equality index!"
  ],
  ja: [
    "至急！市長が観覧車のピンクネオンを来週中に完工するよう要求！",
    "特急！旧市街の住民が日照権を大観覧車に遮られたと集団抗議！",
    "極秘：経発局の報告書でソーセージ屋台のハイテク産業指定を提案！",
    "長官激怒！80度のシャトルバスが空中で2回転した映像が拡散！",
    "至急決裁：山岳住民が全世帯への専用ジップライン配備を要求！",
    "本日中必着：全区代表が平等指数の再計算を要求！"
  ],
  fr: [
    "URGENT ! Le maire exige que les néons roses de la Grande Roue soient finis la semaine prochaine !",
    "TRÈS URGENT ! Les riverains de la Vieille Ville protestent contre la disparition du soleil !",
    "SECRET DÉFENSE : Rapport suggérant de classer les stands de saucisses comme haute-technologie !",
    "COLÈRE DU MAIRE ! La navette à 80° a été filmée en train de faire deux loopings !",
    "À SIGNER : Les habitants de la montagne réclament une tyrolienne par foyer !",
    "RÉPONSE AVANT CE SOIR : Les 5 districts exigent un recalcul de l'indice d'égalité !"
  ],
  nl: [
    "SPOED! Burgemeester eist dat de roze neonlichten op het reuzenrad volgende week klaar zijn!",
    "ZEER DRINGEND! Oude Stad protesteert massaal omdat reuzenrad alle zonlicht wegneemt!",
    "STRIKT GEHEIM: Economische Dienst stelt voor worstenkramen als hightech aan te merken!",
    "WOEDE BIJ BURGEMEESTER! 80°-shuttlebus gefilmd terwijl hij twee salto's in de lucht maakte!",
    "DRINGEND TEKENEN: Bergbewoners eisen een persoonlijke kabelbaan voor elk huishouden!",
    "VANDAAG BEANTWOORDEN: Alle districten eisen herberekening van de gelijkheidsindex!"
  ]
};

export const FINANCE_DIRECTOR_NOTES = {
  zh: {
    stage_1: [
      "市長，目前帳目尚稱整齊，請務必按照進度撥款。",
      "公聽會的茶水費已經報銷，請長官放心。"
    ],
    stage_2_warning: "⚠️ 財政嚴重告急！",
    stage_2: [
      "國庫不是許願池，愛情也不能無卡分期！",
      "如果下個月沒長出浪漫，我們兩個都會被抓去關！",
      "我已經下令把市府二樓以上燈全關了，您現在滿意了嗎？！"
    ],
    stage_3_fund: "緊急預備金",
    stage_3_chart: `🏥 高雄榮總診斷書<br>病患：財政局長<br>症狀：急性摩天輪赤字焦慮症<br>醫囑：請勿再提愛情經濟`
  },
  en: {
    stage_1: [
      "Mayor, the books are balanced for now. Please disburse on schedule.",
      "Hearing refreshment expenses have been reimbursed. Rest assured."
    ],
    stage_2_warning: "⚠️ FISCAL EMERGENCY!",
    stage_2: [
      "The treasury is not a wishing well, and love cannot be bought on credit!",
      "If romance doesn't blossom next month, both of us will end up behind bars!",
      "I ordered all lights above the 2nd floor shut off. Are you satisfied?!"
    ],
    stage_3_fund: "EMERGENCY FUND",
    stage_3_chart: `🏥 Kaohsiung General Hospital<br>Patient: Finance Director<br>Diagnosis: Acute Ferris Wheel Deficit Anxiety<br>Rx: Cease all romance economic talks`
  },
  ja: {
    stage_1: [
      "市長、現在のところ帳簿は整っております。計画通りの執行を願います。",
      "公聴会のお茶代は精算済みです。ご安心ください。"
    ],
    stage_2_warning: "⚠️ 財政危機警報！",
    stage_2: [
      "国庫は賽銭箱ではありません！愛をローンで買うことは不可能です！",
      "来月ロマンスが実を結ばなければ、私たち二人は投獄されます！",
      "市庁舎2階以上の照明を全消灯させました。これでご満足ですか？！"
    ],
    stage_3_fund: "緊急予備費",
    stage_3_chart: `🏥 高雄総合病院 診断書<br>患者：財政局長<br>病名：急性観覧車赤字パニック障害<br>指示：二度と「愛の経済」を口にしないこと`
  },
  fr: {
    stage_1: [
      "Monsieur le Maire, les comptes sont en ordre. Merci de respecter l'échéancier.",
      "Les frais de café des audiences ont été remboursés. Ne vous inquiétez pas."
    ],
    stage_2_warning: "⚠️ CRISE BUDGÉTAIRE GRAVE !",
    stage_2: [
      "Le trésor public n'est pas un puits à souhaits, et l'amour ne s'achète pas à crédit !",
      "Si la romance ne décolle pas le mois prochain, nous finirons tous deux en prison !",
      "J'ai fait éteindre toutes les lumières dès le 1er étage. Êtes-vous satisfait ?!"
    ],
    stage_3_fund: "FONDS D'URGENCE",
    stage_3_chart: `🏥 Hôpital Central de Kaohsiung<br>Patient : Directeur des Finances<br>Diagnostic : Crise aiguë d'anxiété du déficit de la Grande Roue<br>Prescription : Interdiction de parler d'économie romantique`
  },
  nl: {
    stage_1: [
      "Burgemeester, de boekhouding is vooralsnog op orde. Houd u aan de begroting.",
      "De koffiekosten van de hoorzitting zijn gedeclareerd. Maakt u zich geen zorgen."
    ],
    stage_2_warning: "⚠️ ERNSTIGE BEGROTINGSNODEN!",
    stage_2: [
      "De schatkist is geen wensput, en liefde koop je niet op afbetaling!",
      "Als er volgende maand geen romantiek bloeit, belanden we allebei in de cel!",
      "Ik heb alle lichten vanaf de 2e verdieping laten uitschakelen. Bent u nu tevreden?!"
    ],
    stage_3_fund: "NOODFONDS",
    stage_3_chart: `🏥 Algemeen Ziekenhuis Kaohsiung<br>Patiënt: Directeur Financiën<br>Diagnose: Acute reuzenradtekort-paniek<br>Advies: Nooit meer spreken over romantische economie`
  }
};

export const ZONE_NAMES = {
  zh: {
    '港灣區': { display: '⚓ 港灣區', desc: '深藍色水面，低矮倉庫。空間小，交通難外連。' },
    '舊城區': { display: '🏘️ 舊城區', desc: '灰色擁擠建築網格。空間不足，強蓋設施會穿模。' },
    '郊區': { display: '🚡 郊區發展區', desc: '淺綠色平坦草地。空間大但極度邊疆。' },
    '科技區': { display: '🏙️ 科技區', desc: '霓虹藍半透明方塊陣列。招商條件多。' },
    '山城區': { display: '⛰️ 山城區', desc: '陡峭深綠色幾何山體。制高點，交通可達性極低。' }
  },
  en: {
    '港灣區': { display: '⚓ Harbor District', desc: 'Deep blue water, low warehouses. Tight space, hard transport link.' },
    '舊城區': { display: '🏘️ Old Town District', desc: 'Crowded gray grid. Tight space, structures physically clip houses.' },
    '郊區': { display: '🚡 Suburban Area', desc: 'Light green flat grass. Spacious but extremely remote.' },
    '科技區': { display: '🏙️ High-Tech District', desc: 'Neon blue translucent towers. High investment conditions.' },
    '山城區': { display: '⛰️ Mountain District', desc: 'Steep geometric emerald peaks. Vantage point, very hard to reach.' }
  },
  ja: {
    '港灣區': { display: '⚓ 湾岸地区', desc: '深青の海面と低い倉庫。空間が狭く外郭交通が困難。' },
    '舊城區': { display: '🏘️ 旧市街地', desc: '過密な灰色の住宅街。施設を無理に建てると民家を貫通する。' },
    '郊區': { display: '🚡 郊外開発区', desc: '黄緑色の平坦な草原。広大だが極めて辺境。' },
    '科技區': { display: '🏙️ 科学技術区', desc: 'ネオンブルーの半透明高層群。厳しい誘致条件が多い。' },
    '山城區': { display: '⛰️ 山岳地区', desc: '険しい幾何学の緑の山体。最高地点だが到達難易度は極大。' }
  },
  fr: {
    '港灣區': { display: '⚓ District Portuaire', desc: 'Eaux profondes, entrepôts bas. Espace restreint, accès difficile.' },
    '舊城區': { display: '🏘️ Vieille Ville', desc: 'Grille grise surpeuplée. Les constructions traversent les salons.' },
    '郊區': { display: '🚡 Zone Périphérique', desc: 'Plaine vert clair. Vaste mais extrêmement isolée.' },
    '科技區': { display: '🏙️ Quartier Tech', desc: 'Tours néon translucides. Multiples conditions d’investissement.' },
    '山城區': { display: '⛰️ District Montagneux', desc: 'Pics géométriques escarpés. Point culminant, quasi inaccessible.' }
  },
  nl: {
    '港灣區': { display: '⚓ Havendistrict', desc: 'Diepblauw water, lage loodsen. Weinig ruimte, lastig te verbinden.' },
    '舊城區': { display: '🏘️ Oude Stad', desc: 'Dichtbebouwde grijze wijk. Constructies clippen door woonkamers.' },
    '郊區': { display: '🚡 Buitengebied', desc: 'Lichtgroen vlak grasland. Ruim maar extreem afgelegen.' },
    '科技區': { display: '🏙️ Tech-District', desc: 'Neonblauwe semi-transparante torens. Hoge investeringseisen.' },
    '山城區': { display: '⛰️ Bergdistrict', desc: 'Steile geometrische bergpieken. Hoogste punt, zeer slecht bereikbaar.' }
  }
};

export const MAYOR_QUOTES = {
  zh: [
    "愛情不是感覺，愛情是本市下個季度的 GDP！",
    "地球是圓的，經濟不能是平的！讓整座城市跟著摩天輪轉出偉大！",
    "這不叫浪費預算，這叫浪漫的基礎建設！",
    "貨櫃裡裝的不再是零件，而是純粹的愛情！",
    "年輕人談戀愛看存摺嗎？這不叫赤字，這叫愛情的先行投資！"
  ],
  en: [
    "Love isn't just a feeling; love is this city's next quarter GDP!",
    "The Earth is round, the economy can't be flat! Spin the city into greatness!",
    "This isn't wasting the budget; this is romantic infrastructure!",
    "The containers at the port no longer hold auto parts, but pure romance!",
    "Do young lovers check their bank balance? This isn't a deficit, it's an advance in love!"
  ],
  ja: [
    "愛は感情ではない。愛は我が市の次期四半期GDPである！",
    "地球は丸い、経済を平坦にしてはならない！観覧車とともに偉大になろう！",
    "これは予算の無駄遣いではない、ロマンチックなインフラ整備だ！",
    "港のコンテナに詰まっているのは部品ではなく、純粋な愛だ！",
    "若者が恋をするのに預金通帳を見るかね？これは赤字ではなく愛の先行投資だ！"
  ],
  fr: [
    "L'amour n'est pas un sentiment, l'amour est le PIB du prochain trimestre !",
    "La Terre est ronde, l'économie ne peut être plate ! Que la Grande Roue nous rende grands !",
    "Ce n'est pas du gaspillage d'argent public, c'est de l'infrastructure romantique !",
    "Nos conteneurs portuaires ne contiennent plus de pièces, mais de l'amour pur !",
    "Les jeunes regardent-ils leur compte en banque quand ils s'aiment ? C'est un investissement !"
  ],
  nl: [
    "Liefde is geen gevoel; liefde is het bbp van deze stad voor het komende kwartaal!",
    "De aarde is rond, onze economie mag niet plat zijn! Laat het reuzenrad ons groot maken!",
    "Dit is geen belastingverspilling, dit is romantische infrastructuur!",
    "Onze havencontainers bevatten geen auto-onderdelen meer, maar pure romantiek!",
    "Kijken verliefde jongeren naar hun spaarrekening? Dit is geen tekort, dit is voorinvestering!"
  ]
};

export const NEWS_TICKER = {
  zh: [
    "【快訊】舊城區天空消失第三天，居民自發舉辦「尋找太陽」燭光晚會。",
    "【局處切割】交通局嚴正澄清：從未核准 80 度山城雲霄飛車式公車路線。",
    "【市場動態】愛情商圈香腸攤營收超越半導體封測廠，市府研擬課徵浪漫加值稅。",
    "【陳情速報】市民抗議大聲公音量突破 140 分貝，工務局表示將採購更大聲公反制。",
    "【觀光熱潮】外地情侶搭乘摩天輪因卡死半空 6 小時，獲頒市府「堅定愛情認證書」。",
    "【財政預警】財政局辦公椅已被法院張貼查封封條，局長宣布全體同仁站立辦公以展現決心。"
  ],
  en: [
    "[BREAKING] Old Town sky missing for day 3; residents hold candlelight vigil to find the sun.",
    "[DEPT DISCLAIMER] Transport Bureau: We never approved 80-degree roller-coaster bus routes.",
    "[MARKET] Love sausage stalls surpass semiconductor revenue; City drafts Romance VAT.",
    "[PETITIONS] Citizen megaphones reach 140dB; Public Works orders louder megaphones to counter.",
    "[TOURISM] Couple trapped on Ferris wheel for 6 hours awarded City 'Unwavering Love Certificate'.",
    "[FINANCE] Court seizes Director's office chair; Finance Bureau orders staff to work standing up."
  ],
  ja: [
    "【速報】旧市街の上空が消えて3日目、住民が「太陽を探す」キャンドル集会を開催。",
    "【局の弁明】交通局が厳重釈明：「80度傾斜の絶叫ジェットコースターバスなど許可していない」。",
    "【市場動向】愛のソーセージ屋台の売上が半導体工場を凌駕、市はロマンス付加価値税を検討。",
    "【陳情速報】住民の抗議メガホンが140デシベル突破、工務局は更なる大音量メガホンの配備を決定。",
    "【観光過熱】観覧車で6時間宙吊りになったカップルに市公認「不滅の愛認定証」を授与。",
    "【財政警告】裁判所が財政局長の椅子を差し押さえ、局長は「決意の直立執務」を全職員に命令。"
  ],
  fr: [
    "[FLASH] Le ciel de la Vieille Ville a disparu depuis 3 jours ; veillée aux chandelles pour retrouver le soleil.",
    "[DÉMENTI] Bureau des Transports : Nous n'avons jamais autorisé de lignes de bus à 80 degrés.",
    "[ÉCONOMIE] Les stands de saucisses dépassent les usines de puces ; la Mairie prépare une TVA Romantique.",
    "[PÉTITIONS] Les mégaphones atteignent 140 dB ; les Travaux Publics commandent des mégaphones plus puissants.",
    "[TOURISME] Un couple coincé 6h sur la Grande Roue reçoit le 'Diplôme d'Amour Éternel' de la Mairie.",
    "[FINANCES] Fauteuil du directeur saisi par le tribunal ; tout le service financier travaille désormais debout."
  ],
  nl: [
    "[LAATSTE NIEUWS] Lucht boven Oude Stad al 3 dagen verdwenen; bewoners houden wake om de zon te zoeken.",
    "[DISCLAIMER] Dienst Vervoer: Wij hebben nooit goedkeuring gegeven voor 80-graden achtbaanbussen.",
    "[ECONOMIE] Romantische worstenkraam overtreft chipfabrieken; stad overweegt Romantiek-BTW.",
    "[KLACHTEN] Megafoons van demonstranten bereiken 140 dB; Openbare Werken bestelt luidere megafoons.",
    "[TOERISME] Koppel dat 6 uur vastzat in reuzenrad ontvangt gemeentelijk 'Onvoorwaardelijke Liefde Certificaat'.",
    "[FINANCIËN] Bureaustoel directeur in beslag genomen; voltallig personeel vergadert voortaan staand."
  ]
};

export const INTERPRETER_MOODS = {
  zh: {
    calm: { mood: "專業微笑", icon: "😊" },
    frown: { mood: "深鎖眉頭", icon: "😟" },
    facepalm: { mood: "扶額嘆氣", icon: "🤦" },
    strike_x: { mood: "當機比叉", icon: "🙅" }
  },
  en: {
    calm: { mood: "Professional Smile", icon: "😊" },
    frown: { mood: "Frowning", icon: "😟" },
    facepalm: { mood: "Facepalm Sigh", icon: "🤦" },
    strike_x: { mood: "On Strike (X)", icon: "🙅" }
  },
  ja: {
    calm: { mood: "プロの微笑み", icon: "😊" },
    frown: { mood: "眉をひそめる", icon: "😟" },
    facepalm: { mood: "頭を抱えてため息", icon: "🤦" },
    strike_x: { mood: "フリーズ抗議 (✕)", icon: "🙅" }
  },
  fr: {
    calm: { mood: "Sourire Professionnel", icon: "😊" },
    frown: { mood: "Sourcils Froncés", icon: "😟" },
    facepalm: { mood: "Dépit & Soupir", icon: "🤦" },
    strike_x: { mood: "En Grève (X)", icon: "🙅" }
  },
  nl: {
    calm: { mood: "Professionele Glimlach", icon: "😊" },
    frown: { mood: "Gefronste Wenkbrauwen", icon: "😟" },
    facepalm: { mood: "Hand voor de Ogen", icon: "🤦" },
    strike_x: { mood: "In Staking (X)", icon: "🙅" }
  }
};

export function t(key, ...args) {
  const lang = currentLocale;
  const dict = UI_STRINGS[lang] || UI_STRINGS.zh;
  let text = dict[key] || UI_STRINGS.zh[key] || key;
  args.forEach((val, idx) => {
    text = text.replace(new RegExp(`\\{${idx}\\}`, 'g'), val);
  });
  return text;
}

/* Official manufacturer/reference pricing, verified 2026-10-28.
   Manual curation, NOT real-time shopping prices, affiliate quotes, offers, or tax advice.
   Monthly-equivalent prepayment and USD currency are explicitly marked.
   Null = cannot substantiate a current comparable price in Japan. */
window.BL_PRICES = {
 checked:"2026-10-28",
 entries:{
  "xserver":{
    id:"xserver",kind:"service",model:"XServerドライブ スモールビジネス（12か月契約）",
    currency:"JPY",tax:"税込",monthly:3300,initial:11000,commitmentMonths:12,
    basis:"メーカー公式のキャンペーン前・12か月契約通常料金。月額換算で表示されるが、12か月分の前払い。ユーザー数無制限の定額プラン。初期費用は新規のみ。",
    status:"reference",source:"https://drive.xserver.ne.jp/price/",
    disclaimer:"2026年10月14日終了予定の20%オフ表示を除外。契約条件・現行料金は申込み時に公式で再確認。"
  },
  "zoho":{
    id:"zoho",kind:"service",model:"Zoho WorkDrive Starter（年間払い）",
    currency:"USD",tax:"税別",monthly:2.50,minUsers:3,initial:null,commitmentMonths:12,
    basis:"公式掲載 $2.50／ユーザー／月（年払い）。最低3ユーザー。請求通貨・為替・日本の税額は契約画面で確認。",
    status:"foreign_currency",source:"https://www.zoho.com/jp/workdrive/",
    disclaimer:"米ドル価格を為替換算せず記載。円の総費用には自動計上しない。日本での最終請求額を要確認。"
  },
  "pcloud":{
    id:"pcloud",kind:"service",model:"pCloud Business",currency:null,monthly:null,initial:null,
    basis:"日本向けに適用される通貨・契約条件・公式料金を未確定。",status:"unverified",source:"https://www.pcloud.com/",
    disclaimer:"参考価格の確認が済むまで概算額を表示しない。"
  },
  "synology":{
    id:"synology",kind:"hardware",model:"Synology DS225+（NASキット・HDD別売り）",
    currency:"JPY",price:null,tax:null,status:"unverified",source:"https://www.synology.com/ja-jp/products/DS225%2B",
    basis:"日本のメーカー希望小売価格を公式資料で確認できず。NAS本体・ドライブ・保守を別々に確認。",
    disclaimer:"別売りHDDの価格・互換性を確認せず合計を算出しない。"
  },
  "buffalo-nas":{
    id:"buffalo-nas",kind:"hardware",model:"BUFFALO LS720D0402（4TB搭載NAS）",
    currency:"JPY",price:73480,tax:"税込",status:"reference",source:"https://www.buffalo.jp/product/detail/260601_price.pdf",
    basis:"メーカー2026年6月価格改定表、税込・希望小売価格。HDD同梱（2TB×2の総容量表記）。",
    disclaimer:"RAID1では実効容量が小さくなる。別途バックアップ運用・設定・保守は含まない。"
  },
  "buffalo-hdd":{
    id:"buffalo-hdd",kind:"hardware",model:"BUFFALO HD-LE4U3-BB（USB 4TB）",
    currency:"JPY",price:31900,tax:"税込",status:"reference",source:"https://www.buffalo.jp/product/series/HD-LE-B",
    basis:"メーカー製品シリーズ掲載価格、税込・参考希望小売価格。",
    disclaimer:"NAS等との接続互換性・バックアップ容量を保証しない。"
  },
  "iodata-hdd":{
    id:"iodata-hdd",kind:"hardware",model:"I-O DATA HDJA-UT4R（USB 4TB）",
    currency:"JPY",price:40260,tax:"税込",status:"reference",source:"https://www.iodata.jp/product/hdd/hdd/hdja-utr/index.htm",
    basis:"メーカー製品ページ記載の税込価格（2026年4月価格改定）。",
    disclaimer:"実売価格・適合保証ではない。"
  },
  "iodata-usb":{
    id:"iodata-usb",kind:"hardware",model:"I-O DATA HDD-UT4KB（USB 4TB）",
    currency:"JPY",price:32890,tax:"税込",status:"reference",source:"https://www.iodata.jp/product/hdd/hdd/hdd-utb/",
    basis:"メーカー製品ページ記載の税込価格（2026年7月価格改定）。",
    disclaimer:"公式ページで在庫限り・後継HDD-UT4KCを案内。新品調達は後継モデルの仕様・価格も確認。NASへの適合は保証しない。"
  }
 }
};
/* Rationale must explain selection, tradeoffs and official evidence.
   This is editorial shortlisting, not a universally superior product or verified fit.
   Confirmed from manufacturer public documentation 2026-10-28. */
window.BL_EDITORIAL = {
  xserver:{
    headline:"人数が増えてもユーザー数課金にならない方式を検討するなら",
    pitch:"ユーザー数無制限の定額制が差別化要素。複数人で共有する中小企業が、ユーザー単価のサービスと費用構造を比較する候補。",
    choose:[
      "公式料金表でユーザー数無制限の定額プランが確認できる",
      "スモールビジネスは公式に500GB（SSD）・1TB（HDD）のプラン容量が記載されている",
      "利用人数が変わっても定額制という点で、ユーザー単位課金のサービスと比較する価値がある"
    ],
    versus:[
      {id:"zoho",text:"Zoho WorkDriveはユーザー単位の料金・チームフォルダーや共同作業が主眼。XServerは人数より総容量・定額を重視して比較する。"},
      {id:"pcloud",text:"pCloud Businessにはチームと暗号化関連機能がある。日本の通貨・契約・保存条件を確認して比較する。"}
    ],
    notFor:["すでにMicrosoft 365などに含まれる共有機能で足りている場合","高度な共同編集や外部アプリ連携が最優先で、プランの対応を未確認の場合","容量・データ所在・権限・契約条件が要件に合わない場合"],
    checks:["初期費用、契約期間、前払い総額","実容量とユーザー権限","ファイル復元・独立バックアップの手段"],
    source:["https://drive.xserver.ne.jp/price/","https://drive.xserver.ne.jp/function/"]
  },
  zoho:{
    headline:"チームフォルダーと共同作業の仕組みを重視するなら",
    pitch:"個人の保存容量より、チーム単位のファイル整理・共同利用・編集機能を評価する候補。",
    choose:[
      "公式のチームフォルダーで、チーム内ファイルをまとめて共有・管理できる",
      "Zoho Writer／Sheet／Showによる文書編集機能が案内されている",
      "料金はユーザー単位で、チーム規模に応じて費用の見通しを立てるモデル"
    ],
    versus:[
      {id:"xserver",text:"XServerドライブは人数無制限の定額課金。Zoho WorkDriveは共同編集と権限管理などの利用内容で比較する。"},
      {id:"pcloud",text:"pCloudもチーム共有機能を提供。編集・コラボレーションと保存のニーズを分け、請求通貨・サポート条件を含め比較する。"}
    ],
    notFor:["ユーザー人数に比例する料金を避けたい場合","現在のMicrosoft 365やGoogle Workspaceの共有機能で要件が足りる場合","必要な日本語サポート・国内契約条件が未確認の場合"],
    checks:["ユーザー人数と最低契約人数","プラン別容量、権限とアップロード上限","請求通貨、税金、データ保存条件"],
    source:["https://www.zoho.com/jp/workdrive/","https://www.zoho.com/jp/workdrive/plan-comparison.html"]
  },
  pcloud:{
    headline:"端末同期・チームアクセス管理・暗号化機能を比較するなら",
    pitch:"pCloud Businessはユーザー・チーム管理、共有権限、暗号化関連機能がある。国内契約条件が分かるまで比較候補に留める。",
    choose:[
      "Businessにはチーム管理とアクセス権限設定がある",
      "ローカル端末との同期やファイル履歴の機能を公式ヘルプが説明している",
      "暗号化関連機能を案内しており、機密性の要件を確認する際の比較対象になる"
    ],
    versus:[
      {id:"zoho",text:"Zohoはオフィス編集・チームフォルダーで差別化。pCloudは同期・暗号化・ユーザー権限の条件を比較する。"},
      {id:"xserver",text:"XServerは国内の定額制が明瞭。pCloudは日本での請求通貨や企業サポート条件を先に確認する必要がある。"}
    ],
    notFor:["契約前に円建ての正確な予算確定が必要な場合","国内データ所在や日本語サポートが必須で条件未確認の場合"],
    checks:["保存場所、暗号化の適用範囲、鍵の管理","契約通貨・税・年契約・最低人数","復元・監査ログと管理者権限"],
    source:["https://help.pcloud.com/article/team-collaboration","https://help.pcloud.com/article/plan-details"]
  },
  synology:{
    headline:"NASを細かく設定・管理したい人が検討する2ベイ機",
    pitch:"DSMでの運用を考えるNASキット。HDDが別売りなのでドライブの選択と互換性確認が必須。",
    choose:[
      "2ベイ構成で、1GbEポート1つと2.5GbEポート1つを備える",
      "メーカーのNAS用OSであるDSM上の機能を利用する前提の機器",
      "ドライブを別途選べるため、既定のHDD構成ではなくメーカーが許容する選択肢から構成を検討できる"
    ],
    versus:[
      {id:"buffalo-nas",text:"LinkStation LS720D0402は2TB×2が最初から搭載された完成品。DS225+は本体と対応HDDを別々に購入して構成する。どちらにも2.5GbEポートがある。"}
    ],
    notFor:["HDDを別途選んで設置・初期設定する手間を避けたい場合","追加ドライブの費用・メーカー互換性をまだ確認できていない場合","運用管理・バックアップを担当する人がいない場合"],
    checks:["Synology公式のドライブ互換性リスト","本体＋対応ドライブ＋バックアップ先の総額","実効容量、管理方法、障害対応"],
    source:["https://www.synology.com/ja-jp/products/DS225%2B","https://www.synology.com/compatibility"]
  },
  "buffalo-nas":{
    headline:"HDD搭載の状態から社内共有を始めたい場合の2ベイNAS",
    pitch:"4TBは2TBのドライブ2台の合計表記。RAID1の出荷時設定では実効容量約2TB。HDD別売りキットと比べ、機器構成を把握しやすい。",
    choose:[
      "購入時点で2TBのHDDを2台搭載し、追加の内蔵HDD選定が原則不要",
      "2.5GbE対応で、ネットワーク環境が整えば従来の1GbEを超える転送が可能",
      "RAID1／RAID0／通常モードを選択可能で、出荷時はRAID1に設定されている"
    ],
    versus:[
      {id:"synology",text:"Synology DS225+はHDD別売りのNASキット。LS720D0402はHDD同梱で費用に本体＋2台のHDDが含まれるが、出荷時RAID1で利用容量は約半分。"}
    ],
    notFor:["4TBすべてをRAID1で使えると思っている場合","HDDのホットスワップ（電源を入れたままの交換）が必須の場合","RAIDだけでバックアップ対策が完了すると考えている場合"],
    checks:["ネットワーク機器が2.5GbEに対応するか","RAID1の実効容量と空き容量","別のバックアップ先と保守体制"],
    source:["https://www.buffalo.jp/product/detail/ls720d0402.html"]
  },
  "buffalo-hdd":{
    headline:"手軽なUSB接続の4TB保存先を検討するなら",
    pitch:"PC用のUSB接続外付けHDD候補。高度なネットワーク共有機能ではなく、単体の保存・バックアップ先を検討する用途。",
    choose:[
      "USB 3.2 Gen 1対応の4TB外付けHDD",
      "BUFFALOの公式対応情報を機種別に確認できる",
      "NASではないので、社内共有の構築よりPCに直接接続する用途に向く"
    ],
    versus:[
      {id:"iodata-hdd",text:"HDJA-UT4Rはファンと電源内蔵を公式に明記。冷却や設置条件が重要ならHDJA-UT4Rと比較したい。"},
      {id:"iodata-usb",text:"HDD-UT4KBはPC・TV向け静音モデルだが在庫限り。どちらもPC接続用途のため、NASのような共有機能は備わらない。"}
    ],
    notFor:["社員全員が同時にネットワーク共有する用途","1台だけで災害対策まで完結させたい場合","接続先との公式適合確認がない場合"],
    checks:["PCのOS・端子とメーカーの対応情報","自動バックアップ方法と別の保管場所","設置と給電"],
    source:["https://www.buffalo.jp/product/detail/hd-le4u3-bb.html","https://www.buffalo.jp/product/detail/taiou/hd-le4u3-bb.html"]
  },
  "iodata-hdd":{
    headline:"設置型HDDの冷却性能・電源周りを重視するなら",
    pitch:"HDJA-UT4Rは冷却ファンとヒートシンク、電源内蔵をメーカーが明示。静かなデスクでの低負荷用途より、冷却構造を条件に含めたい場合の比較候補。",
    choose:[
      "冷却ファンと独自のヒートシンク構造を搭載",
      "電源内蔵でACアダプターの配置を減らせる",
      "USB 5Gbps対応の据え置き型で容量4TB"
    ],
    versus:[
      {id:"iodata-usb",text:"HDD-UT4KBはメーカーが静音性を打ち出すモデル。HDJA-UT4Rはファン搭載・電源内蔵を明記。静音優先か、冷却構造重視かで比較する。"},
      {id:"buffalo-hdd",text:"BUFFALO HD-LE4U3-BBもUSB接続4TBモデル。HDJAの特徴はメーカーが明記した冷却ファンと電源内蔵構造。"}
    ],
    notFor:["冷却ファンの動作音が特に気になる場合","軽量の持ち運び用ドライブを探している場合","NASの内部ドライブとして流用したい場合"],
    checks:["接続先・OS対応","設置スペースとファン音の許容範囲","復元テストと独立した別コピー"],
    source:["https://www.iodata.jp/product/hdd/hdd/hdja-utr/","https://www.iodata.jp/product/hdd/hdd/hdja-utr/spec.htm"]
  },
  "iodata-usb":{
    headline:"デスク周辺の静音性を重視するPC用4TB保存先",
    pitch:"HDD-UT4KBはメーカーが静音性・縦横両置きを案内するPC・テレビ兼用モデル。ただし公式表示では在庫限り・後継品あり。",
    choose:[
      "メーカーは静音仕様と縦置き／横置き両対応を案内",
      "テレビとPCの両方への接続を想定した製品",
      "4TBモデルの税込掲載価格が公開されており参考にしやすい"
    ],
    versus:[
      {id:"iodata-hdd",text:"HDJA-UT4Rはファンとヒートシンクで冷却する据え置きモデル。HDD-UT4KBは静音性を重視するが、現在在庫限りで後継品HDD-UT4KCの確認を優先。"}
    ],
    notFor:["長期調達や継続供給が重要で、後継機HDD-UT4KCの確認ができていない場合","NASに内蔵するHDDを探している場合","ネットワーク共有を構築したい場合"],
    checks:["在庫限りのため後継品HDD-UT4KCの仕様・価格","PCとの対応","バックアップのスケジュールと保管場所"],
    source:["https://www.iodata.jp/product/hdd/hdd/hdd-utb/"]
  }
};

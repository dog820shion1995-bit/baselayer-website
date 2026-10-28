# BASELAYER マーケティングPDCA計画（2026-10-28）

**要注意**：訪問・診断・購入件数はまだ実測できていない。以下は仮説・計画値であり実績や成果保証ではない。

## 北極星指標（North Star）
「利用者が自分の保存環境を理解して購入・導入の可否を判断できた件数」
代替的に「導入判断レポートの作成・印刷回数」を使う。ただしこれらは購入件数ではない。

## 月間ファネル・事業シナリオ
| 月間指標 | 公開初期 | 半年後 | 1年後 |
|---|---:|---:|---:|
| 訪問者 | 100 | 1,200 | 3,500 |
| 意味ある閲覧 | 50 | 650 | 1,900 |
| 診断開始 | 8 | 120 | 420 |
| 診断完了 | 4 | 60 | 231 |
| 製品情報・型番検索への遷移（購入ではない） | 1 | 18 | 80 |
| 実際の購入/契約（未計測・推計） | 0〜1 | 1〜3 | 5〜12 |

集客の保証はなく、SEOが伸びなければこれを大幅に下回る。購入数は外部ASP・店舗の公式成果データがない限り不明。

## Plan: 現状の主な問題
- sitemap.xmlなし。検索意図が具体的な「社員10人の共有」「4TB NAS RAID1」「会社のバックアップ」の個別入口が不足。
- トップ→診断→レポート→製品ページ→販売先の導線の離脱箇所が未計測。
- メーカー公式リンクのクリックは実際の契約・注文ではない。広告成果を架空に推定しない。
- 既存サービスの再利用と独立したバックアップ確認を優先する信頼性が競争力。

## Do: 今回実装したもの
- office-10-storage.html: 10名企業のクラウドかNASか、社外アクセス、既存契約、費用の比較。
- nas-4tb-raid1.html: 物理容量4TBとRAID1約2TBの違い、別バックアップと購入条件。
- backup-first-steps.html: RTO/RPO、独立コピー、復元テストの入門。
- sitemap.xml、robots.txt、トップの解説リンク、見せ方・入口の改善。
- metrics-config.js / metrics-events.js: 将来の匿名のファネル計測を行うためのイベント定義と試験用フック。**外部分析設定は現在無効。**

## Check: 流入と転換の初期評価軸
- Google Search Console: 自然検索の表示回数・クリック数・検索語・ランディングページ。所有権確認とサイトマップ登録が必要。
- GA4など: 人数・エンゲージメント、診断開始率（8〜12%目標）、診断完了率（45〜55%目標）、製品の外部クリック率（診断完了の約30%を仮目標）。
- イベント名: page_view、diagnosis_entry、diagnosis_step_1〜3、diagnosis_complete、report_print、report_copy、product_detail_view、price_page_view、case_to_diagnosis、report_to_product、product_outbound_research、manufacturer_info_click、marketplace_search_click。
- プライバシー: 個人名・回答内容・ファイル名をイベントで送らない。現行は外部送信しない。
- 実際の購入/導入: ASPや販売先から公式な確定データを受領した場合にのみ実績扱いとする。

## Act: 週次・月次の改善基準
- 検索表示はあるがクリックなし → 検索意図とタイトル/説明文を調整。
- 読まれても診断されない → 導入前後の具体例、費用の目安、主要CTAを改善。
- 診断の途中離脱が多い → 質問や用語を簡潔化し、詳細を任意にする。
- 診断完了後の外部クリックが少ない → 選んだ理由、互換性、製品写真、購入前チェックを優先改善。
- 少ないサンプルで効果を断定しない。必要な母数が蓄積してからA/Bテストする。
- 週次でリンク切れ・安全な構成図・メーカー価格と互換性・PC/スマホ回帰テストを確認。

## 外部のオーナー認証が必要なもの
1. Google Search Consoleの所有者確認とサイトマップ登録。
2. GA4または同等の計測ツールでアカウント・測定IDを発行、必要なプライバシー告知を実施後にイベント送信を有効化。
3. Amazon/楽天やSaaSの正式ASP提携、購入/契約の公式成果確認。

## 公式参照
- Google 人の役に立つコンテンツ: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Google sitemap: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- Synology NAS selector: https://www.synology.com/ja-jp/support/nas_selector
- IPA SME Security Guideline v4: https://www.ipa.go.jp/security/guide/sme/ug65p90000019cbk-att/sme_guideline_v4.0.pdf

## PDCA 02（2026-10-28 18:15 JST）: ファネル計測の意味を正確にする

- **問題（前回実装の再点検）**：以前の `diagnosis_entry` はサイト内のリンクをクリックした瞬間だけ記録していたため、検索結果やブックマークから直接 `start.html` に来た人を数えられない。反対に `product.html` 上のあらゆる外部リンクを `external_product_click` とみなしており、画像出典やメーカー資料まで「購入先へ進んだ」と誤読しうる。存在しない製品IDでも `product_detail_view` を数えていた。
- **変更**：診断開始は `start.html` の実到達時に1回記録。導入判断レポートから製品詳細への遷移は `report_to_product` として分離。実在する詳細ページの表示だけ `product_detail_view` とする。
- **外部クリックの定義**：製品詳細の「メーカー公式情報」リンクは `manufacturer_info_click`、Amazon/楽天の型番検索は `marketplace_search_click`。両者の合算 `product_outbound_research` は**購入を検討するための情報収集のクリック**であり、正規販売店への到達、注文、契約、売上を証明しない。画像出典・仕様根拠リンクはこの集計に入れない。
- **プライバシー**：イベントは名称とページ種別のみ。型番ID、URL、フォーム回答、氏名、端末識別子は追加しない。測定IDは空、外部送信は無効。GA4設定時にはプライバシー告知と計測同意・適法性の再確認が必要。
- **検証**：PCでのトップ→診断4段階→レポート→製品詳細→公式情報/型番検索のイベント分類、未登録製品の誤計測防止、390pxスマホ横スクロールなしをCIのPlaywrightで検査する。実トラフィック・CVRは測定基盤が未接続なので未取得。
- **次回の優先課題**：①Search Consoleの所有者確認と実検索流入の把握（オーナー操作が必要）、②実測に基づく診断途中離脱の特定、③メーカー公式ページ・販売先検索リンクの生存確認と更新頻度の定義。

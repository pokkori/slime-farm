# スライム牧場 (Slime Ranch) — 詳細設計書 v1.0

---

## 1. プロジェクト構成

```
slime-ranch/
├── app.json
├── package.json
├── tsconfig.json
├── babel.config.js
├── metro.config.js
├── app/
│   ├── _layout.tsx              # Root Layout (expo-router)
│   ├── index.tsx                # スプラッシュ → 牧場へリダイレクト
│   ├── (tabs)/
│   │   ├── _layout.tsx          # Tab Navigator
│   │   ├── ranch.tsx            # 牧場メイン画面
│   │   ├── encyclopedia.tsx     # 図鑑画面
│   │   ├── shop.tsx             # ショップ画面
│   │   ├── missions.tsx         # ミッション＆実績画面
│   │   └── settings.tsx         # 設定画面
│   └── merge-animation.tsx      # 合体フルスクリーン演出（Modal）
├── src/
│   ├── types/
│   │   ├── slime.ts             # スライム関連型
│   │   ├── ranch.ts             # 牧場関連型
│   │   ├── shop.ts              # ショップ関連型
│   │   ├── mission.ts           # ミッション・実績型
│   │   └── storage.ts           # AsyncStorageキー型
│   ├── constants/
│   │   ├── slimes.ts            # 全30種スライムマスターデータ
│   │   ├── ranch-upgrades.ts    # 牧場拡張データ
│   │   ├── shop-items.ts        # ショップ商品データ
│   │   ├── missions.ts          # デイリーミッション定義
│   │   ├── achievements.ts      # 実績定義
│   │   ├── colors.ts            # テーマカラー
│   │   └── sounds.ts            # サウンドファイルマッピング
│   ├── engine/
│   │   ├── physics.ts           # Matter.js 物理ワールド管理
│   │   ├── merge-logic.ts       # 合体判定・進化ロジック
│   │   ├── offline-reward.ts    # オフライン報酬計算
│   │   ├── coin-generator.ts    # リアルタイムコイン生成
│   │   └── collision-handler.ts # 衝突検出 → 合体トリガー
│   ├── rendering/
│   │   ├── SlimeBlob.tsx        # Skia blob描画コンポーネント
│   │   ├── SlimeCanvas.tsx      # Skia Canvas（牧場全体）
│   │   ├── MergeEffect.tsx      # 合体エフェクト（パーティクル）
│   │   ├── CoinFloat.tsx        # コイン浮遊アニメーション
│   │   └── ParticleSystem.tsx   # 汎用パーティクル
│   ├── components/
│   │   ├── SlimeInfo.tsx         # タップ時スライム情報ポップアップ
│   │   ├── CoinDisplay.tsx       # ヘッダーコイン表示
│   │   ├── MissionCard.tsx       # ミッションカード
│   │   ├── AchievementCard.tsx   # 実績カード
│   │   ├── ShopItemCard.tsx      # ショップアイテムカード
│   │   ├── EncyclopediaCard.tsx  # 図鑑カード
│   │   ├── RanchSlot.tsx         # 牧場区画
│   │   ├── OfflineRewardModal.tsx # オフライン報酬モーダル
│   │   ├── ShareButton.tsx       # シェアボタン
│   │   └── RewardAdButton.tsx    # リワード広告ボタン
│   ├── hooks/
│   │   ├── usePhysicsWorld.ts    # Matter.jsワールドフック
│   │   ├── useSlimes.ts          # スライム状態管理
│   │   ├── useCoins.ts           # コイン管理
│   │   ├── useOfflineReward.ts   # オフライン報酬復帰時
│   │   ├── useMissions.ts        # ミッション進捗
│   │   ├── useAchievements.ts    # 実績進捗
│   │   ├── useHaptics.ts         # ハプティクスラッパー
│   │   └── useSound.ts           # サウンドラッパー
│   ├── store/
│   │   ├── gameStore.ts          # Zustand メインストア
│   │   └── persistence.ts        # AsyncStorage永続化ミドルウェア
│   ├── utils/
│   │   ├── format.ts             # 数値フォーマット（1.2K, 3.4M）
│   │   ├── time.ts               # 時間計算ユーティリティ
│   │   └── share.ts              # スクリーンショット＆シェア
│   └── ads/
│       ├── admob.ts              # AdMob初期化・バナー・インタースティシャル
│       └── rewarded.ts           # リワード広告ラッパー
├── assets/
│   ├── sounds/
│   │   ├── tap.mp3               # タップ音
│   │   ├── merge.mp3             # 合体音
│   │   ├── rare-merge.mp3        # レア合体音
│   │   ├── coin.mp3              # コイン獲得音
│   │   ├── levelup.mp3           # レベルアップ音
│   │   ├── bgm-ranch.mp3         # 牧場BGM
│   │   └── achievement.mp3       # 実績解除音
│   ├── images/
│   │   ├── icon.png              # アプリアイコン (1024x1024)
│   │   ├── splash.png            # スプラッシュ (1284x2778)
│   │   └── share-frame.png       # シェア用フレーム
│   └── fonts/
│       └── MPLUSRounded1c-Bold.ttf
└── __tests__/
    ├── merge-logic.test.ts
    ├── offline-reward.test.ts
    └── coin-generator.test.ts
```

---

## 2. package.json

```json
{
  "name": "slime-ranch",
  "version": "1.0.0",
  "main": "expo-router/entry",
  "scripts": {
    "start": "expo start",
    "android": "expo run:android",
    "ios": "expo run:ios",
    "build:android": "eas build --platform android",
    "build:ios": "eas build --platform ios",
    "test": "jest",
    "lint": "eslint . --ext .ts,.tsx"
  },
  "dependencies": {
    "expo": "~53.0.0",
    "expo-router": "~4.0.0",
    "expo-haptics": "~14.0.0",
    "expo-av": "~15.0.0",
    "expo-sharing": "~13.0.0",
    "expo-file-system": "~18.0.0",
    "expo-status-bar": "~2.0.0",
    "expo-splash-screen": "~0.29.0",
    "expo-font": "~13.0.0",
    "react": "18.3.1",
    "react-native": "0.76.7",
    "react-native-screens": "~4.4.0",
    "react-native-safe-area-context": "~4.14.0",
    "react-native-gesture-handler": "~2.20.0",
    "react-native-reanimated": "~3.16.0",
    "@shopify/react-native-skia": "1.8.2",
    "matter-js": "0.20.0",
    "@react-native-async-storage/async-storage": "2.1.0",
    "zustand": "5.0.2",
    "react-native-google-mobile-ads": "14.6.0",
    "react-native-purchases": "8.2.5",
    "react-native-view-shot": "4.0.0",
    "@expo/vector-icons": "~14.0.0",
    "date-fns": "4.1.0"
  },
  "devDependencies": {
    "@types/react": "~18.3.0",
    "@types/matter-js": "~0.19.0",
    "typescript": "~5.6.0",
    "jest": "~29.7.0",
    "jest-expo": "~52.0.0",
    "@testing-library/react-native": "~12.9.0",
    "eslint": "~9.0.0",
    "eslint-config-expo": "~8.0.0"
  }
}
```

---

## 3. TypeScript型定義

### 3.1 `src/types/slime.ts`

```typescript
/** スライムのレア度 */
export type SlimeRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';

/** スライムの色系統 */
export type SlimeColorFamily =
  | 'green'   // 草原系
  | 'blue'    // 水系
  | 'red'     // 火系
  | 'yellow'  // 雷系
  | 'purple'  // 毒系
  | 'pink';   // 花系

/** 特殊能力 */
export type SlimeAbility =
  | 'none'
  | 'coin_boost'      // コイン生成率+50%
  | 'merge_magnet'     // 周囲の同色を引き寄せる
  | 'split_bonus'      // 分裂時に2体ではなく3体
  | 'offline_boost'    // オフラインコイン+100%
  | 'lucky'            // 合体時10%でレア度+1スキップ進化
  | 'aura'             // 隣接スライムのコイン生成+25%
  | 'rainbow'          // 任意の色と合体可能
  | 'giant'            // サイズ1.5倍・コイン2倍
  | 'speedy'           // 移動速度2倍（衝突頻度UP）
  | 'golden';          // コイン生成率3倍

/** スライムマスターデータ */
export interface SlimeMaster {
  id: string;                   // 例: 'green_common_1'
  name: string;                 // 例: 'みどりん'
  colorFamily: SlimeColorFamily;
  rarity: SlimeRarity;
  tier: number;                 // 1〜6（common=1, mythic=6）
  baseColor: string;            // HEX '#4CAF50'
  highlightColor: string;       // HEX '#81C784' (ハイライト)
  shadowColor: string;          // HEX '#2E7D32' (影)
  baseRadius: number;           // ピクセル (20〜60)
  coinsPerMinute: number;       // 1分あたりコイン生成量
  ability: SlimeAbility;
  description: string;          // 図鑑テキスト
  mergeFromIds: [string, string] | null; // 合体元2体のID（tier1はnull）
}

/** ゲーム内スライムインスタンス */
export interface SlimeInstance {
  instanceId: string;           // UUID
  masterId: string;             // SlimeMaster.id参照
  x: number;                    // Matter.js body position x
  y: number;                    // Matter.js body position y
  vx: number;                   // velocity x
  vy: number;                   // velocity y
  scale: number;                // 現在のスケール(アニメーション用) 0.0〜1.5
  wobblePhase: number;          // ぷるぷる位相 (0〜2π)
  wobbleAmplitude: number;      // ぷるぷる振幅 (0.0〜0.15)
  lastCoinTime: number;         // 最後にコイン生成したtimestamp
  isNew: boolean;               // 出現アニメーション中フラグ
  isMerging: boolean;           // 合体アニメーション中フラグ
}

/** 図鑑エントリ */
export interface EncyclopediaEntry {
  masterId: string;
  discovered: boolean;
  discoveredAt: number | null;  // timestamp
  mergeCount: number;           // この種類を合体で生成した回数
}
```

### 3.2 `src/types/ranch.ts`

```typescript
/** 牧場区画の状態 */
export type SlotState = 'locked' | 'unlocked' | 'decorated';

/** 牧場区画 */
export interface RanchSlot {
  slotId: number;               // 0〜15（4x4グリッド）
  state: SlotState;
  unlockCost: number;           // 解放コスト
  decoration: DecorationId | null;
  bonus: RanchBonus | null;
}

/** 装飾アイテムID */
export type DecorationId =
  | 'flower_bed'
  | 'mushroom_ring'
  | 'crystal_pond'
  | 'rainbow_arch'
  | 'golden_tree'
  | 'fairy_lamp'
  | 'hot_spring'
  | 'ancient_stone'
  | 'wind_chime'
  | 'star_fountain';

/** 区画ボーナス */
export interface RanchBonus {
  type: 'coin_rate' | 'merge_chance' | 'offline_rate' | 'spawn_rate';
  multiplier: number;           // 例: 1.2 = +20%
}

/** 牧場全体の状態 */
export interface RanchState {
  slots: RanchSlot[];
  maxSlimes: number;            // 現在のスライム上限
  backgroundTheme: BackgroundTheme;
}

/** 背景テーマ */
export type BackgroundTheme =
  | 'meadow'       // 草原（初期）
  | 'forest'       // 森
  | 'beach'        // ビーチ
  | 'volcano'      // 火山
  | 'sky_garden'   // 天空庭園
  | 'crystal_cave';// 水晶洞窟
```

### 3.3 `src/types/shop.ts`

```typescript
/** ショップカテゴリ */
export type ShopCategory = 'decoration' | 'background' | 'booster' | 'expansion';

/** ショップ商品 */
export interface ShopItem {
  itemId: string;
  category: ShopCategory;
  name: string;
  description: string;
  costType: 'coin' | 'gem';    // コインまたはジェム(課金通貨)
  cost: number;
  icon: string;                 // Ionicons名
  effect: ShopEffect;
  purchased: boolean;
  maxPurchase: number;          // -1 = 無限
  currentPurchaseCount: number;
}

/** 商品効果 */
export type ShopEffect =
  | { type: 'decoration'; decorationId: DecorationId }
  | { type: 'background'; theme: BackgroundTheme }
  | { type: 'slot_unlock'; slotCount: number }
  | { type: 'max_slime_up'; amount: number }
  | { type: 'coin_boost'; multiplier: number; durationMinutes: number }
  | { type: 'offline_boost'; multiplier: number; durationMinutes: number }
  | { type: 'auto_merge'; durationMinutes: number };
```

### 3.4 `src/types/mission.ts`

```typescript
/** ミッション種別 */
export type MissionType =
  | 'tap_slimes'        // スライムをN回タップ
  | 'merge_slimes'      // N回合体
  | 'earn_coins'        // コインをN枚獲得
  | 'discover_new'      // 新種をN種発見
  | 'collect_rare'      // レア以上をN体保有
  | 'login_streak'      // N日連続ログイン
  | 'watch_ad'          // リワード広告をN回視聴
  | 'buy_decoration'    // 装飾をN個購入
  | 'fill_encyclopedia' // 図鑑N%達成
  | 'reach_mythic';     // mythicスライムを生成

/** デイリーミッション */
export interface DailyMission {
  missionId: string;
  type: MissionType;
  targetValue: number;
  currentValue: number;
  rewardCoins: number;
  rewardGems: number;
  completed: boolean;
  claimed: boolean;
}

/** 実績 */
export interface Achievement {
  achievementId: string;
  title: string;
  description: string;
  type: MissionType;
  targetValue: number;
  currentValue: number;
  rewardCoins: number;
  rewardGems: number;
  unlocked: boolean;
  unlockedAt: number | null;
  icon: string;                 // Ionicons名
}
```

### 3.5 `src/types/storage.ts`

```typescript
/** AsyncStorageの全キー定義 */
export interface StorageSchema {
  '@slime_ranch/game_state': GameSaveData;
  '@slime_ranch/settings': SettingsData;
  '@slime_ranch/last_active': string;        // ISO timestamp
  '@slime_ranch/daily_missions': DailyMissionSave;
  '@slime_ranch/achievements': AchievementSave;
  '@slime_ranch/encyclopedia': EncyclopediaSave;
  '@slime_ranch/statistics': StatisticsData;
  '@slime_ranch/ad_state': AdStateData;
  '@slime_ranch/iap_state': IAPStateData;
  '@slime_ranch/tutorial_done': boolean;
}

export interface GameSaveData {
  version: number;              // セーブデータバージョン（マイグレーション用）
  coins: number;
  gems: number;
  slimes: SlimeInstanceSave[];
  ranch: RanchState;
  activeBoosters: ActiveBooster[];
  totalPlayTimeSeconds: number;
  createdAt: string;            // ISO timestamp
}

export interface SlimeInstanceSave {
  instanceId: string;
  masterId: string;
  x: number;
  y: number;
}

export interface ActiveBooster {
  type: 'coin_boost' | 'offline_boost' | 'auto_merge';
  multiplier: number;
  expiresAt: string;            // ISO timestamp
}

export interface SettingsData {
  bgmEnabled: boolean;
  sfxEnabled: boolean;
  hapticsEnabled: boolean;
  bgmVolume: number;            // 0.0〜1.0
  sfxVolume: number;            // 0.0〜1.0
  notificationsEnabled: boolean;
  language: 'ja' | 'en';
}

export interface DailyMissionSave {
  date: string;                 // 'YYYY-MM-DD'
  missions: DailyMission[];
  allClaimedBonusClaimed: boolean;
}

export interface AchievementSave {
  achievements: Achievement[];
}

export interface EncyclopediaSave {
  entries: EncyclopediaEntry[];
}

export interface StatisticsData {
  totalTaps: number;
  totalMerges: number;
  totalCoinsEarned: number;
  totalGemsEarned: number;
  totalAdsWatched: number;
  totalPlayTimeSeconds: number;
  longestLoginStreak: number;
  currentLoginStreak: number;
  lastLoginDate: string;        // 'YYYY-MM-DD'
  highestTierReached: number;
  rarestSlimeDiscovered: string; // masterId
}

export interface AdStateData {
  lastInterstitialAt: string;   // ISO timestamp
  interstitialCount: number;    // 本日の表示回数
  rewardedCount: number;        // 本日のリワード視聴回数
  date: string;                 // 'YYYY-MM-DD'（日付変更検知用）
}

export interface IAPStateData {
  removeAds: boolean;
  premiumPass: boolean;
  purchasedGemPacks: string[];  // productId[]
}
```

---

## 4. 画面設計（全画面ASCIIワイヤーフレーム）

### 4.1 牧場メイン画面 (`ranch.tsx`)

```
┌─────────────────────────────────────┐
│ ≡  スライム牧場    💰 12,450  💎 23 │  ← ヘッダー
├─────────────────────────────────────┤
│                                     │
│   🟢      🔵                        │  ← Skia Canvas
│        🟢                           │     スライムがぷるぷる
│                   🔴                │     動き回る
│     🟣                 🟡           │
│          🔵     🟢                  │
│  🟡              🟣                 │
│        🔴                           │
│                        🟢           │
│   ────────────────────────────      │  ← 地面ライン
│   🌿  🌸  🍄  ⛲  🌿  🌸          │  ← 装飾
├─────────────────────────────────────┤
│  [📦 x3]  [⏱ 2:00:00]  [📢 +50%] │  ← ブースター状態
├─────────────────────────────────────┤
│  🏠牧場  📖図鑑  🛒ショップ 📋ミッション ⚙設定 │ ← タブバー
└─────────────────────────────────────┘

【操作】
- スライムをタップ → 分裂（同じ種類が2体に）
- 同色同tier同士がぶつかる → 自動合体 → 上位tier進化
- 長押し → スライム情報ポップアップ
- 背景タップ → 何もしない（誤操作防止）
```

### 4.2 スライム情報ポップアップ

```
┌─────────────────────────┐
│      🟢 みどりん         │
│     ★☆☆☆☆☆ Common      │
│                         │
│  💰 2.0 coin/min        │
│  特殊: なし              │
│                         │
│  「牧場で最初に出会う    │
│    元気なスライム」       │
│                         │
│  [📤シェア] [❌閉じる]   │
└─────────────────────────┘
```

### 4.3 図鑑画面 (`encyclopedia.tsx`)

```
┌─────────────────────────────────────┐
│  ← 図鑑          発見: 12/32       │
├─────────────────────────────────────┤
│  [🟢草原] [🔵水] [🔴火] [🟡雷] [🟣毒] [🩷花] │ ← 色フィルター
├─────────────────────────────────────┤
│ ┌────┐ ┌────┐ ┌────┐ ┌────┐       │
│ │ 🟢 │ │ 🟢 │ │ 🟢 │ │ ❓ │       │  Tier 1
│ │みどりん│ │もりりん│ │はっぱん│ │ ??? │       │
│ │ ★  │ │ ★★ │ │★★★│ │    │       │
│ └────┘ └────┘ └────┘ └────┘       │
│ ┌────┐ ┌────┐ ┌────┐ ┌────┐       │
│ │ ❓ │ │ ❓ │ │ 🔵 │ │ 🔵 │       │  Tier 2
│ │ ??? │ │ ??? │ │みずりん│ │うみりん│       │
│ │    │ │    │ │ ★  │ │ ★★ │       │
│ └────┘ └────┘ └────┘ └────┘       │
│          ...                        │
├─────────────────────────────────────┤
│  🏠  📖  🛒  📋  ⚙                │
└─────────────────────────────────────┘

【未発見】: シルエット + ??? 表示
【発見済み】: カラー表示 + 名前 + レア度星
【タップ】: 詳細モーダル（説明文・合体元・コイン率・発見日）
```

### 4.4 ショップ画面 (`shop.tsx`)

```
┌─────────────────────────────────────┐
│  ← ショップ       💰 12,450  💎 23 │
├─────────────────────────────────────┤
│ [🎨装飾] [🖼背景] [⚡ブースター] [📐拡張] │ ← カテゴリタブ
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ 🌸 花壇             💰 500     │ │
│ │ コイン生成+10%の区画ボーナス     │ │
│ │                    [購入する]   │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ 🍄 キノコの輪       💰 1,200   │ │
│ │ 合体確率+15%の区画ボーナス       │ │
│ │                    [購入する]   │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ ⚡ コインブースト2倍  💎 5      │ │
│ │ 30分間コイン生成量2倍            │ │
│ │           [購入] [📢広告で無料] │ │
│ └─────────────────────────────────┘ │
│          ...                        │
├─────────────────────────────────────┤
│  🏠  📖  🛒  📋  ⚙                │
└─────────────────────────────────────┘
```

### 4.5 ミッション＆実績画面 (`missions.tsx`)

```
┌─────────────────────────────────────┐
│  ← ミッション                       │
├─────────────────────────────────────┤
│ [📋デイリー] [🏆実績]               │ ← セグメント
├─────────────────────────────────────┤
│  ⏰ リセットまで: 14:32:10          │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ ☑ スライムを10回タップ  10/10   │ │
│ │                💰100 [受取済み] │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ □ 5回合体させよう       3/5     │ │
│ │ ████████░░░░░  60%    💰200    │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ □ コインを1000枚稼ぐ   450/1000│ │
│ │ ██████░░░░░░░  45%    💰300    │ │
│ └─────────────────────────────────┘ │
│          ...                        │
│ ┌─────────────────────────────────┐ │
│ │ 🎁 全ミッション達成ボーナス      │ │
│ │              💎 5  [未達成]     │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│  🏠  📖  🛒  📋  ⚙                │
└─────────────────────────────────────┘
```

### 4.6 設定画面 (`settings.tsx`)

```
┌─────────────────────────────────────┐
│  ← 設定                            │
├─────────────────────────────────────┤
│                                     │
│  🔊 BGM              [━━━━●━] ON   │
│  🔊 効果音            [━━━━━●] ON   │
│  📳 振動              [━━━━━●] ON   │
│                                     │
│  ─────────────────────────────      │
│                                     │
│  🔔 通知              [●━━━━━] OFF  │
│  🌐 言語              日本語 ▼      │
│                                     │
│  ─────────────────────────────      │
│                                     │
│  🚫 広告を削除        💎 50 →      │
│  👑 プレミアムパス    ¥480/月 →    │
│                                     │
│  ─────────────────────────────      │
│                                     │
│  📊 統計データ                →     │
│  🔄 データリセット            →     │
│  📝 利用規約                  →     │
│  🔒 プライバシーポリシー      →     │
│                                     │
├─────────────────────────────────────┤
│  🏠  📖  🛒  📋  ⚙                │
└─────────────────────────────────────┘
```

### 4.7 オフライン報酬モーダル

```
┌─────────────────────────────────┐
│                                 │
│    🌙 おかえりなさい！           │
│                                 │
│    留守の間にスライムたちが      │
│    頑張ってくれました！          │
│                                 │
│    ⏱ 離れていた時間: 8時間32分  │
│                                 │
│    💰 獲得コイン: 2,450         │
│                                 │
│    [📢 広告を見て2倍 → 4,900]  │
│                                 │
│    [受け取る]                    │
│                                 │
└─────────────────────────────────┘
```

### 4.8 合体演出画面 (`merge-animation.tsx`)

```
┌─────────────────────────────────────┐
│                                     │
│                                     │
│                                     │
│          🟢  →  ←  🟢              │  Phase 1: 引き寄せ (300ms)
│                                     │
│              💫                      │  Phase 2: 衝突・光 (200ms)
│            ✨🌟✨                    │
│              💫                      │
│                                     │
│            🟢🟢                      │  Phase 3: 新スライム登場 (500ms)
│          もりりん                    │     バウンス + パーティクル
│          ★★ Uncommon                │
│                                     │
│        「森の恵みを受けた            │
│          進化スライム」              │
│                                     │
│         [タップで戻る]               │
│                                     │
└─────────────────────────────────────┘

※レア以上の合体時のみフルスクリーン演出
※common→uncommonは牧場画面内でインライン演出
```

---

## 5. スライム物理仕様

### 5.1 Skia Blob描画 (`SlimeBlob.tsx`)

```typescript
/**
 * スライムのblob形状はSkia Pathで描画する。
 * 基本形状: 円 + sin波による表面変形 + 重力による底面平坦化
 */

// Blob Path生成パラメータ
interface BlobParams {
  centerX: number;
  centerY: number;
  baseRadius: number;
  // 表面の波打ち: 8個の制御点をsin波で変位させる
  controlPoints: 8;
  // 各制御点の変位量 = baseAmplitude * sin(wobblePhase + pointIndex * (2π/8))
  baseAmplitude: number;       // baseRadius * 0.08 (半径の8%)
  wobbleSpeed: number;         // 2.5 rad/sec
  // 重力による底面平坦化: 下半分の制御点のY変位を50%に抑制
  gravityFlatten: 0.5;
}

// Skia Path構築疑似コード
function buildBlobPath(params: BlobParams, time: number): SkPath {
  const path = Skia.Path.Make();
  const points: { x: number; y: number }[] = [];

  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const wobble = params.baseAmplitude *
      Math.sin(time * params.wobbleSpeed + i * (Math.PI * 2 / 8));

    // 下半分の制御点は変形量を抑制（重力で平たくなる表現）
    const gravityMod = Math.sin(angle) > 0 ? params.gravityFlatten : 1.0;
    const r = params.baseRadius + wobble * gravityMod;

    points.push({
      x: params.centerX + Math.cos(angle) * r,
      y: params.centerY + Math.sin(angle) * r,
    });
  }

  // Catmull-Romスプライン → Cubic Bezierで滑らかに接続
  path.moveTo(points[0].x, points[0].y);
  for (let i = 0; i < 8; i++) {
    const p0 = points[(i - 1 + 8) % 8];
    const p1 = points[i];
    const p2 = points[(i + 1) % 8];
    const p3 = points[(i + 2) % 8];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    path.cubicTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
  }
  path.close();
  return path;
}
```

### 5.2 スライム描画レイヤー構成

```
[レイヤー4] 目・口（2つの楕円 + 弧）
[レイヤー3] ハイライト（左上に白楕円、opacity 0.6）
[レイヤー2] 本体グラデーション（radialGradient: highlightColor → baseColor）
[レイヤー1] 影（下方に楕円、黒 opacity 0.15、blur 4px）

// 目の位置: center から左右に baseRadius*0.25、上に baseRadius*0.15
// 目のサイズ: baseRadius * 0.12 (横) × baseRadius * 0.15 (縦)
// 口: center下 baseRadius*0.1 の位置に幅 baseRadius*0.2 の弧
```

### 5.3 弾性表現（ぷるぷるアニメーション）

```typescript
// スプリング制約パラメータ（セクション16で詳述）
const WOBBLE_CONFIG = {
  // 通常時の自律ぷるぷる
  idle: {
    frequency: 2.5,          // Hz（1秒に2.5往復）
    amplitude: 0.06,         // baseRadiusの6%
    damping: 0.0,            // 減衰なし（永続ループ）
    phaseOffset: Math.random() * Math.PI * 2, // 個体ごとランダム位相
  },
  // タップ時のバウンス
  tap: {
    frequency: 8.0,          // Hz
    amplitude: 0.20,         // baseRadiusの20%
    damping: 0.85,           // フレームごとに×0.85で減衰
    duration: 600,           // ms
  },
  // 合体時の膨張→収縮
  merge: {
    scaleSequence: [
      { scale: 0.0, time: 0 },      // 消滅から
      { scale: 1.4, time: 200 },     // 膨張
      { scale: 0.85, time: 350 },    // 収縮
      { scale: 1.1, time: 450 },     // 軽く膨張
      { scale: 1.0, time: 600 },     // 安定
    ],
    wobbleAmplitude: 0.15,   // 合体直後は激しくぷるぷる
    wobbleDamping: 0.92,     // ゆっくり収束
  },
  // 分裂時のポップ
  split: {
    initialScale: 0.3,
    targetScale: 1.0,
    springStiffness: 180,    // react-native-reanimated spring
    springDamping: 12,
    springMass: 1,
  },
  // 衝突時の変形
  collision: {
    squashAmount: 0.15,      // 衝突方向に15%潰れる
    stretchAmount: 0.10,     // 直交方向に10%伸びる
    recoveryDamping: 0.88,
    recoveryDuration: 400,   // ms
  },
};
```

### 5.4 Matter.js 物理ワールド設定

```typescript
// engine/physics.ts
import Matter from 'matter-js';

const PHYSICS_CONFIG = {
  engine: {
    gravity: { x: 0, y: 0.8 },         // 緩やかな重力（スライムがふわっと落ちる）
    timing: { timeScale: 1.0 },
  },
  world: {
    bounds: {
      // 画面幅に合わせて動的計算
      // 上: -100 (画面外からスライムが落ちてくる)
      // 下: screenHeight - tabBarHeight - 80 (地面)
      // 左右: 20pxマージン
    },
  },
  slimeBody: {
    restitution: 0.6,          // 弾力性（0.6 = かなり弾む）
    friction: 0.05,            // 摩擦（低め = よく滑る）
    frictionAir: 0.02,         // 空気抵抗（少し減速）
    density: 0.001,            // 密度（軽い）
    // スライムはMatter.jsではcircle bodyとして扱う
    // Skia描画はbodyのpositionを参照して独立描画
  },
  walls: {
    // 左壁・右壁・地面を静的bodyとして配置
    isStatic: true,
    restitution: 0.3,
    friction: 0.1,
  },
  // 1フレームあたりのMatter.Engine.update呼び出し
  updateDelta: 16.67,           // 60fps
  maxSubSteps: 3,               // フレーム落ち時の最大サブステップ
};
```

### 5.5 合体アニメーション手順

```
1. 衝突検出 (collision-handler.ts)
   - Matter.Events.on(engine, 'collisionStart', ...)
   - 両bodyのmasterIdを参照 → 同colorFamily && 同tier → 合体トリガー

2. 合体開始
   - 両slimeInstance.isMerging = true（タップ無効化）
   - 2体を引き寄せアニメーション (300ms, Easing.inQuad)
     - Matter.Body.setPosition を毎フレーム更新して中間点へ
   - ハプティクス: Haptics.impactAsync(ImpactFeedbackStyle.Medium)

3. 衝突・光エフェクト
   - 2体の中間点でパーティクル放出 (ParticleSystem)
     - パーティクル数: 12
     - 色: 合体元のbaseColor
     - 速度: ランダム方向 100〜200 px/sec
     - 寿命: 500ms
     - サイズ: 3〜6px、opacity fade out
   - フラッシュ: Canvas全体にbaseColor overlay、opacity 0→0.3→0 (200ms)

4. 元の2体を削除
   - Matter.World.remove(world, body1, body2)
   - slimesストアから削除

5. 新スライム出現
   - 合体元2体の中間座標に新bodyを作成
   - scale: 0 → 1.4 → 0.85 → 1.1 → 1.0 (merge wobble sequence)
   - サウンド: merge.mp3（rare以上はrare-merge.mp3）
   - ハプティクス: Haptics.notificationAsync(NotificationFeedbackType.Success)

6. rare以上の場合
   - フルスクリーン演出 (merge-animation.tsx) を Modal表示
   - 背景ブラー + 新スライム中央にズームイン
   - 名前・レア度・説明文をフェードイン
   - 3秒後にタップで閉じる
```

---

## 6. スライムデータ（32種）

### 6.1 草原系 (green)

| ID | 名前 | Tier | Rarity | 半径 | Coin/min | 能力 | 色 |
|---|---|---|---|---|---|---|---|
| `green_1` | みどりん | 1 | Common | 20 | 1.0 | none | #4CAF50 |
| `green_2` | もりりん | 2 | Uncommon | 26 | 3.0 | none | #388E3C |
| `green_3` | はっぱん | 3 | Rare | 32 | 8.0 | coin_boost | #2E7D32 |
| `green_4` | フォレスト | 4 | Epic | 40 | 20.0 | aura | #1B5E20 |
| `green_5` | ガイアスライム | 5 | Legendary | 50 | 50.0 | giant | #004D40 |
| `green_6` | 世界樹スライム | 6 | Mythic | 60 | 150.0 | golden | #00695C |

### 6.2 水系 (blue)

| ID | 名前 | Tier | Rarity | 半径 | Coin/min | 能力 | 色 |
|---|---|---|---|---|---|---|---|
| `blue_1` | みずりん | 1 | Common | 20 | 1.0 | none | #2196F3 |
| `blue_2` | うみりん | 2 | Uncommon | 26 | 3.0 | none | #1976D2 |
| `blue_3` | しずくん | 3 | Rare | 32 | 8.0 | offline_boost | #1565C0 |
| `blue_4` | タイダル | 4 | Epic | 40 | 20.0 | merge_magnet | #0D47A1 |
| `blue_5` | ポセイドン | 5 | Legendary | 50 | 50.0 | speedy | #01579B |
| `blue_6` | 深淵スライム | 6 | Mythic | 60 | 150.0 | golden | #006064 |

### 6.3 火系 (red)

| ID | 名前 | Tier | Rarity | 半径 | Coin/min | 能力 | 色 |
|---|---|---|---|---|---|---|---|
| `red_1` | あかりん | 1 | Common | 20 | 1.0 | none | #F44336 |
| `red_2` | ほのおん | 2 | Uncommon | 26 | 3.0 | none | #D32F2F |
| `red_3` | マグマン | 3 | Rare | 32 | 8.0 | split_bonus | #C62828 |
| `red_4` | インフェルノ | 4 | Epic | 40 | 20.0 | coin_boost | #B71C1C |
| `red_5` | フェニックス | 5 | Legendary | 50 | 50.0 | lucky | #BF360C |
| `red_6` | 灼熱龍スライム | 6 | Mythic | 60 | 150.0 | golden | #E65100 |

### 6.4 雷系 (yellow)

| ID | 名前 | Tier | Rarity | 半径 | Coin/min | 能力 | 色 |
|---|---|---|---|---|---|---|---|
| `yellow_1` | きいろん | 1 | Common | 20 | 1.0 | none | #FFEB3B |
| `yellow_2` | でんきん | 2 | Uncommon | 26 | 3.0 | none | #FBC02D |
| `yellow_3` | サンダー | 3 | Rare | 32 | 8.0 | speedy | #F9A825 |
| `yellow_4` | ボルテック | 4 | Epic | 40 | 20.0 | split_bonus | #F57F17 |
| `yellow_5` | トールスライム | 5 | Legendary | 50 | 50.0 | merge_magnet | #FF6F00 |
| `yellow_6` | 万雷帝スライム | 6 | Mythic | 60 | 150.0 | golden | #E65100 |

### 6.5 毒系 (purple)

| ID | 名前 | Tier | Rarity | 半径 | Coin/min | 能力 | 色 |
|---|---|---|---|---|---|---|---|
| `purple_1` | むらさきん | 1 | Common | 20 | 1.0 | none | #9C27B0 |
| `purple_2` | どくりん | 2 | Uncommon | 26 | 3.0 | none | #7B1FA2 |
| `purple_3` | ポイズナー | 3 | Rare | 32 | 8.0 | aura | #6A1B9A |
| `purple_4` | ヴェノム | 4 | Epic | 40 | 20.0 | offline_boost | #4A148C |
| `purple_5` | ナイトメア | 5 | Legendary | 50 | 50.0 | lucky | #311B92 |
| `purple_6` | 冥界スライム | 6 | Mythic | 60 | 150.0 | golden | #1A237E |

### 6.6 花系 (pink)

| ID | 名前 | Tier | Rarity | 半径 | Coin/min | 能力 | 色 |
|---|---|---|---|---|---|---|---|
| `pink_1` | ぴんくりん | 1 | Common | 20 | 1.0 | none | #E91E63 |
| `pink_2` | はなりん | 2 | Uncommon | 26 | 3.0 | none | #C2185B |
| `pink_3` | ブルーミー | 3 | Rare | 32 | 8.0 | coin_boost | #AD1457 |
| `pink_4` | サクラスライム | 4 | Epic | 40 | 20.0 | aura | #880E4F |
| `pink_5` | エンプレス | 5 | Legendary | 50 | 50.0 | offline_boost | #F06292 |
| `pink_6` | 桜花天スライム | 6 | Mythic | 60 | 150.0 | golden | #FF80AB |

### 6.7 特殊スライム（隠し）

| ID | 名前 | Tier | Rarity | 半径 | Coin/min | 能力 | 解放条件 |
|---|---|---|---|---|---|---|---|
| `special_rainbow` | にじりん | - | Mythic | 55 | 200.0 | rainbow | 全6色のMythicを1回ずつ合成 |
| `special_king` | キングスライム | - | Mythic | 65 | 300.0 | giant+golden | 図鑑コンプリート(31/31) |

**合計: 38種（通常36 + 特殊2）**

---

## 7. 合体ルール（進化ツリー）

### 7.1 基本ルール

```
同色 + 同Tier → 1つ上のTierに進化

例: green_1 (みどりん) + green_1 (みどりん) → green_2 (もりりん)
    green_2 (もりりん) + green_2 (もりりん) → green_3 (はっぱん)
    ...
    green_5 + green_5 → green_6 (世界樹スライム)
```

### 7.2 進化ツリー図（全色共通構造）

```
Tier 1 (Common)     ×2 → Tier 2 (Uncommon)
Tier 2 (Uncommon)   ×2 → Tier 3 (Rare)
Tier 3 (Rare)       ×2 → Tier 4 (Epic)
Tier 4 (Epic)       ×2 → Tier 5 (Legendary)
Tier 5 (Legendary)  ×2 → Tier 6 (Mythic)

【草原系】
  みどりん ─┬─ もりりん ─┬─ はっぱん ─┬─ フォレスト ─┬─ ガイアスライム ─┬─ 世界樹スライム
  みどりん ─┘  もりりん ─┘  はっぱん ─┘  フォレスト ─┘  ガイアスライム ─┘

【水系】
  みずりん ─┬─ うみりん ─┬─ しずくん ─┬─ タイダル ─┬─ ポセイドン ─┬─ 深淵スライム
  みずりん ─┘  うみりん ─┘  しずくん ─┘  タイダル ─┘  ポセイドン ─┘

【火系】
  あかりん ─┬─ ほのおん ─┬─ マグマン ─┬─ インフェルノ ─┬─ フェニックス ─┬─ 灼熱龍スライム
  あかりん ─┘  ほのおん ─┘  マグマン ─┘  インフェルノ ─┘  フェニックス ─┘

【雷系】
  きいろん ─┬─ でんきん ─┬─ サンダー ─┬─ ボルテック ─┬─ トールスライム ─┬─ 万雷帝スライム
  きいろん ─┘  でんきん ─┘  サンダー ─┘  ボルテック ─┘  トールスライム ─┘

【毒系】
  むらさきん ─┬─ どくりん ─┬─ ポイズナー ─┬─ ヴェノム ─┬─ ナイトメア ─┬─ 冥界スライム
  むらさきん ─┘  どくりん ─┘  ポイズナー ─┘  ヴェノム ─┘  ナイトメア ─┘

【花系】
  ぴんくりん ─┬─ はなりん ─┬─ ブルーミー ─┬─ サクラスライム ─┬─ エンプレス ─┬─ 桜花天スライム
  ぴんくりん ─┘  はなりん ─┘  ブルーミー ─┘  サクラスライム ─┘  エンプレス ─┘
```

### 7.3 特殊合体ルール

```
1. lucky能力発動時:
   - 合体時に10%の確率でTier+2（1段階スキップ）
   - 例: green_2 + green_2 → 10%で green_4 に直接進化

2. rainbow能力（にじりん）:
   - 任意の色のスライムと合体可能
   - 合体先は相手の色系統の上位Tierになる
   - 例: にじりん + green_3 → green_4

3. Tier 6 同士の合体:
   - 同色Tier6 + 同色Tier6 → 新しいTier1を3体スポーン（色はランダム）
   - つまりMythic同士はリサイクルされる（インフレ防止）

4. 合体不可条件:
   - 異なるcolorFamily（rainbow除く）
   - 異なるTier
   - isMerging === true のスライム
   - 牧場のスライム数が上限に達している場合の分裂（合体は可能）
```

### 7.4 合体判定ロジック

```typescript
// engine/merge-logic.ts
function canMerge(a: SlimeInstance, b: SlimeInstance): boolean {
  if (a.isMerging || b.isMerging) return false;
  if (a.instanceId === b.instanceId) return false;

  const masterA = SLIME_MASTER[a.masterId];
  const masterB = SLIME_MASTER[b.masterId];

  // rainbow能力: 色を無視して合体可能
  if (masterA.ability === 'rainbow' || masterB.ability === 'rainbow') {
    // rainbowは常にTier無関係で合体可能（相手の上位Tierを生成）
    return true;
  }

  return masterA.colorFamily === masterB.colorFamily
      && masterA.tier === masterB.tier;
}

function getMergeResult(a: SlimeInstance, b: SlimeInstance): string {
  const masterA = SLIME_MASTER[a.masterId];
  const masterB = SLIME_MASTER[b.masterId];

  // rainbow合体
  if (masterA.ability === 'rainbow') {
    const nextTier = Math.min(masterB.tier + 1, 6);
    return `${masterB.colorFamily}_${nextTier}`;
  }
  if (masterB.ability === 'rainbow') {
    const nextTier = Math.min(masterA.tier + 1, 6);
    return `${masterA.colorFamily}_${nextTier}`;
  }

  // Tier 6リサイクル
  if (masterA.tier === 6) {
    return 'RECYCLE'; // 呼び出し元でランダムTier1を3体生成
  }

  // lucky判定
  const hasLucky = masterA.ability === 'lucky' || masterB.ability === 'lucky';
  const skipTier = hasLucky && Math.random() < 0.10;
  const nextTier = skipTier
    ? Math.min(masterA.tier + 2, 6)
    : masterA.tier + 1;

  return `${masterA.colorFamily}_${nextTier}`;
}
```

---

## 8. 放置報酬計算

### 8.1 オフラインコイン蓄積ロジック

```typescript
// engine/offline-reward.ts

interface OfflineRewardResult {
  coins: number;
  elapsedSeconds: number;
  breakdown: {
    baseCoins: number;
    abilityBonus: number;
    decorationBonus: number;
    boosterBonus: number;
  };
}

function calculateOfflineReward(
  slimes: SlimeInstanceSave[],
  ranch: RanchState,
  activeBoosters: ActiveBooster[],
  lastActiveAt: Date,
  now: Date,
): OfflineRewardResult {
  const elapsedSeconds = Math.floor((now.getTime() - lastActiveAt.getTime()) / 1000);

  // 最大オフライン時間: 8時間 (28800秒)
  // 無課金は最大4時間 (14400秒)、プレミアムパスで8時間
  const MAX_OFFLINE_FREE = 14400;
  const MAX_OFFLINE_PREMIUM = 28800;
  const isPremium = false; // IAPStateから取得
  const cappedSeconds = Math.min(
    elapsedSeconds,
    isPremium ? MAX_OFFLINE_PREMIUM : MAX_OFFLINE_FREE
  );

  const elapsedMinutes = cappedSeconds / 60;

  // 1. 基本コイン = Σ(各スライムのcoinsPerMinute) × 経過分数
  let baseCoins = 0;
  for (const slime of slimes) {
    const master = SLIME_MASTER[slime.masterId];
    baseCoins += master.coinsPerMinute * elapsedMinutes;
  }

  // 2. 能力ボーナス
  let abilityBonus = 0;
  for (const slime of slimes) {
    const master = SLIME_MASTER[slime.masterId];
    if (master.ability === 'offline_boost') {
      // offline_boost持ちはコイン生成量+100%
      abilityBonus += master.coinsPerMinute * elapsedMinutes;
    }
    if (master.ability === 'aura') {
      // aura持ちは他スライムの25%分を追加
      // 簡略化: aura1体につき全体の5%をボーナス
      abilityBonus += baseCoins * 0.05;
    }
    if (master.ability === 'golden') {
      // golden: コイン3倍（baseの+2倍分を加算）
      abilityBonus += master.coinsPerMinute * elapsedMinutes * 2;
    }
  }

  // 3. 装飾ボーナス
  let decorationMultiplier = 1.0;
  for (const slot of ranch.slots) {
    if (slot.bonus && slot.bonus.type === 'offline_rate') {
      decorationMultiplier += slot.bonus.multiplier - 1.0;
    }
    if (slot.bonus && slot.bonus.type === 'coin_rate') {
      decorationMultiplier += (slot.bonus.multiplier - 1.0) * 0.5;
      // オフライン時はcoin_rateボーナスは半減
    }
  }
  const decorationBonus = (baseCoins + abilityBonus) * (decorationMultiplier - 1.0);

  // 4. ブースターボーナス（有効期限内のもの）
  let boosterMultiplier = 1.0;
  for (const booster of activeBoosters) {
    if (new Date(booster.expiresAt) > lastActiveAt) {
      // ブースター有効期間とオフライン期間の重複分のみ
      const boosterEnd = new Date(booster.expiresAt);
      const overlapSeconds = Math.max(0,
        Math.min(boosterEnd.getTime(), now.getTime()) -
        lastActiveAt.getTime()
      ) / 1000;
      const overlapRatio = overlapSeconds / cappedSeconds;
      if (booster.type === 'offline_boost' || booster.type === 'coin_boost') {
        boosterMultiplier += (booster.multiplier - 1.0) * overlapRatio;
      }
    }
  }
  const subtotal = baseCoins + abilityBonus + decorationBonus;
  const boosterBonus = subtotal * (boosterMultiplier - 1.0);

  // 5. オフライン効率ペナルティ: 70%
  // （放置だけで稼げすぎるとプレイ動機が下がるため）
  const OFFLINE_EFFICIENCY = 0.70;

  const totalCoins = Math.floor(
    (subtotal + boosterBonus) * OFFLINE_EFFICIENCY
  );

  return {
    coins: totalCoins,
    elapsedSeconds: cappedSeconds,
    breakdown: {
      baseCoins: Math.floor(baseCoins * OFFLINE_EFFICIENCY),
      abilityBonus: Math.floor(abilityBonus * OFFLINE_EFFICIENCY),
      decorationBonus: Math.floor(decorationBonus * OFFLINE_EFFICIENCY),
      boosterBonus: Math.floor(boosterBonus * OFFLINE_EFFICIENCY),
    },
  };
}
```

### 8.2 リアルタイムコイン生成

```typescript
// engine/coin-generator.ts

// 1秒ごとにコイン生成をチェック（requestAnimationFrameとは独立）
const COIN_TICK_INTERVAL = 1000; // ms

function tickCoinGeneration(
  slimes: SlimeInstance[],
  ranch: RanchState,
  now: number,
): { totalCoins: number; floatingCoins: CoinFloat[] } {
  let totalCoins = 0;
  const floatingCoins: CoinFloat[] = [];

  for (const slime of slimes) {
    const master = SLIME_MASTER[slime.masterId];
    const elapsedMs = now - slime.lastCoinTime;

    if (elapsedMs >= 60000 / master.coinsPerMinute) {
      // コイン1枚生成
      let coinValue = 1;

      // 能力ボーナス
      if (master.ability === 'coin_boost') coinValue = Math.ceil(coinValue * 1.5);
      if (master.ability === 'golden') coinValue = coinValue * 3;

      // 装飾ボーナス（スライムが居る区画のボーナス）
      // 簡略化: 全区画のcoin_rateの合算
      let slotBonus = 1.0;
      for (const slot of ranch.slots) {
        if (slot.bonus?.type === 'coin_rate') {
          slotBonus += slot.bonus.multiplier - 1.0;
        }
      }
      coinValue = Math.ceil(coinValue * slotBonus);

      totalCoins += coinValue;
      slime.lastCoinTime = now;

      // 浮遊コイン演出データ
      floatingCoins.push({
        x: slime.x,
        y: slime.y - master.baseRadius - 10,
        value: coinValue,
      });
    }
  }

  return { totalCoins, floatingCoins };
}

interface CoinFloat {
  x: number;
  y: number;
  value: number;
}
```

---

## 9. 牧場拡張システム

### 9.1 区画レイアウト（4x4グリッド）

```
┌──────┬──────┬──────┬──────┐
│  0   │  1   │  2   │  3   │
│ 無料 │ 500  │ 1000 │ 2000 │
├──────┼──────┼──────┼──────┤
│  4   │  5   │  6   │  7   │
│ 無料 │ 500  │ 1500 │ 3000 │
├──────┼──────┼──────┼──────┤
│  8   │  9   │  10  │  11  │
│ 1000 │ 2000 │ 3000 │ 5000 │
├──────┼──────┼──────┼──────┤
│  12  │  13  │  14  │  15  │
│ 2000 │ 3000 │ 5000 │10000 │
└──────┴──────┴──────┴──────┘

初期解放: スロット0, 4（左上2区画）
スライム上限: 解放区画数 × 5
初期上限: 2区画 × 5 = 10体
最大: 16区画 × 5 = 80体
```

### 9.2 区画解放コスト表

| スロット | コスト | 累計必要コイン | 追加上限 |
|---|---|---|---|
| 0, 4 | 無料（初期） | 0 | 10 |
| 1 | 500 | 500 | 15 |
| 5 | 500 | 1,000 | 20 |
| 2 | 1,000 | 2,000 | 25 |
| 8 | 1,000 | 3,000 | 30 |
| 6 | 1,500 | 4,500 | 35 |
| 3 | 2,000 | 6,500 | 40 |
| 9 | 2,000 | 8,500 | 45 |
| 12 | 2,000 | 10,500 | 50 |
| 7 | 3,000 | 13,500 | 55 |
| 10 | 3,000 | 16,500 | 60 |
| 13 | 3,000 | 19,500 | 65 |
| 11 | 5,000 | 24,500 | 70 |
| 14 | 5,000 | 29,500 | 75 |
| 15 | 10,000 | 39,500 | 80 |

### 9.3 装飾アイテム一覧

| ID | 名前 | コスト | ボーナス種別 | 倍率 |
|---|---|---|---|---|
| `flower_bed` | 花壇 | 500 💰 | coin_rate | ×1.10 |
| `mushroom_ring` | キノコの輪 | 1,200 💰 | merge_chance | ×1.15 |
| `crystal_pond` | クリスタル池 | 2,000 💰 | coin_rate | ×1.20 |
| `rainbow_arch` | 虹のアーチ | 3,000 💰 | spawn_rate | ×1.25 |
| `golden_tree` | 黄金の木 | 5,000 💰 | coin_rate | ×1.30 |
| `fairy_lamp` | 妖精のランプ | 2,500 💰 | offline_rate | ×1.20 |
| `hot_spring` | 温泉 | 4,000 💰 | offline_rate | ×1.35 |
| `ancient_stone` | 古代石 | 3,500 💰 | merge_chance | ×1.25 |
| `wind_chime` | 風鈴 | 1,500 💰 | spawn_rate | ×1.15 |
| `star_fountain` | 星の噴水 | 8,000 💰 | coin_rate | ×1.50 |

### 9.4 背景テーマ

| テーマ | 名前 | コスト | 環境ボーナス |
|---|---|---|---|
| `meadow` | 草原 | 無料（初期） | なし |
| `forest` | 深い森 | 3,000 💰 | green系 coin+20% |
| `beach` | トロピカルビーチ | 5,000 💰 | blue系 coin+20% |
| `volcano` | 灼熱の火山 | 8,000 💰 | red系 coin+20% |
| `sky_garden` | 天空庭園 | 15,000 💰 | 全スライム coin+10% |
| `crystal_cave` | 水晶洞窟 | 25,000 💰 | 全スライム coin+15%, offline+10% |

---

## 10. 収益化設計

### 10.1 AdMob構成

| 広告種別 | 配置 | 頻度 | 備考 |
|---|---|---|---|
| バナー広告 | 牧場画面下部（タブバー上） | 常時表示 | 320x50 adaptive banner |
| インタースティシャル | 合体10回ごと | 最大5回/日 | 30秒のクールダウン |
| リワード広告 | オフライン報酬2倍 | ユーザー選択 | 1日最大10回 |
| リワード広告 | ブースター無料獲得 | ユーザー選択 | 同上 |
| リワード広告 | コイン×500即時獲得 | ショップ内 | 同上 |

### 10.2 IAP（アプリ内課金）

| 商品ID | 名前 | 価格 | 内容 |
|---|---|---|---|
| `remove_ads` | 広告削除 | ¥480 | バナー・インタースティシャル永久削除 |
| `premium_pass` | プレミアムパス | ¥480/月 | 広告削除+オフライン8h+コイン×1.5+毎日💎5 |
| `gem_pack_small` | ジェムパック小 | ¥160 | 💎50 |
| `gem_pack_medium` | ジェムパック中 | ¥480 | 💎180（20%お得） |
| `gem_pack_large` | ジェムパック大 | ¥1,200 | 💎500（33%お得） |
| `starter_pack` | スターターパック | ¥320 | 💎100 + 💰10,000 + レアスライム1体（初回限定） |

### 10.3 ジェム使途

| 用途 | コスト(💎) |
|---|---|
| コインブースト2倍 (30分) | 5 |
| オフラインブースト2倍 (2時間) | 8 |
| オートマージ (30分) | 10 |
| 即時スライム追加（ランダムTier1） | 3 |
| 牧場区画をジェムで解放 | コスト÷100（端数切上） |
| 特定色のTier1を指名召喚 | 5 |

### 10.4 リワード広告のタイミング設計

```
1. オフライン復帰時 → 「広告を見てコイン2倍！」（最も視聴率が高い）
2. レアスライム合体時 → 「広告を見てもう1体ボーナス！」
3. ミッション全達成時 → 「広告を見てボーナス💎3！」
4. コインが不足して購入できない時 → 「広告を見て500コイン！」
5. 10分間操作がない時 → 「広告を見てブースト！」（プッシュしすぎない）
```

---

## 11. シェア機能

### 11.1 シェア種別

| シェア種別 | トリガー | 内容 |
|---|---|---|
| 牧場スクリーンショット | シェアボタン | Skia Canvas全体キャプチャ + フレーム + テキスト |
| レア合体報告 | Rare以上合体時 | 合体演出スクリーンショット + テキスト |
| 図鑑コンプ報告 | 図鑑50%/100%達成 | 図鑑画面キャプチャ + 達成バッジ |
| 実績解除報告 | 実績解除時 | 実績カード画像 |

### 11.2 シェア画像生成

```typescript
// utils/share.ts
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

async function shareRanch(viewShotRef: React.RefObject<ViewShot>): Promise<void> {
  // 1. Skia CanvasをViewShotでキャプチャ
  const uri = await viewShotRef.current?.capture();
  if (!uri) return;

  // 2. フレーム合成（share-frame.png をオーバーレイ）
  // ViewShotの範囲にフレーム画像を含むコンテナを撮影することで実現

  // 3. シェアテキスト
  const text = [
    '🟢 わたしのスライム牧場 🟢',
    `スライム ${slimeCount}体 | 図鑑 ${discoveredCount}/${totalCount}種`,
    `最高レア: ${rarestSlimeName}`,
    '',
    '#スライム牧場 #SlimeRanch',
    'https://example.com/slime-ranch', // ストアURL
  ].join('\n');

  // 4. expo-sharingでシェアシート表示
  await Sharing.shareAsync(uri, {
    mimeType: 'image/png',
    dialogTitle: 'スライム牧場をシェア',
    UTI: 'public.png',
  });
}
```

### 11.3 シェア画像レイアウト (1200x630)

```
┌────────────────────────────────────────────────┐
│  ┌──────────────────────────────────────────┐  │
│  │                                          │  │
│  │        [牧場Canvasのスナップショット]       │  │
│  │          (中央にトリミング)                │  │
│  │                                          │  │
│  └──────────────────────────────────────────┘  │
│                                                │
│   🟢 スライム牧場          スライム: 25体      │
│   ⭐ 最高レア: 世界樹スライム  図鑑: 18/38     │
│                                                │
│   #スライム牧場 #SlimeRanch                    │
└────────────────────────────────────────────────┘
```

---

## 12. サウンド・ハプティクス

### 12.1 サウンド一覧

| ファイル | イベント | 長さ | 音量 | 備考 |
|---|---|---|---|---|
| `tap.mp3` | スライムタップ（分裂） | 0.2s | 0.7 | 「ぽよん」系SE |
| `merge.mp3` | Common〜Uncommon合体 | 0.5s | 0.8 | 「きゅぽん」系SE |
| `rare-merge.mp3` | Rare以上合体 | 1.0s | 0.9 | キラキラ上昇音+「きゅぽん」 |
| `coin.mp3` | コイン獲得 | 0.15s | 0.3 | チャリン（頻繁なので小さめ） |
| `levelup.mp3` | 区画解放・ショップ購入 | 0.8s | 0.8 | ファンファーレ短 |
| `achievement.mp3` | 実績解除 | 1.2s | 0.9 | ファンファーレ長 |
| `bgm-ranch.mp3` | 牧場BGM | ループ | 0.4 | のどかなアコースティック、BPM90 |

### 12.2 BGM仕様

```
- フォーマット: MP3 128kbps
- ループ: シームレスループ（末尾→先頭がスムーズに繋がる）
- フェード: 画面遷移時に0.5秒でfade out → 0.5秒でfade in
- 再生: expo-av Audio.Sound
- バックグラウンド: アプリがバックグラウンドに入ったら即停止
```

### 12.3 ハプティクス設計

| イベント | ハプティクスタイプ | 強度 |
|---|---|---|
| スライムタップ | `ImpactFeedbackStyle.Light` | - |
| 合体開始（引き寄せ） | `ImpactFeedbackStyle.Medium` | - |
| 合体完了（Common〜Uncommon） | `ImpactFeedbackStyle.Heavy` | - |
| 合体完了（Rare以上） | `NotificationFeedbackType.Success` | - |
| コイン獲得 | なし | - |
| 区画解放 | `NotificationFeedbackType.Success` | - |
| 実績解除 | `NotificationFeedbackType.Success` | - |
| ショップ購入 | `ImpactFeedbackStyle.Medium` | - |
| ミッション報酬受取 | `ImpactFeedbackStyle.Light` | - |
| エラー（コイン不足等） | `NotificationFeedbackType.Error` | - |

---

## 13. AsyncStorageキー設計

| キー | 型 | 説明 | 初期値 |
|---|---|---|---|
| `@slime_ranch/game_state` | `GameSaveData` | メインセーブデータ | 初期牧場+みどりん2体 |
| `@slime_ranch/settings` | `SettingsData` | 設定 | 全ON, ja |
| `@slime_ranch/last_active` | `string` | 最終アクティブ時刻(ISO) | 初回起動時刻 |
| `@slime_ranch/daily_missions` | `DailyMissionSave` | デイリーミッション | 毎日0時リセット |
| `@slime_ranch/achievements` | `AchievementSave` | 実績進捗 | 全未解除 |
| `@slime_ranch/encyclopedia` | `EncyclopediaSave` | 図鑑 | 全未発見 |
| `@slime_ranch/statistics` | `StatisticsData` | 累計統計 | 全0 |
| `@slime_ranch/ad_state` | `AdStateData` | 広告表示状態 | 当日0回 |
| `@slime_ranch/iap_state` | `IAPStateData` | 課金状態 | 全false |
| `@slime_ranch/tutorial_done` | `boolean` | チュートリアル完了 | false |

### 13.1 セーブ戦略

```
- 自動セーブ: 30秒ごと + 合体時 + 購入時 + アプリバックグラウンド遷移時
- デバウンス: 1秒以内の連続セーブ要求はまとめる
- バージョニング: GameSaveData.version でマイグレーション管理
  - v1: 初期リリース
  - v2以降: フィールド追加時にデフォルト値でマイグレーション
```

### 13.2 Zustand + AsyncStorage永続化

```typescript
// store/persistence.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StateStorage } from 'zustand/middleware';

const asyncStorageAdapter: StateStorage = {
  getItem: async (name: string) => {
    const value = await AsyncStorage.getItem(name);
    return value ?? null;
  },
  setItem: async (name: string, value: string) => {
    await AsyncStorage.setItem(name, value);
  },
  removeItem: async (name: string) => {
    await AsyncStorage.removeItem(name);
  },
};

// gameStore.ts で persist middleware を使用
// persist({ name: '@slime_ranch/game_state', storage: asyncStorageAdapter })
```

---

## 14. デイリーミッション（10種類）

毎日0:00 JST にリセット。7種をランダム選出して表示。

| ID | 種別 | テキスト | 目標値 | 報酬💰 | 報酬💎 |
|---|---|---|---|---|---|
| `daily_tap_10` | tap_slimes | スライムを10回タップしよう | 10 | 100 | 0 |
| `daily_tap_50` | tap_slimes | スライムを50回タップしよう | 50 | 300 | 1 |
| `daily_merge_5` | merge_slimes | 5回合体させよう | 5 | 200 | 0 |
| `daily_merge_15` | merge_slimes | 15回合体させよう | 15 | 500 | 2 |
| `daily_coins_500` | earn_coins | コインを500枚稼ごう | 500 | 200 | 0 |
| `daily_coins_2000` | earn_coins | コインを2000枚稼ごう | 2000 | 500 | 1 |
| `daily_discover_1` | discover_new | 新種を1種発見しよう | 1 | 300 | 1 |
| `daily_rare_1` | collect_rare | レア以上を1体保有しよう | 1 | 250 | 0 |
| `daily_ad_1` | watch_ad | リワード広告を1回見よう | 1 | 150 | 1 |
| `daily_ad_3` | watch_ad | リワード広告を3回見よう | 3 | 300 | 2 |

### 全達成ボーナス

7ミッション全達成で追加ボーナス: 💎5

### ミッション選出ロジック

```typescript
function selectDailyMissions(date: string): DailyMission[] {
  // 日付をシードとした擬似乱数で10種から7種を選出
  const seed = hashDateString(date); // 'YYYY-MM-DD' → number
  const rng = seededRandom(seed);
  const allMissions = [...ALL_DAILY_MISSIONS];

  // Fisher-Yatesシャッフル
  for (let i = allMissions.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [allMissions[i], allMissions[j]] = [allMissions[j], allMissions[i]];
  }

  return allMissions.slice(0, 7).map(m => ({
    ...m,
    currentValue: 0,
    completed: false,
    claimed: false,
  }));
}
```

---

## 15. 実績システム（25個）

| ID | タイトル | 説明 | 種別 | 目標 | 💰 | 💎 | アイコン |
|---|---|---|---|---|---|---|---|
| `ach_tap_100` | タッパー | スライムを100回タップ | tap_slimes | 100 | 200 | 1 | `finger-print` |
| `ach_tap_1000` | マスタータッパー | スライムを1000回タップ | tap_slimes | 1000 | 1000 | 5 | `hand-left` |
| `ach_tap_10000` | 伝説のタッパー | スライムを10000回タップ | tap_slimes | 10000 | 5000 | 15 | `star` |
| `ach_merge_10` | はじめての合体 | 10回合体 | merge_slimes | 10 | 200 | 1 | `git-merge` |
| `ach_merge_100` | 合体マスター | 100回合体 | merge_slimes | 100 | 1000 | 5 | `flash` |
| `ach_merge_500` | 合体の達人 | 500回合体 | merge_slimes | 500 | 3000 | 10 | `trophy` |
| `ach_coins_1k` | 貯金箱 | 累計1,000コイン | earn_coins | 1000 | 300 | 1 | `cash` |
| `ach_coins_10k` | 金庫番 | 累計10,000コイン | earn_coins | 10000 | 1000 | 3 | `wallet` |
| `ach_coins_100k` | 大富豪 | 累計100,000コイン | earn_coins | 100000 | 5000 | 10 | `diamond` |
| `ach_coins_1m` | スライム長者 | 累計1,000,000コイン | earn_coins | 1000000 | 10000 | 25 | `planet` |
| `ach_discover_5` | 探検家 | 5種発見 | discover_new | 5 | 300 | 2 | `search` |
| `ach_discover_15` | コレクター | 15種発見 | discover_new | 15 | 1000 | 5 | `albums` |
| `ach_discover_30` | マスターコレクター | 30種発見 | discover_new | 30 | 3000 | 10 | `ribbon` |
| `ach_discover_all` | 図鑑コンプリート | 全種発見 | fill_encyclopedia | 38 | 10000 | 50 | `book` |
| `ach_rare_1` | レアハンター | レア以上を初合成 | collect_rare | 1 | 500 | 2 | `sparkles` |
| `ach_epic_1` | エピックハンター | エピック以上を初合成 | collect_rare | 1 | 1000 | 5 | `flame` |
| `ach_legendary_1` | レジェンドハンター | レジェンダリーを初合成 | collect_rare | 1 | 3000 | 10 | `shield` |
| `ach_mythic_1` | 神話への到達 | ミシック初合成 | reach_mythic | 1 | 5000 | 15 | `sunny` |
| `ach_mythic_all` | 全色制覇 | 全6色のミシック合成 | reach_mythic | 6 | 15000 | 30 | `rainbow` |
| `ach_login_7` | 1週間の常連 | 7日連続ログイン | login_streak | 7 | 500 | 3 | `calendar` |
| `ach_login_30` | 1ヶ月の牧場主 | 30日連続ログイン | login_streak | 30 | 3000 | 15 | `calendar` |
| `ach_login_100` | 100日の猛者 | 100日連続ログイン | login_streak | 100 | 10000 | 30 | `medal` |
| `ach_deco_5` | デコレーター | 装飾を5個設置 | buy_decoration | 5 | 1000 | 3 | `color-palette` |
| `ach_deco_all` | 夢の牧場 | 全装飾を設置 | buy_decoration | 10 | 5000 | 15 | `home` |
| `ach_ad_50` | スポンサーの友 | リワード広告50回視聴 | watch_ad | 50 | 2000 | 10 | `videocam` |

---

## 16. ぷるぷるアニメーション仕様（スプリング制約パラメータ詳細）

### 16.1 アニメーションシステム概要

```
描画ループ: requestAnimationFrame (Skia useFrameCallback)
└── 毎フレーム (16.67ms @ 60fps):
    1. Matter.Engine.update(engine, delta)  // 物理更新
    2. 各SlimeInstanceのwobblePhase更新      // ぷるぷる位相更新
    3. 各SlimeInstanceのscale更新            // スケールアニメーション
    4. Skia Canvas再描画                    // blob path再構築+描画
```

### 16.2 アイドル時ぷるぷる（永続ループ）

```typescript
// 毎フレーム実行
function updateIdleWobble(slime: SlimeInstance, deltaMs: number): void {
  const IDLE_FREQUENCY = 2.5;   // Hz
  const IDLE_AMPLITUDE = 0.06;  // baseRadiusの6%

  slime.wobblePhase += (IDLE_FREQUENCY * 2 * Math.PI * deltaMs) / 1000;
  if (slime.wobblePhase > Math.PI * 2) {
    slime.wobblePhase -= Math.PI * 2;
  }

  // wobbleAmplitudeはアイドル時は固定
  // ただし他アニメーション後の減衰中は大きい値から収束する
  slime.wobbleAmplitude = Math.max(
    IDLE_AMPLITUDE,
    slime.wobbleAmplitude * 0.98 // 大きい振幅からの減衰
  );
  if (Math.abs(slime.wobbleAmplitude - IDLE_AMPLITUDE) < 0.001) {
    slime.wobbleAmplitude = IDLE_AMPLITUDE;
  }
}
```

### 16.3 タップ時バウンスアニメーション

```typescript
// タップ発火時に呼ぶ
function triggerTapBounce(slime: SlimeInstance): void {
  slime.wobbleAmplitude = 0.20;  // baseRadiusの20%に急増
  // 以後、毎フレームのupdateIdleWobbleで0.98倍ずつ減衰
  // 0.20 → 0.196 → ... → 約30フレーム(500ms)で0.06に収束

  // scaleバウンス (react-native-reanimated spring)
  // scale: 1.0 → 1.2 → 0.9 → 1.05 → 1.0
  // stiffness: 300, damping: 10, mass: 0.8
}

// Reanimated スプリング設定
const TAP_SPRING = {
  damping: 10,
  stiffness: 300,
  mass: 0.8,
  overshootClamping: false,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 0.01,
};
```

### 16.4 合体アニメーション（キーフレーム）

```typescript
const MERGE_ANIMATION = {
  // Phase 1: 引き寄せ (0〜300ms)
  attract: {
    duration: 300,
    easing: 'easeInQuad',   // 加速しながら近づく
    // 2体の中間点に向かってMatter.Body.setPositionで移動
  },

  // Phase 2: 衝突フラッシュ (300〜500ms)
  flash: {
    duration: 200,
    // 2体を削除
    // パーティクル12個放出
    // Canvas overlay opacity: 0 → 0.3 → 0 (easeOutQuad)
  },

  // Phase 3: 新スライム出現 (500〜1100ms)
  appear: {
    keyframes: [
      { time: 0,   scale: 0.0,  wobbleAmp: 0.00 },
      { time: 200, scale: 1.4,  wobbleAmp: 0.20 },  // 膨張
      { time: 350, scale: 0.85, wobbleAmp: 0.18 },  // 収縮
      { time: 450, scale: 1.1,  wobbleAmp: 0.15 },  // 再膨張
      { time: 600, scale: 1.0,  wobbleAmp: 0.12 },  // 安定へ
    ],
    // 600ms後はidle wobbleに移行（wobbleAmplitudeが0.98倍で減衰）
    interpolation: 'cubicBezier(0.34, 1.56, 0.64, 1.0)', // オーバーシュート
  },

  // パーティクルパラメータ
  particles: {
    count: 12,
    minSpeed: 100,     // px/sec
    maxSpeed: 200,     // px/sec
    minSize: 3,        // px
    maxSize: 6,        // px
    lifetime: 500,     // ms
    fadeOutStart: 0.6, // 寿命の60%経過後からフェードアウト
    gravity: 50,       // px/sec²（軽い下向き）
    color: 'inherit',  // 合体元スライムのbaseColor
  },
};
```

### 16.5 衝突変形アニメーション

```typescript
const COLLISION_DEFORM = {
  // 衝突検出時に衝突法線方向を取得
  // 法線方向に squash、直交方向に stretch
  squashAmount: 0.15,    // 15%潰れる
  stretchAmount: 0.10,   // 10%伸びる

  // 変形を8制御点に反映する方法:
  // 各制御点の角度と衝突法線の内積を計算
  // dot > 0 の制御点: radius *= (1 - squashAmount * dot)
  // dot < 0 の制御点: radius *= (1 + stretchAmount * |dot|)

  // 復帰アニメーション
  recovery: {
    damping: 0.88,       // フレームごとに変形量×0.88
    duration: 400,       // ms（最大持続時間、先に減衰で消える）
  },
};
```

### 16.6 分裂アニメーション

```typescript
const SPLIT_ANIMATION = {
  // 元スライムが一瞬膨張 → 2体にポップ
  originalPop: {
    scale: [1.0, 1.3, 0.0], // 膨張して消滅
    duration: 200,            // ms
  },

  // 新2体の出現
  newSlimeSpawn: {
    initialScale: 0.0,
    spring: {
      stiffness: 180,
      damping: 12,
      mass: 1.0,
      toValue: 1.0,
    },
    // 2体は元の位置から左右に baseRadius * 1.5 の位置にスポーン
    offsetX: 1.5,             // baseRadius倍率
    // 初速: 外向きに 100 px/sec
    initialVelocity: 100,
  },

  wobble: {
    initialAmplitude: 0.15,   // 出現直後は激しめ
    // idle wobbleのdamping (0.98)で自然に収束
  },
};
```

### 16.7 表面の波紋表現（高度なblob変形）

```typescript
// 8制御点それぞれに独立したsin波を持たせることで
// 表面が「生きている」ように見える

function calculateControlPointRadius(
  pointIndex: number,       // 0〜7
  baseRadius: number,
  wobblePhase: number,
  wobbleAmplitude: number,
  time: number,
): number {
  // 基本波: 全体のぷるぷる
  const baseWave = Math.sin(wobblePhase + pointIndex * (Math.PI * 2 / 8));

  // 副波: 制御点ごとにわずかにずれた高周波
  const subFrequency = 4.0;  // Hz（基本の1.6倍）
  const subAmplitude = wobbleAmplitude * 0.3; // 基本振幅の30%
  const subWave = Math.sin(
    time * subFrequency * Math.PI * 2 / 1000 +
    pointIndex * 1.3 // 整数比でないことで「うねり」が出る
  );

  const totalDisplacement = wobbleAmplitude * baseWave + subAmplitude * subWave;

  return baseRadius * (1.0 + totalDisplacement);
}
```

---

## 17. ゲームバランス設計

### 17.1 コインインフレカーブ

```
プレイ時間 | 期待コイン保有 | 解放区画数 | 最高Tier
---------|-------------|---------|-------
  10分    |     200     |    2    |   2
  30分    |    1,000    |    3    |   3
  1時間   |    3,000    |    5    |   3
  3時間   |   10,000    |    7    |   4
  1日     |   30,000    |    9    |   4
  3日     |   80,000    |   12    |   5
  1週間   |  200,000    |   14    |   5
  2週間   |  500,000    |   16    |   6
  1ヶ月   | 2,000,000   |   16    |   6(全色)
```

### 17.2 スライム数制御

```
- 分裂: 上限に達している場合、タップしても分裂しない（画面表示で通知）
- 合体: 上限に関係なく常に可能（合体は数が減る方向）
- 理想的な密度: 画面内に15〜25体が常時見える状態
  → 物理的に動き回り、適度に衝突・合体が起きる
- 上限を超えそうな場合: 「牧場を拡張しよう！」のバナー表示
```

### 17.3 タップ→分裂のクールダウン

```
- 同一スライムの連続タップ: 0.5秒クールダウン
- グローバルタップ: クールダウンなし（別のスライムは即タップ可能）
- 分裂コスト: なし（無料）
- 分裂で生まれるスライム: 元と同じmasterId
```

---

## 18. チュートリアルフロー

```
Step 1: 「スライムをタップしてみよう！」
  → みどりん(green_1)が1体。タップ指示のハイライト。
  → タップで分裂。「すごい！スライムが分裂したよ！」

Step 2: 「もう1回タップして、たくさん増やそう！」
  → もう1回タップ。3体に。

Step 3: 「同じ色のスライムがぶつかると…」
  → 自動で2体が衝突 → 合体演出
  → 「合体して進化した！もりりん誕生！」

Step 4: 「スライムはコインを生んでくれるよ」
  → コインが浮遊するのを見せる
  → 「コインで牧場を広げよう！」

Step 5: チュートリアル完了
  → 「自由にスライムを育てよう！」
  → tutorial_done = true に保存
```

---

## 19. 通知設計

| 通知 | タイミング | テキスト |
|---|---|---|
| オフライン報酬 | 離脱後4時間 | 「🟢 スライムたちがコインを貯めてるよ！見に来てね」 |
| デイリーミッション | 毎日9:00 | 「📋 今日のミッションが届いたよ！」 |
| レアスライム接近 | 離脱後24時間 | 「✨ もう少しでレアスライムに進化しそう…！」 |

---

## 20. パフォーマンス要件

```
- FPS: 60fps維持（スライム30体以下で確実に）
- FPS: 45fps以上（スライム50体以上のストレス時）
- Matter.js update: 3ms以内/フレーム
- Skia描画: 8ms以内/フレーム
- メモリ: 200MB以内
- AsyncStorage read: 初回ロード2秒以内
- アプリサイズ: 50MB以内（assets含む）
```

---

## 21. テスト計画

| テスト対象 | テスト内容 | ファイル |
|---|---|---|
| merge-logic | 同色同Tier合体→正しい上位Tier / 異色不可 / rainbow例外 / lucky確率 / Tier6リサイクル | `merge-logic.test.ts` |
| offline-reward | 0秒 / 1時間 / 4時間上限 / 8時間上限(premium) / ブースター期間重複計算 / 装飾ボーナス | `offline-reward.test.ts` |
| coin-generator | 基本生成 / ability補正 / 装飾補正 / 複数スライム同時 | `coin-generator.test.ts` |

---

*設計書 v1.0 — 2026-03-20*

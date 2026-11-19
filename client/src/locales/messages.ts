import type { TimeTableGenreHighlightColor } from '@/stores/SettingsStore';


/** 画面の表示言語 */
export type UiLanguage = 'Japanese' | 'English';

/** 番組表のジャンル名 (設定に保存するキー) */
const GENRE_KEYS = [
    'ニュース・報道',
    '情報・ワイドショー',
    'ドキュメンタリー・教養',
    'スポーツ',
    'ドラマ',
    'アニメ・特撮',
    'バラエティ',
    '音楽',
    '映画',
    '劇場・公演',
    '趣味・教育',
    '福祉',
    'その他',
] as const;

export type TimeTableGenreKey = typeof GENRE_KEYS[number];

const japanese = {
    'nav.tv': 'テレビをみる',
    'nav.videos': 'ビデオをみる',
    'nav.timetable': '番組表',
    'nav.reservations': '録画予約',
    'nav.captures': 'キャプチャ',
    'nav.offline': 'オフライン保存',
    'nav.mylist': 'マイリスト',
    'nav.history': '視聴履歴',
    'nav.settings': '設定',
    'nav.updateAvailable': 'アップデートがあります (version {version})',
    'bottom.tv': 'テレビをみる',
    'bottom.videos': 'ビデオをみる',
    'bottom.reservations': '録画予約',
    'bottom.captures': 'キャプチャ',
    'bottom.mypage': 'マイページ',
    'search.captures': 'キャプチャを検索...',
    'search.videos': '録画番組を検索...',
    'search.videosAndSeries': '録画番組やシリーズを検索...',
    'search.programs': '放送予定の番組を検索...',
    'header.install': 'アプリとしてインストール',
    'weekday.0': '日',
    'weekday.1': '月',
    'weekday.2': '火',
    'weekday.3': '水',
    'weekday.4': '木',
    'weekday.5': '金',
    'weekday.6': '土',
    'channelType.pinned': 'ピン留め',
    'channelType.terrestrial': '地デジ',
    'channelType.bs': 'BS',
    'channelType.cs': 'CS',
    'channelType.catv': 'CATV',
    'channelType.sky': 'SKY',
    'channelType.bs4k': 'BS4K',
    'timetable.watchChannel': '{name} を視聴',
    'timetable.moveToNow': '現在時刻に移動',
    'timetable.displaySettings': '番組表の表示設定',
    'timetable.xmltvUrlMissing': 'XMLTV 番組表の URL が設定されていません。設定の全般から URL を入力してください。',
    'timetable.loadFailed': '番組表を読み込めませんでした。',
    'timetable.openSettings': '設定を開く',
    'timetable.reload': '再読み込み',
    'timetable.loading': '番組表を読み込んでいます…',
    'timetable.hourSuffix': '時',
    'timetable.programDetails': '番組詳細',
    'timetable.reserve': '録画予約',
    'timetable.enableReservation': '予約を有効化',
    'timetable.disableReservation': '予約を無効化',
    'timetable.enableShort': '有効化',
    'timetable.disableShort': '無効化',
    'timetable.noProgramInfo': '番組情報なし',
    'timetable.xmltvUrlMissingSnackbar': 'XMLTV 番組表の URL が設定されていません。設定の全般から URL を入力してください。',
    'timetable.loadFailedSnackbar': '番組表を読み込めませんでした。通信できる状態で、再読み込みしてください。',
    'timetableSettings.title': '番組表の表示設定',
    'timetableSettings.channelWidthHeading': '各チャンネルの表示幅を調整',
    'timetableSettings.channelWidthLabel': '各チャンネルの横方向の表示を調整します。広めにすると番組名が読みやすくなります。<br>',
    'timetableSettings.hourHeightHeading': '時間軸の表示密度を調整',
    'timetableSettings.hourHeightLabel': '番組表の縦方向の表示密度を調整します。広めにすると番組詳細が読みやすくなります。<br>',
    'timetableSettings.wide': '広め',
    'timetableSettings.normal': '標準',
    'timetableSettings.narrow': '狭め',
    'timetableSettings.hoverHeading': 'カーソルを重ねた時に番組詳細を自動表示する',
    'timetableSettings.hoverLabel': 'PC でカーソルを番組に重ねた時に、クリックせずに番組情報を展開表示します。<br>',
    'timetableSettings.shoppingHeading': 'ショッピング・通販番組を控えめに表示する',
    'timetableSettings.shoppingLabel': '「ショッピング・通販」ジャンルの番組をグレーで表示し、番組表の視認性を高めます。<br>',
    'timetableSettings.genreHeading': 'ジャンル別のハイライト色',
    'timetableSettings.genreLabel': '各ジャンルの番組セルに表示するハイライト色を設定します。<br>よく見るジャンルに色を付けると、より番組を見つけやすくなります。<br>',
    'drawer.programInfo': '番組情報',
    'drawer.programInfoEnded': '番組情報 （終了済み）',
    'drawer.close': '閉じる',
    'settings.title': '設定',
    'settings.general': '全般',
    'settings.quality': '画質',
    'settings.caption': '字幕',
    'settings.dataBroadcasting': 'データ放送',
    'settings.capture': 'キャプチャ',
    'settings.account': 'アカウント',
    'settings.jikkyo': 'ニコニコ実況',
    'settings.twitter': 'Twitter 連携',
    'settings.server': 'サーバー設定',
    'general.languageHeading': '表示言語',
    'general.languageLabel': '番組表と、この設定画面の表示言語を切り替えます。<br>',
    'general.pinnedHeading': 'ピン留め中チャンネルの並び替え',
    'general.pinnedLabel': 'ピン留め中のチャンネルの表示順序を変更できます。よくみるチャンネルは先頭に配置しておくと便利です。<br>ピン留め中のチャンネルの追加・削除は、別途 TV ホーム画面のチャンネルリストから行えます。<br>',
    'general.pinnedButton': 'ピン留め中チャンネルの並び替え設定を開く',
    'general.timetableHeading': '番組表の表示設定',
    'general.timetableLabel': '番組表のチャンネル名の表示幅、時間軸の表示密度、ジャンル別のハイライト色などを設定できます。<br>番組表ページ上部の設定アイコンからも開くことができます。<br>',
    'general.timetableButton': '番組表の表示設定を開く',
    'general.xmltvHeading': 'XMLTV 番組表の URL',
    'general.xmltvLabel': '番組表に表示する XMLTV 形式の番組表の URL です。<br>入力すると、サイドバーの番組表はこの URL の内容を表示し、サーバーの番組表 API は呼びません。<br>空のときは、サーバーの番組表を表示します。<br>',
    'general.m3uHeading': 'M3U プレイリストの URL',
    'general.m3uLabel': 'テレビホームに表示する M3U 形式のチャンネル一覧の URL です。<br>入力すると、テレビホームはこのプレイリストを表示し、サーバーのチャンネル一覧 API は呼びません。<br>空のときは、サーバーのチャンネル一覧を表示します。<br>',
    'general.m3uButton': 'プレイリストを開く',
    'playlist.urlMissing': 'M3U プレイリストの URL が設定されていません。設定の全般から URL を入力してください。',
    'playlist.urlMissingSnackbar': 'M3U プレイリストの URL が設定されていません。設定の全般から URL を入力してください。',
    'playlist.openSettings': '設定を開く',
    'playlist.loadFailed': 'プレイリストを読み込めませんでした。接続を確認して、再読み込みしてください。',
    'playlist.reload': '再読み込み',
    'playlist.loading': 'プレイリストを読み込んでいます...',
    'playlist.empty': '条件に合うチャンネルがありません。',
    'playlist.clearFilter': '絞り込みを解除',
    'playlist.searchPlaceholder': 'チャンネルを検索',
    'playlist.otherGroup': 'その他',
    'playlist.back': 'ホームに戻る',
    'playlist.previous': '前のチャンネル',
    'playlist.next': '次のチャンネル',
    'playlist.playbackFailed': '再生を開始できませんでした。',
    'playlist.codecUnsupported': 'このブラウザでは、このチャンネルの映像形式を再生できません。Safari で開くと再生できる場合があります。',
    'playlist.retry': '再試行',
    'playlist.channelMissing': 'このチャンネルはプレイリストにありません。',
    'playlist.tapToPlay': 'タップして再生',
    'general.backgroundHeading': 'プレイヤーの読み込み中に背景写真を表示する',
    'general.backgroundLabel': 'プレイヤーの読み込み中にランダムで背景写真を表示できます。デフォルトはオンです。<br>背景写真を表示したくない場合は、この設定をオフにできます。<br>',
    'general.blackHeading': 'プレイヤー表示領域の背景色を完全な黒にする',
    'general.blackLabel': '映像の上下 or 左右に表示される黒帯の色を、完全な黒に変更できます。デフォルトはオフです。<br>特に有機 EL ディスプレイを搭載したデバイスで、映像の周囲に灰色がかった光が漏れて気になるときは、この設定をオンにすると改善されるかもしれません。<br>',
    'general.jikkyoHeading': 'チャンネル一覧を実況勢いが強い順に並び替える',
    'general.jikkyoLabel': 'オンにすると、チャンネル一覧を実況勢い (ニコニコ実況に1分間に投稿されたコメント数) が強い順に並べ替えます。デフォルトはオフです。<br>実況勢いが同じ場合や、ニコニコ実況が存在しないチャンネル、実況勢いの取得に失敗したチャンネルは、通常通りチャンネル番号順で表示されます。<br><div class="mt-1"></div>この設定がオンのときは、ピン留め中チャンネルの並び替え設定は無視されます。この設定をオフにすれば、再び並び替え設定が反映されます。<br>',
    'general.channelReverseHeading': 'チャンネル切り替えボタンとショートカットキーの上下方向をテレビリモコン準拠にする',
    'general.channelReverseBefore': 'オンにすると、視聴画面のチャンネル切り替えボタン ',
    'general.channelReverseMiddle': ' とショートカットキーの上下キーの動作が反転します。デフォルトはオフです。',
    'general.channelReverseSecond': '一般的なテレビリモコンと同じように、',
    'general.channelReverseAfter': ' ボタン/キーでチャンネル番号を上げ、',
    'general.channelReverseEnd': ' ボタン/キーでチャンネル番号を下げたい方におすすめです。',
    'general.altHeadingBefore': 'チャンネル選局のキーボードショートカットを ',
    'general.altHeadingAfter': ' + 数字キー/テンキーに変更する',
    'general.altLabelBefore': 'オンにすると、数字キーまたはテンキーに対応するリモコン番号（1～12）のチャンネルに切り替えるとき、',
    'general.altLabelAfter': ' キーを同時に押す必要があります。',
    'general.altLabelSecond': 'コメントやツイートを入力しようとして誤って数字キーを押してしまい、チャンネルが変わってしまう事態を避けたい方におすすめです。',
    'general.clock28Heading': '時刻を 28 時間表記で表示する',
    'general.clock28Label': '深夜番組でよく使われる 28 時間表記 (24 時 〜 27 時) で時刻を表示します。デフォルトはオフです。<br>オンにすると、午前 0 時 〜 3 時が前日の 24 時 〜 27 時と表示され、深夜番組の放送時間がよりわかりやすくなります。<br>',
    'general.broadcastTimeHeading': '録画番組の再生中に元の放送時刻を表示する',
    'general.broadcastTimeLabel': 'オンにすると、録画番組の再生中に現在時刻ではなく、元の放送時刻を再生位置に合わせて表示します。デフォルトはオフです。<br>元の放送時刻が表示されているときは、タイムシフト再生中であることを示すアイコンが時刻の左側に表示されます。<br>',
    'general.panelHeading': 'デフォルトのパネルの表示状態',
    'general.panelLabel': '視聴画面を開いたときに、右側のパネルをどう表示するかを設定します。<br>',
    'general.panelRestore': '前回の状態を復元する',
    'general.panelAlways': '常に表示する',
    'general.panelFold': '常に折りたたむ',
    'general.tvTabHeading': 'テレビをみるときにデフォルトで表示されるパネルのタブ',
    'general.tvTabLabel': 'テレビの視聴画面を開いたときに、右側のパネルで最初に表示されるタブを設定します。<br>',
    'general.videoTabHeading': 'ビデオをみるときにデフォルトで表示されるパネルのタブ',
    'general.videoTabLabel': 'ビデオの視聴画面を開いたときに、右側のパネルで最初に表示されるタブを設定します。<br>',
    'general.tabProgram': '番組情報タブ',
    'general.tabChannel': 'チャンネルタブ',
    'general.tabComment': 'コメントタブ',
    'general.tabTwitter': 'Twitter タブ',
    'general.tabSeries': 'シリーズタブ',
    'general.historyHeading': '視聴履歴の保持件数',
    'general.historyLabel': '録画番組の視聴履歴を何件まで保持するかを設定します。デフォルトは 50 件です。<br>この値を超えると、最も古い視聴履歴から自動的に削除されます。<br>',
    'general.countSuffix': '件',
    'general.exportHeading': '設定をエクスポート',
    'general.exportLabel': 'このデバイス (ブラウザ) に保存されている設定データを、エクスポート (ダウンロード) できます。<br>ダウンロードした設定データ (KonomiTV-Settings.json) は、[設定をインポート] からインポートできます。異なるサーバーの KonomiTV を同じ設定で使いたいときなどに使ってください。<br>',
    'general.exportButton': '設定をエクスポート',
    'general.importHeading': '設定をインポート',
    'general.importLabel': '[設定をエクスポート] でダウンロードした設定データを、このデバイス (ブラウザ) にインポートできます。<br>マイリスト・視聴履歴を含めてインポートするかは、ボタンを押した後の確認ダイヤログで選択できます。<br><strong class="text-error-lighten-1">設定をインポートすると、現在のデバイス設定はすべて上書きされます。元に戻すことはできません。</strong><br><strong class="text-error-lighten-1">設定のデバイス間同期がオンのときは、同期が有効なすべてのデバイスに反映されます。</strong>十分ご注意ください。<br>',
    'general.importFileLabel': '設定データ (KonomiTV-Settings.json) を選択',
    'general.importButton': '設定をインポート',
    'general.importDialogTitle': 'マイリスト・視聴履歴もインポートしますか？',
    'general.importDialogBody': 'マイリストと視聴履歴は、このサーバーの録画番組と紐づいています。<br>別の KonomiTV サーバーの設定をインポートすると、保存されている録画番組が異なるため、身に覚えのない番組が表示されてしまいます。<br>',
    'general.importDialogAdvice': '同じサーバーのバックアップから復元する際は「上書き」、別のサーバーへ設定を移行する際は「維持」を選択してください。',
    'general.importDataLabel': 'インポートするデータ:',
    'general.importDeviceLabel': 'このデバイス:',
    'general.importCounts': 'マイリスト {mylist}件 / 視聴履歴 {history}件',
    'general.importOverwrite': 'マイリスト・視聴履歴を<br class="smartphone-vertical-only">上書きしてインポート',
    'general.importKeep': 'マイリスト・視聴履歴は<br class="smartphone-vertical-only">維持してインポート',
    'general.cancel': 'キャンセル',
    'general.resetHeading': '設定を初期状態にリセット',
    'general.resetLabel': 'このデバイス (ブラウザ) に保存されている設定データを、初期状態のデフォルト値にリセットできます。<br><strong class="text-error-lighten-1">設定をリセットすると、元に戻すことはできません。</strong><br><strong class="text-error-lighten-1">設定のデバイス間同期がオンのときは、同期が有効なすべてのデバイスに反映されます。</strong>十分ご注意ください。<br>',
    'general.resetButton': '設定をリセット',
    'general.exported': '設定をエクスポートしました。',
    'general.importSelectFile': 'インポートする設定データを選択してください！',
    'general.importInvalid': '設定データが不正なため、インポートできませんでした。',
    'general.imported': '設定をインポートしました。',
    'general.resetDone': '設定をリセットしました。',
    'color.White': '白',
    'color.Pink': 'ピンク',
    'color.Red': '赤',
    'color.Orange': 'オレンジ',
    'color.Yellow': '黄色',
    'color.Lime': '黄緑',
    'color.Teal': '青緑',
    'color.Cyan': '水色',
    'color.Blue': '青',
    'color.Ochre': '黄土色',
    'color.Brown': '茶色',
    'genre.ニュース・報道': 'ニュース・報道',
    'genre.情報・ワイドショー': '情報・ワイドショー',
    'genre.ドキュメンタリー・教養': 'ドキュメンタリー・教養',
    'genre.スポーツ': 'スポーツ',
    'genre.ドラマ': 'ドラマ',
    'genre.アニメ・特撮': 'アニメ・特撮',
    'genre.バラエティ': 'バラエティ',
    'genre.音楽': '音楽',
    'genre.映画': '映画',
    'genre.劇場・公演': '劇場・公演',
    'genre.趣味・教育': '趣味・教育',
    'genre.福祉': '福祉',
    'genre.その他': 'その他',
} as const;

export type MessageKey = keyof typeof japanese;

const english: { [K in MessageKey]: string } = {
    'nav.tv': 'Watch TV',
    'nav.videos': 'Watch videos',
    'nav.timetable': 'TV guide',
    'nav.reservations': 'Recordings',
    'nav.captures': 'Captures',
    'nav.offline': 'Offline videos',
    'nav.mylist': 'My List',
    'nav.history': 'Watch history',
    'nav.settings': 'Settings',
    'nav.updateAvailable': 'Update available (version {version})',
    'bottom.tv': 'Watch TV',
    'bottom.videos': 'Videos',
    'bottom.reservations': 'Recordings',
    'bottom.captures': 'Captures',
    'bottom.mypage': 'My page',
    'search.captures': 'Search captures...',
    'search.videos': 'Search recorded programs...',
    'search.videosAndSeries': 'Search recorded programs and series...',
    'search.programs': 'Search upcoming programs...',
    'header.install': 'Install as an app',
    'weekday.0': 'Sun',
    'weekday.1': 'Mon',
    'weekday.2': 'Tue',
    'weekday.3': 'Wed',
    'weekday.4': 'Thu',
    'weekday.5': 'Fri',
    'weekday.6': 'Sat',
    'channelType.pinned': 'Pinned',
    'channelType.terrestrial': 'Terrestrial',
    'channelType.bs': 'BS',
    'channelType.cs': 'CS',
    'channelType.catv': 'Cable',
    'channelType.sky': 'SKY',
    'channelType.bs4k': 'BS4K',
    'timetable.watchChannel': 'Watch {name}',
    'timetable.moveToNow': 'Jump to now',
    'timetable.displaySettings': 'TV guide display settings',
    'timetable.xmltvUrlMissing': 'The XMLTV guide URL is not set. Enter the URL in Settings → General.',
    'timetable.loadFailed': 'The TV guide could not be loaded.',
    'timetable.openSettings': 'Open settings',
    'timetable.reload': 'Reload',
    'timetable.loading': 'Loading the TV guide…',
    'timetable.hourSuffix': '',
    'timetable.programDetails': 'Details',
    'timetable.reserve': 'Record',
    'timetable.enableReservation': 'Enable recording',
    'timetable.disableReservation': 'Disable recording',
    'timetable.enableShort': 'Enable',
    'timetable.disableShort': 'Disable',
    'timetable.noProgramInfo': 'No program information',
    'timetable.xmltvUrlMissingSnackbar': 'The XMLTV guide URL is not set. Enter the URL in Settings → General.',
    'timetable.loadFailedSnackbar': 'The TV guide could not be loaded. Check your connection, then reload.',
    'timetableSettings.title': 'TV guide display settings',
    'timetableSettings.channelWidthHeading': 'Channel column width',
    'timetableSettings.channelWidthLabel': 'Adjusts how wide each channel column is. A wider column makes program titles easier to read.<br>',
    'timetableSettings.hourHeightHeading': 'Time scale density',
    'timetableSettings.hourHeightLabel': 'Adjusts how much vertical space each hour uses. A taller scale makes program details easier to read.<br>',
    'timetableSettings.wide': 'Wide',
    'timetableSettings.normal': 'Normal',
    'timetableSettings.narrow': 'Narrow',
    'timetableSettings.hoverHeading': 'Show program details when the pointer hovers',
    'timetableSettings.hoverLabel': 'On a PC, hovering a program expands its details without a click.<br>',
    'timetableSettings.shoppingHeading': 'Dim shopping programs',
    'timetableSettings.shoppingLabel': 'Shows programs in the Shopping genre in gray so the rest of the guide is easier to scan.<br>',
    'timetableSettings.genreHeading': 'Highlight color by genre',
    'timetableSettings.genreLabel': 'Sets the highlight color shown on program cells for each genre.<br>Coloring the genres you watch often makes those programs easier to find.<br>',
    'drawer.programInfo': 'Program info',
    'drawer.programInfoEnded': 'Program info (ended)',
    'drawer.close': 'Close',
    'settings.title': 'Settings',
    'settings.general': 'General',
    'settings.quality': 'Quality',
    'settings.caption': 'Subtitles',
    'settings.dataBroadcasting': 'Data broadcasting',
    'settings.capture': 'Capture',
    'settings.account': 'Account',
    'settings.jikkyo': 'Niconico comments',
    'settings.twitter': 'Twitter',
    'settings.server': 'Server',
    'general.languageHeading': 'Display language',
    'general.languageLabel': 'Switches the language used on the TV guide and on this settings page.<br>',
    'general.pinnedHeading': 'Reorder pinned channels',
    'general.pinnedLabel': 'Changes the order of pinned channels. Put the channels you watch often first.<br>Add or remove pinned channels from the channel list on the TV home screen.<br>',
    'general.pinnedButton': 'Open pinned channel order',
    'general.timetableHeading': 'TV guide display settings',
    'general.timetableLabel': 'You can set the channel column width, the time scale density, and highlight colors for each genre.<br>You can also open this from the settings icon at the top of the TV guide.<br>',
    'general.timetableButton': 'Open TV guide display settings',
    'general.xmltvHeading': 'XMLTV guide URL',
    'general.xmltvLabel': 'URL of the XMLTV guide shown on the TV guide.<br>When this is set, the sidebar TV guide shows this URL and does not call the server guide API.<br>When this is empty, the server guide is shown.<br>',
    'general.m3uHeading': 'M3U playlist URL',
    'general.m3uLabel': 'URL of the M3U channel list shown on the TV home screen.<br>When this is set, the TV home shows this playlist and does not call the server channel list API.<br>When this is empty, the server channel list is shown.<br>',
    'general.m3uButton': 'Open playlist',
    'playlist.urlMissing': 'The M3U playlist URL is not set. Enter the URL in Settings → General.',
    'playlist.urlMissingSnackbar': 'The M3U playlist URL is not set. Enter the URL in Settings → General.',
    'playlist.openSettings': 'Open settings',
    'playlist.loadFailed': 'The playlist could not be loaded. Check your connection, then reload.',
    'playlist.reload': 'Reload',
    'playlist.loading': 'Loading the playlist...',
    'playlist.empty': 'No channels match this filter.',
    'playlist.clearFilter': 'Clear filter',
    'playlist.searchPlaceholder': 'Search channels',
    'playlist.otherGroup': 'Other',
    'playlist.back': 'Back to home',
    'playlist.previous': 'Previous channel',
    'playlist.next': 'Next channel',
    'playlist.playbackFailed': 'Playback could not be started.',
    'playlist.codecUnsupported': 'This browser cannot play this channel’s video format. Opening KonomiTV in Safari may work.',
    'playlist.retry': 'Retry',
    'playlist.channelMissing': 'This channel is not in the playlist.',
    'playlist.tapToPlay': 'Tap to play',
    'general.backgroundHeading': 'Show a background photo while the player is loading',
    'general.backgroundLabel': 'Shows a random background photo while the player is loading. On by default.<br>Turn this off if you do not want a background photo.<br>',
    'general.blackHeading': 'Use pure black for the player background',
    'general.blackLabel': 'Changes the bars above and below, or to the left and right of the video, to pure black. Off by default.<br>On an OLED display, turn this on if a gray glow around the video bothers you.<br>',
    'general.jikkyoHeading': 'Sort the channel list by comment activity',
    'general.jikkyoLabel': 'When on, sorts the channel list by comment activity (comments posted to Niconico Jikkyo in one minute). Off by default.<br>Channels with the same activity, channels without Niconico Jikkyo, and channels whose activity could not be loaded stay in channel-number order.<br><div class="mt-1"></div>While this is on, the pinned channel order is ignored. Turn this off to use that order again.<br>',
    'general.channelReverseHeading': 'Match channel up/down buttons and shortcut keys to a TV remote',
    'general.channelReverseBefore': 'When on, the channel buttons on the watch screen ',
    'general.channelReverseMiddle': ' and the up and down keys are reversed. Off by default.',
    'general.channelReverseSecond': 'Use this if you want the same arrangement as a typical TV remote: ',
    'general.channelReverseAfter': ' raises the channel number, and ',
    'general.channelReverseEnd': ' lowers it.',
    'general.altHeadingBefore': 'Require ',
    'general.altHeadingAfter': ' + number or numpad keys to change channels',
    'general.altLabelBefore': 'When on, switching to remote-control channel numbers 1–12 with the number keys or the numpad also requires ',
    'general.altLabelAfter': '.',
    'general.altLabelSecond': 'Use this if pressing a number key while writing a comment or a tweet keeps changing the channel.',
    'general.clock28Heading': 'Show times on a 28-hour clock',
    'general.clock28Label': 'Shows times in the 28-hour clock (24:00–27:00) often used for late-night programs. Off by default.<br>When on, 12:00 a.m.–3:00 a.m. is shown as 24:00–27:00 on the previous day, which makes late-night broadcast times easier to read.<br>',
    'general.broadcastTimeHeading': 'Show the original broadcast time while playing a recording',
    'general.broadcastTimeLabel': 'When on, playback shows the original broadcast time for the current position instead of the current time. Off by default.<br>While the original broadcast time is shown, an icon to the left of the time indicates timeshift playback.<br>',
    'general.panelHeading': 'Default panel visibility',
    'general.panelLabel': 'Chooses how the panel on the right is shown when you open the watch screen.<br>',
    'general.panelRestore': 'Restore the previous state',
    'general.panelAlways': 'Always show',
    'general.panelFold': 'Always collapse',
    'general.tvTabHeading': 'Default panel tab when watching TV',
    'general.tvTabLabel': 'Chooses the tab shown first in the right panel when you open the TV watch screen.<br>',
    'general.videoTabHeading': 'Default panel tab when watching videos',
    'general.videoTabLabel': 'Chooses the tab shown first in the right panel when you open the video watch screen.<br>',
    'general.tabProgram': 'Program info',
    'general.tabChannel': 'Channel',
    'general.tabComment': 'Comments',
    'general.tabTwitter': 'Twitter',
    'general.tabSeries': 'Series',
    'general.historyHeading': 'Watch history limit',
    'general.historyLabel': 'Sets how many recorded-program watch history entries to keep. The default is 50.<br>Older entries are removed automatically once this limit is passed.<br>',
    'general.countSuffix': 'items',
    'general.exportHeading': 'Export settings',
    'general.exportLabel': 'Downloads the settings saved in this browser.<br>You can import the downloaded file (KonomiTV-Settings.json) with Import settings. Use this when you want another KonomiTV server to use the same settings.<br>',
    'general.exportButton': 'Export settings',
    'general.importHeading': 'Import settings',
    'general.importLabel': 'Imports a settings file downloaded with Export settings into this browser.<br>After you press the button, choose whether My List and watch history are included.<br><strong class="text-error-lighten-1">Importing replaces all settings on this device. This cannot be undone.</strong><br><strong class="text-error-lighten-1">If sync across devices is on, the imported settings are applied to every device where sync is enabled.</strong> Please be careful.<br>',
    'general.importFileLabel': 'Choose a settings file (KonomiTV-Settings.json)',
    'general.importButton': 'Import settings',
    'general.importDialogTitle': 'Also import My List and watch history?',
    'general.importDialogBody': 'My List and watch history are tied to recorded programs on this server.<br>Importing settings from another KonomiTV server can show programs you do not recognize, because the saved recordings are different.<br>',
    'general.importDialogAdvice': 'Choose Overwrite when restoring a backup of this server. Choose Keep when moving settings to a different server.',
    'general.importDataLabel': 'Data to import:',
    'general.importDeviceLabel': 'This device:',
    'general.importCounts': 'My List: {mylist} / Watch history: {history}',
    'general.importOverwrite': 'Overwrite My List and watch history,<br class="smartphone-vertical-only"> then import',
    'general.importKeep': 'Keep My List and watch history,<br class="smartphone-vertical-only"> then import',
    'general.cancel': 'Cancel',
    'general.resetHeading': 'Reset settings to defaults',
    'general.resetLabel': 'Resets the settings saved in this browser to their defaults.<br><strong class="text-error-lighten-1">Resetting settings cannot be undone.</strong><br><strong class="text-error-lighten-1">If sync across devices is on, the reset is applied to every device where sync is enabled.</strong> Please be careful.<br>',
    'general.resetButton': 'Reset settings',
    'general.exported': 'Settings exported.',
    'general.importSelectFile': 'Choose a settings file to import.',
    'general.importInvalid': 'The settings file is invalid, so it could not be imported.',
    'general.imported': 'Settings imported.',
    'general.resetDone': 'Settings reset.',
    'color.White': 'White',
    'color.Pink': 'Pink',
    'color.Red': 'Red',
    'color.Orange': 'Orange',
    'color.Yellow': 'Yellow',
    'color.Lime': 'Lime',
    'color.Teal': 'Teal',
    'color.Cyan': 'Cyan',
    'color.Blue': 'Blue',
    'color.Ochre': 'Ochre',
    'color.Brown': 'Brown',
    'genre.ニュース・報道': 'News',
    'genre.情報・ワイドショー': 'Information / Wide shows',
    'genre.ドキュメンタリー・教養': 'Documentary / Culture',
    'genre.スポーツ': 'Sports',
    'genre.ドラマ': 'Drama',
    'genre.アニメ・特撮': 'Anime / Tokusatsu',
    'genre.バラエティ': 'Variety',
    'genre.音楽': 'Music',
    'genre.映画': 'Movies',
    'genre.劇場・公演': 'Theatre / Performance',
    'genre.趣味・教育': 'Hobby / Education',
    'genre.福祉': 'Welfare',
    'genre.その他': 'Other',
};

const uiMessages: Record<UiLanguage, { [K in MessageKey]: string }> = {
    Japanese: japanese,
    English: english,
};


/**
 * 表示言語に対応する文言を返す
 * @param language 表示言語
 * @param key 文言のキー
 * @returns 表示する文言
 */
export function translate(language: UiLanguage, key: MessageKey): string {
    return uiMessages[language][key];
}


/**
 * {name} 形式のプレースホルダーを置き換える
 * @param text 置き換え前の文言
 * @param values プレースホルダー名と値
 * @returns 置き換え後の文言
 */
export function fillMessage(text: string, values: Record<string, string | number>): string {
    let filled = text;
    for (const name of Object.keys(values)) {
        filled = filled.replaceAll(`{${name}}`, String(values[name]));
    }
    return filled;
}


/**
 * 4時間ごとの時刻セレクターに出すラベルを返す
 * @param language 表示言語
 * @param hour 時 (4, 8, 12, 16, 20, 24)
 * @returns 表示ラベル
 */
/**
 * 曜日の短い表示を返す
 * @param language 表示言語
 * @param dayIndex dayjs の day() (0 が日曜)
 * @returns 曜日の表示
 */
export function weekdayLabel(language: UiLanguage, dayIndex: number): string {
    const keys = [
        'weekday.0',
        'weekday.1',
        'weekday.2',
        'weekday.3',
        'weekday.4',
        'weekday.5',
        'weekday.6',
    ] as const;
    const key = keys[dayIndex] ?? 'weekday.0';
    return translate(language, key);
}


export function formatTimeSlotLabel(language: UiLanguage, hour: number): string {
    const label = hour.toString().padStart(2, '0');
    if (language === 'English') {
        return `${label}:00`;
    }
    return `${label}時`;
}


/** チャンネル種別の表示名に使う文言キー */
const CHANNEL_TYPE_MESSAGE_KEYS = {
    'ピン留め': 'channelType.pinned',
    '地デジ': 'channelType.terrestrial',
    'BS': 'channelType.bs',
    'CS': 'channelType.cs',
    'CATV': 'channelType.catv',
    'SKY': 'channelType.sky',
    'BS4K': 'channelType.bs4k',
} as const;

export type ChannelTypeLabel = keyof typeof CHANNEL_TYPE_MESSAGE_KEYS;


/**
 * チャンネル種別の表示名を返す
 * 値そのものは番組表の絞り込みに使うため、表示名だけを言語で切り替える
 * @param language 表示言語
 * @param channelType チャンネル種別の表示名
 * @returns 画面に出すチャンネル種別名
 */
export function channelTypeLabel(language: UiLanguage, channelType: ChannelTypeLabel): string {
    return translate(language, CHANNEL_TYPE_MESSAGE_KEYS[channelType]);
}


/**
 * ジャンルのハイライト色の表示名を返す
 * @param language 表示言語
 * @param color 色の値
 * @returns 色の表示名
 */
export function colorLabel(language: UiLanguage, color: TimeTableGenreHighlightColor): string {
    return translate(language, `color.${color}`);
}


/**
 * ジャンル名の表示を返す
 * 設定に保存するキーは日本語のジャンル名のままにする
 * @param language 表示言語
 * @param genre ジャンル名
 * @returns 画面に出すジャンル名
 */
export function genreLabel(language: UiLanguage, genre: TimeTableGenreKey): string {
    return translate(language, `genre.${genre}`);
}

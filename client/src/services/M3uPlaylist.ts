import useSettingsStore from '@/stores/SettingsStore';


/** URL が未設定のときに送出するエラーメッセージ */
export const M3U_PLAYLIST_URL_NOT_SET_MESSAGE = 'M3U playlist URL is not set.';

/** プレイリストにチャンネルが1件もないときに送出するエラーメッセージ */
export const M3U_PLAYLIST_EMPTY_MESSAGE = 'M3U playlist does not contain any channels.';

/** M3U の1チャンネル */
export interface IM3uChannel {
    // プレイリスト内で一意な ID。tvg-id を優先し、無いときや重複するときは連番を付ける
    id: string;
    name: string;
    // group-title。未指定のときは空文字で、画面側が「その他」と表示する
    group: string;
    logo_url: string | null;
    stream_url: string;
    tvg_id: string | null;
}

/** パース済みの M3U プレイリスト */
export interface IM3uPlaylist {
    channels: IM3uChannel[];
    // チャンネルの出現順を保ったグループ名
    groups: string[];
}

// 取得済みのプレイリスト。チャンネルを切り替えるたびに取り直さない
// URL を変えたときは、別のプレイリストとして取り直す
let playlist_promise: Promise<IM3uPlaylist> | null = null;
let cached_url: string | null = null;


/**
 * M3U プレイリストを取得し、チャンネル一覧に変換する
 */
class M3uPlaylist {

    /**
     * M3U プレイリストを取得する
     * 同じページを開いている間は、最初に取得した結果を返す
     * @returns パース済みのプレイリスト
     */
    static async load(): Promise<IM3uPlaylist> {
        const url = useSettingsStore().settings.m3u_playlist_url.trim();
        if (playlist_promise === null || cached_url !== url) {
            cached_url = url;
            playlist_promise = M3uPlaylist.fetchPlaylist(url).catch((error: unknown) => {
                // 失敗した結果を残すと、再読み込みしても同じ失敗が返る
                playlist_promise = null;
                cached_url = null;
                throw error;
            });
        }
        return await playlist_promise;
    }


    /**
     * 保持しているプレイリストを捨て、次の load() で取り直させる
     */
    static clearCache(): void {
        playlist_promise = null;
        cached_url = null;
    }


    /**
     * M3U を取得してチャンネルに分ける
     * @param url 全般設定の M3U プレイリストの URL
     * @returns パース済みのプレイリスト
     */
    private static async fetchPlaylist(url: string): Promise<IM3uPlaylist> {
        if (url === '') {
            throw new Error(M3U_PLAYLIST_URL_NOT_SET_MESSAGE);
        }
        const response = await fetch(url);
        if (response.ok === false) {
            throw new Error(`Failed to fetch M3U playlist. (HTTP ${response.status})`);
        }
        const text = await response.text();
        return parseM3uPlaylist(text, url);
    }
}


/**
 * M3U 文書をチャンネル一覧に変換する
 * 拡張属性 (group-title, tvg-id, tvg-logo) と、チャンネル名だけの EXTINF の両方を読む
 * @param text M3U 文書
 * @param playlist_url 相対 URL を解決するプレイリストの URL
 * @returns パース済みのプレイリスト
 */
export function parseM3uPlaylist(text: string, playlist_url: string): IM3uPlaylist {
    const channels: IM3uChannel[] = [];
    const used_ids = new Map<string, number>();
    let pending: { name: string; group: string; logo_url: string | null; tvg_id: string | null } | null = null;
    let saw_variant = false;

    // BOM と改行の違いを吸収して、1行ずつ EXTINF とストリーム URL に分ける
    const normalized = text.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    for (const raw_line of normalized.split('\n')) {
        const line = raw_line.trim();
        if (line === '') {
            continue;
        }
        if (line.startsWith('#EXT-X-STREAM-INF')) {
            saw_variant = true;
            continue;
        }
        if (line.startsWith('#EXTINF:')) {
            pending = parseExtinf(line);
            continue;
        }
        if (line.startsWith('#')) {
            continue;
        }

        // EXTINF の次の行が、そのチャンネルの再生 URL
        const info = pending ?? {
            name: '',
            group: '',
            logo_url: null,
            tvg_id: null,
        };
        pending = null;
        const stream_url = resolveStreamUrl(playlist_url, line);
        if (stream_url === null) {
            continue;
        }
        channels.push({
            id: allocateChannelId(used_ids, info.tvg_id, channels.length),
            name: info.name !== '' ? info.name : `Channel ${channels.length + 1}`,
            group: info.group,
            logo_url: info.logo_url,
            stream_url,
            tvg_id: info.tvg_id,
        });
    }

    // チャンネル一覧ではなく、1本の HLS マスタープレイリストだけが渡されたとき
    if (channels.length === 0 && saw_variant === true) {
        channels.push({
            id: 'playlist',
            name: 'Playlist',
            group: '',
            logo_url: null,
            stream_url: playlist_url,
            tvg_id: null,
        });
    }
    if (channels.length === 0) {
        throw new Error(M3U_PLAYLIST_EMPTY_MESSAGE);
    }

    const groups: string[] = [];
    for (const channel of channels) {
        if (groups.includes(channel.group) === false) {
            groups.push(channel.group);
        }
    }
    return {
        channels,
        groups,
    };
}


/**
 * EXTINF 行からチャンネル名と属性を取り出す
 * 属性値の引用符の中にあるカンマは、チャンネル名の区切りにしない
 * @param line #EXTINF で始まる1行
 * @returns チャンネル名と属性
 */
function parseExtinf(line: string): { name: string; group: string; logo_url: string | null; tvg_id: string | null } {
    const body = line.slice('#EXTINF:'.length);
    let in_quote = false;
    let quote_char = '';
    let separator_index = -1;
    for (let index = 0; index < body.length; index++) {
        const char = body[index];
        if ((char === '"' || char === '\'') && (in_quote === false || quote_char === char)) {
            if (in_quote === true) {
                in_quote = false;
                quote_char = '';
            } else {
                in_quote = true;
                quote_char = char;
            }
            continue;
        }
        if (char === ',' && in_quote === false) {
            separator_index = index;
            break;
        }
    }

    const meta = separator_index === -1 ? body : body.slice(0, separator_index);
    const name = separator_index === -1 ? '' : body.slice(separator_index + 1).trim();
    const attributes = parseAttributes(meta);
    const tvg_id = attributes['tvg-id']?.trim() ?? '';
    const tvg_name = attributes['tvg-name']?.trim() ?? '';
    const group = attributes['group-title']?.trim() ?? '';
    return {
        name: name !== '' ? name : tvg_name,
        group,
        logo_url: normalizeLogoUrl(attributes['tvg-logo']),
        tvg_id: tvg_id !== '' ? tvg_id : null,
    };
}


/**
 * EXTINF の属性を名前と値に分ける
 * @param meta チャンネル名より前の属性部分
 * @returns 属性名をキーにした値
 */
function parseAttributes(meta: string): Record<string, string> {
    const attributes: Record<string, string> = {};
    const pattern = /([A-Za-z0-9-]+)=(?:"([^"]*)"|'([^']*)'|([^\s,]+))/g;
    for (const match of meta.matchAll(pattern)) {
        const value = match[2] ?? match[3] ?? match[4] ?? '';
        attributes[match[1]] = value;
    }
    return attributes;
}


/**
 * ロゴ URL として使える値だけを残す
 * パスのないオリジンだけの URL は、ロゴ画像ではないので表示しない
 * @param url tvg-logo の値
 * @returns 表示に使う URL。使えないときは null
 */
function normalizeLogoUrl(url: string | undefined): string | null {
    if (url === undefined) {
        return null;
    }
    const trimmed = url.trim();
    if (trimmed === '') {
        return null;
    }
    try {
        const parsed = new URL(trimmed);
        if (parsed.pathname === '/' || parsed.pathname === '') {
            return null;
        }
    } catch {
        return null;
    }
    return trimmed;
}


/**
 * ストリーム URL を絶対 URL にする
 * @param playlist_url プレイリストの URL
 * @param value EXTINF の次の行
 * @returns 絶対 URL。解決できないときは null
 */
function resolveStreamUrl(playlist_url: string, value: string): string | null {
    try {
        return new URL(value, playlist_url).href;
    } catch {
        return null;
    }
}


/**
 * チャンネル ID をプレイリスト内で一意にする
 * @param used_ids すでに使った ID と、その回数
 * @param tvg_id XMLTV のチャンネル ID
 * @param index 0 から数えたチャンネルの位置
 * @returns 一意なチャンネル ID
 */
function allocateChannelId(used_ids: Map<string, number>, tvg_id: string | null, index: number): string {
    const base = tvg_id !== null && tvg_id !== '' ? tvg_id : `channel-${index + 1}`;
    const count = used_ids.get(base) ?? 0;
    used_ids.set(base, count + 1);
    if (count === 0) {
        return base;
    }
    return `${base}-${count + 1}`;
}


export default M3uPlaylist;

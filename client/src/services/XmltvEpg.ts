import type { Dayjs } from 'dayjs';

import { translate, type UiLanguage } from '@/locales/messages';
import { ChannelType, ChannelTypePretty, IChannel } from '@/services/Channels';
import { IProgramDefault, ITimeTable, ITimeTableChannel, ITimeTableProgram } from '@/services/Programs';
import useSettingsStore from '@/stores/SettingsStore';
import { dayjs } from '@/utils';


/** URL が未設定のときに送出するエラーメッセージ */
export const XMLTV_EPG_URL_NOT_SET_MESSAGE = 'XMLTV EPG URL is not set.';

/** パース済みの XMLTV 番組表 */
export interface IXmltvGuide {
    channels: IXmltvChannel[];
    // 番組の最も早い開始時刻と最も遅い終了時刻 (JST の ISO 8601)
    earliest: string;
    latest: string;
    channel_types: ChannelTypePretty[];
}

/** 1チャンネル分の XMLTV 番組 */
interface IXmltvChannel {
    channel: IChannel;
    programs: ITimeTableProgram[];
}

// 取得済みの番組表。日付やチャンネル種別を切り替えるたびに XML を取り直さない
// URL を変えたときは、別の番組表として取り直す
let guide_promise: Promise<IXmltvGuide> | null = null;
let cached_url: string | null = null;
let cached_language: UiLanguage | null = null;


/**
 * XMLTV の番組表を取得し、番組表コンポーネントが読める形に変換する
 */
class XmltvEpg {

    /**
     * XMLTV 番組表を取得する
     * 同じページを開いている間は、最初に取得した結果を返す
     * @returns パース済みの番組表
     */
    static async loadGuide(): Promise<IXmltvGuide> {
        const settings = useSettingsStore().settings;
        const url = settings.xmltv_epg_url.trim();
        const language = settings.ui_language;
        // 表示言語が変わったときは、title や desc の lang を取り直す
        if (guide_promise === null || cached_url !== url || cached_language !== language) {
            cached_url = url;
            cached_language = language;
            guide_promise = XmltvEpg.fetchGuide(url, language).catch((error: unknown) => {
                // 失敗した結果を残すと、再読み込みしても同じ失敗が返る
                guide_promise = null;
                cached_url = null;
                cached_language = null;
                throw error;
            });
        }
        return await guide_promise;
    }


    /**
     * 番組表の表示範囲とチャンネル種別に合う番組だけを返す
     * @param guide パース済みの番組表
     * @param start_time 表示開始時刻
     * @param end_time 表示終了時刻
     * @param channel_type 表示するチャンネル種別
     * @returns 番組表 API と同じ形のレスポンス
     */
    static slice(
        guide: IXmltvGuide,
        start_time: Dayjs,
        end_time: Dayjs,
        channel_type: ChannelType,
    ): ITimeTable {
        const channels: ITimeTableChannel[] = [];
        for (const channel of guide.channels) {
            if (channel.channel.type !== channel_type) {
                continue;
            }
            const programs: ITimeTableProgram[] = [];
            for (const program of channel.programs) {
                const program_start = dayjs(program.start_time);
                const program_end = dayjs(program.end_time);
                // 表示範囲に少しでも重なる番組は、セルの上端を範囲外に伸ばすために残す
                if (program_end.isAfter(start_time) && program_start.isBefore(end_time)) {
                    programs.push(program);
                }
            }
            channels.push({
                channel: channel.channel,
                programs,
                subchannels: null,
            });
        }
        return {
            channels,
            date_range: {
                earliest: guide.earliest,
                latest: guide.latest,
            },
        };
    }


    /**
     * XMLTV を取得してチャンネルと番組に分ける
     * @param url 全般設定の XMLTV 番組表の URL
     * @returns パース済みの番組表
     */
    private static async fetchGuide(url: string, language: UiLanguage): Promise<IXmltvGuide> {
        if (url === '') {
            throw new Error(XMLTV_EPG_URL_NOT_SET_MESSAGE);
        }
        const response = await fetch(url);
        if (response.ok === false) {
            throw new Error(`Failed to fetch XMLTV EPG. (HTTP ${response.status})`);
        }
        const xml = await response.text();
        return XmltvEpg.parseGuide(xml, language);
    }


    /**
     * XMLTV 文書を番組表のチャンネル列に変換する
     * 時刻は XML に書かれたオフセットから JST に直す
     * @param xml XMLTV 文書
     * @param language 番組名と説明に使う言語
     * @returns パース済みの番組表
     */
    private static parseGuide(xml: string, language: UiLanguage): IXmltvGuide {
        const document = new DOMParser().parseFromString(xml, 'text/xml');
        if (document.querySelector('parsererror') !== null) {
            throw new Error('XMLTV document is not valid XML.');
        }

        const channels_by_id = new Map<string, IXmltvChannel>();
        const channel_order: string[] = [];
        const channel_elements = document.getElementsByTagName('channel');
        for (let index = 0; index < channel_elements.length; index++) {
            const element = channel_elements[index];
            const channel_id = element.getAttribute('id');
            if (channel_id === null || channel_id === '' || channels_by_id.has(channel_id)) {
                continue;
            }
            const name = XmltvEpg.childText(element, 'display-name', language);
            channels_by_id.set(channel_id, {
                channel: XmltvEpg.createChannel(channel_id, name !== '' ? name : channel_id, 'GR', '0'),
                programs: [],
            });
            channel_order.push(channel_id);
        }

        let earliest_ms = Number.POSITIVE_INFINITY;
        let latest_ms = Number.NEGATIVE_INFINITY;
        let program_index = 0;
        const programme_elements = document.getElementsByTagName('programme');
        for (let index = 0; index < programme_elements.length; index++) {
            const element = programme_elements[index];
            const channel_id = element.getAttribute('channel');
            const start = XmltvEpg.parseXmltvTime(element.getAttribute('start') ?? '');
            const end = XmltvEpg.parseXmltvTime(element.getAttribute('stop') ?? '');
            if (channel_id === null || channel_id === '' || start === null || end === null) {
                continue;
            }
            if (end.valueOf() <= start.valueOf()) {
                continue;
            }

            let channel = channels_by_id.get(channel_id);
            if (channel === undefined) {
                channel = {
                    channel: XmltvEpg.createChannel(channel_id, channel_id, 'GR', '0'),
                    programs: [],
                };
                channels_by_id.set(channel_id, channel);
                channel_order.push(channel_id);
            }

            program_index += 1;
            const title = XmltvEpg.childText(element, 'title', language);
            const description = XmltvEpg.childText(element, 'desc', language);
            const program: ITimeTableProgram = {
                ...IProgramDefault,
                id: `xmltv-${program_index}`,
                channel_id: channel.channel.id,
                event_id: program_index,
                title: title !== '' ? title : translate(language, 'timetable.noProgramInfo'),
                description,
                detail: {},
                start_time: start.format('YYYY-MM-DDTHH:mm:ssZ'),
                end_time: end.format('YYYY-MM-DDTHH:mm:ssZ'),
                duration: end.diff(start, 'second'),
                genres: [],
                // XMLTV には映像・音声の詳細がない。既定値のままにすると別の番組の情報に見える
                video_type: null,
                video_codec: null,
                video_resolution: null,
                primary_audio_type: '',
                primary_audio_language: '',
                primary_audio_sampling_rate: '',
                secondary_audio_type: null,
                secondary_audio_language: null,
                secondary_audio_sampling_rate: null,
                reservation: null,
            };
            channel.programs.push(program);

            const start_ms = start.valueOf();
            const end_ms = end.valueOf();
            if (start_ms < earliest_ms) {
                earliest_ms = start_ms;
            }
            if (end_ms > latest_ms) {
                latest_ms = end_ms;
            }
        }

        if (channel_order.length === 0 || Number.isFinite(earliest_ms) === false) {
            throw new Error('XMLTV document does not contain programmes.');
        }

        // チャンネル ID の接頭辞で種別を分け、種別ごとの並びでチャンネル番号を振る
        const channels: IXmltvChannel[] = [];
        const count_by_type = new Map<ChannelType, number>();
        for (const channel_id of channel_order) {
            const channel = channels_by_id.get(channel_id);
            if (channel === undefined) {
                continue;
            }
            const channel_type = XmltvEpg.classifyChannel(channel_id);
            const channel_number = (count_by_type.get(channel_type) ?? 0) + 1;
            count_by_type.set(channel_type, channel_number);
            channel.channel.type = channel_type;
            channel.channel.channel_number = String(channel_number);
            channel.programs.sort((a, b) => dayjs(a.start_time).valueOf() - dayjs(b.start_time).valueOf());
            channels.push(channel);
        }

        const channel_types: ChannelTypePretty[] = [];
        const pretty_by_type: { type: ChannelType; pretty: ChannelTypePretty }[] = [
            { type: 'GR', pretty: '地デジ' },
            { type: 'BS', pretty: 'BS' },
            { type: 'CS', pretty: 'CS' },
            { type: 'SKY', pretty: 'SKY' },
            { type: 'BS4K', pretty: 'BS4K' },
        ];
        for (const item of pretty_by_type) {
            if ((count_by_type.get(item.type) ?? 0) > 0) {
                channel_types.push(item.pretty);
            }
        }

        return {
            channels,
            earliest: dayjs(earliest_ms).format('YYYY-MM-DDTHH:mm:ssZ'),
            latest: dayjs(latest_ms).format('YYYY-MM-DDTHH:mm:ssZ'),
            channel_types,
        };
    }


    /**
     * XMLTV のチャンネル ID を番組表のチャンネル種別に対応させる
     * 接頭辞で判別できないチャンネルは SKY にまとめ、一覧から漏れないようにする
     * @param channel_id XMLTV の channel id
     * @returns チャンネル種別
     */
    private static classifyChannel(channel_id: string): ChannelType {
        if (channel_id === 'bs01') {
            return 'BS4K';
        }
        if (
            channel_id.startsWith('gd') ||
            channel_id.startsWith('gx') ||
            channel_id === 'tokyo_mx2' ||
            channel_id === 'kbs'
        ) {
            return 'GR';
        }
        if (
            channel_id.startsWith('bs') ||
            channel_id.startsWith('nhk_bs') ||
            channel_id.startsWith('wowow') ||
            channel_id === 'dlife'
        ) {
            return 'BS';
        }
        if (channel_id.startsWith('cs') || channel_id.startsWith('jp')) {
            return 'CS';
        }
        return 'SKY';
    }


    /**
     * XMLTV のチャンネルを番組表のチャンネル情報に変換する
     * @param channel_id XMLTV の channel id
     * @param name 表示名
     * @param type チャンネル種別
     * @param channel_number 種別の中での番号
     * @returns チャンネル情報
     */
    private static createChannel(
        channel_id: string,
        name: string,
        type: ChannelType,
        channel_number: string,
    ): IChannel {
        return {
            id: `xmltv:${channel_id}`,
            display_channel_id: `xmltv:${channel_id}`,
            network_id: 0,
            service_id: 0,
            transport_stream_id: null,
            remocon_id: 0,
            channel_number,
            type,
            name,
            terrestrial_regions: null,
            jikkyo_force: null,
            is_subchannel: false,
            is_radiochannel: false,
            is_watchable: false,
        };
    }


    /**
     * XMLTV の時刻を JST の日時に変換する
     * 形式は YYYYMMDDHHmmss と、末尾の +0100 のようなオフセット
     * @param value XMLTV の start または stop
     * @returns 変換できた日時。形式が違うときは null
     */
    private static parseXmltvTime(value: string): Dayjs | null {
        const matched = /^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})?(?:\s*([+-]\d{4}|Z))?$/.exec(value.trim());
        if (matched === null) {
            return null;
        }
        const year = matched[1];
        const month = matched[2];
        const day = matched[3];
        const hour = matched[4];
        const minute = matched[5];
        const second = matched[6] ?? '00';
        const timezone = matched[7] ?? '+0000';
        let offset = '+00:00';
        if (timezone !== 'Z') {
            offset = `${timezone.slice(0, 3)}:${timezone.slice(3)}`;
        }
        const parsed = dayjs(`${year}-${month}-${day}T${hour}:${minute}:${second}${offset}`);
        if (parsed.isValid() === false) {
            return null;
        }
        return parsed;
    }


    /**
     * 直下の子要素から、指定したタグのテキストを取る
     * 同じタグが言語違いで並ぶときは、表示言語の lang を優先する
     * lang が付いていない要素は、希望する言語が無いときの候補にする
     * @param parent 親要素
     * @param tag_name タグ名
     * @param language 表示言語
     * @returns テキスト。要素がなければ空文字
     */
    private static childText(parent: Element, tag_name: string, language: UiLanguage): string {
        const preferred = language === 'English' ? ['en', 'eng'] : ['ja', 'jp', 'jpn'];
        const children = parent.children;
        let fallback_without_lang = '';
        let fallback_first = '';
        for (let index = 0; index < children.length; index++) {
            const child = children[index];
            if (child.tagName !== tag_name) {
                continue;
            }
            const text = (child.textContent ?? '').trim();
            if (text === '') {
                continue;
            }
            if (fallback_first === '') {
                fallback_first = text;
            }
            const lang = (child.getAttribute('lang') ?? '').trim().toLowerCase();
            if (lang === '') {
                if (fallback_without_lang === '') {
                    fallback_without_lang = text;
                }
                continue;
            }
            const primary = lang.split('-')[0];
            if (preferred.includes(primary) || preferred.includes(lang)) {
                return text;
            }
        }
        if (fallback_without_lang !== '') {
            return fallback_without_lang;
        }
        return fallback_first;
    }
}

export default XmltvEpg;

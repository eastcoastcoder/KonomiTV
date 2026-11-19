<template>
    <div class="playlist">
        <SPHeaderBar />
        <div class="playlist__status" v-if="url_missing">
            <p>{{ t('playlist.urlMissing') }}</p>
            <router-link class="playlist__action" to="/settings/general">{{ t('playlist.openSettings') }}</router-link>
        </div>
        <div class="playlist__status" v-else-if="load_failed">
            <p>{{ t('playlist.loadFailed') }}</p>
            <button class="playlist__action" type="button" @click="reload">{{ t('playlist.reload') }}</button>
        </div>
        <div class="playlist__status" v-else-if="is_loading">
            <p>{{ t('playlist.loading') }}</p>
        </div>
        <template v-else>
            <div class="playlist__toolbar">
                <input class="playlist__search" type="search" enterkeyhint="search"
                    :placeholder="t('playlist.searchPlaceholder')"
                    v-model="query">
            </div>
            <div class="playlist__tabs" v-if="query.trim() === '' && groups.length > 1">
                <button class="playlist__tab" type="button"
                    v-for="group in groups" :key="group"
                    :class="{'playlist__tab--active': group === active_group}"
                    @click="active_group = group">
                    {{ groupLabel(group) }}
                </button>
            </div>
            <div class="playlist__empty" v-if="visible_channels.length === 0">
                <p>{{ t('playlist.empty') }}</p>
                <button class="playlist__action" type="button" v-if="query.trim() !== ''" @click="query = ''">
                    {{ t('playlist.clearFilter') }}
                </button>
            </div>
            <div class="playlist__channels" v-else>
                <router-link class="playlist__channel" draggable="false"
                    v-for="channel in visible_channels" :key="channel.id"
                    :to="`/tv/playlist/watch/${encodeURIComponent(channel.id)}`">
                    <img class="playlist__logo" v-if="channel.logo_url !== null" alt=""
                        :src="channel.logo_url" @error="hideLogo">
                    <span class="playlist__logo playlist__logo--empty" v-else></span>
                    <span class="playlist__name">{{ channel.name }}</span>
                    <span class="playlist__group" v-if="query.trim() !== ''">{{ groupLabel(channel.group) }}</span>
                </router-link>
            </div>
        </template>
    </div>
</template>
<script lang="ts" setup>

import { computed, onMounted, ref, watch } from 'vue';

import SPHeaderBar from '@/components/SPHeaderBar.vue';
import { translate, type MessageKey } from '@/locales/messages';
import Message from '@/message';
import M3uPlaylist, { M3U_PLAYLIST_URL_NOT_SET_MESSAGE, type IM3uChannel } from '@/services/M3uPlaylist';
import useSettingsStore from '@/stores/SettingsStore';


// 一覧に戻ったとき、選んでいたグループと検索語を残す
let remembered_group = '';
let remembered_query = '';

const settingsStore = useSettingsStore();
const is_loading = ref(true);
const load_failed = ref(false);
const channels = ref<IM3uChannel[]>([]);
const groups = ref<string[]>([]);
const active_group = ref(remembered_group);
const query = ref(remembered_query);

const url_missing = computed(() => settingsStore.settings.m3u_playlist_url.trim() === '');

const visible_channels = computed(() => {
    const keyword = query.value.trim().toLocaleLowerCase();
    const result: IM3uChannel[] = [];
    for (const channel of channels.value) {
        if (keyword === '' && channel.group !== active_group.value) {
            continue;
        }
        if (keyword !== '') {
            const haystack = `${channel.name} ${channel.group} ${channel.tvg_id ?? ''}`.toLocaleLowerCase();
            if (haystack.includes(keyword) === false) {
                continue;
            }
        }
        result.push(channel);
    }
    return result;
});

watch(active_group, (group) => {
    remembered_group = group;
});
watch(query, (value) => {
    remembered_query = value;
});

onMounted(() => {
    void load();
});

/**
 * 表示言語の文言を返す
 * @param key 文言のキー
 * @returns 現在の表示言語の文言
 */
function t(key: MessageKey): string {
    return translate(settingsStore.settings.ui_language, key);
}

/**
 * グループ名を表示する
 * プレイリストがグループを指定していないチャンネルは「その他」にまとめる
 * @param group group-title
 * @returns 画面に出すグループ名
 */
function groupLabel(group: string): string {
    if (group === '') {
        return t('playlist.otherGroup');
    }
    return group;
}

/**
 * 読み込めなかったロゴを空の枠に置き換える
 * @param event 画像の error イベント
 */
function hideLogo(event: Event): void {
    const image = event.target;
    if (image instanceof HTMLImageElement) {
        image.style.visibility = 'hidden';
    }
}

/**
 * プレイリストを取得してグループを揃える
 */
async function load(): Promise<void> {
    if (url_missing.value === true) {
        is_loading.value = false;
        load_failed.value = false;
        Message.error(t('playlist.urlMissingSnackbar'));
        return;
    }
    is_loading.value = true;
    load_failed.value = false;
    try {
        const playlist = await M3uPlaylist.load();
        channels.value = playlist.channels;
        groups.value = playlist.groups;
        if (groups.value.includes(active_group.value) === false) {
            active_group.value = groups.value[0] ?? '';
        }
        is_loading.value = false;
    } catch (error) {
        is_loading.value = false;
        load_failed.value = true;
        console.error('Failed to load M3U playlist:', error);
        if (error instanceof Error && error.message === M3U_PLAYLIST_URL_NOT_SET_MESSAGE) {
            Message.error(t('playlist.urlMissingSnackbar'));
        }
    }
}

/**
 * 取得済みのプレイリストを捨てて、もう一度取得する
 */
function reload(): void {
    M3uPlaylist.clearCache();
    void load();
}

</script>
<style lang="scss" scoped>

.playlist {
    display: flex;
    flex-direction: column;
    width: 100%;
    min-width: 0;
    margin-left: 21px;
    margin-right: 21px;
    padding-bottom: 24px;
    @include smartphone-vertical {
        margin-left: 12px;
        margin-right: 12px;
    }

    &__toolbar {
        position: sticky;
        top: 65px;
        z-index: 4;
        padding: 12px 0 8px;
        background: rgb(var(--v-theme-background));
        @include smartphone-horizontal {
            top: 48px;
        }
        @include smartphone-vertical {
            top: 48px;
        }
    }

    &__search {
        width: 100%;
        height: 40px;
        padding: 0 14px;
        border: 1px solid rgb(var(--v-theme-background-lighten-2));
        border-radius: 8px;
        background: rgb(var(--v-theme-background-lighten-1));
        color: rgb(var(--v-theme-text));
        font-size: 15px;
        outline: none;

        &:focus {
            border-color: rgb(var(--v-theme-primary));
        }
    }

    &__tabs {
        display: flex;
        gap: 8px;
        overflow-x: auto;
        padding-bottom: 12px;
        user-select: none;
    }

    &__tab {
        flex: none;
        height: 36px;
        padding: 0 14px;
        border-radius: 18px;
        background: rgb(var(--v-theme-background-lighten-1));
        color: rgb(var(--v-theme-text));
        font-size: 14px;
        font-weight: 600;
        white-space: nowrap;

        &--active {
            background: rgb(var(--v-theme-primary));
            color: rgb(var(--v-theme-text));
        }
    }

    &__channels {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 8px;
        @include smartphone-vertical {
            grid-template-columns: 1fr;
        }
        @include smartphone-vertical-short {
            gap: 6px;
        }
    }

    &__channel {
        display: flex;
        align-items: center;
        min-width: 0;
        min-height: 56px;
        padding: 8px 12px;
        border-radius: 8px;
        background: rgb(var(--v-theme-background-lighten-1));
        color: rgb(var(--v-theme-text));
        text-decoration: none;
        user-select: none;
        @include smartphone-horizontal {
            min-height: 48px;
        }
    }

    &__logo {
        flex: none;
        width: 40px;
        height: 40px;
        margin-right: 12px;
        object-fit: contain;
        @include smartphone-vertical-short {
            width: 32px;
            height: 32px;
            margin-right: 8px;
        }

        &--empty {
            border-radius: 4px;
            background: rgb(var(--v-theme-background-lighten-2));
        }
    }

    &__name {
        min-width: 0;
        overflow: hidden;
        font-size: 15px;
        font-weight: 700;
        text-overflow: ellipsis;
        white-space: nowrap;
        @include smartphone-vertical-short {
            font-size: 14px;
        }
    }

    &__group {
        flex: none;
        margin-left: 8px;
        color: rgb(var(--v-theme-text-darken-1));
        font-size: 12px;
        white-space: nowrap;
    }

    &__status,
    &__empty {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        margin-top: 28px;
        color: rgb(var(--v-theme-text));
        line-height: 1.6;

        p {
            margin: 0;
        }
    }

    &__action {
        display: inline-flex;
        align-items: center;
        height: 36px;
        margin-top: 12px;
        padding: 0 14px;
        border-radius: 8px;
        background: rgb(var(--v-theme-background-lighten-2));
        color: rgb(var(--v-theme-text));
        font-weight: 600;
        text-decoration: none;
    }
}

</style>

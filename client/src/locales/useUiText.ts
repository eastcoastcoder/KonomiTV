import { computed } from 'vue';

import { translate, type MessageKey, type UiLanguage } from '@/locales/messages';
import useSettingsStore from '@/stores/SettingsStore';


/**
 * 設定の表示言語で文言を引く
 * テンプレートから t() を呼ぶと、言語の変更で再描画される
 */
export function useUiText() {
    const settingsStore = useSettingsStore();
    const language = computed<UiLanguage>(() => settingsStore.settings.ui_language);

    function t(key: MessageKey): string {
        return translate(language.value, key);
    }

    return {
        language,
        t,
    };
}

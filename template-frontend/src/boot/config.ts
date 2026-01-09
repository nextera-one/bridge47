import { defineBoot } from '@quasar/app-vite/wrappers';
import type { RouteLocationNormalizedLoaded, Router } from 'vue-router';
import type { DateLocale, QNotifyCreateOptions, QVueGlobals } from 'quasar';
import { date, getCssVar, Platform, Screen, useQuasar } from 'quasar';

import ValidationUtil from 'src/util/ValidationUtil';
import LanguageUtil from 'src/util/LanguageUtil';
import SessionUtil from 'src/util/SessionUtil';
import NotifyUtil from 'src/util/NotifyUtil';
import StringUtil from 'src/util/StringUtil';
import { i18n } from './i18n';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $q: QVueGlobals;
    $router: Router;
    $route: RouteLocationNormalizedLoaded;
    $isDate: (date: string) => boolean;
    $toTitleCase: (str: string) => string;
    $isDark: (q?: QVueGlobals) => boolean;
    $toggleDark: (q?: QVueGlobals) => void;
    $getModeBg: (q?: QVueGlobals) => string;
    $getModeText: (q?: QVueGlobals) => string;
    $getModeClasses: (q?: QVueGlobals) => string;
    $isLoggedIn: () => boolean;
    $isMobile: (q?: QVueGlobals) => boolean;
    $isArabic: () => boolean;
    $logout: () => void;
    $getColorHex: (name: string) => string;
    $log: (message?: unknown, ...optionalParams: unknown[]) => void;
    $getNotificationsCount: () => number;
    $openImage: (img: string) => void;
    $format: (dat: Date | number | string, format?: string, locale?: DateLocale) => string;
    $getImageUrl: (path: string) => string;
    $copyToClipboard: (text: string) => void;
    $notify: (options: QNotifyCreateOptions) => void;
    $symbol: (style: 'r' | 's' | 'o', str: string) => string | undefined;
    $icon: (str: string) => string;
  }
}
const openBase64Image = (img: string) => {
  const dataUrl = img && img.startsWith('data:image') ? img : 'data:image/png;base64,' + img;
  const newTab = window.open('', '_blank');
  if (newTab)
    newTab.document.write(
      `<html><body><a href="${dataUrl}" target="_blank"><img src="${dataUrl}" /></a></body></html>`,
    );
};

export default defineBoot(({ app }) => {
  // app.config.globalProperties.$q.loading.setDefaults({
  //   spinner: h(QImg, {
  //     src: 'images/loading.svg',
  //     height: '256px',
  //     width: '256px',
  //     style: 'margin: auto; display: block',
  //   }),
  // });
  // app.config.globalProperties.$q = useQuasar()
  // app.config.globalProperties.$q = Quasar.install(app)
  // console.log(app.config.globalProperties.$q)

  setTimeout(() => {
    // if (app.config.globalProperties.$q && app.config.globalProperties.$q.lang)
    // console.log(app.config.globalProperties.$q)
    app.config.globalProperties.$q.lang.table.recordsPerPage =
      StringUtil.translate('recordsPerPage');
  }, 100);

  app.config.globalProperties.$icon = (icon: string): string => {
    return icon;
  };

  app.config.globalProperties.$symbol = (
    style: 'r' | 's' | 'o',
    icon: string,
  ): string | undefined => {
    if (!icon) return undefined;
    switch (style) {
      case 's':
        return `sym_s_${icon}`;
      case 'r':
        return `sym_r_${icon}`;
      case 'o':
      default:
        return `sym_o_${icon}`;
    }
  };
  app.config.globalProperties.$notify = (options: QNotifyCreateOptions): void => {
    NotifyUtil.default(options);
  };

  app.config.globalProperties.$copyToClipboard = (text: string): void => {
    if (navigator) void navigator.clipboard.writeText(text);
  };

  app.config.globalProperties.$isDate = (date: string): boolean => {
    const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
    return iso8601Regex.test(date);
  };
  app.config.globalProperties.$openImage = (img: string): void => {
    if (img.includes('undefined') || img.includes('no-image')) {
      console.error('Error');
    } else {
      if (img && !img.startsWith('/src')) {
        if (img.startsWith('http')) {
          window.open(img, '_blank');
        } else {
          openBase64Image(img);
        }
      }
    }
  };
  app.config.globalProperties.$format = (
    dat: Date | number | string,
    formt?: string,
    locale?: DateLocale,
  ): string => {
    if (!formt) formt = 'DD/MM/YYYY HH:mm';
    return date.formatDate(dat, formt, locale);
  };

  app.config.globalProperties.$isMobile = (q?: QVueGlobals): boolean => {
    try {
      return Platform.is.mobile || Screen.lt.sm;
    } catch (error) {
      console.error(error);
      const $q = q ? q : useQuasar();
      return $q.platform.is.mobile || $q.screen.lt.sm;
    }
  };
  app.config.globalProperties.$getNotificationsCount = (): number => {
    return 2;
  };
  app.config.globalProperties.$log = (message?: unknown, ...optionalParams: unknown[]): void => {
    console.log(message, optionalParams);
  };
  app.config.globalProperties.$isArabic = (): boolean => {
    return LanguageUtil.isArabic();
  };
  app.config.globalProperties.$toTitleCase = (key: string): string => {
    // 1. Get the actual translated string
    const translated = i18n.global.t(key);

    // 2. If it contains any HTML tags, just return it verbatim
    //    (so you don’t mangle <b>Terms</b>, and avoid the XSS warning)
    const hasHTML = /<("[^"]*"|'[^']*'|[^'">])*>/.test(translated);
    if (hasHTML) {
      return translated;
    }

    // 3. If it’s Arabic, don’t title-case
    if (ValidationUtil.isArabicString(translated)) {
      return translated;
    }

    // 4. If the translation fell back to the key itself, split on caps
    if (translated === key) {
      console.log(translated, ':', "''");
      return key
        .replace(/([A-Z])/g, ' $1') // insert space before capitals
        .replace(/^./, (first) => first.toUpperCase()); // uppercase first letter
    }

    // 5. Otherwise return the translated text as-is
    return translated;
  };

  app.config.globalProperties.$isDark = (q?: QVueGlobals): boolean => {
    const $q = q ? q : useQuasar();
    return $q.dark.isActive;
  };
  app.config.globalProperties.$getModeBg = (q?: QVueGlobals): string => {
    const $q = q ? q : useQuasar();
    return $q.dark.isActive ? 'bg-dark' : 'bg-light';
  };
  app.config.globalProperties.$getModeText = (q?: QVueGlobals): string => {
    const $q = q ? q : useQuasar();
    return $q.dark.isActive ? 'text-yellow-7' : 'text-light';
  };
  app.config.globalProperties.$getModeClasses = (q?: QVueGlobals): string => {
    const $q = q ? q : useQuasar();
    return $q.dark.isActive ? 'bg-dark text-light' : 'bg-light text-dark';
  };
  app.config.globalProperties.$isLoggedIn = (): boolean => {
    return SessionUtil.isLoggedIn();
  };
  app.config.globalProperties.$logout = (): void => {
    SessionUtil.logout();
  };
  app.config.globalProperties.$getColorHex = (name: string): string => {
    return getCssVar(name) || '#ffffff';
  };
});

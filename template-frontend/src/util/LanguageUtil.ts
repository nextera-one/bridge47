import SessionUtil from './SessionUtil';
import { i18n } from 'src/boot/i18n';

export default class LanguageUtil {
  public static isArabic = () => {
    return (
      SessionUtil.getLang()?.startsWith('ar') ||
      i18n.global.locale.value.toString().startsWith('ar')
    );
  };

  public static setLang = (lang: 'ar-SA' | 'en-US') => {
    SessionUtil.setLang(lang);
    LanguageUtil.applyLang();
  };

  public static toggleLang = () => {
    let lang = 'en-US';
    if (i18n.global.locale.value === 'en-US') {
      lang = 'ar-SA';
    }
    SessionUtil.setLang(lang);
    LanguageUtil.applyLang();
  };

  //apply saved language
  public static applyLang = () => {
    try {
      i18n.global.locale.value = SessionUtil.getLang() as typeof i18n.global.locale.value;
      if (!window || !window.document) return;
      const headChildren = document?.getElementsByTagName('head')[0]?.children as HTMLCollection;
      const l = headChildren ? headChildren.length : 0;
      for (let i = 0; i < l; i++) {
        if (
          headChildren &&
          headChildren[i] &&
          headChildren[i]?.tagName &&
          headChildren[i]?.tagName.toLowerCase() === 'style'
        ) {
          if (
            headChildren[i]?.attributes.getNamedItem('lang') &&
            headChildren[i]?.attributes.getNamedItem('lang')?.value === 'true'
          ) {
            // console.log(headChildren[i].attributes.getNamedItem("lang"));
            headChildren[i]?.remove();
          }
        }
      }

      const arFont = "'Tajawal','Roboto', 'Inter', 'Be Vietnam', sans-serif !important;";
      const enFont = "'Roboto','Inter','Tajawal', 'Be Vietnam',  sans-serif !important;";
      const style = document.createElement('style');
      style.setAttribute('lang', 'true');
      style.innerHTML = `* {
        font-family: ${SessionUtil.getLang() === 'ar-SA' ? arFont : enFont};
         direction: ${SessionUtil.getLang() === 'ar-SA' ? 'rtl' : 'ltr'};
         font-size: 14px;
      }
        `;
      if (document?.getElementsByTagName('head').length > 0) {
        document?.getElementsByTagName('head')[0]?.appendChild(style);
      }
      document.documentElement.style.setProperty(
        '--background-position',
        LanguageUtil.isArabic() ? 'right bottom' : 'left bottom',
      );
    } catch (error) {
      console.error(error);
    }
  };
}

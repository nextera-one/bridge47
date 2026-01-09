import { Cookies, Loading, LocalStorage } from 'quasar';

import type DataObject from '../models/DataObject';
import RoutesPaths from '../router/RoutesPaths';
import NotifyUtil from './NotifyUtil';
import ApiUtil from './ApiUtil';
import StringUtil from './StringUtil';
import { router } from 'src/router';
export default class SessionUtil {
  private static readonly TOKEN = 'token';
  private static readonly TOKEN_AT = 'token_at';
  private static readonly DATA = 'data';
  private static readonly SESSION_ID = 'seesionId';
  private static readonly ZONE = 'zone';
  private static readonly USER_INFO = 'user';

  public static setZone(zone: string): void {
    LocalStorage.set(SessionUtil.ZONE, zone);
  }

  public static getZone(): string | null {
    return LocalStorage.getItem(SessionUtil.ZONE) as string;
  }

  public static saveUserInfo(userInfo: string): void {
    LocalStorage.set(SessionUtil.USER_INFO, userInfo);
  }

  public static getUserInfo(): string {
    return LocalStorage.getItem(SessionUtil.USER_INFO) as string;
  }

  public static isLoggedIn(): boolean {
    // if (SessionUtil.getRole() == 'ANONYMOUS_USER') {
    //   return false;
    // }
    const tokenAtRaw = LocalStorage.getItem(SessionUtil.TOKEN_AT);
    const tokenAt = typeof tokenAtRaw === 'string' ? tokenAtRaw : undefined;
    if (!tokenAt) {
      return false;
    }
    //add 24 hour
    const token = new Date(parseInt(tokenAt) + 3_600_000 * 24 * 30);
    if (token < new Date()) {
      return false;
    }
    return !!LocalStorage.getItem(SessionUtil.TOKEN);
  }

  public static login(data: DataObject): void {
    SessionUtil.setTokenAt(`${new Date().getTime()}`);
    SessionUtil.setToken((data.access_token || data.accessToken) as string);
    SessionUtil.setData(data);
    if (data.remember) {
      Cookies.set('saved_email', data.email as string);
    } else {
      Cookies.remove('saved_email');
    }
  }

  public static setToken(token: string): void {
    LocalStorage.set(SessionUtil.TOKEN, token);
  }

  public static setTokenAt(tokenAt: string): void {
    LocalStorage.set(SessionUtil.TOKEN_AT, tokenAt);
  }

  public static async logout() {
    Loading.show();
    try {
      if (SessionUtil.getToken()) {
        await ApiUtil.post('auth/logout');
        NotifyUtil.success({
          message: StringUtil.translate('loggedOut'),
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      Loading.hide();
      LocalStorage.remove(SessionUtil.TOKEN);
      LocalStorage.remove(SessionUtil.DATA);
      LocalStorage.remove('cookieFallback');
      LocalStorage.remove('content');
      LocalStorage.remove(SessionUtil.TOKEN_AT);
      if (window && ['', '/'].includes((window as Window).location.pathname)) {
        router.go(0);
      } else {
        void router.replace(RoutesPaths.HOME);
      }
    }
    // NotificationsEventBus.logout();
  }
  public static getToken(): string | undefined {
    return LocalStorage.getItem(SessionUtil.TOKEN) as string | undefined;
  }
  public static setLang(lang: string): void {
    LocalStorage.set('lang', lang);
  }

  public static getLang(): string | null {
    if (navigator) {
      const language = navigator?.language || 'en-US';
      return LocalStorage.getItem('lang') || (language.startsWith('ar') ? 'ar-SA' : 'en-US');
    } else {
      return 'en-US';
    }
  }

  public static getUserFullName(): string | undefined {
    if (SessionUtil.getMetaData()) {
      return SessionUtil.getMetaData().first_name && SessionUtil.getMetaData().last_name
        ? `${SessionUtil.getMetaData().first_name as string} ${SessionUtil.getMetaData().last_name as string}`
        : (SessionUtil.getMetaData().email as string);
    }
    return undefined;
  }

  //first car from firstName and first char from lastName
  public static getInitials(): string {
    if (SessionUtil.getMetaData()) {
      return `${(SessionUtil.getMetaData().firstName as string)?.charAt(0)}${(SessionUtil.getMetaData().lastName as string)?.charAt(0)}`;
    }
    return '';
  }

  public static getUserEmail(): string | undefined {
    return SessionUtil.getMetaData()?.email as string;
  }

  // public static saveContent(res: Array<GetContentModel>) {
  //   LocalStorage.set('content', res);
  // }

  public static removeContent() {
    LocalStorage.remove('content');
  }

  // public static getContent(): Array<GetContentModel> | null {
  //   return LocalStorage.getItem('content');
  // }

  public static getUserId(): string | null | undefined {
    const metadata = SessionUtil.getMetaData();
    return (metadata?.id || null) as string;
  }

  public static getMetaData(): DataObject {
    const data = SessionUtil.getData() || {};
    return (data.metadata || {}) as DataObject;
  }

  public static getData(): DataObject | null {
    const data = LocalStorage.getItem(SessionUtil.DATA);
    if (data && Object.keys(data).length > 0 && typeof data === 'string') return JSON.parse(data);
    return null;
  }

  public static setData(data: DataObject) {
    LocalStorage.set(SessionUtil.DATA, data);
  }

  public static getUserProfileImage() {
    return SessionUtil.getMetaData()?.profileImage || 'images/user.png';
  }

  public static getRole() {
    return SessionUtil.getMetaData()?.role || 'ANONYMOUS_USER';
  }

  public static isAdmin(): boolean {
    return ['SUPER_ADMIN', 'ADMIN'].includes(SessionUtil.getRole() as string);
  }

  // public static isVerified() {
  //   const data = SessionUtil.getData() as DataObject;
  //   return data?.aadata?.isVerified;
  // }

  public static setUserVerified(verified: boolean) {
    if (SessionUtil.isLoggedIn()) {
      const data = SessionUtil.getData() as DataObject;
      if (SessionUtil.getMetaData()) {
        SessionUtil.getMetaData().isVerified = verified;
      }
      SessionUtil.setData(data);
    }
  }

  public static getDeviceId() {
    return (
      (LocalStorage.getItem('fcmtoken') || SessionUtil.getMetaData()?.deviceId) ??
      StringUtil.uuidv4()
    );
  }

  public static setDeviceId(deviceId: string) {
    LocalStorage.set('fcmtoken', deviceId);
    if (SessionUtil.isLoggedIn()) {
      const data = SessionUtil.getData() as DataObject;
      if (SessionUtil.getMetaData()?.deviceId) SessionUtil.getMetaData().deviceId = deviceId;
      SessionUtil.setData(data);
    }
  }

  public static getSessionId(): string | null {
    return LocalStorage.getItem(SessionUtil.SESSION_ID);
  }

  public static setSessionId(sessionId: string) {
    LocalStorage.set(SessionUtil.SESSION_ID, sessionId);
  }
  public static setMetadata(metadata: DataObject) {
    const data = SessionUtil.getData() as DataObject;
    if (!SessionUtil.getMetaData()) data.metadata = {};

    data.metadata = { ...SessionUtil.getMetaData(), ...metadata };
    SessionUtil.setData(data);
  }
}

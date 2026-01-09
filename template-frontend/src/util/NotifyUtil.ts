import type { QNotifyCreateOptions } from 'quasar';
import { Notify } from 'quasar';

import StringUtil from './StringUtil';

export default class NotifyUtil {
  public static notify(options: QNotifyCreateOptions) {
    Notify.create({
      progress: true,
      position: 'top',
      message: options && options.message ? options.message : StringUtil.translate(''),
      color: options.color || 'primary',
      multiLine: true,
      html: true,
      icon: options.icon || 'check',
      timeout: 3000,
      // actions: [
      //   {
      //     label: StringUtil.translate('close'),
      //     color: 'white',
      //     handler: () => {
      //       /* ... */
      //     },
      //   },
      // ],
    });
  }

  public static success = (options: QNotifyCreateOptions) => {
    NotifyUtil.notify({
      message: options && options.message ? options.message : StringUtil.translate('success'),
      color: 'positive',
      icon: 'check',
    });
  };

  public static error = (options: QNotifyCreateOptions) => {
    NotifyUtil.notify({
      message: options && options.message ? options.message : StringUtil.translate('error'),
      color: 'negative',
      icon: 'report',
    });
  };

  //info
  public static info = (options: QNotifyCreateOptions) => {
    NotifyUtil.notify({
      message: options && options.message ? options.message : StringUtil.translate('info'),
      color: 'info',
      icon: 'info',
    });
  };

  //warning
  public static warning = (options: QNotifyCreateOptions) => {
    NotifyUtil.notify({
      message: options && options.message ? options.message : StringUtil.translate('warning'),
      color: 'warning',
      icon: 'warning',
    });
  };

  // default
  public static default = (options: QNotifyCreateOptions) => {
    NotifyUtil.notify({
      message: options && options.message ? options.message : StringUtil.translate('default'),
      color: options && options.color ? options.color : 'dark',
      classes: 'full-width',
      html: true,
      multiLine: true,
      icon: options.icon ? options.icon : 'help',
    });
  };
}

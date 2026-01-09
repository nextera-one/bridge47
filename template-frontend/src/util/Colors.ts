import { setCssVar } from 'quasar';

export default class Colors {
  public static switch(isActive: boolean) {
    if (isActive) {
      setCssVar('primary', Colors.PRIMARY_1);
      setCssVar('secondary', Colors.PRIMARY_2);
    } else {
      setCssVar('primary', Colors.PRIMARY_2);
      setCssVar('secondary', Colors.PRIMARY_1);
    }
  }
  public static readonly PRIMARY_1 = '#FF4D49';
  public static readonly PRIMARY_2 = '#38BCE4';

  public static getColorFromClass = (className: string): string => {
    const el = document.createElement('div');
    el.style.position = 'absolute';
    el.style.visibility = 'hidden';
    el.style.pointerEvents = 'none';
    el.className = className.replace(/^\./, '');
    document.body.appendChild(el);
    const color = getComputedStyle(el).color;
    document.body.removeChild(el);
    return color;
  };
}

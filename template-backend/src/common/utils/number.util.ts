export default class NumberUtil {
  //random number between min and max
  public static randomIntFromInterval(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  //random number between min 1 and max
  public static randomIntFromInterval1ToMax(max: number): number {
    return NumberUtil.randomIntFromInterval(1, max);
  }
}

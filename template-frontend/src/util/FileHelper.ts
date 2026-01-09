// import ExportCarFunc from 'src/functions/car/ExportCarFunc';
// import ExportInvoiceFunc from 'src/functions/invoice/ExportInvoiceFunc';
// import ExportReservationFunc from 'src/functions/reservation/ExportReservationFunc';
// import ExportUserFunc from 'src/functions/user/ExportUserFunc';
// import DataObject from 'src/models/DataObject';
// import ApiPath from './ApiPath';

export default class FileHelper {
  // public static export = async (path: string, data?: DataObject) => {
  public static export = (path: string) => {
    switch (path) {
      // case ApiPath.CAR:
      //   return await new ExportCarFunc().executeAsync(data);
      // case ApiPath.RESERVATIONS:
      //   return await new ExportReservationFunc().executeAsync(data);
      // case ApiPath.USER:
      //   return await new ExportUserFunc().executeAsync(data);
      // case ApiPath.INVOICES:
      //   return await new ExportInvoiceFunc().executeAsync(data);
      default:
        return null;
    }
  };
}

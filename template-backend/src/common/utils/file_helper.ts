import * as fastCsv from 'fast-csv';
import * as fs from 'fs';

export default class FileHelper {
  private static TEMPLATES = {} as Record<string, string>;

  public static readAsBase64(p: string) {
    // replace with your image path
    const imageContent = fs.readFileSync(p, { encoding: 'base64' });
    return imageContent;
  }

  public static readTemplateFile(fileName: string): string {
    if (FileHelper.TEMPLATES[fileName]) {
      return FileHelper.TEMPLATES[fileName] as string;
    }
    const template = fs.readFileSync(fileName, 'utf-8');
    FileHelper.TEMPLATES[fileName] = template;
    return template;
  }

  // Function to convert object to CSV format
  public static convertObjToCSV(
    data: Record<string, any>[],
    filteredHeaders?: string[],
    headerRenameMap: Record<string, string> = {},
  ): string {
    const renamedHeaders = filteredHeaders.map(
      (header) => headerRenameMap[header] || header,
    );

    const headers = filteredHeaders ? filteredHeaders : Object.keys(data[0]);
    const csvContent = data.map((item) =>
      headers.map((header) => {
        // Handling special characters or commas in the field values
        let value = item[header];
        if (typeof value === 'string' && value.includes(',')) {
          // If a value contains a comma, enclose it in double quotes
          value = `"${value}"`;
        }
        return value;
      }),
    );
    const headerRow =
      renamedHeaders.length > 0 ? renamedHeaders.join(',') : headers.join(',');
    const csvRows = [headerRow, ...csvContent.map((row) => row.join(','))];
    return csvRows.join('\n');
  }

  // Function to generate and save CSV file
  public static async generateAndSaveCSV(
    data: Record<string, any>[],
    filename: string,
    filteredHeaders?: string[],
    headerRenameMap: Record<string, string> = {},
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        //check if there filter for the header
        let orderedData = [];
        if (filteredHeaders && filteredHeaders.length > 0) {
          orderedData = data.map((item) => {
            // Create an ordered item based on filteredHeaders
            const orderedItem = {};
            filteredHeaders.forEach((header) => {
              orderedItem[header] = item[header] ?? '';
            });
            return orderedItem;
          });
        } else {
          orderedData = data;
        }
        const csvData = this.convertObjToCSV(
          orderedData,
          filteredHeaders,
          headerRenameMap,
        );

        const csvStream = fastCsv.format({ headers: true });
        const writableStream = fs.createWriteStream(`uploads/${filename}.csv`);

        csvStream.pipe(writableStream);

        writableStream.write(csvData + '\n');

        csvStream.end();
        writableStream.on('finish', () => {
          resolve(writableStream);
        });
      } catch (error) {
        console.error('Error generating and saving CSV:', error);
        reject(error); // Reject the promise if there's an error
      }
    });
  }
}

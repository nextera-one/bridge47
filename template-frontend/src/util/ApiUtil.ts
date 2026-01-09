import { api } from 'boot/axios';
import { ClientJS } from 'clientjs';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';

import type DataObject from 'src/models/DataObject';
import LanguageUtil from './LanguageUtil';
import SessionUtil from './SessionUtil';

const processEnv = import.meta.env;
// const router = useRouter()
// Define a type that represents possible API errors
export type ApiError = unknown;

// Create an Axios interceptor to handle API errors globally
// axios.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error: AxiosError) => {
//     NotifyUtil.error({
//       message: `${`${
//         ((error.response?.data as DataObject)?.message as string) || JSON.stringify(error.message)
//       }`
//         .replaceAll('()', '')
//         .replace('Network Error', StringUtil.translate('checkYourInternetConnection'))} `,
//     });
//     //check if error 401 and redirect to login
//     if (
//       error.response?.status === 401 ||
//       error.code?.includes('401') ||
//       error.message.includes('401')
//     ) {
//       if (!error.request.responseURL.includes('logout')) SessionUtil.logout();
//     }
//     // check if error 426 and redirect to download latest version
//     // if (
//     //   error.response?.status === 426 ||
//     //   error.code?.includes('426') ||
//     //   error.message.includes('426')
//     // ) {
//     //   router.replace(RoutesPaths.DOWNLOAD_USER)
//     // }
//     //429
//     if (
//       error.response?.status === 429 ||
//       error.code?.includes('429') ||
//       error.message.includes('429')
//     ) {
//       return Promise.reject(new Error(StringUtil.translate('tooManyRequests')));
//     }
//     return Promise.reject(new Error(JSON.stringify(error)));
//   },
// );

// Define the ApiUtil class
export default class ApiUtil {
  private static FINGERPRINT: number | null = null;

  /**
   * Generates a complex fingerprint by combining multiple data points.
   */
  public static initializeFingerprint() {
    // Only generate the fingerprint once
    if (ApiUtil.FINGERPRINT === null) {
      const client = new ClientJS();

      // 1. Collect multiple, high-entropy data points
      const canvasPrint = client.getCanvasPrint();
      const screenPrint = client.getScreenPrint();
      const plugins = client.getPlugins().toString(); // Convert array to string
      const fonts = client.getFonts().toString(); // Convert array to string
      const userAgent = client.getUserAgent();

      // 2. Combine all data points to create a single hash
      // The getFingerprint method can accept multiple arguments to hash them together.
      ApiUtil.FINGERPRINT = client.getCustomFingerprint(
        canvasPrint,
        screenPrint,
        plugins,
        fonts,
        userAgent,
      );
    }
  }

  public static getFingerprint(): number | null {
    return ApiUtil.FINGERPRINT;
  }
  // Define the base URL for your API
  private static baseURL = processEnv.VITE_API_URL;

  static async search<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    config = ApiUtil.getDefaultConfig(config);
    try {
      // Make a GET request using Axios
      const response: AxiosResponse<T> = await api.get<T>(`/${endpoint}`, config);
      // Return the response data
      return response.data;
    } catch (error: ApiError) {
      // Handle API errors and throw a custom error
      throw this.handleApiError(error as DataObject);
    }
  }

  // Static method for making GET requests
  static async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    config = ApiUtil.getDefaultConfig(config);
    try {
      // Make a GET request using Axios
      const response: AxiosResponse<T> = await api.get<T>(`/${endpoint}`, config);
      // Return the response data
      return response.data;
    } catch (error: ApiError) {
      // Handle API errors and throw a custom error
      throw this.handleApiError(error as DataObject);
    }
  }

  // Static method for making POST requests
  static async post<T>(
    endpoint: string,
    data?: DataObject,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      config = ApiUtil.getDefaultConfig(config);
      delete data?.id;
      ApiUtil.clearData(data);

      // Make a POST request using Axios
      const response: AxiosResponse<T> = await api.post<T>(`/${endpoint}`, data, config);
      // Return the response data
      return response.data;
    } catch (error: ApiError) {
      console.error('ApiUtil.post.error - ' + JSON.stringify(error));
      throw this.handleApiError(error as DataObject);
    }
  }

  // Static method for making PUT requests
  static async put<T>(
    endpoint: string,
    data?: DataObject,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      config = ApiUtil.getDefaultConfig(config);
      ApiUtil.clearData(data);

      // Make a PUT request using Axios
      const response: AxiosResponse<T> = await api.put<T>(`/${endpoint}`, data, config);
      // Return the response data
      return response.data;
    } catch (error: ApiError) {
      // Handle API errors and throw a custom error
      throw this.handleApiError(error as DataObject);
    }
  }

  // Static method for making PATCH requests
  static async patch<T>(
    endpoint: string,
    data?: DataObject,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      config = ApiUtil.getDefaultConfig(config);
      // Make a PATCH request using Axios
      //delete from data all keys end with Data , ByUser, created_at, updated_at, created_by, updated_by
      ApiUtil.clearData(data);
      const response: AxiosResponse<T> = await api.patch<T>(`/${endpoint}`, data, config);
      // Return the response data
      return response.data;
    } catch (error: ApiError) {
      // Handle API errors and throw a custom error
      throw this.handleApiError(error as DataObject);
    }
  }

  private static clearData(data: DataObject | undefined) {
    if (data)
      Object.keys(data).forEach((key) => {
        if (
          key.endsWith('Data') ||
          key.endsWith('ByUser') ||
          key.endsWith('At') ||
          key.endsWith('By') ||
          key.endsWith('_data') ||
          key.endsWith('_by_user') ||
          key.endsWith('_at') ||
          key.endsWith('_by')
        ) {
          delete data[key];
        }
      });
  }

  // Static method for making DELETE requests
  static async delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      config = ApiUtil.getDefaultConfig(config);
      // Make a DELETE request using Axios
      const response: AxiosResponse<T> = await api.delete<T>(`/${endpoint}`, config);
      // Return the response data
      return response.data;
    } catch (error: ApiError) {
      // Handle API errors and throw a custom error
      throw this.handleApiError(error as DataObject);
    }
  }

  //upload File
  static async upload<T>(
    endpoint: string,
    formData: FormData,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      if (!endpoint.startsWith('upload')) {
        endpoint = `upload/${endpoint}`;
      }
      config = ApiUtil.getDefaultConfig(config);
      //Content-Type: multipart/form-data
      if (!config.headers) {
        config.headers = {};
      }
      config.headers['Content-Type'] = 'multipart/form-data';
      // Make a POST request using Axios
      const response: AxiosResponse<T> = await api.post<T>(`/${endpoint}`, formData, config);
      // Return the response data
      return response.data;
    } catch (error: ApiError) {
      console.error('ApiUtil.upload.error - ' + JSON.stringify(error));
      throw this.handleApiError(error as DataObject);
    }
  }

  //download dile based on type pdf csv

  public static async download(
    endpoint: string,
    filename: string,
    // module: ModulesAdminKey = ModulesAdminKey.HOME,
    config?: AxiosRequestConfig,
    contentType?: string,
  ): Promise<void> {
    try {
      config = ApiUtil.getDefaultConfig(config);

      // Prepare the request configuration to handle binary data
      const responseConfig: AxiosRequestConfig = {
        ...config,
        responseType: 'blob', // Important for dealing with binary data
        responseEncoding: 'binary', // Important for dealing with binary data
        headers: {
          ...config?.headers,
          'Content-Type': 'application/octet-stream',
          // module_name: module,
        },
      };

      // Make the GET request to download the file
      const response: AxiosResponse = await api.get(`/${endpoint}`, responseConfig);

      // Create a URL for the blob
      const blob = new Blob([response.data], {
        type: contentType || 'application/octet-stream',
      });
      const url = window.URL.createObjectURL(blob);
      // Create an anchor element to facilitate downloading
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename); // Set the filename for the download
      document.body.appendChild(link);

      // Programmatically click the anchor to trigger the download
      link.click();

      // Clean up by removing the anchor and revoking the object URL
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download file:', error);
      throw error; // Re-throw the error for further handling
    }
  }

  // Private method for handling API errors
  private static handleApiError(error: DataObject): Error {
    if (error.response) {
      // The request was made, but the server responded with a status code that falls out of the range of 2xx
      return new Error(
        `${(error?.response as DataObject).status as string} - ${(error?.response as DataObject).statusText as string}`,
      );
    } else if (error.request) {
      // The request was made, but no response was received
      return new Error('No response received');
    } else {
      // Something happened in setting up the request that triggered an error
      return new Error(`${error.message as string}`);
    }
  }

  // private static fetchMacAddress = async (): Promise<string | string[] | undefined> => {
  //   try {
  //     let macAddress = await window.electron.getMacAddress()
  //     if (typeof macAddress === 'string') {
  //       macAddress = [macAddress]
  //     }
  //     return macAddress
  //   } catch (error) {
  //     console.error('Failed to get MAC address:', error)
  //   }
  // }

  private static getDefaultConfig(config: AxiosRequestConfig | undefined) {
    if (!config) {
      config = {};
    }
    if (!config.headers) {
      config.headers = {};
    }
    if (SessionUtil.getToken()) {
      config.headers.Authorization = `Bearer ${SessionUtil.getToken()}`;
    }
    if (!config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json';
    }
    ApiUtil.initializeFingerprint();
    config.headers['language'] = LanguageUtil.isArabic() ? 'ar' : 'en';
    config.headers['Accept-Language'] = LanguageUtil.isArabic() ? 'ar' : 'en';
    config.headers['session-id'] = SessionUtil.getSessionId();
    config.headers['app-version'] = processEnv.VITE_APP_VERSION;
    config.headers['X-Fingerprint'] = ApiUtil.FINGERPRINT || 'unknown';
    // config.headers['mac'] = await ApiUtil.fetchMacAddress()
    config.headers['platform'] = 'desktop';

    return config;
  }
}

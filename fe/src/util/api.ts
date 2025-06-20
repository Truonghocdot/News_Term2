import { BASE_URL } from "../../enviroment";

import Cookies from "js-cookie";

const currentToken = Cookies.get("token");
import axios, { AxiosInstance } from "axios";
const timeout = 3000;
export class PostApiService {
  axiosInstance: AxiosInstance;
  constructor() {
    this.axiosInstance = axios.create({
      baseURL: BASE_URL,
      timeout,
    });
  }

  async getDataField(urlPart: String): Promise<any> {
    this.axiosInstance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${currentToken}`;

    try {
      const response = await this.axiosInstance.get(BASE_URL + urlPart);
      return response.data;
    } catch (error) {
      throw new Error(String(error));
    }
  }

  async getDataFieldByParam(
    urlPart: string,
    type: string,
    value: string | number
  ) {
    this.axiosInstance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${currentToken}`;
    try {
      const response = await this.axiosInstance.get(
        BASE_URL + urlPart + "?" + type + "=" + value
      );
      return response.data;
    } catch (err) {
      throw new Error(String(err));
    }
  }
  async getDataBySlug(urlPart: string, slug: string) {
    this.axiosInstance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${currentToken}`;
    try {
      const response = await this.axiosInstance.get(
        BASE_URL + urlPart + slug
      );
      return response.data;
    } catch (err) {
      throw new Error(String(err));
    }
  }
  async uploadFile(urlPart: String, formData: FormData): Promise<any> {
    this.axiosInstance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${currentToken}`;

    try {
      const response = await this.axiosInstance.post(
        BASE_URL + urlPart,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (err) {
      throw new Error(String(err));
    }
  }
}

export const APIPost = new PostApiService();

export class CategoryApiService {
  axiosInstance: AxiosInstance;
  constructor() {
    this.axiosInstance = axios.create({
      baseURL: BASE_URL,
      timeout,
    });
  }

  async getDataField(urlPart: String) {
    this.axiosInstance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${currentToken}`;

    try {
      const response = await this.axiosInstance.get(BASE_URL + urlPart);
      return response.data;
    } catch (error) {
      throw new Error(String(error));
    }
  }

  async getDataBySlug(urlPart: String, slug: String) {
    this.axiosInstance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${currentToken}`;

    try {
      const response = await this.axiosInstance.get(
        BASE_URL + urlPart + "?slug=" + slug
      );
      return response.data;
    } catch (error) {
      throw new Error(String(error));
    }
  }
}

export const APICategory = new CategoryApiService();

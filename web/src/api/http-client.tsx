import { AppSettings } from "../appsettings";

export async function Get<T>(url: string, data?: object | FormData) {
  return base<T>(url, "get", { params: data });
}

export async function Post<T>(url: string, data?: object | FormData) {
  return base<T>(url, "post", data);
}

export interface IResponse<T> {
  code: ResponseCode;
  msg: string;
  data: T;
}

export enum ResponseCode {
  Ok = 200,
  Unauthorized = 401,
  InternalServerError = 500,
}

export async function base<T>(
  url: string,
  method: "get" | "post",
  data?: object | FormData
) {
  const settings = (window as any).appSettings as AppSettings;
  const headers: { Authorization: string; "Content-Type"?: string } = {
    Authorization:
      "Bearer " +
      (localStorage.getItem("token")
        ? (localStorage.getItem("token") as string)
        : ""),
  };
  const isFormData = data instanceof FormData;
  if (!isFormData) headers["Content-Type"] = "application/json";
  const body = isFormData ? data : JSON.stringify(data);

  const convertGetData = (data: object | FormData) => {
    return JSON.stringify(data)
      .replace(/:/g, "=")
      .replace(/,/g, "&")
      .replace(/{/g, "?")
      .replace(/}/g, "")
      .replace(/"/g, "");
  };

  const fullUrl =
    convertGetData(data ?? {}) === "?" ? "" : convertGetData(data ?? {});

  return await fetch(
    `${settings.serverUrl}${url}${method === "get" ? fullUrl : ""}`,
    {
      method: method,
      body: method === "get" ? undefined : body,
      headers: headers,
    }
  )
    .then((res) => res.json())
    .then((res: IResponse<T>) => {
      if (res.code === ResponseCode.Ok) {
        return res.data;
      } else {
        throw new Error(res.msg);
      }
    });
}

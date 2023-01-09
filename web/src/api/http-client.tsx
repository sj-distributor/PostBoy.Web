import { AppSettings } from "../appsettings";

export async function Get<T>(url: string) {
  return base<T>(url, "get");
}

export async function Post<T>(url: string, data?: object) {
  return base<T>(url, "post", data);
}

export interface IResponse<T> {
  code: ResponseCode;
  msg: string;
  data: T;
}

export enum ResponseCode {
  ok = 200,
  unauthorized = 401,
  internalservererror = 500
}

export async function base<T>(url: string, method: "get" | "post", data?: object) {
  const settings = (window as any).appSettings as AppSettings;
  return await fetch(`${settings.serverUrl}${url}`, {
    method: method,
    body: data ? JSON.stringify(data) : undefined,
    headers: {
      js_version: settings.jsVersion,
      source_system: settings.sourceSystem,
      Authorization: (window as any).token,
      "Content-Type": "application/json"
    }
  })
    .then((res) => res.json())
    .then((res: IResponse<T>) => {
      if (res.code === ResponseCode.ok) {
        return res.data;
      } else if (res.code === ResponseCode.unauthorized) {
        // TODO refetch data with new token
        return null;
      } else if (res.code === ResponseCode.internalservererror) {
        // TODO show something error message
        return null;
      } else {
        console.log("todo");
      }
    })
    .catch((err) => {
      console.log("request error:", err);
      throw new Error(err);
    });
}

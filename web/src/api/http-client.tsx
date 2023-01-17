import { AppSettings } from "../appsettings";

export async function Get<T>(url: string) {
  return base<T>(url, "get");
}

export async function Post<T>(url: string, data?: object) {
  return base<T>(url, "post", data);
}

export function CombineParams(params: any) {
  let paramsString: string = "";
  for (const key in params) {
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      const element = params[key];
      if (!!element) {
        paramsString += `${key}=${element}&`;
      }
    }
  }
  paramsString = paramsString.slice(0, paramsString.length - 1);
  return paramsString;
}

export interface IResponse<T> {
  code: ResponseCode;
  msg: string;
  data: T;
}

export enum ResponseCode {
  Ok = 200,
  Unauthorized = 401,
  InternalServerError = 500
}

export async function base<T>(
  url: string,
  method: "get" | "post",
  data?: object
) {
  const settings = (window as any).appSettings as AppSettings;
  return await fetch(`${settings.serverUrl}${url}`, {
    method: method,
    body: data ? JSON.stringify(data) : undefined,
    headers: {
      Authorization:
        "Bearer " +
        (localStorage.getItem("token")
          ? (localStorage.getItem("token") as string)
          : ""),
      "Content-Type": "application/json"
    }
  })
    .then((res) => res.json())
    .then((res: IResponse<T>) => {
      if (res.code === ResponseCode.Ok) {
        return res.data;
      } else if (res.code === ResponseCode.Unauthorized) {
        // TODO refetch data with new token
        return null;
      } else if (res.code === ResponseCode.InternalServerError) {
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

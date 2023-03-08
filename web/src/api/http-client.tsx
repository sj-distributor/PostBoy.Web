import { AppSettings } from "../appsettings"

export async function Get<T>(url: string) {
  return base<T>(url, "get")
}

export async function Post<T>(url: string, data?: object, fromData?: FormData) {
  return base<T>(url, "post", data, fromData)
}

export interface IResponse<T> {
  code: ResponseCode
  msg: string
  data: T
}

export enum ResponseCode {
  Ok = 200,
  Unauthorized = 401,
  InternalServerError = 500,
}

const getHeader = (fromData: FormData) => {
  return fromData
    ? {
        Authorization:
          "Bearer " +
          (localStorage.getItem("token")
            ? (localStorage.getItem("token") as string)
            : ""),
        "Content-Type": "application/json",
      }
    : {
        Authorization:
          "Bearer " +
          (localStorage.getItem("token")
            ? (localStorage.getItem("token") as string)
            : ""),
      }
}

export async function base<T>(
  url: string,
  method: "get" | "post",
  data?: object,
  fromData?: FormData
) {
  const settings = (window as any).appSettings as AppSettings
  const header: { Authorization: string; "Content-Type"?: string } = fromData
    ? {
        Authorization:
          "Bearer " +
          (localStorage.getItem("token")
            ? (localStorage.getItem("token") as string)
            : ""),
      }
    : {
        Authorization:
          "Bearer " +
          (localStorage.getItem("token")
            ? (localStorage.getItem("token") as string)
            : ""),
        "Content-Type": "application/json",
      }
  return await fetch(`${settings.serverUrl}${url}`, {
    method: method,
    body: data ? JSON.stringify(data) : fromData ? fromData : undefined,
    headers: header,
  })
    .then((res) => res.json())
    .then((res: IResponse<T>) => {
      if (res.code === ResponseCode.Ok) {
        return res.data
      } else if (res.code === ResponseCode.Unauthorized) {
        return null
      } else if (res.code === ResponseCode.InternalServerError) {
        return null
      } else {
        console.log("todo")
      }
    })
    .catch((err) => {
      console.log("request error:", err)
      throw new Error(err)
    })
}

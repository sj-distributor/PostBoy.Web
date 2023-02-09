import { Get, Post } from "../http-client"

export const GetEmailData = async () => {
  return await Get("/api/Email/server/accounts")
}

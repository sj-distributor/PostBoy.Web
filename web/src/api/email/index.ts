import { IEmailResonponse } from "../../dtos/email";
import { Get } from "../http-client";

export const GetEmailData = async () => {
  return await Get<IEmailResonponse[]>("/api/Email/server/accounts");
};

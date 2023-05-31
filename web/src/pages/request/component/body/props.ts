import {
  ILastShowTableData,
  ISendMessageCommand,
  IUpdateMessageCommand,
} from "../../../../dtos/enterprise";

export interface RequestBodyProps {
  addOrUpdate: string;
  setSendData?: React.Dispatch<React.SetStateAction<ISendMessageCommand>>;
  whetherClear?: boolean;
  updateMessageJobInformation?: ILastShowTableData;
  updateRequestData?: (
    callback: () => IUpdateMessageCommand | undefined
  ) => void;
}

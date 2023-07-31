import {
  IDepartmentAndUserListValue,
  IDepartmentKeyControl,
  ITagsList,
  SelectPersonnelType,
} from "../../../../../../dtos/meeting-seetings";

export interface AddParticipantDialogProps {
  departmentAndUserList: IDepartmentKeyControl[];
  departmentKeyValue: IDepartmentKeyControl;
  AppId: string;
  isLoading: boolean;
  open: boolean;
  lastTagsValue: string[] | undefined;
  tagsList: ITagsList[];
  clickName: SelectPersonnelType;
  chatId: string;
  outerTagsValue?: ITagsList[];
  CorpId: string;
  loadSelectData?: IDepartmentAndUserListValue[];
  setOpenFunction: (open: boolean) => void;
  setChatId?: React.Dispatch<React.SetStateAction<string>>;
  setOuterTagsValue: React.Dispatch<React.SetStateAction<ITagsList[]>>;
  setDeptUserList: React.Dispatch<
    React.SetStateAction<IDepartmentKeyControl[]>
  >;
  handleGetSelectData?: (data: IDepartmentAndUserListValue[]) => void;
  settingSelectedList: (selectedList: IDepartmentAndUserListValue[]) => void;
}

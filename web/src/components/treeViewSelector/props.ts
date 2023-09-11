import React from "react";
import {
  DeptUserCanSelectStatus,
  IDepartmentAndUserListValue,
  WorkWeChatTreeStructureType,
} from "../../dtos/enterprise";

export interface IFoldSelectorProps
  extends React.AllHTMLAttributes<HTMLDivElement> {}
export interface IFlattenSelectorProps
  extends React.AllHTMLAttributes<HTMLDivElement> {}

export interface ISourceData {
  foldData: IDepartmentAndUserListValue[];
  flattenData: IDepartmentAndUserListValue[];
}

export interface ITreeViewProps {
  appId: string;
  inputValue?: string;
  inputLabel?: string;
  sourceData?: ISourceData;
  isCanSelect?: DeptUserCanSelectStatus;
  children?: React.ReactNode;
  defaultSelectedList?: IDepartmentAndUserListValue[];
  displayMode?: TreeViewDisplayMode;
  foldSelectorProps?: IFoldSelectorProps;
  flattenSelectorProps?: IFlattenSelectorProps;
  sourceType?: SourceType;
  settingSelectedList: (selectedList: IDepartmentAndUserListValue[]) => void;
  schemaType: WorkWeChatTreeStructureType;
  setSchemaType: React.Dispatch<
    React.SetStateAction<WorkWeChatTreeStructureType>
  >;
}

export interface ITreeViewHookProps {
  appId: string;
  defaultSelectedList?: IDepartmentAndUserListValue[];
  foldData: IDepartmentAndUserListValue[];
  flattenData: IDepartmentAndUserListValue[];
  sourceType?: SourceType;
  settingSelectedList: (selectedList: IDepartmentAndUserListValue[]) => void;
}

export enum TreeViewDisplayMode {
  Tree,
  Dropdown,
  Both,
}

export enum SourceType {
  Full,
  Part,
}

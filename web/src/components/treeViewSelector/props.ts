import React from "react"
import {
  DeptUserCanSelectStatus,
  IDepartmentAndUserListValue,
} from "../../dtos/enterprise"

export interface IFoldSelectorProps
  extends React.AllHTMLAttributes<HTMLDivElement> {}
export interface IFlattenSelectorProps
  extends React.AllHTMLAttributes<HTMLDivElement> {}

export interface ISourceData {
  foldData: IDepartmentAndUserListValue[]
  flattenData: IDepartmentAndUserListValue[]
}

export interface ITreeViewProps {
  appId: string
  inputValue: string
  inputLabel?: string
  sourceData?: ISourceData
  isCanSelect?: DeptUserCanSelectStatus
  children?: React.ReactNode
  defaultSelectedList?: IDepartmentAndUserListValue[]
  displayMode?: TreeViewDisplayMode
  foldSelectorProps?: IFoldSelectorProps
  flattenSelectorProps?: IFlattenSelectorProps
  selectType?: SelectType
  settingSelectedList: (selectedList: IDepartmentAndUserListValue[]) => void
}

export interface ITreeViewHookProps {
  appId: string
  defaultSelectedList?: IDepartmentAndUserListValue[]
  foldData: IDepartmentAndUserListValue[]
  flattenData: IDepartmentAndUserListValue[]
  selectType?: SelectType
  settingSelectedList: (selectedList: IDepartmentAndUserListValue[]) => void
}

export enum TreeViewDisplayMode {
  Tree,
  Dropdown,
  Both,
}

export enum SelectType {
  Fold,
  Flatten,
}

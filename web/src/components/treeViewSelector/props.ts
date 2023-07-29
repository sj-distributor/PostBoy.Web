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
  displayMode: TreeViewDisplayMode
  settingSelectedList: (selectedList: IDepartmentAndUserListValue[]) => void
  foldSelectorProps?: IFoldSelectorProps
  flattenSelectorProps?: IFlattenSelectorProps
}

export interface ITreeViewHookProps {
  appId: string
  defaultSelectedList?: IDepartmentAndUserListValue[]
  foldData: IDepartmentAndUserListValue[]
  flattenData: IDepartmentAndUserListValue[]
  settingSelectedList: (selectedList: IDepartmentAndUserListValue[]) => void
}

export enum TreeViewDisplayMode {
  Tree,
  Dropdown,
  Both,
}

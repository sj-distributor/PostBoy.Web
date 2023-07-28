import { Autocomplete } from "@mui/material"
import React from "react"
import {
  DeptUserCanSelectStatus,
  IDepartmentAndUserListValue,
} from "../../dtos/enterprise"

type AutocompleteProps = typeof Autocomplete

export interface IFoldSelectorProps extends AutocompleteProps {}
export interface IFlattenSelectorProps extends AutocompleteProps {}

export interface ISourceData {
  foldData: IDepartmentAndUserListValue[]
  flattenData: IDepartmentAndUserListValue[]
}

export interface ITreeViewProps {
  appId: string
  inputValue: string
  sourceData?: ISourceData
  isCanSelect?: DeptUserCanSelectStatus
  children?: React.ReactNode
  defaultSelectedList: IDepartmentAndUserListValue[]
  settingSelectedList: (selectedList: IDepartmentAndUserListValue[]) => void
  foldSelectorProps?: IFoldSelectorProps
  flattenSelectorProps?: IFlattenSelectorProps
}

export interface ITreeViewHookProps {
  appId: string
  defaultSelectedList: IDepartmentAndUserListValue[]
  foldData: IDepartmentAndUserListValue[]
  flattenData: IDepartmentAndUserListValue[]
  settingSelectedList: (selectedList: IDepartmentAndUserListValue[]) => void
}

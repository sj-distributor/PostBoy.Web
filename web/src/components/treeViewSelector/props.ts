import { Autocomplete } from "@mui/material"
import React from "react"
import {
  DeptUserCanSelectStatus,
  IDepartmentAndUserListValue,
} from "../../dtos/enterprise"

type AutocompleteProps = typeof Autocomplete

export interface ISelectedItem extends IDepartmentAndUserListValue {}
export interface IFoldSelectorProps extends AutocompleteProps {}
export interface IFlattenSelectorProps extends AutocompleteProps {}

export interface ISourceData {
  foldData: IDepartmentAndUserListValue[]
  flattenData: IDepartmentAndUserListValue[]
}

export interface ITreeViewProps {
  appId: string
  sourceData?: ISourceData
  inputValue: string
  canSelect: DeptUserCanSelectStatus
  settingSelectedList: IDepartmentAndUserListValue[]
  children: React.ReactDOM | string
  foldSelectorProps: IFoldSelectorProps
  flattenSelectorProps: IFlattenSelectorProps
}

export interface ITreeViewHookProps {
  appId: string
}

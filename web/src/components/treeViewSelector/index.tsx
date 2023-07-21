import {
  Autocomplete,
  AutocompleteRenderInputParams,
  Checkbox,
  Collapse,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  TextField,
} from "@mui/material"
import { onFilterDeptAndUsers } from "./fitler"
import useAction from "./hook"
import { ITreeViewProps } from "./props"
import styles from "./index.module.scss"
import { ExpandLess, ExpandMore } from "@mui/icons-material"
import {
  ClickType,
  DepartmentAndUserType,
  DeptUserCanSelectStatus,
  IDepartmentAndUserListValue,
} from "../../dtos/enterprise"

const TreeViewSelector = ({
  appId,
  sourceData,
  inputValue,
  isCanSelect,
  children,
  defaultSelectedList,
  settingSelectedList,
  foldSelectorProps,
  flattenSelectorProps,
}: ITreeViewProps) => {
  const { foldData, flattenData } = sourceData ?? {
    foldData: [],
    flattenData: [],
  }

  const canSelect = isCanSelect ?? DeptUserCanSelectStatus.Both

  const {
    selectedList,
    handleDeptOrUserClick,
    handleTypeIsCanSelect,
    setSearchToDeptValue,
    sourceMapGetter,
  } = useAction({
    appId,
    defaultSelectedList,
    flattenData,
    settingSelectedList,
  })

  const center = () =>
    !foldData
      ? {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }
      : {}

  const recursiveRenderDeptList = (
    data: IDepartmentAndUserListValue[],
    pl: number,
    isDivider: boolean
  ) => {
    const result = (
      <List key={appId} dense>
        {data.map((deptUserData, index) => {
          const insertData: IDepartmentAndUserListValue = {
            id: deptUserData.id,
            name: deptUserData.name,
            type: deptUserData.type,
            parentid: String(deptUserData.parentid),
            isCollapsed: false,
            selected: deptUserData.selected,
            children: [],
          }
          return (
            <div key={deptUserData.id}>
              <ListItemButton
                sx={{ pl, height: "2.2rem" }}
                onClick={(e) => {
                  e.stopPropagation()
                  deptUserData.children.length > 0 &&
                    handleDeptOrUserClick(ClickType.Collapse, insertData)
                }}
              >
                {handleTypeIsCanSelect(canSelect, deptUserData.type) &&
                  (sourceMapGetter(String(insertData.id))?.selected ? (
                    <Checkbox
                      edge="start"
                      value={true}
                      tabIndex={-1}
                      disableRipple
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeptOrUserClick(ClickType.Select, insertData)
                      }}
                    />
                  ) : (
                    <Checkbox
                      edge="start"
                      value={true}
                      tabIndex={-1}
                      disableRipple
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeptOrUserClick(ClickType.Select, insertData)
                      }}
                    />
                  ))}
                <ListItemText primary={deptUserData.name} />
                {deptUserData.children.length > 0 &&
                  (!!sourceMapGetter(String(insertData.id))?.isCollapsed ? (
                    <ExpandLess />
                  ) : (
                    <ExpandMore />
                  ))}
              </ListItemButton>
              {deptUserData.children.length > 0 && (
                <Collapse
                  in={!!sourceMapGetter(String(insertData.id))?.isCollapsed}
                  timeout={0}
                  unmountOnExit
                >
                  {recursiveRenderDeptList(
                    deptUserData.children,
                    pl + 2,
                    index !== data.length - 1
                  )}
                </Collapse>
              )}
            </div>
          )
        })}
        {isDivider && <Divider />}
      </List>
    )
    return result
  }

  return (
    <>
      <div
        style={{
          height: "15rem",
          overflowY: "auto",
          position: "relative",
          marginBottom: "1rem",
          ...center(),
        }}
      >
        {foldData && recursiveRenderDeptList(foldData, 0, true)}
      </div>

      {children && children}

      {flattenData && (
        <Autocomplete
          {...flattenSelectorProps}
          disablePortal
          openOnFocus
          multiple
          disableCloseOnSelect
          size="small"
          value={selectedList}
          options={flattenData}
          filterOptions={(options, state) =>
            onFilterDeptAndUsers(options, state)
          }
          getOptionLabel={(option: IDepartmentAndUserListValue) => option.name}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          groupBy={(option) => option.parentid as string}
          componentsProps={{
            paper: { elevation: 3 },
            popper: {
              placement: "top",
            },
          }}
          renderGroup={(params) => {
            const { key, group, children } = params
            return <div key={key}>{children}</div>
          }}
          renderOption={(props, option, state) => {
            let style = Object.assign(
              option.type === DepartmentAndUserType.Department
                ? { color: "#666" }
                : { paddingLeft: "2rem" },
              { fontSize: "0.9rem" }
            )
            !handleTypeIsCanSelect(canSelect, option.type) &&
              (props.onClick = () => {})
            return (
              <li {...props} style={style}>
                {option.name}
              </li>
            )
          }}
          onChange={(e, value) => value && setSearchToDeptValue(value)}
          renderInput={(params) => (
            <TextField
              {...params}
              size="small"
              value={inputValue}
              className={styles.InputButton}
              margin="dense"
              type="text"
              label="1"
            />
          )}
        />
      )}
    </>
  )
}

export default TreeViewSelector

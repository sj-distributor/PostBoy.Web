import {
  Autocomplete,
  Checkbox,
  Collapse,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  TextField,
} from "@mui/material";
import { onFilterDeptAndUsers } from "./fitler";
import useAction from "./hook";
import { ITreeViewProps, SourceType, TreeViewDisplayMode } from "./props";
import styles from "./index.module.scss";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import {
  ClickType,
  DepartmentAndUserType,
  DeptUserCanSelectStatus,
  IDepartmentAndUserListValue,
} from "../../dtos/enterprise";

const TreeViewSelector = ({
  appId,
  sourceData,
  inputValue,
  isCanSelect,
  children,
  defaultSelectedList,
  displayMode,
  inputLabel,
  sourceType,
  foldSelectorProps,
  flattenSelectorProps,
  settingSelectedList,
}: ITreeViewProps) => {
  const { foldData, flattenData } = sourceData ?? {
    foldData: [],
    flattenData: [],
  };

  displayMode = displayMode ?? TreeViewDisplayMode.Both;

  const canSelect = isCanSelect ?? DeptUserCanSelectStatus.Both;

  const {
    foldList,
    flattenList,
    selectedList,
    limitTags,
    loading,
    throttledValue,
    setLoading,
    setSearchValue,
    handleClear,
    handleDeptOrUserClick,
    handleTypeIsCanSelect,
    setSearchToDeptValue,
    foldMapGetter,
  } = useAction({
    appId,
    defaultSelectedList,
    foldData,
    flattenData,
    sourceType: sourceType ?? SourceType.Full,
    settingSelectedList,
  });

  const center = () =>
    !foldData
      ? {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }
      : {};

  const recursiveRenderDeptList = (
    data: IDepartmentAndUserListValue[],
    pl: number,
    isDivider: boolean
  ) => {
    const result = (
      <List key={appId} dense>
        {data.map((deptUser, index) => {
          const deptUserData = foldMapGetter(deptUser.id);
          return (
            !deptUserData || (
              <div key={deptUserData.name}>
                <ListItemButton
                  className={`${!deptUserData.indeterminate || styles.mask}`}
                  sx={{ pl, height: "2.2rem" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    deptUserData.children.length > 0 &&
                      handleDeptOrUserClick(ClickType.Collapse, deptUserData);
                  }}
                >
                  {handleTypeIsCanSelect(canSelect, deptUserData.type) && (
                    <Checkbox
                      edge="start"
                      checked={deptUserData.selected}
                      tabIndex={-1}
                      disableRipple
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeptOrUserClick(ClickType.Select, deptUserData);
                      }}
                    />
                  )}
                  <ListItemText primary={deptUserData.name} />
                  {deptUserData.children.length > 0 &&
                    (!!deptUserData.isCollapsed ? (
                      <ExpandLess />
                    ) : (
                      <ExpandMore />
                    ))}
                </ListItemButton>
                {deptUserData.children.length > 0 && (
                  <Collapse
                    in={!!deptUserData.isCollapsed}
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
          );
        })}
        {isDivider && <Divider />}
      </List>
    );
    return result;
  };

  return (
    <>
      {displayMode !== TreeViewDisplayMode.Dropdown && (
        <div
          {...foldSelectorProps}
          style={{
            height: "15rem",
            overflowY: "auto",
            position: "relative",
            marginBottom: "1rem",
            ...center(),
          }}
        >
          {foldList && recursiveRenderDeptList(foldList, 0, true)}
        </div>
      )}

      {children}

      {flattenList && displayMode !== TreeViewDisplayMode.Tree && (
        <div {...flattenSelectorProps}>
          <Autocomplete
            disablePortal
            openOnFocus
            multiple
            disableCloseOnSelect
            size="small"
            limitTags={20}
            value={selectedList}
            options={flattenList}
            loading={loading}
            filterOptions={(options, state) =>
              onFilterDeptAndUsers(options, state)
            }
            className={selectedList.length > 20 ? "limiting" : ""}
            sx={{
              "& .MuiInputBase-root.MuiOutlinedInput-root": {
                maxHeight: "20rem",
                overflowY: "auto",
              },
              "&.limiting .Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderBottomColor: "transparent",
                borderLeftColor: "transparent",
                borderRightColor: "transparent",
              },
            }}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            groupBy={(option) => String(option.parentid)}
            componentsProps={{
              paper: { elevation: 3 },
              popper: {
                placement: "top",
              },
            }}
            renderGroup={(params) => (
              <div key={params.key}>{params.children}</div>
            )}
            renderOption={(props, option) => {
              let style = Object.assign(
                option.type === DepartmentAndUserType.Department
                  ? { color: "#666" }
                  : { paddingLeft: "2rem" },
                { fontSize: "0.9rem" }
              );
              props.onClick = () => {
                handleTypeIsCanSelect(canSelect, option.type) &&
                  setSearchToDeptValue(option);
              };
              return (
                <li {...props} style={style}>
                  {option.name}
                </li>
              );
            }}
            onChange={(e, value, reason) => {
              handleClear(value, reason);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                className={styles.InputButton}
                margin="dense"
                type="text"
                label={inputLabel ?? ""}
              />
            )}
          />
        </div>
      )}
    </>
  );
};

export default TreeViewSelector;

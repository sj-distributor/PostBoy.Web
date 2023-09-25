import {
  Autocomplete,
  Radio,
  Snackbar,
  Tab,
  Tabs,
  TextField,
} from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import { onFilterDeptAndUsers } from "./fitler";
import useAction from "./hook";
import { ITreeViewProps, SourceType, TreeViewDisplayMode } from "./props";
import styles from "./index.module.scss";
import {
  ClickType,
  DepartmentAndUserType,
  DeptUserCanSelectStatus,
  IDepartmentAndUserListValue,
} from "../../dtos/enterprise";
import TagsComponent from "./tags";

import TreeList from "./treeList";

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
  schemaType,
  setSchemaType,
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
    loading,
    handleClear,
    handleDeptOrUserClick,
    handleTypeIsCanSelect,
    foldMap,
    isDirectTeamMembers,
    promptText,
    openError,
    handleGetAllTeamMembers,
  } = useAction({
    appId,
    defaultSelectedList,
    foldData,
    flattenData,
    sourceType: sourceType ?? SourceType.Full,
    schemaType,
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
      <TreeList
        data={data}
        handleDeptOrUserClick={handleDeptOrUserClick}
        foldMap={foldMap}
        schemaType={schemaType}
      />
    );
    return result;
  };

  return (
    <>
      <Snackbar
        message={promptText}
        open={openError}
        resumeHideDuration={3000}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      />
      <Tabs
        value={schemaType}
        aria-label="basic tabs example"
        onChange={(e, value) => {
          setSchemaType(value);
        }}
      >
        <Tab label="企业微信架构" />
        <Tab label="人员层级架构" />
      </Tabs>
      <div className={styles.directTeamMembers}>
        <span className={styles.radioLabel} onClick={handleGetAllTeamMembers}>
          <Radio
            checked={!isDirectTeamMembers}
            name="radio-direct-team-members"
          />
          直属组员
        </span>
      </div>
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
            filterOptions={(options, state) => {
              return onFilterDeptAndUsers(options, state);
            }}
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
            renderTags={(value) => {
              return (
                <TagsComponent
                  selectedList={value}
                  limit={selectedList.length}
                  handleClear={handleClear}
                />
              );
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            groupBy={(option) => {
              return String(uuidv4());
            }}
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
                  handleDeptOrUserClick(ClickType.Select, option);
              };
              return (
                <li {...props} style={style}>
                  {option.name}
                </li>
              );
            }}
            onChange={(e, value, reason) => {
              handleClear(value as IDepartmentAndUserListValue[], reason);
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

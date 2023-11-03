import { useAction } from "./hook";
import { AllDepartmentData, DepartmentDto } from "./props";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import styles from "./index.module.scss";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import IndeterminateCheckBoxIcon from "@mui/icons-material/IndeterminateCheckBox";

import {
  Autocomplete,
  Button,
  Card,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Input,
  Stack,
  TextField,
} from "@mui/material";

export const RoleFrom = () => {
  const {
    flatOptions,
    inputStyles,
    selectStyles,
    location,
    checkboxData,
    showLabel,
    navigate,
    setCheckboxData,
    isHaveExpand,
    expandTreeCheckbox,
    updateParentCheckbox,
    updateChildrenCheckbox,
    removeOption,
    //new
    permissions,
    role,
    updateRole,
    addOrModifyRolePermission,
    permissionOptions,
  } = useAction();

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;

  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  const renderInputBox = (
    title: string,
    dataName: keyof AllDepartmentData,
    optionSource: DepartmentDto[],
    valueSource: DepartmentDto[],
    lastItem?: boolean
  ) => {
    return (
      <div className={`${styles.item} ${lastItem && styles.lastItem}`}>
        <div className={styles.itemSubTitle}>{title}</div>
        <div className={styles.itemInput}>
          <Autocomplete
            size="small"
            sx={selectStyles}
            multiple
            options={optionSource}
            value={valueSource}
            disableCloseOnSelect={true}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderOption={(props, option, state) => {
              return (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      translate: "0 .3125rem",
                    }}
                    onClick={() =>
                      expandTreeCheckbox(dataName, state.index, option)
                    }
                  >
                    {isHaveExpand(option) &&
                      (option.isExpand ? (
                        <ArrowDropDownIcon
                          fontSize="large"
                          sx={{ color: "#1876d3", cursor: "pointer" }}
                        />
                      ) : (
                        <ArrowRightIcon
                          fontSize="large"
                          sx={{ color: "#1876d3", cursor: "pointer" }}
                        />
                      ))}
                  </div>
                  {!option.isHide && (
                    <li
                      {...props}
                      style={
                        isHaveExpand(option)
                          ? { paddingLeft: 0, flex: 1 }
                          : { marginLeft: "2.2rem", flex: 1 }
                      }
                      onClickCapture={() => {
                        isHaveExpand(option)
                          ? updateParentCheckbox(dataName, state.index, option)
                          : updateChildrenCheckbox(dataName, state.index);
                      }}
                    >
                      <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={option.isSelected}
                        indeterminate={option.indeterminate}
                        indeterminateIcon={
                          <IndeterminateCheckBoxIcon fontSize="small" />
                        }
                      />
                      {option.name}
                    </li>
                  )}
                </div>
              );
            }}
            style={{ width: 500 }}
            renderInput={(params) => (
              <TextField {...params} placeholder="請選擇" />
            )}
            onChange={(_, value, reason, details) => {
              reason === "removeOption" &&
                details?.option &&
                removeOption(dataName, details.option);

              reason === "clear" &&
                setCheckboxData((preValue) => {
                  return {
                    ...preValue,
                    [dataName]: flatOptions,
                  };
                });
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <Stack spacing={5}>
        <div className={styles.nav}>
          <div className={styles.navTitle}>
            {location.pathname === "/roles/add" ? "新增角色" : "編輯角色"}
          </div>
          <div className={styles.navBtn}>
            <Button
              className={styles.navButton}
              variant="contained"
              onClick={() => {
                addOrModifyRolePermission();
                // navigate("/roles/roleList")
              }}
            >
              確認
            </Button>
            <Button
              className={styles.navButton}
              variant="outlined"
              onClick={() => navigate("/roles/roleList")}
            >
              返回
            </Button>
          </div>
        </div>

        <Card className={styles.card} variant="outlined">
          <Stack spacing={3}>
            <div className={styles.itemTitle}>角色信息</div>
            <div className={styles.item}>
              <div className={styles.itemSubTitle}>角色名稱：</div>
              <div className={styles.itemInput}>
                <Input
                  disableUnderline={true}
                  sx={inputStyles}
                  placeholder="請輸入角色名稱"
                  value={role?.name ?? ""}
                  onChange={(e) => updateRole("name", e.target.value)}
                />
              </div>
            </div>
            <div className={styles.item}>
              <div className={styles.itemSubTitle}>角色描述：</div>
              <div className={styles.itemInput}>
                <Input
                  disableUnderline={true}
                  sx={inputStyles}
                  placeholder="請輸入角色描述"
                  value={role?.description ?? ""}
                  onChange={(e) => updateRole("description", e.target.value)}
                />
              </div>
            </div>
          </Stack>
        </Card>

        <Card className={styles.card} variant="outlined">
          <Stack spacing={3}>
            <div className={styles.itemTitle}>功能權限</div>
            <div className={styles.item}>
              <div className={styles.itemVisiblePage}>
                <FormGroup sx={{ flexBasis: "20%" }}>
                  <div className={styles.itemVisiblePageTitle}>可見頁面</div>
                  <FormControlLabel
                    control={<Checkbox defaultChecked />}
                    label="信息發送"
                  />
                  <FormControlLabel control={<Checkbox />} label="角色權限" />
                </FormGroup>
              </div>
              <div className={styles.itemPermission}>
                <div className={styles.itemPermissionTitle}>功能權限</div>
                <div className={styles.itemPerssionsForm}>
                  {permissionOptions.map(
                    (optionItems: string, index: number) => {
                      return (
                        <FormControlLabel
                          key={index}
                          control={<Checkbox />}
                          label={optionItems}
                          className={styles.formLabel}
                        />
                      );
                    }
                  )}
                </div>
              </div>
            </div>
          </Stack>
        </Card>

        <Card className={styles.card} variant="outlined">
          <Stack spacing={3}>
            <div className={styles.itemTitle}>數據權限</div>
            {renderInputBox(
              "拉群功能：",
              "pullCrowdData",
              checkboxData.pullCrowdData,
              showLabel.pullCrowdData
            )}
            {renderInputBox(
              "通知功能：",
              "notificationData",
              checkboxData.notificationData,
              showLabel.notificationData,
              true
            )}
          </Stack>
        </Card>
      </Stack>
    </div>
  );
};

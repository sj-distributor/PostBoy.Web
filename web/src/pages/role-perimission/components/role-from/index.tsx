import { useAction } from "./hook";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import styles from "./index.module.scss";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

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
import { useEffect, useState } from "react";
import { clone } from "ramda";

type DepartmentDto = {
  name: string;
  id: string;
  isSelected: boolean;
  isExpand?: boolean;
  indeterminate?: boolean;
};

export const RoleFrom = () => {
  const { options, inputStyles, selectStyles, formStyles, location, navigate } =
    useAction();

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;

  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  const newOptions = options.allDepartment.reduce((accumulator, item) => {
    const higherDepartment: DepartmentDto = {
      name: item.higherDepartment.name,
      id: item.higherDepartment.id,
      isSelected: false,
    };

    accumulator.push(higherDepartment);

    if (
      item.higherDepartment.childrenDepartment &&
      item.higherDepartment.childrenDepartment.length > 0
    ) {
      higherDepartment.isExpand = false;
      higherDepartment.indeterminate = false;

      accumulator.push(
        ...item.higherDepartment.childrenDepartment.map((child) => ({
          name: child.name,
          id: child.id,
          isSelected: false,
        }))
      );
    }

    return accumulator;
  }, [] as DepartmentDto[]);

  const [checkboxState, setCheckboxState] =
    useState<DepartmentDto[]>(newOptions);

  // console.log(newOptions);

  const newCheckboxState = clone(checkboxState);

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
              onClick={() => navigate("/roles/roleList")}
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
                  <FormGroup sx={formStyles}>
                    <FormControlLabel
                      control={<Checkbox defaultChecked />}
                      label="創建群組"
                    />
                    <FormControlLabel control={<Checkbox />} label="新增角色" />
                  </FormGroup>
                  <FormGroup sx={formStyles}>
                    <FormControlLabel
                      control={<Checkbox defaultChecked />}
                      label="添加群組成員"
                    />
                    <FormControlLabel control={<Checkbox />} label="分配" />
                  </FormGroup>
                  <FormGroup sx={formStyles}>
                    <FormControlLabel
                      control={<Checkbox defaultChecked />}
                      label="發送通知"
                    />
                    <FormControlLabel control={<Checkbox />} label="編輯" />
                  </FormGroup>

                  <FormGroup sx={formStyles}>
                    <FormControlLabel
                      control={<Checkbox defaultChecked />}
                      label="發送紀錄"
                    />
                    <FormControlLabel control={<Checkbox />} label="刪除" />
                  </FormGroup>
                </div>
              </div>
            </div>
          </Stack>
        </Card>

        <Card className={styles.card} variant="outlined">
          <Stack spacing={3}>
            <div className={styles.itemTitle}>數據權限</div>
            <div className={styles.item}>
              <div className={styles.itemSubTitle}>拉群功能：</div>
              <div className={styles.itemInput}>
                <Autocomplete
                  size="small"
                  sx={selectStyles}
                  multiple
                  options={newOptions}
                  disableCloseOnSelect
                  getOptionLabel={(option) => option.name}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  renderOption={(props, option, state) => {
                    // const ind = () => {
                    //   newCheckboxState.some((x) => {
                    //     if (x.isSelected) {
                    //       if (x.isExpand) {
                    //         newCheckboxState.map((item, index) => {
                    //           if (item.id.startsWith(option.id)) {
                    //             newCheckboxState[index].isSelected =
                    //               !newCheckboxState[index].isSelected;

                    //             setCheckboxState(newCheckboxState);
                    //           }
                    //         });
                    //         return undefined;
                    //       }
                    //     } else {
                    //       return true;
                    //     }
                    //   });
                    // };

                    return (
                      <li
                        {...props}
                        style={
                          Object.hasOwn(option, "isExpand")
                            ? {}
                            : { paddingLeft: "4rem" }
                        }
                        onClickCapture={() => {
                          if (Object.hasOwn(option, "isExpand")) {
                            newCheckboxState.map((item, index) => {
                              if (item.id.startsWith(option.id)) {
                                newCheckboxState[index].isSelected =
                                  !newCheckboxState[index].isSelected;

                                setCheckboxState(newCheckboxState);
                              }
                            });
                          } else {
                            newCheckboxState[state.index].isSelected =
                              !newCheckboxState[state.index].isSelected;

                            if (option.indeterminate) {
                              newCheckboxState[state.index].indeterminate =
                                true;
                            }

                            setCheckboxState(newCheckboxState);
                          }
                        }}
                      >
                        {Object.hasOwn(option, "isExpand") && (
                          <ArrowRightIcon
                            fontSize="medium"
                            sx={{ color: "#1876d3" }}
                          />
                        )}
                        <Checkbox
                          icon={icon}
                          checkedIcon={checkedIcon}
                          style={{ marginRight: 8 }}
                          checked={checkboxState[state.index].isSelected}
                          indeterminate={option.indeterminate}
                        />
                        {option.name}
                      </li>
                    );
                  }}
                  style={{ width: 500 }}
                  renderInput={(params) => (
                    <TextField {...params} placeholder="請選擇" />
                  )}
                />
              </div>
            </div>

            {/* <div className={`${styles.item} ${styles.lastItem}`}>
              <div className={styles.itemSubTitle}>通知功能：</div>
              <div className={styles.itemInput}>
                <Autocomplete
                  size="small"
                  sx={selectStyles}
                  multiple
                  id="checkboxes-tags-demo"
                  options={options.allDepartment}
                  disableCloseOnSelect
                  getOptionLabel={(option) => option.higherDepartment.name}
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={selected}
                      />
                      {option.higherDepartment.name}
                    </li>
                  )}
                  style={{ width: 500 }}
                  renderInput={(params) => (
                    <TextField {...params} placeholder="請選擇" />
                  )}
                />
              </div>
            </div> */}
          </Stack>
        </Card>
      </Stack>
    </div>
  );
};

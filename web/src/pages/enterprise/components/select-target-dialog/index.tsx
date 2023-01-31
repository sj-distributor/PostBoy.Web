import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import List from "@mui/material/List";
import Collapse from "@mui/material/Collapse";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Autocomplete from "@mui/material/Autocomplete";
import useAction from "./hook";
import styles from "./index.module.scss";

import {
  DepartmentAndUserType,
  IDepartmentUsersData,
  ITargetDialogProps
} from "../../../../dtos/enterprise";
import { memo } from "react";

const SelectTargetDialog = memo(
  (props: ITargetDialogProps) => {
    const {
      open,
      departmentList,
      AppId,
      isLoading,
      tagsList,
      flattenDepartmentList,
      setOpenFunction,
      getDialogValue
    } = props;
    const {
      tagsValue,
      newDepartmentList,
      setTagsValue,
      handleDeptOrUserClick
    } = useAction({
      open,
      AppId,
      departmentList
    });

    return (
      <div>
        <Dialog
          open={open}
          PaperProps={{
            sx: {
              overflowY: "unset"
            }
          }}
          onClose={() => {
            setOpenFunction(false);
          }}
        >
          <DialogTitle>选择发送目标</DialogTitle>
          <DialogContent sx={{ width: "30rem" }}>
            {newDepartmentList.length > 0 && !isLoading ? (
              <>
                <List dense sx={{ height: "15rem", overflowY: "auto" }}>
                  {newDepartmentList.map(
                    (department, departmentIndex: number) => {
                      return (
                        <div key={departmentIndex}>
                          <ListItemButton
                            onClick={() => {
                              handleDeptOrUserClick({
                                id: department.id,
                                name: department.name,
                                type: DepartmentAndUserType.Department,
                                parentid: department.parentid
                              });
                            }}
                          >
                            <ListItemText primary={department.name} />
                            {!!department.selected ? (
                              <ExpandLess />
                            ) : (
                              <ExpandMore />
                            )}
                          </ListItemButton>

                          {department.departmentUserList && (
                            <Collapse
                              in={!!department.selected}
                              timeout="auto"
                              unmountOnExit
                            >
                              <List component="div" disablePadding dense>
                                {department.departmentUserList.map(
                                  (
                                    user: IDepartmentUsersData,
                                    userIndex: number
                                  ) => (
                                    <ListItemButton
                                      key={userIndex}
                                      selected={!!user.selected}
                                      sx={{ pl: 4 }}
                                      onClick={(e) => {
                                        handleDeptOrUserClick({
                                          id: user.userid,
                                          name: user.name,
                                          type: DepartmentAndUserType.User,
                                          parentid: user.department[0]
                                        });
                                      }}
                                    >
                                      <ListItemText primary={user.name} />
                                    </ListItemButton>
                                  )
                                )}
                              </List>
                            </Collapse>
                          )}
                        </div>
                      );
                    }
                  )}
                </List>
                <Divider />
              </>
            ) : (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <CircularProgress />
              </div>
            )}

            <Autocomplete
              disablePortal
              id="sreach-input"
              sx={{
                marginTop: "2rem"
              }}
              options={flattenDepartmentList}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              groupBy={(option) => option.parentid as string}
              renderInput={(params) => (
                <TextField {...params} label="部门与用户搜索" />
              )}
              onChange={(e, value) => {
                console.log(value);
              }}
            />

            <Autocomplete
              disablePortal
              id="tags-list"
              disableClearable={true}
              options={tagsList}
              getOptionLabel={(option) => option.tagName}
              isOptionEqualToValue={(option, value) =>
                option.tagId === value.tagId
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  className={styles.InputButton}
                  margin="dense"
                  type="button"
                  label="标签列表"
                />
              )}
              onChange={(e, value) => {
                setTagsValue(value);
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setOpenFunction(false);
              }}
            >
              取消
            </Button>
            <Button
              onClick={() => {
                setOpenFunction(false);
                getDialogValue({
                  deptAndUserValueList: newDepartmentList,
                  tagsValue: tagsValue ? tagsValue : tagsList[0]
                });
              }}
            >
              确定
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.open === nextProps.open &&
      prevProps.departmentList === nextProps.departmentList
    );
  }
);

export default SelectTargetDialog;

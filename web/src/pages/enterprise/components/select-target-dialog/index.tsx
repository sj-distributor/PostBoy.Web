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
import useAction from "./hook";
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
            <TextField
              margin="dense"
              id="tags-list"
              label="标签列表"
              type="text"
              fullWidth
              variant="standard"
              value={tagsValue}
              onChange={(e) => {
                setTagsValue((e.target as HTMLInputElement).value);
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
                  tagsValue
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

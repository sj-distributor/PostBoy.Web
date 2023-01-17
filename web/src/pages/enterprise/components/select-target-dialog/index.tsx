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
  IDepartmentUsersData,
  ITargetDialogProps
} from "../../../../dtos/enterprise";
import { memo } from "react";

const SelectTargetDialog = memo(
  (props: ITargetDialogProps) => {
    const { open, setDialogValue, AppId, setOpenFunction, getDialogValue } =
      props;
    const {
      departmentList,
      tagsValue,
      departmentUserValue,
      isLoading,
      setTagsValue,
      handleDepartmentClick,
      handleUserClick
    } = useAction({ open, setDialogValue, AppId });

    return (
      <div>
        <Dialog open={open} onClose={() => setOpenFunction(false)}>
          <DialogTitle>选择发送目标</DialogTitle>
          <DialogContent sx={{ width: "30rem" }}>
            {!!departmentList && departmentList.length > 0 && !isLoading ? (
              <>
                <List dense sx={{ height: "15rem", overflowY: "auto" }}>
                  {departmentList.map((department, departmentIndex: number) => {
                    return (
                      <div key={departmentIndex}>
                        <ListItemButton
                          onClick={() => {
                            handleDepartmentClick(department);
                          }}
                        >
                          <ListItemText primary={department.name} />
                          {department.isCollapse ? (
                            <ExpandLess />
                          ) : (
                            <ExpandMore />
                          )}
                        </ListItemButton>

                        {department.departmentUserList && (
                          <Collapse
                            in={department.isCollapse}
                            timeout="auto"
                            unmountOnExit
                          >
                            <List component="div" disablePadding dense>
                              {department.departmentUserList.map(
                                (
                                  user: IDepartmentUsersData,
                                  userIndex: number
                                ) => {
                                  return (
                                    <ListItemButton
                                      key={userIndex}
                                      selected={
                                        !!departmentUserValue &&
                                        departmentUserValue.userid ===
                                          user.userid
                                      }
                                      sx={{ pl: 4 }}
                                      onClick={(e) => {
                                        handleUserClick(user);
                                      }}
                                    >
                                      <ListItemText primary={user.name} />
                                    </ListItemButton>
                                  );
                                }
                              )}
                            </List>
                          </Collapse>
                        )}
                      </div>
                    );
                  })}
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
            <Button onClick={() => setOpenFunction(false)}>取消</Button>
            <Button
              onClick={() => {
                setOpenFunction(false);
                getDialogValue({
                  departmentUserValue,
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
    return prevProps.open === nextProps.open;
  }
);

export default SelectTargetDialog;

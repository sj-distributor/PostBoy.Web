import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import useAction from "./hook";
import { ITargetDialogProps } from "../../../../dtos/enterprise";

const SelectTargetDialog = (props: ITargetDialogProps) => {
  const { open, setDialogValue, setOpenFunction, getDialogValue } = props;
  const {
    memberValue,
    departmentValue,
    tagsValue,
    setMemberValue,
    setDepartmentValue,
    setTagsValue
  } = useAction(setDialogValue);

  return (
    <div>
      <Dialog open={open} onClose={() => setOpenFunction(false)}>
        <DialogTitle>选择发送目标</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            id="member-list"
            label="成员列表"
            type="text"
            fullWidth
            variant="standard"
            value={memberValue}
            onChange={(e) => {
              setMemberValue((e.target as HTMLInputElement).value);
            }}
          />
          <TextField
            margin="dense"
            id="department-list"
            label="部门列表"
            type="text"
            fullWidth
            variant="standard"
            value={departmentValue}
            onChange={(e) => {
              setDepartmentValue((e.target as HTMLInputElement).value);
            }}
          />
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
                memberValue,
                departmentValue,
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
};

export default SelectTargetDialog;

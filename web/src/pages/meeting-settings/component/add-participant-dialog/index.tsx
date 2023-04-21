import {
  Dialog,
  DialogContent,
  Autocomplete,
  TextField,
  Box,
  Avatar,
  List,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
  ListItemIcon,
  Checkbox,
  Button,
} from "@mui/material";
import Collapse from "@mui/material/Collapse";
import CancelIcon from "@mui/icons-material/Cancel";
import Grid from "@mui/material/Unstable_Grid2";
import style from "./index.module.scss";
import useAction from "./hook";
import { DialogProps } from "../../../../dtos/meeting-seetings";

const AddParticipantDialog = (props: DialogProps) => {
  const { open, setDialog } = props;
  const {
    searchData,
    openListItem,
    dense,
    selectedData,
    secondary,
    handleClick,
    delSelectedItem,
  } = useAction();
  return (
    <>
      <Dialog
        open={open}
        onClose={() => setDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent sx={{ width: "30rem" }}>
          <Grid container columns={100} justifyContent="space-between">
            <Grid xs={100} md={48}>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={searchData}
                sx={{ width: "100%" }}
                renderInput={(params) => (
                  <TextField {...params} label="联系人" />
                )}
              />
              <Box sx={{ height: "25rem" }}>
                <List
                  sx={{
                    width: "100%",
                    maxWidth: 360,
                    bgcolor: "background.paper",
                  }}
                  component="nav"
                  aria-labelledby="nested-list-subheader"
                >
                  <ListItemButton onClick={handleClick}>
                    <ListItemText primary="从群聊中选择" />
                  </ListItemButton>
                  <Collapse in={openListItem} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      <ListItemButton sx={{ pl: 4 }}>
                        <ListItemIcon>
                          <Checkbox edge="start" tabIndex={-1} disableRipple />
                        </ListItemIcon>
                        <ListItemText primary="Starred" />
                      </ListItemButton>
                    </List>
                  </Collapse>
                </List>
              </Box>
            </Grid>
            <Grid xs={100} md={48} sx={{ position: "relative" }}>
              <div>已选择·1</div>
              <List dense={dense}>
                {selectedData.map((item, index) => {
                  return (
                    <ListItem
                      key={index}
                      sx={{ paddingLeft: 0, paddingRight: 0 }}
                      secondaryAction={
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => delSelectedItem(index)}
                        >
                          <CancelIcon className={style.closeIcon} />
                        </IconButton>
                      }
                    >
                      <ListItemAvatar>
                        <Avatar
                          variant="square"
                          className={style.acatar}
                          src={item.avatar}
                        ></Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={item.name}
                        secondary={secondary ? "Secondary text" : null}
                      />
                    </ListItem>
                  );
                })}
              </List>
              <div className={style.btnGroup}>
                <Button
                  sx={{ backgroundColor: "#ccc", color: "black" }}
                  onClick={() => setDialog(false)}
                >
                  取消
                </Button>
                <Button variant="contained" onClick={() => setDialog(false)}>
                  确定
                </Button>
              </div>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddParticipantDialog;

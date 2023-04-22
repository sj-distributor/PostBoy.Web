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
  CircularProgress,
} from "@mui/material";
import Collapse from "@mui/material/Collapse";
import CancelIcon from "@mui/icons-material/Cancel";
import Grid from "@mui/material/Unstable_Grid2";
import style from "./index.module.scss";
import useAction from "./hook";
import {
  AddDialogProps,
  MeetingCallReminder,
} from "../../../../dtos/meeting-seetings";

const AddParticipantDialog = (props: AddDialogProps) => {
  const { open, setDialog, type, resettingAppointRadio, getSelectListData } =
    props;
  const {
    contactsData,
    openListItem,
    dense,
    selectedData,
    secondary,
    handleClick,
    delSelectedItem,
  } = useAction();
  const closeDialog = () => {
    if (type === "DesignatedMembers") {
      resettingAppointRadio && resettingAppointRadio(MeetingCallReminder.Host);
    }
    setDialog(false);
  };
  const confirm = () => {
    setDialog(false);
    getSelectListData(selectedData);
  };
  return (
    <>
      <Dialog
        open={open}
        onClose={() => setDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent sx={{ width: "30rem" }}>
          <Grid container columns={24} justifyContent="space-between">
            <Grid xs={24} md={12} sx={{ paddingRight: "0.5rem" }}>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={contactsData ? contactsData : []}
                sx={{ width: "100%" }}
                size="small"
                renderInput={(params) => (
                  <TextField {...params} label="联系人" />
                )}
              />
              <Box sx={{ height: "25rem" }}>
                {!contactsData && (
                  <div className={style.noData}>
                    <CircularProgress />
                  </div>
                )}

                {contactsData && contactsData?.length >= 1 ? (
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
                            <Checkbox
                              edge="start"
                              size="small"
                              tabIndex={-1}
                              disableRipple
                            />
                          </ListItemIcon>
                          <ListItemText primary="Starred" />
                        </ListItemButton>
                      </List>
                    </Collapse>
                  </List>
                ) : (
                  <div className={style.noData}>no Data</div>
                )}
              </Box>
            </Grid>
            <Grid
              xs={24}
              md={12}
              sx={{
                position: "relative",
                paddingLeft: "0.5rem",
                borderLeft: "1px solid #ccc",
              }}
            >
              <div className={style.selectTitle}>已选择·1</div>
              <List dense={dense} className={style.selectedDataBox}>
                {selectedData.map((item, index) => {
                  return (
                    <ListItem
                      key={index}
                      sx={{ paddingLeft: 0, paddingRight: 0 }}
                      secondaryAction={
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => delSelectedItem(item.name)}
                        >
                          <CancelIcon
                            className={style.closeIcon}
                            sx={{ fontSize: "1rem" }}
                          />
                        </IconButton>
                      }
                    >
                      <ListItemAvatar sx={{ minWidth: "2rem" }}>
                        <Avatar
                          variant="square"
                          sx={{ width: 24, height: 24 }}
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
                  onClick={() => closeDialog()}
                >
                  取消
                </Button>
                <Button variant="contained" onClick={() => confirm()}>
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

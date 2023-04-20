import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Autocomplete,
  TextField,
  Box,
  Avatar,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { useEffect, useState } from "react";
import style from "./index.module.scss";

const AddParticipantDialog = (props: {
  open: boolean;
  setDialog: (value: boolean) => void;
}) => {
  const { open, setDialog } = props;
  const [searchData, setSearchData] = useState([]);
  return (
    <>
      <Dialog
        open={open}
        onClose={() => setDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent sx={{ width: "30rem", height: "auto" }}>
          <Grid container columns={100} justifyContent="space-between">
            <Grid xs={100} md={48}>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={searchData}
                sx={{ width: "100%" }}
                renderInput={(params) => (
                  <TextField {...params} label="Movie" />
                )}
              />
              <Box sx={{ height: "25rem" }}>
                {!searchData.length && (
                  <div className={style.noData}>no Data</div>
                )}
              </Box>
            </Grid>
            <Grid xs={100} md={48}>
              <div>已选择·1</div>
              <div className={style.selectedData}>
                <div className={style.avatarName}>
                  <Avatar
                    variant="square"
                    className={style.acatar}
                    src="https://img1.baidu.com/it/u=928879359,2870156212&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1681578000&t=375470fe9a362c575908e7b397fa0e69"
                  ></Avatar>
                  <div className={style.participantName}>MARS.PENG</div>
                </div>
              </div>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddParticipantDialog;

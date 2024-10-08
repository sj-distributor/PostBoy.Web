import {
  Alert,
  AlertTitle,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  TextField,
} from "@mui/material";
import dayjs from "dayjs";
import CloseIcon from "@mui/icons-material/Close";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

import useAction from "./hook";

import style from "./index.module.scss";

const MeetingWhiteList = () => {
  const {
    rows,
    success,
    failSend,
    failSendText,
    successText,
    dto,
    setDto,
    loading,
    isConfirmDialog,
    confirmDialogAction,
    openAddWhiteList,
    setOpenAddWhiteList,
    addEditWhiteListDto,
    updateLoading,
    setAddEditWhiteListDto,
    handelAddEditWhiteList,
    handelDeleteWhiteList,
    delLoading,
  } = useAction();

  const columns: GridColDef[] = [
    {
      field: "meetingCode",
      headerName: "会议号",
      flex: 1,
      minWidth: 130,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "notifyUserId",
      headerName: "企微名",
      flex: 1,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "createdDate",
      headerName: "创建时间",
      align: "center",
      headerAlign: "center",
      flex: 1,
      minWidth: 160,
      renderCell: (params) => {
        return (
          <span>
            {dayjs(params.row.createdDate).format("YYYY-MM-DD HH:mm:ss")}
          </span>
        );
      },
    },

    {
      field: "fun",
      headerName: "操作",
      align: "center",
      width: 160,
      headerAlign: "center",
      renderCell: (params) => (
        <>
          <Button
            variant="contained"
            size="small"
            style={{ marginRight: 16 }}
            onClick={() => {
              setOpenAddWhiteList(true);
              setAddEditWhiteListDto((prev) => ({
                ...prev,
                MeetingCode: params.row.meetingCode,
                NotifyUserId: params.row.notifyUserId,
                type: "edit",
                Id: params.row.id,
              }));
            }}
          >
            编辑
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={() => handelDeleteWhiteList(params.row.id)}
          >
            {delLoading ? <CircularProgress size={20} /> : "删除"}
          </Button>
        </>
      ),
    },
  ];

  return (
    <>
      <Snackbar
        open={success}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Alert severity="success">
          <AlertTitle>{successText}</AlertTitle>
        </Alert>
      </Snackbar>
      <Snackbar
        open={failSend}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Alert severity="error">{failSendText}</Alert>
      </Snackbar>
      <div className={style.tableTitleFunction}>
        <Button
          variant="contained"
          component="label"
          onClick={() => setOpenAddWhiteList(true)}
        >
          创建
        </Button>
      </div>
      <div>
        <div className={style.tableBoxWrap}>
          <div className={style.tableBox}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={dto.pageSize}
              page={dto.pageIndex}
              showCellRightBorder
              showColumnRightBorder
              rowsPerPageOptions={[5, 10, 15, 20]}
              disableSelectionOnClick
              pagination
              loading={loading}
              paginationMode="server"
              rowHeight={56}
              style={{ height: 700, width: "95%" }}
              rowCount={dto.rowCount}
              onPageChange={(value) =>
                setDto((prve) => ({ ...prve, pageIndex: value }))
              }
              onPageSizeChange={(value) =>
                setDto((prve) => ({ ...prve, pageSize: value }))
              }
            />
          </div>
        </div>
        <Dialog
          open={openAddWhiteList}
          onClick={() => {}}
          onClose={() => confirmDialogAction.setFalse()}
          hideBackdrop
          keepMounted={true}
        >
          <DialogTitle id="alert-dialog-title" className={style.dialogTitle}>
            <div>
              {addEditWhiteListDto.type === "add" ? "添加" : "编辑"}白名单
            </div>
            <span
              onClick={() => {
                setOpenAddWhiteList(false);
                setAddEditWhiteListDto((prev) => ({
                  ...prev,
                  MeetingCode: "",
                  NotifyUserId: "",
                }));
              }}
            >
              <CloseIcon className={style.closeIcon} />
            </span>
          </DialogTitle>
          <DialogContent
            sx={{ backgroundColor: "#f2f3f4" }}
            className={style.addContent}
          >
            <div className={style.fromItem}>
              <div className={style.title}>会议号</div>
              <div className={style.widthFull}>
                <TextField
                  id="filled-start-adornment"
                  placeholder="会议号"
                  autoComplete="off"
                  className={style.input}
                  variant="outlined"
                  value={addEditWhiteListDto?.MeetingCode}
                  onChange={(e) =>
                    setAddEditWhiteListDto((prev) => ({
                      ...prev,
                      MeetingCode: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className={style.fromItem}>
              <div className={style.title}>用户企微名</div>
              <div className={style.widthFull}>
                <TextField
                  id="filled-start-adornment"
                  placeholder="用户企微名"
                  autoComplete="off"
                  className={style.input}
                  sx={{ width: "100%" }}
                  variant="outlined"
                  value={addEditWhiteListDto?.NotifyUserId}
                  onChange={(e) =>
                    setAddEditWhiteListDto((prev) => ({
                      ...prev,
                      NotifyUserId: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          </DialogContent>
          <DialogActions
            sx={{ backgroundColor: "#f2f3f4", justifyContent: "flex-end" }}
          >
            <Button
              variant="contained"
              size="small"
              type="submit"
              disabled={updateLoading}
              onClick={() => {
                handelAddEditWhiteList();
              }}
            >
              {updateLoading ? <CircularProgress size={20} /> : "确认"}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={isConfirmDialog}
          onClick={() => {}}
          onClose={() => confirmDialogAction.setFalse()}
          hideBackdrop
          keepMounted={true}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle
            id="alert-dialog-title-cancel"
            sx={{ backgroundColor: "#f2f3f4" }}
          >
            ⚠️提示
          </DialogTitle>
          <DialogContent sx={{ backgroundColor: "#f2f3f4" }}>
            <DialogContentText id="alert-dialog-description-cancel">
              您正在取消预定会议，是否继续操作
            </DialogContentText>
          </DialogContent>
          <DialogActions
            sx={{ backgroundColor: "#f2f3f4", justifyContent: "space-between" }}
          >
            <Button
              variant="contained"
              size="small"
              onClick={() => confirmDialogAction.setFalse()}
            >
              取消
            </Button>
            <Button variant="contained" size="small">
              确认
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default MeetingWhiteList;

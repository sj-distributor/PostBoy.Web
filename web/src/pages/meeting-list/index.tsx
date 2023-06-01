import {
  Alert,
  AlertTitle,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Snackbar,
  Tooltip,
} from "@mui/material";
import dayjs from "dayjs";
import {
  DataGrid,
  GridCellParams,
  GridColDef,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import MeetingSettings from "./components/meeting-settings";
import useAction from "./hook";
import { MeetingStatus, MeetingType } from "../../dtos/meeting-seetings";
import style from "./index.module.scss";
import { Search } from "@mui/icons-material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const asyncTootip = (title: string, style: string) => {
  return (
    <Tooltip title={title} className={style}>
      <span>{title}</span>
    </Tooltip>
  );
};

const MeetingList = () => {
  const {
    rows,
    isOpenMeetingSettings,
    setIsOpenMeetingSettings,
    meetingIdCorpIdAndAppId,
    meetingSetting,
    meetingCancel,
    meetingCreate,
    success,
    failSend,
    loading,
    getMeetingList,
    meetingState,
    failSendText,
    successText,
    dto,
    setDto,
    searchMeeting,
    handleCopyMeetingLink,
    isConfirmDialog,
    confirmDialogAction,
    confirmDelete,
  } = useAction();
  const columns: GridColDef[] = [
    {
      field: "adminUserId",
      headerName: "会议管理员",
      flex: 1,
      minWidth: 130,
      align: "center",
      headerAlign: "center",
      renderCell: (params: GridCellParams) =>
        asyncTootip(params.row.adminUserId + "", style.tooltip),
    },
    {
      field: "status",
      headerName: "会议状态",
      flex: 1,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
      valueGetter: (params: GridValueGetterParams) =>
        MeetingType[params.row.status as MeetingStatus],
    },
    {
      field: "meetingStart",
      headerName: "会议开始时间",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
      valueGetter: (params: GridValueGetterParams) =>
        dayjs.unix(params.row.meetingStart).format("YYYY-MM-DD HH:mm"),
    },
    {
      field: "meetingDuration",
      headerName: "会议时长",
      type: "number",
      flex: 1,
      minWidth: 90,
      align: "center",
      headerAlign: "center",
      valueGetter: (params: GridValueGetterParams) =>
        `${params.row.meetingDuration / 60}分钟`,
    },
    {
      field: "password",
      headerName: "入会密码",
      flex: 1,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
      valueGetter: (params: GridValueGetterParams) =>
        params.row.password ? params.row.password : "未设置密码",
    },
    {
      field: "meetingCode",
      headerName: "会议号",
      flex: 1,
      minWidth: 130,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "meetingLink",
      headerName: "入会链接",
      flex: 1,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <>
          <ContentCopyIcon
            onClick={() => handleCopyMeetingLink(params.row.meetingLink)}
            sx={{ fontSize: "1rem", marginLeft: "0.5rem", cursor: "pointer" }}
          />
        </>
      ),
    },
    {
      field: "title",
      headerName: "会议标题",
      align: "center",
      headerAlign: "center",
      flex: 1,
      minWidth: 160,
      renderCell: (params: GridCellParams) => {
        return asyncTootip(params.row.title, style.tooltip);
      },
    },
    {
      field: "description",
      headerName: "会议描述",
      align: "center",
      headerAlign: "center",
      flex: 1,
      minWidth: 160,
      renderCell: (params: GridCellParams) =>
        asyncTootip(params.row.description, style.tooltip),
    },
    {
      field: "location",
      headerName: "会议地点",
      align: "center",
      headerAlign: "center",
      flex: 1,
      minWidth: 160,
      renderCell: (params: GridCellParams) =>
        asyncTootip(params.row.location, style.tooltip),
    },
    {
      field: "presentMember",
      headerName: "参会人员",
      align: "center",
      headerAlign: "center",
      flex: 1,
      minWidth: 160,
      renderCell: (params: GridCellParams) =>
        asyncTootip(params.row.presentMember + "", style.tooltip),
      valueGetter: (params: GridValueGetterParams) =>
        params.row.presentMember.length
          ? params.row.presentMember?.map((item: string) => item)
          : "暂无人参与会议",
    },
    {
      field: "absentMember",
      headerName: "缺席人员（会议没开始都是缺席人员）",
      align: "center",
      headerAlign: "center",
      flex: 1,
      minWidth: 260,
      renderCell: (params: GridCellParams) =>
        asyncTootip(params.row.absentMember + "", style.tooltip),
      valueGetter: (params: GridValueGetterParams) =>
        params.row.absentMember.map((item: string) => item),
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
            disabled={params.row.status !== MeetingStatus.ToBeStarted}
            onClick={() => meetingSetting(params.row)}
          >
            会议编辑
          </Button>
          <Button
            variant="contained"
            size="small"
            disabled={params.row.status !== MeetingStatus.ToBeStarted}
            onClick={() => meetingCancel(params.row)}
          >
            取消会议
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
        <div className={style.searchMeeting}>
          <OutlinedInput
            id="outlined-adornment-password"
            type="text"
            size="small"
            autoComplete="off"
            onChange={(e) =>
              setDto((prve) => ({ ...prve, ketWord: e.target.value }))
            }
            onKeyDown={(e) => e.code === "Enter" && searchMeeting()}
            placeholder="输入会议标题搜索会议"
            endAdornment={
              <InputAdornment position="end">
                <IconButton aria-label="toggle password visibility" edge="end">
                  <Search />
                </IconButton>
              </InputAdornment>
            }
          />
          <Button
            variant="contained"
            component="label"
            sx={{ marginLeft: "0.5rem" }}
            onClick={() => searchMeeting()}
          >
            搜索会议
          </Button>
        </div>
        <div>
          <Button
            variant="contained"
            component="label"
            onClick={() => meetingCreate()}
          >
            创建会议
          </Button>
        </div>
      </div>
      <div>
        <div className={style.tableBoxWrap}>
          <div className={style.tableBox}>
            <DataGrid
              loading={loading}
              rows={rows}
              columns={columns}
              pageSize={dto.pageSize}
              page={dto.pageIndex}
              showCellRightBorder
              showColumnRightBorder
              rowsPerPageOptions={[5, 10, 15, 20]}
              disableSelectionOnClick
              pagination
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

        <MeetingSettings
          isOpenMeetingSettings={isOpenMeetingSettings}
          setIsOpenMeetingSettings={setIsOpenMeetingSettings}
          meetingIdCorpIdAndAppId={meetingIdCorpIdAndAppId}
          getMeetingList={getMeetingList}
          meetingState={meetingState}
        />
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
            <Button
              variant="contained"
              size="small"
              onClick={() => {
                confirmDelete();
              }}
            >
              确认
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default MeetingList;

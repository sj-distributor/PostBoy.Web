import {
  Alert,
  AlertTitle,
  Button,
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
  MuiEvent,
} from "@mui/x-data-grid";
import MeetingSettings from "./components/meeting-settings";
import useAction from "./hook";
import { MeetingStatus } from "../../dtos/meeting-seetings";
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
  } = useAction();
  const columns: GridColDef[] = [
    {
      field: "adminUserId",
      headerName: "会议管理员",
      width: 130,
      align: "center",
      headerAlign: "center",
      renderCell: (params: GridCellParams) =>
        asyncTootip(params.row.adminUserId + "", style.tooltip),
    },
    {
      field: "mainDepartment",
      headerName: "发起人所在部门",
      width: 130,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "status",
      headerName: "会议状态",
      width: 100,
      align: "center",
      headerAlign: "center",
      valueGetter: (params: GridValueGetterParams) =>
        MeetingStatus[params.row.status],
    },
    {
      field: "isDelete",
      headerName: "是否取消",
      width: 100,
      align: "center",
      headerAlign: "center",
      valueGetter: (params: GridValueGetterParams) =>
        params.row.isDelete ? "已取消" : "未取消",
    },
    {
      field: "meetingStart",
      headerName: "会议开始时间",
      width: 150,
      align: "center",
      headerAlign: "center",
      valueGetter: (params: GridValueGetterParams) =>
        dayjs.unix(params.row.meetingStart).format("YYYY-MM-DD HH:mm"),
    },
    {
      field: "meetingDuration",
      headerName: "会议时长",
      type: "number",
      width: 90,
      align: "center",
      headerAlign: "center",
      valueGetter: (params: GridValueGetterParams) =>
        `${params.row.meetingDuration / 60}分钟`,
    },
    {
      field: "password",
      headerName: "入会密码",
      width: 100,
      align: "center",
      headerAlign: "center",
      valueGetter: (params: GridValueGetterParams) =>
        params.row.password ? params.row.password : "未设置密码",
    },
    {
      field: "meetingCode",
      headerName: "会议号",
      width: 130,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "meetingLink",
      headerName: "入会链接",
      width: 100,
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
      width: 160,
      align: "center",
      headerAlign: "center",
      renderCell: (params: GridCellParams) =>
        asyncTootip(params.row.title, style.tooltip),
    },
    {
      field: "description",
      headerName: "会议描述",
      width: 160,
      align: "center",
      headerAlign: "center",
      renderCell: (params: GridCellParams) =>
        asyncTootip(params.row.description, style.tooltip),
    },
    {
      field: "location",
      headerName: "会议地点",
      width: 160,
      align: "center",
      headerAlign: "center",
      renderCell: (params: GridCellParams) =>
        asyncTootip(params.row.location, style.tooltip),
    },
    {
      field: "presentMember",
      headerName: "参会人员",
      width: 160,
      align: "center",
      headerAlign: "center",
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
      width: 260,
      align: "center",
      headerAlign: "center",
      renderCell: (params: GridCellParams) =>
        asyncTootip(params.row.absentMember + "", style.tooltip),
      valueGetter: (params: GridValueGetterParams) =>
        params.row.absentMember.map((item: string) => item),
    },
    {
      field: "fun",
      headerName: "操作",
      width: 160,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <>
          <Button
            variant="contained"
            size="small"
            style={{ marginRight: 16 }}
            disabled={params.row.isDelete}
            onClick={() => meetingSetting(params.row)}
          >
            会议编辑
          </Button>
          <Button
            variant="contained"
            size="small"
            disabled={params.row.isDelete}
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
      </div>
    </>
  );
};

export default MeetingList;

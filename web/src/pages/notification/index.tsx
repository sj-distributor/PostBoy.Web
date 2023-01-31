import { Button, Tooltip } from "@mui/material";
import {
  DataGrid,
  GridCellParams,
  GridColDef,
  GridRowsProp,
} from "@mui/x-data-grid";
import styles from "./index.module.scss";
import moment from "moment";
import { useAction } from "./hook";
import ModalBox from "../../components/modal/modal";
import NoticeSetting from "./ components/notice-setting";
import SendRecord from "./ components/send-record";

const rows: GridRowsProp = [
  {
    id: 1,
    title: "Hell313132132131234324234234o",
    content: "大家好,以下是本周需要update的事情",
    cycle: "",
    createTime: moment.utc(new Date()).local().format("YYYY-MM-DD HH:mm"),
  },
  {
    id: 2,
    title: "DataGridPro",
    content: "is Awesome31231313123123",
    cycle: "",
    createTime: moment.utc(new Date()).local().format("YYYY-MM-DD HH:mm"),
  },
  {
    id: 3,
    title: "MUI",
    content: "大家好,关于这件事情123123123123 ",
    cycle: "",
    createTime: moment.utc(new Date()).local().format("YYYY-MM-DD HH:mm"),
  },
];

const SendNotice = () => {
  const {
    onSetting,
    onSend,
    onConfirm,
    onSendCancel,
    onNoticeCancel,
    noticeSettingRef,
    sendRecordRef,
  } = useAction();

  const asyncTootip = (title: string, styles: string) => {
    return (
      <Tooltip title={title} className={styles}>
        <span>{title}</span>
      </Tooltip>
    );
  };

  const columns: GridColDef[] = [
    {
      field: "title",
      headerName: "标题",
      width: 280,
      headerAlign: "center",
      disableColumnMenu: true,
      sortable: false,
      align: "center",
      headerClassName: styles.tableBoxHeader,
    },
    {
      field: "content",
      headerName: "内容",
      width: 300,
      headerAlign: "center",
      disableColumnMenu: true,
      sortable: false,
      align: "center",
      headerClassName: styles.tableBoxHeader,
      renderCell: (params: GridCellParams) =>
        asyncTootip(params.row.content, styles.tooltip),
    },
    {
      field: "cycle",
      headerName: "周期",
      width: 320,
      headerAlign: "center",
      disableColumnMenu: true,
      sortable: false,
      headerClassName: styles.tableBoxHeader,
    },
    {
      field: "createTime",
      headerName: "创建时间",
      width: 300,
      headerAlign: "center",
      disableColumnMenu: true,
      sortable: false,
      align: "center",
      headerClassName: styles.tableBoxHeader,
    },
    {
      field: "operate",
      headerName: "操作",
      flex: 1,
      headerAlign: "center",
      disableColumnMenu: true,
      sortable: false,
      headerClassName: styles.tableBoxHeader,
      renderCell: (params) => (
        <div className={styles.operate}>
          <p className={styles.text} onClick={onSetting}>
            【设置】
          </p>
          <p className={styles.text} onClick={onSend}>
            【发送记录】
          </p>
          <p className={styles.text} onClick={() => console.log(789)}>
            【删除】
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className={styles.tableWrap}>
      <div className={styles.tableBoxWrap}>
        <div className={styles.tableBox}>
          <div className={styles.createNoticeWrap}>
            <Button
              className={styles.createNotice}
              onClick={onSetting}
              variant="contained"
            >
              + 新建通知
            </Button>
          </div>
          <DataGrid
            rows={rows}
            columns={columns}
            showCellRightBorder
            showColumnRightBorder
            hideFooter={true}
            autoHeight={true}
          />
        </div>
      </div>

      <ModalBox
        ref={noticeSettingRef}
        onCancel={onSendCancel}
        title={"通知设置"}
        footerComponent={
          <div className={styles.boxButtonWrap}>
            <Button
              variant="contained"
              className={styles.boxButton}
              onClick={() => onConfirm()}
            >
              提交
            </Button>
            <Button
              variant="contained"
              className={styles.boxButton}
              onClick={() => onSendCancel()}
            >
              取消
            </Button>
          </div>
        }
      >
        <NoticeSetting />
      </ModalBox>

      <ModalBox
        ref={sendRecordRef}
        onCancel={onNoticeCancel}
        title={"发送记录"}
      >
        <SendRecord />
      </ModalBox>
    </div>
  );
};

export default SendNotice;

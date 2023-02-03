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
import { IMessageJobDto } from "../../dtos/enterprise";

const SendNotice = (props: { rowList: IMessageJobDto[] }) => {
  // const rowList = props;
  const {
    onSetting,
    onSend,
    onConfirm,
    onSendCancel,
    onNoticeCancel,
    noticeSettingRef,
    sendRecordRef,
    rowListChange,
    settingId,
    list,
  } = useAction(props.rowList);

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
      field: "commandJson",
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
      field: "jobSettingJson",
      headerName: "周期",
      width: 320,
      headerAlign: "center",
      disableColumnMenu: true,
      sortable: false,
      headerClassName: styles.tableBoxHeader,
    },
    {
      field: "createdDate",
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
          <p className={styles.text} onClick={() => onSend(params.row)}>
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
          <DataGrid
            rows={props.rowList}
            columns={columns}
            showCellRightBorder
            showColumnRightBorder
            rowHeight={56}
            style={{ height: 680 }}
            pageSize={10}
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
        <SendRecord list={list} />
      </ModalBox>
    </div>
  );
};

export default SendNotice;

import { Alert, Button, Tooltip } from "@mui/material"
import { DataGrid, GridCellParams, GridColDef } from "@mui/x-data-grid"
import styles from "./index.module.scss"
import moment from "moment"
import { useAction } from "./hook"
import ModalBox from "../../components/modal/modal"
import NoticeSetting from "./ components/notice-setting"
import SendRecord from "./ components/send-record"
import React from "react"
import { SendNoticeProps } from "./props"
import LoadingButton from "@mui/lab/LoadingButton"
import RestartAltIcon from "@mui/icons-material/RestartAlt"

const asyncTootip = (title: string, styles: string) => {
  return (
    <Tooltip title={title} className={styles}>
      <span>{title}</span>
    </Tooltip>
  )
}

const SendNotice = React.memo(
  (props: SendNoticeProps) => {
    const { dto, updateData, getMessageJob } = props

    const {
      noticeSettingRef,
      sendRecordRef,
      deleteConfirmRef,
      onSetting,
      onSend,
      onConfirm,
      onSendCancel,
      onNoticeCancel,
      onDeleteMessageJob,
      onDeleteMessageJobConfirm,
      sendRecordList,
      updateMessageJobInformation,
      alertShow,
      deleteId,
      loading,
      setLoading,
    } = useAction({ getMessageJob })

    const handleClick = async () => {
      setLoading.setTrue()
      getMessageJob()
      setTimeout(() => {
        setLoading.setFalse()
      }, 500)
    }

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
        field: "cronExpressionDescriptor",
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
        renderCell: (params: GridCellParams) =>
          moment(params.row.createdDate).format("YYYY/MM/DD mm:ss"),
      },
      {
        field: "operate",
        headerName: "操作",
        flex: 1,
        headerAlign: "center",
        disableColumnMenu: true,
        sortable: false,
        headerClassName: styles.tableBoxHeader,
        renderCell: (params: GridCellParams) => (
          <div className={styles.operate}>
            <p className={styles.text} onClick={() => onSetting(params.row)}>
              【设置】
            </p>
            <p
              className={styles.text}
              onClick={() =>
                onSend(params.row.toUsers, params.row.correlationId)
              }
            >
              【发送记录】
            </p>
            <p
              className={styles.text}
              onClick={() => onDeleteMessageJobConfirm(params.row.id)}
            >
              【删除】
            </p>
          </div>
        ),
      },
    ]

    return (
      <div className={styles.tableWrap}>
        {alertShow && (
          <Alert severity="error" className={styles.alert}>
            该MessageJob暂时设置不了!
          </Alert>
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            paddingTop: "0.5rem",
          }}
        >
          <LoadingButton
            onClick={handleClick}
            endIcon={<RestartAltIcon />}
            loading={loading}
            loadingPosition="end"
            variant="outlined"
          >
            <span>Loading</span>
          </LoadingButton>
        </div>

        <div className={styles.tableBoxWrap}>
          <div className={styles.tableBox}>
            <DataGrid
              rows={dto.messageJobs}
              columns={columns}
              pageSize={dto.pageSize}
              showCellRightBorder
              showColumnRightBorder
              rowsPerPageOptions={[5, 10, 15, 20]}
              disableSelectionOnClick
              pagination
              paginationMode="server"
              rowHeight={56}
              page={dto.page}
              style={{ height: 675, width: "100%" }}
              rowCount={dto.rowCount}
              onPageChange={(value) => updateData("page", value)}
              onPageSizeChange={(value) => updateData("pageSize", value)}
              loading={dto.loading}
            />
          </div>
        </div>

        <ModalBox
          ref={noticeSettingRef}
          onCancel={onNoticeCancel}
          title={"通知设置"}
          haveCloseIcon={false}
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
                onClick={onNoticeCancel}
              >
                取消
              </Button>
            </div>
          }
        >
          <>
            {!!updateMessageJobInformation && (
              <NoticeSetting
                updateMessageJobInformation={updateMessageJobInformation}
              />
            )}
          </>
        </ModalBox>

        <ModalBox
          ref={deleteConfirmRef}
          onCancel={() => deleteConfirmRef.current?.close()}
          haveCloseIcon={false}
          title={"确认删除"}
          footerComponent={
            <div className={styles.deleteBoxButtonWrap}>
              <Button
                variant="contained"
                className={styles.deleteBoxButton}
                onClick={() => onDeleteMessageJob(deleteId)}
              >
                确认
              </Button>
              <Button
                variant="contained"
                className={styles.deleteBoxButton}
                onClick={() => deleteConfirmRef.current?.close()}
              >
                取消
              </Button>
            </div>
          }
        >
          <div className={styles.deleteTextWrap}>
            <span>是否确认删除？</span>
          </div>
        </ModalBox>

        <ModalBox
          ref={sendRecordRef}
          onCancel={onSendCancel}
          title={"发送记录"}
        >
          <SendRecord sendRecordList={sendRecordList} />
        </ModalBox>
      </div>
    )
  },
  (prevProps, nextProps) => {
    return prevProps.dto === nextProps.dto
  }
)

export default SendNotice

import {
  Alert,
  AlertTitle,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Tooltip,
} from "@mui/material"
import { DataGrid, GridCellParams, GridColDef } from "@mui/x-data-grid"
import styles from "./index.module.scss"
import moment from "moment"
import { useAction } from "./hook"
import ModalBox from "../../components/modal/modal"
import NoticeSetting from "./ components/notice-setting"
import SendRecord from "./ components/send-record"
import React from "react"
import LoadingButton from "@mui/lab/LoadingButton"
import RestartAltIcon from "@mui/icons-material/RestartAlt"
import { MessageJobDestination } from "../../dtos/enterprise"
import SendEmail from "../email"
import { RequestBody } from "../request/component/body"

const asyncTootip = (title: string, styles: string) => {
  return (
    <Tooltip title={title} className={styles}>
      <span>{title}</span>
    </Tooltip>
  )
}

const SendNotice = React.memo(
  (props: { recordType: MessageJobDestination }) => {
    const { recordType } = props
    const {
      noticeSettingRef,
      sendRecordRef,
      deleteConfirmRef,
      onSetting,
      onSend,
      onSendCancel,
      onNoticeCancel,
      onDeleteMessageJob,
      onDeleteMessageJobConfirm,
      sendRecordList,
      updateMessageJobInformation,
      alertShow,
      deleteShow,
      deleteId,
      loading,
      setLoading,
      dto,
      getMessageJob,
      updateData,
      onUpdateMessageJob,
      failSend,
      promptText,
      openError,
      showErrorPrompt,
      onEmailSetting,
      handleEmailConfirm,
      handleEmailCancel,
      showEmail,
      outterGetUpdateData,
      recordRowLoading,
      showRequest,
      handleRequestState,
      onRequestSetting,
      handleRequestConfirm,
      setRequestUpdateData,
      updateRequestData,
    } = useAction(recordType)

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
        cellClassName: (params: GridCellParams) =>
          params.row.hasException && styles.deletedColor,
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
        cellClassName: (params: GridCellParams) =>
          params.row.hasException && styles.deletedColor,
        renderCell: (params: GridCellParams) =>
          asyncTootip(params.row.content, styles.tooltip),
      },
      {
        field: "jobCronExpressionDesc",
        headerName: "周期",
        width: 320,
        headerAlign: "center",
        align: "center",
        disableColumnMenu: true,
        sortable: false,
        headerClassName: styles.tableBoxHeader,
        cellClassName: (params: GridCellParams) =>
          params.row.hasException && styles.deletedColor,
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
        cellClassName: (params: GridCellParams) =>
          params.row.hasException && styles.deletedColor,
        renderCell: (params: GridCellParams) =>
          moment(params.row.createdDate).format("YYYY/MM/DD HH:mm"),
      },
      {
        field: "sendType",
        headerName: "发送类型",
        width: 200,
        headerAlign: "center",
        disableColumnMenu: true,
        sortable: false,
        align: "center",
        headerClassName: styles.tableBoxHeader,
        cellClassName: (params: GridCellParams) =>
          params.row.hasException && styles.deletedColor,
      },
      {
        field: "operate",
        headerName: "操作",
        flex: 1,
        headerAlign: "center",
        disableColumnMenu: true,
        sortable: false,
        headerClassName: styles.tableBoxHeader,
        cellClassName: (params: GridCellParams) =>
          params.row.hasException && styles.deletedColor,
        renderCell: (params: GridCellParams) => (
          <div className={styles.operate}>
            <p
              className={styles.text}
              onClick={() => {
                recordType === MessageJobDestination.WorkWeChat
                  ? onSetting(params.row)
                  : recordType === MessageJobDestination.Email
                  ? onEmailSetting(params.row)
                  : onRequestSetting(params.row)
              }}
            >
              【设置】
            </p>
            <p
              className={styles.text}
              onClick={() => {
                const appNot = params.row.workWeChatAppNotification
                onSend(
                  recordType === MessageJobDestination.WorkWeChat
                    ? [
                        ...(appNot.toParties ? appNot.toParties : []),
                        ...(appNot.toTags ? appNot.toTags : []),
                        ...(appNot.toUsers ? appNot.toUsers : []),
                        [params.row.groupName],
                      ].join(";")
                    : "",
                  params.row.correlationId
                )
              }}
            >
              【发送记录】
            </p>
            <p
              className={styles.text}
              onClick={() =>
                onDeleteMessageJobConfirm(params.row.id, params.row.isDelete)
              }
            >
              【删除】
            </p>
          </div>
        ),
      },
    ]

    return (
      <div className={styles.tableWrap}>
        <Snackbar
          message={promptText}
          open={openError}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        />
        <Snackbar
          open={failSend}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <Alert severity="error">
            <AlertTitle>Failed to send</AlertTitle>
          </Alert>
        </Snackbar>
        {alertShow && (
          <Alert severity="error" className={styles.alert}>
            即时发送类型不能设置!
          </Alert>
        )}
        {deleteShow && (
          <Alert severity="error" className={styles.alert}>
            该条发送记录已被删除,不能做任何操作!
          </Alert>
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            paddingTop: "1rem",
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
              style={{ height: 675, width: "95%" }}
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
        >
          <>
            {!!updateMessageJobInformation && (
              <NoticeSetting
                updateMessageJobInformation={updateMessageJobInformation}
                onNoticeCancel={onNoticeCancel}
                onUpdateMessageJob={onUpdateMessageJob}
                showErrorPrompt={showErrorPrompt}
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
          <SendRecord
            loading={recordRowLoading}
            sendRecordList={sendRecordList}
          />
        </ModalBox>

        <Dialog
          open={showEmail}
          PaperProps={{
            sx: {
              maxWidth: "65rem",
            },
          }}
        >
          <DialogTitle>邮件设置</DialogTitle>
          <DialogContent>
            <SendEmail
              emailUpdateData={updateMessageJobInformation}
              outterGetUpdateData={outterGetUpdateData}
            />
          </DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={handleEmailConfirm}>
              提交
            </Button>
            <Button onClick={handleEmailCancel}>取消</Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={showRequest}
          PaperProps={{
            sx: {
              maxWidth: "50rem",
            },
          }}
        >
          <DialogTitle>请求设置</DialogTitle>
          <DialogContent>
            <RequestBody
              addOrUpdate={"Update"}
              updateMessageJobInformation={updateMessageJobInformation}
              updateRequestData={updateRequestData}
            />
          </DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={handleRequestConfirm}>
              保存
            </Button>
            <Button onClick={() => handleRequestState(false)}>取消</Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
)

export default SendNotice

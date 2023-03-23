import { Box, Tooltip } from "@mui/material"
import { DataGrid, GridCellParams, GridColumns } from "@mui/x-data-grid"
import moment from "moment"
import { memo } from "react"
import { MessageSendResult } from "../../../../dtos/enterprise"
import styles from "./index.module.scss"
import { SendRecordProps } from "./props"

const asyncTootip = (
  title: string,
  styles: string,
  result?: MessageSendResult
) => {
  return (
    result !== MessageSendResult.Ok && (
      <Tooltip title={title} className={styles}>
        <span>{title}</span>
      </Tooltip>
    )
  )
}

const SendRecord = memo(
  (props: SendRecordProps) => {
    const { loading, sendRecordList } = props

    const columns: GridColumns = [
      {
        field: "createdDate",
        headerName: "发送时间",
        type: "string",
        headerAlign: "center",
        align: "center",
        disableColumnMenu: true,
        sortable: false,
        width: 150,
        renderCell: (params: GridCellParams) =>
          moment(params.row.createdDate).format("YYYY/MM/DD HH:mm"),
        cellClassName: (params: GridCellParams) => {
          if (params.row.errorSendtheobject !== "") {
            return styles.deletedColor
          }
          return ""
        },
      },
      {
        field: "sendTheObject",
        headerName: "对象",
        type: "string",
        editable: false,
        headerAlign: "center",
        align: "center",
        disableColumnMenu: true,
        sortable: false,
        flex: 1,
        renderCell: (params: GridCellParams) =>
          asyncTootip(params.row.sendTheObject, styles.title),
        cellClassName: (params: GridCellParams) => {
          if (params.row.errorSendtheobject !== "") {
            return styles.deletedColor
          }
          return ""
        },
      },
      {
        field: "state",
        headerName: "状态",
        type: "string",
        editable: false,
        headerAlign: "center",
        align: "center",
        disableColumnMenu: true,
        sortable: false,
        width: 100,
        cellClassName: (params: GridCellParams) => {
          if (params.row.errorSendtheobject !== "") {
            return styles.deletedColor
          }
          return ""
        },
      },
      {
        field: "errorSendtheobject",
        headerName: "异常",
        type: "string",
        editable: false,
        headerAlign: "center",
        align: "center",
        disableColumnMenu: true,
        sortable: false,
        flex: 1,
        renderCell: (params: GridCellParams) =>
          asyncTootip(
            params.row.errorSendtheobject,
            styles.title,
            params.row.result
          ),
        cellClassName: (params: GridCellParams) => {
          if (params.row.errorSendtheobject !== "") {
            return styles.deletedColor
          }
          return ""
        },
      },
    ]

    return (
      <Box className={styles.tableWrap}>
        <DataGrid
          loading={loading}
          showCellRightBorder
          showColumnRightBorder
          rows={sendRecordList}
          columns={columns}
          paginationMode="client"
          pageSize={10}
          rowsPerPageOptions={[5, 10, 15, 20]}
          style={{ height: 680 }}
        />
      </Box>
    )
  },
  (prevProps, nextProps) => {
    return prevProps.sendRecordList === nextProps.sendRecordList
  }
)

export default SendRecord

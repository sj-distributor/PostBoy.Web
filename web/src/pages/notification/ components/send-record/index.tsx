import { Box, Tooltip } from "@mui/material"
import { DataGrid, GridCellParams, GridColumns } from "@mui/x-data-grid"
import { useEffect, useState } from "react"
import { GetMessageJobRecords } from "../../../../api/enterprise"
import { IMessageJobRecord, ISendRecordDto } from "../../../../dtos/enterprise"
// import useAction from "../../../main/components/user-information/hook";
import styles from "./index.module.scss"

const SendRecord = (props: { list: ISendRecordDto[] }) => {
  // const {} = useActiosn();
  // const [list, setList] = useState<any>();
  // useEffect(() => {
  //   !!settingId &&
  //     GetMessageJobRecords(settingId).then((res) => {
  //       setList(res);
  //       console.log("res", res);
  //     });
  // }, [settingId]);

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
    },
    {
      field: "responseJson",
      headerName: "对象",
      type: "string",
      editable: false,
      headerAlign: "center",
      align: "center",
      disableColumnMenu: true,
      sortable: false,
      flex: 1,
      renderCell: (params: GridCellParams) =>
        asyncTootip(params.row.object, styles.title),
    },
    {
      field: "result",
      headerName: "状态",
      type: "MessageSendResult",
      editable: false,
      headerAlign: "center",
      align: "center",
      disableColumnMenu: true,
      sortable: false,
      width: 100,
    },
    {
      field: "abnormal",
      headerName: "异常",
      type: "string",
      editable: false,
      headerAlign: "center",
      align: "center",
      disableColumnMenu: true,
      sortable: false,
      flex: 1,
      renderCell: (params: GridCellParams) =>
        asyncTootip(params.row.abnormal, styles.title),
    },
  ]

  const asyncTootip = (title: string, styles: string) => {
    return (
      <Tooltip title={title} className={styles}>
        <span>{title}</span>
      </Tooltip>
    )
  }

  return (
    <Box className={styles.tableWrap}>
      {/* <DataGrid
        showCellRightBorder={true}
        showColumnRightBorder={true}
        rows={list.data}
        columns={columns}
        hideFooter={true}
        autoHeight={true}
      /> */}
    </Box>
  )
}

export default SendRecord

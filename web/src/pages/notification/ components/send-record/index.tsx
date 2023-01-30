import { Box, Tooltip } from "@mui/material";
import { DataGrid, GridCellParams, GridColumns } from "@mui/x-data-grid";
import styles from "./index.module.scss";

const SendRecord = () => {
  const columns: GridColumns = [
    {
      field: "sendTime",
      headerName: "发送时间",
      type: "string",
      headerAlign: "center",
      align: "center",
      disableColumnMenu: true,
      sortable: false,
      width: 150,
    },
    {
      field: "object",
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
      field: "status",
      headerName: "状态",
      type: "string",
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
  ];

  const rows = [
    {
      id: 1,
      sendTime: "2022/12/01 11:15",
      object: "系统数据组;JOHN.H;SHERMY@SJFOOD.COM",
      status: "已发送",
      abnormal: "",
    },
    {
      id: 2,
      sendTime: "2022/12/01 11:15",
      object: "系统数据组;JOHN.H;SHERMY@SJFOOD.COM",
      status: "已发送",
      abnormal: "",
    },
    {
      id: 3,
      sendTime: "2022/12/01 11:15",
      object: "系统数据组;JOHN.H",
      status: "已发送",
      abnormal: "",
    },
    {
      id: 4,
      sendTime: "2022/12/01 11:15",
      object: "系统数据组;JOHN.H;SHERMY@SJFOOD.COM",
      status: "已发送",
      abnormal: "",
    },
    {
      id: 5,
      sendTime: "2022/12/01 11:15",
      object: "系统数据组;JOHN.H;SHERMY@SJFOOD.COM",
      status: "已发送",
      abnormal: "",
    },
    {
      id: 6,
      sendTime: "2022/12/01 11:13",
      object: "系统数据组;JOHN.H;SHERMY@SJFOOD.COM",
      status: "已发送",
      abnormal: "",
    },
    {
      id: 7,
      sendTime: "2022/12/01 11:15",
      object: "系统数据组;JOHN.H;SHERMY@SJFOOD.COM1111111111111111111111",
      status: "已发送",
      abnormal: "",
    },
    {
      id: 8,
      sendTime: "2022/12/01 11:15",
      object: "系统数据组;JOHN.H;SHERMY@SJFOOD.COM",
      status: "已发送",
      abnormal: "未成功发送对象:JONH.H",
    },
    {
      id: 9,
      sendTime: "2022/12/019",
      object: "系统数据组;JOHN.H;SHERMY@SJFOOD.COM",
      status: "已发送",
      abnormal: "未成功发送对象:JONH.H",
    },
    {
      id: 10,
      sendTime: "2022/12/0110",
      object: "系统数据组;JOHN.H;SHERMY@SJFOOD.COM",
      status: "已发送",
      abnormal: "未成功发送对象:JONH.H",
    },
  ];

  const asyncTootip = (title: string, styles: string) => {
    return (
      <Tooltip title={title} className={styles}>
        <span>{title}</span>
      </Tooltip>
    );
  };

  return (
    <Box className={styles.tableWrap}>
      <DataGrid
        showCellRightBorder={true}
        showColumnRightBorder={true}
        rows={rows}
        columns={columns}
        hideFooter={true}
        autoHeight={true}
      />
    </Box>
  );
};

export default SendRecord;

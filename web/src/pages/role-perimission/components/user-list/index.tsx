import styles from "./index.module.scss";

import { Button, IconButton, Pagination, TextField } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import { useAction } from "./hook";

export const UserList = () => {
  const { rows, inputVal, handleInputChange, handleSearch, handleDelete } =
    useAction();

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "用戶名",
      width: 300,
    },
    {
      field: "date",
      headerName: "更新時間",
      width: 600,
    },
    {
      field: "actions",
      headerName: "操作",
      width: 150,
      renderCell: (params) => (
        <Button variant="text" onClick={() => handleDelete(params.row.id)}>
          移除
        </Button>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.nav}>
        <div className={styles.navTitle}>用戶列表</div>
        <div className={styles.navSearch}>
          <TextField
            className={styles.navInput}
            size="small"
            variant="outlined"
            placeholder="搜索用戶名"
            fullWidth
            autoComplete="off"
            value={inputVal}
            onChange={handleInputChange}
          />
          <div className={styles.navIcon}>
            <IconButton aria-label="Search" onClick={handleSearch}>
              <SearchIcon className={styles.navFont} />
            </IconButton>
          </div>
        </div>
        <div className={styles.navBtn}>
          <Button className={styles.btn} variant="contained">
            添加用戶
          </Button>
          <Button className={styles.btnDel} variant="contained">
            批量移除
          </Button>
          <Button className={styles.btn} variant="outlined">
            返回
          </Button>
        </div>
      </div>
      <div className={styles.content}>
        <DataGrid
          columns={columns}
          rows={rows}
          hideFooter
          checkboxSelection
          disableColumnMenu
        />
      </div>
      <div className={styles.footer}>
        <Pagination count={10} shape="rounded" color="primary" />
      </div>
    </div>
  );
};

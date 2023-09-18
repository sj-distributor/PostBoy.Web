import styles from "./index.module.scss";

import { Button, IconButton, Pagination, TextField } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import { useAction } from "./hook";
import ModalBox from "../../../../components/modal/modal";
import { AddUsersModel } from "./components/add-users-model";

export const UserList = () => {
  const {
    rows,
    inputVal,
    addUsersRef,
    onAddUsersCancel,
    handleInputChange,
    handleSearch,
    handleDelete,
  } = useAction();

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "用户名",
      width: 300,
    },
    {
      field: "date",
      headerName: "更新时间",
      width: 600,
    },
    {
      field: "actions",
      headerName: "操作",
      width: 150,
      renderCell: (params) => (
        <div>
          <Button
            variant="text"
            color="secondary"
            onClick={() => handleDelete(params.row.name)}
          >
            移除
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.nav}>
        <div className={styles.navTitle}>用户列表</div>
        <div className={styles.navSearch}>
          <TextField
            className={styles.navInput}
            size="small"
            variant="outlined"
            placeholder="搜索用户名"
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
          <ModalBox ref={addUsersRef} onCancel={onAddUsersCancel}>
            <AddUsersModel />
          </ModalBox>
          <Button
            className={styles.btn}
            variant="contained"
            onClick={() => {
              addUsersRef.current?.open();
            }}
          >
            添加用户
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
          // rowSelection={false}
        />
      </div>
      <div className={styles.footer}>
        <Pagination count={10} shape="rounded" color="primary" />
      </div>
    </div>
  );
};

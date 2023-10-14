import styles from "./index.module.scss";

import { Button, IconButton, Pagination, TextField } from "@mui/material";
import { DataGrid, GridColDef, GridSelectionModel } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import { useAction } from "./hook";
import ModalBox from "../../../../components/modal/modal";
import { AddUsersModel } from "../add-users-model";

export const UserList = () => {
  const {
    rows,
    inputVal,
    addUsersRef,
    navigate,
    setSelectId,
    handleInputChange,
    handleSearch,
    handleDelete,
    batchDelete,
  } = useAction();

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
          <ModalBox
            ref={addUsersRef}
            onCancel={() => addUsersRef.current?.close()}
            headComponent={<></>}
          >
            <AddUsersModel addUsersRef={addUsersRef} />
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
          <Button
            className={styles.btnDel}
            variant="contained"
            onClick={batchDelete}
          >
            批量移除
          </Button>
          <Button
            className={styles.btn}
            variant="outlined"
            onClick={() => navigate("/roles/roleList")}
          >
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
          onSelectionModelChange={(selectionModel: GridSelectionModel) =>
            setSelectId(selectionModel)
          }
        />
      </div>
      <div className={styles.footer}>
        <Pagination count={10} shape="rounded" color="primary" />
      </div>
    </div>
  );
};

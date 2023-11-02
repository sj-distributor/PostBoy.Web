import styles from "./index.module.scss";

import { Button, IconButton, Pagination, TextField } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import { useAction } from "./hook";
import ModalBox from "../../../../components/modal/modal";
import { AddUsersModel } from "../add-users-model";
import moment from "moment";

export const UserList = () => {
  const {
    inputVal,
    addUsersRef,
    pageDto,
    userData,
    selectId,
    navigate,
    setSelectId,
    handleInputChange,
    handleSearch,
    handleDelete,
    setPageDto,
  } = useAction();

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "用戶名",
      width: 300,
    },
    {
      field: "modifiedDate",
      headerName: "更新時間",
      width: 600,
      renderCell: (params) =>
        moment(params.row.modifiedDate).format("YYYY-MM-DD HH:mm:ss") ??
        moment(params.row.createdDate).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      field: "actions",
      headerName: "操作",
      width: 150,
      renderCell: (params) => (
        <Button variant="text" onClick={() => handleDelete([params.row.id])}>
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
            onClick={() => handleDelete(selectId)}
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
          rows={userData.roleUsers}
          hideFooter
          checkboxSelection
          disableColumnMenu
          onSelectionModelChange={(selectionModel) => {
            console.log(selectionModel);

            setSelectId(selectionModel as string[]);
          }}
        />
      </div>
      <div className={styles.footer}>
        <Pagination
          page={pageDto.PageIndex}
          count={userData.count}
          onChange={(event, page) => {
            setPageDto((prev) => ({ ...prev, PageIndex: page }));
          }}
        />
      </div>
    </div>
  );
};

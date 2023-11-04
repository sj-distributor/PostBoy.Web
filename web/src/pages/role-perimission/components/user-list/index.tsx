import styles from "./index.module.scss";

import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  IconButton,
  Pagination,
  TextField,
} from "@mui/material";
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
    loading,
    openConfirm,
    openConfirmAction,
    batchBtnDisable,
    roleId,
    navigate,
    setSelectId,
    handleSearch,
    handleDelete,
    setPageDto,
    setInputVal,
    initUserList,
    updatePageDto,
  } = useAction();

  const columns: GridColDef[] = [
    {
      field: "userName",
      headerName: "用戶名",
      width: 300,
      sortable: false,
    },
    {
      field: "modifiedDate",
      headerName: "更新時間",
      width: 600,
      sortable: false,
      renderCell: (params) =>
        moment(params.row.modifiedDate).format("YYYY-MM-DD HH:mm:ss") ??
        moment(params.row.createdDate).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      field: "actions",
      headerName: "操作",
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Button
          variant="text"
          onClick={() => {
            setSelectId([params.row.id]);
            openConfirmAction.setTrue();
          }}
        >
          移除
        </Button>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <Dialog
        PaperProps={{
          style: {
            width: "500px",
          },
        }}
        open={openConfirm}
        onClose={() => openConfirmAction.setFalse()}
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            确定移除选中用户吗？
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => openConfirmAction.setFalse()}>取消</Button>
          <Button onClick={() => handleDelete()}>确定</Button>
        </DialogActions>
      </Dialog>

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
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(event) =>
              event.key === "Enter" &&
              inputVal &&
              updatePageDto("Keyword", inputVal)
            }
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
            <AddUsersModel
              addUsersRef={addUsersRef}
              initUserList={initUserList}
              roleId={roleId}
            />
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
            disabled={batchBtnDisable}
            onClick={() => openConfirmAction.setTrue()}
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
          pageSize={pageDto.PageSize}
          page={pageDto.PageIndex}
          showCellRightBorder
          showColumnRightBorder
          disableSelectionOnClick
          pagination
          paginationMode="server"
          rowCount={userData.count}
          checkboxSelection
          disableColumnMenu
          loading={loading}
          onPageChange={(value) => updatePageDto("PageIndex", value)}
          onPageSizeChange={(value) => updatePageDto("PageSize", value)}
          onSelectionModelChange={(selectionModel) => {
            setSelectId(selectionModel as string[]);
          }}
        />
      </div>
    </div>
  );
};

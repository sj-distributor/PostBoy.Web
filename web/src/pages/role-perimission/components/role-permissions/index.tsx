import styles from "./index.module.scss";

import {
  Button,
  IconButton,
  Pagination,
  Snackbar,
  TextField,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import { useAction } from "./hook";
import { UserRoleEnum } from "../../../../dtos/role";
import ModalBox from "../../../../components/modal/modal";
import ErrorIcon from "@mui/icons-material/Error";

export const RolePermissions = () => {
  const {
    userId,
    rows,
    inputVal,
    rowId,
    confirmTipsRef,
    tipsText,
    navigate,
    setRowId,
    handleInputChange,
    handleSearch,
    handleDelete,
  } = useAction();

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "角色名稱",
      width: 300,
    },
    {
      field: "details",
      headerName: "角色描述",
      width: 600,
    },
    {
      field: "actions",
      headerName: "操作",
      width: 300,
      renderCell: (params) => {
        return params.row.role === UserRoleEnum.SuperAdmin ? (
          <Button variant="text" onClick={() => navigate("/roles/userList")}>
            分配
          </Button>
        ) : params.row.role === UserRoleEnum.User ? (
          <Button
            variant="text"
            onClick={() => navigate(`/roles/edit/${userId}`)}
          >
            編輯
          </Button>
        ) : (
          <>
            <Button variant="text" onClick={() => navigate("/roles/userList")}>
              分配
            </Button>
            <Button
              variant="text"
              onClick={() => navigate(`/roles/edit/${userId}`)}
            >
              編輯
            </Button>
            <Button
              variant="text"
              disabled
              onClick={() => {
                confirmTipsRef.current?.open();
                setRowId(params.row.id);
              }}
            >
              刪除
            </Button>
          </>
        );
      },
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.nav}>
        <div className={styles.navTitle}>角色權限</div>
        <div className={styles.navSearch}>
          <TextField
            className={styles.navInput}
            size="small"
            variant="outlined"
            placeholder="搜索角色名稱"
            fullWidth
            autoComplete="off"
            value={inputVal}
            onChange={handleInputChange}
            onKeyDown={(event) =>
              event.key === "Enter" && inputVal && handleSearch()
            }
          />
          <div className={styles.navIcon}>
            <IconButton
              aria-label="Search"
              onClick={() => inputVal && handleSearch()}
            >
              <SearchIcon className={styles.navFont} />
            </IconButton>
          </div>
        </div>
        <div className={styles.navBtn}>
          <Button variant="contained" onClick={() => navigate(`/roles/add`)}>
            新增角色
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
      <ModalBox
        ref={confirmTipsRef}
        onCancel={() => confirmTipsRef.current?.close()}
        headComponent={<></>}
      >
        <div className={styles.deleteBox}>
          <div className={styles.confirmBox}>
            <ErrorIcon sx={{ color: "red", fontSize: 26 }} />
            <div className={styles.title}>確認刪除角色?</div>
          </div>
          <div className={styles.buttonBox}>
            <Button
              variant="outlined"
              onClick={() => confirmTipsRef.current?.close()}
              className={styles.cancelButton}
            >
              取消
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                rowId && handleDelete([rowId]);
                confirmTipsRef.current?.close();
              }}
              className={styles.confirmButton}
            >
              確定刪除
            </Button>
          </div>
        </div>
      </ModalBox>
      <Snackbar
        message={tipsText}
        open={!!tipsText}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      />
    </div>
  );
};

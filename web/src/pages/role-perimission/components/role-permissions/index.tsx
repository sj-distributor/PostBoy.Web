import styles from "./index.module.scss";
import { Button, IconButton, TextField } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import { useAction } from "./hook";
import ModalBox from "../../../../components/modal/modal";
import ErrorIcon from "@mui/icons-material/Error";

// return params.row.role === UserRoleEnum.SuperAdmin ? (
//   <Button
//     variant="text"
//     onClick={() => navigate(`/roles/userList/${params.id}`)}
//   >
//     分配
//   </Button>
// ) : params.row.role === UserRoleEnum.User ? (
//   <Button
//     variant="text"
//     onClick={() => navigate(`/roles/edit/${params.id}`)}
//   >
//     編輯
//   </Button>
// ) : (
//   <>
//     <Button
//       variant="text"
//       onClick={() => navigate(`/roles/userList/${params.id}`)}
//     >
//       分配
//     </Button>
//     <Button
//       variant="text"
//       onClick={() => navigate(`/roles/edit/${params.id}`)}
//     >
//       編輯
//     </Button>
//     <Button
//       variant="text"
//       // disabled
//       onClick={() => {
//         confirmTipsRef.current?.open();
//         setRoleId(params.row.id);
//       }}
//     >
//       刪除
//     </Button>
//   </>
// );

export const RolePermissions = () => {
  const {
    confirmTipsRef,
    navigate,
    pageDto,
    updatePageDto,
    roleDto,
    loading,
    roleId,
    setRoleId,
    deleteRole,
    inputVal,
    setInputVal,
  } = useAction();

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "角色名稱",
      width: 300,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: "description",
      headerName: "角色描述",
      width: 600,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: "action",
      headerName: "操作",
      width: 300,
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params) => {
        return <div>123</div>;
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
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(event) =>
              event.key === "Enter" &&
              inputVal &&
              updatePageDto("keyword", inputVal)
            }
          />
          <div className={styles.navIcon}>
            <IconButton
              aria-label="Search"
              onClick={() => inputVal && updatePageDto("keyword", inputVal)}
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
          rows={roleDto.roles}
          columns={columns}
          pageSize={pageDto.pageSize}
          page={pageDto.pageIndex}
          showCellRightBorder
          showColumnRightBorder
          rowsPerPageOptions={[5, 10, 15, 20]}
          disableSelectionOnClick
          pagination
          paginationMode="server"
          rowCount={roleDto.count}
          onPageChange={(value) => updatePageDto("pageIndex", value)}
          onPageSizeChange={(value) => updatePageDto("pageSize", value)}
          loading={loading}
        />
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
                roleId && deleteRole(roleId);
                confirmTipsRef.current?.close();
              }}
              className={styles.confirmButton}
            >
              確定刪除
            </Button>
          </div>
        </div>
      </ModalBox>
    </div>
  );
};

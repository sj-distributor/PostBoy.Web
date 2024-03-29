import styles from "./index.module.scss";

import {
  Button,
  IconButton,
  InputAdornment,
  OutlinedInput,
  TextField,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import { useAction } from "./hook";
import ModalBox from "../../../../components/modal/modal";
import ErrorIcon from "@mui/icons-material/Error";
import { UserRoleEnum } from "../../../../dtos/role-user-permissions";
import { Search } from "@mui/icons-material";

export const RolePermissions = () => {
  const {
    rowId,
    confirmTipsRef,
    pageDto,
    loading,
    roleDto,
    handleRoleAssignmentDebounce,
    handleEditRoleDebounce,
    handleRemoveRoleDebounce,
    handleAddRole,
    updatePageDto,
    deleteRole,
    loadRoles,
  } = useAction();

  const columns: GridColDef[] = [
    {
      field: "displayName",
      headerName: "角色名稱",
      flex: 1,
    },
    {
      field: "description",
      headerName: "角色描述",
      flex: 2,
    },
    {
      field: "actions",
      headerName: "操作",
      flex: 1,
      renderCell: (params) => {
        switch (params.row.name) {
          case UserRoleEnum.Administrator:
            return (
              <Button
                variant="text"
                onClick={() =>
                  handleRoleAssignmentDebounce(params.row.name, params.row.id)
                }
              >
                分配
              </Button>
            );

          case UserRoleEnum.DefaultUser:
            return (
              <Button
                variant="text"
                onClick={() =>
                  handleEditRoleDebounce(params.row.name, params.row.id)
                }
              >
                編輯
              </Button>
            );
          case UserRoleEnum.Admin:
            return (
              <>
                <Button
                  variant="text"
                  onClick={() =>
                    handleRoleAssignmentDebounce(params.row.name, params.row.id)
                  }
                >
                  分配
                </Button>
                <Button
                  variant="text"
                  onClick={() =>
                    handleEditRoleDebounce(params.row.name, params.row.id)
                  }
                >
                  編輯
                </Button>
              </>
            );

          default:
            return (
              <>
                <Button
                  variant="text"
                  onClick={() =>
                    handleRoleAssignmentDebounce(params.row.name, params.row.id)
                  }
                >
                  分配
                </Button>
                <Button
                  variant="text"
                  onClick={() =>
                    handleEditRoleDebounce(params.row.name, params.row.id)
                  }
                >
                  編輯
                </Button>
                <Button
                  variant="text"
                  onClick={() =>
                    handleRemoveRoleDebounce(params.row.name, params.row.id)
                  }
                >
                  刪除
                </Button>
              </>
            );
        }
      },
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.nav}>
        <div className={styles.navTitle}>角色權限</div>
        <div className={styles.navSearch}>
          <OutlinedInput
            id="outlined-adornment-password"
            type="text"
            size="small"
            autoComplete="off"
            sx={{ minWidth: 160 }}
            onChange={(e) => updatePageDto("keyword", e.target.value)}
            onKeyDown={(event) => event.key === "Enter" && loadRoles()}
            placeholder="搜索角色名稱"
            endAdornment={
              <InputAdornment position="end">
                <IconButton aria-label="toggle password visibility" edge="end">
                  <Search />
                </IconButton>
              </InputAdornment>
            }
          />
          <Button
            variant="contained"
            component="label"
            sx={{ marginLeft: "0.5rem" }}
            onClick={() => loadRoles()}
          >
            搜索
          </Button>
        </div>
        <div className={styles.navBtn}>
          <Button variant="contained" onClick={() => handleAddRole()}>
            新增角色
          </Button>
        </div>
      </div>
      <div className={styles.content}>
        <DataGrid
          rows={roleDto.rolePermissionData.map((item) => item.role)}
          columns={columns}
          pageSize={pageDto.pageSize}
          page={pageDto.pageIndex}
          showCellRightBorder
          showColumnRightBorder
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
                rowId && deleteRole(rowId);
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

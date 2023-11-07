import styles from "./index.module.scss";

import { Button, IconButton, TextField } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import { useAction } from "./hook";
import { UserRoleEnum } from "../../../../dtos/role";
import ModalBox from "../../../../components/modal/modal";
import ErrorIcon from "@mui/icons-material/Error";
import { useSnackbar } from "notistack";
import { useDebounceFn } from "ahooks";
export const RolePermissions = () => {
  const {
    rowId,
    confirmTipsRef,
    pageDto,
    loading,
    roleDto,
    userRoleData,
    updatePageDto,
    navigate,
    setRowId,
    deleteRole,
    loadRoles,
  } = useAction();
  const { enqueueSnackbar } = useSnackbar();

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "角色名稱",
      width: 300,
    },
    {
      field: "description",
      headerName: "角色描述",
      width: 600,
    },
    {
      field: "actions",
      headerName: "操作",
      width: 300,
      renderCell: (params) => {
        switch (params.row.displayName) {
          case UserRoleEnum.Administrator:
            return (
              <Button
                variant="text"
                onClick={() => {
                  if (
                    userRoleData.some((item) => item.role === params.row.name)
                  ) {
                    navigate("/roles/userList");
                  } else {
                    enqueueSnackbar("没有权限分配", {
                      variant: "info",
                    });
                  }
                }}
              >
                分配
              </Button>
            );

          case UserRoleEnum.DefaultUser:
            return (
              <Button
                variant="text"
                onClick={() => {
                  if (
                    userRoleData.some((item) => item.role === params.row.name)
                  ) {
                    navigate(`/roles/edit/${params.row.id}`);
                  } else {
                    enqueueSnackbar("没有编辑角色权限", {
                      variant: "info",
                    });
                  }
                }}
              >
                編輯
              </Button>
            );

          default:
            return (
              <>
                <Button
                  variant="text"
                  onClick={() => {
                    if (
                      userRoleData.some((item) => item.role === params.row.name)
                    ) {
                      navigate("/roles/userList");
                    } else {
                      enqueueSnackbar("没有权限分配", {
                        variant: "info",
                      });
                    }
                  }}
                >
                  分配
                </Button>
                <Button
                  variant="text"
                  onClick={() => {
                    if (
                      userRoleData.some((item) => item.role === params.row.name)
                    ) {
                      navigate(`/roles/edit/${params.row.id}`);
                    } else {
                      enqueueSnackbar("没有编辑角色权限", {
                        variant: "info",
                      });
                    }
                  }}
                >
                  編輯
                </Button>
                <Button
                  variant="text"
                  onClick={() => {
                    if (
                      userRoleData.some((item) => item.role === params.row.name)
                    ) {
                      confirmTipsRef.current?.open();
                      setRowId(params.row.id);
                    } else {
                      enqueueSnackbar("没有删除角色权限", {
                        variant: "info",
                      });
                    }
                  }}
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
          <TextField
            className={styles.navInput}
            size="small"
            variant="outlined"
            placeholder="搜索角色名稱"
            fullWidth
            autoComplete="off"
            value={pageDto.keyword}
            onChange={(e) => updatePageDto("keyword", e.target.value)}
            onKeyDown={(event) => event.key === "Enter" && loadRoles()}
          />
          <div className={styles.navIcon}>
            <IconButton aria-label="Search" onClick={() => loadRoles()}>
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
                rowId && deleteRole(String(rowId));
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

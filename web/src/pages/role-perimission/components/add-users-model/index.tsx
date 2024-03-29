import { Button, CircularProgress, TextField } from "@mui/material";
import styles from "./index.module.scss";
import CloseIcon from "@mui/icons-material/Close";
import { useAction } from "./hook";
import { ModalBoxRef } from "../../../../dtos/modal";
import { RefObject } from "react";
import { TreeNode } from "./props";
import { TreeSelectList } from "../tree-select";

export const AddUsersModel = (props: {
  addUsersRef: RefObject<ModalBoxRef>;
  roleId: string;
  initUserList: () => void;
}) => {
  const { addUsersRef, initUserList, roleId } = props;

  const {
    treeData,
    searchValue,
    handleSearchChange,
    treeSelectRef,
    alreadySelectData,
    isConfirmDisbale,
    setAlreadySelectData,
    handleAddRoleUsers,
    totalRoleUserList,
    isTreeLoading,
    isAddUserLoading,
  } = useAction({ addUsersRef, roleId, initUserList });

  return (
    <div className={styles.modelWrap}>
      <div className={styles.leftGroupBox}>
        <TextField
          sx={{
            input: {
              height: "1.5rem",
              paddingX: ".5rem",
              paddingY: ".15rem",
              borderColor: "grey.500",
              fontSize: "0.6rem",
              lineHeight: "0.625rem",
            },
          }}
          type="search"
          className={styles.search}
          placeholder="搜索"
          size="small"
          onChange={handleSearchChange}
          value={searchValue}
        />
        <div>
          <div className={styles.listTitle}>OPERATION INC.</div>
          {isTreeLoading && (
            <CircularProgress
              style={{
                width: "4rem",
                height: "4rem",
                margin: "13rem 0 0 11rem",
              }}
            />
          )}
          <TreeSelectList
            ref={treeSelectRef}
            setSelectedData={(selectItems) => setAlreadySelectData(selectItems)}
            treeData={treeData}
            searchValue={searchValue}
            roleUserList={totalRoleUserList}
          />
        </div>
      </div>
      <div className={styles.rightGroupBox}>
        <div className={styles.countBox}>
          <div className={styles.selectTitleWrap}>
            <div>已選{alreadySelectData.length}個用戶</div>
            <CloseIcon
              className={styles.cancel}
              onClick={() => addUsersRef.current?.close()}
            />
          </div>
          <div className={styles.selectItemsBox}>
            {alreadySelectData.map((selectItems: TreeNode) => {
              return (
                <div className={styles.selectListWrap} key={selectItems.id}>
                  <div>{selectItems.title}</div>
                  <CloseIcon
                    className={styles.delete}
                    onClick={() =>
                      treeSelectRef.current?.selectNode(selectItems)
                    }
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div className={styles.buttonBox}>
          <Button
            variant="contained"
            className={styles.button}
            disabled={isConfirmDisbale}
            onClick={handleAddRoleUsers}
          >
            <span style={{ whiteSpace: "nowrap" }}>
              確認
              {isAddUserLoading && (
                <CircularProgress size={16} color="inherit" />
              )}
            </span>
          </Button>
          <Button
            variant="outlined"
            className={styles.button}
            onClick={() => addUsersRef.current?.close()}
          >
            取消
          </Button>
        </div>
      </div>
    </div>
  );
};

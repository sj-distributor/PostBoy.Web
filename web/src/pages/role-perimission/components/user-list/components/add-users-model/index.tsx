import {
  Box,
  Button,
  Checkbox,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
} from "@mui/material";
import styles from "./index.module.scss";
import CloseIcon from "@mui/icons-material/Close";
import { useAction } from "./hook";
import { ModalBoxRef } from "../../../../../../dtos/modal";
import { RefObject } from "react";
import { TreeNode } from "./props";
import { TreeSelectList } from "../../../tree-select";

export const AddUsersModel = (props: {
  addUsersRef: RefObject<ModalBoxRef>;
}) => {
  const { addUsersRef } = props;

  const {
    // alreadySelectData,
    // isSearch,
    // selectNode,
    // handleSearchChange,
    treeData,
  } = useAction();

  return (
    <div className={styles.wrap}>
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
          // onChange={handleSearchChange}
        />
        <div>
          <div className={styles.listTitle}>OPERATION INC.</div>
          <TreeSelectList isSearch={false} treeData={treeData} />
        </div>
      </div>
      <div className={styles.rightGroupBox}>
        <div className={styles.countBox}>
          <div className={styles.selectTitleWrap}>
            <div>已選{treeData.length}個用戶</div>
            <CloseIcon
              className={styles.cancel}
              onClick={() => addUsersRef.current?.close()}
            />
          </div>
          <div className={styles.selectItemsBox}>
            {/* {alreadySelectData.map((selectItems: TreeNode, index: number) => {
              return (
                <div className={styles.selectListWrap} key={index}>
                  <div>{selectItems.title}</div>
                  <CloseIcon
                    className={styles.delete}
                    onClick={() => selectNode(selectItems)}
                  />
                </div>
              );
            })} */}
          </div>
        </div>
        <div className={styles.buttonBox}>
          <Button variant="contained" className={styles.button}>
            確認
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

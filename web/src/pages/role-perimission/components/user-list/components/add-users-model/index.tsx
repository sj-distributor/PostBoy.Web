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
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import FolderIcon from "@mui/icons-material/Folder";
import CloseIcon from "@mui/icons-material/Close";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useAction } from "./hook";
import { ModalBoxRef } from "../../../../../../dtos/modal";
import { RefObject } from "react";
import { FixedSizeList } from "react-window";

export const AddUsersModel = (props: {
  addUsersRef: RefObject<ModalBoxRef>;
}) => {
  const { addUsersRef } = props;

  const {
    alreadySelectData,
    isSearch,
    displayFlatUpdateTreeData,
    searchDisplayTreeData,
    selectedNodes,
    expandedNodes,
    indeterminateNodes,
    padding,
    selectNode,
    toggleNode,
    handleSearchChange,
  } = useAction();

  const renderListItem: React.FC<{
    index: number;
    style: React.CSSProperties;
  }> = ({ index, style }) => {
    const item = isSearch
      ? searchDisplayTreeData[index]
      : displayFlatUpdateTreeData[index];

    const isSelected = selectedNodes.has(item.id);

    const isExpanded = expandedNodes.dispalayExpandedNodes.has(item.id);

    const isIndeterminate = indeterminateNodes.has(item.id);

    const hasChildren = item.children.length > 0;

    const paddingLeft = padding * (item.idRoute.length - 1);

    return (
      <div style={style}>
        <ListItem
          key={item.idRoute.toString()}
          style={{ paddingLeft: `${paddingLeft}rem` }}
        >
          <ListItemIcon>
            <Checkbox
              checked={isSelected}
              indeterminate={isIndeterminate}
              onChange={() => {
                selectNode(item);
              }}
            />
            {hasChildren && (
              <div onClick={() => toggleNode(item)}>
                {isExpanded ? (
                  <ArrowDropDownIcon className={styles.arrowIcon} />
                ) : (
                  <ArrowRightIcon className={styles.arrowIcon} />
                )}
                <FolderIcon className={styles.folder} />
              </div>
            )}
          </ListItemIcon>
          <ListItemText primary={item.title} />
        </ListItem>
      </div>
    );
  };

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
          onChange={handleSearchChange}
        />
        <div>
          <div className={styles.listTitle}>OPERATION INC.</div>
          <Box sx={{ width: "100%", height: 500 }}>
            <FixedSizeList
              height={500}
              itemCount={
                isSearch
                  ? searchDisplayTreeData.length
                  : displayFlatUpdateTreeData.length
              }
              itemSize={46}
              width={360}
            >
              {renderListItem}
            </FixedSizeList>
          </Box>
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
          <div>
            {alreadySelectData.map((selectItems: string, index: number) => {
              return (
                <div className={styles.selectListWrap} key={index}>
                  <div>{selectItems}</div>
                  <CloseIcon className={styles.delete} />
                </div>
              );
            })}
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

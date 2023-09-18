import { useAction } from "./hook";

import styles from "./index.module.scss";

import {
  Button,
  Card,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Input,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";

export const RoleFrom = () => {
  const { inputStyles, selectStyles, selectedValue, handleChange } =
    useAction();

  return (
    <div className={styles.container}>
      <Stack spacing={5}>
        <div className={styles.nav}>
          <div className={styles.navTitle}>新增角色</div>
          <div className={styles.navBtn}>
            <Button className={styles.navButton} variant="contained">
              確認
            </Button>
            <Button className={styles.navButton} variant="outlined">
              返回
            </Button>
          </div>
        </div>

        <Card className={styles.card} variant="outlined">
          <Stack spacing={3}>
            <div className={styles.itemTitle}>角色信息</div>
            <div className={styles.item}>
              <div className={styles.itemSubTitle}>角色名稱：</div>
              <div className={styles.itemInput}>
                <Input
                  disableUnderline={true}
                  sx={inputStyles}
                  placeholder="請輸入角色名稱"
                />
              </div>
            </div>

            <div className={styles.item}>
              <div className={styles.itemSubTitle}>角色描述：</div>
              <div className={styles.itemInput}>
                <Input
                  disableUnderline={true}
                  sx={inputStyles}
                  placeholder="請輸入角色描述"
                />
              </div>
            </div>
          </Stack>
        </Card>

        <Card className={styles.card} variant="outlined">
          <Stack spacing={3}>
            <div className={styles.itemTitle}>功能權限</div>
            <div className={styles.item}>
              <div className={styles.itemVisiblePage}>
                <FormGroup sx={{ flexBasis: "20%" }}>
                  <div className={styles.itemVisiblePageTitle}>可見頁面</div>
                  <FormControlLabel
                    control={<Checkbox defaultChecked />}
                    label="信息發送"
                  />
                  <FormControlLabel control={<Checkbox />} label="角色權限" />
                </FormGroup>
              </div>
              <div className={styles.itemPermission}>
                <div className={styles.itemPermissionTitle}>功能權限</div>
                <div className={styles.itemPerssionsForm}>
                  <FormGroup sx={{ flexBasis: "25%" }}>
                    <FormControlLabel
                      control={<Checkbox defaultChecked />}
                      label="創建群組"
                    />
                    <FormControlLabel control={<Checkbox />} label="新增角色" />
                  </FormGroup>

                  <FormGroup sx={{ flexBasis: "25%" }}>
                    <FormControlLabel
                      control={<Checkbox defaultChecked />}
                      label="添加群組成員"
                    />
                    <FormControlLabel control={<Checkbox />} label="分配" />
                  </FormGroup>

                  <FormGroup sx={{ flexBasis: "25%" }}>
                    <FormControlLabel
                      control={<Checkbox defaultChecked />}
                      label="發送通知"
                    />
                    <FormControlLabel control={<Checkbox />} label="編輯" />
                  </FormGroup>

                  <FormGroup sx={{ flexBasis: "25%" }}>
                    <FormControlLabel
                      control={<Checkbox defaultChecked />}
                      label="發送紀錄"
                    />
                    <FormControlLabel control={<Checkbox />} label="刪除" />
                  </FormGroup>
                </div>
              </div>
            </div>
          </Stack>
        </Card>

        <Card className={styles.card} variant="outlined">
          <Stack spacing={3}>
            <div className={styles.itemTitle}>數據權限</div>
            <div className={styles.item}>
              <div className={styles.itemSubTitle}>拉群功能：</div>
              <div className={styles.itemInput}>
                <Select
                  size="small"
                  sx={selectStyles}
                  value={selectedValue}
                  onChange={handleChange}
                >
                  <MenuItem value={0}>請選擇</MenuItem>
                  <MenuItem value={10}>选项1</MenuItem>
                  <MenuItem value={20}>选项2</MenuItem>
                  <MenuItem value={30}>选项3</MenuItem>
                </Select>
              </div>
            </div>

            <div className={`${styles.item} ${styles.lastItem}`}>
              <div className={styles.itemSubTitle}>通知功能：</div>
              <div className={styles.itemInput}>
                <Select
                  size="small"
                  sx={selectStyles}
                  value={selectedValue}
                  onChange={handleChange}
                >
                  <MenuItem value={0}>請選擇</MenuItem>
                  <MenuItem value={10}>选项1</MenuItem>
                  <MenuItem value={20}>选项2</MenuItem>
                  <MenuItem value={30}>选项3</MenuItem>
                </Select>
              </div>
            </div>
          </Stack>
        </Card>
      </Stack>
    </div>
  );
};

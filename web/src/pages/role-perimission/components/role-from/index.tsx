import { useAction } from "./hook";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import styles from "./index.module.scss";

import {
  Autocomplete,
  Button,
  Card,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Input,
  Stack,
  TextField,
} from "@mui/material";

export const RoleFrom = () => {
  const { options, inputStyles, selectStyles, formStyles, location, navigate } =
    useAction();

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;

  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  return (
    <div className={styles.container}>
      <Stack spacing={5}>
        <div className={styles.nav}>
          <div className={styles.navTitle}>
            {location.pathname === "/roles/add" ? "新增角色" : "編輯角色"}
          </div>
          <div className={styles.navBtn}>
            <Button
              className={styles.navButton}
              variant="contained"
              onClick={() => navigate("/roles/roleList")}
            >
              確認
            </Button>
            <Button
              className={styles.navButton}
              variant="outlined"
              onClick={() => navigate("/roles/roleList")}
            >
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
                  <FormGroup sx={formStyles}>
                    <FormControlLabel
                      control={<Checkbox defaultChecked />}
                      label="創建群組"
                    />
                    <FormControlLabel control={<Checkbox />} label="新增角色" />
                  </FormGroup>
                  <FormGroup sx={formStyles}>
                    <FormControlLabel
                      control={<Checkbox defaultChecked />}
                      label="添加群組成員"
                    />
                    <FormControlLabel control={<Checkbox />} label="分配" />
                  </FormGroup>
                  <FormGroup sx={formStyles}>
                    <FormControlLabel
                      control={<Checkbox defaultChecked />}
                      label="發送通知"
                    />
                    <FormControlLabel control={<Checkbox />} label="編輯" />
                  </FormGroup>

                  <FormGroup sx={formStyles}>
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
                <Autocomplete
                  size="small"
                  sx={selectStyles}
                  multiple
                  id="checkboxes-tags-demo"
                  options={options}
                  disableCloseOnSelect
                  getOptionLabel={(option) => option.label}
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={selected}
                      />
                      {option.label}
                    </li>
                  )}
                  style={{ width: 500 }}
                  renderInput={(params) => (
                    <TextField {...params} placeholder="請選擇" />
                  )}
                />
              </div>
            </div>

            <div className={`${styles.item} ${styles.lastItem}`}>
              <div className={styles.itemSubTitle}>通知功能：</div>
              <div className={styles.itemInput}>
                <Autocomplete
                  size="small"
                  sx={selectStyles}
                  multiple
                  id="checkboxes-tags-demo"
                  options={options}
                  disableCloseOnSelect
                  getOptionLabel={(option) => option.label}
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={selected}
                      />
                      {option.label}
                    </li>
                  )}
                  style={{ width: 500 }}
                  renderInput={(params) => (
                    <TextField {...params} placeholder="請選擇" />
                  )}
                />
              </div>
            </div>
          </Stack>
        </Card>
      </Stack>
    </div>
  );
};

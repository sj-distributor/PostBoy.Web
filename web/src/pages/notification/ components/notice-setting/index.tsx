import {
  Autocomplete,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import styles from "./index.module.scss";
import { useAction } from "./hook";
import { CycleOptionType } from "../../props";
const NoticeSetting = () => {
  const {
    isShowName,
    nameList,
    onClickName,
    onChangeDay,
    data,
    textFieldData,
    setTextFieldData,
    onChangeWeek,
    setIsShowName,
    content,
    setContent,
    enterpriseWeChatList,
    enterpriseWeChatValue,
    setEnterpriseWeChatValue,
    top100Films,
    cycleOptions,
    weekDay,
    textInput,
    clickAction,
  } = useAction();

  return (
    <div className={styles.noticeWrap}>
      <div className={styles.noticeRow}>
        <TextField
          required
          id="standard-required"
          label="标题"
          style={{ flex: 1 }}
        />
      </div>
      <div className={styles.noticeRow}>
        <div onBlur={() => setIsShowName.setFalse()}>
          <TextField
            // ref={textInput}
            required
            inputRef={textInput}
            label="内容"
            style={{ width: 720 }}
            // inputRef={(input) => input && input.focus()}
            id="outlined-multiline-static"
            multiline
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => {
              if (content.charAt(content.length - 1) === "@") {
                setIsShowName.setTrue();
                clickAction.setFalse();
              } else {
                setIsShowName.setFalse();
                clickAction.setTrue();
              }
            }}
          />
          {isShowName && (
            <div
              className={styles.nameList}
              onClick={() => textInput.current.focus()}
            >
              {nameList.map((item, index) => (
                <div
                  key={index}
                  className={styles.nameItem}
                  onMouseDown={() => {
                    onClickName(item);
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className={styles.noticeRow}>
        <div className={styles.cycleWrap}>
          <span className={styles.noticeTittle}>周期：</span>
          <FormControl>
            <Select
              id="demo-simple-select"
              value={textFieldData}
              onChange={(e) => setTextFieldData(Number(e.target.value))}
              style={{ height: 40, width: 150, marginRight: 20 }}
            >
              {cycleOptions.map((item, index) => (
                <MenuItem value={item.optionValue} key={index}>
                  {item.optionName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {textFieldData === CycleOptionType.PerMonth && (
            <div className={styles.daySelect}>
              <TextField
                size="small"
                type="number"
                value={data}
                onChange={(e) => onChangeDay(e.target.value)}
                style={{ width: 60 }}
              />
              <span>&ensp;日</span>
            </div>
          )}

          {(textFieldData === CycleOptionType.PerTwoweeks ||
            textFieldData === CycleOptionType.PerWeek) && (
            <FormGroup row className={styles.weekWrap}>
              <span className={styles.noticeTittle}>重复于:&ensp;</span>
              {weekDay.map((item, index) => (
                <FormControlLabel
                  value={item.value}
                  control={<Checkbox disableRipple={true} />}
                  label={item.name}
                  labelPlacement="end"
                  key={index}
                  onChange={() => {
                    onChangeWeek(item.type);
                  }}
                />
              ))}
            </FormGroup>
          )}

          {textFieldData && (
            <TextField
              id="time"
              type="time"
              defaultValue="00:00"
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                step: 300,
              }}
              size="small"
            />
          )}
        </div>
      </div>
      <div className={styles.objectWrap}>
        <div className={styles.objectContentWrap}>
          <div className={styles.objectContent}>
            <span className={styles.email}>邮箱：</span>
            <TextField
              id="outlined-basic"
              variant="outlined"
              size={"small"}
              style={{ flex: 1 }}
            />
          </div>
          <div className={styles.enterpriseWeChatWrap}>
            <span className={styles.enterpriseWeChat}>企业微信：</span>
            <FormControl>
              <Select
                id="demo-simple-select"
                value={enterpriseWeChatValue}
                onChange={(e) =>
                  setEnterpriseWeChatValue(Number(e.target.value))
                }
                style={{ height: 40, width: 200 }}
              >
                {enterpriseWeChatList.map((item, index) => (
                  <MenuItem value={item.id} key={index}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className={styles.groupAndPersonalWrap}>
            <span className={styles.groupAndPersonal}>群组</span>
            <Autocomplete
              multiple
              id="tags-filled"
              options={top100Films.map((item) => item.title)}
              onChange={(_, value) => {
                console.log(value);
              }}
              filterSelectedOptions
              freeSolo
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    label={option}
                    color="primary"
                    style={{ borderRadius: 5 }}
                    {...getTagProps({ index })}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  className={styles.groupAndPersonalInput}
                />
              )}
            />
          </div>
          <div className={styles.groupAndPersonalWrap}>
            <span className={styles.groupAndPersonal}>个人</span>
            <Autocomplete
              multiple
              id="tags-filled"
              options={top100Films.map((option) => option.title)}
              onChange={(_, value) => {
                console.log(value);
              }}
              filterSelectedOptions
              freeSolo
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    label={option}
                    color="primary"
                    style={{ borderRadius: 5 }}
                    {...getTagProps({ index })}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  className={styles.groupAndPersonalInput}
                />
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoticeSetting;

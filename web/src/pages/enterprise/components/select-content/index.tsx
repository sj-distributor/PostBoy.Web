import { memo } from "react"
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material"
import Autocomplete from "@mui/material/Autocomplete"
import styles from "./index.module.scss"
import { SelectContentProps } from "./props"

const SelectContent = memo((props: SelectContentProps) => {
  const {
    inputClassName,
    corpAppValue,
    corpsList,
    corpAppList,
    corpsValue,
    messageTypeList,
    messageTypeValue,
    sendTypeValue,
    sendTypeList,
    timeZone,
    timeZoneValue,
    setCorpsValue,
    setCorpAppValue,
    setMessageTypeValue,
    setSendTypeValue,
    setTimeZoneValue,
    setIsShowDialog,
  } = props

  return (
    <div className={styles.selectWrap}>
      {corpsValue !== undefined && corpAppValue !== undefined && (
        <>
          <Autocomplete
            openOnFocus
            disablePortal
            id="Autocomplete-corpsDataId"
            value={corpsValue}
            disableClearable={true}
            options={corpsList}
            className={inputClassName}
            getOptionLabel={(option) => option.corpName}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
              <TextField
                {...params}
                className={styles.corpInput}
                type="button"
                label="选择企业"
              />
            )}
            onChange={(e, value) => {
              setCorpsValue(value)
            }}
          />
          <Autocomplete
            openOnFocus
            disablePortal
            id="Autocomplete-corpAppListId"
            value={corpAppValue}
            options={corpAppList}
            className={inputClassName}
            disableClearable
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={(e, value) => {
              setCorpAppValue(value)
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                className={styles.corpInput}
                type="button"
                label="选择应用"
              />
            )}
          />
        </>
      )}
      <Autocomplete
        openOnFocus
        disablePortal
        id="Autocomplete-messageTypeListId"
        disableClearable={true}
        options={messageTypeList}
        className={inputClassName}
        value={messageTypeValue}
        getOptionLabel={(option) => option.title}
        groupBy={(option) => option.groupBy}
        isOptionEqualToValue={(option, value) => option.title === value.title}
        renderInput={(params) => (
          <TextField
            {...params}
            className={styles.corpInput}
            type="button"
            label="消息类型"
          />
        )}
        renderGroup={(params) => {
          return (
            <div key={params.key}>
              <p
                className={
                  params.group === "文件"
                    ? styles.groupLabel
                    : styles.noneGroupLabel
                }
              >
                {params.group}
              </p>
              <span>{params.children}</span>
            </div>
          )
        }}
        onChange={(e, value) => {
          setMessageTypeValue(value)
        }}
      />

      <FormControl className={inputClassName}>
        <InputLabel id="demo-simple-select-label">发送类型</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={sendTypeValue}
          label="发送类型"
          onChange={(e) => {
            setSendTypeValue(Number(e.target.value))
          }}
        >
          {sendTypeList.map((item, key) => (
            <MenuItem key={key} value={item.value}>
              {item.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl className={inputClassName}>
        <InputLabel id="demo-simple-select-label">时区</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={timeZoneValue}
          label="时区"
          onChange={(e) => {
            setTimeZoneValue(Number(e.target.value))
          }}
        >
          {timeZone.map((item, key) => (
            <MenuItem key={key} value={item.value}>
              {item.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button
        sx={{
          height: "3.5rem",
          fontSize: "1rem",
          flexShrink: "0",
        }}
        variant="contained"
        onClick={() => {
          setIsShowDialog(true)
        }}
      >
        选择发送目标
      </Button>
    </div>
  )
})
export default SelectContent

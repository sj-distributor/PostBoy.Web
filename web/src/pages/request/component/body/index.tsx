import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextareaAutosize,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./index.module.scss";
import { useAction } from "./hook";
import { sendTypeList, timeZone } from "../../../../dtos/send-message-job";
import { MessageJobSendType } from "../../../../dtos/enterprise";
import DateSelector from "../../../enterprise/components/date-selector";
import TimeSelector from "../../../enterprise/components/time-selector";
import { RequestBodyProps } from "./props";

const LinkSvg = () => {
  return (
    <svg
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      p-id="2364"
      width="1.5em"
      height="1.5em"
    >
      <path
        d="M607.934444 417.856853c-6.179746-6.1777-12.766768-11.746532-19.554358-16.910135l-0.01228 0.011256c-6.986111-6.719028-16.47216-10.857279-26.930349-10.857279-21.464871 0-38.864146 17.400299-38.864146 38.864146 0 9.497305 3.411703 18.196431 9.071609 24.947182l-0.001023 0c0.001023 0.001023 0.00307 0.00307 0.005117 0.004093 2.718925 3.242857 5.953595 6.03853 9.585309 8.251941 3.664459 3.021823 7.261381 5.997598 10.624988 9.361205l3.203972 3.204995c40.279379 40.229237 28.254507 109.539812-12.024871 149.820214L371.157763 796.383956c-40.278355 40.229237-105.761766 40.229237-146.042167 0l-3.229554-3.231601c-40.281425-40.278355-40.281425-105.809861 0-145.991002l75.93546-75.909877c9.742898-7.733125 15.997346-19.668968 15.997346-33.072233 0-23.312962-18.898419-42.211381-42.211381-42.211381-8.797363 0-16.963347 2.693342-23.725354 7.297197-0.021489-0.045025-0.044002-0.088004-0.066515-0.134053l-0.809435 0.757247c-2.989077 2.148943-5.691629 4.669346-8.025791 7.510044l-78.913281 73.841775c-74.178443 74.229608-74.178443 195.632609 0 269.758863l3.203972 3.202948c74.178443 74.127278 195.529255 74.127278 269.707698 0l171.829484-171.880649c74.076112-74.17435 80.357166-191.184297 6.282077-265.311575L607.934444 417.856853z"
        fill="#5D5D5D"
        p-id="2365"
      ></path>
      <path
        d="M855.61957 165.804257l-3.203972-3.203972c-74.17742-74.178443-195.528232-74.178443-269.706675 0L410.87944 334.479911c-74.178443 74.178443-78.263481 181.296089-4.085038 255.522628l3.152806 3.104711c3.368724 3.367701 6.865361 6.54302 10.434653 9.588379 2.583848 2.885723 5.618974 5.355985 8.992815 7.309476 0.025583 0.020466 0.052189 0.041956 0.077771 0.062422l0.011256-0.010233c5.377474 3.092431 11.608386 4.870938 18.257829 4.870938 20.263509 0 36.68962-16.428158 36.68962-36.68962 0-5.719258-1.309832-11.132548-3.645017-15.95846l0 0c-4.850471-10.891048-13.930267-17.521049-20.210297-23.802102l-3.15383-3.102664c-40.278355-40.278355-24.982998-98.79612 15.295358-139.074476l171.930791-171.830507c40.179095-40.280402 105.685018-40.280402 145.965419 0l3.206018 3.152806c40.279379 40.281425 40.279379 105.838513 0 146.06775l-75.686796 75.737962c-10.296507 7.628748-16.97358 19.865443-16.97358 33.662681 0 23.12365 18.745946 41.87062 41.87062 41.87062 8.048303 0 15.563464-2.275833 21.944801-6.211469 0.048095 0.081864 0.093121 0.157589 0.141216 0.240477l1.173732-1.083681c3.616364-2.421142 6.828522-5.393847 9.529027-8.792247l79.766718-73.603345C929.798013 361.334535 929.798013 239.981676 855.61957 165.804257z"
        fill="#5D5D5D"
        p-id="2366"
      ></path>
    </svg>
  );
};

export const RequestBody = (props: RequestBodyProps) => {
  const {
    setSendData,
    whetherClear,
    updateMessageJobInformation,
    addOrUpdate,
    updateRequestData,
  } = props;

  const {
    method,
    url,
    jsonBody,
    headers,
    handleChangeMethod,
    handleChangeUrl,
    handleChangeJsonBody,
    handleChangeHeaders,
    ChangeHeaderStatus,
    sendTypeValue,
    setSendTypeValue,
    timeZoneValue,
    setTimeZoneValue,
    dateValue,
    setDateValue,
    cronExp,
    setCronExp,
    setCronError,
    endDateValue,
    setEndDateValue,
    title,
    setTitle,
    showErrorPrompt,
    promptText,
    openError,
  } = useAction({
    addOrUpdate,
    setSendData,
    whetherClear,
    updateMessageJobInformation,
    updateRequestData,
  });

  return (
    <div
      className={`${styles.body_box} ${
        addOrUpdate === "Add"
          ? styles.addContentWidth
          : styles.updateContentWidth
      }`}
    >
      <Snackbar
        message={promptText}
        open={openError}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      />
      <div className={`${styles.grid_4} ${styles.display_flex_column}`}>
        <TextField
          label="标题"
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value as string)}
        />
      </div>
      <div className={`${styles.grid_2} ${styles.display_flex_column}`}>
        <FormControl>
          <InputLabel id="demo-simple-select-autowidth-label">
            发送类型
          </InputLabel>
          <Select
            labelId="demo-simple-select-autowidth-label"
            id="demo-simple-select"
            value={sendTypeValue}
            label="发送类型"
            onChange={(e) => {
              setSendTypeValue(Number(e.target.value));
            }}
          >
            {sendTypeList.map((item, key) => (
              <MenuItem key={key} value={item.value}>
                {item.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <div className={`${styles.grid_2} ${styles.display_flex_column}`}>
        <FormControl>
          <InputLabel id="demo-simple-select-autowidth-label">
            请求方式
          </InputLabel>
          <Select
            labelId="demo-simple-select-autowidth-label"
            id="demo-simple-select"
            value={method}
            label="发送类型"
            onChange={(e) => handleChangeMethod(e.target.value as string)}
          >
            {["GET", "POST"].map((item, index) => (
              <MenuItem key={index} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <div className={`${styles.grid_4} ${styles.display_flex_column}`}>
        <TextField
          id="outlined-start-adornment"
          value={url}
          label="链接"
          onChange={(e) => handleChangeUrl(e.target.value as string)}
          InputProps={{
            startAdornment: <LinkSvg />,
          }}
        />
      </div>

      <div className={styles.grid_6}>
        <div className={styles.header_box}>
          <div
            className={`${styles.header_title} ${styles.absolute} ${
              addOrUpdate === "Add"
                ? styles.request_add_bg
                : styles.request_update_bg
            }`}
          >
            <span className={styles.title_front}>Header</span>
            <AddIcon
              className={styles.icon_pointer}
              onClick={() => {
                handleChangeHeaders(ChangeHeaderStatus.Add);
              }}
            />
          </div>
          {headers.map((item, index) => (
            <div key={index} className={styles.display_grid_col_6}>
              <div className={styles.grid_2}>
                <TextField
                  id="standard-basic"
                  size="small"
                  fullWidth
                  placeholder="key"
                  value={item.key}
                  onChange={(e) => {
                    handleChangeHeaders(
                      ChangeHeaderStatus.Edit,
                      index,
                      e.target.value as string,
                      "key"
                    );
                  }}
                />
              </div>
              <div className={styles.grid_3}>
                <TextField
                  id="standard-basic"
                  size="small"
                  fullWidth
                  placeholder="value"
                  value={item.value}
                  onChange={(e) => {
                    handleChangeHeaders(
                      ChangeHeaderStatus.Edit,
                      index,
                      e.target.value as string,
                      "value"
                    );
                  }}
                />
              </div>
              <div
                className={`${styles.grid_1} ${styles.display_flex_h_center}`}
              >
                {headers.length > 1 && (
                  <CloseIcon
                    className={styles.icon_pointer}
                    onClick={() =>
                      handleChangeHeaders(ChangeHeaderStatus.Delete, index)
                    }
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {method === "POST" && (
        <div
          className={`${styles.grid_6} ${styles.display_flex_column} ${styles.relative}`}
        >
          <div
            className={`${styles.json_title}  ${
              addOrUpdate === "Add"
                ? styles.request_add_bg
                : styles.request_update_bg
            }`}
          >
            <span className={styles.title_front}>Body</span>
          </div>

          <TextareaAutosize
            style={{
              resize: "vertical",
              padding: "0.8rem",
              backgroundColor: addOrUpdate === "Add" ? "#f3f4f6" : "white",
              borderColor: "#a1a1aa",
              borderRadius: "0.3rem",
            }}
            aria-label="textarea"
            minRows={5}
            value={jsonBody}
            onChange={(e) => {
              handleChangeJsonBody(e.target.value as string);
            }}
          />
        </div>
      )}

      <div className={styles.grid_6}>
        {(sendTypeValue === MessageJobSendType.Delayed ||
          sendTypeValue === MessageJobSendType.Recurring) && (
          <div>
            <FormControl
              style={{
                width: 252,
                margin: "0.8rem 0 0",
              }}
            >
              <InputLabel id="demo-simple-select-label">时区</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={timeZoneValue}
                label="时区"
                onChange={(e) => {
                  setTimeZoneValue(Number(e.target.value));
                }}
              >
                {timeZone
                  .filter((x) => !x.disable)
                  .map((item, key) => (
                    <MenuItem key={key} value={item.value}>
                      {item.title}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </div>
        )}
        {sendTypeValue === MessageJobSendType.Delayed && (
          <DateSelector
            dateValue={dateValue}
            setDateValue={setDateValue}
            showErrorPrompt={showErrorPrompt}
          />
        )}
        {sendTypeValue === MessageJobSendType.Recurring && (
          <TimeSelector
            cronExp={cronExp}
            setCronExp={setCronExp}
            setCronError={setCronError}
            endDateValue={endDateValue}
            setEndDateValue={setEndDateValue}
            showErrorPrompt={showErrorPrompt}
          />
        )}
      </div>
    </div>
  );
};

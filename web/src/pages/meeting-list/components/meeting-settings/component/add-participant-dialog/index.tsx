import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Autocomplete from "@mui/material/Autocomplete";
import useAction from "./hook";
import styles from "./index.module.scss";
import {
  ITargetDialogProps,
  SelectPersonnelTitle,
  SelectPersonnelType,
} from "../../../../../../dtos/meeting-seetings";
import { CircularProgress, Snackbar, FilterOptionsState } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { memo } from "react";
import TreeViewSelector from "../../../../../../components/treeViewSelector";
import { SourceType } from "../../../../../../components/treeViewSelector/props";

const SelectTargetDialog = memo(
  (props: ITargetDialogProps) => {
    const {
      open,
      departmentAndUserList,
      AppId,
      CorpId,
      isLoading,
      tagsList,
      flattenDepartmentList,
      departmentKeyValue,
      lastTagsValue,
      clickName,
      chatId,
      outerTagsValue,
      loadSelectData,
      setChatId,
      setOpenFunction,
      setDeptUserList,
      setOuterTagsValue,
      settingSelectedList,
    } = props;

    const {
      departmentSelectedList,
      tagsValue,
      tipsObject,
      createLoading,
      setTagsValue,
      handleConfirm,
      handleCancel,
      setDepartmentSelectedList,
    } = useAction({
      open,
      AppId,
      departmentKeyValue,
      departmentAndUserList,
      isLoading,
      lastTagsValue,
      tagsList,
      clickName,
      chatId,
      outerTagsValue,
      CorpId,
      loadSelectData,
      setChatId,
      setOpenFunction,
      setDeptUserList,
      setOuterTagsValue,
      settingSelectedList,
    });
    const center = () =>
      !departmentKeyValue
        ? {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }
        : {};

    return (
      <div>
        <Dialog open={open} PaperProps={{ sx: { overflowY: "unset" } }}>
          <DialogTitle
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              height: "4rem",
            }}
          >
            <>{SelectPersonnelTitle[clickName]}</>
          </DialogTitle>
          <DialogContent sx={{ width: "30rem" }}>
            {!isLoading ? (
              <>
                <div
                  style={{
                    height: "auto",
                    overflowY: "auto",
                    position: "relative",
                    marginBottom: "1rem",
                    ...center(),
                  }}
                >
                  {!departmentKeyValue && <div>No Data</div>}
                </div>

                {departmentKeyValue && departmentKeyValue.key && (
                  <div>
                    {departmentSelectedList && (
                      <TreeViewSelector
                        appId={AppId}
                        inputValue={""}
                        sourceType={
                          clickName === SelectPersonnelType.MeetingAttendees ||
                          clickName ===
                            SelectPersonnelType.ConferenceAdministrator
                            ? SourceType.Full
                            : SourceType.Part
                        }
                        sourceData={{
                          foldData: departmentKeyValue.data,
                          flattenData: flattenDepartmentList ?? [],
                        }}
                        defaultSelectedList={loadSelectData}
                        settingSelectedList={(value) => {
                          setDepartmentSelectedList(value);
                        }}
                      />
                    )}
                  </div>
                )}

                <>
                  <Autocomplete
                    id="tags-list"
                    disablePortal
                    openOnFocus
                    multiple
                    disableCloseOnSelect
                    disableClearable
                    limitTags={2}
                    size="small"
                    sx={{ display: "none" }}
                    value={tagsValue}
                    options={tagsList}
                    componentsProps={{ paper: { elevation: 3 } }}
                    getOptionLabel={(option) => option.tagName}
                    isOptionEqualToValue={(option, value) =>
                      option.tagId === value.tagId
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        className={styles.inputButton}
                        margin="dense"
                        type="button"
                        label="标签列表"
                      />
                    )}
                    onChange={(e, value) => setTagsValue(value)}
                  />
                </>
              </>
            ) : (
              <CircularProgress
                style={{
                  position: "absolute",
                  width: "2rem",
                  height: "2rem",
                  left: "50%",
                  top: "50%",
                  margin: "-1rem 0 0 -1rem",
                }}
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancel}>取消</Button>
            <LoadingButton
              loading={createLoading}
              loadingIndicator="Loading…"
              variant="text"
              onClick={() => {
                handleConfirm();
              }}
            >
              确定
            </LoadingButton>
          </DialogActions>
        </Dialog>

        {/* 消息提示 */}
        <Snackbar
          message={tipsObject.msg}
          open={tipsObject.show}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        />
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.open === nextProps.open &&
      prevProps.departmentAndUserList === nextProps.departmentAndUserList &&
      prevProps.departmentKeyValue === nextProps.departmentKeyValue &&
      prevProps.AppId === nextProps.AppId &&
      prevProps.chatId === nextProps.chatId &&
      prevProps.isLoading === nextProps.isLoading
    );
  }
);

export default SelectTargetDialog;

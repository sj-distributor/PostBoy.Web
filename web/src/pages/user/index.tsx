import styles from "./index.module.scss";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import useAction from "./hook";
import {
  Alert,
  AlertTitle,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Pagination,
  Snackbar,
} from "@mui/material";
import ModalBox from "../../components/modal/modal";
import AddApiKeyPopup from "./component/add-aipkey";
import RegistrationPopup from "./component/registration";
import Search from "@mui/icons-material/Search";

const User = () => {
  const {
    usersList,
    setUsersList,
    registerRef,
    onRegisterCancel,
    addApikeyRef,
    onAddApikeyCancel,
    userAccountId,
    userApikeyList,
    setUserApikey,
    onListClick,
    setUserAccountId,
    snackbar,
    snackbarAction,
    usersDto,
    isLoading,
    setUserDto,
    snackbarData,
    setSnackBarData,
    getAllUsersData,
  } = useAction();

  return (
    <div className={styles.user}>
      <Snackbar
        open={snackbar}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Alert severity={snackbarData.severity}>
          <AlertTitle>{snackbarData.text}</AlertTitle>
        </Alert>
      </Snackbar>
      {/* 注册用户弹窗 */}
      <ModalBox ref={registerRef} onCancel={onRegisterCancel}>
        <RegistrationPopup
          onRegisterCancel={onRegisterCancel}
          setUsersList={setUsersList}
          snackbarAction={snackbarAction}
          setSnackBarData={setSnackBarData}
        />
      </ModalBox>
      {/* 添加apikey弹窗 */}
      <ModalBox ref={addApikeyRef} onCancel={onAddApikeyCancel}>
        <AddApiKeyPopup
          userAccountId={userAccountId}
          onAddApikeyCancel={onAddApikeyCancel}
          userApikeyList={userApikeyList}
          setUserApikey={setUserApikey}
          snackbarAction={snackbarAction}
          setSnackBarData={setSnackBarData}
        />
      </ModalBox>
      <div className={styles.registerButton}>
        <Button variant="contained" onClick={registerRef.current?.open}>
          注册用户
        </Button>
        <div>
          <OutlinedInput
            id="outlined-adornment-password"
            type="text"
            size="small"
            autoComplete="off"
            onKeyDown={(e) => {
              if (e.code === "Enter" && !isLoading) {
                setUserDto((prev) => ({ ...prev, page: 1 }));
                getAllUsersData();
              }
            }}
            onChange={(e) =>
              setUserDto((prev) => ({ ...prev, keyword: e.target.value }))
            }
            placeholder="输入用户搜索"
            endAdornment={
              <InputAdornment position="end">
                <IconButton aria-label="toggle password visibility" edge="end">
                  <Search />
                </IconButton>
              </InputAdornment>
            }
          />
          <Button
            variant="contained"
            component="label"
            sx={{ marginLeft: "0.5rem" }}
            onClick={() => {
              if (!isLoading) {
                setUserDto((prev) => ({ ...prev, page: 1 }));
                getAllUsersData();
              }
            }}
          >
            搜索用户
          </Button>
        </div>
      </div>
      <div>
        <div
          className={styles.userListBox}
          style={{ opacity: isLoading ? 0.6 : undefined }}
        >
          <div className={styles.loadingStyle}>
            {isLoading && <CircularProgress />}
          </div>

          {usersList?.length ? (
            usersList.map((item, key) => (
              <Accordion className={styles.accordion} key={key}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  className={styles.accordionSummary}
                  onClick={() => onListClick(item.id)}
                  id="AccordionSummary"
                >
                  <Typography>{item.userName}</Typography>
                  <Button
                    variant="contained"
                    className={styles.addButton}
                    onClick={(event) => {
                      setUserAccountId(item.id);
                      event.stopPropagation();
                      addApikeyRef.current?.open();
                    }}
                  >
                    添加apikey
                  </Button>
                </AccordionSummary>
                {userApikeyList.map((items) => {
                  return items.map((apikeyItem, apikeyIndex) => {
                    if (apikeyItem.userAccountId === item.id) {
                      return (
                        <AccordionDetails
                          key={apikeyIndex}
                          className={styles.accordionDetails}
                        >
                          <Typography>{apikeyItem.apiKey}</Typography>
                        </AccordionDetails>
                      );
                    }
                  });
                })}
              </Accordion>
            ))
          ) : (
            <div className={styles.notData}>notData</div>
          )}
        </div>
        {usersList.length > 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "end",
              marginRight: "1.5rem",
              marginTop: 10,
            }}
          >
            <Pagination
              count={Math.ceil(usersDto.count / usersDto.pageSize)}
              page={usersDto.page}
              onChange={(e: React.ChangeEvent<unknown>, value: number) =>
                setUserDto((prev) => ({ ...prev, page: value }))
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default User;

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
    success,
    successAction,
    usersDto,
    isLoading,
    setUserDto,
    getAllUsersData,
  } = useAction();

  return (
    <div className={styles.user}>
      <Snackbar
        open={success}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Alert severity="success">
          <AlertTitle>Success!</AlertTitle>
        </Alert>
      </Snackbar>
      {/* 注册用户弹窗 */}
      <ModalBox ref={registerRef} onCancel={onRegisterCancel}>
        <RegistrationPopup
          onRegisterCancel={onRegisterCancel}
          setUsersList={setUsersList}
          successAction={successAction}
        />
      </ModalBox>
      {/* 添加apikey弹窗 */}
      <ModalBox ref={addApikeyRef} onCancel={onAddApikeyCancel}>
        <AddApiKeyPopup
          userAccountId={userAccountId}
          onAddApikeyCancel={onAddApikeyCancel}
          userApikeyList={userApikeyList}
          setUserApikey={setUserApikey}
          successAction={successAction}
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
            onKeyDown={(e) =>
              e.code === "Enter" && !isLoading && getAllUsersData()
            }
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
            onClick={() => !isLoading && getAllUsersData()}
          >
            搜索用户
          </Button>
        </div>
      </div>
      <div>
        <div className={styles.userListBox}>
          {usersList?.map((item, key) => (
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
          ))}
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

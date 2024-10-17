import styles from "./index.module.scss";
import { Link, Outlet, useLocation } from "react-router-dom";
import useMainAction from "./hook";
import UserInformation from "./components/user-information";
import useAuth from "../../auth";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useState } from "react";

const Main = () => {
  const { filterRouter } = useAuth();

  const pathname = useLocation().pathname;

  const [isShowMeetingItem, setIsShowMeetingItem] = useState<boolean>(true);

  const { clickMainIndex, setMainClickIndex } = useMainAction();

  const routerTabBar = () => {
    return filterRouter?.map((item, index) => {
      return item.head ? (
        <div key={index} className={styles.item}>
          <Link
            to={item.path}
            onClick={() => {
              setMainClickIndex(index);
            }}
            className={
              pathname.includes(item.path) ? styles.itemClick : styles.itemNone
            }
          >
            <div>
              <div className={styles.iconTitleContainer}>
                {item.icons}
                <span className={styles.title}>{item.head}</span>
              </div>
              {item.path === "/meeting" &&
                isShowMeetingItem &&
                item.children?.map((item) => {
                  return item.title ? (
                    <div style={{ marginTop: "1rem" }}>
                      <Link
                        to={item.path}
                        className={
                          pathname.includes(item.path)
                            ? styles.childrenItemClick
                            : styles.childrenItemNone
                        }
                      >
                        {item.title}
                      </Link>
                    </div>
                  ) : (
                    <></>
                  );
                })}
            </div>
          </Link>
          {item.path === "/meeting" && (
            <div
              className={styles.childrenSettingIcon}
              onClick={() => setIsShowMeetingItem((prev) => !prev)}
            >
              {isShowMeetingItem ? (
                <KeyboardArrowUpIcon />
              ) : (
                <KeyboardArrowDownIcon />
              )}
            </div>
          )}
        </div>
      ) : (
        <></>
      );
    });
  };

  return (
    <div className={styles.main}>
      <div className={styles.sideBar}>
        <div className={styles.navBar}>{routerTabBar()}</div>
      </div>
      <div className={styles.content}>
        <div className={styles.contextUpper}>
          <UserInformation />
        </div>
        <div className={styles.contextLower}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Main;

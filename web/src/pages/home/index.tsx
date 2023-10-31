import { Link, Outlet, useLocation } from "react-router-dom"
import { ChildProps } from "../../dtos/route-type"
import { routerArray } from "../../router/elementRoute"
import useAction from "./hook"

import styles from "./index.module.scss"
import { useContext } from "react"
import { AdministratorContext } from "../main"

const Home = () => {
  const { click, setClick } = useAction()

  const { haveAdministrator } = useContext(AdministratorContext)

  const location = useLocation()

  const parentPath = location.pathname
    .split("/")
    .filter((item) => !!item)
    .map((item) => `/${item}`)[0]

  const routerTabBarContent = () => {
    const homeRouter = routerArray.find((item) => item.path === parentPath)

    const verifyPermissions = (item: ChildProps) =>
      ["/home/request"].includes(item.path) ? !!haveAdministrator : true

    return (
      <div className={styles.nav}>
        {homeRouter?.children?.map((childItem, childIndex) => {
          return (
            verifyPermissions(childItem) && (
              <Link
                key={childIndex}
                to={childItem.path}
                onClick={() => {
                  setClick(childIndex)
                }}
                className={
                  click === childIndex ? styles.navBarActive : styles.navBar
                }
              >
                {childItem.title}
              </Link>
            )
          )
        })}
      </div>
    )
  }

  return (
    <div className={styles.home}>
      {routerTabBarContent()}
      <div className={styles.outlet}>
        <Outlet />
      </div>
    </div>
  )
}

export default Home

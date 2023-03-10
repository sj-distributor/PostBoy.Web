import { Link, Outlet } from "react-router-dom"
import { RouteItem } from "../../dtos/route-type"
import { routerArray } from "../../router/elementRoute"
import useAction from "./hook"

import styles from "./index.module.scss"

const Home = () => {
  const { click, setClick } = useAction()

  const routerTabBarContent = (list: RouteItem[]) => {
    return list.map((item, index) => {
      return (
        <div className={styles.nav} key={index}>
          {item.children?.map((childItem, childIndex) => {
            return (
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
          })}
        </div>
      )
    })
  }

  return (
    <div className={styles.home}>
      {routerTabBarContent(routerArray)}
      <div className={styles.outlet}>
        <Outlet />
      </div>
    </div>
  )
}

export default Home

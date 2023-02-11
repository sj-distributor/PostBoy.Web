import { useBoolean } from "ahooks"
import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { GetAuthUser } from "../../api/user-management"
import { RouteState } from "../../dtos/route-index"
import { RouteItem } from "../../dtos/route-type"
import { IUserDataDto } from "../../dtos/user-management"
import { routerArray } from "../../router/elementRoute"

const useMainAction = () => {
  const mainLocation = useLocation()
  const [clickMainIndex, setMainClickIndex] = useState<number>()
  const [haveAdministrator, haveAdministratorAction] = useBoolean(false)
  const [userData, setUserData] = useState<IUserDataDto>()

  useEffect(() => {
    const getMainClickIndex = () => {
      const getMainIndex = 0
      routerArray.map(
        (item: RouteItem, index: number) =>
          item?.children?.findIndex((x) => x.path === mainLocation.pathname) !==
            RouteState.None && getMainIndex === index
      )
      return getMainIndex
    }

    setMainClickIndex(
      (routerArray.findIndex((x) => x.path === mainLocation.pathname) ===
      RouteState.None
        ? getMainClickIndex()
        : routerArray.findIndex(
            (x) => x.path === mainLocation.pathname
          )) as number
    )
  }, [mainLocation.pathname])

  useEffect(() => {
    GetAuthUser().then((res) => {
      setUserData(res?.data)
      console.log("data", res)
    })
  }, [])

  useEffect(() => {
    // 检验userList是否有Administrator这个角色
    if (!!userData?.roles.find((x) => x.name === "Administrator")) {
      // haveAdministratorAction.setTrue()
    }
    haveAdministratorAction.setTrue()
  }, [userData])

  return {
    mainLocation,
    clickMainIndex,
    setMainClickIndex,
    haveAdministrator,
  }
}

export default useMainAction

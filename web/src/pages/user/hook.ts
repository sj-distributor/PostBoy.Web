import { useBoolean } from "ahooks"
import { useEffect } from "react"
import { GetAllUsers } from "../../api/user-management"

const useAction = () => {
  const [isShowRegister, isShowRegisterAction] = useBoolean(false)

  const onRegister = () => {
    isShowRegisterAction.toggle()
  }

  useEffect(() => {
    GetAllUsers().then((res) => {
      console.log("res", res)
    })
  }, [])

  return { onRegister, isShowRegister }
}

export default useAction

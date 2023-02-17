import { useBoolean } from "ahooks"
import { useEffect, useState } from "react"
import { GetAllUsers } from "../../api/user-management"
import { IUserResponse } from "../../dtos/user-management"

const useAction = () => {
  const [usersList, setUsersList] = useState<IUserResponse[]>()

  useEffect(() => {
    GetAllUsers().then((res) => {
      if (!!res) {
        setUsersList(res)
        console.log("userList", res)
      }
    })
  }, [])

  return { usersList, GetAllUsers }
}

export default useAction

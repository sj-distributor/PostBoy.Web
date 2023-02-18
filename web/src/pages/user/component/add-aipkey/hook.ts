import { useState } from "react"
import {
  GetUserApikeys,
  PostUserApikeysAdd,
} from "../../../../api/user-management"
import { IUserApikeysResponse } from "../../../../dtos/user-management"

const useAction = (props: {
  userAccountId: string
  onAddApikeyCancel: () => void
  userApikeyList: IUserApikeysResponse[][]
  setUserApikey: React.Dispatch<React.SetStateAction<IUserApikeysResponse[][]>>
}) => {
  const { userAccountId, onAddApikeyCancel, userApikeyList, setUserApikey } =
    props
  const [apiKey, setAipKey] = useState<string>("")
  const [description, setDescription] = useState<string>("")

  const addApiKeySubmit = () => {
    PostUserApikeysAdd({
      apiKey: apiKey,
      description: description,
      userAccountId: userAccountId,
    }).then(() => {
      onAddApikeyCancel()
      GetUserApikeys(userAccountId).then((res) => {
        console.log("Res", res, userApikeyList)
        if (!!res) {
          const newList = userApikeyList.map((items) => {
            if (items[0].userAccountId === userAccountId) {
              items = res
            }
            return items
          })
          setUserApikey(newList)
        }
      })
    })

    setAipKey("")
    setDescription("")
  }

  return { apiKey, setAipKey, description, setDescription, addApiKeySubmit }
}

export default useAction

import { clone, isEmpty } from "ramda"
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

  const addApiKeySubmit = async () => {
    await PostUserApikeysAdd({
      apiKey: apiKey,
      description: description,
      userAccountId: userAccountId,
    }).then(async () => {
      await GetUserApikeys(userAccountId).then((res) => {
        if (!!res) {
          if (isEmpty(userApikeyList[0])) {
            const newList = clone(userApikeyList)
            newList[0] = res
            setUserApikey(newList)
          } else {
            const userApikeyListClone = clone(userApikeyList)
            const newList = userApikeyListClone.map((items) => {
              if (items[0].userAccountId === res[0].userAccountId) {
                items = res
              }
              return items
            })
            setUserApikey(newList)
          }
        }
      })
      onAddApikeyCancel()
    })

    setAipKey("")
    setDescription("")
  }

  return { apiKey, setAipKey, description, setDescription, addApiKeySubmit }
}

export default useAction

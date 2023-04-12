import { useEffect, useState } from "react"
import {
  AddApplication,
  AddCorp,
  ModifyApplication,
  ModifyCorp,
} from "../../../../api/app-manager"
import {
  AddOrModify,
  RowDataType,
  IManagerAppKeyData,
  IManagerCorpKeyData,
  IRequestCorpAdd,
  IRequestAppAdd,
} from "../../../../dtos/app-manager"

const useAction = (props: {
  rowData: IManagerCorpKeyData | IManagerAppKeyData
  rowDataType: AddOrModify
  tipsText: string
  onAddApikeyCancel: () => void
  reload: (corpUpdateId?: string) => void
  setTipsText: React.Dispatch<React.SetStateAction<string>>
}) => {
  const { rowData, rowDataType, onAddApikeyCancel, reload, setTipsText } = props
  const [name, setName] = useState<string>("")
  const [secret, setSecret] = useState<string>("")
  const [corpId, setCorpId] = useState<string>("")
  const [appId, setAppId] = useState<string>("")
  const [agentId, setAgentId] = useState<number>(0)
  const [display, setDisplay] = useState<boolean>(true)

  const handleSubmit = async () => {
    if (rowData.key === RowDataType.Corporation) {
      const requestCorpData: IRequestCorpAdd = {
        corpName: name,
        corpId,
        contactSecret: secret,
      }
      rowDataType === AddOrModify.Add
        ? AddCorp([requestCorpData]).then(success)
        : ModifyCorp([{ ...requestCorpData, id: rowData.data.id }]).then(
            success
          )
    } else {
      const requestAppData: IRequestAppAdd = {
        appId,
        name,
        secret,
        display,
        agentId: Number(agentId),
        workWeChatCorpId: rowData.data.workWeChatCorpId,
      }
      rowDataType === AddOrModify.Add
        ? AddApplication([requestAppData]).then(success)
        : ModifyApplication([{ ...requestAppData, id: rowData.data.id }]).then(
            success
          )
    }
    onAddApikeyCancel()
    clearData()
  }

  const success = () => {
    setTipsText(`${rowDataType} success`)
    rowData.key === RowDataType.Corporation
      ? reload()
      : reload(rowData.data.workWeChatCorpId)
  }

  const clearData = () => {
    setName("")
    setSecret("")
    setDisplay(true)
  }

  useEffect(() => {
    if (rowDataType === AddOrModify.Modify) {
      // Init data
      if (rowData.key === RowDataType.Corporation) {
        setName(rowData.data.corpName)
        setCorpId(rowData.data.corpId)
        setSecret(rowData.data.contactSecret)
      } else {
        setName(rowData.data.name)
        setAppId(rowData.data.appId)
        setAgentId(rowData.data.agentId)
        setSecret(rowData.data.secret)
        setDisplay(rowData.data.display)
      }
    } else {
      clearData()
    }
  }, [])

  return {
    name,
    secret,
    display,
    corpId,
    appId,
    agentId,
    setAgentId,
    setAppId,
    setCorpId,
    setDisplay,
    setSecret,
    setName,
    handleSubmit,
  }
}

export default useAction

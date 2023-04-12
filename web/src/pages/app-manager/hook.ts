import { clone } from "ramda"
import { useEffect, useRef, useState } from "react"
import { PostSecretData } from "../../api/app-manager"
import { GetCorpAppList, GetCorpsList } from "../../api/enterprise"
import {
  IManagerAppData,
  IManagerAppKeyData,
  IManagerCorpKeyData,
  AddOrModify,
  IManagerCorpData,
  RowDataType,
} from "../../dtos/app-manager"
import { ModalBoxRef } from "../../dtos/modal"

const useAction = () => {
  const defaultCorpRowData: IManagerCorpKeyData = {
    data: {
      id: "",
      corpId: "",
      corpName: "",
      contactSecret: "",
    },
    key: RowDataType.Corporation,
  }
  const defaultAppRowData: IManagerAppKeyData = {
    data: {
      id: "",
      appId: "",
      workWeChatCorpId: "",
      name: "",
      secret: "",
      agentId: 0,
      display: true,
    },
    key: RowDataType.Application,
  }
  const dialogRef = useRef<ModalBoxRef>(null)
  // 获取的企业数组
  const [corpsList, setCorpsList] = useState<IManagerCorpData[]>([])
  // 获取的App数组
  const [corpAppList, setCorpAppList] = useState<IManagerAppData[][]>([])
  const [corpAppLoadedList, setCorpAppLoadedList] = useState<string[]>([])
  const [rowData, setRowData] = useState<
    IManagerCorpKeyData | IManagerAppKeyData
  >(defaultCorpRowData)
  const [rowDataType, setRowDataType] = useState<AddOrModify>(AddOrModify.Add)

  const [tipsText, setTipsText] = useState<string>("")

  const onAddCorpCancel = () => dialogRef.current?.close()

  const onListClick = async (corpId: string) => {
    if (!corpAppLoadedList.some((x) => x === corpId)) {
      setCorpAppLoadedList((prev) => [...prev, corpId])
      loadAppList(corpId)
    }
  }

  const loadCorpList = () => {
    GetCorpsList().then((corpData) => {
      corpData &&
        PostSecretData({
          ids: corpData.map((x) => x.id),
          secretType: 0,
        }).then((secretData) => {
          secretData &&
            secretData.length > 0 &&
            setCorpsList(
              corpData.map((item) => ({
                ...item,
                contactSecret:
                  secretData.find((secret) => secret.id === item.id)?.secret ??
                  "",
              }))
            )
        })
    })
  }

  const loadAppList = async (CorpId: string) => {
    const corpAppResult = await GetCorpAppList({
      CorpId,
    })
    !!corpAppResult &&
      PostSecretData({
        ids: corpAppResult.map((x) => x.id),
        secretType: 1,
      }).then((secretData) => {
        secretData &&
          secretData.length > 0 &&
          setCorpAppList((prev) => {
            const newResult = clone(prev)
            const existDataIndex = newResult.findIndex(
              (item) => item[0].workWeChatCorpId === CorpId
            )
            const newManagerAppData = corpAppResult.map((x) => ({
              ...x,
              secret: secretData.find((y) => x.id === y.id)?.secret ?? "",
            }))
            existDataIndex > -1
              ? newResult.splice(existDataIndex, 1, newManagerAppData)
              : newResult.push(newManagerAppData)
            return newResult
          })
      })
  }

  const reload = (corpUpdateId?: string) => {
    corpUpdateId ? loadAppList(corpUpdateId) : loadCorpList()
  }

  // 初始化企业数组
  useEffect(() => {
    loadCorpList()
  }, [])

  useEffect(() => {
    if (tipsText) {
      const timeout = setTimeout(() => {
        setTipsText("")
      }, 4000)
      return () => {
        clearTimeout(timeout)
      }
    }
  }, [tipsText])

  return {
    corpsList,
    corpAppList,
    corpAppLoadedList,
    dialogRef,
    rowData,
    rowDataType,
    defaultCorpRowData,
    defaultAppRowData,
    tipsText,
    setTipsText,
    setRowDataType,
    setRowData,
    onAddCorpCancel,
    onListClick,
    reload,
  }
}

export default useAction

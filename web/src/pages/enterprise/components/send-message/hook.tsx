import { useEffect, useMemo, useState } from "react"
import {
  GetCorpAppList,
  GetCorpsList,
  GetDepartmentList,
  GetDepartmentUsersList,
  GetMessageJob,
  GetTagsList,
  PostMessageSend,
} from "../../../../api/enterprise"
import {
  ICorpAppData,
  ICorpData,
  IDepartmentAndUserListValue,
  IDepartmentData,
  IDtoExtend,
  ILastShowTableData,
  IMessageJobDto,
  IMessageTypeData,
  ISendMessageCommand,
  ITagsList,
  ITargetDialogValue,
  MessageDataType,
  MessageJobDestination,
  MessageWidgetShowStatus,
  SendType,
  TimeType,
} from "../../../../dtos/enterprise"
import { flatten } from "ramda"
import moment from "moment"
// import { v4 as uuidv4 } from "uuid";

const useAction = () => {
  const sendTypeList = [
    { text: "即时发送", value: SendType.InstantSend },
    { text: "指定日期", value: SendType.SpecifiedDate },
    { text: "周期发送", value: SendType.SendPeriodically },
  ]

  const timeZone = [
    { title: "UTC", value: TimeType.UTC },
    { title: "America/Los_Angeles", value: TimeType.America },
  ]

  const messageTypeList: IMessageTypeData[] = [
    { title: "文本", groupBy: "", type: MessageDataType.Text },
    { title: "图文", groupBy: "", type: MessageDataType.Image },
    { title: "图片", groupBy: "文件", type: MessageDataType.Image },
    { title: "语音", groupBy: "文件", type: MessageDataType.Voice },
    { title: "视频", groupBy: "文件", type: MessageDataType.Video },
    { title: "文件", groupBy: "文件", type: MessageDataType.File },
  ]

  const [messageParams, setMessageParams] = useState<string>("")
  const [titleParams, setTitleParams] = useState<string>("")

  const [messageTypeValue, setMessageTypeValue] = useState<IMessageTypeData>(
    messageTypeList[0]
  )

  const [tagsValue, setTagsValue] = useState<ITagsList>()

  const [isShowDialog, setIsShowDialog] = useState<boolean>(false)
  const [isShowInputOrUpload, setIsShowInputOrUpload] =
    useState<MessageWidgetShowStatus>(MessageWidgetShowStatus.ShowAll)
  const [isShowMessageParams, setIsShowMessageParams] = useState<boolean>(false)

  const [corpsList, setCorpsList] = useState<ICorpData[]>([])
  const [corpAppList, setCorpAppList] = useState<ICorpAppData[]>([])
  const [corpsValue, setCorpsValue] = useState<ICorpData>()
  const [corpAppValue, setCorpAppValue] = useState<ICorpAppData>()
  const [departmentList, setDepartmentList] = useState<IDepartmentData[]>([])
  const [flattenDepartmentList, setFlattenDepartmentList] = useState<
    IDepartmentAndUserListValue[]
  >([])

  const [isTreeViewLoading, setIsTreeViewLoading] = useState<boolean>(false)
  const [tagsList, setTagsList] = useState<ITagsList[]>([])

  const muiSxStyle = { width: "13rem", marginLeft: "1.5rem" }
  const [cronExp, setCronExp] = useState("0 0 * * *") //mark 初始值应该为null
  const [cronError, setCronError] = useState("")
  const [isAdmin, setIsAdmin] = useState(true)
  const [dateValue, setDateValue] = useState<any>()
  const [rowList, setRowList] = useState<IMessageJobDto[]>([])
  const [sendTypeValue, setSendTypeValue] = useState(sendTypeList[0])
  const [timeZoneValue, setTimeZoneValue] = useState<number>(timeZone[0].value)
  const [sendMessageList, setSendMessageList] = useState<ISendMessageCommand>()
  const [selectUserList, setSelectUserList] = useState<string[]>()
  const [selectPartiesList, setSelectPartiesList] = useState<string[]>()

  useEffect(() => {
    GetCorpsList().then((data) => {
      if (data) {
        setCorpsList(data)
        setCorpsValue(data[0])
      }
    })
  }, [])

  useEffect(() => {
    corpsValue &&
      GetCorpAppList({ CorpId: corpsValue.id }).then((corpAppResult) => {
        if (corpAppResult) {
          setCorpAppList(corpAppResult)
          setCorpAppValue(corpAppResult[0])
          GetTagsList({ AppId: corpAppResult[0].appId }).then((tagsData) => {
            tagsData && tagsData.errcode === 0 && setTagsList(tagsData.taglist)
          })
        }
      })
  }, [corpsValue?.id])

  useEffect(() => {
    const loadDeptUsers = async (AppId: string) => {
      setDepartmentList([])
      const deptListResponse = await GetDepartmentList({ AppId })
      if (!!deptListResponse && deptListResponse.errcode === 0) {
        for (const department of deptListResponse.department) {
          const userList = await GetDepartmentUsersList({
            AppId,
            DepartmentId: department.id,
          })
          if (!!userList && userList.errcode === 0) {
            setDepartmentList((prev) => {
              const newValue = prev.filter((e) => !!e)
              newValue.push({
                ...department,
                departmentUserList: userList.userlist.map((e) => {
                  e.selected = false
                  return e
                }),
                selected: false,
              })
              return newValue
            })
            setFlattenDepartmentList((prev) => {
              return [
                ...prev,
                ...flatten(userList.userlist).map((item: any) => ({
                  id: item.userid,
                  name: item.name,
                  parentid: department.name,
                })),
              ]
            })

            deptListResponse.department[
              deptListResponse.department.length - 1
            ] === department && setIsTreeViewLoading(false)

            // 选择的群组
            setSelectPartiesList(
              deptListResponse.department
                .filter((x) => x.selected === true)
                .map((item) => item.name)
            )
            // 选择的用户
            // deptListResponse?.department?.forEach((item) => {
            //   const useridList: string[] = [];
            //   item?.departmentUserList?.forEach((item) => {
            //     if (item.selected === true) {
            //       useridList.push(item.userid);
            //       console.log("userid", item.userid);
            //     }
            //   });
            //   setSelectUserList(["TRACY"]);
            // });
            // console.log("reeeerrr", userList.userlist);

            userList.userlist.map((item) => {
              if (item.name === "HERRY.H") {
                // console.log("item", item);
              }
            })
          }
        }
      }
    }
    if (!!corpAppValue) {
      setIsTreeViewLoading(true)

      loadDeptUsers(corpAppValue.appId)
    }
  }, [corpAppValue?.appId])

  const setDialogValue = { deptAndUserValueList: departmentList, tagsValue }

  const getDialogValue = (dialogData: ITargetDialogValue) => {
    setDepartmentList(dialogData.deptAndUserValueList)
    setTagsValue(dialogData.tagsValue)
  }

  const handleSubmit = (sendType: SendType, correlationId?: string) => {
    // const messageList = {
    //   correlationId: !!correlationId ? correlationId : "",
    //   jobSetting: {
    //     timezone: timeZoneValue,
    //     delayedJob: {
    //       enqueueAt: dateValue,
    //     },
    //     recurringJob: {
    //       cronExpression: cronExp,
    //     },
    //   },
    //   metadata: {
    //     key: titleParams,
    //     value: messageParams,
    //   },
    //   workWeChatAppNotification: {
    //     appId: corpAppList[0].appId, //mark
    //     toUsers: selectUserList,
    //   },
    // };
    // 指定日期
    if (sendType === SendType.SpecifiedDate) {
      const data =
        // {
        //   correlationId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        //   jobSetting: {
        //     // timezone: "UTC",
        //     // delayedJob: {
        //     // enqueueAt: "2023-02-02 10:40:24.651",
        //     // enqueueAt: moment.utc(dateValue).toISOString(),
        //     // },
        //     recurringJob: {
        //       cronExpression: "* * * * * * ",
        //     },
        //   },
        //   metadata: [
        //     {
        //       // key: titleParams,
        //       // value: messageParams,
        //       key: "test",
        //       value: "test",
        //     },
        //   ],
        //   workWeChatAppNotification: {
        //     appId: corpAppList[0].appId,
        //     chatId: corpAppList[0].workWeChatCorpId,
        //     toUsers: ["TRACY.W"],
        //     text: {
        //       content: "111",
        //     },
        //   },
        // };
        {
          correlationId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          jobSetting: {
            timezone: "UTC",
            delayedJob: {
              enqueueAt: "2023-02-03T02:53:18.911Z",
            },
            // recurringJob: {
            //   cronExpression: "string"
            // }
          },
          metadata: [
            {
              key: "string",
              value: "string",
            },
          ],
          workWeChatAppNotification: {
            appId: "c1sAspdXz3ok",
            // chatId: "string",
            // toTags: [
            //   "string"
            // ],
            toUsers: ["TRACY"],
            // toParties: [
            //   "string"
            // ],
            text: {
              content: "string",
            },
            // file: {
            //   fileName: "string",
            //   fileContent: "string",
            //   fileType: 0
            // },
            // mpNews: {
            //   articles: [
            //     {
            //       title: "string",
            //       author: "string",
            //       digest: "string",
            //       content: "string",
            //       fileContent: "string",
            //       contentSourceUrl: "string"
            //     }
            //   ]
            // }
          },
        }
      console.log("data", JSON.stringify(data))
      PostMessageSend(data)
        .then((res) => console.log("res", res))
        .catch((error) => console.log("error1", error.message))
    }

    // 周期
    // if (sendType === SendType.SendPeriodically) {
    //   const data = {
    //     correlationId: !!correlationId ? correlationId : "",
    //     jobSetting: {
    //       timezone: timeZone[timeZoneValue].title,
    //       recurringJob: {
    //         cronExpression: cronExp,
    //       },
    //     },
    //     metadata: [
    //       {
    //         key: titleParams,
    //         value: messageParams,
    //       },
    //     ],
    //     workWeChatAppNotification: {
    //       appId: corpAppList[0].appId, //mark
    //       toUsers: selectUserList ? selectUserList : ["WaiTouHeWaiErDuo"],
    //     },
    //   };
    //   alert(`${data}`);
    // PostMessageSend({
    //   correlationId: !!correlationId ? correlationId : "",
    //   jobSetting: {
    //     timezone: timeZone[timeZoneValue].title,
    //     delayedJob: {
    //       enqueueAt: "",
    //     },
    //     recurringJob: {
    //       cronExpression: cronExp,
    //     },
    //   },
    //   metadata: [
    //     {
    //       key: titleParams,
    //       value: messageParams,
    //     },
    //   ],
    //   workWeChatAppNotification: {
    //     appId: corpAppList[0].appId, //mark
    //     toUsers: selectUserList ? selectUserList : ["WaiTouHeWaiErDuo"],
    //   },
    // });
    // }
  }

  useEffect(() => {
    messageTypeValue.type === MessageDataType.Image && !messageTypeValue.groupBy
      ? setIsShowInputOrUpload(MessageWidgetShowStatus.ShowAll)
      : messageTypeValue.type === MessageDataType.Text
      ? setIsShowInputOrUpload(MessageWidgetShowStatus.ShowInput)
      : (() => {
          setIsShowInputOrUpload(MessageWidgetShowStatus.ShowUpload)
          setMessageParams("")
        })()
  }, [messageTypeValue])

  useEffect(() => {
    if (
      sendTypeValue.value === SendType.SendPeriodically ||
      sendTypeValue.value === SendType.SpecifiedDate
    )
      getMessageJob()
  }, [sendTypeValue])

  const getMessageJob = () => {
    updateData("loading", true)
    GetMessageJob(dto.page, dto.pageSize, 0)
      .then((res) => {
        if (!!res) {
          setTimeout(() => {
            updateData("rowCount", res.count)
            updateData("messageJobs", res.messageJobs)
            updateData("loading", false)
          }, 100)
        }
      })
      .catch((err) => {
        setTimeout(() => {
          updateData("rowCount", 0)
          updateData("messageJobs", [])
          updateData("loading", false)
        }, 100)
      })
  }

  const [dto, setDto] = useState<IDtoExtend>({
    loading: true,
    messageJobs: [],
    rowCount: 0,
    pageSize: 15,
    page: 1,
  })

  useEffect(() => {
    getMessageJob()
  }, [dto.page, dto.pageSize])

  const updateData = (k: keyof IDtoExtend, v: any) =>
    setDto((prev) => ({ ...prev, [k]: v }))

  const lastShowTableData = useMemo(() => {
    const array: ILastShowTableData[] = []
    if (dto.messageJobs.length > 0) {
      dto.messageJobs.forEach((item) =>
        array.push({
          id: item.id,
          jobId: item.jobId,
          createdDate: item.createdDate,
          correlationId: item.correlationId,
          userAccountId: item.userAccountId,
          commandJson: item.commandJson,
          jobType: item.jobType,
          jobSettingJson: item.jobSettingJson,
          destination: item.destination,
          title: item.metadata.filter((item) => item.key === "title")[0]?.value,
          content: item.metadata.filter((item) => item.key === "content")[0]
            ?.value,
        })
      )
    }
    return array
  }, [dto.messageJobs])

  return {
    corpsList,
    corpAppList,
    corpsValue,
    corpAppValue,
    messageTypeList,
    messageParams,
    messageTypeValue,
    isShowDialog,
    isShowInputOrUpload,
    setDialogValue,
    isShowMessageParams,
    departmentList,
    isTreeViewLoading,
    tagsList,
    flattenDepartmentList,
    sendTypeList,
    sendTypeValue,
    rowList,
    cronExp,
    isAdmin,
    dateValue,
    muiSxStyle,
    timeZone,
    timeZoneValue,
    titleParams,
    setCorpsValue,
    setCorpAppValue,
    setMessageParams,
    setMessageTypeValue,
    handleSubmit,
    setIsShowDialog,
    getDialogValue,
    setIsShowMessageParams,
    setSendTypeValue,
    setCronExp,
    setCronError,
    setDateValue,
    setTimeZoneValue,
    setTitleParams,
    lastShowTableData,
    dto,
    updateData,
    getMessageJob,
  }
}

export default useAction

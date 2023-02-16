import { useEffect, useState } from "react"
import { IJobSettingDto, MessageJobSendType } from "../../../../dtos/enterprise"
import { timeZone } from "../../../../dtos/send-message-job"

const useAction = () => {
  // 发送类型选择
  const [sendTypeValue, setSendTypeValue] = useState<MessageJobSendType>(
    MessageJobSendType.Delayed
  )
  // 时区选择
  const [timeZoneValue, setTimeZoneValue] = useState<number>(timeZone[0].value)
  // 发送时间
  const [dateValue, setDateValue] = useState<string>("")
  // 终止时间
  const [endDateValue, setEndDateValue] = useState<string>("")
  // 循环周期
  const [cronExp, setCronExp] = useState<string>("0 0 * * *")
  // 输出周期报错
  const [cronError, setCronError] = useState<string>("")
  //  jobSetting
  const [jobSetting, setJobSetting] = useState<IJobSettingDto>()
  // 切换时区Fun
  const switchTimeZone = (index: number) => {
    setTimeZoneValue(index)
  }

  // jobSetting参数
  useEffect(() => {
    switch (sendTypeValue) {
      case MessageJobSendType.Fire: {
        setJobSetting({
          timezone: timeZone[timeZoneValue].title
        })
        break
      }
      case MessageJobSendType.Delayed: {
        setJobSetting({
          timezone: timeZone[timeZoneValue].title,
          delayedJob: {
            enqueueAt: dateValue
          }
        })
        break
      }
      default: {
        setJobSetting({
          timezone: timeZone[timeZoneValue].title,
          recurringJob: !!endDateValue
            ? {
                cronExpression: cronExp,
                endDate: endDateValue
              }
            : {
                cronExpression: cronExp
              }
        })
        break
      }
    }
  }, [sendTypeValue, timeZoneValue, cronExp, dateValue, endDateValue])

  return {
    sendTypeValue,
    timeZoneValue,
    dateValue,
    cronExp,
    endDateValue,
    setDateValue,
    setEndDateValue,
    setCronExp,
    setCronError,
    switchTimeZone
  }
}
export default useAction

import { Boot } from "@wangeditor/editor"
import attachmentModule, {
  AttachmentElement
} from "@wangeditor/plugin-upload-attachment"
import { IEditorConfig } from "@wangeditor/editor"
import { useEffect } from "react"

const useActionEditor = () => {
  useEffect(() => {
    // 注册。要在创建编辑器之前注册，且只能注册一次，不可重复注册。
    Boot.registerModule(attachmentModule)
  }, [])

  return {}
}

export default useActionEditor

export const annexEditorConfig: Partial<IEditorConfig> = {
  // 在编辑器中，点击选中“附件”节点时，要弹出的菜单
  hoverbarKeys: {
    attachment: {
      menuKeys: ["downloadAttachment"] // “下载附件”菜单
    }
  },
  MENU_CONF: {
    // “上传附件”菜单的配置
    uploadAttachment: {
      server: "/api/upload", // 服务端地址
      timeout: 5 * 1000,

      fieldName: "custom-fileName",
      meta: { token: "xxx", a: 100 }, // 请求时附加的数据
      metaWithUrl: true, // meta 拼接到 url 上
      headers: { Accept: "text/x-json" },

      maxFileSize: 10 * 1024 * 1024,

      onBeforeUpload(file: File) {
        console.log("onBeforeUpload", file)
        return file // 上传 file 文件 return false 会阻止上传
      },
      onProgress(progress: number) {
        console.log("onProgress", progress)
      },
      onSuccess(file: File, res: any) {
        console.log("onSuccess", file, res)
      },
      onFailed(file: File, res: any) {
        alert(res.message)
        console.log("onFailed", file, res)
      },
      onError(file: File, err: Error, res: any) {
        alert(err.message)
        console.error("onError", file, err, res)
      },

      // 插入到编辑器后的回调
      onInsertedAttachment(elem: AttachmentElement) {
        console.log("inserted attachment", elem)
      }
    }
  }
}

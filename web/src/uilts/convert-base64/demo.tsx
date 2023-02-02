import { convertBase64 } from "."

export const Demo = () => {
  const uploadFile = async (files: FileList) => {
    const file = files[0]
    const base64 = await convertBase64(file)
    console.log(base64 as string)
  }

  return (
    <div>
      <input
        type="file"
        onChange={(e) => !!e.target.files && uploadFile(e.target.files)}
      />
    </div>
  )
}

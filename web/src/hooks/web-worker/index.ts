export default class WebWorker extends Worker {
  constructor(worker: Function) {
    const code = worker.toString()
    const codeBody = code.substring(
      code.indexOf("{") + 1,
      code.lastIndexOf("}")
    )

    const blob = new Blob([codeBody], { type: "text/javascript" })

    super(URL.createObjectURL(blob))
  }
}

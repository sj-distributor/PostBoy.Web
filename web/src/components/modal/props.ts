import { ReactElement } from "react"

export interface ModalBoxProps {
  onCancel: () => void
  title?: string
  children: ReactElement
  footerComponent?: ReactElement
  headComponent?: ReactElement
  haveCloseIcon?: boolean
}

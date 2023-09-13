import { ReactElement } from "react"

export interface RouteItem {
  path: string
  head: string
  icons?: JSX.Element
  element: ReactElement
  children?: ChildProps[]
}

export interface ChildProps {
  path: string
  title: string
  elementChild: ReactElement
}

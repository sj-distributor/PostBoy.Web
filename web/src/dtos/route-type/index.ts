import { ReactElement } from "react"

export interface RouteItem {
  path: string
  head: string
  icons: string
  element: ReactElement
  children?: ChildProps[]
}

export interface ChildProps {
  path: string
  title: string
  elementChild: ReactElement
}

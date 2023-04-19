export interface DateTimeProps {
  selectList: { value: string; lable: string }[];
  getDateTimeData: (data: DateTimeData) => void;
}

export interface DateTimeData {
  date: string;
  time: string;
}

export enum SelectType {
  startTime = 0,
  endTime = 1,
}

export interface SelectDataType {
  value: string;
  lable: string;
}

export interface SelectGroupType {
  title: string;
  key: string;
  value: string | null;
  data: SelectDataType[];
  isIcon?: boolean;
}

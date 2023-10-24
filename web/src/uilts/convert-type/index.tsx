import {
  IDepartmentAndUserListValue,
  IWorkWeChatAppNotificationDto,
} from "../../dtos/enterprise";

export const convertType = (data: IWorkWeChatAppNotificationDto) => {
  if (data.file !== undefined) {
    data.file.fileContent = data.file.fileContent?.split("base64,")[1];
  }
  if (data.mpNews !== undefined) {
    data.mpNews.articles = data.mpNews.articles.map((item) => {
      if (item.fileContent !== undefined && item.fileContent !== null) {
        item.fileContent = item.fileContent.split("base64,")[1];
      }
      return item;
    });
  }
  return data;
};

export const setFilterChildren = (arr: IDepartmentAndUserListValue[]) => {
  const childNames = new Set<string>();

  arr.forEach((item) => {
    if (item.children.length) {
      item.children.forEach((child) => {
        childNames.add(child.name);
      });
    }
  });

  arr = arr.filter((item) => !childNames.has(item.name));

  return arr;
};

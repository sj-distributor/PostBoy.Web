import WebWorker from "../../hooks/webWorker";
import { IDepartmentAndUserListValue } from "../../dtos/enterprise";

export const MyWorker = () => {
  function workerCode(this: Worker) {
    enum ClickType {
      Collapse,
      Select,
    }

    interface IWebWorkerEventRecive {
      type: ClickType;
      clickedItem: IDepartmentAndUserListValue[];
      selectedList: IDepartmentAndUserListValue[];
      flattenList: IDepartmentAndUserListValue[];
      indeterminateList: IDepartmentAndUserListValue[];
      foldMap: Map<string | number, IDepartmentAndUserListValue>;
    }

    this.onmessage = (event: { data: IWebWorkerEventRecive }) => {
      const {
        type,
        clickedItem,
        selectedList,
        flattenList,
        indeterminateList,
        foldMap,
      } = event.data;

      const getUniqueId = (value: IDepartmentAndUserListValue): string => {
        return `${value.id}${value.idRoute?.join("")}`;
      };

      const setAllChildrenById = (
        id: string | number,
        childrenList: IDepartmentAndUserListValue[],
        isSelected: boolean
      ) => {
        const mapItem = foldMap.get(id);

        //向下
        mapItem &&
          mapItem.children.forEach((item) => {
            const innerItem = foldMap.get(getUniqueId(item));
            if (innerItem) {
              const flattenItem = flattenList.find(
                (x) => getUniqueId(x) === getUniqueId(innerItem)
              );
              flattenItem && childrenList.push(flattenItem);
              innerItem.children.length > 0 &&
                setAllChildrenById(
                  getUniqueId(innerItem),
                  childrenList,
                  isSelected
                );
            }
          });

        return childrenList;
      };

      const handleIndeterminateList = (
        clickedItem: IDepartmentAndUserListValue,
        selectedList: IDepartmentAndUserListValue[],
        indeterminateList: IDepartmentAndUserListValue[]
      ) => {
        /*
          处理indeterminateList横杠列表的方法
          找出所有父数据的children是否全选中/全不选中(直接对比selectedList即可) 或 有杠 (此处处理顺序必须从点击项开始往上)
          只要数据符合条件便set入resultList
          return一个resultList
        */
        const resultList: IDepartmentAndUserListValue[] = [
          ...indeterminateList,
        ];
        const idRouteList = clickedItem.idRoute?.slice().reverse();

        idRouteList?.forEach((item) => {
          const idIndex = (item: number) =>
            clickedItem.idRoute?.findIndex((x) => x === item) ?? 0;
          const mapItem = foldMap.get(
            `${item}${clickedItem.idRoute
              ?.slice(0, idIndex(item) + 1)
              .join("")}`
          );

          if (mapItem) {
            const idSelectedList = selectedList.map((x) => x.id);
            const idIndeterminateList = resultList.map((x) => x.id);
            const determine = {
              allSelected: mapItem?.children.every((child) =>
                idSelectedList.includes(child.id)
              ),
              allNotSelected: mapItem?.children.every(
                (child) => !idSelectedList.includes(child.id)
              ),
              someIndeterminate: mapItem?.children.some((child) =>
                idIndeterminateList.includes(child.id)
              ),
            };

            const activeIndex = resultList.findIndex(
              (x) => x.id === mapItem.id
            );
            determine.allSelected &&
              !determine.allNotSelected &&
              !selectedList.some((item) => item.id === mapItem.id) &&
              selectedList.push(mapItem);
            determine.someIndeterminate ||
            (!determine.allSelected && !determine.allNotSelected)
              ? activeIndex === -1 && resultList.push(mapItem)
              : activeIndex > -1 && resultList.splice(activeIndex, 1);
          }
        });

        return resultList;
      };

      const handleMapUpdate = (
        selectedList: IDepartmentAndUserListValue[],
        indeterminateList: IDepartmentAndUserListValue[]
      ) => {
        for (const [key, value] of foldMap.entries()) {
          const selectedListItem = selectedList.find(
            (item) => item.id === value.id
          );
          const indeterminateListItem = indeterminateList.find(
            (item) => item.id === value.id
          );
          foldMap.set(key, {
            ...value,
            selected: !!selectedListItem,
            indeterminate: !!indeterminateListItem,
          });
        }
      };

      for (const value of clickedItem) {
        const mapItem = foldMap.get(getUniqueId(value));

        if (mapItem) {
          if (type === ClickType.Collapse) {
            // 折叠
            foldMap.set(getUniqueId(value), {
              ...mapItem,
              isCollapsed: !mapItem.isCollapsed,
            });
            this.postMessage({
              foldMap,
            });
          } else {
            const updateSelectedList = [
              ...setAllChildrenById(getUniqueId(value), [], true),
              ...clickedItem,
            ];

            let newSelectedList = mapItem.selected
              ? selectedList.filter(
                  (value) =>
                    !updateSelectedList.some((item) => item.id === value.id)
                )
              : [...selectedList, ...updateSelectedList];

            const newIndeterminateList = handleIndeterminateList(
              mapItem,
              newSelectedList,
              indeterminateList
            );

            newSelectedList = newSelectedList.filter(
              (value) =>
                !newIndeterminateList.some((item) => item.id === value.id)
            );

            // setSelectedList(newSelectedList);
            // setIndeterminateList(newIndeterminateList);
            handleMapUpdate(newSelectedList, newIndeterminateList);
            this.postMessage({
              newSelectedList,
              newIndeterminateList,
              foldMap,
            });
          }
        }
      }
    };
  }
  const myWorker = new WebWorker(workerCode);
  return myWorker;
};

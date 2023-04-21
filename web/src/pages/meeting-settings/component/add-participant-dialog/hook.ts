import { cloneElement, useState } from "react";

const useAction = () => {
  const [searchData, setSearchData] = useState<[]>([]);

  const [selectedData, setSelectedData] = useState([
    {
      avatar:
        "https://img1.baidu.com/it/u=928879359,2870156212&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1681578000&t=375470fe9a362c575908e7b397fa0e69",
      name: "awsl",
    },
    {
      avatar:
        "https://img1.baidu.com/it/u=928879359,2870156212&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1681578000&t=375470fe9a362c575908e7b397fa0e69",
      name: "awsl",
    },
    {
      avatar:
        "https://img1.baidu.com/it/u=928879359,2870156212&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1681578000&t=375470fe9a362c575908e7b397fa0e69",
      name: "awsl",
    },
  ]);
  const [dense, setDense] = useState<boolean>(false);
  const [secondary, setSecondary] = useState<boolean>(false);
  const [openListItem, setOpenListItem] = useState<boolean>(true);

  const handleClick = () => {
    setOpenListItem(!openListItem);
  };

  const delSelectedItem = (index: number) => {
    const newList = selectedData;
    newList.splice(index, 1);
    setSelectedData([...newList]);
  };
  return {
    searchData,
    openListItem,
    dense,
    selectedData,
    secondary,
    handleClick,
    delSelectedItem,
  };
};

export default useAction;

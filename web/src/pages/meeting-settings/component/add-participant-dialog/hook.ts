import { useEffect, useState } from "react";
import {
  ContactsDataType,
  SelectParticipantList,
} from "../../../../dtos/meeting-seetings";

const useAction = () => {
  const [contactsData, setContactsData] = useState<ContactsDataType[] | null>(
    null
  );

  const [selectedData, setSelectedData] = useState<SelectParticipantList[]>([
    {
      avatar:
        "https://img1.baidu.com/it/u=928879359,2870156212&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1681578000&t=375470fe9a362c575908e7b397fa0e69",
      name: "awsl",
    },
    {
      avatar:
        "https://img1.baidu.com/it/u=928879359,2870156212&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1681578000&t=375470fe9a362c575908e7b397fa0e69",
      name: "ylk",
    },
    {
      avatar:
        "https://img1.baidu.com/it/u=928879359,2870156212&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1681578000&t=375470fe9a362c575908e7b397fa0e69",
      name: "usa",
    },
  ]);
  const [dense, setDense] = useState<boolean>(false);
  const [secondary, setSecondary] = useState<boolean>(false);
  const [openListItem, setOpenListItem] = useState<boolean>(true);

  const handleClick = () => {
    setOpenListItem(!openListItem);
  };

  const delSelectedItem = (name: string) => {
    const newList = selectedData;
    setSelectedData([...newList.filter((item) => item.name !== name)]);
  };

  useEffect(() => {
    setTimeout(() => {
      setContactsData([]);
    }, 2000);
  });

  return {
    contactsData,
    openListItem,
    dense,
    selectedData,
    secondary,
    handleClick,
    delSelectedItem,
  };
};

export default useAction;

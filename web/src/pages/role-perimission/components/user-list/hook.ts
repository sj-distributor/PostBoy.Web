import { useRef } from "react";
import { ModalBoxRef } from "../../../../dtos/modal";

export const useAction = () => {
  const addUsersRef = useRef<ModalBoxRef>(null);

  const onAddUsersCancel = () => addUsersRef.current?.close();

  const handleSearch = () => {
    console.log("Search initiated.");
  };

  return { handleSearch, addUsersRef, onAddUsersCancel };
};

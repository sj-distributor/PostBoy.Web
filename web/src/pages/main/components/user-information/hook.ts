import { useState } from "react";

const useAction = () => {
  const [menuElement, setMenuElement] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setMenuElement(event.currentTarget);
  };

  return { menuElement, setMenuElement, handleMenu };
};

export default useAction;

import React, { useState } from "react";

const useAction = () => {
  const [clickIndex, setClickIndex] = useState<number>();
  return {
    clickIndex,
    setClickIndex,
  };
};

export default useAction;

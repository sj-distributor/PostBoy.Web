import { useEffect, useState } from "react";
import { IDepartmentAndUserListValue } from "../../dtos/enterprise";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import { difference } from "ramda";
import styles from "./index.module.scss";

interface ITagsProps {
  selectedList: IDepartmentAndUserListValue[];
  limit: number;
  handleClear: (
    valueArr: IDepartmentAndUserListValue[],
    reason: string,
    clickItem?: IDepartmentAndUserListValue
  ) => void;
}

const TagsComponent = ({ selectedList, limit, handleClear }: ITagsProps) => {
  const [reselectList, setReselectList] = useState<
    IDepartmentAndUserListValue[]
  >([]);
  const [index, setIndex] = useState<number>(0);

  useEffect(() => {
    let timer: any = null;

    if (limit > 500) {
      timer = setInterval(() => {
        if (reselectList.length !== selectedList.length) {
          setReselectList((prev) => [
            ...prev,
            ...selectedList.slice(index, index + 500),
          ]);
          setIndex((prev) => prev + 500);
        } else {
          clearInterval(timer);
        }
      }, 500);
    } else {
      setReselectList(selectedList);
    }

    return () => {
      clearInterval(timer);
    };
  }, [reselectList, selectedList]);

  return (
    <>
      {reselectList.map((item) => {
        return (
          <span
            className={styles.selectedTags}
            key={`${item.id}${item.idRoute?.join("")}`}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {item.name}
              <ClearOutlinedIcon
                className={styles.clearIcon}
                onClick={(e) => {
                  e.stopPropagation();
                  const newValueArr = reselectList.filter(
                    (value) => value.id !== item.id
                  );
                  setReselectList(newValueArr);
                  handleClear(newValueArr, "removeOption", item);
                }}
                sx={{
                  bgcolor: "rgba(174,174,174,0.7)",
                  padding: "0.1rem",
                  boxSizing: "border-box",
                  borderRadius: "50%",
                  fontSize: "1rem",
                  marginLeft: "0.5rem",
                  color: "white",
                }}
              />
            </div>
          </span>
        );
      })}
    </>
  );
};

export default TagsComponent;

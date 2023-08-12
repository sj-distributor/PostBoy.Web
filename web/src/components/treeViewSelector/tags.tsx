import { useEffect, useState } from "react";
import { IDepartmentAndUserListValue } from "../../dtos/enterprise";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
interface ITagsProps {
  selectedList: IDepartmentAndUserListValue[];
  limit: number;
}

const TagsComponent = ({ selectedList, limit }: ITagsProps) => {
  const [reselectList, setReselectList] = useState<
    IDepartmentAndUserListValue[]
  >([]);
  const [index, setIndex] = useState<number>(0);

  useEffect(() => {
    // console.log("dd", reselectList.length);
    // console.log(index);
    // console.log(reselectList);
    let timer: any = null;

    if (limit > 500) {
      timer = setInterval(() => {
        if (reselectList.length !== selectedList.length) {
          setReselectList((prev) => [
            ...prev,
            ...selectedList.slice(index, index + 500),
          ]);
          setIndex((prev) => prev + 500);
        }
      }, 500);
    } else {
      setReselectList(selectedList);
    }

    console.log(
      "kk",
      reselectList.filter(
        (item) =>
          `${item.id}${item.idRoute?.join("")}` === "EDDY.M1478479480911483"
      )
    );
    return () => {
      clearInterval(timer);
    };
  }, [reselectList, selectedList]);

  return (
    <>
      {reselectList.map((item) => {
        item.idRoute?.join("") === "1478479480911483" &&
          console.log(item.id + `${item.idRoute?.join("")}`);
        return (
          <span
            style={{
              backgroundColor: "#ebebeb",
              borderRadius: "0.8rem",
              fontSize: "0.14rem",
              padding: "0 0.5rem",
              margin: "0.2rem 0.2rem 0.2rem 0",
              display: "inline-block",
            }}
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
                sx={{
                  cursor: "pointer",
                  bgcolor: "#aeaeae",
                  borderRadius: "50%",
                  fontSize: "1rem",
                  marginLeft: "0.5rem",
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

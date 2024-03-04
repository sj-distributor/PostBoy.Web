import style from "./modal.module.scss";
import Close from "@mui/icons-material/Close";
import { ModalBoxProps } from "./props";
import {
  FunctionComponent as Component,
  forwardRef,
  RefAttributes,
  useImperativeHandle,
  useState,
  memo,
  useEffect,
} from "react";
import { useUnmount } from "ahooks";

const ModalBox: Component<ModalBoxProps> = memo(
  forwardRef(
    (
      {
        onCancel,
        title,
        children,
        footerComponent,
        headComponent,
        haveCloseIcon = true,
      }: ModalBoxProps,
      ref
    ) => {
      const [visible, setVisible] = useState<boolean>(false);
      const [index, setIndex] = useState<number>(0);

      const open = () => {
        setVisible(true);
        setIndex((prev) => prev + 1);
      };

      const close = () => {
        setVisible(false);
        setIndex(0);
      };

      useUnmount(() => {
        setIndex(0);
      });

      useEffect(() => {
        if (index === 1 && !setVisible) {
          onCancel();
        }
      }, [index, setVisible]);

      useImperativeHandle(ref, () => ({
        open,
        close,
      }));

      return (
        <div>
          {visible && (
            <div className={style.modalBox}>
              <div className={style.boxWrap}>
                {headComponent ? (
                  headComponent
                ) : (
                  <div className={style.boxTitle}>
                    <span className={style.boxTitleText}>{title}</span>
                    <div className={style.cancle}>
                      {haveCloseIcon && (
                        <Close
                          className={style.icon}
                          onClick={() => {
                            close();
                          }}
                        />
                      )}
                    </div>
                  </div>
                )}
                <div className={style.boxBody}>{children}</div>
                {footerComponent && footerComponent}
              </div>
            </div>
          )}
        </div>
      );
    }
  )
);

export default ModalBox;

import style from "./modal.module.scss";
import Close from "@mui/icons-material/Close";
import { ModalBoxProps } from "./props";
import {
  FunctionComponent as Component,
  forwardRef,
  RefAttributes,
  useImperativeHandle,
  useState,
} from "react";

const ModalBox: Component<ModalBoxProps & RefAttributes<unknown>> = forwardRef(
  (
    {
      onCancel,
      title,
      children,
      footerComponent,
      headComponent,
    }: ModalBoxProps,
    ref
  ) => {
    const [visible, setVisible] = useState<boolean>(false);

    const open = () => {
      setVisible(true);
    };

    const close = () => {
      setVisible(false);
      onCancel && onCancel();
    };

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
                    <Close className={style.icon} onClick={onCancel} />
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
);

export default ModalBox;

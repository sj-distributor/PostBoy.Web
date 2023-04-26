import styles from "./index.module.scss"
import Accordion from "@mui/material/Accordion"
import AccordionSummary from "@mui/material/AccordionSummary"
import AccordionDetails from "@mui/material/AccordionDetails"
import Typography from "@mui/material/Typography"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import useAction from "./hook"
import { Button, Snackbar } from "@mui/material"
import ModalBox from "../../components/modal/modal"
import CorpAppDialog from "./component/corp-app-dialog"
import { AddOrModify, RowDataType } from "../../dtos/app-manager"

const User = () => {
  const {
    corpsList,
    corpAppList,
    dialogRef,
    rowData,
    rowDataType,
    defaultCorpRowData,
    defaultAppRowData,
    tipsText,
    setTipsText,
    setRowData,
    setRowDataType,
    onAddCorpCancel,
    onListClick,
    reload,
  } = useAction()

  return (
    <div className={styles.user}>
      <ModalBox ref={dialogRef} onCancel={onAddCorpCancel}>
        <CorpAppDialog
          rowData={rowData}
          rowDataType={rowDataType}
          onAddApikeyCancel={onAddCorpCancel}
          reload={reload}
          tipsText={tipsText}
          setTipsText={setTipsText}
        />
      </ModalBox>
      <Button
        variant="contained"
        className={styles.registerButton}
        onClick={() => {
          setRowData(defaultCorpRowData)
          setRowDataType(AddOrModify.Add)
          dialogRef.current?.open()
        }}
      >
        新增企业
      </Button>
      {corpsList?.map((item, key) => (
        <Accordion className={styles.accordion} key={key}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            className={styles.accordionSummary}
            onClick={() => onListClick(item.id)}
            id="AccordionSummary"
          >
            <Typography>{item.corpName}</Typography>
            <Button
              variant="contained"
              className={styles.addButton}
              onClick={(event) => {
                setRowData(
                  Object.assign(defaultAppRowData, {
                    data: { workWeChatCorpId: item.id },
                  })
                )
                setRowDataType(AddOrModify.Add)
                dialogRef.current?.open()
                event.stopPropagation()
              }}
            >
              新增应用
            </Button>
            <Button
              variant="contained"
              className={styles.addButton}
              onClick={(event) => {
                setRowData({ data: item, key: RowDataType.Corporation })
                setRowDataType(AddOrModify.Modify)
                dialogRef.current?.open()
                event.stopPropagation()
              }}
            >
              修改
            </Button>
          </AccordionSummary>
          {corpAppList.map((items) => {
            return items.map((appItem, appIndex) => {
              if (appItem.workWeChatCorpId === item.id) {
                return (
                  <AccordionDetails
                    key={appIndex}
                    className={styles.accordionDetails}
                  >
                    <Typography>{appItem.name}</Typography>
                    <Button
                      variant="contained"
                      className={styles.addButton}
                      onClick={(event) => {
                        setRowData({
                          data: appItem,
                          key: RowDataType.Application,
                        })
                        setRowDataType(AddOrModify.Modify)
                        dialogRef.current?.open()
                        event.stopPropagation()
                      }}
                    >
                      修改
                    </Button>
                  </AccordionDetails>
                )
              }
            })
          })}
        </Accordion>
      ))}
      <Snackbar
        message={tipsText}
        open={!!tipsText}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      />
    </div>
  )
}

export default User

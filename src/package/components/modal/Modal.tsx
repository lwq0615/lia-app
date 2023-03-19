import { Modal, ModalFuncProps } from "antd";
import './modal.scss'



export default function modal(props?: ModalFuncProps): void {

  const className = props?.className ? (props.className + " ant-modal-hoc") : "ant-modal-hoc"

  Modal[props?.cancelText === false ? 'success' : "confirm"]({
    width: 1000,
    centered: true,
    closable: true,
    okText: "确定",
    maskClosable: true,
    ...props,
    className
  })
}

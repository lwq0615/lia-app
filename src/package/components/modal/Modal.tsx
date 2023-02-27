import { Modal, ModalFuncProps } from "antd";
import ReactDOM from 'react-dom';

const dom = document.createElement("div")
document.body.appendChild(dom)

export default function modal(props?: ModalFuncProps): void{
  ReactDOM.render(<Modal {...props} open={true}/>, dom);
}
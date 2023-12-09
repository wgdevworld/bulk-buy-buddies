import React, { ReactNode } from "react";
import styles from "./Modal.module.css";

interface ModalProps {
  show: boolean;
  close: () => void;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ show, close, children }) => {
  if (!show) {
    return null;
  }

  return (
    <div className={styles.modal} onClick={close}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <span className={styles.close} onClick={close}>
          &times;
        </span>
        {children}
      </div>
    </div>
  );
};

export default Modal;

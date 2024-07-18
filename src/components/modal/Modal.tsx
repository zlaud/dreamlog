import React from "react";
import styles from "./Modal.module.css";

interface ModalProps {
    show: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ show, onClose, onConfirm, title, children }) => {
    if (!show) return null;

    return (
        <div className={styles.modalBackdrop}>
            <div className={styles.modalContent}>
                <h2>{title}</h2>
                <div className={styles.modalBody}>{children}</div>
                <div className={styles.modalFooter}>
                    <button className={styles.cancelButton} onClick={onClose}>No</button>
                    <button className={styles.confirmButton} onClick={onConfirm}>Yes</button>
                </div>
            </div>
        </div>
    );
};

export default Modal;

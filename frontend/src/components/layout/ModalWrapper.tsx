"use client";
import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  open: boolean;
  onClose: () => void; 
};

const ModalWrapper = ({ children, open, onClose }: Props) => {
  const modalRoot =
    typeof window !== "undefined"
      ? document.getElementById("modal-root")
      : null;

  const [show, setShow] = useState(false);

  // Handle ESC key to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (open) {
      setShow(true);
      document.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      const timeout = setTimeout(() => setShow(false), 300); 
      return () => clearTimeout(timeout);
    } else {
      setShow(true);
    }
  }, [open]);

  if (!modalRoot || !show) return null;

  return ReactDOM.createPortal(
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 transition-opacity duration-300 ${
        open ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {children}
    </div>,
    modalRoot
  );
};

export default ModalWrapper;

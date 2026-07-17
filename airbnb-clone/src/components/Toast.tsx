import React, { memo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useApp } from "../context/AppContext";

const Toast = memo(function Toast() {
  const { toasts } = useApp();

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] flex flex-col-reverse gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.2, 0, 0, 1] }}
            role="status"
            aria-live="polite"
            className="bg-neutral-900 text-white text-sm px-6 py-3.5 rounded-xl shadow-modal flex items-center gap-2 border border-neutral-800 pointer-events-auto whitespace-nowrap"
          >
            <span>{toast.text}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
});

export default Toast;

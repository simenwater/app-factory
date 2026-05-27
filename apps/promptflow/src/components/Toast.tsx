'use client';

import { CheckCircle, XCircle, X } from 'lucide-react';

/** @description Toast 组件 Props */
interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

/**
 * @description 消息提示组件
 * @param {ToastProps} props
 */
export function Toast({ message, type, onClose }: ToastProps) {
  return (
    <div className="toast-enter fixed left-1/2 top-4 z-[100] -translate-x-1/2">
      <div
        className="flex items-center gap-2 rounded-lg px-4 py-2.5 shadow-lg"
        style={{
          background: type === 'success' ? 'var(--success)' : 'var(--danger)',
          color: 'white',
        }}
      >
        {type === 'success' ? <CheckCircle size={16} /> : <XCircle size={16} />}
        <span className="text-sm font-medium">{message}</span>
        <button onClick={onClose} className="ml-2 rounded p-0.5 hover:bg-white/20">
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

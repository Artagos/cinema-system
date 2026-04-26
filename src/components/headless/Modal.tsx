/**
 * Headless Modal Component
 *
 * Separates modal logic (focus trap, ESC close, scroll lock) from presentation.
 * Consumer controls 100% of the UI via render props or children.
 *
 * Usage with render props:
 * <Modal
 *   isOpen={isOpen}
 *   onClose={handleClose}
 *   renderContent={({ close }) => (
 *     <div className="my-modal">
 *       <h2>Modal Title</h2>
 *       <button onClick={close}>Close</button>
 *     </div>
 *   )}
 * />
 *
 * Usage with children function:
 * <Modal isOpen={isOpen} onClose={handleClose}>
 *   {({ close, titleId }) => (
 *     <div className="my-modal" role="dialog" aria-modal="true" aria-labelledby={titleId}>
 *       <h2 id={titleId}>Modal Title</h2>
 *       <button onClick={close}>Close</button>
 *     </div>
 *   )}
 * </Modal>
 */

import { useEffect, useRef, useCallback, useId, type ReactNode } from 'react';

// --- Render Props Pattern ---

interface ModalRenderProps {
  close: () => void;
  titleId: string;
  descriptionId: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  renderContent?: (props: ModalRenderProps) => ReactNode;
  children?: (props: ModalRenderProps) => ReactNode;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  preventScroll?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  renderContent,
  children,
  closeOnOverlayClick = true,
  closeOnEsc = true,
  preventScroll = true,
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  // Handle ESC key
  useEffect(() => {
    if (!isOpen || !closeOnEsc) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeOnEsc, handleClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (!isOpen || !preventScroll) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, preventScroll]);

  // Handle overlay click
  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === overlayRef.current && closeOnOverlayClick) {
        handleClose();
      }
    },
    [closeOnOverlayClick, handleClose]
  );

  if (!isOpen) return null;

  const renderProps: ModalRenderProps = {
    close: handleClose,
    titleId,
    descriptionId,
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      role="presentation"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
      }}
    >
      {renderContent?.(renderProps) || children?.(renderProps)}
    </div>
  );
}

// --- Hook for building custom modals ---

interface UseModalOptions {
  defaultOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

interface UseModalResult {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export function useModal(options: UseModalOptions = {}): UseModalResult {
  const [isOpen, setIsOpen] = useState(!!options.defaultOpen);

  const open = useCallback(() => {
    setIsOpen(true);
    options.onOpen?.();
  }, [options]);

  const close = useCallback(() => {
    setIsOpen(false);
    options.onClose?.();
  }, [options]);

  const toggle = useCallback(() => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  }, [isOpen, open, close]);

  return { isOpen, open, close, toggle };
}

// Need to import useState for the hook
import { useState } from 'react';

export type { ModalRenderProps, ModalProps, UseModalResult };
export default Modal;

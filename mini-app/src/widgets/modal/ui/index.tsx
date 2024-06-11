import cs from 'classnames';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

import { ModalContainerProps } from '../model/types/index.types';

const modalContainer = document.getElementById('modal-root');

export const ModalContainer = ({
  children,
  closeModal,
  title = '',
  header = true,
  className = '',
}: ModalContainerProps) => {
  useEffect(() => {
    const closeEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keyup', closeEsc);
    return () => {
      window.removeEventListener('keyup', closeEsc);
    };
  }, [closeModal]);

  return createPortal(
    <div
      className={cs(
        'w-[100vw] h-[90vh] top-0 left-0 flex justify-center items-center fixed z-20 transition-opacity duration-500 ease-in',
        children ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
      )}
    >
      <div className={cs('w-[100vw] h-[100vh] bg-white-main py-16')} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    modalContainer as Element,
  );
};

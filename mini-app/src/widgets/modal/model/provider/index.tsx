import classNames from 'classnames';
import React, { createContext, useContext, useMemo, useState } from 'react';

import { ModalContainer } from 'widgets/modal/ui';

export type ModalData = {
  children: React.ReactNode;
  title?: string;
  header?: boolean;
  className?: string;
};

export type Foo = {
  modalData?: ModalData;
  setModalData: (p: ModalData) => void;
  closeModal: () => void;
};

const ModalContext = createContext<Foo>({
  modalData: undefined,
  setModalData: () => ({}),
  closeModal: () => ({}),
});

const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isBack, setIsBack] = useState<boolean>(false);
  const [modalData, setModalData] = useState<ModalData>();

  const closeModal = () => {
    setModalData(undefined);
    setIsBack(false);
  };

  const foo: Foo = useMemo(
    () => ({
      modalData,
      confirm,
      setModalData,
      closeModal,
    }),
    [modalData],
  );

  return (
    <ModalContext.Provider value={foo}>
      {children}
      {modalData && (
        <ModalContainer
          title={modalData.title}
          className={classNames(modalData.className, isBack && 'hidden')}
          closeModal={closeModal}
          header={modalData.header}
        >
          {modalData.children}
        </ModalContainer>
      )}
    </ModalContext.Provider>
  );
};

const useModalContext = () => useContext(ModalContext);

export { ModalProvider, useModalContext };

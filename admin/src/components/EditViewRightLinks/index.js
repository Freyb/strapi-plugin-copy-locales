import React, { useState } from 'react';
import { useCMEditViewDataManager } from '@strapi/helper-plugin';

import PreviewButton from '../PreviewButton';
import CopyModal from '../CopyModal';

const EditViewRightLinks = () => {
  const cmdatamanager = useCMEditViewDataManager();
  console.log('cmdatamanager');
  console.log(cmdatamanager);

  const [isModalOpen, setModalOpen] = useState(false);
  const toggleModal = () => setModalOpen((s) => !s);

  const { isCreatingEntry } = cmdatamanager;

  if (isCreatingEntry) return null;

  return (
    <>
      <PreviewButton onClick={toggleModal} />
      <CopyModal isOpen={isModalOpen} onClose={toggleModal} entity={null} />
    </>
  );
};

export default EditViewRightLinks;

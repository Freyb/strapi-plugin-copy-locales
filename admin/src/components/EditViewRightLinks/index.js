import React, { useState } from 'react';
import {
  useNotification,
  useCMEditViewDataManager,
  useRBACProvider,
} from '@strapi/helper-plugin';
import { request } from '@strapi/helper-plugin';

import PreviewButton from '../PreviewButton';
import CopyModal from '../CopyModal';
import { pluginId } from '../../pluginId';
import getTrad from '../../utils/getTrad';

const EditViewRightLinks = () => {
  const toggleNotification = useNotification();
  const cmdatamanager = useCMEditViewDataManager();
  const { refetchPermissions } = useRBACProvider();
  console.log('cmdatamanager');
  console.log(cmdatamanager);
  const { allLayoutData, isCreatingEntry, modifiedData } = cmdatamanager;
  const { contentType } = allLayoutData;

  const [isModalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toggleModal = () => setModalOpen((s) => !s);

  const handleSubmit = () => {
    setIsLoading(true);
    request(`/${pluginId}/generate`, {
      method: 'POST',
      body: { contentType, data: modifiedData },
    })
      .then(async () => {
        toggleNotification({
          type: 'success',
          message: {
            id: getTrad('genearate.notification.success'),
            defaultMessage: 'Success',
          },
        });
        setIsLoading(false);
        toggleModal();
        await refetchPermissions();
      })
      .catch(() => {
        toggleNotification({
          type: 'warning',
          message: {
            id: getTrad('genearate.notification.error'),
            defaultMessage: 'Error',
          },
        });
        setIsLoading(false);
        toggleModal();
      });
  };

  const handleCancel = () => {
    if (!isLoading) toggleModal();
  };

  if (isCreatingEntry) return null;

  return (
    <>
      <PreviewButton onClick={toggleModal} />
      <CopyModal
        isOpen={isModalOpen}
        onClose={handleCancel}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </>
  );
};

export default EditViewRightLinks;

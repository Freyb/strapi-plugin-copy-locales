import React, { useState } from 'react';
import {
  useNotification,
  useCMEditViewDataManager,
  useRBACProvider,
} from '@strapi/helper-plugin';
import { request } from '@strapi/helper-plugin';
import isEqual from 'lodash/isEqual';

import PreviewButton from '../PreviewButton';
import CopyModal from '../CopyModal';
import { pluginId } from '../../pluginId';
import getTrad from '../../utils/getTrad';
import useConfig from '../../hooks/useConfig';

const EditViewRightLinks = () => {
  const toggleNotification = useNotification();
  const cmdatamanager = useCMEditViewDataManager();
  const { refetchPermissions } = useRBACProvider();
  const { config, isLoading: configIsLoading } = useConfig();

  const { allLayoutData, isCreatingEntry, initialData, modifiedData } =
    cmdatamanager;
  const { contentType } = allLayoutData;
  const { uid } = contentType;

  const isLocalized = contentType?.pluginOptions?.i18n.localized || false;
  const allowedEntity =
    !configIsLoading &&
    (config.contentTypes === '*' || config.contentTypes.includes(uid));
  const didChangeData = !isEqual(initialData, modifiedData);

  const [isModalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toggleModal = () => setModalOpen((s) => !s);

  const handleButtonClick = () => {
    if (!didChangeData) toggleModal();
    else {
      toggleNotification({
        type: 'warning',
        message: {
          id: getTrad('notification.generate.modifieddata'),
          defaultMessage: 'First, save your data!',
        },
      });
    }
  };

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
            id: getTrad('notification.generate.success'),
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
            id: getTrad('notification.generate.error'),
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

  if (!isLocalized || !allowedEntity || isCreatingEntry) return null;

  return (
    <>
      <PreviewButton onClick={handleButtonClick} />
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

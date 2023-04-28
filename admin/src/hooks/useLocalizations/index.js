import { useEffect, useState } from 'react';
import { request, useNotification } from '@strapi/helper-plugin';
import { pluginId } from '../../pluginId';

const getLocalizations = async (uid, id) => {
  try {
    const data = await request(
      `/${pluginId}/getlocalizations?uid=${uid}&id=${id}`,
      {
        method: 'GET',
      },
    );

    return data;
  } catch (e) {
    throw e;
  }
};

const useGetLocalizations = (uid, id) => {
  const toggleNotification = useNotification();
  const [isLoading, setIsLoading] = useState(true);
  const [localizations, setLocalizations] = useState([]);

  useEffect(() => {
    if (!uid || !id) return;
    getLocalizations(uid, id)
      .then((localizations) => {
        setLocalizations(localizations);
      })
      .catch(() => {
        toggleNotification({
          type: 'warning',
          message: { id: 'notification.error' },
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [toggleNotification, uid, id]);

  return { localizations, isLoading };
};

export default useGetLocalizations;

import { useEffect, useState } from 'react';
import { request, useNotification } from '@strapi/helper-plugin';

const fetchLocalesList = async () => {
  try {
    const data = await request('/i18n/locales', {
      method: 'GET',
    });

    return data;
  } catch (e) {
    throw e;
  }
};

const useLocales = () => {
  const toggleNotification = useNotification();
  const [isLoading, setIsLoading] = useState(true);
  const [locales, setLocales] = useState([]);

  useEffect(() => {
    fetchLocalesList()
      .then((locales) => {
        setLocales(locales);
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
  }, [toggleNotification]);

  return { locales, isLoading };
};

export default useLocales;

import { useEffect } from 'react';
import { request, useNotification } from '@strapi/helper-plugin';
import { useSelector, useDispatch } from 'react-redux';
import pluginId from '../../pluginId';
import { reducerPrefix, RESOLVE_CONFIG } from '../reducers';

const fetchConfig = async (toggleNotification) => {
  try {
    const data = await request(`/${pluginId}/config`, {
      method: 'GET',
    });

    return data;
  } catch (e) {
    toggleNotification({
      type: 'warning',
      message: { id: 'notification.error' },
    });

    return e;
  }
};

const useConfig = () => {
  const dispatch = useDispatch();
  const toggleNotification = useNotification();
  const isLoading = useSelector((state) => state[reducerPrefix].isLoading);
  const config = useSelector((state) => state[reducerPrefix].config);

  useEffect(() => {
    if (isLoading) {
      fetchConfig(toggleNotification).then((config) => {
        dispatch({ type: RESOLVE_CONFIG, config });
      });
    }
  }, [dispatch, toggleNotification]);

  return { config, isLoading };
};

export default useConfig;

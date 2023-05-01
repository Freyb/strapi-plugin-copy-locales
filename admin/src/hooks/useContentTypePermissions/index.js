import { useSelector } from 'react-redux';
import selectCollectionTypesRelatedPermissions from '@strapi/plugin-i18n/admin/src/selectors/selectCollectionTypesRelatedPermissions';

const useContentTypePermissions = (slug) => {
  const collectionTypesRelatedPermissions = useSelector(
    selectCollectionTypesRelatedPermissions,
  );

  const currentCTRelatedPermissions = collectionTypesRelatedPermissions[slug];

  const getLocales = (action) => {
    const permissions = currentCTRelatedPermissions[action] || [];
    if (permissions.length === 0) return [];
    return permissions[0]?.properties?.locales || [];
  };

  const readPermissions = getLocales('plugin::content-manager.explorer.read');
  const createPermissions = getLocales(
    'plugin::content-manager.explorer.create',
  );
  const updatePermissions = getLocales(
    'plugin::content-manager.explorer.update',
  );
  const deletePermissions = getLocales(
    'plugin::content-manager.explorer.delete',
  );

  return {
    readPermissions,
    createPermissions,
    updatePermissions,
    deletePermissions,
  };
};

export default useContentTypePermissions;

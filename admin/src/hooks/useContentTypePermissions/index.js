import { useSelector } from 'react-redux';

const selectCollectionTypesRelatedPermissions = (state) =>
  state.rbacProvider.collectionTypesRelatedPermissions;

const useContentTypePermissions = (slug) => {
  const collectionTypesRelatedPermissions = useSelector(
    selectCollectionTypesRelatedPermissions,
  );

  const currentCTRelatedPermissions = collectionTypesRelatedPermissions[slug];

  const getPermissions = (action) => {
    const permissions = currentCTRelatedPermissions[action] || [];
    if (permissions.length === 0) return [];
    return permissions[0]?.properties?.locales || [];
  };

  const readPermissions = getPermissions(
    'plugin::content-manager.explorer.read',
  );
  const createPermissions = getPermissions(
    'plugin::content-manager.explorer.create',
  );
  const updatePermissions = getPermissions(
    'plugin::content-manager.explorer.update',
  );
  const deletePermissions = getPermissions(
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

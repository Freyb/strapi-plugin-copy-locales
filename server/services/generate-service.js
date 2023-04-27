'use strict';

module.exports = ({ strapi }) => {
  const getLocaleService = () => strapi.plugin('i18n').service('locales');
  const getLocalizationService = () =>
    strapi.plugin('i18n').service('localizations');
  const getEntityAPI = (uid) => strapi.query(uid);

  const generate = async ({ contentType, data }) => {
    const localeService = getLocaleService();
    const localizationService = getLocalizationService();
    const entityAPI = getEntityAPI(contentType.uid);

    const locales = await localeService.find();

    const originalLocale = data.locale;
    const createdById = data.createdBy.id;
    const updatedById = data.updatedBy.id;
    let id = data.id;
    const createdIds = [id];

    for (let locale of locales.map((l) => l.code)) {
      if (locale === originalLocale) continue;

      const newData = {
        ...data,
        id: undefined,
        createdBy: createdById,
        updatedBy: updatedById,
        locale,
        localizations: createdIds,
      };

      const result = await entityAPI.create({ data: newData, populate: true });
      await localizationService.syncLocalizations(result, {
        model: contentType,
      });
      id = result.id;
      createdIds.push(id);
    }
    return { data: createdIds };
  };

  return {
    generate,
  };
};

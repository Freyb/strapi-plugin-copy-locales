'use strict';

const { ApplicationError } = require('@strapi/utils').errors;

module.exports = ({ strapi }) => {
  const getLocaleService = () => strapi.plugin('i18n').service('locales');
  const getLocalizationService = () =>
    strapi.plugin('i18n').service('localizations');
  const getEntityAPI = (uid) => strapi.query(uid);

  const generate = async ({ contentType, data, locales: selectedLocales }) => {
    const localeService = getLocaleService();
    const localizationService = getLocalizationService();
    const entityAPI = getEntityAPI(contentType.uid);

    const allLocales = (await localeService.find()).map((l) => l.code);
    const invalidLocales = selectedLocales.some((l) => !allLocales.includes(l));
    if (invalidLocales.length > 0) {
      throw new ApplicationError('Invalid locales! ' + invalidLocales);
    }
    const {
      id,
      locale: originalLocale,
      localizations = [],
      createdBy,
      updatedBy,
      ...rest
    } = data;

    const existingLocales = localizations.map((l) => l.locale);
    const createdById = createdBy.id;
    const updatedById = updatedBy.id;
    const createdIds = [id, ...localizations.map((l) => l.id)];

    for (let locale of selectedLocales) {
      if (locale === originalLocale) continue;

      if (existingLocales.includes(locale)) {
        //Update
        const updatedEntryID = localizations.find(
          (l) => l.locale === locale,
        ).id;
        const newData = {
          ...rest,
          createdBy: createdById,
          updatedBy: updatedById,
        };

        await entityAPI.update({
          where: { id: updatedEntryID },
          data: newData,
          populate: true,
        });
      } else {
        //Create
        const newData = {
          ...rest,
          createdBy: createdById,
          updatedBy: updatedById,
          locale,
          localizations: createdIds,
        };

        const result = await entityAPI.create({
          data: newData,
          populate: true,
        });
        await localizationService.syncLocalizations(result, {
          model: contentType,
        });
        createdIds.push(result.id);
      }
    }
    return { data: createdIds };
  };

  const getLocalizations = async (uid, id) => {
    const entityAPI = getEntityAPI(uid);
    const entity = await entityAPI.findOne({
      where: { id },
      populate: { localizations: true },
    });
    return (entity.localizations ?? []).map((l) => l.locale);
  };

  return {
    generate,
    getLocalizations,
  };
};

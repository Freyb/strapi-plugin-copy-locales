'use strict';

const { ApplicationError, ForbiddenError } = require('@strapi/utils').errors;

module.exports = ({ strapi }) => {
  const getLocaleService = () => strapi.plugin('i18n').service('locales');
  const getLocalizationService = () =>
    strapi.plugin('i18n').service('localizations');
  const getEntityAPI = (uid) => strapi.query(uid);

  const actionToLocales = (userAbility, action, subject) => {
    const rule = userAbility.relevantRuleFor(action, subject).conditions;
    for (let logicalOperatorKey in rule) {
      const logicalOperatorValue = rule[logicalOperatorKey];
      for (let condition of logicalOperatorValue) {
        for (let conditionKey in condition) {
          const conditionValue = condition[conditionKey];
          if (conditionKey === 'locale') {
            return conditionValue['$in'];
          }
        }
      }
    }
    return [];
  };

  const generate = async ({ contentType, data, locales: selectedLocales }) => {
    const localeService = getLocaleService();
    const localizationService = getLocalizationService();
    const entityAPI = getEntityAPI(contentType.uid);
    const ctx = strapi.requestContext.get();
    const { user, userAbility } = ctx.state;
    const updateLocalePermissions = actionToLocales(
      userAbility,
      'plugin::content-manager.explorer.update',
      contentType.uid,
    );
    const createLocalePermissions = actionToLocales(
      userAbility,
      'plugin::content-manager.explorer.create',
      contentType.uid,
    );

    const allLocales = (await localeService.find()).map((l) => l.code);
    const invalidLocales = selectedLocales.some((l) => !allLocales.includes(l));
    if (invalidLocales.length > 0) {
      throw new ApplicationError('Invalid locales! ' + invalidLocales);
    }
    const {
      id,
      locale: originalLocale,
      localizations = [],
      createdBy: _createdBy,
      updatedBy: _updatedBy,
      createdAt: _createdAt,
      updatedAt: _updatedAt,
      ...rest
    } = data;

    const existingLocales = localizations.map((l) => l.locale);
    const createdById = user.id;
    const updatedById = user.id;
    const createdIds = [id, ...localizations.map((l) => l.id)];

    // Check permissions
    for (let locale of selectedLocales) {
      if (locale === originalLocale) continue;

      if (existingLocales.includes(locale)) {
        // Update
        if (!updateLocalePermissions.includes(locale)) {
          throw new ForbiddenError(
            'You do not have permission to update ' + locale,
          );
        }
      } else {
        // Create
        if (!createLocalePermissions.includes(locale)) {
          throw new ForbiddenError(
            'You do not have permission to create ' + locale,
          );
        }
      }
    }

    for (let locale of selectedLocales) {
      if (locale === originalLocale) continue;

      if (existingLocales.includes(locale)) {
        // Update
        const updatedEntryID = localizations.find(
          (l) => l.locale === locale,
        ).id;
        const newData = {
          ...rest,
          updatedBy: updatedById,
        };

        await entityAPI.update({
          where: { id: updatedEntryID },
          data: newData,
          populate: true,
        });
      } else {
        // Create
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

'use strict';

const { setCreatorFields, pipeAsync } = require('@strapi/utils');
const { ApplicationError, ForbiddenError } = require('@strapi/utils').errors;
const { omit } = require('lodash/fp');
const { getNonWritableAttributes } = require('@strapi/utils').contentTypes;

module.exports = ({ strapi }) => {
  const getLocaleService = () => strapi.plugin('i18n').service('locales');
  const getLocalizationService = () =>
    strapi.plugin('i18n').service('localizations');
  const getEntityAPI = (uid) => strapi.query(uid);

  const pickWritableAttributes = (model) =>
    omit(getNonWritableAttributes(strapi.getModel(model)));

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
    const ctx = strapi.requestContext.get();
    if (!ctx || !ctx?.state) return;
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

    const entityManager = strapi
      .plugin('content-manager')
      .service('entity-manager');
    const permissionChecker = strapi
      .plugin('content-manager')
      .service('permission-checker')
      .create({
        userAbility,
        model: contentType.uid,
      });

    const allLocales = (await localeService.find()).map((l) => l.code);
    const invalidLocales = selectedLocales.some((l) => !allLocales.includes(l));
    if (invalidLocales.length > 0) {
      throw new ApplicationError('Invalid locales! ' + invalidLocales);
    }
    const { id, locale: originalLocale, localizations = [], ...rest } = data;

    const existingLocales = localizations.map((l) => l.locale);
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
        const entityTobeUpdated = localizations.find(
          (l) => l.locale === locale,
        );
        const newData = {
          ...rest,
        };

        const pickWritables = pickWritableAttributes({
          model: contentType.uid,
        });
        const pickPermittedFields =
          permissionChecker.sanitizeUpdateInput(entityTobeUpdated);
        const setCreator = setCreatorFields({ user, isEdition: true });
        const sanitizeFn = pipeAsync(
          pickWritables,
          pickPermittedFields,
          setCreator,
        );

        const sanitizedBody = await sanitizeFn(newData);
        const updatedEntity = await entityManager.update(
          entityTobeUpdated,
          sanitizedBody,
          contentType.uid,
        );
        await permissionChecker.sanitizeOutput(updatedEntity);
      } else {
        // Create
        const newData = {
          ...rest,
          locale,
          localizations: createdIds,
        };

        const pickWritables = pickWritableAttributes({
          model: contentType.uid,
        });
        const pickPermittedFields = permissionChecker.sanitizeCreateInput;
        const setCreator = setCreatorFields({ user });
        const sanitizeFn = pipeAsync(
          pickWritables,
          pickPermittedFields,
          setCreator,
        );

        const sanitizedBody = await sanitizeFn(newData);
        const entity = await entityManager.create(
          sanitizedBody,
          contentType.uid,
        );
        const final = await permissionChecker.sanitizeOutput(entity);

        await localizationService.syncLocalizations(final, {
          model: contentType,
        });
        createdIds.push(final.id);
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

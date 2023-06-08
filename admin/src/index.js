import { prefixPluginTranslations } from '@strapi/helper-plugin';
import pluginPkg from '../../package.json';
import pluginId from './pluginId';
import configReducer from './hooks/reducers';
import Initializer from './components/Initializer';
import EditViewRightLinks from './components/EditViewRightLinks';

const name = pluginPkg.strapi.name;

export default {
  register(app) {
    app.addReducers(configReducer);

    app.registerPlugin({
      id: pluginId,
      initializer: Initializer,
      isReady: false,
      name,
    });
  },

  bootstrap(app) {
    app.injectContentManagerComponent('editView', 'right-links', {
      name: pluginId,
      Component: EditViewRightLinks,
    });
  },
  async registerTrads({ locales }) {
    const importedTrads = await Promise.all(
      locales.map((locale) => {
        return import(
          /* webpackChunkName: "translation-[request]" */ `./translations/${locale}.json`
        )
          .then(({ default: data }) => {
            return {
              data: prefixPluginTranslations(data, pluginId),
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      }),
    );

    return Promise.resolve(importedTrads);
  },
};

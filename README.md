# Strapi Plugin Copy Locales

A Strapi plugin that helps you copy content between locales in case you want to preserve content structure.\
The plugin is a shorthand for changing locale and using the built-in 'Fill in from another locale' function. Moreover, you can use this plugin to override already existing entities.

## Installation

```bash
# using yarn
yarn add strapi-plugin-copy-locales

# using npm
npm install strapi-plugin-copy-locales --save
```

Then in your `config/plugins.js`:
```js
module.exports = ({ env }) => ({
  // ...
  'copy-locales': {
    config: {
      contentTypes: [
        'api::mycollection.mycollection',
        'api::mycollection2.mycollection2'
      ]
    }
  }
  // ...
});
```

`contentTypes` is the list of collection types for which you want to allow the plugin.

![](https://raw.githubusercontent.com/Freyb/strapi-plugin-copy-locales/main/images/modal.png)
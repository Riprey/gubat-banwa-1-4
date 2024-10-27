import globals from "globals";
import pluginJs from "@eslint/js";
import jsdoc from "eslint-plugin-jsdoc";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        // jQuery
        $: "readonly",
        // https://foundryvtt.com/api/v11/modules.html
        foundry: "readonly",
        prosemirror: "readonly",
        // https://foundryvtt.com/api/v11/modules/client.globalThis.html
        CONFIG: "readonly",
        CONST: "readonly",
        Hooks: "readonly",
        loadTemplates: "readonly",
        ui: "readonly",
        // https://foundryvtt.com/api/v11/modules/client.html
        game: "readonly",
        renderTemplate: "readonly",
        ActiveEffect: "readonly",
        Actor: "readonly",
        Actors: "readonly",
        ActorSheet: "readonly",
        ChatMessage: "readonly",
        Compendium: "readonly",
        Dialog: "readonly",
        FormDataExtended: "readonly",
        Handlebars: "readonly",
        Item: "readonly",
        Items: "readonly",
        ItemSheet: "readonly",
        Macro: "readonly",
        Macros: "readonly",
        Roll: "readonly",
        TextEditor: "readonly"
      },
    },
  },
  pluginJs.configs.recommended,
  jsdoc.configs["flat/recommended-typescript-flavor"],
  {
    settings: {
      jsdoc: {
        tagNamePreference: {
          augments: "extends"
        }
      }
    }
  },
  {
    rules: {
      "no-fallthrough": "off",
    }
  },
  eslintConfigPrettier,
];

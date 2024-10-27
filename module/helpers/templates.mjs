/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async function () {
  return loadTemplates([
    // Actor Components.
    "systems/gubat-banwa-1-4/templates/actor/components/actor-equippables.hbs",
    "systems/gubat-banwa-1-4/templates/actor/components/actor-prowesses.hbs",
    "systems/gubat-banwa-1-4/templates/actor/components/actor-sidebar.hbs",
    // Actor Tabs.
    "systems/gubat-banwa-1-4/templates/actor/tabs/actor-effects.hbs",
    "systems/gubat-banwa-1-4/templates/actor/tabs/kadungganan-drama.hbs",
    "systems/gubat-banwa-1-4/templates/actor/tabs/kadungganan-violence.hbs",
    // Item Tabs.
    "systems/gubat-banwa-1-4/templates/item/tabs/item-effects.hbs",
    "systems/gubat-banwa-1-4/templates/item/tabs/discipline-attributes.hbs",
    "systems/gubat-banwa-1-4/templates/item/tabs/discipline-violences.hbs",
  ]);
};

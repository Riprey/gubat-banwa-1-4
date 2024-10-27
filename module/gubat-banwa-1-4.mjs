// Import document classes.
import { GubatBanwaActiveEffect } from './documents/active-effect.mjs';
import { GubatBanwaActor } from './documents/actor.mjs';
import { GubatBanwaItem } from './documents/item.mjs';
// Import sheet classes.
import { GubatBanwaActorSheet } from './sheets/actor-sheet.mjs';
import { GubatBanwaItemSheet } from './sheets/item-sheet.mjs';
// Import helper/utility classes and constants.
import { preloadHandlebarsTemplates } from './helpers/templates.mjs';
import GUBAT_BANWA from './helpers/config.mjs';
// Import DataModel classes
import * as models from './data/_module.mjs';

/* -------------------------------------------- */
/*  Init Hook                                   */
/* -------------------------------------------- */

Hooks.once('init', function () {
  // Add utility classes to the global game object so that they're more easily
  // accessible in global contexts.
  game.gubatbanwa14 = {
    GubatBanwaActiveEffect,
    GubatBanwaActor,
    GubatBanwaItem,
  };

  // Add custom constants for configuration.
  CONFIG.GUBAT_BANWA = GUBAT_BANWA;

  // Define custom Document and DataModel classes
  CONFIG.ActiveEffect.documentClass = GubatBanwaActiveEffect;
  CONFIG.Actor.documentClass = GubatBanwaActor;
  CONFIG.Item.documentClass = GubatBanwaItem;

  // Note that you don't need to declare a DataModel
  // for the base actor/item classes - they are included
  // with the Character/NPC as part of super.defineSchema()
  CONFIG.Actor.dataModels = models.actor.config;
  CONFIG.Item.dataModels = models.item.config;

  // Active Effects are never copied to the Actor,
  // but will still apply to the Actor from within the Item
  // if the transfer property on the Active Effect is true.
  CONFIG.ActiveEffect.legacyTransferral = false;

  // Overwrite existing status effects
  CONFIG.statusEffects = CONFIG.GUBAT_BANWA.statusEffects;

  // Register sheet application classes
  Actors.unregisterSheet('core', ActorSheet);
  Actors.registerSheet('gubat-banwa-1-4', GubatBanwaActorSheet, {
    makeDefault: true,
    label: 'GUBAT_BANWA.SheetLabels.Actor',
  });
  Items.unregisterSheet('core', ItemSheet);
  Items.registerSheet('gubat-banwa-1-4', GubatBanwaItemSheet, {
    makeDefault: true,
    label: 'GUBAT_BANWA.SheetLabels.Item',
  });

  // Preload Handlebars templates.
  return preloadHandlebarsTemplates();
});

/* -------------------------------------------- */
/*  Handlebars Helpers                          */
/* -------------------------------------------- */

Handlebars.registerHelper('isdefined', (value) => {
  return (typeof value !== "undefined");
});

Handlebars.registerHelper('times', (n, block) => {
  let accumulator = '';
  for (let i = 0; i < n; i++) {
    accumulator += block.fn(i);
  }
  return accumulator;
});

/* -------------------------------------------- */
/*  Ready Hook                                  */
/* -------------------------------------------- */

Hooks.once('ready', function () {});


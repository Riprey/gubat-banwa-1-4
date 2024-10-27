import ItemSharedFields from "./item/fields.mjs";

export default class BaseDataModel extends foundry.abstract.TypeDataModel {
  static metadata = {};

  get metadata() {
    return this.constructor.metadata;
  }

  static defineSchema() {
    return {};
  }

  /**
   * Convert the schema to a plain object.
   *
   * The built in `toObject()` method will ignore derived data when using Data Models.
   * This additional method will instead use the spread operator to return a simplified
   * version of the data.
   * @returns {object} Plain object either via deepClone or the spread operator.
   */
  toPlainObject() {
    return { ...this };
  }
}

export class BaseItemData extends BaseDataModel {
  /**
   * @typedef {object} BaseItemDataModelMetadata
   * @property {boolean} singleton Whether this should be the only Item of its type embedded on an Actor.
   */

  /**  @type {BaseItemDataModelMetadata} */
  static metadata = Object.freeze(
    foundry.utils.mergeObject(
      super.metadata,
      {
        singleton: false,
      },
      { inplace: false },
    ),
  );

  /**
   * Fired before creation of an Item.
   * @param {object} data    Initiating data object to make an Item from.
   * @param {object} options Additional options for Item creation.
   * @param {User} user      The User requesting the creation of the Item.
   * @returns {Promise<boolean|void>} If false, cancel the creation.
   * @see {Document#_preCreate}
   * @protected
   */
  async _preCreate(data, options, user) {
    const actor = this.parent.actor;

    // Currently items can only be embedded on Kadungganan.
    if (actor && actor.type !== "kadungganan") {
      ui.notifications.error(
        game.i18n.format(
          "GUBAT_BANWA.Notifications.Warnings.InvalidEmbed",
          {
            itemType: game.i18n.localize(CONFIG.Item.typeLabels[data.type]),
            actorType: game.i18n.localize(CONFIG.Actor.typeLabels[actor.type]),
          },
        ),
      );
      return false;
    }

    // Make sure the item being created and embedded doesn't break singleton rules.
    if (this.metadata?.singleton && actor.itemTypes[data.type]?.length) {
      ui.notifications.error(
        game.i18n.format(
          "GUBAT_BANWA.Notifications.Warnings.SingletonViolation",
          {
            itemType: game.i18n.localize(CONFIG.Item.typeLabels[data.type]),
            actorType: game.i18n.localize(CONFIG.Actor.typeLabels[actor.type]),
          },
        ),
      );
      return false;
    }
  }

  static defineSchema() {
    const schema = super.defineSchema();

    return {
      ...schema,
      ...ItemSharedFields.commonFields,
    };
  }
}

/**
 * Extend the basic Item with some very simple modifications.
 * @extends {Item}
 */
export class GubatBanwaItem extends Item {
  /**
   * Perform operations before this Item is created.
   * @param {object} data    Initiating data object to make an Item from.
   * @param {object} options Additional options for Item creation.
   * @param {User} user      The User requesting the creation of the Item.
   * @returns {Promise<boolean|void>} If false, cancel the creation.
   * @see {Document#_preCreate}
   * @protected
   */
  async _preCreate(data, options, user) {
    let allowed = await super._preCreate(data, options, user);
    if (allowed !== false)
      allowed = await this.system._preCreate(data, options, user);
    return allowed;
  }

  /**
   * Augment the basic Item data model with additional dynamic data.
   */
  prepareData() {
    // As with the actor class, items are documents that can have their data
    // preparation methods overridden (such as prepareBaseData()).
    super.prepareData();
  }

  /**
   * Prepare a data object which defines the data schema used by dice roll commands against this Item
   * @override
   */
  getRollData() {
    // Starts off by populating the roll data with a shallow copy of `this.system`
    const rollData = { ...this.system };

    // Quit early if there's no parent actor
    if (!this.actor) return rollData;

    // If present, add the actor's roll data
    rollData.actor = this.actor.getRollData();

    return rollData;
  }

  /**
   * Should this Item's Active Effects be suppressed?
   * Currently just checks if it is currently an equippable; if it isn't equipped it will be suppressed.
   * @returns {boolean} Whether or not if this Item's Active Effects should be suppressed.
   */
  get areEffectsSuppressed() {
    const isEquippable = [
      "anting",
      "enlightenment",
      "liberation",
      "technique",
    ].includes(this.type);
    return isEquippable && !this.system.equipped;
  }

  /**
   * Convert the actor document to a plain object.
   *
   * The built in `toObject()` method will ignore derived data when using Data Models.
   * This additional method will instead use the spread operator to return a simplified
   * version of the data.
   * @returns {object} Plain object either via deepClone or the spread operator.
   */
  toPlainObject() {
    const result = { ...this };

    // Simplify system data.
    result.system = this.system.toPlainObject();

    // Add effects.
    result.effects = this.effects?.size > 0 ? this.effects.contents : [];

    return result;
  }
}

/**
 * Extend the base Actor document by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class GubatBanwaActor extends Actor {
  /** @inheritdoc */
  async _preCreate(data, options, user) {
    if ((await super._preCreate(data, options, user)) === false) return false;

    // Configure Prototype Token Settings.
    const prototypeToken = {};
    // Manage size.
    if ("size" in this.system) {
      let tokenSize = this.system.size;
      if (tokenSize < 1) tokenSize = 0.5;
      else tokenSize = Math.floor(tokenSize);
      if (!foundry.utils.hasProperty(data, "prototypeToken.width"))
        prototypeToken.width = tokenSize;
      if (!foundry.utils.hasProperty(data, "prototypeToken.height"))
        prototypeToken.height = tokenSize;
    }
    if (this.type === "kadungganan") {
      Object.assign(prototypeToken, {
        actorLink: true,
        disposition: CONST.TOKEN_DISPOSITIONS.FRIENDLY,
      });
    }

    this.updateSource({ prototypeToken });
  }

  /** @inheritdoc */
  async _preUpdate(changed, options, user) {
    if ((await super._preUpdate(changed, options, user)) === false)
      return false;

    // Change size of Prototype Token if size is changed.
    if ("size" in this.system) {
      const newSize = foundry.utils.getProperty(changed, "system.size");
      if (newSize && newSize !== this.system.size) {
        let newTokenSize = newSize;
        if (newTokenSize < 1) newTokenSize = 0.5;
        else newTokenSize = Math.floor(newTokenSize);
        if (!foundry.utils.hasProperty(changed, "prototypeToken.width")) {
          changed.prototypeToken ||= {};
          changed.prototypeToken.height = newTokenSize;
          changed.prototypeToken.width = newTokenSize;
        }
      }
    }
  }

  /** @inheritdoc */
  applyActiveEffects() {
    for (const effect of this.allApplicableEffects()) {
      effect.determineSuppression();
    }
    return super.applyActiveEffects();
  }

  /** @override */
  prepareData() {
    // Prepare data for the actor. Calling the super version of this executes
    // the following, in order: data reset (to clear active effects),
    // prepareBaseData(), prepareEmbeddedDocuments() (including active effects),
    // prepareDerivedData().
    super.prepareData();
  }

  /** @override */
  prepareBaseData() {
    const actorData = this;

    this._prepareKadunggananBaseData(actorData);
  }

  /**
   * Initializes values for the Kadungganan Actor.
   * @param {Actor} actorData this
   */
  _prepareKadunggananBaseData(actorData) {
    if (actorData.type !== "kadungganan") return;

    const systemData = actorData.system;

    // Initialize values that will be affected by embedded documents.
    systemData.hp.max = 0;
    systemData.jump = 0;
    systemData.speed = 0;
    Object.keys(systemData.prowesses).forEach((prowess) => {
      const prowessField = systemData.prowesses[prowess];
      prowessField.bonus = 0;
      prowessField.total = prowessField.bonus;
    });
  }

  /*
   * Augment the actor source data with additional dynamic data that isn't
   * handled by the actor's DataModel. Data calculated in this step should be
   * available both inside and outside of character sheets (such as if an actor
   * is queried and has a roll executed directly from it).
   */
  /** @override */
  prepareDerivedData() {
    const actorData = this;

    this._prepareKadunggananDerivedData(actorData);
  }

  /**
   * Prepares derived data for the Kadungganan Actor.
   * @param {Actor} actorData this.
   */
  _prepareKadunggananDerivedData(actorData) {
    if (actorData.type !== "kadungganan") return;

    const systemData = actorData.system;
    // Get embedded Items.
    const embeddedItems = this.getEmbeddedCollection("Item");

    // 1. Get disciplines.
    // ================================================================
    // There should only be one active discipline.
    const discipline = embeddedItems.find((item) => item.type === "discipline");
    if (discipline) {
      // These values need to be additionally assigned as Active Effects
      // are applied between prepareBaseData() and prepareDerivedData().
      systemData.hp.max += discipline.system.hp.max;
      systemData.jump += discipline.system.jump;
      systemData.speed += discipline.system.speed;
      Object.keys(systemData.prowesses).forEach((prowess) => {
        const prowessField = systemData.prowesses[prowess];
        prowessField.bonus += discipline.system.prowesses[prowess];
        prowessField.total =
          prowessField.value + prowessField.bonus;
      });
    }

    // 2. Get other items
    // ================================================================
    // Just calculating how many are equipped and how many they can equip.
    const itemTypes = ["anting", "enlightenment", "liberation", "technique"];
    itemTypes.forEach((type) => {
      const items = embeddedItems.filter((item) => item.type === type);
      systemData[type] = {};
      systemData[type].maxEquipped = systemData.equipLimit[type];
      systemData[type].numEquipped = items.filter(
        (item) => item.system.equipped,
      ).length;
    });

    // Prevent HP from going over max.
    systemData.hp.value = Math.min(systemData.hp.max, systemData.hp.value);
  }

  /*
   * Augment the actor's default getRollData() method by appending the data object
   * generated by the its DataModel's getRollData(), or null. This polymorphic
   * approach is useful when you have actors & items that share a parent Document,
   * but have slightly different data preparation needs.
   */
  /** @override */
  getRollData() {
    return { ...super.getRollData(), ...(this.system.getRollData?.() ?? null) };
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

    // Add items.
    result.items = this.items?.size > 0 ? this.items.contents : [];

    // Add effects.
    result.effects = this.effects?.size > 0 ? this.effects.contents : [];

    return result;
  }
}

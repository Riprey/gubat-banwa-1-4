import {
  onManageActiveEffect,
  prepareActiveEffectCategories,
} from "../helpers/effects.mjs";

/**
 * Extend the basic ActorSheet.
 * @extends {ActorSheet}
 */
export class GubatBanwaActorSheet extends ActorSheet {
  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["gubat-banwa-1-4", "sheet", "actor"],
      width: 720,
      height: 800,
      tabs: [
        {
          navSelector: ".sheet-tabs",
          contentSelector: ".tab-body",
          initial: "description",
        },
      ],
    });
  }

  /** @inheritdoc */
  get template() {
    return `systems/gubat-banwa-1-4/templates/actor/actor-${this.actor.type}-sheet.hbs`;
  }

  /** @inheritdoc */
  _onChangeTab(events, tabs, active) {
    // Update the navbar's "Current Tab" display.
    // This needs to happen here as the active tab within getData() does not actually
    // refresh when the tab is switched.
    const tabName = game.i18n.localize(
      CONFIG.GUBAT_BANWA.kadunggananSheetTabs[active],
    );
    this.element.find(".js-active-tab").text(tabName);
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  async getData() {
    // Retrieve the data structure from the base sheet.
    const context = super.getData();

    /**
     * This value doesn't actually refresh when a tab is clicked, so it's just
     * the "initial" tab.
     * @see _onChangeTab
     */
    context.tabs = {
      initial: this._tabs[0].active,
    };

    // Use a safe clone of the actor data for further operations.
    const actorData = this.document.toPlainObject();

    // Add the actor's data to context.data for easier access, as well as flags.
    context.schema = this.document.system.schema;
    context.system = actorData.system;
    context.flags = actorData.flags;

    // Adding a pointer to CONFIG.GUBAT_BANWA
    context.config = CONFIG.GUBAT_BANWA;

    // Initialize object for holding enriched data.
    context.enriched = {};

    // Prepare character data and items.
    if (actorData.type === "kadungganan") {
      this._prepareItems(context);
      this._prepareKadunggananData(context);
    }

    // Enrich data for NPCs, as their rolls will likely be determined by this.
    if (actorData.type === "npc") {
      await this._prepareNPCData(context);
    }

    // Prepare active effects
    context.effects = prepareActiveEffectCategories(
      // A generator that returns all effects stored on the actor
      // as well as any items
      this.actor.allApplicableEffects(),
    );

    return context;
  }

  /**
   * Organize and classify Items for Actor sheets.
   * @param {object} context The context object to mutate
   */
  _prepareItems(context) {
    // Initialize containers.
    const itemTypes = ["anting", "enlightenment", "liberation", "technique"];
    const containers = {};
    itemTypes.forEach((type) => {
      containers[type] = {
        equipped: [],
        unequipped: [],
      };
    });

    // Iterate through items, allocating to containers
    for (let i of context.items) {
      i.img = i.img || Item.DEFAULT_ICON;
      switch (i.type) {
        case "discipline":
          // There shouldn't be more than discipline.
          context.discipline = i;
          Object.keys(i.system.violences.attacks).forEach((index) => {
            const attack = i.system.violences.attacks[index];
            const rollStats = Object.keys(attack.rolls).filter(
              (key) => attack.rolls[key],
            );
            if (rollStats.length) attack.canRoll = rollStats;
          });
          break;
        case "enlightenment":
        case "technique":
        case "liberation":
          i.system.disciplineLabel =
            CONFIG.GUBAT_BANWA.disciplines[i.system.discipline];
        case "anting":
          if (i.system.equipped) {
            containers[i.type].equipped.push(i);
          } else {
            containers[i.type].unequipped.push(i);
          }
          break;
        default:
          break;
      }
    }

    // Assign and return
    itemTypes.forEach((type) => {
      context[type] = containers[type];
    });
  }

  /**
   * Kadungganan-specific context modifications
   * @param {object} context The context object to mutate
   */
  _prepareKadunggananData(context) {
    if (context.data.type !== "kadungganan") return;
    const actorData = context.document.system;
    const itemTypes = ["anting", "enlightenment", "liberation", "technique"];

    if (actorData.wounds.max) {
      actorData.wounds.options = Array.from(
        { length: actorData.wounds.max + 1 },
        (v, i) => i,
      );
    }

    itemTypes.forEach((type) => {
      context[type].numEquipped = actorData[type].numEquipped;
      context[type].maxEquipped = actorData[type].maxEquipped;
    });
  }

  /**
   * NPC-specific context modifications
   * @param {object} context The context object to mutate
   */
  async _prepareNPCData(context) {
    if (context.data.type !== "npc") return;
    const actor = context.document;

    context.enriched.attacks = await TextEditor.enrichHTML(
      actor.system.attacks,
      {
        // Whether to show secret blocks in the finished html
        secrets: actor.isOwner,
        // Necessary in v11, can be removed in v12
        async: true,
        // Data to fill in for inline rolls
        rollData: actor.getRollData(),
        // Relative UUID resolution
        relativeTo: actor,
      },
    );
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  activateListeners(html) {
    super.activateListeners(html);

    // Pops out the embedded item's sheet for more details and editting.
    html.on("click", ".js-item-popout", (event) => {
      const item = this._getTargetItem(event.currentTarget);
      item.sheet.render(true);
    });

    /**
     * @see _onSendMessage
     */
    html.on("click", ".js-send-message", this._onSendMessage.bind(this));

    // -------------------------------------------------------------
    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    /**
     * @see _onArrayControl
     */
    html.on("click", ".js-array-control", this._onArrayControl.bind(this));

    /**
     * @see _onItemControl
     */
    html.on("click", ".js-item-control", this._onItemControl.bind(this));

    /**
     * @see _onItemControl
     */
    html.on("click", ".js-open-compendium", this._openCompendium.bind(this));

    // Toggles collpasible elements.
    html.on("click", ".js-toggle-collapsible", (event) => {
      event.preventDefault();
      event.currentTarget.closest(".collapsible").classList.toggle("collapsed");
    });

    // Buttons that increases and decreases the value by 1.
    html.on("click", ".js-value-control", (event) => {
      event.preventDefault();
      const element = event.currentTarget;
      const { action, target } = element.dataset;
      const targetValue = this._getTargetField(element);
      switch (action) {
        case "decrease":
          return this.document.update({ [target]: targetValue - 1 });
        case "increase":
          return this.document.update({ [target]: targetValue + 1 });
      }
    });

    // Active Effect management
    html.on("click", ".js-effect-control", (event) => {
      const row = event.currentTarget.closest(".js-effect-control-target");
      const document =
        row.dataset.parentId === this.actor.id
          ? this.actor
          : this.actor.items.get(row.dataset.parentId);
      onManageActiveEffect(event, document);
    });

    // Rollable abilities.
    html.on("click", ".js-rollable", this._onRoll.bind(this));
  }

  /**
   * Retrieves the value of a target Field on the document.
   * @param {HTMLElement} element The DOM Element targeted.
   * @returns {* | void} Value of the target field, or void if it can't find it.
   * @private
   */
  _getTargetField(element) {
    const { target } = element.dataset;
    if (!target) {
      ui.notifications.error(
        game.i18n.format("GUBAT_BANWA.Notifications.Warnings.MissingTarget"),
      );
      return;
    }
    return foundry.utils.getProperty(this.document.toObject(), target);
  }

  /**
   * Retrieves an Embedded Item from the Actor given a DOM Element's dataset.
   * @param {HTMLElement} element The DOM Element targeted.
   * @returns {Item | void} Desired Embedded Item object, or void if it can't find it.
   * @private
   */
  _getTargetItem(element) {
    const targetID = element.closest("[data-item-id]").dataset["itemId"];
    if (!targetID) {
      ui.notifications.error(
        game.i18n.format("GUBAT_BANWA.Notifications.Warnings.MissingTarget"),
      );
      return;
    }
    return this.document.items.get(targetID);
  }

  /**
   * Manage embedded items in the actor sheet.
   * @param {Event} event The originating click event.
   * @returns {void}
   * @private
   */
  async _onItemControl(event) {
    event.stopPropagation();
    event.preventDefault();
    const element = event.currentTarget;
    const { action } = element.dataset;

    const targetItem = this._getTargetItem(element);

    switch (action) {
      case "delete":
        return Dialog.confirm({
          title: game.i18n.localize("GUBAT_BANWA.UI.Confirmation"),
          content: game.i18n.format(
            "GUBAT_BANWA.Notifications.DeletionConfirmation",
            {
              name: targetItem.name,
              type: targetItem.type,
            },
          ),
          yes: async () => {
            await this.actor.deleteEmbeddedDocuments("Item", [targetItem.id]);
          },
          defaultYes: false,
        });
      case "toggle-use":
        return targetItem.update({ "system.used": !targetItem.system.used });
      default:
        break;
    }

    if (typeof targetItem.system.equipped === "boolean") {
      const itemType = targetItem.type;
      const { numEquipped, maxEquipped } = this.document.system[itemType];

      switch (action) {
        case "equip":
          if (numEquipped < maxEquipped) {
            return targetItem.update({ "system.equipped": true });
          }
          return ui.notifications.warn(
            game.i18n.format(
              "GUBAT_BANWA.Notifications.Warnings.ExceededEquipLimit",
              {
                numEquipped,
                itemType: targetItem.type,
              },
            ),
          );
        case "unequip":
          return targetItem.update({ "system.equipped": false });
      }
    }
  }

  /**
   * Manage items in ArrayFields
   * @param {Event} event The originating click event.
   * @returns {void}
   */
  _onArrayControl(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;
    const { action, target, targetIndex } = dataset;
    const targetArray = this._getTargetField(element);
    switch (action) {
      case "create":
        targetArray.push({});
        return this.document.update({ [target]: targetArray });
      case "delete":
        targetArray.splice(targetIndex, 1);
        return this.document.update({
          [target]: targetArray,
        });
    }
  }

  /**
   * Opens a given compendium on click.
   * @param {Event} event The originating click event.
   */
  _openCompendium(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;
    const { target } = dataset;

    if (!target) {
      ui.notifications.error(
        game.i18n.format("GUBAT_BANWA.Notifications.Warnings.MissingTarget"),
      );
    }
    const collection = game.packs.get(target);
    const compendium = new Compendium({ collection });
    compendium.render(true);
  }

  /**
   * Handle sending sheet data to Chat.
   * @param {Event} event The originating click event
   * @returns {void}
   * @private
   */
  async _onSendMessage(event) {
    event.stopPropagation();
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;
    const { title, content } = dataset;

    const targetItem = this._getTargetItem(element);

    return ChatMessage.create({
      speaker: ChatMessage.getSpeaker(),
      content: await renderTemplate(
        "systems/gubat-banwa-1-4/templates/chat/chat-item.hbs",
        {
          title: foundry.utils.getProperty(targetItem.toObject(), title),
          content: foundry.utils.getProperty(targetItem.toObject(), content),
        },
      ),
    });
  }

  /**
   * Handle clickable rolls.
   * @param {Event} event The originating click event
   * @returns {void}
   * @private
   */
  async _onRoll(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;
    const actorData = this.actor.getRollData();
    const { rollType, rollStat } = dataset;

    if (!rollStat) {
      return this._promptRoll();
    }

    const stats = rollStat.split(",");
    let chosenStat = stats[0];

    // On some attacks, the user will have to choose between which Prowesses to use.
    // Currently there's no situation that calls for a choice between Actions.
    if (stats.length > 1) {
      chosenStat = await this._promptProwessChoice(stats);
    }

    return this._promptRoll(
      this._getRollOptions(rollType, chosenStat, actorData),
    );
  }

  /**
   * @typedef {object} RollOptions
   * @property {string} rollType 'attack', 'defend' or 'divine'.
   * @property {number} faces Number of faces of the dice rolled. AKA the # in "d#".
   * @property {number} value Number of dice to roll.
   */

  /**
   * Gets the different parameters needed for a roll.
   * @param {string} type 'attack', 'defend' or 'divine'.
   * @param {string} stat Stat used for the roll. Can be an Action or a Prowess.
   * @param {KadunggananData | NPCData} actorData RollData of the actor.
   * @see _promptRoll
   * @returns {RollOptions} Parameters for the roll.
   */
  _getRollOptions(type, stat, actorData) {
    const options = { rollType: type, faces: 10, target: 6 };
    switch (type) {
      case "divine":
        options.statLabel = CONFIG.GUBAT_BANWA.actions[stat].label;
        options.value = actorData.actions[stat];
        break;
      case "defend":
        options.faces = 8;
      case "attack":
        options.statLabel = CONFIG.GUBAT_BANWA.prowesses[stat].label;
        options.value =
          actorData.prowesses[stat].total || actorData.prowesses[stat].value;
        break;
    }
    return options;
  }

  /**
   * Opens a Dialog that asks the user which stat they'd like to use for the roll.
   * @param {string[]} options List of Prowesses the user can pick from. If empty, list all of them.
   * @returns {Promise<string>} Key of the chosen Prowess.
   */
  async _promptProwessChoice(options) {
    const prowessKeys = options ?? Object.keys(CONFIG.GUBAT_BANWA.prowesses);
    const prowessChoices = prowessKeys.map((key) => ({
      key,
      label: CONFIG.GUBAT_BANWA.prowesses[key].label,
    }));
    const content = await renderTemplate(
      "systems/gubat-banwa-1-4/templates/dialog/dialog-stats.hbs",
      { statChoices: prowessChoices },
    );
    return Dialog.wait({
      title: game.i18n.localize(),
      content,
      buttons: {
        select: {
          label: game.i18n.localize("GUBAT_BANWA.UI.Select"),
          icon: '<i class="fas fa-check"></i>',
          callback: async (html) => {
            const formData = new FormDataExtended(
              html[0].querySelector("form#dialog-stats"),
            ).object;
            return formData.stat;
          },
        },
        cancel: {
          label: game.i18n.localize("GUBAT_BANWA.UI.Cancel"),
          icon: '<i class="fas fa-xmark"></i>',
        },
      },
    });
  }

  /**
   * Opens a Dialog that lets the user make any last minute adjustments before rolling.
   * @param {RollOptions} params Parameters used for the roll.
   * @returns {void}
   */
  async _promptRoll(params) {
    // Setting up data for the Dialog.
    let title = game.i18n.localize("GUBAT_BANWA.UI.Roll");
    if (params?.rollType && params?.statLabel) {
      title = game.i18n.format("GUBAT_BANWA.UI.RollCheck", {
        action: game.i18n.localize(CONFIG.GUBAT_BANWA.rolls[params.rollType]),
        stat: game.i18n.localize(params.statLabel),
        name: this.document.name,
      });
    }
    // Generate a list of options to use in a <select>.
    // It should prevent you from rolling less than one die.
    const minBonus = params?.value ? Math.min(-params.value + 1, 0) : -10;
    const bonusOptions = [];
    for (let i = minBonus; i <= 10; i++) {
      let diceFormat = `${i}d`;
      if (i > 0) diceFormat = `+${i}d`;
      bonusOptions.push({ key: i.toString(), label: diceFormat });
    }
    const content = await renderTemplate(
      "systems/gubat-banwa-1-4/templates/dialog/dialog-roll.hbs",
      { ...params, title, bonusOptions },
    );

    const dialog = new Dialog({
      title,
      content,
      buttons: {
        roll: {
          label: game.i18n.localize("GUBAT_BANWA.UI.Roll"),
          icon: '<i class="fas fa-dice"></i>',
          callback: async (html) => {
            const formData = new FormDataExtended(
              html[0].querySelector("form#dialog-roll"),
              { disabled: true },
            ).object;
            const { value, bonus, faces, target } = formData;
            const total = parseInt(value) + parseInt(bonus);
            let roll = new Roll(`${total}d${faces}cs>=${target}`, {});
            const rollData = await roll.evaluate();
            ChatMessage.create({
              speaker: ChatMessage.getSpeaker(),
              flavor: this.document.name,
              content: await renderTemplate(
                "systems/gubat-banwa-1-4/templates/chat/chat-roll.hbs",
                {
                  ...rollData.dice[0],
                  total: rollData.total,
                  statLabel: params?.statLabel,
                },
              ),
              type: CONST.CHAT_MESSAGE_TYPES.ROLL,
              rolls: [roll],
            });
          },
        },
        cancel: {
          label: game.i18n.localize("GUBAT_BANWA.UI.Cancel"),
          icon: '<i class="fas fa-xmark"></i>',
        },
      },
      default: "roll",
    });
    return dialog.render(true);
  }
}

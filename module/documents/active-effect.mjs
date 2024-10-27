/**
 * Extending the base ActiveEffect class.
 */
export class GubatBanwaActiveEffect extends ActiveEffect {
  /**
   * Overwrites the isSuppressed() accessor.
   * @type {boolean}
   * @see {@link https://foundryvtt.com/api/v11/classes/client.ActiveEffect.html#isSuppressed}
   */
  isSuppressed = false;

  /**
   * Sets the isSuppressed boolean based on system logic.
   * Currently that is only if the item this is attached to is unequipped.
   * @see isSuppressed
   */
  determineSuppression() {
    this.isSuppressed = false;
    if (this.parent instanceof game.gubatbanwa14.GubatBanwaItem) {
      this.isSuppressed = this.parent.areEffectsSuppressed;
    }
  }
}

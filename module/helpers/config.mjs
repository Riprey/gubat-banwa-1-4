const GUBAT_BANWA = {};

/**
 * Actions, statistics used by Kadungganans for Drama.
 * @enum {string} Label for the Action.
 */
GUBAT_BANWA.actions = {
  consort: {
    icon: "fa-sun",
    label: "GUBAT_BANWA.Kadungganan.Action.Consort",
  },
  destroy: {
    icon: "fa-bolt-lightning",
    label: "GUBAT_BANWA.Kadungganan.Action.Destroy",
  },
  express: {
    icon: "fa-fire",
    label: "GUBAT_BANWA.Kadungganan.Action.Express",
  },
  glide: {
    icon: "fa-wind",
    label: "GUBAT_BANWA.Kadungganan.Action.Glide",
  },
  observe: {
    icon: "fa-moon",
    label: "GUBAT_BANWA.Kadungganan.Action.Observe",
  },
  reason: {
    icon: "fa-droplet",
    label: "GUBAT_BANWA.Kadungganan.Action.Reason",
  },
  rule: {
    icon: "fa-crown",
    label: "GUBAT_BANWA.Kadungganan.Action.Rule",
  },
  speak: {
    icon: "fa-mountain",
    label: "GUBAT_BANWA.Kadungganan.Action.Speak",
  },
};

/**
 * Kadungganan Disciplines.
 * @enum {string} Label for the localizing the discipline name.
 */
GUBAT_BANWA.disciplines = {
  "baril-witch": "GUBAT_BANWA.Kadungganan.Discipline.BarilWitch",
  "beast-hunter": "GUBAT_BANWA.Kadungganan.Discipline.BeastHunter",
  "bladeweaver": "GUBAT_BANWA.Kadungganan.Discipline.Bladeweaver",
  "busalian": "GUBAT_BANWA.Kadungganan.Discipline.Busalian",
  "buwaya-lancer": "GUBAT_BANWA.Kadungganan.Discipline.BuwayaLancer",
  "death-deancer": "GUBAT_BANWA.Kadungganan.Discipline.DeathDancer",
  "flower-balyan": "GUBAT_BANWA.Kadungganan.Discipline.FlowerBalyan",
  "headtaker": "GUBAT_BANWA.Kadungganan.Discipline.Headtaker",
  "heavenspear": "GUBAT_BANWA.Kadungganan.Discipline.Heavenspear",
  "kawal": "GUBAT_BANWA.Kadungganan.Discipline.Kawal",
  "mangangayaw": "GUBAT_BANWA.Kadungganan.Discipline.Mangangayaw",
  "martyr": "GUBAT_BANWA.Kadungganan.Discipline.Martyr",
  "mender": "GUBAT_BANWA.Kadungganan.Discipline.Mender",
  "murderglaive": "GUBAT_BANWA.Kadungganan.Discipline.Murderglaive",
  "sarimanok-knight": "GUBAT_BANWA.Kadungganan.Discipline.SarimanokKnight",
  "senapati": "GUBAT_BANWA.Kadungganan.Discipline.Senapati",
  "starshooter": "GUBAT_BANWA.Kadungganan.Discipline.Starshooter",
  "strifesinger": "GUBAT_BANWA.Kadungganan.Discipline.Strifesinger",
  "sword-poet": "GUBAT_BANWA.Kadungganan.Discipline.SwordPoet",
  "sword-saint": "GUBAT_BANWA.Kadungganan.Discipline.SwordSaint",
  "swordfish-cavalier": "GUBAT_BANWA.Kadungganan.Discipline.SwordfishCavalier",
  "tigpana": "GUBAT_BANWA.Kadungganan.Discipline.Tigpana",
  "warrior-balyan": "GUBAT_BANWA.Kadungganan.Discipline.WarriorBalyan",
  "warsmith": "GUBAT_BANWA.Kadungganan.Discipline.Warsmith",
  "warspeaker": "GUBAT_BANWA.Kadungganan.Discipline.Warspeaker",
};

/**
 * Configuration data for Prowesses.
 * @typedef {object} ProwessesConfig
 * @property {string} label        Localised label.
 * @property {string} abbreviation Localised abbreviation.
 * @property {string} [type]       Whether it deals with physical or magical forces.
 * @property {string} [use]        Whether it is used for attacking or defending.
 */

/**
 * Prowesses, statistics used for Violence.
 * @enum {ProwessesConfig}
 */
GUBAT_BANWA.prowesses = {
  brv: {
    label: "GUBAT_BANWA.Prowess.Bravery",
    abbreviation: "GUBAT_BANWA.Prowess.BraveryAbbr",
    type: "GUBAT_BANWA.Keywords.Physical",
    use: "attack",
  },
  fai: {
    label: "GUBAT_BANWA.Prowess.Faith",
    abbreviation: "GUBAT_BANWA.Prowess.FaithAbbr",
    type: "GUBAT_BANWA.Keywords.Magical",
    use: "attack",
  },
  pos: {
    label: "GUBAT_BANWA.Prowess.Posture",
    abbreviation: "GUBAT_BANWA.Prowess.PostureAbbr",
    type: "GUBAT_BANWA.Keywords.Physical",
    use: "defend",
  },
  res: {
    label: "GUBAT_BANWA.Prowess.Resilience",
    abbreviation: "GUBAT_BANWA.Prowess.ResilienceAbbr",
    type: "GUBAT_BANWA.Keywords.Magical",
    use: "defend",
  },
};

GUBAT_BANWA.rolls = {
  attack: "GUBAT_BANWA.Rolls.Attacking",
  defend: "GUBAT_BANWA.Rolls.Defending",
  divine: "GUBAT_BANWA.Rolls.Divining"
}

/**
 * @typedef {object} StatusEffectConfig
 * @property {string} id   Key used to identify status effect.
 * @property {string} name Localized label for the status effect.
 * @property {string} icon File path to the icon used on the token that has this status effect.
 */

/**
 * Status effects, overwrites the default foundry ones.
 * @enum {StatusEffectConfig}
 */
GUBAT_BANWA.statusEffects = [
  {
    id: "aflame",
    name: "GUBAT_BANWA.Status.Aflame",
    icon: "icons/svg/fire.svg",
  },
  {
    id: "bleeding",
    name: "GUBAT_BANWA.Status.Bleeding",
    icon: "icons/svg/blood.svg",
  },
  {
    id: "chilled",
    name: "GUBAT_BANWA.Status.Chilled",
    icon: "icons/svg/frozen.svg",
  },
  {
    id: "confused",
    name: "GUBAT_BANWA.Status.Confused",
    icon: "icons/svg/stoned.svg",
  },
  {
    id: "dazzled",
    name: "GUBAT_BANWA.Status.Dazzled",
    icon: "icons/svg/blind.svg",
  },
  {
    id: "debilitated",
    name: "GUBAT_BANWA.Status.Debilitated",
    icon: "icons/svg/downgrade.svg",
  },
  {
    id: "doused",
    name: "GUBAT_BANWA.Status.Doused",
    icon: "icons/svg/waterfall.svg",
  },
  {
    id: "evade",
    name: "GUBAT_BANWA.Status.Evade",
    icon: "icons/svg/invisible.svg",
  },
  {
    id: "fear",
    name: "GUBAT_BANWA.Status.Fear",
    icon: "icons/svg/terror.svg",
  },
  {
    id: "flying",
    name: "GUBAT_BANWA.Status.Flying",
    icon: "icons/svg/wing.svg",
  },
  {
    id: "haste",
    name: "GUBAT_BANWA.Status.Haste",
    icon: "icons/svg/clockwork.svg", // Best we got.
  },
  {
    id: "juggled",
    name: "GUBAT_BANWA.Status.Juggled",
    icon: "icons/svg/falling.svg",
  },
  {
    id: "marked",
    name: "GUBAT_BANWA.Status.Marked",
    icon: "icons/svg/target.svg",
  },
  {
    id: "poisoned",
    name: "GUBAT_BANWA.Status.Poisoned",
    icon: "icons/svg/poison.svg",
  },
  {
    id: "slowed",
    name: "GUBAT_BANWA.Status.Slowed",
    icon: "icons/svg/trap.svg",
  },
  {
    id: "stealth",
    name: "GUBAT_BANWA.Status.Stealth",
    icon: "icons/svg/cowled.svg",
  },
  {
    id: "shocked",
    name: "GUBAT_BANWA.Status.Shocked",
    icon: "icons/svg/lightning.svg",
  },
  {
    id: "stunned",
    name: "GUBAT_BANWA.Status.Stunned",
    icon: "icons/svg/daze.svg",
  },
  {
    id: "taunted",
    name: "GUBAT_BANWA.Status.Taunted",
    icon: "icons/svg/card-joker.svg",
  },
  {
    id: "wideOpen",
    name: "GUBAT_BANWA.Status.WideOpen",
    icon: "icons/svg/paralysis.svg",
  },
];

/**
 * Styles used for Kadungganan Disciplines or for NPCs.
 * @enum {string} Label for the Style.
 */
GUBAT_BANWA.styles = {
  sentinel: "GUBAT_BANWA.Style.Sentinel",
  witch: "GUBAT_BANWA.Style.Witch",
  raider: "GUBAT_BANWA.Style.Raider",
  sharpshooter: "GUBAT_BANWA.Style.Sharpshooter",
  medium: "GUBAT_BANWA.Style.Medium",
};

/**
 * Names of the tabs for the Kadungganan Sheet.
 * @enum {string} Label for the Tab.
 */
GUBAT_BANWA.kadunggananSheetTabs = {
  description: "GUBAT_BANWA.Kadungganan.Tabs.Drama",
  violence: "GUBAT_BANWA.Kadungganan.Tabs.Violence",
  "techniques-liberations": "GUBAT_BANWA.Kadungganan.Tabs.TechniquesAndLiberations",
  "enlightenments-antings": "GUBAT_BANWA.Kadungganan.Tabs.EnlightenmentsAndAntings",
  effects: "EFFECT.TabEffects"
};

export default GUBAT_BANWA;

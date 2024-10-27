import BaseDataModel from "../base.mjs";
import ActorSharedFields from "./fields.mjs";

const { NumberField, SchemaField, StringField } =
  foundry.data.fields;

export default class KadunggananData extends BaseDataModel {
  static defineSchema() {
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();

    return {
      ...schema,
      ...ActorSharedFields.objectFields,
      ...ActorSharedFields.creatureFields,
      wounds: new SchemaField(
        {
          value: new NumberField({
            ...requiredInteger,
            min: 0,
            initial: 0,
          }),
          max: new NumberField({
            ...requiredInteger,
            min: 0,
            initial: 5,
          }),
        },
        { label: "GUBAT_BANWA.Kadungganan.Wounds" },
      ),
      thunderbolts: new NumberField({
        ...requiredInteger,
        min: 0,
        initial: 0,
        label: "GUBAT_BANWA.Kadungganan.Thunderbolts",
      }),
      legend: new NumberField({
        ...requiredInteger,
        min: 0,
        initial: 0,
        max: 12,
        label: "GUBAT_BANWA.Kadungganan.Legend",
      }),
      actions: new SchemaField(
        Object.keys(CONFIG.GUBAT_BANWA.actions).reduce((schema, key) => {
          schema[key] = new NumberField({
            ...requiredInteger,
            min: 0,
            max: 8,
            initial: 1,
            label: CONFIG.GUBAT_BANWA.actions[key],
          });
          return schema;
        }, {}),
        { label: "GUBAT_BANWA.Kadungganan.Actions" },
      ),
      biography: new SchemaField(
        {
          folk: new StringField({
            blank: true,
            label: "GUBAT_BANWA.Kadungganan.Biography.Folk",
          }),
          culture: new StringField({
            blank: true,
            label: "GUBAT_BANWA.Kadungganan.Biography.Culture",
          }),
          subculture: new StringField({
            blank: true,
            label: "GUBAT_BANWA.Kadungganan.Biography.Subculture",
          }),
          lineage: new StringField({
            blank: true,
            label: "GUBAT_BANWA.Kadungganan.Biography.Lineage",
          }),
          lifeEvents: new StringField({
            blank: true,
            label: "GUBAT_BANWA.Kadungganan.Biography.LifeEvents",
          }),
          complications: new StringField({
            blank: true,
            label: "GUBAT_BANWA.Kadungganan.Biography.LifeEvents",
          }),
          conviction: new StringField({
            blank: true,
            label: "GUBAT_BANWA.Kadungganan.Biography.Conviction",
          }),
          passions: new StringField({
            blank: true,
            label: "GUBAT_BANWA.Kadungganan.Biography.Passions",
          }),
        },
        { label: "GUBAT_BANWA.Categories.Biography" },
      ),
      facets: new SchemaField(
        {
          wrathful: new StringField({
            blank: true,
            label: "GUBAT_BANWA.Kadungganan.Facet.Wrathful",
          }),
          gentle: new StringField({
            blank: true,
            label: "GUBAT_BANWA.Kadungganan.Facet.Gentle",
          }),
          royal: new StringField({
            blank: true,
            label: "GUBAT_BANWA.Kadungganan.Facet.Royal",
          }),
        },
        { label: "GUBAT_BANWA.Categories.Facets" },
      ),
      honor: new NumberField({
        ...requiredInteger,
        initial: 5,
        label: "GUBAT_BANWA.Kadungganan.Honor",
      }),
      stance: new StringField({
        blank: true,
        initial: "",
        label: "GUBAT_BANWA.UI.Stance",
      }),
      equipLimit: new SchemaField({
        technique: new NumberField({ ...requiredInteger, min: 1, initial: 8 }),
        enlightenment: new NumberField({
          ...requiredInteger,
          min: 1,
          initial: 1,
        }),
        liberation: new NumberField({
          ...requiredInteger,
          min: 1,
          initial: 1,
        }),
      }),
    };
  }

  prepareBaseData() {
    if (this.legend > 0) {
      if (this.legend < 5) {
        this.rank = "GUBAT_BANWA.Kadungganan.Rank.Warrior";
        this.equipLimit.anting = 1;
      } else if (this.legend < 9) {
        this.rank = "GUBAT_BANWA.Kadungganan.Rank.Hero";
        this.equipLimit.anting = 2;
      } else {
        this.rank = "GUBAT_BANWA.Kadungganan.Rank.King";
        this.equipLimit.anting = 3;
      }
    } else {
      this.equipLimit.anting = 0;
    }
  }
}

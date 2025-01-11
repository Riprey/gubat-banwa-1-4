import BaseDataModel from "../base.mjs";
import ActorSharedFields from "./fields.mjs";

const { ArrayField, HTMLField, NumberField, SchemaField, StringField } = foundry.data.fields;

export default class NPCData extends BaseDataModel {
  static defineSchema() {
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();

    return {
      ...schema,
      ...ActorSharedFields.objectFields,
      ...ActorSharedFields.creatureFields,
      poise: new SchemaField(
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
        { label: "GUBAT_BANWA.NPC.Poise" },
      ),
      description: new HTMLField(),
      attacks: new HTMLField(),
      speed: new NumberField({ ...requiredInteger, min: 0, initial: 0 }),
      jump: new NumberField({ ...requiredInteger, min: 0, initial: 0 }),
      style: new StringField({
        choices: Object.keys(CONFIG.GUBAT_BANWA.styles),
      }),
      threat: new NumberField({ ...requiredInteger, min: 0, initial: 0 }),
      traits: new ArrayField(new SchemaField({
        name: new StringField(),
        description: new StringField({ blank: true })
      }))
    };
  }
}

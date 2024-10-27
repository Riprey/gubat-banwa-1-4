import { BaseItemData } from "../base.mjs";
const { BooleanField, HTMLField, NumberField, SchemaField, StringField } =
  foundry.data.fields;

export default class DisciplineData extends BaseItemData {
  /** @inheritdoc */
  static metadata = Object.freeze(
    foundry.utils.mergeObject(
      super.metadata,
      { singleton: true },
      { inplace: false },
    ),
  );

  static defineSchema() {
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();

    return {
      ...schema,
      identifier: new StringField(),
      label: new StringField(),
      hp: new SchemaField({
        max: new NumberField({ ...requiredInteger, min: 0, initial: 0 }),
      }),
      speed: new NumberField({ ...requiredInteger, min: 0, initial: 0 }),
      jump: new NumberField({ ...requiredInteger, min: 0, initial: 0 }),
      prowesses: new SchemaField(
        Object.keys(CONFIG.GUBAT_BANWA.prowesses).reduce((schema, key) => {
          schema[key] = new NumberField({ ...requiredInteger, initial: 0 });
          return schema;
        }, {}),
      ),
      style: new StringField({
        choices: Object.keys(CONFIG.GUBAT_BANWA.styles),
      }),
      trait: new SchemaField({
        name: new StringField({
          blank: true,
          label: "GUBAT_BANWA.Kadungganan.DisciplineTrait.Name",
        }),
        description: new HTMLField({
          blank: true,
          label: "GUBAT_BANWA.UI.Description",
        }),
        flavor: new HTMLField({
          blank: true,
          label: "GUBAT_BANWA.Kadungganan.UI.Flavor",
        }),
      }),
      violences: new SchemaField({
        name: new StringField({
          blank: true,
          label: "GUBAT_BANWA.Kadungganan.Violence.Name",
        }),
        flavor: new HTMLField({
          blank: true,
          label: "GUBAT_BANWA.Kadungganan.UI.Flavor",
        }),
        attacks: new SchemaField({
          // Unfortunately Foundry doesn't play well with HTMLFields inside ArrayFields.
          1: new SchemaField({
            name: new StringField({
              blank: true,
              label: "GUBAT_BANWA.Kadungganan.Violence.Name",
            }),
            description: new HTMLField({
              blank: true,
              label: "GUBAT_BANWA.UI.Description",
            }),
            rolls: new SchemaField(
              Object.keys(CONFIG.GUBAT_BANWA.prowesses).reduce(
                (schema, key) => {
                  schema[key] = new BooleanField();
                  return schema;
                },
                {},
              ),
            ),
          }),
          2: new SchemaField({
            name: new StringField({
              blank: true,
              label: "GUBAT_BANWA.Kadungganan.Violence.Name",
            }),
            description: new HTMLField({
              blank: true,
              label: "GUBAT_BANWA.UI.Description",
            }),
            rolls: new SchemaField(
              Object.keys(CONFIG.GUBAT_BANWA.prowesses).reduce(
                (schema, key) => {
                  schema[key] = new BooleanField();
                  return schema;
                },
                {},
              ),
            ),
          }),
          3: new SchemaField({
            name: new StringField({
              blank: true,
              label: "GUBAT_BANWA.Kadungganan.Violence.Name",
            }),
            description: new HTMLField({
              blank: true,
              label: "GUBAT_BANWA.UI.Description",
            }),
            rolls: new SchemaField(
              Object.keys(CONFIG.GUBAT_BANWA.prowesses).reduce(
                (schema, key) => {
                  schema[key] = new BooleanField();
                  return schema;
                },
                {},
              ),
            ),
          }),
        }),
      }),
    };
  }
}

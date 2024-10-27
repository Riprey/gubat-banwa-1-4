const { ArrayField, NumberField, SchemaField, StringField } =
  foundry.data.fields;

const requiredInteger = { required: true, nullable: false, integer: true };

/**
 * A class for shared Schema fields.
 * The reason this can't be just an object is so CONFIG's value has been
 * initialised when the fields are retrieved/called.
 * An object would attempt to call CONFIG before it has any values.
 */
export default class ActorSharedFields {
  static get objectFields() {
    return {
      hp: new SchemaField(
        {
          value: new NumberField({
            ...requiredInteger,
            min: 0,
            initial: 0,
            label: "GUBAT_BANWA.Actor.HitPearlsCurrent",
          }),
          max: new NumberField({
            ...requiredInteger,
            min: 0,
            initial: 0,
            label: "GUBAT_BANWA.Actor.HitPearlsMax",
          }),
          blocks: new NumberField({
            integer: true,
            min: 0,
            initial: 0,
            label: "GUBAT_BANWA.Blocks",
          }),
        },
        { label: "GUBAT_BANWA.Actor.HitPearls" },
      ),
      resource: new StringField({
        blank: true,
        initial: "",
        label: "GUBAT_BANWA.UI.Resource",
      }),
      size: new NumberField({
        required: true,
        nullable: false,
        integer: false,
        min: 0.5,
        initial: 1,
        max: 5,
        label: "GUBAT_BANWA.Size",
      }),
    };
  }

  static get creatureFields() {
    return {
      debt: new ArrayField(
        new SchemaField({
          value: new NumberField({ ...requiredInteger, initial: 0 }),
          description: new StringField({ blank: true }),
        }),
        { nullable: true, label: "GUBAT_BANWA.Debt" },
      ),
      prowesses: new SchemaField(
        Object.keys(CONFIG.GUBAT_BANWA.prowesses).reduce((schema, key) => {
          schema[key] = new SchemaField(
            {
              value: new NumberField({
                ...requiredInteger,
                min: 1,
                max: 10,
                initial: 1,
              }),
            },
            { label: CONFIG.GUBAT_BANWA.prowesses[key].label },
          );
          return schema;
        }, {}),
        { label: "GUBAT_BANWA.Prowesses" },
      ),
    };
  }
}

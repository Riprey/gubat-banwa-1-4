const { BooleanField, HTMLField, StringField } =
  foundry.data.fields;

export default class ItemSharedFields {
  static get commonFields() {
    return {
      description: new HTMLField({
        blank: true,
        required: true,
        label: "GUBAT_BANWA.Description",
      }),
      label: new StringField({ required: true, blank: true }),
    };
  }

  static get equippableFields() {
    return {
      equipped: new BooleanField({ label: "GUBAT_BANWA.UI.Equipped" }),
      flavor: new HTMLField({ blank: true, label: "GUBAT_BANWA.UI.Flavor" }),
    };
  }

  static get disciplineFeatFields() {
    return {
      discipline: new StringField({
        required: true,
        initial: "",
        label: "GUBAT_BANWA.Categories.Discipline",
      }),
    }
  }
}

import BaseDataModel from "../base.mjs";
import ActorSharedFields from "./fields.mjs";

const { HTMLField, NumberField } = foundry.data.fields;

export default class ObjectData extends BaseDataModel {
  static defineSchema() {
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();

    return {
      ...schema,
      ...ActorSharedFields.objectFields,
      description: new HTMLField(),
      height: new NumberField({...requiredInteger, initial: 1, min: 0})
    };
  }
}

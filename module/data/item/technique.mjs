import { BaseItemData } from "../base.mjs";
import ItemSharedFields from "./fields.mjs";
const { NumberField } = foundry.data.fields;

export default class TechniqueData extends BaseItemData {
  static defineSchema() {
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();

    return {
      ...schema,
      ...ItemSharedFields.equippableFields,
      ...ItemSharedFields.disciplineFeatFields,
      rank: new NumberField({ ...requiredInteger, min: 1, initial: 1, max: 4 }),
    };
  }
}

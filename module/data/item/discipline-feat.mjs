import { BaseItemData } from "../base.mjs";
import ItemSharedFields from "./fields.mjs";
const { BooleanField } = foundry.data.fields;

export default class DisciplineFeatData extends BaseItemData {
  static defineSchema() {
    const schema = super.defineSchema();

    return {
      ...schema,
      ...ItemSharedFields.equippableFields,
      ...ItemSharedFields.disciplineFeatFields,
      used: new BooleanField()
    };
  }
}

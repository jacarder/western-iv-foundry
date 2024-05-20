import WesternIVItemBase from "./item-base.mjs";

export default class WesternIVDiscipline extends WesternIVItemBase {
	static defineSchema() {
		const maxSpecializations = 6;
		const fields = foundry.data.fields;
		const schema = super.defineSchema();

		const defaultSpecialization = { value: "" }

		schema.specializations = new fields.
			ArrayField(
				new fields.ObjectField(),
				{
					initial: [...Array(maxSpecializations).fill(0).map(x => (defaultSpecialization))]
				}
			);

		return schema;
	}
}
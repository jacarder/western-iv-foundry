import WesternIVItemBase from "./item-base.mjs";

export default class WesternIVSkill extends WesternIVItemBase {
	static defineSchema() {
		const maxPractice = 20;
		const maxSkillPointGroup = 5;
		const fields = foundry.data.fields;
		const schema = super.defineSchema();

		schema.practicePoints = new fields.NumberField({ initial: 0, max: maxPractice })
		schema.requiresPractice = new fields.BooleanField({ initial: false })
		schema.relatedAttributes = new fields.StringField()
		schema.skillPointGroup = new fields.NumberField({ initial: 1, max: maxSkillPointGroup })
		schema.skillGroup = new fields.StringField({ initial: "" })
		schema.totalPoints = new fields.NumberField({ initial: 0 })
		return schema;
	}

	getTotalPoints(actor, [attr1, attr2]) {
		return this.practicePoints + actor.system.abilities[attr1].mod + actor.system.abilities[attr2].mod;
	}
	// plot points to find the equation [(1,-5),(2,-4),(3,-3),(4,-3),(5,-2),(6,-2),(7,-1),(8,-1),(9,-0),(10,0),(11,0),(12,0),(13,1),(14,1),(15,2),(16,2),(17,3),(18,3),(19,4),(20,5)]
}
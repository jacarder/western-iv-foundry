import WesternIVActorBase from "./actor-base.mjs";

export default class WesternIVCharacter extends WesternIVActorBase {

  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();

    schema.attributes = new fields.SchemaField({
      level: new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 1 })
      }),
    });

    // Iterate over ability names and create a new SchemaField for each.
    schema.abilities = new fields.SchemaField(Object.keys(CONFIG.WESTERN_IV.abilities).reduce((obj, ability) => {
      obj[ability] = new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 10, min: 0 }),
        mod: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
        label: new fields.StringField({ required: true, blank: true }),
        abbreviation: new fields.StringField({ required: true, initial: Object.keys(CONFIG.WESTERN_IV.abilityAbbreviations).find(key => key === ability) })
      });
      return obj;
    }, {}));

    //  Custom
    schema.nameRep = new fields.SchemaField({
      honor: new fields.NumberField({ ...requiredInteger, initial: 1 }),
      fame: new fields.NumberField({ ...requiredInteger, initial: 0 })
    });
    schema.aliasRep = new fields.SchemaField({
      honor: new fields.NumberField({ ...requiredInteger, initial: 1 }),
      fame: new fields.NumberField({ ...requiredInteger, initial: 0 })
    });
    schema.groupRep = new fields.SchemaField({
      honor: new fields.NumberField({ ...requiredInteger, initial: 1 }),
      fame: new fields.NumberField({ ...requiredInteger, initial: 0 })
    });

    schema.alias = new fields.StringField({ required: true, blank: true });
    schema.group = new fields.StringField({ required: true, blank: true });
    schema.role = new fields.StringField({ required: true, blank: true });
    schema.education = new fields.StringField({ required: true, blank: true });
    schema.weaponHand = new fields.StringField({ required: true, initial: 'right' });


    schema.moves = new fields.ObjectField({
      initial: {
        primary: null,
        secondary: [], // Holds key of either attack or defense
        attack: Object.entries(CONFIG.WESTERN_IV.attackMoves).reduce((obj, [key, label]) => ({ ...obj, ...{ [key]: { label, value: 0 } } }), {}),
        defense: Object.entries(CONFIG.WESTERN_IV.defenseMoves).reduce((obj, [key, label]) => ({ ...obj, ...{ [key]: { label, value: 0 } } }), {}),
      }
    });

    return schema;
  }

  prepareDerivedData() {
    // Loop through ability scores, and add their modifiers to our sheet output.
    for (const key in this.abilities) {
      const bonusChart = [-5, -4, -3, -3, -2, -2, -1, -1, 0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 5];
      this.abilities[key].mod = bonusChart[this.abilities[key].value - 1]
      // Handle ability label localization.
      this.abilities[key].label = game.i18n.localize(CONFIG.WESTERN_IV.abilities[key]) ?? key;
    }
    for (let [key, ability] of Object.entries(this.abilities)) {
      const skills = this.parent.items.filter(x => x.type === 'skill' && x.system.relatedAttributes.split(',').includes(ability.abbreviation));
      for (let i of skills) {
        //  Update total points for each skill related to the attribute
        i.system.totalPoints = i.system.getTotalPoints(this.parent, i.system.relatedAttributes.split(','))
        i.system.setFormula();
      }
    }

  }

  getRollData() {
    const data = {};

    // Copy the ability scores to the top level, so that rolls can use
    // formulas like `@str.mod + 4`.
    if (this.abilities) {
      for (let [k, v] of Object.entries(this.abilities)) {
        data[k] = foundry.utils.deepClone(v);
      }
    }

    data.lvl = this.attributes.level.value;

    return data
  }

  // TODO move out
  calculateAbilityMod
}
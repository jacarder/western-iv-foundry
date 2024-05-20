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
        label: new fields.StringField({ required: true, blank: true })
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

    return schema;
  }

  prepareDerivedData() {
    // Loop through ability scores, and add their modifiers to our sheet output.
    for (const key in this.abilities) {
      // Calculate the modifier using d20 rules.
      this.abilities[key].mod = Math.floor((this.abilities[key].value - 10) / 2);
      // Handle ability label localization.
      this.abilities[key].label = game.i18n.localize(CONFIG.WESTERN_IV.abilities[key]) ?? key;
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
}
import { Data } from "./util/data.js";

import {
    @ButtonProperty,
    @CheckboxProperty,
    Color,
    @ColorProperty,
    @PercentSliderProperty,
    @SelectorProperty,
    @SwitchProperty,
    @TextProperty,
    @Vigilant,
} from '../Vigilance/index.js';

@Vigilant('sbd', 'SBD Settings')
class Config {
    @TextProperty({
        name: 'API Key',
        description: 'Your API Key. Autodetected from the /api new message.',
        category: 'Config',
        protected: true,
    })
    apikey = "";

    @SwitchProperty({
        name: 'Party Finder Stats',
        description: 'Shows stats of players in Party Finder.',
        category: 'Dungeons',
        subcategory: 'Party Finder',
    })
    partyfinder = true;

    @SwitchProperty({
        name: 'Show class level',
        description: 'Shows the player\'s class level in party finder.',
        category: 'Dungeons',
        subcategory: 'Party Finder',
    })
    partyfinderClassLevel = true;

    @SwitchProperty({
        name: 'Show cata level',
        description: 'Shows the player\'s catacombs level in party finder.',
        category: 'Dungeons',
        subcategory: 'Party Finder',
    })
    partyfinderCata = true;

    @SwitchProperty({
        name: 'Show total secrets',
        description: 'Shows the player\'s total amount of secrets in party finder.',
        category: 'Dungeons',
        subcategory: 'Party Finder',
    })
    partyfinderSecrets = true;

    @SwitchProperty({
        name: 'Show secret average',
        description: 'Shows the player\'s secret average in party finder.',
        category: 'Dungeons',
        subcategory: 'Party Finder',
    })
    partyfinderSecretAverage = true;

    @SwitchProperty({
        name: 'Show S+ PB',
        description: 'Shows the player\'s fastest S+ time for the current floor in party finder.',
        category: 'Dungeons',
        subcategory: 'Party Finder',
    })
    partyfinderF7PB = true;

    constructor() {
        this.initialize(this);
        this.addDependency("Show class level", "Party Finder Stats")
        this.addDependency("Show total secrets", "Party Finder Stats")
        this.addDependency("Show cata level", "Party Finder Stats")
        this.addDependency("Show secret average", "Party Finder Stats")
        this.addDependency("Show S+ PB", "Party Finder Stats")
    }
}

export default new Config();

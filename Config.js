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

// The only parameter that is required is the first, which should be the Module name.
// The other 2 parameters are optional.
// The 2nd parameter is the title of the settings window, seen in the top left above the
// category list.
// The 3rd parameter is an object that determines the sorting order of the categories.
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
    partyfinder = false;

    @SwitchProperty({
        name: 'Show Total Secrets',
        description: 'Shows stats of players in Party Finder.',
        category: 'Dungeons',
        subcategory: 'Party Finder',
    })
    partyfinderSecrets = false;

    @SwitchProperty({
        name: 'Show Secret Average',
        description: 'Shows stats of players in Party Finder.',
        category: 'Dungeons',
        subcategory: 'Party Finder',
    })
    partyfinderSecretsAvg = false;

    @SwitchProperty({
        name: 'Show F7 PB',
        description: 'Shows stats of players in Party Finder.',
        category: 'Dungeons',
        subcategory: 'Party Finder',
    })
    partyfinderF7PB = false;

    @SwitchProperty({
        name: 'Show Cata',
        description: 'Shows stats of players in Party Finder.',
        category: 'Dungeons',
        subcategory: 'Party Finder',
    })
    partyfinderCata = false;

    constructor() {
        this.initialize(this);
        this.addDependency("Show Total Secrets","Party Finder Stats")
        this.addDependency("Show Secret Average","Party Finder Stats")
        this.addDependency("Show F7 PB","Party Finder Stats")
        this.addDependency("Show Secret Average","Party Finder Stats")
        this.addDependency("Show Cata","Party Finder Stats")

    }
}

export default new Config();

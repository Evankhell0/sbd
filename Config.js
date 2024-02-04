import { Data } from "./util/data.js"
import { setApiKey } from "./util/updateconfig.js"

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
    apikey = Data.key;

    @SwitchProperty({
        name: 'Party Finder Stats',
        description: 'Shows stats of players in Party Finder.',
        category: 'Dungeons',
        subcategory: 'Party Finder',
    })
    partyfinder = true;

    constructor() {
        this.initialize(this);
        this.registerListener('API Key', (key) => {
            if(!key || key == Data.key) {
                return;
            }
            setApiKey(key)
        });
    }
}

export default new Config();

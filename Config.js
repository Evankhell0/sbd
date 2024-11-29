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

    @SwitchProperty({
        name: 'Show missing classes',
        description: 'Displays missing classes in M4/M6/M7 party finder.',
        category: 'Dungeons',
        subcategory: 'Party Finder',
    })
    missingclasses = false;

    @SwitchProperty({
        name: 'Autokick',
        description: 'Autokick players below certain requirements.',
        category: 'Dungeons',
        subcategory: 'Autokick',
    })
    autokick = false;

    @SelectorProperty({
        name: 'Selected Floor',
        description: 'Which floor\'s S+ PB should be checked.',
        category: 'Dungeons',
        subcategory: 'Autokick',
        options: [
            "F7",
            "M4",
            "M5",
            "M6",
            "M7"
        ]
    })
    selectedfloor = 0;

    @TextProperty({
        name: 'Required S+ PB',
        description: 'Time in seconds. Leave empty for no requirement.',
        category: 'Dungeons',
        subcategory: 'Autokick',
        placeholder: "no req"
    })
    requiredPB = "";

    @TextProperty({
        name: 'Required Secrets',
        description: 'Required secrets (across all profiles). Leave empty for no requirement.',
        category: 'Dungeons',
        subcategory: 'Autokick',
        placeholder: "no req"
    })
    requiredSecrets = "";

    @SwitchProperty({
        name: 'Send kick message',
        description: 'Sends a message in party chat before kicking.',
        category: 'Dungeons',
        subcategory: 'Autokick',
    })
    kickmessage = false;

    constructor() {
        this.initialize(this);

        this.addDependency("Show class level", "Party Finder Stats")
        this.addDependency("Show total secrets", "Party Finder Stats")
        this.addDependency("Show cata level", "Party Finder Stats")
        this.addDependency("Show secret average", "Party Finder Stats")
        this.addDependency("Show S+ PB", "Party Finder Stats")

        this.addDependency("Selected Floor", "Autokick")
        this.addDependency("Required S+ PB", "Autokick")
        this.addDependency("Required Secrets", "Autokick")
        this.addDependency("Send kick message", "Autokick")
    }
}

export default new Config();

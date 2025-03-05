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
        category: 'Party Finder',
        subcategory: 'Overlay',
    })
    partyfinder = true;

    @SwitchProperty({
        name: 'Show class level',
        description: 'Shows the player\'s class level in party finder.',
        category: 'Party Finder',
        subcategory: 'Overlay',
    })
    partyfinderClassLevel = true;

    @SwitchProperty({
        name: 'Show cata level',
        description: 'Shows the player\'s catacombs level in party finder.',
        category: 'Party Finder',
        subcategory: 'Overlay',
    })
    partyfinderCata = true;

    @SwitchProperty({
        name: 'Show total secrets',
        description: 'Shows the player\'s total amount of secrets in party finder.',
        category: 'Party Finder',
        subcategory: 'Overlay',
    })
    partyfinderSecrets = true;

    @SwitchProperty({
        name: 'Show secret average',
        description: 'Shows the player\'s secret average in party finder.',
        category: 'Party Finder',
        subcategory: 'Overlay',
    })
    partyfinderSecretAverage = true;

    @SwitchProperty({
        name: 'Show S+ PB',
        description: 'Shows the player\'s fastest S+ time for the current floor in party finder.',
        category: 'Party Finder',
        subcategory: 'Overlay',
    })
    partyfinderF7PB = true;

    @SwitchProperty({
        name: 'Show missing classes',
        description: 'Displays missing classes in M4/M6/M7 party finder.',
        category: 'Party Finder',
        subcategory: 'Overlay',
    })
    missingclasses = false;

    @SwitchProperty({
        name: 'Autokick',
        description: 'Autokick players below certain requirements.',
        category: 'Autokick',
        subcategory: 'Autokick',
    })
    autokick = false;

    @SelectorProperty({
        name: 'Selected Floor',
        description: 'Which floor\'s S+ PB should be checked.',
        category: 'Autokick',
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
        category: 'Autokick',
        subcategory: 'Autokick',
        placeholder: "no req"
    })
    requiredPB = "";

    @TextProperty({
        name: 'Required Secrets',
        description: 'Required secrets (across all profiles). Leave empty for no requirement.',
        category: 'Autokick',
        subcategory: 'Autokick',
        placeholder: "no req"
    })
    requiredSecrets = "";

    @SwitchProperty({
        name: 'Send kick message',
        description: 'Sends a message in party chat before kicking.',
        category: 'Autokick',
        subcategory: 'Autokick',
    })
    kickmessage = false;

    @SwitchProperty({
        name: 'Track Solo Clears',
        description: 'Track all of your solo clear times.',
        category: 'Solo Clears',
        subcategory: 'Solo Clears',
    })
    tracksoloclears = true;

    constructor() {
        this.initialize(this);

        this.setCategoryDescription("Solo Clears",
            `
            Commands:
            &e/topsoloclears <floor> <amount> &r- Shows your top solo clear times.
            &e/soloclearstats <floor> &r- Shows your solo clear stats.
        `)

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

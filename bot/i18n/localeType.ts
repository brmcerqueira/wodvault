type CommandOption = {
  name: string;
  description: string;
};

export type LocaleType = {
  unauthorized: string;
  characterNotFound: string;
  rollExecuted: string;
  reRollHelperText: string;
  character: string;
  modifier: string;
  status: string;
  successes: string;
  difficulty: string;
  dices: string;
  messyCritical: string;
  regularCritical: string;
  success: string;
  failure: string;
  bestialFailure: string;
  rollChannel: string;
  characterCheck: string;
  characterCheckFailed: string;
  shortcutComposeWithoutDescription: string;
  dicePool: string;
  storyteller: string;
  storytellerUpdate: string;
  storytellerSetCharacterToUser: string;
  storytellerSetCurrentCharacter: string;
  storytellerChangeDifficulty: string;
  storytellerChangeModifier: string;
  storytellerChangeRollChannel: string;
  storytellerClearRollChannel: string;
  storytellerClearCurrentCharacter: string;
  commands: {
    check: {
      dices: CommandOption;
    } & CommandOption;
    roll: {
      dices: CommandOption;
      hunger: CommandOption;
      difficulty: CommandOption;
      descriptionField: CommandOption;
    } & CommandOption;
    dicePool: {
      nameField: CommandOption;
    } & CommandOption;
    compose: {
      attribute: CommandOption;
      secondaryAttribute: CommandOption;
      skillPhysical: CommandOption;
      skillSocial: CommandOption;
      skillMental: CommandOption;
      discipline: CommandOption;
      renown: CommandOption;
      difficulty: CommandOption;
      modifier: CommandOption;
      descriptionField: CommandOption;
    } & CommandOption;
    shortcut: CommandOption;
    storyteller: {
      character: {
        clearCurrentCharacter: CommandOption;
        setCurrentCharacter: {
          character: CommandOption;
        } & CommandOption;
        setCharacterToUser: {
          player: CommandOption;
          character: CommandOption;
        } & CommandOption;
      } & CommandOption;
      rollChannel: {
        clear: CommandOption;
        channel: {
          value: CommandOption;
        } & CommandOption;
      } & CommandOption;
      setStoryteller: {
        user: CommandOption;
      } & CommandOption;
      setDifficulty: {
        value: CommandOption;
      } & CommandOption;
      setModifier: {
        value: CommandOption;
      } & CommandOption;
    } & CommandOption;
  };
  dicePools: string[];
};

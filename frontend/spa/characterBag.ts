import { CharacterMode } from "../../character.ts";
import { createContext } from "$react";
import { ExperienceField } from "./fields/experienceField.tsx";

export class CharacterBag {
  constructor(private ref: React.RefObject<ExperienceField | null>) {
  }

  private _mode: CharacterMode = CharacterMode.Opened;
  private _edit: boolean = false;
  private _owner: boolean = false;

  public get mode(): CharacterMode {
    return this._mode;
  }

  public set mode(value: CharacterMode) {
    this._mode = value;
  }

  public get edit(): boolean {
    return this._edit;
  }

  public set edit(value: boolean) {
    this._edit = value;
  }

  public get canUpdate(): boolean {
    return this.edit && (this.owner || this.mode != CharacterMode.Closed);
  }

  public get owner(): boolean {
    return this._owner;
  }

  public set owner(value: boolean) {
    this._owner = value;
  }

  public get experienceFieldRef(): React.RefObject<ExperienceField | null> {
    return this.ref;
  }

  public updateSpentExperience(value: number) {
    this.ref.current?.updateSpentExperience(value);
  }
}

export const CharacterBagContext = createContext<
  CharacterBag | undefined
>(undefined) as React.Context<CharacterBag>;

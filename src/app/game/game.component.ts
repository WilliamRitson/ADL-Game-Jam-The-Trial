import { Component, OnInit } from '@angular/core';
import {
    ScenesService,
    Scene,
    Action,
    Character,
    Option,
    CharacterMap
} from '../scenes.service';

@Component({
    selector: 'app-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
    public backgroundURL: string;
    public text: string;
    private textColor = 'black';
    public scene: Scene;
    public actions: Action[];
    public options: Option[];
    private lineIndex: number;
    private canContinue = true;
    private characters: CharacterMap;
    private guilt = 0;

    constructor(scenes: ScenesService) {
        this.characters = scenes.getCharacters();
        this.setScene(scenes.getFirst());
    }

    private setScene(scene: Scene) {
        this.scene = scene;
        this.actions = [];
        this.options = [];
        this.backgroundURL = scene.backgroundUrl;

        this.lineIndex = -1;
        this.nextLine();
    }

    private nextLine() {
        if (this.lineIndex < this.scene.lines.length - 1) {
            this.lineIndex++;
            const nextLine = this.scene.lines[this.lineIndex];
            if (typeof nextLine === 'string') {
                this.setText(nextLine);
            }  else if (Array.isArray(nextLine)) {
                this.options = nextLine;
            } else {
                if (this.guilt >= nextLine.threshold) {
                    this.setText(nextLine.high);
                } else {
                    this.setText(nextLine.low);
                }
            }
        } else {
            this.text = '';
            if (this.scene.actions.length > 0) {
                this.actions = this.scene.actions;
            } else {
                this.setScene(this.scene.next);
            }
        }
    }

    public continue() {
        if (!this.canContinue || this.options.length !== 0) {
            return;
        }
        this.nextLine();
    }

    public runAction(action: Action) {
        this.canContinue = false;
        this.setScene(action.target);
        setTimeout(() => (this.canContinue = true), 100);
    }

    public runOption(option: Option) {
        this.canContinue = false;
        this.options = [];
        this.setText(option.response);
        if (option.guilt) {
            this.guilt += option.guilt;
        }
        setTimeout(() => (this.canContinue = true), 100);
    }

    private setText(text: string) {
        const tokens = text.split(':');
        if (tokens.length > 1) {
            this.text = tokens[1];
            this.textColor = this.getColor(tokens[0]);
        } else {
            this.text = text;
            this.textColor = this.getColor('narrator');
        }
    }

    private getColor(characterName: string) {
        return this.characters[characterName].aura;
    }

    public getBackgroundUrl() {
        return `assets/${this.backgroundURL}`;
    }

    public getCharacterUrl() {
        return `assets/${this.scene.character.image}`;
    }

    public getCharacterAura() {
        return {
            filter: `drop-shadow(0px 4px 4px ${this.scene.character.aura})`
        };
    }

    public getTextStyle() {
        const end = 6 - this.options.length;
        return {
            'grid-column': `1 / span ${end}`,
            color: this.textColor
        };
    }
    ngOnInit() {}
}

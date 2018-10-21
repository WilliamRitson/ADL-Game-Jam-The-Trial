import { Component, OnInit } from '@angular/core';
import { ScenesService, Scene, Action, Character, Option } from '../scenes.service';

@Component({
    selector: 'app-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
    public backgroundURL: string;
    public text: string;
    public scene: Scene;
    public actions: Action[];
    public options: Option[];
    private lineIndex: number;
    private canContinue = true;

    constructor(scenes: ScenesService) {
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
                this.text = nextLine;
            } else {
                this.options = nextLine;
            }
        } else {
            this.text = '';
            this.actions = this.scene.actions;
        }
    }

    public continue() {
        console.log('continue');
        if (!this.canContinue || this.options.length !== 0) {
            return;
        }
        this.nextLine();
    }

    public runAction(action: Action) {
        console.log('runAction');
        this.canContinue = false;
        this.setScene(action.target);
        setTimeout(() => (this.canContinue = true), 100);
    }

    public runOption(option: Option) {
        console.log('runOption');
        this.canContinue = false;
        this.options = [];
        this.text = option.response;
        setTimeout(() => (this.canContinue = true), 100);
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
            'grid-column': `1 / span ${end}`
        };
    }
    ngOnInit() {}
}

import { Component, OnInit } from '@angular/core';
import { ScenesService, Scene, Action, Character } from '../scenes.service';

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
    private lineIndex: number;
    private canContinue = true;

    constructor(scenes: ScenesService) {
        this.setScene(scenes.getFirst());
    }

    private setScene(scene: Scene) {
        this.scene = scene;
        this.lineIndex = 0;
        this.text = scene.lines[this.lineIndex];
        this.actions = [];
        this.backgroundURL = scene.backgroundUrl;
    }

    public next() {
        if (!this.canContinue) {
            return;
        }
        if (this.lineIndex < this.scene.lines.length - 1) {
            this.lineIndex++;
            this.text = this.scene.lines[this.lineIndex];
        } else {
            this.text = '';
            this.actions = this.scene.actions;
        }
    }

    public runAction(action: Action) {
        this.canContinue = false;
        this.setScene(action.target);
        setTimeout(() => this.canContinue = true, 100);
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

    ngOnInit() {}
}

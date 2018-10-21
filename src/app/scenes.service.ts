import { Injectable } from '@angular/core';
import storyData from './story.json';

export interface Character {
    description: string;
    image: string;
    aura: string;
}
interface CharacterMap {
    [name: string]: Character;
}

interface SavedAction {
    text: string;
    target: string;
}

interface SavedScene {
    name: string;
    lines: Array<string>;
    backgroundUrl: string;
    character: string;
    actions: Array<SavedAction>;
}
interface SceneMap {
    [name: string]: Scene;
}

export class Action {
    public text: string;
    public target: Scene;

    public static formJson(saved: SavedAction, scenes: SceneMap) {
        const action = new Action();
        action.text = saved.text;
        action.target = scenes[saved.target];
        return action;
    }

    public toJson() {
        return {
            text: this.text,
            target: this.target.name
        };
    }
}

export class Scene {
    constructor(
        public name: string,
        public lines: Array<string>,
        public backgroundUrl: string,
        public character: Character,
        public actions: Array<Action>
    ) {}

    public static formJson(scene: SavedScene, characters: CharacterMap) {
        return new Scene(
            scene.name,
            scene.lines,
            scene.backgroundUrl,
            characters[scene.character],
            []
        );
    }

    public toJson() {
        return {
            name: this.name,
            lines: this.lines,
            backgroundUrl: this.backgroundUrl,
            actions: this.actions.map(action => action.toJson())
        };
    }

    public buildActions(scene: SavedScene, scenes: SceneMap) {}
}

@Injectable({
    providedIn: 'root'
})
export class ScenesService {
    private firstScene: Scene;

    constructor() {
        const scenes: SceneMap = {};
        for (const sceneName in storyData.scenes) {
            if (storyData.scenes.hasOwnProperty(sceneName)) {
                const scene = Scene.formJson(
                    storyData.scenes[sceneName],
                    storyData.characters
                );
                scenes[sceneName] = scene;
            }
        }
        for (const sceneName in storyData.scenes) {
            if (storyData.scenes.hasOwnProperty(sceneName)) {
                scenes[sceneName].buildActions(
                    storyData.scenes[sceneName],
                    scenes
                );
            }
        }
        this.firstScene = scenes.start;
        console.log(this, scenes);
    }

    public getFirst() {
        return this.firstScene;
    }
}

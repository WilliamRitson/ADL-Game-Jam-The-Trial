import { Injectable } from '@angular/core';
import storyData from './story.json';

export interface Character {
    description: string;
    image: string;
    aura: string;
}
export interface CharacterMap {
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
    actions?: Array<SavedAction>;
    next: string;
    fork: GuiltSplit;
}
interface SceneMap {
    [name: string]: Scene;
}

export interface Option {
    option: string;
    response: string;
    guilt?: number;
}

export interface GuiltSplit {
    threshold: number;
    high: string;
    low: string;
}

export type Line = string | GuiltSplit | Array<Option>;

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
    public fork: { threshold: number; high: Scene; low: Scene };

    constructor(
        public name: string,
        public lines: Array<Line>,
        public backgroundUrl: string,
        public character: Character,
        public actions: Array<Action>,
        public next: Scene
    ) {}

    public static formJson(scene: SavedScene, characters: CharacterMap) {
        return new Scene(
            scene.name,
            scene.lines,
            scene.backgroundUrl,
            characters[scene.character],
            [],
            null
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

    public buildActions(scene: SavedScene, scenes: SceneMap) {
        const actionData = scene.actions || [];
        this.actions = actionData.map(data => Action.formJson(data, scenes));
        if (scene.next) {
            this.next = scenes[scene.next];
        }
        if (scene.fork) {
            this.fork = {
                threshold: scene.fork.threshold,
                high: scenes[scene.fork.high],
                low: scenes[scene.fork.low]
            };
        }
    }
}

@Injectable({
    providedIn: 'root'
})
export class ScenesService {
    private firstScene: Scene;
    private characters: CharacterMap;

    constructor() {
        this.characters = storyData.characters;

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
    }

    public getFirst() {
        return this.firstScene;
    }

    public getCharacters() {
        return this.characters;
    }
}

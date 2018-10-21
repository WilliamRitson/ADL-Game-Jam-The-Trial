import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GameComponent } from './game/game.component';

const routes: Routes = [
    { path: 'play/:scene', component: GameComponent },
    {
        path: '',
        redirectTo: '/play/start',
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}

import {Route} from '@angular/router';

export const routes: Route[] = [
    {path: '', redirectTo: '/home', pathMatch: 'full'},
    {path: 'home', loadComponent: () => import('./home/home').then(m => m.Home)},
    {path: 'insert', loadComponent: () => import('./insert/insert').then(m => m.Insert)},
]
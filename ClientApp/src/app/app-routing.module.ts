import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {
    path: 'fooldal',
    loadChildren: () => import('./kozos/fooldal/fooldal.module').then(m => m.FooldalModule)
  },
  {
    path: 'regisztracio',
    loadChildren: () => import('./kozos/regisztracio/regisztracio.module').then(m => m.RegisztracioModule)
  },
  {
    path: 'belepes',
    loadChildren: () => import('./kozos/belepes/belepes.module').then(m => m.BelepesModule)
  },
  {
    path: 'foglalas-elso',
    loadChildren: () => import('./felhasznalo/foglalas/foglalas-elso/foglalas-elso.module').then(m => m.FoglalasElsoModule),
  },
  {
    path: 'foglalas-masodik',
    loadChildren: () => import('./felhasznalo/foglalas/foglalas-masodik/foglalas-masodik.module').then(m => m.FoglalasMasodikModule),
  },
  {
    path: 'foglalas-harmadik',
    loadChildren: () => import('./felhasznalo/foglalas/foglalas-harmadik/foglalas-harmadik.module').then(m => m.FoglalasHarmadikModule),
  },
  {
    path: 'foglalas-negyedik/:vedonoId', // Itt adjuk hozzá a :vedonoId paramétert
    loadChildren: () => import('./felhasznalo/foglalas/foglalas-negyedik/foglalas-negyedik.module').then(m => m.FoglalasNegyedikModule),
  },
  {
    path: 'foglalas-otodik/:id',
    loadChildren: () => import('./felhasznalo/foglalas/foglalas-otodik/foglalas-otodik.module').then(m => m.FoglalasOtodikModule)
  },
  {
    path: 'foglalasaim',
    loadChildren: () => import('./felhasznalo/foglalas/foglalasaim/foglalasaim.module').then(m => m.FoglalasaimModule),
  },
  {
    path: 'profilSz',
    loadChildren: () => import('./felhasznalo/profilSz/profilSz.module').then(m => m.ProfilSzModule),
  },
  {
    path: 'profil',
    loadChildren: () => import('./vedono/profil/profil.module').then(m => m.ProfilModule),
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./vedono/dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'foglalasok-listaja/:vedonoId',
    loadChildren: () => import('./vedono/foglalasok-listaja/foglalasok-listaja.module').then(m => m.FoglalasokListajaModule),
  },
  {
    path: 'ujgyermek',
    loadChildren: () => import('./felhasznalo/ujgyermek/ujgyermek.module').then(m => m.UjgyermekModule)
  },
  {
    path: 'naptar-kezelo',
    loadChildren: () => import('./vedono/naptar-kezelo/naptar-kezelo.module').then(m => m.NaptarKezeloModule)
  },
  {
    path: 'Idopont/:vedonoId',
    loadChildren: () => import('./vedono/Idopont/Idopont.module').then(m => m.IdopontModule)
  },
  {
    path: '',
    redirectTo: '/fooldal',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/not-found'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

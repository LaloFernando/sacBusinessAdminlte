import { AuthRoutingModule } from './auth/auth-routing.module';

import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { PagesRoutingModule } from './pages/pages-routing.module';

const routes: Routes = [
  // {path: '',redirectTo: '/login',pathMatch: 'full'},
  // {path:'**', component: NopageFoundComponent}
  {path: 'login',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes
    //, {
    //   enableTracing: true, // <-- debugging purposes only
    //   preloadingStrategy: PreloadAllModules
    // }
    ),
    PagesRoutingModule,
    AuthRoutingModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

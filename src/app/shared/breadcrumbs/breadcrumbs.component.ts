import { ActivationEnd, Router } from '@angular/router';
import { Component } from '@angular/core';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: [
  ]
})
export class BreadcrumbsComponent {

  public titulo: string | undefined;
  constructor(private router:Router) { 
    
    this.getArgumentos();

  }

  getArgumentos(){

    this.router.events
     .pipe(
        filter((event): event is ActivationEnd => event instanceof ActivationEnd),
        filter((event: ActivationEnd) => event.snapshot.firstChild === null),
        map((event: ActivationEnd) => event.snapshot.data)
      )
      .subscribe(({ titulo }) => {
        this.titulo = titulo;
        document.title = `Newsystem - ${titulo}`;
      })
  
  }

}


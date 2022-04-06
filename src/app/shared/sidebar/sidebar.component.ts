import { Router } from '@angular/router';
import { SidebarService } from './../../services/sidebar.service';
import { Component, OnInit } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit {
  user = localStorage.getItem('user');
  menuItems: any[];
  constructor(private sidebarService: SidebarService, private router: Router) {
    this.menuItems = sidebarService.menu;
   }

  ngOnInit(): void {
    $('[data-widget="treeview"]').Treeview('init');
  }

  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('serievta');
    localStorage.removeItem('nombreUs');

    this.router.navigateByUrl('/login');
  }

}

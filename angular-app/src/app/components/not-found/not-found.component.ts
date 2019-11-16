import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent implements OnInit {
  currentUrl: string;

  constructor(
    private router: Router,
    private titleService: Title
    ) { }

  ngOnInit() {
    this.currentUrl = this.router.url;
    this.titleService.setTitle('IPA - 404 error');
  }

}

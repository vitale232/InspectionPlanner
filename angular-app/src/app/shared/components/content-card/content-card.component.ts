import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-content-card',
  templateUrl: './content-card.component.html',
  styleUrls: ['./content-card.component.scss']
})
export class ContentCardComponent implements OnInit {

  @Input() avatarImgSrc: string;
  @Input() title: string;
  @Input() subtitle: string;
  @Input() imgSrc: string;
  @Input() paragraph: string;
  @Input() buttonText: string;
  @Input() link: string;

  constructor( private router: Router ) { }

  ngOnInit() {
  }

  onClick(): void {
    this.router.navigate([this.link], { queryParamsHandling: 'merge' });
  }

}

import { Component, OnInit } from '@angular/core';

import Swiper from 'swiper';
import { RequestService } from '../../core';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styles: [],
})
export class WelcomeComponent implements OnInit {
  lastUpdate: any;

  swiperItems = [
    {
      title: 'Featured',
      description:
        'Elevate your Lethal Company experience with handpicked mods, offering everything from unique monsters to customizable music, suits and more.',
      link: '/featured',
      background: 'assets/img/lethaliize/swiper/featured.webp',
    },
    {
      title: 'Customize with Mods',
      description:
        'Elevate your gameplay by exploring our diverse selection of Mods, each designed to bring new dimensions to your Lethal Company experience.',

      link: '/mods',
      background: 'assets/img/lethaliize/swiper/mods.webp',
    },
    {
      title: 'Modpacks await',
      description:
        'Uncover a world of possibilities with our Modpacks, each offering a unique blend of challenges and adventures in Lethal Company.',
      link: '/modpacks',
      background: 'assets/img/lethaliize/swiper/modpacks.webp',
    },
  ];
  swiperGradient = '89, 20, 20';
  swiperBG = `linear-gradient(180deg, rgba(${this.swiperGradient}, 0) 0%, rgba(${this.swiperGradient}, 0.8) 75%, rgba(${this.swiperGradient}, 0.9) 100%)`;

  constructor(private request: RequestService) {}

  ngOnInit(): void {
    // Get our last github release note for the banner
    this.request
      .get<any[]>(this.request.preset_urls.github_releases)
      .subscribe({
        next: (r: any[]) => (this.lastUpdate = r.at(0)),
        error: (e) => this.request.error(e),
      });

    // Register our swiper container
    const swiper = new Swiper('.swiper', {
      autoplay: {
        delay: 5000,
      },
      slidesPerView: 1,
      spaceBetween: 24,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      breakpoints: {
        '560': {
          slidesPerView: 2,
        },
        '960': {
          slidesPerView: 3,
        },
      },
    });
  }
}

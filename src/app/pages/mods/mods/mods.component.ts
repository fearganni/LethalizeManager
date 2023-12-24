import { Component, OnInit } from '@angular/core';

import { ModInfo, RequestService, ThunderstoreService } from '../../../core';
import { FormBuilder, FormGroup } from '@angular/forms';

interface SearchForm {
  nsfw_enabled: boolean;
  category: string;
  keyword_term: string;
}

interface Categories {
  category: string;
  value: string;
  count: number;
}

@Component({
  selector: 'app-mods',
  templateUrl: './mods.component.html',
  styles: [],
})
export class ModsComponent implements OnInit {
  form: FormGroup;

  mods: ModInfo[] = [];

  // Filtered
  temp: ModInfo[] = [];
  categories: Categories[] = [];

  // pagination
  page = 1;
  pageSize = 50;

  constructor(
    private formBuilder: FormBuilder,
    private request: RequestService,

    private thunderstoreService: ThunderstoreService
  ) {
    this.form = this.formBuilder.group({
      nsfw_enabled: [true],
      category: [''],
      keyword_term: [''],
    });
  }

  ngOnInit(): void {
    this.thunderstoreService.ThunderstoreData.subscribe({
      next: (r) => {
        console.log(r);

        // Only show (non-depreciated) results
        this.mods = r.filter((item: ModInfo) => !item.is_deprecated);

        // Make sure we show pinned items first
        this.temp = this.mods.sort((a, b) => {
          if (a.is_pinned && !b.is_pinned) {
            return -1;
          }

          if (!a.is_pinned && b.is_pinned) {
            return 1;
          }

          return 0;
        });

        // Create our category listings
        this.categoryFiltering(this.temp);
      },
    });

    this.form.valueChanges.pipe().subscribe({
      next: () => {
        const form: SearchForm = this.form.value;

        // Get variables
        const nsfw_enabled = form.nsfw_enabled;
        const categoryValue = form.category;
        const term = new RegExp(form.keyword_term, 'gi');

        // Only create a RegExp for category if categoryValue is not an empty string
        const category = categoryValue ? new RegExp(categoryValue, 'gi') : null;

        this.temp = this.mods
          .filter((item) => {
            // Check if the item's name matches the term
            const nameMatches = term.test(item.name);

            // If category is an empty string, include all items, otherwise check the category
            const categoryMatches = category
              ? item.categories.some((cat: string) => category.test(cat))
              : true;

            return nameMatches && categoryMatches;
          })
          .sort((a, b) => {
            if (a.is_pinned && !b.is_pinned) {
              return -1;
            }

            if (!a.is_pinned && b.is_pinned) {
              return 1;
            }

            return 0;
          });

        this.categoryFiltering(this.temp);
      },
    });
  }

  categoryFiltering(mods: ModInfo[]): void {
    const category_mapping = mods.reduce((map, item) => {
      item.categories.forEach((category: string) => {
        if (map.has(category)) {
          map.set(category, (map.get(category) as number) + 1);
        } else {
          map.set(category, 1);
        }
      });

      return map;
    }, new Map<string, number>());

    this.categories = Array.from(category_mapping, ([category, count]) => ({
      category,
      value: category,
      count,
    }));

    this.categories.unshift({
      category: 'All',
      value: '',
      count: mods.length,
    });
  }

  pageChange(event: any) {
    console.log(event);
  }

  statisticFormat(n: number): string {
    return new Intl.NumberFormat('en-GB', {
      notation: 'compact',
      compactDisplay: 'short',
    })
      .format(n)
      .replace('T', 'K');
  }
}

import { Component, OnInit } from '@angular/core';

import { RequestService } from '../../core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-mod',
  templateUrl: './mod.component.html',
  styles: [],
})
export class ModComponent implements OnInit {
  form: UntypedFormGroup;

  mods: any[] = [];

  // Filtered
  temp: any[] = [];
  categories: any[] = [];

  // pagination
  page: number = 1;
  pageSize: number = 50;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private request: RequestService
  ) {
    this.form = this.formBuilder.group({
      nsfw_enabled: [true],
      category: [''],
      keyword_term: [''],
    });
  }

  ngOnInit(): void {
    this.request
      .get<any[]>(this.request.preset_urls.thunderstore_api)
      .subscribe({
        next: (r: any[]) => {
          // Only show (non-depreciated) results
          this.mods = r.filter((item) => !item.is_deprecated);

          // Make sure we show pinned items first
          this.temp = this.mods.sort((a, b) => {
            if (a.is_pinned && !b.is_pinned) {
              return -1;
            }

            if (!a.is_pinned && b.pinned) {
              return 1;
            }

            return 0;
          });

          // Create our category listings
          this.categoryFiltering(this.temp);
        },
        error: (e) => this.request.error(e),
      });

    this.form.valueChanges.pipe().subscribe({
      next: (v) => {
        const nsfw_enabled = this.form.get('nsfw_enabled')?.value as Boolean;
        const categoryValue = this.form.get('category')?.value;
        const term = new RegExp(this.form.get('keyword_term')?.value, 'gi');

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

            if (!a.is_pinned && b.pinned) {
              return 1;
            }

            return 0;
          });

        this.categoryFiltering(this.temp);
      },
    });
  }

  categoryFiltering(mods: any[]): void {
    const category_mapping = mods.reduce((map, item) => {
      item.categories.forEach((category: string) => {
        if (map.has(category)) {
          map.set(category, map.get(category) + 1);
        } else {
          map.set(category, 1);
        }
      });

      return map;
    }, new Map());

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

import { Component, OnInit, Input } from '@angular/core';
import { orderedElems } from 'src/assets/orderedElems';
import { Element } from 'src/periodic-interfaces';

@Component({
  selector: 'app-periodic-table',
  templateUrl: './periodic-table.component.html',
  styleUrls: ['./periodic-table.component.css'],
})
export class PeriodicTableComponent implements OnInit {
  elements = orderedElems;

  @Input() badCategories: string[] = [];
  @Input() answer!: Element;
  @Input() hasCorrCat: boolean = false;
  @Input() tooLowHigh: number[] = [0, 200];

  constructor() {}

  ngOnInit(): void {}

  isBad(elem: Element) {
    if (elem.category === this.answer.category) {
      const [low, high] = this.tooLowHigh;
      return elem.number <= low || elem.number >= high;
    }
    if (this.hasCorrCat) return elem.category !== this.answer.category;
    if (this.badCategories.includes(elem.category)) return true;
    return false;
  }

  /*
  ngOnInit(): void {
    let res = [];
    for (const sym of symbols) {
      if (sym in elements) {
        res.push(elements[sym]);
      } else {
        res.push(this.emptyElem);
      }
    }
    console.log(res);
  }
  
  ngAfterViewInit() {
    let res = [];
    let ul = document.getElementById('periodic-table');
    let items = ul?.getElementsByTagName('li') || [];
    for (let i = 0; i < items.length; ++i) {
      const liElem = items[i];
      let abbrs = liElem.getElementsByTagName('abbr') || [];
      let abbr = abbrs[0];
      res.push(abbr.innerHTML);
    }
    console.log(res);
  }*/
}

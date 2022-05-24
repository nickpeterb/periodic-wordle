import { Component, OnInit, Input } from '@angular/core';
import { colors } from 'src/assets/elements';
import { orderedElems } from 'src/assets/orderedElems';
import { PeriodicElement } from 'src/periodic-interfaces';

@Component({
  selector: 'app-periodic-table',
  templateUrl: './periodic-table.component.html',
  styleUrls: ['./periodic-table.component.css'],
})
export class PeriodicTableComponent implements OnInit {
  elements = orderedElems;

  @Input() badCategories: string[] = [];
  @Input() answer!: PeriodicElement;
  @Input() tooLowHigh: number[] = [0, 200];

  constructor() {}

  ngOnInit(): void {}

  color(category: string): string {
    return colors[category];
  }

  isBad(elem: PeriodicElement) {
    if (this.badCategories.includes(elem.category)) return true;
    const [low, high] = this.tooLowHigh;
    return elem.number <= low || elem.number >= high;
  }

  /*

   /*  let res = [];
    for (const key in elementsObj) {
      res.push(elementsObj[key]);
    }
    for (let i = 0; i < 10; i++) {
      res.push({
        mass: -1,
        category: '',
        name: '_',
        number: -1,
        color: '#242424',
      });
    }
    console.log(res);

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

import { Component, OnInit } from '@angular/core';
import { orderedElems } from 'src/assets/orderedElems';

@Component({
  selector: 'app-periodic-table',
  templateUrl: './periodic-table.component.html',
  styleUrls: ['./periodic-table.component.css'],
})
export class PeriodicTableComponent implements OnInit {
  elements = orderedElems;

  constructor() {}

  ngOnInit(): void {}

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

import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'periodic-wordle';
  showPeriodicTable: boolean = false;
  showWhatsNew: boolean;

  constructor() {
    this.showWhatsNew = this.showWhatsNewDialog();
  }

  ngOnInit() {}

  toggleTable(): void {
    this.showPeriodicTable = !this.showPeriodicTable;
  }

  hideWhatsNew(): void {
    this.showWhatsNew = false;
    localStorage.setItem('whatsnew', '');
  }

  showWhatsNewDialog(): boolean {
    return localStorage.getItem('whatsnew') === null;
  }
}

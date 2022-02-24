import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { elements } from 'src/assets/elements';
import { PeriodicTable } from 'src/assets/PeriodicTable';
import { symbols } from 'src/assets/symbols';
import { Element } from 'src/periodic-interfaces';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  inputFormControl = new FormControl('', [Validators.required]);
  answer: Element;
  result: string = '';
  success: boolean = false;

  constructor() {
    this.answer = this.getRandomElement();
  }

  ngOnInit(): void {}

  guess() {
    const input = this.inputFormControl.value;
    const resSymbol = input.charAt(0).toUpperCase() + input.slice(1);
    const resElem = elements[resSymbol];
    if (resSymbol in elements) {
      if (resSymbol === this.answer.symbol) {
        this.result = 'You got it!';
        this.success = true;
      } else {
        const answerMass: number = Math.round(this.answer.mass);
        const resMass: number = Math.round(resElem.mass);
        let massText = '';
        if (answerMass === resMass) massText = 'Correct';
        else if (answerMass < resMass) massText = 'Lower';
        else massText = 'Higher';

        let catText = '';
        if (this.answer.category === resElem.category) catText = 'Correct';
        else catText = 'Wrong';

        this.result = `${massText} Mass, ${catText} Category`;
      }
    } else {
      this.result = 'Invalid Input';
    }
  }

  tryAgain() {
    window.location.href = '/';
  }

  getRandomElement(): Element {
    const index = Math.floor(Math.random() * (symbols.length - 1));
    const symbol = symbols[index];
    const elem = elements[symbol];
    return { symbol, ...elem };
  }
}

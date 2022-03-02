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
  isDone: boolean = false;
  guessesLeft: number = 6;
  guesses: string[] = [];

  constructor() {
    this.answer = this.getRandomElement();
    console.log('answer', this.answer.symbol);
  }

  ngOnInit(): void {}

  guess() {
    const input = this.inputFormControl.value;
    const guessSym = input.charAt(0).toUpperCase() + input.slice(1);
    const guessElem = elements[guessSym];

    if (!(guessSym in elements)) {
      this.result = 'Invalid input';
      return null;
    }

    this.guessesLeft -= 1;
    if (this.guessesLeft === 0) {
      this.result = 'Sorry, you ran you of guesses!';
      this.isDone = true;
      return null;
    }
    if (guessSym === this.answer.symbol) {
      this.result = 'You got it!';
      this.isDone = true;
    } else {
      this.guesses.push(guessSym);
      const answerMass: number = Math.round(this.answer.mass);
      const resMass: number = Math.round(guessElem.mass);
      let massText = '';
      if (answerMass === resMass) massText = 'Correct';
      else if (answerMass < resMass) massText = 'Lower';
      else massText = 'Higher';

      let catText = '';
      if (this.answer.category === guessElem.category) catText = 'Correct';
      else catText = 'Wrong';

      this.result = `${massText} Mass, ${catText} Category`;
    }
    return null;
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

  inputClass(num: number) {
    return `input-${num}`;
  }

  formatGuessedElems() {}
}

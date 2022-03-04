import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { elements } from 'src/assets/elements';
//import { PeriodicTable } from 'src/assets/PeriodicTable';
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
  totalGuesses: number = 10;
  guessesLeft: number = this.totalGuesses;
  guesses: Element[] = [];
  suggestedElem: Element | null = null;
  inputElemId = document.getElementById('elem-input');

  constructor() {
    this.answer = this.getRandomElement();
    console.log('answer', this.answer.symbol);
  }

  ngOnInit(): void {
    this.suggestedElem = {
      name: 'Start typing...',
      mass: -1,
      category: '',
      number: -1,
    };
    //document.getElementById('elem-input')?.click();
    this.inputElemId?.addEventListener('click', () => {
      this.inputElemId?.focus();
    });
    this.focusInput();
  }

  ngOnDestroy() {
    this.inputElemId?.removeEventListener('click', () => {
      this.inputElemId?.focus();
    });
  }

  guess(e?: Event) {
    if (e) e.preventDefault();
    const input: string = this.inputFormControl.value;
    const guessSym =
      input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
    const guessElem = elements[guessSym];

    if (!(guessSym in elements)) {
      this.result = 'Invalid input';
      return null;
    }

    this.guesses.push(guessElem);
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
      const answerMass: number = this.answer.number;
      const guessMass: number = guessElem.number;

      // Set Mass
      let massText = '';
      if (answerMass === guessMass) massText = 'Correct';
      massText = answerMass > guessMass ? 'Too Low' : 'Too High';

      // Set Category
      let catText = '';
      if (this.answer.category === guessElem.category) catText = 'Correct';
      else catText = 'Wrong';

      this.result = `Number is ${massText}, ${catText} Category`;
    }
    this.inputFormControl.setValue('');
    this.focusInput();
    return null;
  }

  onChange(input: string) {
    const sym = input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
    if (sym in elements) this.suggestedElem = elements[sym];
    else if (input === '')
      this.suggestedElem = {
        name: 'Start typing...',
        mass: -1,
        category: '',
        number: -1,
      };
    else
      this.suggestedElem = {
        name: 'Not an element',
        mass: -1,
        category: '',
        number: -1,
      };
  }

  tryAgain() {
    window.location.href = '/';
  }

  getRandomElement(): Element {
    const symbols = Object.keys(elements);
    const index = Math.floor(Math.random() * (symbols.length - 1));
    const symbol = symbols[index];
    const elem = elements[symbol];
    return { symbol, ...elem };
  }

  inputClass(num: number) {
    return `input-${num}`;
  }

  focusInput() {
    document.getElementById('elem-input')?.focus();
  }

  /*formatGuessedElem(index: number): string {
    const sym = this.guesses[index];
    if (sym === undefined) return '';
    return sym;
    const elem = elements[sym];
    const lowHigh = this.answer.mass > elem.mass ? 'Low' : 'High';
    const category =
      this.answer.category === elem.category ? 'Correct' : 'Wrong';
    return `${sym}: Mass (${elem.mass}) Is Too ${lowHigh}; Category (${elem.category}) is ${category}`;
  }*/
}
/*let res: { [key: string]: Element } = {};
    for (const key in PeriodicTable) {
      const elem = PeriodicTable[key];
      const colorkey = elem.category.replace(/\s/g, '');
      const color = this.colors[colorkey];
      if (!elem.category.includes('unknown'))
        res[elem.symbol] = {
          mass: Math.round(elem.atomic_mass * 100) / 100,
          number: elem.number,
          symbol: elem.symbol,
          name: elem.name,
          category: elem.category,
          color,
        };
    }
    console.log(res);*/

/*


  colors: any = {
    diatomicnonmetal: '#2196F3',
    noblegas: '#78909C',
    alkalimetal: '#F44336',
    alkalineearthmetal: '#F44336',
    metalloid: '#FFC107',
    polyatomicnonmetal: '#009688',
    post-transitionmetal: '#E91E63',
    transitionmetal: '#673AB7',
    lanthanide: '#8D6E63',
    actinide: '#3F51B5',
  };

colors: any = {
    diatomicnonmetal: '#2196F3',
    noblegas: '#78909C',
    alkalimetal: '#F44336',
    alkalineearthmetal: '#F44336',
    metalloid: '#FFC107',
    polyatomicnonmetal: '#009688',
    posttransitionmetal: '#E91E63',
    transitionmetal: '#673AB7',
    lanthanide: '#8D6E63',
    actinide: '#3F51B5',
  };

  */

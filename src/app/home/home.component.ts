import { Component, OnInit, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { colors, elements } from 'src/assets/elements';
import { environment } from 'src/environments/environment';
import { PeriodicElement } from 'src/periodic-interfaces';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  inputFormControl = new FormControl('', [Validators.required]);
  answer: PeriodicElement;
  result: string = '';
  isDone: boolean = false;
  totalGuesses: number = 5;
  guessesLeft: number = this.totalGuesses;
  guesses: PeriodicElement[] = [];
  suggestedElem: PeriodicElement | null = null;
  @Input() showPeriodicTable: boolean = false;

  badCategories: string[] = [];
  hasCorrCat: boolean = false;
  tooLowHigh: number[] = [0, 200];

  invalidElem = {
    mass: -1,
    category: '',
    number: -1,
    display_cat: '',
  };

  constructor() {
    this.answer = this.getRandomElement();
  }

  ngOnInit(): void {
    this.setStartSuggestion();
    if (!environment.production) console.log('answer', this.answer.symbol);
  }

  color(category: string): string {
    return colors[category];
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
      this.result = 'Sorry, the answer was';
      this.suggestedElem = this.answer;
      this.inputFormControl.setValue(this.answer.symbol);
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
      let massText = answerMass > guessMass ? 'Too Low' : 'Too High';

      // Set Category
      let catText = '';
      if (this.answer.category === guessElem.category) {
        catText = 'Correct';
        this.hasCorrCat = true;
        answerMass > guessMass
          ? (this.tooLowHigh[0] = guessMass)
          : (this.tooLowHigh[1] = guessMass);
      } else {
        catText = 'Wrong';
        this.badCategories.push(guessElem.category);
      }

      this.result = `Number is ${massText}, ${catText} Category`;

      this.inputFormControl.setValue('');
      this.focusInput();
    }
    return null;
  }

  onChange(input: string) {
    const sym = input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
    if (sym in elements) this.suggestedElem = elements[sym];
    else if (input === '')
      this.suggestedElem = {
        name: 'Start typing...',
        ...this.invalidElem,
      };
    else
      this.suggestedElem = {
        name: 'Not an element',
        ...this.invalidElem,
      };
  }

  setTypingSuggestion() {
    this.suggestedElem = {
      name: 'Start typing...',
      ...this.invalidElem,
    };
    this.onChange(this.inputFormControl.value);
  }

  setStartSuggestion() {
    this.suggestedElem = {
      name: 'Click here to enter element',
      ...this.invalidElem,
    };
  }

  tryAgain() {
    window.location.href = '/';
  }

  getRandomElement(): PeriodicElement {
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

/* let res: { [key: string]: Element } = {};
    for (const key in elements) {
      const elem = elements[key];
      const colorkey = elem.category.replace(/\s/g, '');
      const color = this.colors[colorkey];
      res[key] = { ...elem, color };
    }
    console.log(res); */

/*

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

  let res: { [key: string]: Element } = {};
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
    console.log(res);

    Most recent::
     let res: { [key: string]: PeriodicElement } = {};
    for (const key in PeriodicTable) {
      const elem = PeriodicTable[key];
      const catkey = elem.category.replace(/\s/g, '').replace('-', '');
      if (!elem.category.includes('unknown'))
        res[elem.symbol] = {
          mass: Math.round(elem.atomic_mass * 100) / 100,
          number: elem.number,
          symbol: elem.symbol,
          name: elem.name,
          category: this.cats[catkey],
          display_cat: elem.category,
        };
    }
    console.log(res); 

    cats: any = {
    diatomicnonmetal: 'nonmetal',
    noblegas: 'polyatomicnonmetal',
    alkalimetal: 'alkalai',
    alkalineearthmetal: 'alkalai',
    metalloid: 'metal',
    polyatomicnonmetal: 'nonmetal',
    posttransitionmetal: 'metal',
    transitionmetal: 'transitionmetal',
    lanthanide: 'nide',
    actinide: 'nide',
  };

  */

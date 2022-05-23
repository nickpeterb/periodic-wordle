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
  msg: string = '';
  isDone: boolean = false;
  totalGuesses: number = 5;
  guessesLeft: number = this.totalGuesses;
  guesses: PeriodicElement[] = [];
  suggestedElem: PeriodicElement | null = null;
  @Input() showPeriodicTable: boolean = false;

  badCategories: string[] = [];
  hasCorrCat: boolean = false;
  tooLowHigh: number[] = [0, 200]; // 200 is an arbitrary high number

  emptyElem = {
    mass: -1,
    category: '',
    number: -1,
    display_cat: '',
  };

  constructor() {
    this.answer = this.getTodaysElement();
  }

  ngOnInit(): void {
    this.setStartSuggestion();
    const hasPlayed = localStorage.getItem('played');
    const hasState = localStorage.getItem('state');
    if (hasState !== null) this.restoreState();
    if (hasPlayed !== null) {
      const lastPlayed = parseInt(hasPlayed);
      const datePlayed = new Date(lastPlayed).toLocaleDateString('en-GB');
      const today = new Date().toLocaleDateString('en-GB');
      if (datePlayed === today) {
        this.suggestedElem = this.answer;
        this.inputFormControl.setValue(this.answer.symbol);
      } else {
        localStorage.removeItem('played');
        this.clearState();
      }
    }
    if (!environment.production) console.log('answer', this.answer.symbol);
  }

  color(category: string): string {
    return colors[category];
  }

  updateState(): void {
    const state = {
      guesses: this.guesses,
      badCategories: this.badCategories,
      hasCorrCat: this.hasCorrCat,
      tooLowHigh: this.tooLowHigh,
      guessesLeft: this.guessesLeft,
      isDone: this.isDone,
      msg: this.msg,
    };
    localStorage.setItem('state', JSON.stringify(state));
  }

  clearState(): void {
    localStorage.removeItem('state');
  }

  restoreState(): void {
    const local = localStorage.getItem('state');
    if (local !== null) {
      const state = JSON.parse(local);
      this.guesses = state.guesses;
      this.badCategories = state.badCategories;
      this.hasCorrCat = state.hasCorrCat;
      this.tooLowHigh = state.tooLowHigh;
      this.guessesLeft = state.guessesLeft;
      this.isDone = state.isDone;
      this.msg = state.msg;
    }
  }

  guess(e?: Event) {
    if (e) e.preventDefault();
    const input: string = this.inputFormControl.value;
    console.log(input);
    const guessSym =
      input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
    const guessElem = elements[guessSym];
    if (!(guessSym in elements)) {
      this.msg = 'Invalid input';
      return null;
    }

    this.guesses.push(guessElem);
    this.guessesLeft -= 1;

    if (this.guessesLeft === 0 && guessSym !== this.answer.symbol) {
      this.msg = 'Sorry, the answer was';
      this.suggestedElem = this.answer;
      this.inputFormControl.setValue(this.answer.symbol);
      this.endGame();
      return null;
    }
    if (guessSym === this.answer.symbol) {
      this.msg = 'You got it!';
      this.endGame();
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

      this.msg = `Number is ${massText}, ${catText} Category`;

      this.updateState();
      this.inputFormControl.setValue('');
      this.focusInput();
    }
    return null;
  }

  endGame() {
    this.isDone = true;
    const now = new Date().getTime().toString();
    localStorage.setItem('played', now);
    this.updateState();
  }

  onChange(input: string) {
    const sym = input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
    if (sym in elements) this.suggestedElem = elements[sym];
    else if (input === '')
      this.suggestedElem = {
        name: 'Start typing...',
        ...this.emptyElem,
      };
    else
      this.suggestedElem = {
        name: 'Not an element',
        ...this.emptyElem,
      };
  }

  setTypingSuggestion() {
    this.suggestedElem = {
      name: 'Start typing...',
      ...this.emptyElem,
    };
    this.onChange(this.inputFormControl.value);
  }

  setStartSuggestion() {
    this.suggestedElem = {
      name: 'Click here to enter element',
      ...this.emptyElem,
    };
  }

  getTodaysElement(): PeriodicElement {
    const epoch = new Date(2022, 0);
    const start = new Date(epoch);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let index = 0;
    while (start < today) {
      index++;
      start.setDate(start.getDate() + 1);
    }

    const symbols = Object.keys(elements);
    const symbol = symbols[index % symbols.length];
    const elem = elements[symbol];
    return elem;
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

import { Service, Inject } from 'typedi';

@Service()
export class InputStore {
  inputValue = ''
  constructor() {

  }

  onInput(e: Event) {
    // this.inputValue += val

    console.log('%celelee test:', 'color:#fff;background:#ff0', this.inputValue, e)
    
  }
}
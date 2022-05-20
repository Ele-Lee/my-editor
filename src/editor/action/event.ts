import { Service, Inject } from 'typedi';
import { InputStore } from '../store/input';
import { DomAction } from './dom';
import { EditAction } from './edit';

// intercept default keyboard event
const spaceKeyCode = 32;
const enterKeyCode = 13;
const backspaceKeyCode = 8;

@Service()
export class EventAction {
  @Inject()
  domAction!: DomAction;
  @Inject()
  editAction!: EditAction;
  @Inject()
  inputStore!: InputStore;

  bindKeyboardEvent(editingDom: HTMLElement) {
    if (!editingDom) return;

    editingDom?.addEventListener('keydown', this.onKeydownHandler.bind(this));
    editingDom?.addEventListener('keypress', this.onKeypressHandler.bind(this));
  }

  onKeydownHandler(e: KeyboardEvent) {
    const keyCode = e.keyCode;

    console.log('%celelee test:', 'color:#fff;background:#000', e)
    
    this.inputStore.onInput(e)

    if (![spaceKeyCode, enterKeyCode].includes(keyCode)) {
      return;
    }

    const selection = window.getSelection && window.getSelection();
    if (!selection || selection.rangeCount < 1) {
      return
    }
    const range = selection.getRangeAt(0).cloneRange();

    
    this.editAction.parseText(range, e.key);
    if (spaceKeyCode === keyCode) {
      e.preventDefault();
    }
  }

  onKeypressHandler(e: KeyboardEvent) {
    if (!getSelection()) {
      return
    }
    const selection = window.getSelection && window.getSelection();
    if (!selection || selection.rangeCount < 1) {
      return
    }

    const range = selection.getRangeAt(0).cloneRange();
    const keyCode = e.keyCode;
    switch (keyCode) {
      case enterKeyCode: {
        e.preventDefault();
        const curInputtingDom = this.domAction.getCurDomByRange(range);

        if (this.domAction.verifyIsInParentScope(curInputtingDom)) {
          if (!range.startContainer.nodeValue) {
            curInputtingDom.remove();
            this.domAction.addNewLineInCurScope(range);
          } else {
            const sameTypeElement = curInputtingDom.cloneNode() as HTMLElement;
            curInputtingDom.parentElement?.appendChild(sameTypeElement);
            this.domAction.setStartRangeByDom(sameTypeElement);
          }
        } else {
          this.domAction.addNewLineInCurScope(range);
        }

        break;
      }
      case backspaceKeyCode: {
        console.log('%celelee test:', 'color:#fff;background:#000', 11)

        break;
      }

      default:
        break;
    }
  }
}

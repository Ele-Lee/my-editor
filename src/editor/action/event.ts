import { Service, Inject } from 'typedi';
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

  bindKeyboardEvent(editingDom: HTMLElement) {
    if (!editingDom) return;

    editingDom?.addEventListener('keyup', this.onKeyupHandler.bind(this));
    editingDom?.addEventListener('keypress', this.onKeypressHandler.bind(this));
  }

  onKeyupHandler(e: KeyboardEvent) {
    const keyCode = e.keyCode;
    if (![spaceKeyCode, enterKeyCode, keyCode].includes(keyCode)) {
      return;
    }

    const range = getSelection()?.getRangeAt(0).cloneRange();
    if (!range) {
      return;
    }

    this.editAction.parseText(range);
  }

  onKeypressHandler(e: KeyboardEvent) {
    const range = getSelection()?.getRangeAt(0).cloneRange();
    if (!range) {
      return;
    }
    const keyCode = e.keyCode;
    if (keyCode === enterKeyCode) {
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
    }
  }
}

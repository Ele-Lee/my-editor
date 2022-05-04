import {
  getCurDomByRange,
  replaceDom,
  insertAfter,
  makeNewDefaultLineDom,
} from './dom';
import { debounce } from './utils';
import markTagAdapterMap from './parse';
import { defaultPlaceholder } from './constant';

class QCMark {
  editDom?: HTMLElement;
  constructor(containerDomParam: HTMLElement | string) {
    this.setStartRange(
      this.initEditContainer(this.setContainerDom(containerDomParam))
    );

    this.bindKeyupEvent();
  }

  setContainerDom(containerDomParam: HTMLElement | string) {
    let containerDom: HTMLElement;
    if (typeof containerDomParam === 'string') {
      const containerDomTmp = document.querySelector<HTMLElement>(
        containerDomParam
      );
      if (containerDomTmp) {
        containerDom = containerDomTmp;
      } else {
        throw '找不到dom';
      }
    } else {
      containerDom = containerDomParam;
    }
    return containerDom;
  }

  initEditContainer(containerDom: HTMLElement) {
    if (containerDom.children.length) {
      return containerDom;
    }
    document.execCommand('defaultParagraphSeparator', false, 'p');

    const element = document.createElement('pre');
    element.className = 'qc-mark';
    // element.setAttribute("placeholder", vditor.options.placeholder);
    element.setAttribute('contenteditable', 'true');
    element.setAttribute('spellcheck', 'false');
    element.style = 'height: 400px; border: 1px solid red; outline: none;';
    containerDom.appendChild(element);

    this.insertDefaultTextTag(element);
    // const firstLine = this.insertDefaultTextTag(element);

    this.editDom = element;
    return element;
  }

  insertDefaultTextTag(parent: HTMLElement, needSetSelection?: boolean) {
    const defaultTextTag = makeNewDefaultLineDom();
    parent.appendChild(defaultTextTag);

    if (needSetSelection) {
      this.setStartRange(defaultTextTag);
    }

    return defaultTextTag;
  }

  bindKeyupEvent() {
    let parseLock = false;

    const spaceKeyCode = 32;
    const enterKeyCode = 13;
    const backspaceKeyCode = 8;

    const onKeyupHandler = (e: KeyboardEvent) => {
      if (e.keyCode === backspaceKeyCode) {
        e.preventDefault();
      }
      const keyCode = e.keyCode;
      if (![spaceKeyCode, enterKeyCode, keyCode].includes(keyCode)) {
        return;
      }

      const range = getSelection()?.getRangeAt(0).cloneRange();
      if (!range) {
        return;
      }
      if (keyCode === backspaceKeyCode) {
        const curInputtingDom = getCurDomByRange(range);
        if (curInputtingDom.attributes.getNamedItem('data-parent')) {
          // this._addNewLine(range);
          console.log('%celelee test:', 'background:#000;color:#fff', 12);
          e.preventDefault();
          // curInputtingDom.remove();
        }
      } else {
        this._parseText(range);
      }
    };

    const onKeypressHandler = (e: KeyboardEvent) => {
      console.log('%celelee test:', 'background:#000;color:#1ff', e.keyCode);
      const range = getSelection()?.getRangeAt(0).cloneRange();
      if (!range) {
        return;
      }
      const keyCode = e.keyCode;
      if (keyCode === enterKeyCode) {
        e.preventDefault();
        const curInputtingDom = getCurDomByRange(range);

        if (curInputtingDom.attributes.getNamedItem('data-parent')) {
          if (curInputtingDom.parentElement) {
            this.insertDefaultTextTag(curInputtingDom.parentElement, true);
          }
        } else {
          this._addNewLine(range);
        }
      }
    };

    this.editDom?.addEventListener('keyup', onKeyupHandler);
    this.editDom?.addEventListener('keypress', onKeypressHandler);
    this.editDom?.addEventListener('keydown', e => {});
  }

  setStartRange(targetDom: HTMLElement) {
    const range = document.createRange();
    range.setStart(targetDom, 0);
    range.collapse(true);

    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }

  private _addNewLine(range: Range) {
    const newLineTag = makeNewDefaultLineDom();
    insertAfter(newLineTag, getCurDomByRange(range));
    this.setStartRange(newLineTag);
  }

  private _parseText(range: Range) {
    const curDomNodeValue = range.startContainer.nodeValue;

    if (!curDomNodeValue) {
      return;
    }
    const filstSpaceIndex = curDomNodeValue.indexOf(' ');
    const markTagType = curDomNodeValue.substring(0, filstSpaceIndex)!;

    if (!markTagAdapterMap[markTagType]) {
      return;
    }
    const curInputtingDom = getCurDomByRange(range);

    const htmlTag = markTagAdapterMap[markTagType].toDom({
      innerHTML:
        curDomNodeValue.substring(filstSpaceIndex + 1) || defaultPlaceholder,
      setRange: this.setStartRange,
    });

    replaceDom(curInputtingDom, htmlTag);
  }
}

export default QCMark;

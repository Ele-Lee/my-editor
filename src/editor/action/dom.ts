import { css } from '@emotion/css';
import { Service, Inject } from 'typedi';
import { InputStore } from '../store/input';

import { getDomByStringOrEle, insertAfter, replaceDom } from '../utils/dom';

const PARENT_ATTR_KEY = 'data-parent';
const CHILD_ATTR_KEY = 'data-child';

@Service()
export class DomAction {
  @Inject()
  inputStore!: InputStore;

  initEditContainer(dom: HTMLElement | string) {
    const containerDom = getDomByStringOrEle(dom);

    if (containerDom.children.length) {
      return containerDom;
    }
    document.execCommand('defaultParagraphSeparator', false, 'p');

    const element = document.createElement('pre');
    element.className = 'qc-down';
    // element.setAttribute("placeholder", vditor.options.placeholder);
    element.setAttribute('contenteditable', 'true');
    element.setAttribute('spellcheck', 'false');
    const getClassName = css`
      height: 400px;
      border: 1px solid red;
      outline: none;
    `;
    element.setAttribute('class', getClassName);

    containerDom.appendChild(element);

    const defaultTextTag = this.makeNewDefaultLineDom();
    element.appendChild(defaultTextTag);
    element.addEventListener('change', e => {
      this.inputStore.onInput(e);
    });

    return element;
  }

  addNewLineInCurScope(range: Range, newLineDom = this.makeNewDefaultLineDom()) {
    insertAfter(newLineDom, this.getCurDomByRange(range));
    this.setStartRangeByDom(newLineDom);
  }

  setStartRangeByDom(targetDom: HTMLElement) {
    const range = document.createRange();
    range.setStart(targetDom, 0);
    range.collapse(true);

    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }

  getCurDomByRange(range: Range) {
    if (range.startContainer.nodeType === Node.TEXT_NODE) {
      const rangeParentElement = range.startContainer.parentElement;
      if (!rangeParentElement) {
        throw Error('找不到 rangeParentElement');
      }
      return rangeParentElement;
    }
    return range.startContainer as HTMLElement;
  }

  makeNewDefaultLineDom() {
    const defaultTextTag = document.createElement('p');

    const getClassName = css`
      margin-bottom: 10px;
      height: 26px;
      border: 1px solid yellowgreen;
    `;

    defaultTextTag.setAttribute('class', getClassName);
    defaultTextTag.setAttribute('data-block', '1');

    return defaultTextTag as HTMLElement;
  }

  markIsInParentScope(dom: HTMLElement, val: string) {
    dom.setAttribute(PARENT_ATTR_KEY, val);
    return dom;
  }

  verifyIsInParentScope(dom: HTMLElement) {
    return dom.attributes.getNamedItem(PARENT_ATTR_KEY);
  }

  getParentScope(dom: HTMLElement) {
    return dom.attributes.getNamedItem(PARENT_ATTR_KEY);
  }

  verifyHasChildScope(dom: HTMLElement) {
    return dom.attributes.getNamedItem(CHILD_ATTR_KEY);
  }

  markHasChildNode(dom: HTMLElement, val: string) {
    dom.setAttribute(CHILD_ATTR_KEY, val);
  }

  isNoTextInCurDom(range: Range) {
    return !range.startContainer.nodeValue;
  }
}

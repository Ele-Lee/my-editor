import { css } from '@emotion/css';
import { Service, Inject } from 'typedi';

import { getDomByStringOrEle, insertAfter, replaceDom } from '../utils/dom';

const PARENT_ATTR_KEY = 'data-parent';

@Service()
export class DomAction {
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
    return element;
  }

  addNewLineInCurScope(
    range: Range,
    newLineDom = this.makeNewDefaultLineDom()
  ) {
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

    return defaultTextTag;
  }

  markIsInParentScope(dom: HTMLElement, val: string) {
    dom.setAttribute(PARENT_ATTR_KEY, val);
  }

  verifyIsInParentScope(dom: HTMLElement) {
    return dom.attributes.getNamedItem(PARENT_ATTR_KEY);
  }

  markHasChildNode(dom: HTMLElement, val: string) {
    dom.setAttribute('data-child', val);
  }
}

import { css } from '@emotion/css';

export const getCurDomByRange = (range: Range) => {
  const rangeParentElement = range.startContainer.parentElement;
  if (!rangeParentElement) {
    throw Error('找不到 rangeParentElement');
  }
  return rangeParentElement;
};

export const makeNewDefaultLineDom = () => {
  const defaultTextTag = document.createElement('p');

  const getClassName = css`
    margin-bottom: 10px;
    height: 26px;
    border: 1px solid yellowgreen;
  `;

  defaultTextTag.setAttribute('class', getClassName);
  defaultTextTag.setAttribute('data-block', '1');

  return defaultTextTag;
};

export const replaceDom = (oldDom: HTMLElement, newDom: HTMLElement) => {
  oldDom.replaceWith(newDom);

  return newDom;
};

export const insertAfter = (
  newElement: HTMLElement,
  targetElement: HTMLElement
) => {
  const parent = targetElement.parentNode!;
  if (parent.lastChild == targetElement) {
    parent.appendChild(newElement);
  } else {
    parent.insertBefore(newElement, targetElement.nextSibling);
  }
};

export const markHasParentContainer = (dom: HTMLElement, val: string) => {
  dom.setAttribute('data-parent', val);
};

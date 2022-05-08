export const getDomByStringOrEle = (
  containerDomParam: HTMLElement | string
) => {
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
};

export const replaceDom = (oldDom: HTMLElement, newDom: HTMLElement) => {
  oldDom.replaceWith(newDom);

  return newDom;
};

// TODO 改名字
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

class QCMark {
  editDom?: HTMLElement;
  constructor(containerDomParam: HTMLElement | string) {
    this.setStartRange(this.initEditDom(this.setContainerDom(containerDomParam)))

    this.bindKeyupEvent()
  }

  setContainerDom(containerDomParam: HTMLElement | string) {
    let containerDom: HTMLElement;
    if (typeof containerDomParam === "string") {
      const containerDomTmp =
        document.querySelector<HTMLElement>(containerDomParam);
      if (containerDomTmp) {
        containerDom = containerDomTmp;
      } else {
        throw "找不到dom";
      }
    } else {
      containerDom = containerDomParam;
    }
    return containerDom;
  }

  initEditDom(containerDom: HTMLElement) {
    if(containerDom.children.length) {
        return containerDom
    }
    const element = document.createElement("pre");
    element.className = "qc-mark";
    // element.setAttribute("placeholder", vditor.options.placeholder);
    element.setAttribute("contenteditable", "true");
    element.setAttribute("spellcheck", "false");
    element.style = "height: 400px; border: 1px solid red; outline: none;";
    containerDom.appendChild(element);

    
    this.initAndAppendDefaultTextTag(element);
    const firstLine = this.initAndAppendDefaultTextTag(element);
    firstLine.focus()
    this.editDom = element;
    return element
  }

  initAndAppendDefaultTextTag(parent: HTMLElement) {
    const defaultTextTag = document.createElement("p");
    defaultTextTag.setAttribute('style', 'height: 26px; border: 1px solid yellow;')
    defaultTextTag.setAttribute('data-block', '1')
    parent.appendChild(defaultTextTag);
    return defaultTextTag;
  }

  bindKeyupEvent() {
    this.editDom?.addEventListener("keyup", (e) => {
        const range = getSelection()?.getRangeAt(0).cloneRange()
        
        if(range) {
            
            console.log('%celelee test:', 'color:#fff;background:#000', e, range)
        }
    });
  }


  setStartRange(targetDom: HTMLElement) {
    const range = document.createRange();
    range.setStart(targetDom, 0);
    range.collapse(true);

    const selection = window.getSelection();
    if(selection) {
        selection.removeAllRanges();
        selection.addRange(range);
    }
  }
}

export default QCMark;

import { Service, Inject } from 'typedi';
import { defaultPlaceholder } from '../utils/constant';
import markTagAdapterMap from '../parse';
import { DomAction } from './dom';
import { replaceDom } from '../utils/dom';

@Service()
export class EditAction {
  @Inject()
  domAction!: DomAction;

  parseText(range: Range, curInputChar: string) {
    const inputTemp = range.startContainer.nodeValue;
    if (!inputTemp) {
      return;
    }
    const curInputIdx = range.startOffset;
    const curDomNodeValue = inputTemp.slice(0, curInputIdx) + curInputChar + inputTemp.slice(curInputIdx);

    const firstSpaceIndex = curDomNodeValue.indexOf(' ');
    const markTagType = curDomNodeValue.substring(0, firstSpaceIndex)!;
    if (!markTagAdapterMap[markTagType]) {
      return;
    }
    const curInputtingDom = this.domAction.getCurDomByRange(range);
    const htmlTag = markTagAdapterMap[markTagType].toDom(
      {
        innerHTML: curDomNodeValue.substring(firstSpaceIndex + 1) || defaultPlaceholder,
        setRange: this.domAction.setStartRangeByDom,
        curInputChar,
        curInputtingDom,
      },
      this.domAction
    );

    replaceDom(curInputtingDom, htmlTag);
  }

  undoParsedNode(range: Range) {
    const curInputtingDom = this.domAction.getCurDomByRange(range);
    const attrVal = this.domAction.getParentScope(curInputtingDom.parentElement!)?.value;
    let newLineTag;
    if (attrVal) {
      newLineTag = this.domAction.markIsInParentScope(this.domAction.makeNewDefaultLineDom(), attrVal);
    }

    if (curInputtingDom.parentElement?.children.length === 1) {
      const parentElementTemp = curInputtingDom.parentElement;
      Promise.resolve().then(() => {
        parentElementTemp.remove();
      });
    }
    curInputtingDom.remove();
    this.domAction.addNewLineInCurScope(range, newLineTag);
  }
}

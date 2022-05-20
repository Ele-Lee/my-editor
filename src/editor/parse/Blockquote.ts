import { css } from '@emotion/css';
import { createNode } from '../factory/create-node';

const curTagName = 'blockquote';

export default createNode({
  rule: '>',
  tag: curTagName,
  // enterIntercept() {},
  toDom(params, domAction) {
    const blockquoteWrap = document.createElement(curTagName);

    blockquoteWrap.className = css`
      padding-left: 1.875em;
      line-height: 1.75em;
      border-left: 4px solid rgb(94, 129, 172);
    `;

    domAction.markHasChildNode(blockquoteWrap, 'p');

    const newLineTag = domAction.makeNewDefaultLineDom();

    domAction.markIsInParentScope(newLineTag, curTagName);

    newLineTag.innerHTML = params.innerHTML;
    // console.log('%celelee test:', 'color:#fff;background:#0F0',params.innerHTML, `+${newLineTag.innerHTML}+`, newLineTag.outerHTML)
    // setTimeout(()=>{
    //   console.log('%celelee test:', 'color:#fff;background:#0F0',params.innerHTML, `+${newLineTag.innerHTML}+`, newLineTag.outerHTML)
    // }, )
    
    blockquoteWrap.appendChild(newLineTag);
    // blockquoteWrap.innerHTML = newLineTag.outerHTML

    return blockquoteWrap;
  },
});

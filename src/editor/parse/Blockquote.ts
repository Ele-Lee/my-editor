import { css } from '@emotion/css';

import { makeNewDefaultLineDom, markHasParentContainer } from '../dom';
import { ParseHtmlParams } from '../typing';
import { createNode } from '../factory/create-node';

const curTagName = 'blockquote';

export default createNode({
  rule: '>',
  tag: curTagName,
  // enterIntercept() {},
  toDom(params: ParseHtmlParams) {
    const blockquoteWrap = document.createElement(curTagName);

    blockquoteWrap.className = css`
      padding-left: 1.875em;
      line-height: 1.75em;
      border-left: 4px solid rgb(94, 129, 172);
    `;

    const newLineTag = makeNewDefaultLineDom();

    markHasParentContainer(newLineTag, curTagName);

    if (params.innerHTML) {
      newLineTag.innerHTML = params.innerHTML;
    }
    blockquoteWrap.appendChild(newLineTag);
    // if (params.setRange) {
    //   params.setRange(newLineTag);
    //   console.log(
    //     '%celelee test:',
    //     'background:#000;color:#fff',
    //     params.setRange,
    //     newLineTag
    //   );
    // }

    return blockquoteWrap;
  },
});

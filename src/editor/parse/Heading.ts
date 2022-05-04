import { ParseHtmlParams } from '../typing';
import { createNode } from '../factory/create-node';

const DefaultHeadingConf = {
  H1: {
    tag: 'h1',
    rule: '#',
  },
  H2: {
    tag: 'h2',
    rule: '##',
  },
  H3: {
    tag: 'h3',
    rule: '###',
  },
  H4: {
    tag: 'h4',
    rule: '####',
  },
  H5: {
    tag: 'h5',
    rule: '#####',
  },
  H6: {
    tag: 'h6',
    rule: '######',
  },
};

export default Object.entries(DefaultHeadingConf).map(([key, item]) => {
  const { tag, rule } = item;
  return createNode({
    tag,
    rule,
    toDom(params: ParseHtmlParams) {
      const headingTag = document.createElement(tag);

      if (params.innerHTML) {
        headingTag.innerHTML = params.innerHTML;
      }

      return headingTag;
    },
  });
});

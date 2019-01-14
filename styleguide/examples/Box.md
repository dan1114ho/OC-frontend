[See `@rebass/grid` docs for more info](https://www.npmjs.com/package/@rebass/grid#box)

Using fractions to set percentage width:

```js
const { default: styled } = require('styled-components');
const { Box } = require('@rebass/grid');
const { P } = require('../../src/components/Text');
const Block = styled(Box)`
  border: 1px solid black;
`;

<React.Fragment>
  <Block width={1/4} mb={3} p={2}>
    <P>width: 25%;</P>
  </Block>
  <Block width={1/3} mb={3} p={2}>
    <P>width: 33%;</P>
  </Block>
  <Block width={1/2} mb={3} p={2}>
    <P>width: 50%;</P>
  </Block>
  <Block width={3/4} mb={3} p={2}>
    <P>width: 75%;</P>
  </Block>
</React.Fragment>
```

Using fixed pixel width:
```js
const { default: styled } = require('styled-components');
const { Box } = require('@rebass/grid');
const { P } = require('../../src/components/Text');
const Block = styled(Box)`
  border: 1px solid black;
`;

<React.Fragment>
  <Block width={200} mx="auto" p={2}>
    <P>width: 200px; margin: 0 auto;</P>
  </Block>
</React.Fragment>
```

Using relative unit widths:
```js
const { default: styled } = require('styled-components');
const { Box } = require('@rebass/grid');
const { P } = require('../../src/components/Text');
const Block = styled(Box)`
  border: 1px solid black;
`;

<React.Fragment>
  <Block width="20rem" mx="auto" p={2}>
    <P>width: 20rem; margin: 0 auto;</P>
  </Block>
</React.Fragment>
```

Set responsive width using an array of values, works for padding and margin props as well:

```js
const { default: styled } = require('styled-components');
const { Box } = require('@rebass/grid');
const { P } = require('../../src/components/Text');
const Block = styled(Box)`
  border: 1px solid black;
`;

<React.Fragment>
  <Block width={[1, 1/2, 1/4]} mx="auto" p={2}>
    <P>width: responsive; margin: 0 auto;</P>
  </Block>
</React.Fragment>
```

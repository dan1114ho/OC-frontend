import styled from 'styled-components';
import {
  color,
  display,
  fontFamily,
  fontSize,
  fontStyle,
  fontWeight,
  lineHeight,
  letterSpacing,
  space,
  style,
  textAlign,
} from 'styled-system';
import tag from 'clean-tag';

export const textTransform = style({
  prop: 'textTransform',
});

export const whiteSpace = style({
  prop: 'whiteSpace',
});

export const cursor = style({
  prop: 'cursor',
});

export const P = styled(tag.p)`
  ${color}
  ${display}
  ${fontFamily}
  ${fontSize}
  ${fontStyle}
  ${fontWeight}
  ${lineHeight}
  ${letterSpacing}
  ${space}
  ${textAlign}
  ${textTransform}
  ${whiteSpace}
  ${cursor}
`;

P.defaultProps = {
  blacklist: tag.defaultProps.blacklist.concat(['textTransform', 'whiteSpace']),
  fontSize: 'Paragraph',
  letterSpacing: '-0.2px',
  lineHeight: '20px',
  m: 0,
};

export const Span = P.withComponent(tag.span);

Span.defaultProps = {
  fontSize: 'inherit',
};

export const H1 = P.withComponent(tag.h1);

H1.defaultProps = {
  fontSize: 'H1',
  fontWeight: 'bold',
  letterSpacing: '-1.2px',
  lineHeight: '56px',
  m: 0,
};

export const H2 = P.withComponent(tag.h2);

H2.defaultProps = {
  fontSize: 'H2',
  fontWeight: 'bold',
  letterSpacing: '-0.4px',
  lineHeight: '44px',
  m: 0,
};

export const H3 = P.withComponent(tag.h3);

H3.defaultProps = {
  fontSize: 'H3',
  fontWeight: 'bold',
  letterSpacing: '-0.4px',
  lineHeight: '36px',
  m: 0,
};

export const H4 = P.withComponent(tag.h4);

H4.defaultProps = {
  fontSize: 'H4',
  fontWeight: 'bold',
  letterSpacing: '-0.2px',
  lineHeight: '32px',
  m: 0,
};

export const H5 = P.withComponent(tag.h5);

H5.defaultProps = {
  fontSize: 'H5',
  letterSpacing: '-0.2px',
  lineHeight: '24px',
  textAlign: 'center',
  fontWeight: 500,
  color: 'black.800',
  m: 0,
};

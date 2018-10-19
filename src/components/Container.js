import styled from 'styled-components';
import tag from 'clean-tag';
import {
  alignItems,
  alignSelf,
  background,
  backgroundImage,
  backgroundPosition,
  backgroundRepeat,
  backgroundSize,
  bgColor,
  borders,
  borderRadius,
  bottom,
  boxShadow,
  color,
  display,
  flex,
  flexDirection,
  flexWrap,
  fontSize,
  height,
  justifyContent,
  left,
  maxHeight,
  maxWidth,
  minHeight,
  minWidth,
  order,
  position,
  right,
  size,
  space,
  style,
  top,
  width,
  zIndex,
} from 'styled-system';

export const overflow = style({ prop: 'overflow' });

export const pointerEvents = style({ prop: 'pointerEvents' });

const Container = styled(tag)(
  [],
  alignItems,
  alignSelf,
  background,
  backgroundImage,
  backgroundPosition,
  backgroundRepeat,
  backgroundSize,
  bgColor,
  borders,
  borderRadius,
  bottom,
  boxShadow,
  color,
  display,
  flex,
  flexDirection,
  flexWrap,
  fontSize,
  height,
  justifyContent,
  left,
  maxHeight,
  maxWidth,
  minHeight,
  minWidth,
  order,
  overflow,
  pointerEvents,
  position,
  right,
  size,
  space,
  top,
  width,
  zIndex,
);

export default Container;

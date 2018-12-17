import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Flex } from '@rebass/grid';

import StyledButton from './StyledButton';

const borderRadius = '4px';

const StyledButtonItem = styled(StyledButton)`
  border-radius: 0;
  &:active p {
    color: white;
  }
  &:hover {
    /* Use a higher z-index on hover to get all the borders colored */
    z-index: 9;
  }
  &:first-child {
    border-radius: ${borderRadius} 0 0 ${borderRadius};
  }
  &:not(:first-child) {
    margin-left: -1px;
  }
  &:last-child {
    border-radius: 0 ${borderRadius} ${borderRadius} 0;
  }
`;

const StyledButtonSet = ({ size, items, children, selected, buttonProps, onChange, ...props }) => (
  <Flex {...props}>
    {items.map(item => (
      <StyledButtonItem
        key={item}
        buttonSize={size}
        buttonStyle={item === selected ? 'primary' : 'standard'}
        onClick={onChange && (() => onChange(item))}
        {...buttonProps}
      >
        {children({ item, isSelected: item === selected })}
      </StyledButtonItem>
    ))}
  </Flex>
);

StyledButtonSet.propTypes = {
  /** A list of elements to build buttons uppon */
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
  /** Button child content renderer. Get passed an object like { item, isSelected } */
  children: PropTypes.func.isRequired,
  /** Based on the design system theme */
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  /** Currently selected item */
  selected: PropTypes.any,
  /** An optionnal func called with the new item when option changes */
  onChange: PropTypes.func,
};

StyledButtonSet.defaultProps = {
  size: 'medium',
};

export default StyledButtonSet;

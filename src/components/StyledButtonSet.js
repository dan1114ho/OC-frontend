import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Flex } from '@rebass/grid';

import StyledButton from './StyledButton';

const borderRadius = '4px';

const comboStyle = ({ combo }) => (combo ? '0' : `0 ${borderRadius} ${borderRadius} 0`);

const StyledButtonItem = styled(StyledButton)`
  border-radius: 0;
  flex-grow: 1;
  &:active p {
    color: white;
  }
  &:hover,
  &:focus {
    /* Use a higher z-index on hover to get all the borders colored */
    z-index: 9;
  }
  /* Remove the dotted outline on Firefox */
  &::-moz-focus-inner {
    border: 0;
  }
  &:first-child {
    border-radius: ${borderRadius} 0 0 ${borderRadius};
  }
  &:not(:first-child) {
    margin-left: -1px;
  }
  &:last-child {
    border-radius: ${comboStyle};
  }
`;

StyledButtonItem.propTypes = {
  combo: PropTypes.bool,
};

StyledButtonItem.defaultProps = {
  blacklist: StyledButton.defaultProps.blacklist.concat('combo'),
};

const StyledButtonSet = ({ size, items, children, selected, buttonProps, onChange, combo, disabled, ...props }) => (
  <Flex {...props}>
    {items.map(item => (
      <StyledButtonItem
        combo={combo || undefined}
        key={item}
        buttonSize={size}
        buttonStyle={item === selected ? 'primary' : 'standard'}
        onClick={onChange && (() => onChange(item))}
        className={item === selected ? 'selected' : undefined}
        disabled={disabled}
        type="button"
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
  /** An optional func called with the new item when option changes */
  onChange: PropTypes.func,
  /** Setting to style last item to look good in combination with a text input */
  combo: PropTypes.bool,
  /** Disable user input */
  disabled: PropTypes.bool,
};

StyledButtonSet.defaultProps = {
  combo: false,
  size: 'medium',
};

export default StyledButtonSet;

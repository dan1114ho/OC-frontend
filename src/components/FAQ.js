import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { themeGet } from 'styled-system';
import { Flex, Box } from '@rebass/grid';

import { P } from './Text';

/** A simple wrapper to group entries */
const Container = styled(Box)``;

/** Main entry container */
const Entry = styled.details`
  &[open] {
    summary::after {
      content: '−';
    }
  }

  summary {
    margin-top: ${themeGet('space.2')}px;
    margin-bottom: ${themeGet('space.2')}px;
    font-size: ${themeGet('fontSizes.Caption')}px;
    font-weight: 500;
    color: ${themeGet('colors.black.800')};
    /* Remove arrow on Firefox */
    list-style: none;

    &:hover {
      color: ${themeGet('colors.black.700')};
    }
  }

  summary:focus {
    outline: 1px dashed ${themeGet('colors.black.200')};
    outline-offset: ${themeGet('space.1')}px;
  }

  summary::after {
    content: '+';
    display: inline-block;
    padding-left: ${themeGet('space.2')}px;
    color: ${themeGet('colors.black.500')};
    font-weight: bold;
  }

  /* Remove arrow on Chrome */
  summary::-webkit-details-marker {
    display: none;
  }
`;

/** Entry title */
const Title = styled.summary``;

/** Entry content (hidden by default) */
const Content = styled(Box)``;
Content.defaultProps = {
  mb: 1,
  fontSize: 'Caption',
  color: 'black.500',
};

const Separator = styled.hr`
  background: ${themeGet('colors.black.400')};
  width: 100%;
`;

/**
 * A small FAQ with expendable contents. You don't actually have
 */
export default class FAQ extends Component {
  static propTypes = {
    /**
     * A render func that is given an object with the following entries:
     *
     * - `Container`: A simple container to group entries. Accept all `Box` properties.
     * - `Entry`: Use this to wrap each individual FAQ entry
     * - `Title`: A simple wrapper arround `summary`. Using a regular `summary` tag will have the same effect.
     * - `Content`: The content, initially hidden.
     * - `Separator`: A helper to add a full-width separator in the FAQ.
     * */
    children: PropTypes.func.isRequired,
    /** The title to display above entries */
    title: PropTypes.string,
    /** All properties from `Flex` */
    ...Flex.propTypes,
  };

  static defaultProps = {
    title: "FAQ's",
  };

  render() {
    const { title, children, ...props } = this.props;
    return (
      <Flex flexDirection="column" {...props}>
        <P fontWeight="bold" mb={1}>
          {title}
        </P>
        {children({ Container, Entry, Title, Content, Separator })}
      </Flex>
    );
  }
}

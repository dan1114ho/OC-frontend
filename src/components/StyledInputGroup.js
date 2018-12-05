import styled from 'styled-components';
import PropTypes from 'prop-types';
import { themeGet } from 'styled-system';
import { withState } from 'recompose';

import Container from './Container';
import { Span } from './Text';
import StyledInput from './StyledInput';

const InputContainer = styled(Container)`
  &:hover {
    border-color: ${themeGet('colors.primary.300')};
  }
`;

const getColor = ({ error, focused, success }) => {
  if (error) {
    return 'red.300';
  }

  if (success) {
    return 'green.300';
  }

  if (focused) {
    return 'primary.300';
  }

  return 'black.400';
};

const getBgColor = ({ error, focused, success }) => {
  if (error) {
    return 'red.100';
  }

  if (success) {
    return 'green.100';
  }

  if (focused) {
    return 'primary.100';
  }

  return 'black.50';
};

const getBorderColor = ({ error, focused, success }) => {
  if (error) {
    return 'red.500';
  }

  if (success) {
    return 'green.300';
  }

  if (focused) {
    return 'primary.300';
  }

  return 'black.300';
};

/**
 * A styled input with a prepended field element.
 * @see See [StyledInput](/#!/StyledInput) for details about props passed to it
 */
const StyledInputGroup = withState('focused', 'setFocus', false)(
  ({ prepend, focused, setFocus, disabled, success, error, ...inputProps }) => (
    <InputContainer
      bg={disabled ? 'black.50' : 'white.full'}
      border="1px solid"
      borderColor={getBorderColor({ error, focused, success })}
      borderRadius="4px"
      display="flex"
      alignItems="center"
    >
      <Container bg={getBgColor({ error, focused, success })} borderRadius="4px 0 0 4px" py={2} px={3}>
        <Span color={getColor({ error, focused, success })} fontSize="Paragraph">
          {prepend}
        </Span>
      </Container>
      <StyledInput
        bare
        color="black.800"
        type="text"
        overflow="scroll"
        fontSize="Paragraph"
        flex="1 1 auto"
        disabled={disabled}
        {...inputProps}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
      />
    </InputContainer>
  ),
);

StyledInputGroup.propTypes = {
  /** Text shown before input */
  prepend: PropTypes.string.isRequired,
  /** Show disabled state for field */
  disabled: PropTypes.bool,
  /** Show error state for field */
  error: PropTypes.bool,
  /** Show success state for field */
  success: PropTypes.bool,
  /** Passed to internal StyledInput */
  type: PropTypes.string,
};

export default StyledInputGroup;

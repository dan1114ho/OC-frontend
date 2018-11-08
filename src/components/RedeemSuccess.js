import React from 'react';
import PropTypes from 'prop-types';

import withIntl from '../lib/withIntl';

import { Flex, Box } from 'grid-styled';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import { Check } from 'styled-icons/fa-solid/Check.cjs';
import { P, H5 } from './Text';

const Title = styled(H5)``;

const Instructions = styled(P)`
  font-size: 1.2rem;
  color: #9d9fa3;
`;

const CheckCircleIcon = styled(Check)`
  color: #00b65c;
  border: 1.3px solid #73e3ac;
  border-radius: 20px;
  padding: 10px;
`;

class RedeemSuccess extends React.Component {
  static propTypes = {
    email: PropTypes.string.isRequired,
  };

  render() {
    const { email } = this.props;

    return (
      <div>
        <Flex flexDirection="column">
          <Flex justifyContent="center" my={3}>
            <CheckCircleIcon size="40px" />
          </Flex>

          <Box my={2}>
            <Title>
              <FormattedMessage
                id="redeem.card.success.title"
                defaultMessage="You’re just one step away from
    supporting open initiatives."
              />
            </Title>
          </Box>
          <Box my={3}>
            <Instructions>
              <FormattedMessage
                id="redeem.card.success.instructions"
                defaultMessage="We’ve sent an email to {email} with instructions to verify your new Open Collective account and credit it with the amount of your gift card."
                values={{ email: <strong>{email}</strong> }}
              />
            </Instructions>
          </Box>
        </Flex>
      </div>
    );
  }
}

export default withIntl(RedeemSuccess);

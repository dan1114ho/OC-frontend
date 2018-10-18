import moment from 'moment';
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Box, Flex } from 'grid-styled';
import { FormattedNumber, FormattedMessage } from 'react-intl';

import Avatar from '../../../components/Avatar';
import Container from '../../../components/Container';
import Link from '../../../components/Link';
import { P, Span } from '../../../components/Text';

import TransactionDetails from './TransactionDetails';

class Transaction extends React.Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    amount: PropTypes.number.isRequired,
    canEditCollective: PropTypes.bool, // LoggedInUser.canEditCollective(collective) || LoggedInUser.isRoot()
    createdAt: PropTypes.string.isRequired,
    description: PropTypes.string,
    currency: PropTypes.string.isRequired,
    attachment: PropTypes.string,
    uuid: PropTypes.number,
    netAmountInCollectiveCurrency: PropTypes.number,
    platformFeeInHostCurrency: PropTypes.number,
    paymentProcessorFeeInHostCurrency: PropTypes.number,
    hostCurrency: PropTypes.string,
    hostCurrencyFxRate: PropTypes.number,
    paymentMethod: PropTypes.shape({
      service: PropTypes.string.isRequired,
    }),
    host: PropTypes.shape({
      hostFeePercent: PropTypes.number,
      slug: PropTypes.string.isRequired,
    }),
    fromCollective: PropTypes.shape({
      id: PropTypes.number,
      image: PropTypes.string,
      name: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
    }),
    collective: PropTypes.shape({
      id: PropTypes.number,
      type: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
    }),
    subscription: PropTypes.shape({
      interval: PropTypes.oneOf(['month', 'year']),
    }),
    type: PropTypes.oneOf(['CREDIT', 'DEBIT']),
    isRefund: PropTypes.bool, // whether or not this transaction refers to a refund
  };

  state = { showDetails: false };

  render() {
    const {
      amount,
      description,
      createdAt,
      currency,
      fromCollective,
      collective,
      subscription,
      type,
      paymentProcessorFeeInHostCurrency,
    } = this.props;

    const formattedCreatedAt = new Date(createdAt).toISOString();
    return (
      <Flex my={4}>
        <Container alignSelf="flex-start">
          <a href={`/${fromCollective.slug}`} title={fromCollective.name}>
            <Avatar
              src={fromCollective.image}
              id={fromCollective.id}
              radius={40}
              className="noFrame"
            />
          </a>
        </Container>
        <Container ml={3} width={1}>
          <Flex justifyContent="space-between" alignItems="center">
            <div>
              <P fontSize="1.4rem" color="#9399A3" display="inline">
                {description}
                {type === 'DEBIT' && ' expense '}
                {collective && (
                  <Fragment>
                    {' to '}{' '}
                    <Link route={`/${collective.slug}`} title={collective.name}>
                      {collective.name}
                    </Link>
                    .
                  </Fragment>
                )}
              </P>
              <Span fontSize="1.6rem">{type === 'CREDIT' && ' 🎉'}</Span>
            </div>
            <Flex alignItems="baseline">
              <Span fontWeight="bold" fontSize="1.6rem">
                <FormattedNumber
                  currency={currency}
                  currencyDisplay="symbol"
                  maximumFractionDigits={2}
                  minimumFractionDigits={2}
                  style="currency"
                  value={Math.abs(amount) / 100}
                />
              </Span>
              <Box ml={1}>
                <Span color="#9D9FA3" fontSize="1.4rem" letterSpacing="-0.2px">
                  {currency}
                </Span>
              </Box>
              <Box ml={2}>
                <object
                  type="image/svg+xml"
                  data={`/static/icons/${type.toLowerCase()}-arrow.svg`}
                  height="16"
                />
              </Box>
            </Flex>
          </Flex>
          <Container fontSize="1.2rem" color="#AEB2B8">
            <a href={`/${fromCollective.slug}`} title={fromCollective.name}>
              {fromCollective.name}
            </a>
            {' | '}
            <span title={moment(formattedCreatedAt).format('LLLL')}>
              {moment(formattedCreatedAt).fromNow()}
            </span>
            {paymentProcessorFeeInHostCurrency !== undefined && (
              <Fragment>
                {' | '}
                <a
                  onClick={() =>
                    this.setState({ viewDetails: !this.state.viewDetails })
                  }
                >
                  {this.state.viewDetails ? (
                    <FormattedMessage
                      id="transaction.closeDetails"
                      defaultMessage="Close Details"
                    />
                  ) : (
                    <FormattedMessage
                      id="transaction.viewDetails"
                      defaultMessage="View Details"
                    />
                  )}
                </a>
              </Fragment>
            )}
          </Container>
          {this.state.viewDetails && (
            <TransactionDetails {...this.props} mode="open" />
          )}
        </Container>
      </Flex>
    );
  }
}

export default Transaction;

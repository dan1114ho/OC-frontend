import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { graphql } from 'react-apollo';
import { Flex, Box } from '@rebass/grid';
import { get, last } from 'lodash';
import { withRouter } from 'next/router';

import { Add } from 'styled-icons/material/Add.cjs';
import { PaperPlane } from 'styled-icons/fa-solid/PaperPlane.cjs';

import { getCollectiveVirtualCards } from '../graphql/queries';
import VirtualCardDetails from './VirtualCardDetails';
import Loading from './Loading';
import Pagination from './Pagination';
import Link from './Link';
import { Link as LinkWrapper } from '../server/pages';
import StyledLink from './StyledLink';
import StyledButtonSet from './StyledButtonSet';
import { P } from './Text';

/**
 * A filterable list of virtual cards meant to be displayed for organization
 * admins.
 */
class EditVirtualCards extends React.Component {
  static propTypes = {
    collectiveId: PropTypes.number.isRequired,
    collectiveSlug: PropTypes.string.isRequired,
    /** Max number of items to display */
    limit: PropTypes.number,
    /** Provided by graphql */
    data: PropTypes.object,
    /** Provided by withRouter */
    router: PropTypes.object,
    /** Provided by addTransactionsData */
    setConfirmedFilter: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = { claimedFilter: 'all' };
  }

  renderFilters(onlyConfirmed) {
    let selected = 'all';
    if (onlyConfirmed) selected = 'redeemed';
    if (onlyConfirmed === false) selected = 'pending';

    return (
      <StyledButtonSet items={['all', 'redeemed', 'pending']} selected={selected} buttonProps={{ p: 0 }}>
        {({ item, isSelected }) => (
          <Link route="editCollective" params={{ ...this.props.router.query, filter: item, offset: 0 }}>
            <P p="0.5em 1em" color={isSelected ? 'white.full' : 'black.800'} style={{ margin: 0 }}>
              {item === 'all' && <FormattedMessage id="virtualCards.filterAll" defaultMessage="All" />}
              {item === 'redeemed' && <FormattedMessage id="virtualCards.filterRedeemed" defaultMessage="Redeemed" />}
              {item === 'pending' && <FormattedMessage id="virtualCards.filterPending" defaultMessage="Pending" />}
            </P>
          </Link>
        )}
      </StyledButtonSet>
    );
  }

  renderNoVirtualCardMessage(onlyConfirmed) {
    if (onlyConfirmed === undefined) {
      return (
        <Link route="editCollective" params={{ slug: this.props.collectiveSlug, section: 'gift-cards-create' }}>
          <FormattedMessage id="virtualCards.createFirst" defaultMessage="Create your first gift card!" />
        </Link>
      );
    } else if (onlyConfirmed) {
      return <FormattedMessage id="virtualCards.emptyClaimed" defaultMessage="No gift card claimed yet" />;
    } else {
      return <FormattedMessage id="virtualCards.emptyUnclaimed" defaultMessage="No unclaimed gift card" />;
    }
  }

  render() {
    const { loading } = this.props.data;
    const queryResult = get(this.props, 'data.Collective.createdVirtualCards', {});
    const onlyConfirmed = get(this.props, 'data.variables.isConfirmed');
    const { offset, limit, total, paymentMethods = [] } = queryResult;
    const lastVirtualCard = last(paymentMethods);

    return (
      <div>
        <Flex mb={4} justifyContent="space-between" flexWrap="wrap">
          {this.renderFilters(onlyConfirmed)}
          <Flex>
            <LinkWrapper
              route="editCollective"
              params={{ slug: this.props.collectiveSlug, section: 'gift-cards-create' }}
              passHref
            >
              <StyledLink buttonStyle="standard" buttonSize="medium">
                <Add size="1em" />
                {'  '}
                <FormattedMessage id="virtualCards.createCodes" defaultMessage="Create gift card codes" />
              </StyledLink>
            </LinkWrapper>
            <Box mr="0.5em" />
            <LinkWrapper
              route="editCollective"
              params={{ slug: this.props.collectiveSlug, section: 'gift-cards-send' }}
              passHref
            >
              <StyledLink buttonStyle="primary" buttonSize="medium">
                <PaperPlane size="1em" />
                {'  '}
                <FormattedMessage id="virtualCards.send" defaultMessage="Send gift cards by email" />
              </StyledLink>
            </LinkWrapper>
          </Flex>
        </Flex>
        {loading ? (
          <Loading />
        ) : (
          <div className="virtualcards-list">
            {paymentMethods.length === 0 && (
              <Flex justifyContent="center" mt="4em">
                {this.renderNoVirtualCardMessage(onlyConfirmed)}
              </Flex>
            )}
            {paymentMethods.map(v => (
              <div key={v.id}>
                <VirtualCardDetails virtualCard={v} />
                {v !== lastVirtualCard && <hr />}
              </div>
            ))}
            {total > limit && (
              <Flex justifyContent="center" mt={4}>
                <Pagination offset={offset} total={total} limit={limit} />
              </Flex>
            )}
          </div>
        )}
      </div>
    );
  }
}

const VIRTUALCARDS_PER_PAGE = 15;

const getIsConfirmedFromFilter = filter => {
  if (filter === undefined || filter === 'all') {
    return undefined;
  }
  return filter === 'redeemed';
};

const getGraphQLVariablesFromProps = props => ({
  CollectiveId: props.collectiveId,
  isConfirmed: getIsConfirmedFromFilter(props.router.query.filter),
  offset: props.router.query.offset || 0,
  limit: props.limit || VIRTUALCARDS_PER_PAGE,
});

export const addTransactionsData = graphql(getCollectiveVirtualCards, {
  options: props => ({ variables: getGraphQLVariablesFromProps(props) }),
  props: ({ data }) => ({
    data,
    setConfirmedFilter: isConfirmed => data.refetch({ ...data.variables, isConfirmed: isConfirmed }),
  }),
});

export default withRouter(addTransactionsData(EditVirtualCards));

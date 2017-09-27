import React from 'react';
import PropTypes from 'prop-types';
import { defineMessages, FormattedMessage } from 'react-intl';
import { get } from 'lodash';
import withIntl from '../lib/withIntl';
import Avatar from './Avatar';
import Logo from './Logo';
import { Router } from '../server/pages';
import { Link } from '../server/pages';

class Tier extends React.Component {

  static propTypes = {
    tier: PropTypes.object.isRequired,
    collective: PropTypes.object.isRequired,
    className: PropTypes.string
  }

  constructor(props) {
    super(props);
    this.anchor = (get(this.tier, 'name') || "").toLowerCase().replace(/ /g,'-');
    this.currencyStyle = { style: 'currency', currencyDisplay: 'symbol', minimumFractionDigits: 0, maximumFractionDigits: 2};

    this.messages = defineMessages({
      'amount.label': { id: 'tier.amount.label', defaultMessage: 'amount' },
      'interval.label': { id: 'tier.interval.label', defaultMessage: 'interval' },
      'month': { id: 'tier.interval.month', defaultMessage: 'month' },
      'year': { id: 'tier.interval.year', defaultMessage: 'year' },
      'interval.onetime': { id: 'tier.interval.onetime', defaultMessage: 'one time' },
      'interval.month': { id: 'tier.interval.monthly', defaultMessage: 'monthly' },
      'interval.year': { id: 'tier.interval.yearly', defaultMessage: 'yearly' },
      'collective.types.organization': { id: 'collective.types.organization', defaultMessage: '{n, plural, one {organization} other {organizations}}'},
      'collective.types.user': { id: 'collective.types.user', defaultMessage: '{n, plural, one {people} other {people}}'},
      'collective.types.collective': { id: 'collective.types.collective', defaultMessage: '{n, plural, one {collective} other {collectives}}'}
    });

  }

  showLastOrders(fromCollectiveTypeArray, limit) {
    const { tier, intl } = this.props;
    const fromCollectives = tier.orders.map(o => o.fromCollective).filter(c => fromCollectiveTypeArray.indexOf(c.type) !== -1);
    if (fromCollectives.length === 0) return;
    const additionalCollectives = fromCollectives.length - fromCollectives.slice(0, limit).length;
    return (
      <div>
        <style jsx>{`
          .fromCollectives {
            display: flex;
            flex-wrap: wrap;
          }
          .totalOrders {
            width: 81px;
            height: 14px;
            font-family: Rubik;
            font-size: 12px;
            text-align: left;
            color: #9ea2a6;
            color: var(--cool-grey);
            margin: 0 1rem;
          }
        `}</style>
        <div className="fromCollectives">
          { fromCollectives.slice(0, limit).map(fromCollective => (
            <div className="image" key={`image-${fromCollective.id}`}>
              <Link route={`/${fromCollective.slug}`}><a title={fromCollective.name}>
                { fromCollectiveTypeArray.indexOf('USER') !== -1 &&
                  <Avatar src={fromCollective.image} radius={32} />
                }
                { fromCollectiveTypeArray.indexOf('USER') === -1 &&
                  <Logo src={fromCollective.image} height={32} />
                }
              </a></Link>
            </div>
          ))}
        </div>
        { additionalCollectives > 0 &&
          <div className="totalOrders">
            + {additionalCollectives} {intl.formatMessage(this.messages[`collective.types.${fromCollectiveTypeArray[0].toLowerCase()}`], { n: additionalCollectives })}
          </div>
        }
      </div>
    );
  }  

  render() {

    const { collective, tier } = this.props;

    return (
      <div className={`${this.props.className} TierCard`} id={this.anchor}>
        <style jsx global>{`
          html {
            --charcoal-grey-two: #373a3d;
            --main-custom-color: #8f47b3;
            --silver-four: #e1e4e6;
            --cool-grey: #9ea2a6;
            --attention: #e69900;
            --gunmetal: #505559;
          }
          .image img {
            border: 2px solid white;            
          }
          .TierCard .Avatar {
            margin-left: -15px;
          }
          .TierCard .Avatar:first {
            margin-left: 0;
          }
        `}</style>
        <style jsx>{`
          .TierCard {
            width: 280px;
            border-radius: 8px;
            background-color: #ffffff;
            box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.04);
            border: solid 1px rgba(37, 39, 41, 0.16);
            margin: 3rem;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
          .title {
            margin: 3rem 0rem 1rem 3rem;
            width: 160px;
            font-family: Rubik;
            font-size: 22px;
            font-weight: 300;
            line-height: 1.32;
            text-align: left;
            color: #373a3d;
            color: var(--charcoal-grey-two);
          }
          .limited {
            margin: 0rem 3rem;
            font-family: Rubik;
            font-size: 1.1rem;
            font-weight: 500;
            line-height: 2.09;
            letter-spacing: 1px;
            text-align: left;
            color: #e69900;
            color: var(--attention);
          }
          .body {
            margin: 1rem 3rem;
            font-size: 1.4rem;
            color: var(--gunmetal);
          }
          .divider {
            margin: 1rem 0;
            width: 280px;
            height: 1px;
            background-color: #e1e4e6;
            background-color: var(--silver-four);
          }
          .footer {
            display: flex;
            align-items: center;
            margin: 3rem;
          }
          .action {
            margin-top: 1rem;
            width: 280px;
            height: 56px;
            border-radius: 8px;
            background-color: #8f47b3;
            background-color: var(--main-custom-color);
            box-shadow: inset 0 -4px 0 0 rgba(37, 39, 41, 0.15);
            font-family: Rubik, sans-serif;
            font-size: 14px;
            font-weight: 500;
            text-align: center;
            color: #ffffff;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        `}</style>
        <div className="title">
          {tier.name}
        </div>
        { tier.maxQuantity > 0 &&
          <div className="limited">
            <FormattedMessage
              id="tier.limited"
              values={{ maxQuantity: tier.maxQuantity, availableQuantity: tier.stats.availableQuantity }}
              defaultMessage="LIMITED: {availableQuantity} LEFT OUT OF {maxQuantity}"
              />
          </div>
        }
        <div className="body">
          {tier.description}
        </div>
        { tier.stats.totalOrders > 0 &&
          <div>
            <div className="divider" />
            <div className="footer">
              <div className="lastOrders">
              {this.showLastOrders(['USER'], 10)}
              {this.showLastOrders(['ORGANIZATION', 'COLLECTIVE'], 10)}
              </div>
            </div>
          </div>
        }
        <a className="action" onClick={() => Router.pushRoute(`/${collective.slug}/order/${tier.id}`)}>
          <FormattedMessage id="tier.contribute" defaultMessage="contribute" />
        </a>
      </div>
    );
  }
}

export default withIntl(Tier);
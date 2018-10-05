import url from 'url';
import { get, pick } from 'lodash';

import { logger } from '../logger';
import { queryString } from '../lib/utils';
import { fetchCollective, fetchMembers } from '../lib/graphql';

// Cache the list of members of a collective to avoid requesting it for every single /:collectiveSlug/backers/:position/avatar
const cache = require('lru-cache')({
  max: 5000,
  maxAge: 1000 * 60 * 10,
});

const WEBSITE_URL = process.env.WEBSITE_URL || 'https://opencollective.com';

export async function info(req, res, next) {
  // Keeping the resulting image for 1h in the CDN cache (we purge that cache on deploy)
  res.setHeader('Cache-Control', `public, max-age=${60 * 60}`);

  let collective;
  try {
    collective = await fetchCollective(req.params.collectiveSlug);
  } catch (e) {
    if (e.message.match(/No collective found/)) {
      return res.status(404).send('Not found');
    }
    logger.debug('>>> collectives.info error', e);
    return next(e);
  }

  const response = {
    ...pick(collective, ['slug', 'currency', 'image']),
    balance: collective.stats.balance,
    yearlyIncome: collective.stats.yearlyBudget,
    backersCount: collective.stats.backers.all,
    contributorsCount: Object.keys(
      get(collective, 'data.githubContributors') || {},
    ).length,
  };

  res.send(response);
}

export async function website(req, res) {
  req.params.isActive = true;
  const { collectiveSlug, tierSlug, backerType, isActive } = req.params;

  let users = cache.get(
    queryString.stringify({ collectiveSlug, tierSlug, backerType, isActive }),
  );
  if (!users) {
    try {
      users = await fetchMembers(req.params);
      cache.set(
        queryString.stringify({
          collectiveSlug,
          tierSlug,
          backerType,
          isActive,
        }),
        users,
      );
    } catch (e) {
      return res.status(404).send('Not found');
    }
  }

  const position = parseInt(req.params.position, 10);

  if (position > users.length) {
    return res.sendStatus(404);
  }

  const user = users[position] || {};
  const selector = tierSlug || backerType;
  let redirectUrl = `${WEBSITE_URL}/${user.slug}`;
  if (selector.match(/sponsor/)) {
    user.twitter = user.twitterHandle
      ? `https://twitter.com/${user.twitterHandle}`
      : null;
    redirectUrl = user.website || user.twitter || `${WEBSITE_URL}/${user.slug}`;
  }

  if (position === users.length) {
    redirectUrl = `${WEBSITE_URL}/${collectiveSlug}#support`;
  }

  const parsedUrl = url.parse(redirectUrl);
  const params = queryString.parse(parsedUrl.query);

  params.utm_source = params.utm_source || 'opencollective';
  params.utm_medium = params.utm_medium || 'github';
  params.utm_campaign = params.utm_campaign || collectiveSlug;

  parsedUrl.search = `?${queryString.stringify(params)}`;
  redirectUrl = url.format(parsedUrl);

  res.redirect(301, redirectUrl);
}

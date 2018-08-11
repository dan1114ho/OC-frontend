import nextRoutes from 'next-routes';

const pages = nextRoutes();

pages
  .add('home', '/')
  .add('about', '/:pageSlug(about|widgets|tos|privacypolicy)', 'staticPage')
  .add('faq', '/:pageSlug(faq|faq-for-collectives|faq-for-backers|faq-for-expenses|faq-for-hosts)', 'staticPage')
  .add('host', '/:pageSlug(becoming-an-open-collective-host)', 'staticPage')
  .add('redeem', '/redeem')
  .add('signin', '/signin/:token?')
  .add('subscriptions_redirect', '/subscriptions', 'subscriptions-redirect')
  .add('search', '/search')
  .add('button', '/:collectiveSlug/:verb(contribute|donate)/button')
  .add('createEvent', '/:parentCollectiveSlug/events/(new|create)')
  .add('createCollective', '/:hostCollectiveSlug?/(apply|create)')
  .add('createOrganization', '/organizations/new')
  .add('events-iframe', '/:collectiveSlug/events.html')
  .add('collectives-iframe', '/:collectiveSlug/(collectives|widget).html')
  .add('banner-iframe', '/:collectiveSlug/banner.html')
  .add('event', '/:parentCollectiveSlug/events/:eventSlug')
  .add('editEvent', '/:parentCollectiveSlug/events/:eventSlug/edit')
  .add('events', '/:collectiveSlug/events')
  .add('subscriptions', '/:collectiveSlug/subscriptions')
  .add('tiers', '/:collectiveSlug/tiers')
  .add('editTiers', '/:collectiveSlug/tiers/edit')
  .add('orderCollectiveTier', '/:collectiveSlug/order/:TierId/:amount?/:interval?', 'createOrder')
  .add('orderEventTier', '/:collectiveSlug/events/:eventSlug/order/:TierId', 'createOrder')
  .add('donate', '/:collectiveSlug/:verb(donate|pay|contribute)/:amount?/:interval(month|monthly|year|yearly)?/:description?', 'createOrder')
  .add('tiers-iframe', '/:collectiveSlug/tiers/iframe')
  .add('host.expenses', '/:hostCollectiveSlug/collectives/expenses', 'host.dashboard')
  .add('host.dashboard', '/:hostCollectiveSlug/dashboard', 'host.dashboard')
  .add('host.expenses.approve', '/:parentCollectiveSlug?/:collectiveType(events)?/:collectiveSlug/:table(expenses)/:id/:action(approve|reject)', 'action')
  .add('host.collectives.approve', '/:hostCollectiveSlug/:table(collectives)/:id/:action(approve)', 'action')
  .add('transactions', '/:parentCollectiveSlug?/:collectiveType(events)?/:collectiveSlug/transactions')
  .add('createUpdate', '/:collectiveSlug/updates/new')
  .add('updates', '/:collectiveSlug/updates')
  .add('update', '/:collectiveSlug/updates/:updateSlug')
  .add('createExpense', '/:parentCollectiveSlug?/:type(events)?/:collectiveSlug/expenses/new')
  .add('expense', '/:parentCollectiveSlug?/:collectiveType(events)?/:collectiveSlug/expenses/:ExpenseId([0-9]+)')
  .add('expenses', '/:parentCollectiveSlug?/:collectiveType(events)?/:collectiveSlug/expenses/:filter(categories|recipients)?/:value?')
  .add('collective', '/:slug')
  .add('editCollective', '/:slug/edit');

export default pages;

export const { Link, Router } = pages;

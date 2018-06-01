import React from 'react';
import PropTypes from 'prop-types';
import InputField from './InputField';
import EditTiers from './EditTiers';
import EditGoals from './EditGoals';
import EditHost from './EditHost';
import EditMembers from './EditMembers';
import EditPaymentMethods from './EditPaymentMethods';
import EditConnectedAccounts from './EditConnectedAccounts';
import ExportData from './ExportData';
import { FormattedMessage, defineMessages } from 'react-intl';
import { defaultBackgroundImage } from '../constants/collectives';
import withIntl from '../lib/withIntl';
import { Button } from 'react-bootstrap';
import { Link } from '../server/pages';
import { get } from 'lodash';
import styled, { css } from 'styled-components';
import { Flex, Box } from 'grid-styled'

const selectedStyle = css`
  background-color: #eee;
  color: black;
`;

const MenuItem = styled.div`
  border-radius: 5px;
  padding: 5px 10px;
  color: #888;
  cursor: pointer;
  &:hover {
    color: black;
  }
  ${({ selected }) => selected && selectedStyle}
`

class EditCollectiveForm extends React.Component {

  static propTypes = {
    collective: PropTypes.object,
    loading: PropTypes.bool,
    onSubmit: PropTypes.func,
    LoggedInUser: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleObjectChange = this.handleObjectChange.bind(this);
    this.showSection = this.showSection.bind(this);

    const collective = { ... props.collective || {} };
    collective.slug = collective.slug ? collective.slug.replace(/.*\//, '') : '';

    this.state = {
      modified: false,
      section: 'info',
      collective,
      members: collective.members || [{}],
      tiers: collective.tiers || [{}],
      goals: collective.settings.goals || [{}],
      paymentMethods: collective.paymentMethods || [{}]
    };

    this.showEditTiers = ['COLLECTIVE', 'EVENT'].includes(collective.type);
    this.showExpenses = collective.type === 'COLLECTIVE' || collective.isHost;
    this.showEditGoals = collective.type === 'COLLECTIVE';
    this.showHost = collective.type === 'COLLECTIVE';
    this.defaultTierType = collective.type === 'EVENT' ? 'TICKET' : 'TIER';
    this.showEditMembers = ['COLLECTIVE', 'ORGANIZATION'].includes(collective.type);
    this.showPaymentMethods = ['USER', 'ORGANIZATION'].includes(collective.type);
    this.members = collective.members && collective.members.filter(m => ['ADMIN','MEMBER'].includes(m.role));

    this.messages = defineMessages({
      'slug.label': { id: 'collective.slug.label', defaultMessage: 'Change your URL' },
      'type.label': { id: 'collective.type.label', defaultMessage: 'type' },
      'name.label': { id: 'collective.name.label', defaultMessage: 'name' },
      'tags.label': { id: 'collective.tags.label', defaultMessage: 'tags' },
      'tags.description': { id: 'collective.tags.description', defaultMessage: 'Make your collective discoverable in search and related collectives (comma separated)' },
      'company.label': { id: 'collective.company.label', defaultMessage: 'company' },
      'company.description': { id: 'collective.company.description', defaultMessage: 'Start with a @ to reference an organization (e.g. @airbnb)' },
      'amount.label': { id: 'collective.amount.label', defaultMessage: 'amount' },
      'description.label': { id: 'collective.description.label', defaultMessage: 'Short description' },
      'longDescription.label': { id: 'collective.longDescription.label', defaultMessage: 'Long description' },
      'expensePolicy.label': { id: 'collective.expensePolicy.label', defaultMessage: 'Expense policy' },
      'expensePolicy.description': { id: 'collective.expensePolicy.description', defaultMessage: 'It can be daunting for the community to file an expense. Help them by providing a clear expense policy to explain what they can expense.'  },
      'expensePolicy.placeholder': { id: 'collective.expensePolicy.placeholder', defaultMessage: 'E.g. Feel free to expense your public transport or Uber/Lyft drive for up to XX. You can also expense drinks and food for meetups for up to XX. For other types of expenses, feel free to ask us.' },
      'startsAt.label': { id: 'collective.startsAt.label', defaultMessage: 'start date and time' },
      'image.label': { id: 'collective.image.label', defaultMessage: 'Avatar' },
      'backgroundImage.label': { id: 'collective.backgroundImage.label', defaultMessage: 'Cover image' },
      'twitterHandle.label': { id: 'collective.twitterHandle.label', defaultMessage: 'Twitter' },
      'website.label': { id: 'collective.website.label', defaultMessage: 'Website' },
      'markdown.label': { id: 'collective.markdown.label', defaultMessage: 'Default editor' },
      'markdown.description': { id: 'collective.markdown.description', defaultMessage: 'Use markdown editor' },
      'sendInvoiceByEmail.label': { id: 'collective.sendInvoiceByEmail.label', defaultMessage: 'Invoices' },
      'sendInvoiceByEmail.description': { id: 'collective.sendInvoiceByEmail.description', defaultMessage: 'Automatically attach the PDF of your receipts to the monthly report email' },
      'location.label': { id: 'collective.location.label', defaultMessage: 'City' }
    });

    collective.backgroundImage = collective.backgroundImage || defaultBackgroundImage[collective.type];

    window.OC = { collective, state: this.state };
  }

  showSection(section) {
    window.location.hash = `#${section}`;
    this.setState({section});
  }

  componentDidMount() {
    const hash = window.location.hash;
    if (hash) {
      this.setState({ section: hash.substr(1) });
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.collective && (!this.props.collective || nextProps.collective.name != this.props.collective.name)) {
      this.setState({ collective: nextProps.collective, tiers: nextProps.collective.tiers });
    }
  }

  handleChange(fieldname, value) {
    const collective = {};
    collective[fieldname] = value;
    this.setState( { modified: true, collective: Object.assign({}, this.state.collective, collective) });
  }

  handleObjectChange(obj) {
    this.setState({ ...obj, modified: true });
    window.state = this.state;
  }

  async handleSubmit() {
    const collective = {
      ...this.state.collective,
      tiers: this.state.tiers,
      goals: this.state.goals,
      members: this.state.members,
      paymentMethods: this.state.paymentMethods
    };
    this.props.onSubmit(collective);
    this.setState({ modified: false })
  }

  render() {

    const { collective, loading, intl, LoggedInUser } = this.props;

    const isNew = !(collective && collective.id);
    const submitBtnLabel = loading ? "loading" : isNew ? "Create Event" : "Save";
    const defaultStartsAt = new Date;
    const type = collective.type.toLowerCase();
    defaultStartsAt.setHours(19);
    defaultStartsAt.setMinutes(0);

    this.fields = {
      info: [
        {
          name: 'name',
          placeholder: '',
          maxLength: 255
        },
        {
          name: 'company',
          placeholder: '',
          maxLength: 255,
          when: () => collective.type === 'USER'
        },
        {
          name: 'description',
          type: 'text',
          maxLength: 255,
          placeholder: ''
        },
        {
          name: 'twitterHandle',
          type: 'text',
          pre: 'https://twitter.com/',
          maxLength: 255,
          placeholder: ''
        },
        {
          name: 'website',
          type: 'text',
          maxLength: 255,
          placeholder: ''
        },
        // {
        //   name: 'location',
        //   placeholder: 'Search cities',
        //   type: 'location',
        //   options: {
        //     types: ['cities']
        //   }
        // },
        {
          name: 'longDescription',
          type: 'textarea',
          placeholder: '',
          description: 'Protip: you can use markdown'
        },
        {
          name: 'tags',
          maxLength: 128,
          type: 'text',
          placeholder: 'meetup, javascript'
        }
      ],
      images: [
        {
          name: 'image',
          type: 'dropzone',
          placeholder: 'Drop an image or click to upload',
          className: 'horizontal',
          when: () => this.state.section === 'images'
        },
        {
          name: 'backgroundImage',
          type: 'dropzone',
          placeholder: 'Drop an image or click to upload',
          className: 'horizontal',
          when: () => this.state.section === 'images'
        }
      ],
      expenses: [
        {
          name: 'expensePolicy',
          type: 'textarea',
          description: 'Protip: you can use markdown'
        }
      ],
      advanced: [
        {
          name: 'slug',
          pre: `https://opencollective.com/`,
          placeholder: '',
          when: () => this.state.section === 'advanced'
        },
        {
          name: 'sendInvoiceByEmail',
          type: 'switch',
          defaultValue: get(this.state.collective, 'settings.sendInvoiceByEmail'),
          when: () => this.state.section === 'advanced' && (collective.type === 'USER' || collective.type === 'ORGANIZATION')
        },
        {
          name: 'markdown',
          type: 'switch',
          defaultValue: get(this.state.collective, 'settings.editor') === 'markdown',
          when: () => this.state.section === 'advanced' && (collective.type === 'USER' || collective.type === 'COLLECTIVE')
        }
      ]
    }

    Object.keys(this.fields).map(fieldname => {
      this.fields[fieldname] = this.fields[fieldname].map(field => {
      if (this.messages[`${field.name}.label`]) {
        field.label = intl.formatMessage(this.messages[`${field.name}.label`]);
      }
      if (this.messages[`${field.name}.description`]) {
        field.description = intl.formatMessage(this.messages[`${field.name}.description`], collective);
      }
      if (this.messages[`${field.name}.placeholder`]) {
        field.placeholder = intl.formatMessage(this.messages[`${field.name}.placeholder`]);
      }
      return field;
      });
    });

    return (
      <div className="EditCollectiveForm">
        <style jsx>{`
        :global(.field) {
          margin: 1rem;
        }
        :global(label) {
          width: 150px;
          display: inline-block;
          vertical-align: top;
        }
        :global(input), select, :global(textarea) {
          width: 300px;
          font-size: 1.5rem;
        }

        .FormInputs {
          overflow: hidden;
        }

        .EditCollectiveForm :global(textarea[name=longDescription]) {
          height: 30rem;
        }

        .EditCollectiveForm :global(textarea[name=expensePolicy]) {
          height: 30rem;
        }

        .actions {
          margin: 5rem auto 1rem;
          text-align: center;
        }
        .backToProfile {
          font-size: 1.3rem;
          margin: 1rem;
        }
        `}</style>
        <style global jsx>{`
        section#location {
          margin-top: 0;
        }

        .image .InputTypeDropzone {
          width: 100px;
        }

        .backgroundImage-dropzone {
          max-width: 500px;
          overflow: hidden;
        }

        .user .image-dropzone {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          overflow: hidden
        }

        .menu {
          text-align:center;
          margin: 1rem 0 3rem 0;
        }
        `}</style>

        <Flex>
          <Box width={1/5} mr={4}>
            <MenuItem selected={this.state.section === 'info'} onClick={() => this.showSection('info')}>
              <FormattedMessage id="editCollective.menu.info" defaultMessage="info" />
            </MenuItem>
            <MenuItem selected={this.state.section === 'images'} onClick={() => this.showSection('images')}>
              <FormattedMessage id="editCollective.menu." defaultMessage="images" />
            </MenuItem>
            { this.showEditMembers &&
              <MenuItem selected={this.state.section === 'members'} onClick={() => this.showSection('members')}>
                <FormattedMessage id="editCollective.menu.members" defaultMessage="members" />
              </MenuItem>
            }
            { this.showEditGoals &&
              <MenuItem selected={this.state.section === 'goals'} onClick={() => this.showSection('goals')}>
                <FormattedMessage id="editCollective.menu.goals" defaultMessage="goals" />
              </MenuItem>
            }
            { this.showHost &&
              <MenuItem selected={this.state.section === 'host'} onClick={() => this.showSection('host')}>
                <FormattedMessage id="editCollective.menu.host" defaultMessage="Fiscal Host" />
              </MenuItem>
            }
            { this.showEditTiers &&
              <MenuItem selected={this.state.section === 'tiers'} onClick={() => this.showSection('tiers')}>
                <FormattedMessage id="editCollective.menu.tiers" defaultMessage="tiers" />
              </MenuItem>
            }
            { this.showExpenses &&
              <MenuItem selected={this.state.section === 'expenses'} onClick={() => this.showSection('expenses')}>
                <FormattedMessage id="editCollective.menu.expenses" defaultMessage="expenses" />
              </MenuItem>
            }
            { this.showPaymentMethods &&
              <MenuItem selected={this.state.section === 'paymentMethods'} onClick={() => this.showSection('paymentMethods')}>
                <FormattedMessage id="editCollective.menu.paymentMethods" defaultMessage="Payment Methods" />
              </MenuItem>
            }
            <MenuItem selected={this.state.section === 'connectedAccounts'} onClick={() => this.showSection('connectedAccounts')}>
              <FormattedMessage id="editCollective.menu.connectedAccounts" defaultMessage="Connected Accounts" />
            </MenuItem>
            { collective.type === 'COLLECTIVE' &&
            <MenuItem selected={this.state.section === 'export'} onClick={() => this.showSection('export')}>
              <FormattedMessage id="editCollective.menu.export" defaultMessage="export" />
            </MenuItem>
            }
            <MenuItem selected={this.state.section === 'advanced'} onClick={() => this.showSection('advanced')}>
              <FormattedMessage id="editCollective.menu.advanced" defaultMessage="advanced" />
            </MenuItem>
          </Box>

          <Box width={4/5}>

            <div className="FormInputs">
              { Object.keys(this.fields).map(section => this.state.section === section &&
                <div className="inputs" key={section}>
                  {this.fields[section].map((field) => (!field.when || field.when()) && <InputField
                    key={field.name}
                    className={field.className}
                    defaultValue={field.defaultValue || this.state.collective[field.name]}
                    validate={field.validate}
                    ref={field.name}
                    name={field.name}
                    label={field.label}
                    description={field.description}
                    options={field.options}
                    placeholder={field.placeholder}
                    type={field.type}
                    pre={field.pre}
                    context={this.state.collective}
                    onChange={(value) => this.handleChange(field.name, value)}
                    />)}
                </div>
              )}
              { this.state.section === 'members' &&
                <EditMembers title="Edit members" members={this.members} collective={collective} onChange={this.handleObjectChange} />
              }
              { this.state.section === 'tiers' &&
                <EditTiers
                  title="Tiers"
                  tiers={this.state.tiers}
                  collective={collective}
                  currency={collective.currency}
                  onChange={this.handleObjectChange}
                  defaultType={this.defaultTierType}
                  />
              }
              { this.state.section === 'goals' &&
                <EditGoals
                  title="goals"
                  goals={this.state.goals}
                  collective={collective}
                  currency={collective.currency}
                  onChange={this.handleObjectChange}
                  />
              }
              { this.state.section === 'host' &&
                <EditHost
                  collective={collective}
                  LoggedInUser={LoggedInUser}
                  onChange={this.handleObjectChange}
                  />
              }
              { this.state.section === 'paymentMethods' &&
                <EditPaymentMethods
                  paymentMethods={this.state.paymentMethods}
                  collective={collective}
                  onChange={this.handleObjectChange}
                  />
              }
              { this.state.section === 'connectedAccounts' &&
                <EditConnectedAccounts
                  collective={collective}
                  connectedAccounts={collective.connectedAccounts}
                  />
              }
              { this.state.section === 'export' &&
                <ExportData
                  collective={collective}
                  />
              }
            </div>

            { ['export', 'connectedAccounts', 'host'].indexOf(this.state.section) === -1 &&
              <div className="actions">
                <Button bsStyle="primary" type="submit" onClick={this.handleSubmit} disabled={loading || !this.state.modified} >{submitBtnLabel}</Button>
                <div className="backToProfile">
                  <Link route={`/${collective.slug}`}><a><FormattedMessage id="collective.edit.backToProfile" defaultMessage="or go back to the {type} page" values={{ type }} /></a></Link>
                </div>
              </div>
            }
          </Box>
        </Flex>

      </div>
    );
  }

}

export default withIntl(EditCollectiveForm);

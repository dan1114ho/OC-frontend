import withData from '../lib/withData';
import withIntl from '../lib/withIntl';
import React from 'react';
import CreateCollective from '../components/CreateCollective';
import { addGetLoggedInUserFunction, addCollectiveCoverData } from '../graphql/queries';
import Loading from '../components/Loading';

class CreateCollectivePage extends React.Component {

  static getInitialProps ({ query: { hostCollectiveSlug } }) {
    return { slug: hostCollectiveSlug }
  }

  constructor(props) {
    super(props);
    this.state = { loading: true };
  }

  async componentDidMount() {
    const { getLoggedInUser } = this.props;
    const LoggedInUser = getLoggedInUser && await getLoggedInUser();
    this.setState({ LoggedInUser, loading: false });
  }

  render() {

    const { data } = this.props;

    if (this.state.loading) {
      return (<Loading />)
    }

    return (
      <div>
        <CreateCollective host={data.Collective} LoggedInUser={this.state.LoggedInUser} />
      </div>
    );
  }
}

export default withData(withIntl(addGetLoggedInUserFunction(addCollectiveCoverData(CreateCollectivePage))));

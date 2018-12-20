import React from 'react';
import PropTypes from 'prop-types';
import {
  Card, CardBody, CardTitle, CardText, CardImg,
} from 'reactstrap';
import githubRequests from '../../helpers/data/githubRequests';
import './Profile.scss';

class Profile extends React.Component {
  state = {
    gitHubProfile: [],
  };

  static propTypes = {
    gitHubUserName: PropTypes.string,
    gitHubAccessToken: PropTypes.string,
  };

  componentDidMount() {
    const { gitHubUserName, gitHubAccessToken } = this.props;
    if (gitHubUserName && gitHubAccessToken) {
      githubRequests
        .getGitHubUser(gitHubUserName, gitHubAccessToken)
        .then((gitHubProfile) => {
          this.setState({ gitHubProfile });
        })
        .catch(error => console.error('There was an error getting the  github user info', error));
    }
  }

  render() {
    const { gitHubProfile } = this.state;
    console.log('Profile', gitHubProfile);
    return (
      <div className="Profile col-4">
        <Card>
          <CardImg
            top
            width="50%"
            src={gitHubProfile.avatar_url}
            alt="Card image cap"
            className="mx-auto"
          />
          <CardBody>
            <CardTitle>{gitHubProfile.name}</CardTitle>
            <CardText>{gitHubProfile.bio}</CardText>
            <CardText>
              <small className="text-muted">
                <a href={gitHubProfile.html_url} target="_blank" rel="noopener noreferrer">
                  {gitHubProfile.html_url}
                </a>
              </small>
            </CardText>
          </CardBody>
        </Card>
      </div>
    );
  }
}

export default Profile;

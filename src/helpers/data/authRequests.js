import firebase from 'firebase/app';
import 'firebase/auth';

const githubAuth = () => {
  const provider = new firebase.auth.GithubAuthProvider();
  return firebase.auth().signInWithPopup(provider);
};

const googleAuth = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  return firebase.auth().signInWithPopup(provider);
};

const logoutUser = () => firebase.auth().signOut();

export default { githubAuth, googleAuth, logoutUser };

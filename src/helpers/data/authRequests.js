import firebase from 'firebase/app';
import 'firebase/auth';

const githubAuth = () => {
  const provider = new firebase.auth.GithubAuthProvider();
  return firebase.auth().signInWithPopup(provider);
};

const logoutUser = () => firebase.auth().signOut();

const getCurrentUid = () => firebase.auth().currentUser.uid;

export default { githubAuth, logoutUser, getCurrentUid };

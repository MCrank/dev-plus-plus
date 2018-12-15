import firebase from 'firebase/app';
import 'firebase/auth';

// const authenticate = (authButton) => {
//   let provider = '';
//   if (authButton === 'github') {
//     provider = new firebase.auth.GithubAuthProvider();
//     // return firebase.auth().signInWithPopup(provider);
//   }
//   if (authButton === 'google') {
//     provider = new firebase.auth.GoogleAuthProvider();
//     // return firebase.auth().signInWithPopup(provider);
//   }
//   return firebase.auth().signInWithPopup(provider);
// };

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

import { getError } from './error.js';

export const getTheRoad = (state) => {
  window.history.pushState({}, '', state);
  const popstateEvent = new PopStateEvent('popstate', { state: {} });
  dispatchEvent(popstateEvent);
};

export const loginWithGoogle = (checkbox) => {
  const googleProvider = new firebase.auth.GoogleAuthProvider();
  if (checkbox.checked === true) {
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(() => {
      firebase.auth().signInWithPopup(googleProvider).then(() => {
        getTheRoad('/feed');
      }).catch((error) => {
        getError(error);
      });
    });
  } else {
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE).then(() => {
      firebase.auth().signInWithPopup(googleProvider).then(() => {
        getTheRoad('/feed');
      }).catch((error) => {
        getError(error);
      });
    });
  }
};

export const getPosts = (createAndPrintAllPosts) => {
  firebase.firestore().collection('posts').orderBy('data', 'desc').get()
    .then((snap) => {
      snap.forEach((post) => {
        createAndPrintAllPosts(post);
      });
    });
};

export const deletePost = (postID, loadPosts) => {
  firebase.firestore().collection('posts').doc(postID).delete()
    .then(() => {
      loadPosts();
    });
};

export const likePost = (postID, currentUserEmail) => {
  const likesPostId = firebase.firestore().collection('posts').doc(postID);
  const promiseResult = likesPostId.get().then(((post) => {
    const people = post.data().likes;
    if (people.length >= 1) {
      if (people.includes(currentUserEmail)) {
        likesPostId.update({
          likes: firebase.firestore.FieldValue.arrayRemove(currentUserEmail),
        });
        return 'deslike';
      }
      likesPostId
        .update({
          likes: firebase.firestore.FieldValue.arrayUnion(currentUserEmail),
        });
      return 'like';
    }
    likesPostId
      .update({
        likes: firebase.firestore.FieldValue.arrayUnion(currentUserEmail),
      });
    return 'like';
  })).catch((error) => {
    console.log(error);
  });
  return promiseResult;
};

export const commentPost = (postID, newCommentText, currentUserEmail) => {
  const commentPostId = firebase.firestore().collection('posts').doc(postID);
  const promiseResult = commentPostId.get().then((post) => {
    const comments = post.data().comments;
    if (newCommentText !== '') {
      const newComment = {
        owner: currentUserEmail,
        content: newCommentText,
        postOfOrigin: postID,
        commentLikes: [],
        id: postID + new Date().toLocaleString('pt-BR'),
        date: new Date().toLocaleString('pt-BR'),
      };
      commentPostId.update({ comments: firebase.firestore.FieldValue.arrayUnion(newComment) });
      const currentComments = comments.concat(newComment);
      return currentComments;
    }
    return comments;
  });
  return promiseResult;
};

export const showComments = (postID) => {
  const commentPostId = firebase.firestore().collection('posts').doc(postID);
  const promiseResult = commentPostId.get().then(((post) => {
    const comments = (post.data().comments);
    return comments;
  }));
  return promiseResult;
};
export const loginWithEmailAndPassword = (email, pass) => {
  firebase.auth().signInWithEmailAndPassword(email, pass).then(() => {
    getTheRoad('/feed');
  }).catch((error) => {
    getError(error);
  });
};

export const updateProfileName = (name) => {
  firebase.auth().currentUser.updateProfile({ displayName: name });
};

export const registerAccount = (email, password, name, checkbox) => {
  if (checkbox.checked === true) {
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(() => {
      firebase.auth().createUserWithEmailAndPassword(email, password).then(() => {
        updateProfileName(name);
        getTheRoad('/feed');
      }).catch((error) => {
        getError(error);
      });
    });
  } else {
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE).then(() => {
      firebase.auth().createUserWithEmailAndPassword(email, password).then(() => {
        updateProfileName(name);
        getTheRoad('/feed');
      }).catch((error) => {
        getError(error);
      });
    });
  }
};

export const resetPassword = (email) => {
  firebase.auth().sendPasswordResetEmail(email).then(() => {
  }).catch((error) => {
    getError(error);
  });
};

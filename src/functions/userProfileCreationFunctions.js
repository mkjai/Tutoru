import { auth } from "../firebase";
import { db } from "../firebase";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { arrayUnion, doc, getFirestore, writeBatch } from "firebase/firestore";



export async function createUser(email, password) {
  createUserWithEmailAndPassword(auth, email, password)
  .then(
    () =>
    console.log('created user 123' + auth.currentUser.uid)
  )
  .catch(
    () =>
    console.log('failed to create user')
  );
}

export async function createUserProfile(profileMap) {
  const user = auth.currentUser;
  if (user != null) {
    const updateUserProfile = writeBatch(db);
    
    updateUserProfile.set(doc(db, `users/${user.uid}`), profileMap)

    // for each item in profileMap.courses, create a new doc
    profileMap.courses.forEach(element => {
      updateUserProfile.set(doc(db, `explore/${element}/schools/${profileMap.school}`), 
        {
          students: arrayUnion(user.uid)
        }
      );
    });

    updateUserProfile.commit()
    .then(
      () =>
      console.log('successfully created user profile')
    )
    .catch(
      (error) => {
        console.log(error)
      }
    )
  }
  
}
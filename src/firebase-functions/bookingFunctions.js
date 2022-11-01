import { addDoc, arrayUnion, collection, getDoc, getDocs, increment, query, serverTimestamp, updateDoc, where } from 'firebase/firestore'
import { auth, db } from '../firebase'
import { doc } from 'firebase/firestore';
import { FaLessThan } from 'react-icons/fa';

// const auth.currentUser.uid = auth.currentUser.uid;
// const (await getDoc(doc(db, `users/${uid}`))).data() = (await getDoc(doc(db, `users/${uid}`))).data();
// console.log(auth.currentUser.uid);
// Creates new outgoing request to a tutor, with a message to tutor
export async function createOutgoingRequest(to, message, course) {
  const fromName = (await getDoc(doc(db, `users/${auth.currentUser.uid}`))).data().name;
  const toName = (await getDoc(doc(db, `users/${to}`))).data().name;
  const docRef = await addDoc(collection(db, 'requests'), {
    to: to,
    toName: toName,
    from: auth.currentUser.uid,
    fromName: fromName,
    timeCreated: serverTimestamp(),
    status: 'PENDING',
    messageToTutor: message,
    lessonCourse: course,
    StudentContactInfo: (await getDoc(doc(db, `users/${auth.currentUser.uid}`))).data().contactInfo,
  }) 
  return updateDoc(docRef, {
    requestId: docRef.id,
  })
}
// Checks if a request has already been made to this user
export async function doesRequestAlreadyExist(to) {
  const arr = (await getOutgoingRequests());
  let output = false;
  arr.forEach( item => {
    if (to == item.to) {
      output = true;
      return;
    }
  })
  return output;
  // let output = false;
  // getOutgoingRequests()
  // .then(
  //   (arr) => {
  //     arr.forEach(item => {
  //       if (to === item.to) {
  //         // console.log('already exists')
  //         output = true;
  //         return;
  //       }
  //     })
  //   }
  // )
  // .catch(
  //   e => {
  //     console.log('how lmao' + e)
  //   }
  // )
  // return output;
}

// Gets all outgoing requests currently made by this user.
// Also adds the current docID as a field, so that it's id can be
// passed into acceptIcomingRequest and rejectIncomingRequest later on
export async function getOutgoingRequests() {
  const q =  query(collection(db, 'requests'), where('from', '==', auth.currentUser.uid));
  const output = [];
  (await getDocs(q)).forEach(item => {
    // updateDoc(item, {requestID: item.id})
    output.push(item.data());
  });
  console.log(output)
  return output;
}

// Gets all incoming requests currently received by this user.
// Also adds the current docID as a field, so that it's id can be
// passed into acceptIcomingRequest and rejectIncomingRequest later on
export async function getIncomingRequests() {
  const requests = await getDocs(query(collection(db, 'requests'), where('to', '==', auth.currentUser.uid)));
  const output = [];
  requests.forEach(item => {
    // updateDoc(item, {requestID: item.id})
    output.push(item.data());
  });
  return output;
}

// Updates the request status to be accepted, and sends a message with contactInfo
// Also creates a new appointment with the student
export async function acceptIncomingRequest(requestId) {
  const requestDoc = await getDoc(doc(db, `requests/${requestId}`))
  console.log(requestDoc.data())
  await createNewAppointment(requestDoc.data().from, requestDoc.data().to);
  return updateDoc(requestDoc, {
    status: 'ACCEPTED',
    TutorContactInfo: (await getDoc(doc(db, `users/${auth.currentUser.uid}`))).data().contactInfo,
  })
}

// Updates the request status to be rejected, and sends a message
export async function rejectIncomingRequest(requestId) {
  const requestDoc = await getDoc(doc(db, `requests/${requestId}`))

  return updateDoc(requestDoc, {
    status: 'REJECTED',
  })
}

// Creates new appointment
async function createNewAppointment(student, tutor) {
  return addDoc(collection(db, 'appointments'), {
    student: student,
    tutor: tutor,
    done: false,
    timeCreated: serverTimestamp(),
  })
}

// Gets all current active appointments, where current user is the Student
// Also adds the current docID as a field, so that it's id can be
// passed into finishAppointment() later on
export async function getStudentAppointments() {
  const apts = await getDocs(query(collection('appointments'), where('student', '==', auth.currentUser.uid)));
  const output = [];
  apts.forEach(item => {
    updateDoc(item, {appointmentID: item.id});
    output.push(item.data());
  })
  return output;
}

// Gets all current active appointments, where current user is the Tutor
// Also adds the current docID as a field, so that it's id can be
// passed into finishAppointment() later on
export async function getTutorAppointments() {
  const apts = await getDocs(query(collection('appointments'), where('tutor', '==', auth.currentUser.uid)));
  const output = [];
  apts.forEach(item => {
    updateDoc(item, {appointmentID: item.id});
    output.push(item.data());
  })
  return output;
}

// Updates the Appointment status to done, only student can access
// Also rates the tutor
export async function finishAppointment(appointmentID, stars, review) {
  const appointmentDoc = await getDoc(db, `appointments/${appointmentID}`);
  const tutorDoc = await getDoc(db, `users/${appointmentDoc.data().tutor}`);
  
  // Finish appointment
  updateDoc(appointmentDoc, {
    done: true,
    timeFinished: serverTimestamp(),
  })

  // Rate Tutor
  updateDoc( tutorDoc, {
    completedSessions: increment(1),
    totalStars: increment(stars),
    reviews: arrayUnion({
      stars: stars,
      review: review,
    })
  })
}
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { 
    getFirestore, collection, addDoc, onSnapshot, query, orderBy 
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { 
    getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
  

const firebaseConfig = {
  apiKey: "AIzaSyBORS5sOI0KGvg3ZA4SQbJX4SOsRiSSZwY",
  authDomain: "tee-mee-df102.firebaseapp.com",
  projectId: "tee-mee-df102",
  storageBucket: "tee-mee-df102.firebasestorage.app",
  messagingSenderId: "232893838329",
  appId: "1:232893838329:web:230e68a069382911bf8328",
  measurementId: "G-ZY3S4YRD0J"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const messagesRef = collection(db, "messages");

  
let currentUser = null;
onAuthStateChanged(auth, user => {
  if (user) {
    currentUser = user;
    document.getElementById("userPic").src = user.photoURL;
    document.getElementById("userName").innerText = user.displayName;

    document.getElementById("login-screen").style.display = "none";
    document.getElementById("chat-screen").style.display = "flex";
    document.getElementById("logoutBtn").style.display = "flex";
  } else {
    document.getElementById("chat-screen").style.display = "none";
    document.getElementById("login-screen").style.display = "flex";
  }
});

  
document.getElementById("loginBtn").onclick = () => {
    signInWithPopup(auth, provider)
      .then(result => console.log("Logged in:", result.user))
      .catch(err => console.error(err));
};


document.getElementById("logoutBtn").onclick = () => {
  signOut(auth).then(() => {
    document.getElementById("chat-screen").style.display = "none";
    document.getElementById("login-screen").style.display = "flex";
  });
};

  // Send message
async function sendMessage(text) {
    if (!text.trim() || !currentUser) return;
    await addDoc(messagesRef, {
      text,
      createdAt: Date.now(),
      uid: currentUser.uid,
      name: currentUser.displayName
    });
}

  // Listen for new messages
const q = query(messagesRef, orderBy("createdAt"));
onSnapshot(q, snapshot => {
    const messagesEl = document.getElementById("messages");
    messagesEl.innerHTML = "";
    snapshot.forEach(doc => {
      const msg = doc.data();
      const div = document.createElement("div");
      div.classList.add("message-bubble");

      // Differentiate between sender and receiver
      if (msg.uid === (currentUser && currentUser.uid)) {
        div.classList.add("me");
      } else {
        div.classList.add("them");
      }

      div.innerHTML = `<strong>${msg.name}:</strong> ${msg.text}`;
      messagesEl.appendChild(div);
      messagesEl.scrollTop = messagesEl.scrollHeight;
    });
});

  // Button click
document.getElementById("sendBtn").onclick = () => {
    const input = document.getElementById("msgInput");
    sendMessage(input.value);
    input.value = "";
};
if (msg.uid === (currentUser && currentUser.uid)) {
  div.classList.add("me");
} else {
  div.classList.add("them");
}

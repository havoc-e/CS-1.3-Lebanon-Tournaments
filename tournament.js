import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
    getFirestore,
    collection,
    addDoc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

/* 🔧 YOUR FIREBASE CONFIG */
const firebaseConfig = {
    apiKey: "AIzaSyC0QKeV0zRj2OG_ixidIUISsIR95I7qiCU",
    authDomain: "cs13---lebanon.firebaseapp.com",
    databaseURL: "https://cs13---lebanon-default-rtdb.firebaseio.com",
    projectId: "cs13---lebanon",
    storageBucket: "cs13---lebanon.firebasestorage.app",
    messagingSenderId: "245930734900",
    appId: "1:245930734900:web:641ba43a8323d27c1ce161",
    measurementId: "G-N0S4T6JT68"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* COLLECTION REFERENCE */
const teamsCol = collection(db, "tournaments", "feb012026", "teams");

const form = document.getElementById("tournamentForm");
const abtalTableBody = document.querySelector("#abtalTable tbody");
const wasatTableBody = document.querySelector("#wasatTable tbody");

/* SUBMIT TEAM */
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const teamName = document.getElementById("teamName").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const playerInputs = document.querySelectorAll(".players input");
    const players = [...playerInputs].map(p => p.value.trim());
    const selectedLevel = document.querySelector('input[name="tournamentLevel"]:checked')?.value;


    if (!teamName || !phone || players.some(p => !p)) {
        alert("All fields are required");
        return;
    }

    if (!/^\d{8,}$/.test(phone)) {
        alert("Phone number must contain only digits and be at least 8 digits long");
        return;
    }

    try {
        await addDoc(teamsCol, {
            teamName,
            phone,
            players,
            selectedLevel,
            createdAt: serverTimestamp()
        });

        form.reset();
    } catch (err) {
        console.error(err);
        alert("Failed to register team");
    }
});

/* LIVE TEAMS TABLE */
const q = query(teamsCol, orderBy("createdAt", "asc"));

onSnapshot(q, (snapshot) => {
    abtalTableBody.innerHTML = "";
    wasatTableBody.innerHTML = "";


    let aIndex = 1;
    let bIndex = 1;

    snapshot.forEach((doc) => {
        const t = doc.data();

        const row = document.createElement("tr");
        row.innerHTML = `
        <td></td>        
        <td>${t.teamName}</td>
        <td>${t.players[0]}</td>
        <td>${t.players[1]}</td>
        <td>${t.players[2]}</td>
        <td>${t.players[3]}</td>
        <td>${t.players[4]}</td>
    `;

        //tableBody.appendChild(row);

        // Fill the correct table based on class
        if (t.selectedLevel === "ABTAL") {
            row.querySelector("td").textContent = aIndex++; // numbering            
            abtalTableBody.appendChild(row);
        } else if (t.selectedLevel === "WASAT") {
            row.querySelector("td").textContent = bIndex++;
            wasatTableBody.appendChild(row);
        }

    });
});

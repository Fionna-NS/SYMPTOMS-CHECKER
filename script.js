import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    updateDoc,
    doc,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const symptomInput = document.getElementById("symptomInput");
const symptomList = document.getElementById("symptomList");
const saveBtn = document.getElementById("saveBtn");

// --- SAVE ---
async function saveSymptom() {
    const symptom = symptomInput.value.trim();

    if (symptom === "") {
        alert("Please enter a symptom.");
        return;
    }

    try {
        await addDoc(collection(db, "symptoms"), {
            symptom: symptom,
            createdAt: new Date().toISOString()
        });

        symptomInput.value = "";
        symptomInput.focus();
        await getSymptoms();
    } catch (error) {
        console.error("Error saving symptom:", error);
        alert("Failed to save data. Check your Firebase console permissions.");
    }
}

// --- RETRIEVE AND DISPLAY (newest first, safe from HTML injection) ---
async function getSymptoms() {
    try {
        const q = query(collection(db, "symptoms"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        symptomList.innerHTML = "";

        querySnapshot.forEach(function (document) {
            symptomList.appendChild(
                buildListItem(document.id, document.data().symptom)
            );
        });
    } catch (error) {
        console.error("Error getting symptoms:", error);
    }
}

// Build one list item in "view" mode
function buildListItem(id, text) {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = text;

    const actions = document.createElement("div");
    actions.className = "actions";

    const editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.className = "edit-btn";
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", function () {
        showEditMode(li, id, text);
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", function () {
        deleteSymptom(id);
    });

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);
    li.appendChild(span);
    li.appendChild(actions);
    return li;
}

// Switch a list item to "edit" mode
function showEditMode(li, id, currentText) {
    li.innerHTML = "";

    const editInput = document.createElement("input");
    editInput.type = "text";
    editInput.value = currentText;
    editInput.className = "edit-input";

    const actions = document.createElement("div");
    actions.className = "actions";

    const updateBtn = document.createElement("button");
    updateBtn.type = "button";
    updateBtn.className = "edit-btn";
    updateBtn.textContent = "Update";
    updateBtn.addEventListener("click", function () {
        updateSymptom(id, editInput.value);
    });

    const cancelBtn = document.createElement("button");
    cancelBtn.type = "button";
    cancelBtn.className = "cancel-btn";
    cancelBtn.textContent = "Cancel";
    cancelBtn.addEventListener("click", function () {
        getSymptoms();
    });

    editInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter") updateSymptom(id, editInput.value);
        if (e.key === "Escape") getSymptoms();
    });

    actions.appendChild(updateBtn);
    actions.appendChild(cancelBtn);
    li.appendChild(editInput);
    li.appendChild(actions);
    editInput.focus();
}

// --- UPDATE ---
async function updateSymptom(id, newText) {
    const symptom = newText.trim();

    if (symptom === "") {
        alert("Symptom cannot be empty.");
        return;
    }

    try {
        await updateDoc(doc(db, "symptoms", id), { symptom: symptom });
        await getSymptoms();
    } catch (error) {
        console.error("Error updating symptom:", error);
        alert("Failed to update. Check your Firebase console permissions.");
    }
}

// --- DELETE ---
async function deleteSymptom(id) {
    try {
        await deleteDoc(doc(db, "symptoms", id));
        await getSymptoms();
    } catch (error) {
        console.error("Error deleting symptom:", error);
    }
}

// --- EVENTS ---
saveBtn.addEventListener("click", saveSymptom);
symptomInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") saveSymptom();
});

// --- INITIAL LOAD ---
getSymptoms();


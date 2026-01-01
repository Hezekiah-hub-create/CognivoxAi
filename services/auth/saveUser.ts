"use server"

import { User } from "@/types";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/services/firebase";


export async function saveUser(user: User) {

    try {
    // CHECK IF USER EXISTS IN DB
        const docRef = doc(db, "users", user.id);
        const currentUser = await getDoc(docRef);

        if (currentUser.exists()) {
            console.log("Document data:", currentUser.data());
            if (currentUser.data().email !== user.email || currentUser.data().name !== user.name || currentUser.data().image !== user.image) {
                // UPDATE USER DATA IF EMAIL NOT EXISTS
                await updateDoc(doc(db, "users", user.id),({
                    email: user.email,
                    name: user.name,
                    image: user.image,
                    updateAt: new Date(),
                }));
            } return {success: true};
        } else {
            // CREATE NEW USER IF NOT EXISTS
            await setDoc(doc(db, "users", user.id), {
                email: user.email,
                id: user.id,
                name: user.name,
                image: user.image,
                checkoutId:user.checkoutId || null,
                isPro:user.isPro || false,
                createdAt: new Date(),
                updateAt: new Date(),
            }); 
            return {success: true};
        }
    } catch (error) {
        return {success: false, error};
    }

    
}
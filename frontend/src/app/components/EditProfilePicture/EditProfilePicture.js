'use client'
import styles from "./EditProfilePicture.module.scss";
import ProfilePicture from "@/app/components/ProfilePicture/ProfilePicture";
import {useRef} from "react";
import UserService from "@/app/service/UserService";

export default function EditProfilePicture({user}){
    const fileInputRef = useRef(null);


    async function handleUpload(event) {
        const selectedPicture = event.target.files[0]
        if (!selectedPicture) {
            alert("Please select a picture first!");
            return;
        }
        try {
            await UserService.uploadAvatar(selectedPicture);
            location.reload();
        } catch (e) {
            alert(`Failed to upload new profile picture: ${e.message}`);
        }
    };

    return (
        <div className={styles.profilePictureWrapper}>
            <ProfilePicture user={user} size="100"></ProfilePicture>
            <input
                type="file"
                ref={fileInputRef}
                style={{display: 'none'}}
                onChange={handleUpload}
            />
            <button
                onClick={()=>{fileInputRef.current.click();}}
                type="button"
                className="primary round"
            >edit
            </button>
        </div>
    )
}
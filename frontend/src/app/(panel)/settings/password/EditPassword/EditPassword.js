'use client'
import styles from "./EditPassword.module.scss";
import {z} from "zod";
import {useActionState} from "react";
import UserService from "@/app/service/UserService";
import {useFormStatus} from "react-dom";

// TODO make global schemas place?
const passwordChangeSchema = z.object({
    oldPassword: z.string().min(1, "old password cannot be empty"),
    newPassword: z.string().min(1, "new password cannot be empty"),
    confirmNewPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
    path: ["confirmNewPassword"],
    message: "passwords do not match",
});

async function changePassword(state, formData) {
    const passwordData = {
        oldPassword: formData.get('oldPassword'),
        newPassword: formData.get('newPassword'),
        confirmNewPassword: formData.get('confirmNewPassword'),
    };

    const validatedFields = passwordChangeSchema.safeParse(passwordData)
    if (!validatedFields.success) return {filedErrors: validatedFields.error.flatten().fieldErrors}

    try{
        await UserService.changePassword(formData.get('oldPassword'), formData.get("newPassword"));
        // TODO make the password update notification better
        alert("password updated")
    } catch (e) {
        return {error: e.message};
    }
    return {};
}

function SubmitButton({text}) {
    const {pending} = useFormStatus()
    return (
        <button className="primary round" disabled={pending} type="submit">
            {pending ? "Loading..." : text}
        </button>
    )
}

export default function EditPassword() {
    const [actionState, action] = useActionState(changePassword, {})
    const {error, filedErrors} = actionState;

    return (
        <div className={styles.editPasswordWrapper}>
            <form action={action}>
                <div className={styles.inputList}>
                    <div className="input-wrapper">
                        <p className="heading">old password</p>
                        <input
                            name="oldPassword"
                            type="password"
                            className="primary"
                            autoComplete="current-password"
                        />
                        <p className={styles.error}>{filedErrors?.oldPassword ? filedErrors.oldPassword : ""}</p>
                    </div>
                    <div className="input-wrapper">
                        <p className="heading">new password</p>
                        <input
                            name="newPassword"
                            type="password"
                            className="primary"
                            autoComplete="off"
                        />
                        <p className={styles.error}>{filedErrors?.newPassword ? filedErrors.newPassword : ""}</p>
                    </div>
                    <div className="input-wrapper">
                        <p className="heading">confirm new password</p>
                        <input
                            name="confirmNewPassword"
                            type="password"
                            className="primary"
                            autoComplete="new-password"
                        />
                        <p className={styles.error}>{filedErrors?.confirmNewPassword ? filedErrors.confirmNewPassword : ""}</p>
                    </div>
                </div>
                <SubmitButton text="update password"></SubmitButton>
                <p className={styles.error}>{error ? error : ""}&nbsp;</p>
            </form>
        </div>
    )
}
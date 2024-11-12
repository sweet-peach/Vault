'use client'
import generalStyles from "./../Settings.module.scss"
import EditPassword from "@/app/(panel)/settings/password/EditPassword/EditPassword";

export default function Account() {

    return (
        <div className={generalStyles.settingsList}>
            <div className={generalStyles.settingBlock}>
                <div className={generalStyles.heading}>password</div>
                <EditPassword></EditPassword>
            </div>
        </div>
    );
}

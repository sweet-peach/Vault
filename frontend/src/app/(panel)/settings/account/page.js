import styles from "./Account.module.scss"
import generalStyles from "./../Settings.module.scss"
import {getUserDataFromServer} from "@/app/lib/getUserFromServer";
import EditProfilePicture from "@/app/components/EditProfilePicture/EditProfilePicture";

export default async function Account() {
    // TODO Implement caching to avoid repetitive requests
    const user = await getUserDataFromServer();

    return (
        <div className={generalStyles.settingsList}>
            <div className={generalStyles.settingBlock}>
                <div className={generalStyles.heading}>profile picture</div>
                <EditProfilePicture user={user}></EditProfilePicture>
            </div>
            {/*<div className={`${generalStyles.settingBlock} ${styles.passwordBlock}`}>*/}
            {/*    <div className={generalStyles.heading}>email</div>*/}
            {/*    <form action="">*/}
            {/*        <input className="primary" defaultValue={user.email} type="text"/>*/}
            {/*        <button type="submit" className="primary round">save</button>*/}
            {/*    </form>*/}
            {/*</div>*/}
        </div>
    );
}

import {getUserDataFromServer} from "@/app/lib/getUserFromServer";
import {redirect} from "next/navigation";

export default async function Home() {

    const user = await getUserDataFromServer();

    if (user) {
        redirect('/drive');
    } else {
        redirect('/auth');
    }

    return (
        <>
        </>
    );
}

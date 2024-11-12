import Image from "next/image";
import styles from "./ProfilePicture.module.scss";

export default function ProfilePicture({user, size}) {
    const src = user.avatar ? `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/avatar/${user.avatar}` : "/no-avatar.svg";

    return (
        <Image
            aria-hidden
            src={src}
            alt="User avatar"
            width={size}
            height={size}
        />
    );
}
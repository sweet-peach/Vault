'use client';
import styles from "./NavigationTransition.module.scss";
import {Suspense, useTransition} from "react";
import Image from "next/image";

export default function NavigationTransition({children}) {
    const [isPending, startTransition] = useTransition();
    //TODO NavigationLoader should not cover the page during the transition
    return (
        <>{children}</>
        // <Suspense fallback={<NavigationLoader />}>
        //     {isPending && <NavigationLoader/>}
        // </Suspense>
    )
}
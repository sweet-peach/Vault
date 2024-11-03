'use client'

import {useActionState} from "react";
import {handleAuthentication} from "@/app/auth/actions/handleAuthentication";
import {useFormStatus} from "react-dom";

function SubmitButton() {
    const {pending} = useFormStatus()

    return (
        <button disabled={pending} type="submit">
            Continue
        </button>
    )
}

export default function Auth() {
    const [state, action] = useActionState(handleAuthentication, {})


    if(state.login){
        return (
            <>
                <form action={action}>
                    <div>
                        <label htmlFor="email">Email</label>
                        <input id="email" name="email" placeholder="Name"/>
                    </div>
                    {state?.errors?.email && <p>{state.errors.email}</p>}

                    <SubmitButton/>
                </form>
            </>
        );
    }
    if(state.register){

    }
    return (
        <>
            <form action={action}>
                <div>
                    <label htmlFor="email">Email</label>
                    <input id="email" name="email" placeholder="Name"/>
                </div>
                {state?.errors?.email && <p>{state.errors.email}</p>}

                <SubmitButton/>
            </form>
        </>
    );
}

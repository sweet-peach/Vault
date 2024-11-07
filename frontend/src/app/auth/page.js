'use client'

import {useActionState, useState} from "react";
import {useFormStatus} from "react-dom";
import {handleCheckEmail, handleLogin, handleRegister} from "@/app/auth/actions";

function EmailForm({setStep, setEmail, email}) {
    const [actionState, action] = useActionState(async (state, formData) => {
        return await handleCheckEmail(state, formData, setStep, setEmail)
    }, {})
    const {errors} = actionState;

    return (
        <form action={action}>
            <input
                id="email"
                defaultValue={email}
                name="email"
                type="email"
                placeholder="Enter your email"
            />
            {errors?.email && <p className="error">{errors.email}</p>}
            <SubmitButton/>
        </form>
    );
}

function RegisterForm({setStep, email}) {
    const [actionState, action] = useActionState(handleRegister, {})
    const {errors} = actionState;

    return (
        <form action={action}>
            <input type="hidden" name="email" defaultValue={email}/>
            <input id="password" name="password" type="password" placeholder="Enter password"/>
            {errors?.password && <p className="error">{errors.password}</p>}
            <SubmitButton/>
        </form>
    );

}

function LoginForm({setStep, email}) {
    const [actionState, action] = useActionState(handleLogin, {})
    const {errors} = actionState;

    return (
        <form action={action}>
            <input type="hidden" name="email" defaultValue={email}/>
            <input id="password" name="password" type="password" placeholder="Enter password"/>
            {errors?.password && <p className="error">{errors.password}</p>}
            <SubmitButton/>
        </form>
    );
}

function SubmitButton() {
    const {pending} = useFormStatus()

    return (
        <button disabled={pending} type="submit">
            Continue
        </button>
    )
}

export default function Auth() {
    const [email, setEmail] = useState("");
    const [step, setStep] = useState("email");

    if (step === 'email') {
        return <EmailForm setStep={setStep} email={email} setEmail={setEmail}/>;
    }
    if (step === 'register') {
        return <RegisterForm setStep={setStep} email={email}/>;
    }
    if (step === 'login') {
        return <LoginForm setStep={setStep} email={email}/>;
    }
}

import {z} from 'zod';
import AuthenticationService from "@/app/service/AuthenticationService";
const EmailSchema = z.string().email({message: 'Please enter a valid email'}).trim();
const PasswordSchema= z.string({message: 'Please enter a valid password'})


export async function handleCheckEmail(state, formData, setStep, setEmail){
    const email = formData.get('email');

    const validatedFields = EmailSchema.safeParse(email)
    if (!validatedFields.success) return {errors: validatedFields.error.flatten().fieldErrors}

    try {
        const {found} = await AuthenticationService.checkEmailExistence(email);
        setEmail(email);
        if(found){
            setStep('login')
        } else{
            setStep('register')
        }
    } catch (e) {
        return {errors: {request: e}}
    }
    return {};
}


export async function handleLogin(state, formData){
    const email = formData.get('email');
    const password = formData.get('password');

    const validatedFields = PasswordSchema.safeParse(password)
    if (!validatedFields.success) return {errors: validatedFields.error.flatten().fieldErrors}

    try {
        const data = await AuthenticationService.login(email, password);
        console.log("redirect");
        window.document.location = "/drive"
    } catch (e) {
        return {errors: {request: e}}
    }
}


export async function handleRegister(state, formData){
    const email = formData.get('email');
    const password = formData.get('password');

    const validatedFields = PasswordSchema.safeParse(password)
    if (!validatedFields.success) return {errors: validatedFields.error.flatten().fieldErrors}

    try {
        const data = await AuthenticationService.register(email, password);
        window.document.location = "/drive"
    } catch (e) {
        return {errors: {request: e}}
    }
}
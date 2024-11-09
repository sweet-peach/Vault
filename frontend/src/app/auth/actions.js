import {z} from 'zod';
import AuthenticationService from "@/app/service/AuthenticationService";
const EmailSchema = z.string().email({message: 'Please enter a valid email'}).trim();
const PasswordSchema= z
    .string({message: 'Please enter a valid password'})
    .trim()
    .min(1, { message: 'Password cannot be empty' });


export async function handleCheckEmail(state, formData, setStep, setEmail){
    const email = formData.get('email');

    const validatedFields = EmailSchema.safeParse(email)
    if (!validatedFields.success) {
        return {errors: {email: validatedFields.error.flatten().formErrors}}
    }


    try {
        const {found} = await AuthenticationService.checkEmailExistence(email);
        setEmail(email);
        if(found){
            setStep('login')
        } else{
            setStep('register')
        }
    } catch (e) {
        return {errors: {request: e.message}}
    }
    return {};
}


export async function handleLogin(state, formData){
    const email = formData.get('email');
    const password = formData.get('password');

    const validatedFields = PasswordSchema.safeParse(password)
    if (!validatedFields.success) return {errors: {password:validatedFields.error.flatten().formErrors}}

    try {
        const data = await AuthenticationService.login(email, password);
        window.document.location = "/drive"
    } catch (e) {
        return {errors: {request: e.message}}
    }
    return {};
}


export async function handleRegister(state, formData){
    const email = formData.get('email');
    const password = formData.get('password');

    const validatedFields = PasswordSchema.safeParse(password)
    if (!validatedFields.success) return {errors: {password: validatedFields.error.flatten().formErrors}}

    try {
        const data = await AuthenticationService.register(email, password);
        window.document.location = "/drive"
    } catch (e) {
        return {errors: {request: e.message}}
    }
    return {};
}
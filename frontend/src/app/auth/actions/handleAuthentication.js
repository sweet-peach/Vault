import {z} from 'zod';
import axiosClient from "@/app/lib/axiosClient";

const SignupFormSchema = z.object({
    email: z.string().email({message: 'Please enter a valid email.'}).trim()
})


export async function handleAuthentication(state, formData) {

    if (!state.email) {
        const validatedFields = SignupFormSchema.safeParse({
            email: formData.get('email'),
        })

        if (!validatedFields.success) {
            return {
                errors: validatedFields.error.flatten().fieldErrors,
            }
        }
    }

    if (state.login) {

    }

    if (state.register) {

    }


    // console.log("Proceed with authentication");
    // return {
    //     login: true
    // }
}
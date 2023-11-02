"use server"

import {connectToDatabase} from "@/lib/database";
import {User} from "@/models";

export async function getUserById(params: any) {
    try {
        await connectToDatabase();

        const { userId } = params;

        return await User.findOne({clerkId: userId});
    } catch (error) {
        console.log(error);
        throw error;
    }
}
"use server"

import {connectToDatabase} from "@/lib/database";
import {Question, User} from "@/models";
import {CreateUserParams, DeleteUserParams, UpdateUserParams} from "@/lib/actions/shared.types";
import {revalidatePath} from "next/cache";

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

export async function createUser(userData: CreateUserParams){
    try {
        await connectToDatabase();
        return await User.create(userData);
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function updateUser(params: UpdateUserParams){
    try {
        await connectToDatabase();
        const {clerkId, updateData, path} = params;
        await User.findOneAndUpdate({clerkId}, updateData, {
            new: true
        })
        revalidatePath(path);
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function deleteUser(params: DeleteUserParams){
    try {
        await connectToDatabase();
        const {clerkId} = params

        const user = await User.findOneAndDelete({clerkId});
        if(!user){
            throw new Error('User not found');
        }

        //Delete everything related to user
        const userQuestionIds = await Question.find({author: user._id}).distinct('_id')
        await Question.deleteMany({author: user._id});

        // TODO: delete user answers, comments etc.

        return await User.findByIdAndDelete(user._id);

    } catch (error) {
        console.log(error);
        throw error;
    }
}
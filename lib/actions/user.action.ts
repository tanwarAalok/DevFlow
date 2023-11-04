"use server"

import {connectToDatabase} from "@/lib/database";
import {Question, Tag, User} from "@/models";
import {
    CreateUserParams,
    DeleteUserParams,
    GetAllUsersParams, GetSavedQuestionsParams,
    GetUserByIdParams,
    ToggleSaveQuestionParams,
    UpdateUserParams
} from "@/lib/actions/shared.types";
import {revalidatePath} from "next/cache";

export async function getAllUsers(params: GetAllUsersParams) {
    try {
        await connectToDatabase();
        const users =  await User.find({});
        return {users};
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getUserById(params: GetUserByIdParams) {
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
        // const userQuestionIds = await Question.find({author: user._id}).distinct('_id')
        await Question.deleteMany({author: user._id});

        // TODO: delete user answers, comments etc.

        return await User.findByIdAndDelete(user._id);

    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function toggleSaveQuestion(params: ToggleSaveQuestionParams) {
    try {
        await connectToDatabase();

        const { userId, questionId, path } = params;

        const user = await User.findById(userId);

        if(!user) {
            throw new Error('User not found');
        }

        const isQuestionSaved = user.saved.includes(questionId);

        if(isQuestionSaved) {
            // remove question from saved
            await User.findByIdAndUpdate(userId,
                { $pull: { saved: questionId }},
                { new: true }
            )
        } else {
            // add question to saved
            await User.findByIdAndUpdate(userId,
                { $addToSet: { saved: questionId }},
                { new: true }
            )
        }

        revalidatePath(path)
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getSavedQuestions(params: GetSavedQuestionsParams) {
    try {
        await connectToDatabase();

        const { clerkId, searchQuery, filter, page = 1, pageSize = 20 } = params;

        // const skipAmount = (page - 1) * pageSize;
        //
        // const query: FilterQuery<typeof Question> = searchQuery
        //     ? { title: { $regex: new RegExp(searchQuery, 'i') } }
        //     : { };
        //
        // let sortOptions = {};

        // switch (filter) {
        //     case "most_recent":
        //         sortOptions = { createdAt: -1 }
        //         break;
        //     case "oldest":
        //         sortOptions = { createdAt: 1 }
        //         break;
        //     case "most_voted":
        //         sortOptions = { upvotes: -1 }
        //         break;
        //     case "most_viewed":
        //         sortOptions = { views: -1 }
        //         break;
        //     case "most_answered":
        //         sortOptions = { answers: -1 }
        //         break;
        //
        //     default:
        //         break;
        // }

        const user = await User
            .findOne({ clerkId })
            .populate({
                path: 'saved',
                // match: query,
                // options: {
                //     sort: sortOptions,
                //     skip: skipAmount,
                //     limit: pageSize + 1,
                // },
                populate: [
                    { path: 'tags', model: Tag, select: "_id name" },
                    { path: 'author', model: User, select: '_id clerkId name picture'}
                ]
            })

        const isNext = user.saved.length > pageSize;

        if(!user) {
            throw new Error('User not found');
        }

        const savedQuestions = user.saved;

        return { questions: savedQuestions, isNext };
    } catch (error) {
        console.log(error);
        throw error;
    }
}
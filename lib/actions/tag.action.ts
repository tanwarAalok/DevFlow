"use server"

import {GetAllTagsParams, GetQuestionsByTagIdParams, GetTopInteractedTagsParams} from "@/lib/actions/shared.types";
import {connectToDatabase} from "@/lib/database";
import {User, Tag, Question} from "@/models";
import {FilterQuery} from "mongoose";
import {ITag} from "@/models/tag.model";

export async function getTopInteractedTags(params: GetTopInteractedTagsParams) {
    try {
        await connectToDatabase();

        const { userId } = params;

        const user = await User.findById(userId);

        if(!user) throw new Error("User not found");

        // Find interactions for the user and group by tags...
        // Interaction...

        return [ {_id: '1', name: 'tag'}, {_id: '2', name: 'tag2'}]
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getAllTags(params: GetAllTagsParams){
    try{
        await connectToDatabase();
        const tags = await Tag.find({});
        return {tags};
    }catch (error) {
        console.log(error);
        throw error;
    }

}

export async function getQuestionsByTagId(params: GetQuestionsByTagIdParams) {
    try {
        await connectToDatabase();

        const { tagId, page = 1, pageSize = 10, searchQuery } = params;
        const skipAmount = (page - 1) * pageSize;

        const tagFilter: FilterQuery<ITag> = { _id: tagId};

        const tag = await Tag.findOne(tagFilter).populate({
            path: 'questions',
            model: Question,
            match: searchQuery
                ? { title: { $regex: searchQuery, $options: 'i' }}
                : {},
            options: {
                sort: { createdAt: -1 },
                skip: skipAmount,
                limit: pageSize + 1 // +1 to check if there is next page
            },
            populate: [
                { path: 'tags', model: Tag, select: "_id name" },
                { path: 'author', model: User, select: '_id clerkId name picture'}
            ]
        })
        if(!tag) {
            throw new Error('Tag not found');
        }

        const isNext = tag.questions.length > pageSize;

        const questions = tag.questions;

        return { tagTitle: tag.name, questions, isNext };

    } catch (error) {
        console.log(error);
        throw error;
    }
}
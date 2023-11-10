"use server"

import {GetAllTagsParams, GetQuestionsByTagIdParams, GetTopInteractedTagsParams} from "@/lib/actions/shared.types";
import {connectToDatabase} from "@/lib/database";
import {Interaction, Question, Tag, User} from "@/models";
import {FilterQuery} from "mongoose";
import {ITag} from "@/models/tag.model";

export async function getTopInteractedTags(params: GetTopInteractedTagsParams) {
    try {
        await connectToDatabase();

        const { userId } = params;

        const user = await User.findById(userId);

        if(!user) throw new Error("User not found");

        // Find the user's interactions
        const userInteractions = await Interaction.find({ user: user._id })
            .populate("tags")
            .exec();

        // Extract tags from user's interactions
        const userTags = userInteractions.reduce((tags, interaction) => {
            if (interaction.tags) {
                tags = tags.concat(interaction.tags);
            }
            return tags;
        }, []);

        // Get distinct tag IDs from user's interactions
        const distinctUserTagIds = [
            // @ts-ignore
            ...new Set(userTags.map((tag: any) => tag._id)),
        ];

        const query: FilterQuery<typeof Tag> = {
            $and: [
                { _id: { $in: distinctUserTagIds } },
                {$project: {_id: 1, name: 1}}
            ],
        };

        return await Tag.find(query);

        // Find interactions for the user and group by tags...
        // Interaction...

        // return [ {_id: '1', name: 'tag'}, {_id: '2', name: 'tag2'}]
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getAllTags(params: GetAllTagsParams){
    try{
        await connectToDatabase();

        const { searchQuery, filter, page = 1, pageSize = 10 } = params;
        const skipAmount = (page - 1) * pageSize;

        const query: FilterQuery<typeof Tag> = {};

        if(searchQuery) {
            query.$or = [{name: { $regex: new RegExp(searchQuery, 'i')}}]
        }

        let sortOptions = {};

        switch (filter) {
            case "popular":
                sortOptions = { questions: -1 }
                break;
            case "recent":
                sortOptions = { createdAt: -1 }
                break;
            case "name":
                sortOptions = { name: 1 }
                break;
            case "old":
                sortOptions = { createdAt: 1 }
                break;

            default:
                break;
        }

        const totalTags = await Tag.countDocuments(query);

        const tags = await Tag.find(query)
            .sort(sortOptions)
            .skip(skipAmount)
            .limit(pageSize);

        const isNext = totalTags > skipAmount + tags.length;

        return { tags, isNext }
    }catch (error) {
        console.log(error);
        throw error;
    }

}

export async function  getQuestionsByTagId(params: GetQuestionsByTagIdParams) {
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

export async function getTopPopularTags() {
    try {
        await connectToDatabase();

        const popularTags = await Tag.aggregate([
            { $project: { name: 1, numberOfQuestions: { $size: "$questions" }}},
            { $sort: { numberOfQuestions: -1 }},
            { $limit: 5 }
        ])

        return popularTags;
    } catch (error) {
        console.log(error);
        throw error;
    }
}
"use server"

import {revalidatePath} from "next/cache";
import {Answer, Interaction, Question, User} from "@/models";
import {connectToDatabase} from "@/lib/database";
import {AnswerVoteParams, CreateAnswerParams, DeleteAnswerParams, GetAnswersParams} from "@/lib/actions/shared.types";

export async function getAnswers(params: GetAnswersParams) {
    try{
        await connectToDatabase();

        const { questionId, sortBy, page = 1, pageSize = 10 } = params;

        const skipAmount = (page - 1) * pageSize;

        let sortOptions = {};

        switch (sortBy) {
            case "highestUpvotes":
                sortOptions = { upvotes: -1 }
                break;
            case "lowestUpvotes":
                sortOptions = { upvotes: 1 }
                break;
            case "recent":
                sortOptions = { createdAt: -1 }
                break;
            case "old":
                sortOptions = { createdAt: 1 }
                break;

            default:
                break;
        }

        const answers = await Answer.find({ question: questionId })
            .populate("author", "_id clerkId name picture")
            .sort(sortOptions)
            .skip(skipAmount)
            .limit(pageSize);

        const totalAnswer = await Answer.countDocuments({
            question: questionId
        })

        const isNextAnswer = totalAnswer > skipAmount + answers.length;

        return { answers, isNextAnswer };
    } catch (error) {
        console.log(error);
        throw error;
    }
}
export async function createAnswer(params: CreateAnswerParams) {
    try {
        await connectToDatabase();

        const { content, author, question, path } = params;

        const newAnswer = await Answer.create({ content, author, question });

        // Add the answer to the question's answers array
        const questionObject = await Question.findByIdAndUpdate(question, {
            $push: { answers: newAnswer._id}
        })

        await Interaction.create({
            user: author,
            action: "answer",
            question,
            answer: newAnswer._id,
            tags: questionObject.tags
        })

        await User.findByIdAndUpdate(author, { $inc: { reputation: 10 }})

        revalidatePath(path)
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function upvoteAnswer(params: AnswerVoteParams) {
    try {
        await connectToDatabase();

        const { answerId, userId, hasupVoted, hasdownVoted, path } = params;

        let updateQuery = {};

        if(hasupVoted) {
            updateQuery = { $pull: { upvotes: userId }}
        } else if (hasdownVoted) {
            updateQuery = {
                $pull: { downvotes: userId },
                $push: { upvotes: userId }
            }
        } else {
            updateQuery = { $addToSet: { upvotes: userId }}
        }

        const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, { new: true });

        if(!answer) {
            throw new Error("Answer not found");
        }

        // Increment author's reputation
        await User.findByIdAndUpdate(userId, {
            $inc: { reputation: hasupVoted ? -2 : 2 }
        })

        await User.findByIdAndUpdate(answer.author, {
            $inc: { reputation: hasupVoted ? -10 : 10 }
        })


        revalidatePath(path);
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function downvoteAnswer(params: AnswerVoteParams) {
    try {
        await connectToDatabase();

        const { answerId, userId, hasupVoted, hasdownVoted, path } = params;

        let updateQuery = {};

        if(hasdownVoted) {
            updateQuery = { $pull: { downvote: userId }}
        } else if (hasupVoted) {
            updateQuery = {
                $pull: { upvotes: userId },
                $push: { downvotes: userId }
            }
        } else {
            updateQuery = { $addToSet: { downvotes: userId }}
        }

        const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, { new: true });

        if(!answer) {
            throw new Error("Answer not found");
        }

        // Increment author's reputation
        await User.findByIdAndUpdate(userId, {
            $inc: { reputation: hasdownVoted ? -2 : 2 }
        })

        await User.findByIdAndUpdate(answer.author, {
            $inc: { reputation: hasdownVoted ? -10 : 10 }
        })

        revalidatePath(path);
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function deleteAnswer(params: DeleteAnswerParams) {
    try {
        await connectToDatabase();

        const { answerId, path } = params;

        const answer = await Answer.findById(answerId);

        if(!answer) {
            throw new Error("Answer not found");
        }

        await answer.deleteOne({ _id: answerId });
        await Question.updateMany({ _id: answer.question }, { $pull: { answers: answerId }});
        await Interaction.deleteMany({ answer: answerId });

        revalidatePath(path);
    } catch (error) {
        console.log(error);
    }
}
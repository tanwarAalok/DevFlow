"use server"

import {connectToDatabase} from "@/lib/database";
import {CreateQuestionParams} from "@/lib/actions/shared.types";
import {Question, Tag, Interaction, User} from "@/models"

export async function createQuestion(params: CreateQuestionParams) {
    try {
        await connectToDatabase();

        const { title, content, tags, author, path } = params;

        // Create the question
        const question = await Question.create({
            title,
            content,
            author
        });

        const tagDocuments = [];

        // Create the tags or get them if they already exist
        for (const tag of tags) {
            const existingTag = await Tag.findOneAndUpdate(
                { name: { $regex: new RegExp(`^${tag}$`, "i") } },
                { $setOnInsert: { name: tag }, $push: { questions: question._id } },
                { upsert: true, new: true }
            )

            tagDocuments.push(existingTag._id);
        }

        await Question.findByIdAndUpdate(question._id, {
            $push: { tags: { $each: tagDocuments }}
        });

        // Create an interaction record for the user's ask_question action
        await Interaction.create({
            user: author,
            action: "ask_question",
            question: question._id,
            tags: tagDocuments,
        })

        // Increment author's reputation by +5 for creating a question
        await User.findByIdAndUpdate(author, { $inc: { reputation: 5 }})

        // revalidatePath(path)
    } catch (error) {
        console.log(error);
    }
}
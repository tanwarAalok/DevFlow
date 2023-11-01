import Link from "next/link";
import {Button} from "@/components/ui/button";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import Filter from "@/components/shared/Filter";
import { HomePageFilters } from "@/constants/filters";
import HomeFilters from "@/components/home/HomeFilters";
import QuestionCard from "@/components/cards/QuestionCard";
import NoResult from "@/components/shared/NoResult";

const questions = [
    {
        "_id": "1",
        "title": "What is the difference between a function and a method in JavaScript?",
        "tags": [
            {
                "_id": "1",
                "name": "javascript",
            },
            {
                "_id": "2",
                "name": "programming",
            },
        ],
        "author": {
            "_id": "1",
            "name": "John Doe",
            "picture": "https://randomuser.me/api/portraits/men/75.jpg",
            "clerkId": "1234567890",
        },
        "upvotes": ["1", "2", "3"],
        "views": 1000000,
        "answers": [
            {
                "_id": "1",
                "content": "A function is a block of code that can be reused throughout a program. A method is a function that is attached to an object.",
                "author": {
                    "_id": "2",
                    "name": "Jane Doe",
                    "picture": "https://randomuser.me/api/portraits/women/75.jpg",
                    "clerkId": "9876543210",
                },
                "createdAt": new Date(),
            },
        ],
        "createdAt": new Date(),
    },
    {
        "_id": "2",
        "title": "How do I use loops in JavaScript?",
        "tags": [
            {
                "_id": "1",
                "name": "javascript",
            },
            {
                "_id": "3",
                "name": "programming-concepts",
            },
        ],
        "author": {
            "_id": "3",
            "name": "Peter Smith",
            "picture": "https://randomuser.me/api/portraits/men/10.jpg",
            "clerkId": "1111111111",
        },
        "upvotes": ["4", "5", "6"],
        "views": 200,
        "answers": [
            {
                "_id": "2",
                "content": "There are three types of loops in JavaScript: for loops, while loops, and do...while loops. For loops are used to iterate over a specific number of times. While loops are used to iterate over a set of code until a condition is met. Do...while loops are similar to while loops, but the code inside the loop is executed at least once, even if the condition is not met.",
                "author": {
                    "_id": "4",
                    "name": "Susan Jones",
                    "picture": "https://randomuser.me/api/portraits/women/10.jpg",
                    "clerkId": "2222222222",
                },
                "createdAt": new Date(),
            },
        ],
        "createdAt": new Date(),
    },
]


export default function Home() {
    return (
        <>
            <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
                <h1 className="h1-bold text-dark100_light900">All Questions</h1>
                <Link href={'/ask-question'} className="flex justify-end max-sm:w-full">
                    <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">Ask a Question</Button>
                </Link>
            </div>

            <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
                <LocalSearchbar
                    route="/"
                    iconPosition="left"
                    imgSrc="/assets/icons/search.svg"
                    placeholder="Search for questions"
                    otherClasses="flex-1"
                />
                <Filter
                    filters={HomePageFilters}
                    otherClasses="min-h-[56px] sm:min-w-[170px]"
                    containerClasses="hidden max-md:flex"
                />
            </div>

            <HomeFilters/>

            <div className="mt-10 flex w-full flex-col gap-6">
                {questions.length > 0 ?
                    questions.map((question) => (
                        <QuestionCard
                            key={question._id}
                            _id={question._id}
                            title={question.title}
                            tags={question.tags}
                            author={question.author}
                            upvotes={question.upvotes}
                            views={question.views}
                            answers={question.answers}
                            createdAt={question.createdAt}
                        />
                    ))
                    : <NoResult
                        title="There’s no question to show"
                        description="Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. our query could be the next big thing others learn from. Get involved! 💡"
                        link="/ask-question"
                        linkTitle="Ask a Question"
                    />}
            </div>

        </>
    )
}
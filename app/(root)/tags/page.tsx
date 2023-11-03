import React from "react";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import Filter from "@/components/shared/Filter";
import {UserFilters} from "@/constants/filters";
import Link from "next/link";
import {getAllTags} from "@/lib/actions/tag.action";
import NoResult from "@/components/shared/NoResult";

const Page = async () => {
    const result = await getAllTags({});
    return (
        <>
            <h1 className="h1-bold text-dark100_light900">All Users</h1>

            <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
                <LocalSearchbar
                    route="/community"
                    iconPosition="left"
                    imgSrc="/assets/icons/search.svg"
                    placeholder="Search for amazing minds"
                    otherClasses="flex-1"
                />

                <Filter
                    filters={UserFilters}
                    otherClasses="min-h-[56px] sm:min-w-[170px]"
                />
            </div>

            <section className="mt-12 flex flex-wrap gap-4">
                {result && result.tags.length > 0 ? (
                    result.tags.map((tag)=> (
                        <Link href={`/tags/${tag._id}`} key={tag._id} className="shadow-light100_darknone">
                            <article className="background-light900_dark200 light-border flex w-full flex-col rounded-2xl border px-8 py-10 sm:w-[260px]">
                                <div className="background-light800_dark400 w-fit rounded-sm px-5 py-1.5">
                                    <p className="paragraph-semibold text-dark300_light900">
                                        {tag.name}
                                    </p>
                                </div>

                                <p className="small-medium text-dark400_light500 mt-3.5">
                                    <span className="body-semibold primary-text-gradient mr-2.5">{tag.questions.length}+</span> Questions
                                </p>
                            </article>
                        </Link>
                    ))
                ) : (
                    <NoResult
                        title="No Tags Found"
                        description="It looks like there are no tags found."
                        link="/ask-question"
                        linkTitle="Ask a question"
                    />
                )}
            </section>
        </>
    )
}
export default Page;
import React from "react";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import Filter from "@/components/shared/Filter";
import {UserFilters} from "@/constants/filters";
import {Metadata} from "next";
import {SearchParamsProps} from "@/types";
import Pagination from "@/components/shared/Pagination";
import JobCard from "@/components/cards/JobCard";
import {getCurrentLocation, getJobs} from "@/lib/actions/general.action";
import {generateQueryString} from "@/lib/utils";
import {LocationFilter} from "@/components/jobs/LocationFilter";


export const metadata: Metadata = {
    title: 'Jobs | DevFlow',
}

const Page = async ({searchParams}: SearchParamsProps) => {
    const currentLocation = await getCurrentLocation();

    //TODO: result not updating when searchParams updates
    const result = await getJobs({
        countryCode: currentLocation.countryCode,
        query: generateQueryString(searchParams.q, searchParams.location, currentLocation.country)
    });

    return (
        <>
            <h1 className="h1-bold text-dark100_light900">All Jobs</h1>

            <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
                <LocalSearchbar
                    route="/jobs"
                    iconPosition="left"
                    imgSrc="/assets/icons/search.svg"
                    placeholder="Job Title, Company, or Keywords"
                    otherClasses="flex-1"
                />

                <LocationFilter
                    // filters={UserFilters}
                    otherClasses="min-h-[56px] sm:min-w-[170px]"
                />
            </div>

            <section className="light-border mb-9 mt-11 flex flex-col gap-9 border-b pb-9">
                {result && result.length > 0 ? (
                    result.map((job: any) => (
                        <JobCard key={job.job_id} data={job}/>
                    ))
                ) : (
                    <div className="paragraph-regular text-dark200_light800 mx-auto max-w-4xl text-center">
                        <p>No Jobs found</p>
                    </div>
                )}
            </section>

            <div className="mt-10">
                {/*<Pagination*/}
                {/*    pageNumber={searchParams?.page ? +searchParams.page : 1}*/}
                {/*    isNext={result?.isNext}*/}
                {/*/>*/}
            </div>
        </>
    )
}
export default Page;
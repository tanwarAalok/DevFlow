'use client'

import React, {useEffect, useState} from "react";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import {Metadata} from "next";
import {SearchParamsProps} from "@/types";
import Pagination from "@/components/shared/Pagination";
import JobCard from "@/components/cards/JobCard";
import {getJobs} from "@/lib/actions/general.action";
import {LocationFilter} from "@/components/jobs/LocationFilter";
import axios from "axios";
import Loading from "@/app/(root)/jobs/loading";
import Head from "next/head";



const Page = ({searchParams}: SearchParamsProps) => {


    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchLocation = async () => {
            setLoading(true);
            try{
                const res = await axios.get('/api/location');

                const result = await getJobs({
                    searchQuery: searchParams.q,
                    filter: searchParams.location,
                    currentLocation: res.data
                });

                // @ts-ignore
                setJobs(result);
            }
            catch (error) {
                console.error("Error fetching location:", error);
            }
            finally {
                setLoading(false);
            }
        };

        fetchLocation();
    }, [searchParams.q, searchParams.location]);

    if(loading) return <Loading/>

    return (
        <>
            <Head>
                <title>Jobs | DevFlow</title>
            </Head>

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
                {jobs && jobs.length > 0 ? (
                    jobs.map((job: any) => (
                        <JobCard key={job.job_id} data={job} />
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
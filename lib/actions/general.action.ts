"use server"

import {JobSearchParams, SearchParams} from "./shared.types";
import {connectToDatabase} from "@/lib/database";
import {Question, User, Answer, Tag} from "@/models";
import axios from "axios";
import {generateQueryString} from "@/lib/utils";

const SearchableTypes = ["question", "answer", "user", "tag"];

export async function globalSearch(params: SearchParams) {
    try {
        await connectToDatabase();

        const { query, type } = params;
        const regexQuery = { $regex: query, $options: "i" };

        let results = [];

        const modelsAndTypes = [
            { model: Question, searchField: 'title', type: 'question'},
            { model: User, searchField: 'name', type: 'user'},
            { model: Answer, searchField: 'content', type: 'answer'},
            { model: Tag, searchField: 'name', type: 'tag'},
        ]

        const typeLower = type?.toLowerCase();

        if(!typeLower || !SearchableTypes.includes(typeLower)) {
            // SEARCH ACROSS EVERYTHING

            for (const { model, searchField, type } of modelsAndTypes) {
                const queryResults = await model
                    .find({ [searchField]: regexQuery })
                    .limit(2);

                results.push(
                    ...queryResults.map((item) => ({
                        title: type === 'answer'
                            ? `Answers containing ${query}`
                            : item[searchField],
                        type,
                        id: type === 'user'
                            ? item.clerkid
                            : type==='answer'
                                ? item.question
                                : item._id
                    }))
                )
            }
        } else {
            // SEARCH IN THE SPECIFIED MODEL TYPE
            const modelInfo = modelsAndTypes.find((item) => item.type === type);

            console.log({modelInfo, type});
            if (!modelInfo) {
                throw new Error("Invalid search type");
            }

            const queryResults = await modelInfo.model
                .find({ [modelInfo.searchField]: regexQuery })
                .limit(8);

            results = queryResults.map((item) => ({
                title:
                    type === "answer"
                        ? `Answers containing ${query}`
                        : item[modelInfo.searchField],
                type,
                id:
                    type === "user"
                        ? item.clerkId
                        : type === "answer"
                            ? item.question
                            : item._id,
            }));
        }

        return JSON.stringify(results);
    } catch (error) {
        console.log(`Error fetching global results, ${error}`);
        throw error;
    }
}

export async function getJobs(params: JobSearchParams){

    try {
        const {searchQuery, filter} = params;

        const defaultLocation = await getCurrentLocation();


        const options = {
            method: 'GET',
            url: 'https://jsearch.p.rapidapi.com/search',
            params: {
                query: generateQueryString(searchQuery, filter, defaultLocation.country),
                page: '1',
                num_pages: '1'
            },
            headers: {
                'X-RapidAPI-Key': '0ca192bd34mshca25146e7ea1142p17a87ajsn20830dca802b',
                'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
            }
        };

        const response = await axios.request(options);
        const jobsArray = response.data.data;

        // get flag
        let jobs = [];

        for(let i = 0; i<jobsArray.length; i++){
            const job = jobsArray[i];
            const {job_id, job_apply_link, job_country, job_title,job_city,job_state, employer_logo, job_description, job_employment_type} = job;

            const country_details = await axios.get(`https://restcountries.com/v3.1/alpha/${job_country}`)

            const jobDetails = {
                job_apply_link, job_country, job_title,job_city,job_state,
                employer_logo, job_description, job_employment_type,job_id,
                country_flags: country_details.data[0].flags
            }

            jobs.push(jobDetails);
        }

        return jobs;
    } catch (error) {
        console.error(error);
    }
}

export async function getCurrentLocation(){
    try{
        const res = await axios.get('http://ip-api.com/json/');
        return res.data;
    } catch(error){
        console.log(error)
    }
}
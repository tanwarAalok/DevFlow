import { Schema } from "mongoose";

import { IUser } from "@/mongodb";

export interface CreateAnswerParams {
    content: string;
    author: string; // User ID
    question: string; // Question ID
    path: string;
}

export interface GetAnswersParams {
    questionId: string;
    sortBy?: string;
    page?: number;
    pageSize?: number;
}

export interface AnswerVoteParams {
    answerId: string;
    userId: string;
    hasupVoted: boolean;
    hasdownVoted: boolean;
    path: string;
}

export interface DeleteAnswerParams {
    answerId: string;
    path: string;
}

export interface SearchParams {
    query?: string | null;
    type?: string | null;
}

export interface RecommendedParams {
    userId: string;
    page?: number;
    pageSize?: number;
    searchQuery?: string;
}

export interface ViewQuestionParams {
    questionId: string;
    userId: string | undefined;
}

export interface JobFilterParams {
    query: string;
    page: string;
}

export interface GetQuestionsParams {
    page?: number;
    pageSize?: number;
    searchQuery?: string;
    filter?: string;
}

export interface CreateQuestionParams {
    title: string;
    content: string;
    tags: string[];
    author: Schema.Types.ObjectId | IUser;
    path: string;
}

export interface GetQuestionByIdParams {
    questionId: string;
}

export interface QuestionVoteParams {
    questionId: string;
    userId: string;
    hasupVoted: boolean;
    hasdownVoted: boolean;
    path: string;
}

export interface DeleteQuestionParams {
    questionId: string;
    path: string;
}

export interface EditQuestionParams {
    questionId: string;
    title: string;
    content: string;
    path: string;
}

export interface GetAllTagsParams {
    page?: number;
    pageSize?: number;
    filter?: string;
    searchQuery?: string;
}

export interface GetQuestionsByTagIdParams {
    tagId: string;
    page?: number;
    pageSize?: number;
    searchQuery?: string;
}

export interface GetTopInteractedTagsParams {
    userId: string;
    limit?: number;
}

export interface CreateUserParams {
    clerkId: string;
    name: string;
    username: string;
    email: string;
    picture: string;
}

export interface GetUserByIdParams {
    userId: string;
}

export interface GetAllUsersParams {
    page?: number;
    pageSize?: number;
    filter?: string;
    searchQuery?: string; // Add searchQuery parameter
}

export interface UpdateUserParams {
    clerkId: string;
    updateData: Partial<IUser>;
    path: string;
}

export interface ToggleSaveQuestionParams {
    userId: string;
    questionId: string;
    path: string;
}

export interface GetSavedQuestionsParams {
    clerkId: string;
    page?: number;
    pageSize?: number;
    filter?: string;
    searchQuery?: string;
}

export interface GetUserStatsParams {
    userId: string;
    page?: number;
    pageSize?: number;
}

export interface DeleteUserParams {
    clerkId: string;
}

export interface JobSearchParams{
    searchQuery?: string;
    filter?: string;
    currentLocation: ICurrentLocation;
}

export interface ICurrentLocation {
    ip: string;
    continent_code: string;
    continent_name: string;
    country_code2: string;
    country_code3: string;
    country_name: string;
    country_name_official: string;
    country_capital: string;
    state_prov: string;
    state_code: string;
    district: string;
    city: string;
    zipcode: string;
    latitude: string;
    longitude: string;
    is_eu: boolean;
    calling_code: string;
    country_tld: string;
    languages: string;
    country_flag: string;
    geoname_id: string;
    isp: string;
    connection_type: string;
    organization: string;
    country_emoji: string;
    currency: {
        code: string;
        name: string;
        symbol: string;
    };
    time_zone: {
        name: string;
        offset: number;
        offset_with_dst: number;
        current_time: string;
        current_time_unix: number;
        is_dst: boolean;
        dst_savings: number;
        dst_exists: boolean;
        dst_start: string;
        dst_end: string;
    };
}

export interface IJobData {
    job_id: string;
    employer_name: string;
    employer_logo: string;
    employer_website: string;
    employer_company_type: string;
    job_publisher: string;
    job_employment_type: string;
    job_title: string;
    job_apply_link: string;
    job_apply_is_direct: boolean;
    job_apply_quality_score: number;
    apply_options: any[]; // You might want to define a more specific type for apply_options
    job_description: string;
    job_is_remote: boolean;
    job_posted_at_timestamp: number;
    job_posted_at_datetime_utc: string;
    job_city: string;
    job_state: string;
    job_country: string;
    job_latitude: number;
    job_longitude: number;
    job_benefits: any; // Define a specific type if possible
    job_google_link: string;
    job_offer_expiration_datetime_utc: string | null;
    job_offer_expiration_timestamp: number | null;
    job_required_experience: {
        no_experience_required: boolean;
        required_experience_in_months: number;
        experience_mentioned: boolean;
        experience_preferred: boolean;
    };
    job_required_skills: any; // Define a specific type if possible
    job_required_education: {
        postgraduate_degree: boolean;
        professional_certification: boolean;
        high_school: boolean;
        associates_degree: boolean;
        bachelors_degree: boolean;
        degree_mentioned: boolean;
        degree_preferred: boolean;
        professional_certification_mentioned: boolean;
    };
    job_experience_in_place_of_education: boolean;
    job_min_salary: number | null;
    job_max_salary: number | null;
    job_salary_currency: string | null;
    job_salary_period: string | null;
    job_highlights: any; // Define a specific type if possible
    job_job_title: string;
    job_posting_language: string;
    job_onet_soc: string;
    job_onet_job_zone: string;
    job_occupational_categories: any; // Define a specific type if possible
    job_naics_code: string;
    job_naics_name: string;
}
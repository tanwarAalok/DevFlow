import Image from "next/image";
import Link from "next/link";

interface IJobData {

}

// @ts-ignore
const JobCard = ({data}) => {
    return (
        <section className="background-light900_dark200 light-border shadow-light100_darknone flex flex-col items-start gap-6 rounded-lg border p-6 sm:flex-row sm:p-8">
            <div className="flex w-full justify-end sm:hidden">
                <div className="background-light800_dark400 flex items-center justify-end gap-2 rounded-2xl px-3 py-1.5">
                    <Image src={'/assets/images/site-logo.svg'} alt={"logo"} className="rounded-full" width={16} height={16}/>
                    <p className="body-medium text-dark400_light700">HIEHEWRWER</p>
                </div>
            </div>
            <div className="flex items-center gap-6">
                <Image src={data.employer_logo || '/assets/images/site-logo.svg'} alt={"logo"} className="rounded-[10px]" width={64} height={64}/>
            </div>
            <div className="w-full">
                <div className="flex-between flex-wrap gap-2">
                    <p className="base-semibold text-dark200_light900">{data.job_title}</p>
                    <div className="hidden sm:flex">
                        <div className="background-light800_dark400 flex items-center justify-end gap-2 rounded-2xl px-3 py-1.5">
                            <Image src={data.country_flags.svg} alt={data.country_flags.alt} width={16} height={16}/>
                            <p className="body-medium text-dark400_light700">{data.job_city}, {data.job_state}, {data.job_country}</p>
                        </div>
                    </div>
                </div>
                <p className="body-regular text-dark500_light700  mt-2 line-clamp-2">{data.job_description}</p>
                <div className="flex-between mt-8 flex-wrap gap-6">
                    <div className="flex flex-wrap items-center gap-6">
                        <div className="flex items-center gap-2">
                            <Image src={'/assets/icons/clock-2.svg'} alt={"logo"} width={20} height={20}/>
                            <p className="body-medium text-light-500">{data.job_employment_type}</p>
                        </div><div className="flex items-center gap-2">
                            <Image src={'/assets/icons/currency-dollar-circle.svg'} alt={"logo"} width={20} height={20}/>
                            <p className="body-medium text-light-500">Not disclosed</p>
                        </div>
                        <Link target='_blank' href={data.job_apply_link} className="flex items-center gap-2">
                            <p className="body-semibold primary-text-gradient">View Job</p>
                            <Image src={'/assets/icons/arrow-up-right.svg'} alt={"arrow"} width={20} height={20}/>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default JobCard;
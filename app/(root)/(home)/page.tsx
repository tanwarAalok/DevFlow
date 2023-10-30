import { UserButton } from "@clerk/nextjs";

export default function Home() {
    return (
        <div>
            <UserButton afterSignOutUrl="/"/>
            <h1 className="h1-bold">Hello world this is heading !</h1>
        </div>
    )
}
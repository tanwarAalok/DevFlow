import axios from 'axios';
import {NextResponse} from "next/server";

export const GET = async (req: Request) => {
    try {
        const response = await axios.get('http://ip-api.com/json/');
        return NextResponse.json({ data: response })
    } catch (error: any) {
        return NextResponse.json({ error: error.message, message: 'Failed to fetch location' })
    }
}
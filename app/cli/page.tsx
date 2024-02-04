import React, {Suspense} from 'react';
import {cookies} from "next/headers";
import {createClient} from "@/utils/supabase/server";
import Terminal from "@/app/cli/components/terminal";


export default async function Home() {

    // const { data, error } = await supabase.from('users').select('user_id, name')


    const fetchSessionId = async () => {
        "use server"
        const cookieStore = cookies()
        const supabase = createClient(cookieStore)
        const currentUser = await supabase.auth.getUser()
        console.log(currentUser)
        const {data, error} = await supabase.from('CliSession').select('session_id').limit(1)
        if (error) {
            console.log(error)
            return
        }
        console.log("existing session")
        console.log(data)
        const session = data[0]?.session_id;
        if (!session) {
            const {
                data: resultData,
                error: resultError
            } = await supabase.from('CliSession').insert({user_id: currentUser.data.user?.id}).select('session_id')
            if (resultError) {
                console.log(resultError)
                return
            }
            console.log("new session")
            console.log(data)
            return resultData[0]?.session_id
        }
    }


    const sessionId = await fetchSessionId()


    return (
        <>
            <Suspense fallback="Loading...">
                <Terminal session_id={sessionId}/>
            </Suspense>
        </>

    );
}
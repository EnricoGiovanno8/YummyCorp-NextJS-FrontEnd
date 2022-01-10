import Layout from "@/components/Layout"
import { useRouter } from "next/router"
import Link from 'next/link'
import EventItem from "@/components/EventItem"
import { API_URL } from "@/config/index"
const qs = require('qs')

export default function EventsPage({ events }) {
    const router = useRouter()
    return (
        <Layout title='Search Results'>
            <Link href='/events'>Go Back</Link>
            <h1>Search Results for {router.query.term}</h1>
            {events.length === 0 && <h3>No events to show</h3>}

            {events.map((evt) => (
                <EventItem key={evt.id} evt={evt} />
            ))}
        </Layout>
    )
}

export async function getServerSideProps({ query: {term} }) {
    const qs = require('qs');
    const populate = qs.stringify({
        populate: ['image'], 
    }, {
        encodeValuesOnly: true,
    });

    const filter = qs.stringify({
    filters: {
        $or: [
            {
                name: {
                    $contains: term,
                }
            },
            {
                performers: {
                    $contains: term,
                }
            },
            {
                description: {
                    $contains: term,
                }
            },
            {
                venue: {
                    $contains: term,
                }
            },
        ],
    },
    }, {
        encodeValuesOnly: true,
    });

    const res = await fetch(`${API_URL}/api/events?${populate}&${filter}`)
    const events = await res.json()

    return {
        props: { events: events.data },
    }
}

import { FaPencilAlt, FaTimes } from 'react-icons/fa'
import Link from 'next/link'
import Image from 'next/image'
import Layout from '@/components/Layout'
import { API_URL } from "@/config/index"
import styles from '@/styles/Event.module.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router'
import EventMap from '@/components/EventMap'
const qs = require('qs')

export default function EventPage({ evt }) {
    const router = useRouter()

    return (
        <Layout>
            <div className={styles.event}>
                <span>
                    {new Date(evt.attributes.date).toLocaleDateString('en-US')} at {evt.attributes.time}
                </span>
                <h1>{evt.attributes.name}</h1>
                <ToastContainer />
                {evt.attributes.image.data ? 
                    (
                        <div className={styles.image}>
                            <Image src={evt.attributes.image.data.attributes.formats.large.url} width={960} height={600} />
                        </div>
                    )
                :
                    (
                        <div className={styles.image}>
                            <Image src='/images/event-default.png' width={960} height={600} />
                        </div>
                    )
                }

                <h3>Performers:</h3>
                <p>{evt.attributes.performers}</p>
                <h3>Description:</h3>
                <p>{evt.attributes.description}</p>
                <h3>Venue: {evt.attributes.venue}</h3>
                <p>{evt.attributes.address}</p>

                {/* <EventMap evt={evt} /> */}

                <Link href='/events'>
                    <a className={styles.back}>
                        {'<'} Go Back
                    </a>
                </Link>
            </div>
        </Layout>
    )
}

export async function getStaticPaths() {
    const res = await fetch(`${API_URL}/api/events`)
    const events = await res.json()

    const paths = events.data.map(evt => ({
        params: {slug: evt.id.toString()}
    }))

    return {
        paths,
        fallback: true
    }
}

export async function getStaticProps({ params: {slug} }) {
    const query = qs.stringify({
        populate: ['image'], 
    }, {
        encodeValuesOnly: true,
    });

    const res = await fetch(`${API_URL}/api/events/${slug}?${query}`)
    const event = await res.json()

    return  {
        props: {
            evt: event.data,
        },
        revalidate: 1
    }
}

// export async function getServerSideProps({ query: {slug} }) {
//     const res = await fetch(`${API_URL}/api/events/${slug}`)
//     const events = await res.json()

//     return  {
//         props: {
//             evt: events[0]
//         }
//     }
// }
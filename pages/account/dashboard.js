import Layout from "@/components/Layout";
import DashboardEvent from "@/components/DashboardEvent";
import { API_URL } from "@/config/index";
import { parseCookies } from "@/helpers/index";
import styles from '@/styles/Dashboard.module.css'
import { useRouter } from "next/router";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const qs = require('qs');

export default function DashboardPage({ events, token }) {
    const router = useRouter()

    const deleteEvent = async (id) => {
        if (confirm('Are you sure?')) {
            const res = await fetch(`${API_URL}/api/events/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const data = await res.json()

            if (!res.ok) {
                if (res.status === 403 || res.status === 401) {
                    return toast.error('Unauthorized')
                }
                toast.error('Something Went Wrong')
            } else (
                router.reload()
            )
        }
    }

    return (
        <Layout title='User Dashboard'>
            <ToastContainer />
            <div className={styles.dash}>
                <h1>Dashboard</h1>
                <h3>My Events</h3>

                {events.map((evt) => (
                    <DashboardEvent key={evt.id} evt={evt} handleDelete={deleteEvent} />
                ))}
            </div>
        </Layout>
    )
}

export async function getServerSideProps({ req }) {
    const { token } = parseCookies(req)

    const resUser = await fetch(`${API_URL}/api/users/me`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    const user = await resUser.json()

    const query = qs.stringify({
        populate: ['image'],
        filters: {
            user: {
                id: {
                    $eq: user.id,
                },
            },
        },
    }, {
        encodeValuesOnly: true,
    });

    const res = await fetch(`${API_URL}/api/events?${query}`)
    const events = await res.json()

    return {
        props: { 
            events: events.data,
            token
        }
    }
}

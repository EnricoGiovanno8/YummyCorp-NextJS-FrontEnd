import Layout from "@/components/Layout"
import EventItem from "@/components/EventItem"
import { API_URL } from "@/config/index"
import Pagination from "@/components/Pagination"
const qs = require('qs')

export default function EventsPage({ events, page, lastPage }) {
  return (
    <Layout>
      <h1>Events</h1>
      {events.length === 0 && <h3>No events to show</h3>}

      {events.map((evt) => (
        <EventItem key={evt.id} evt={evt} />
      ))}

      <Pagination page={page} lastPage={lastPage} />
    </Layout>
  )
}

export async function getServerSideProps({ query: {page = 1} }) {
  const query = qs.stringify({
    populate: ['image'], 
    pagination: {
      page: +page,
      pageSize: 5,
    },
  }, {
    encodeValuesOnly: true,
  });

  const res = await fetch(`${API_URL}/api/events?${query}`)
  const events = await res.json()

  return {
    props: { 
      events : events.data,
      page: +page,
      lastPage : events.meta.pagination.pageCount }
  }
}

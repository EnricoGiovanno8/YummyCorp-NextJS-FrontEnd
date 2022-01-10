import Layout from '@/components/Layout'
import Modal from '@/components/Modal'
import ImageUpload from '@/components/ImageUpload'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useState } from 'react'
import styles from '@/styles/Form.module.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_URL } from '@/config/index'
import moment from 'moment'
import Image from 'next/image'
import { FaImage } from 'react-icons/fa'
import { parseCookies } from '@/helpers/index'
const qs = require('qs')

export default function EditEventPage({ evt, token }) {
    const [values, setValues] = useState({
        name: evt.attributes.name,
        performers: evt.attributes.performers,
        venue: evt.attributes.venue,
        address: evt.attributes.address,
        date: evt.attributes.date,
        time: evt.attributes.time,
        description: evt.attributes.description,
    })
    const [imagePreview, setImagePreview] = useState(
        evt.attributes.image.data ? evt.attributes.image.data.attributes.formats.thumbnail.url : '/images/event-default.png'
    )
    const [showModal, setShowModal] = useState(false)
    
    const router = useRouter()

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        // Validation
        const hasEmptyFields = Object.values(values).some((element) => element === '')

        if (hasEmptyFields) {
            toast.error('Please fill in all fields')
        }

        const res = await fetch(`${API_URL}/api/events/${evt.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ data: values })
        })

        if (!res.ok) {
            if (res.status === 403 || res.status === 401) {
                return toast.error('Unauthorized')
            }
            toast.error('Something Went Wrong')
        } else {
            const result = await res.json()
            router.push(`/events/${result.data.id}`)
        }
    }

    const handleInputChange = (e) => {
        const {name, value} = e.target
        setValues({...values, [name]: value})
    }

    const imageUploaded = async () => {
        const query = qs.stringify({
            populate: ['image'], 
        }, {
            encodeValuesOnly: true,
        });
    
        const res = await fetch(`${API_URL}/api/events/${evt.id}?${query}`)
        const event = await res.json()
        const imageUrl = event.data.attributes.image.data.attributes.formats.thumbnail.url

        setImagePreview(imageUrl)
        setShowModal(false)
    }

    return (
        <Layout title='Edit New Event'>
            <Link href='/events'>Go Back</Link>
            <h1>Edit Event</h1>
            <ToastContainer />

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.grid}>
                    <div>
                        <label htmlFor='name'>Event Name</label>
                        <input type='text' id='name' name='name' value={values.name} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label htmlFor='name'>Performers</label>
                        <input type='text' id='performers' name='performers' value={values.performers} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label htmlFor='name'>Venue</label>
                        <input type='text' id='venue' name='venue' value={values.venue} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label htmlFor='name'>Address</label>
                        <input type='text' id='address' name='address' value={values.address} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label htmlFor='name'>Date</label>
                        <input type='date' id='date' name='date' value={moment(values.date).format('yyyy-MM-DD')} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label htmlFor='name'>Time</label>
                        <input type='text' id='time' name='time' value={values.time} onChange={handleInputChange} />
                    </div>
                </div>
                
                <div>
                    <label htmlFor='description'>
                        Event Description
                    </label>
                    <textarea
                        type='text'
                        name='description'
                        id='description'
                        value={values.description}
                        onChange={handleInputChange}
                    >
                    </textarea>
                </div>

                <input type='submit' value='Update Event' className='btn' />
            </form>

            <h2>Event Image</h2>
            <Image src={imagePreview} height={100} width={170} />

            <div>
                <button 
                    onClick={() => setShowModal(true)} 
                    className='btn-secondary'
                >
                    <FaImage /> Set Image
                </button>
            </div>

            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <ImageUpload evtId={evt.id} imageUploaded={imageUploaded} token={token} />
            </Modal>
        </Layout>
    )
}

export async function getServerSideProps({ params: {id}, req }) {
    const { token } = parseCookies(req)

    const query = qs.stringify({
        populate: ['image'], 
    }, {
        encodeValuesOnly: true,
    });

    const res = await fetch(`${API_URL}/api/events/${id}?${query}`)
    const event = await res.json()

    return {
        props: {
            evt : event.data,
            token
        }
    }
}

import React from 'react'
import { useAuth } from '../context/AuthContext'

const Images = () => {

    const { user } = useAuth()
    return (
        <div className='md:flex gap-2 px-2 text-white'>
            <div className="lg:w-1/3">
                <p className=''>National ID Image</p>
                <img src={user?.idImage?.filename
                    ? `http://localhost:5000/images/${user.idImage.filename}`
                    : 'http://localhost:5000/images/default.jpg'} alt=""
                    className="w-full  object-fit object-center group-hover:opacity-75" />
            </div>
            <div className="flex flex-col lg:w-1/3">
                <p className=''>Tax certificate Image</p>
                <img src={user?.taxCertificate?.filename
                    ? `http://localhost:5000/images/${user.taxCertificate.filename}`
                    : 'http://localhost:5000/images/default.jpg'} alt=""
                    className="w-full  object-fit object-center group-hover:opacity-75" />
            </div>
            <div className="flex flex-col lg:w-1/3">
                <p className=''>Business Licence Image</p>
                <img src={user?.businessLicense?.filename
                    ? `http://localhost:5000/images/${user.businessLicense.filename}`
                    : 'http://localhost:5000/images/default.jpg'} alt=""
                    className="w-full  object-fit object-center group-hover:opacity-75" />
            </div>
        </div>
    )
}

export default Images
// pages/name/[nameID].js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import NameDetail from '../../components/NameDetail'; 

const NameDetailPage = () => {
    const [nameDetails, setNameDetails] = useState(null);
    const router = useRouter();
    const { nameID } = router.query;

    useEffect(() => {
        // Only proceed once the router is ready and nameID is defined
        if (nameID) {
            const fetchNameDetails = async () => {
                const tokenData = localStorage.getItem('tokenData');
                let token = null;
                if (tokenData) {
                    token = JSON.parse(tokenData).token;
                }

                try {
                    const config = { headers: { 'X-OBSERVATORY-AUTH': token } };
                    const response = await axios.get(`https://localhost:9876/ntuaflix_api/name/${nameID}`, config);
                    setNameDetails(response.data.nameObject);
                } catch (error) {
                    console.error('Error fetching name details:', error);
                } 
            };
            
            fetchNameDetails();
        }
    }, [nameID]); 

    if (!nameDetails) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <NameDetail nameDetails={nameDetails} />
        </div>
    );
};

export default NameDetailPage;

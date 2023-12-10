import axios from 'axios';
import {useState, useEffect } from 'react'

function useFetch(url) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log("GETTING PATH with url : ", url);
        setLoading('Loading.....');
        setData(null);
        setError(null);
        const token = localStorage.getItem("token");
        if(token === null) {
            console.log("Not Logged In");
            setError('Not Logged In');
            return;
        }
        const source = axios.CancelToken.source();
        axios.get(url, { cancelToken: source.token, headers: {
            Authorization: `Bearer ${token}`,
        }})
            .then(res => {
                setLoading(false);
                if(res!=null && res.data!=null && res.data.tripDetails!= null && res.data.tripDetails.tripPoints!=null ) {
                    setData(res.data.tripDetails.tripPoints);
                } else {
                    res && res.data && setData(res.data);
                }
            })
            .catch(err => {
                setLoading(false);
                if (err.response && err.response.data) {
                    setError(`${err.response.data.message}: ${err.response.data.description}`);
                } else {
                    setError('An error occurred.', err);
                }
            })
            return () => {
                source.cancel();
            }
    }, [url])
    return { data, loading, error , setData }
}

export default useFetch;
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HomePage: React.FC = () => {
    const [presentationData, setPresentationData] = useState(null);
    const [postData, setPostData] = useState({ year: '', month: '', amount: '' });
    const [patchData, setPatchData] = useState({ string1: '', string2: '', number: '' });

    const fetchPresentationData = () => {
        axios
            .get('http://127.0.0.1:3001/presentation')
            .then((response) => {
                console.log(`here`)
                setPresentationData(response.data.PRESENTATION_OBJECT)
            })
            .catch((error) => console.error('Error fetching presentation data:', error));
    };

    useEffect(() => {
        fetchPresentationData();
    }, []);

    // Handle form submissions
    const handlePostSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        axios
            .post('http://127.0.0.1:3001/presentation', {
                year: postData.year,
                month: postData.month,
                amount: postData.amount,
            })
            .then((response) => console.log('POST response:', response.data))
            .catch((error) => console.error('Error in POST request:', error));
    };

    const handlePatchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        axios
            .patch('http://127.0.0.1:3001/presentation', {
                domain: patchData.string1,
                key: patchData.string2,
                value: patchData.number,
            })
            .then((response) => {
                fetchPresentationData();
                console.log('PATCH response:', response.data)
            })
            .catch((error) => console.error('Error in PATCH request:', error));
    };

    return (
        <div>
            <h1>Імітація ринкової поведінки</h1>

            {/* Display fetched data */}
            {presentationData ? (
                <pre>{JSON.stringify(presentationData, null, 2)}</pre>
            ) : (
                <p>Завантаження даних...</p>
            )}

            {/* Form for POST request */}
            <form onSubmit={handlePostSubmit}>
                <h3>Згенерувати продажі</h3>
                <label>
                    Рік:
                    <input
                        type="number"
                        value={postData.year}
                        onChange={(e) => setPostData({ ...postData, year: e.target.value })}
                        required
                    />
                </label>
                <label>
                    Місяць:
                    <input
                        type="number"
                        value={postData.month}
                        onChange={(e) => setPostData({ ...postData, month: e.target.value })}
                        required
                    />
                </label>
                <label>
                    Кількість продаж:
                    <input
                        type="number"
                        value={postData.amount}
                        onChange={(e) => setPostData({ ...postData, amount: e.target.value })}
                        required
                    />
                </label>
                <button type="submit">Згенерувати</button>
            </form>

            {/* Form for PATCH request */}
            <form onSubmit={handlePatchSubmit}>
                <h3>Зміна коефіцієнтів</h3>
                <label>
                    Сутність:
                    <input
                        type="text"
                        value={patchData.string1}
                        onChange={(e) => setPatchData({ ...patchData, string1: e.target.value })}
                        required
                    />
                </label>
                <label>
                    Об'єкт:
                    <input
                        type="text"
                        value={patchData.string2}
                        onChange={(e) => setPatchData({ ...patchData, string2: e.target.value })}
                        required
                    />
                </label>
                <label>
                    Коефіцієнт:
                    <input
                        type="number"
                        value={patchData.number}
                        onChange={(e) => setPatchData({ ...patchData, number: e.target.value })}
                        required
                    />
                </label>
                <button type="submit">Змінити</button>
            </form>
        </div>
    );
};

export default HomePage;
import React from 'react';
import { useParams } from 'react-router-dom';
import ClubProfile from '../components/club-profile';

const ClubPage = () => {
    let { clubId } = useParams();
    return (
        <div>
            <ClubProfile clubId={clubId} />     
        </div>
    );
};

export default ClubPage;

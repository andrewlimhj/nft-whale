import React from 'react';
import { allCollections } from '../collectionsFile';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const clickHandler = (col) => {
    navigate(`/${col}`);
  };

  return (
    <>
      <div className='start'>Whale Statistics For Top NFT Collections</div>
      <div className='collections'>
        {allCollections.map((e, i) => {
          return (
            <div
              key={i}
              className='oneCollection'
              onClick={() => clickHandler(e.slug)}
            >
              <img src={e.img} alt={i} className='frontLogo' />
              {e.name}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Home;

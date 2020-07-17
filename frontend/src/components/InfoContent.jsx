import React from 'react';

export default function InfoContent() {
  return (
    <div>
      <div style={barStyle}>
        <img src='/images/bar.svg' alt='' style={{ display: 'block' }} />
        <p className='home-caption'>Learn how to use world log.</p>
      </div>

      <div className='container mb-5'>
        <div className='row  align-items-center'>
          <div className='col-4'>
            <img src='/images/globe.svg' width='90%' alt='' />
          </div>
          <div className='col-8'>
            <p style={text}>
              Start with a new trip to connect your blog posts and pin them on the map. From there
              you can add posts to existing trips or create new ones.
            </p>
          </div>
        </div>
        <div className='row  align-items-center'>
          <div className='col-4'>
            <img src='/images/post.svg' width='90%' alt='' />
          </div>
          <div className='col-8'>
            <p style={text}>
              Create your individual blog post with our editor, add pictures, tell your stories and
              bring your memories to life.
            </p>
          </div>
        </div>
        <div className='row  align-items-center'>
          <div className='col-4'>
            <img src='/images/explore.svg' width='90%' alt='' />
          </div>
          <div className='col-8'>
            <p style={text}>
              You can search for other users or discover the latest posts on the community map.
              There is an additional feed for the trips with the most claps.
            </p>
          </div>
        </div>
        <div className='row  align-items-center'>
          <div className='col-4'>
            <img src='/images/clap.svg' width='90%' alt='' />
          </div>
          <div className='col-8'>
            <p style={text}>
              Use claps to show other users some love for their trips or collect your own to get a
              spot in the trip feed.
            </p>
          </div>
        </div>
      </div>

      <div style={bottomIllustration}>
        <p className='home-caption' style={{ color: 'rgb(64,59,88)', bottom: '335px' }}>
          start <br /> now.
        </p>
      </div>
    </div>
  );
}

const bottomIllustration = {
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  bottom: '0px',
  height: '677px',
  backgroundImage: 'url(/images/homeBottom.png)',
  position: 'relative',
};

const text = {
  fontWeight: 'bold',
  padding: '15px',
  color: 'black',
  fontSize: '24px',
};

const barStyle = {
  position: 'relative',
  marginTop: '-100px',
  marginBottom: '1px',
};

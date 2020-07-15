import React from 'react';

export default function InfoContent() {
  return (
    <div>
      <div style={barStyle}>
        <div style={{ marginBottom: '-120px' }}>
          <img src='/images/bar.svg' alt='' />
        </div>

        <div className='container mb-5'>
          {/* <p style={textStyle}>Learn how to use world log</p> */}
          <div className='row  align-items-center'>
            <div className='col-4'>
              <img src='/images/globe.svg' width='100%' alt='' />
            </div>
            <div className='col-8'>
              <p style={text}>
                Start with a new trip to connect your blog posts in it. And show
                it on the map.
              </p>
            </div>
          </div>
          <div className='row  align-items-center'>
            <div className='col-4'>
              <img src='/images/post.svg' width='100%' alt='' />
            </div>
            <div className='col-8'>
              <p style={text}>
                Create your individual Blog Post with an editor and bring it on
                the map
              </p>
            </div>
          </div>
          <div className='row  align-items-center'>
            <div className='col-4'>
              <img src='/images/explore.svg' width='100%' alt='' />
            </div>
            <div className='col-8'>
              <p style={text}>
                You can search for other users or discover the latest posts on
                the community map. There is also a feed for the trips with the
                most claps.
              </p>
            </div>
          </div>
          <div className='row  align-items-center'>
            <div className='col-4'>
              <img src='/images/clap.svg' width='100%' alt='' />
            </div>
            <div className='col-8'>
              <p style={text}>Some Text</p>
            </div>
          </div>
        </div>
      </div>
      <div style={bottomIllustration}></div>
    </div>
  );
}

const barStyle = {
  position: 'grid',
  marginTop: '-420px',
};

const bottomIllustration = {
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  bottom: '0px',
  height: '677px',
  backgroundImage: 'url(/images/homeBottom.png)',
};

const text = {
  fontWeight: 'bold',
  padding: '15px',
  paddingLeft: '50px',
  color: 'black',
  fontSize: '24px',
};

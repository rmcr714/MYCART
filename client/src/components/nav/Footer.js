import React from 'react'

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#212121' }}>
      <div className='container'>
        <div className='row'>
          <div className='col text-center py-3'>
            <div style={{ color: 'white' }}> Copyright &copy; MyCart</div>
            <span>
              <a href='https://www.instagram.com/' className='m-2'>
                <i
                  className='fab fa-instagram-square fa-2x'
                  style={{ color: 'pink' }}
                >
                  {' '}
                </i>
              </a>{' '}
              {'   '}
              <a href='https://www.facebook.com/' className='m-2'>
                {' '}
                <i
                  className='fab fa-facebook-square fa-2x'
                  style={{ color: '#4267B2' }}
                ></i>
              </a>{' '}
              <a href='https://twitter.com/' className='m-2'>
                <i
                  className='fab fa-twitter-square fa-2x'
                  style={{ color: '#1DA1F2' }}
                ></i>
              </a>{' '}
              <a href='https://github.com/rmcr714/' className='m-2'>
                <i
                  className='fab fa-github-square fa-2x'
                  style={{ color: '#4078c0' }}
                ></i>
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

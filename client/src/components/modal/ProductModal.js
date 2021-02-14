import React from 'react'

const ProductModal = ({ price }) => {
  return (
    <>
      <div
        className='modal fade'
        id='exampleModalLong'
        tabIndex='-1'
        role='dialog'
        aria-labelledby='exampleModalLongTitle'
        aria-hidden='true'
      >
        <div className='modal-dialog' role='document'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h5 className='modal-title' id='exampleModalLongTitle'>
                Return policy
              </h5>
              <button
                type='button'
                className='close'
                data-dismiss='modal'
                aria-label='Close'
              >
                <span aria-hidden='true'>&times;</span>
              </button>
            </div>
            <div className='modal-body'>
              Laptops 7 Days Replacement This item is eligible for free
              replacement, within 7 days of delivery, in an unlikely event of
              damaged, defective or different item delivered to you. Please keep
              the item in its original condition, with brand outer box, MRP tags
              attached, user manual, warranty cards, CDs and original
              accessories in manufacturer packaging for a successful return
              pick-up. For few products, we may schedule a technician visit to
              your location. On the basis of the technician's evaluation report,
              we will provide resolution.
            </div>
            <div className='modal-footer'>
              <button
                type='button'
                className='btn btn-secondary'
                data-dismiss='modal'
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className='modal fade'
        id='mycartdelivered'
        tabIndex='-1'
        role='dialog'
        aria-labelledby='exampleModalLongTitle'
        aria-hidden='true'
      >
        <div className='modal-dialog' role='document'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h5 className='modal-title' id='exampleModalLongTitle'>
                My Cart Delivered
              </h5>
              <button
                type='button'
                className='close'
                data-dismiss='modal'
                aria-label='Close'
              >
                <span aria-hidden='true'>&times;</span>
              </button>
            </div>
            <div className='modal-body'>
              My Cart directly manages delivery for this product. Order delivery
              tracking to your doorstep is available.
            </div>
            <div className='modal-footer'>
              <button
                type='button'
                className='btn btn-secondary'
                data-dismiss='modal'
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className='modal fade'
        id='warrantypolicy'
        tabIndex='-1'
        role='dialog'
        aria-labelledby='exampleModalLongTitle'
        aria-hidden='true'
      >
        <div className='modal-dialog' role='document'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h5 className='modal-title' id='exampleModalLongTitle'>
                Warranty Policy
              </h5>
              <button
                type='button'
                className='close'
                data-dismiss='modal'
                aria-label='Close'
              >
                <span aria-hidden='true'>&times;</span>
              </button>
            </div>
            <div className='modal-body'>
              not covered -Physical Damage, Burn, Liquid Spill
            </div>
            <div className='modal-footer'>
              <button
                type='button'
                className='btn btn-secondary'
                data-dismiss='modal'
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className='modal fade'
        id='details'
        tabIndex='-1'
        role='dialog'
        aria-labelledby='exampleModalLongTitle'
        aria-hidden='true'
      >
        <div className='modal-dialog' role='document'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h5 className='modal-title' id='exampleModalLongTitle'>
                No Cost EMI
              </h5>
              <button
                type='button'
                className='close'
                data-dismiss='modal'
                aria-label='Close'
              >
                <span aria-hidden='true'>&times;</span>
              </button>
            </div>
            <div className='modal-body'>
              To make this a No Cost EMI offer, interest amount will be
              discounted from the price of your order. Total amount you pay to
              the bank (excluding GST) will be equal to the price of the item.
              Bank may charge you GST only on the interest amount. Certain
              tenures are available on no cost EMI only on down payment. Please
              check EMI plans in payments page for more details.
              <br />
              <br />
              <h5>MyCart pay ICICI Credit Card</h5>
              {price && (
                <table className='table'>
                  <thead>
                    <tr>
                      <th scope='col'>Plan Months</th>
                      <th scope='col'>EMI payable to Provider</th>
                      <th scope='col'>Annual interest charged by provider</th>
                      <th scope='col'>Total cost Payable to provider</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope='row'>3</th>
                      <td>${(price / 3).toFixed(2)}</td>
                      <td>
                        No Cost<sup>*</sup>
                      </td>
                      <td>{price}</td>
                    </tr>
                    <tr>
                      <th scope='row'>6</th>
                      <td>${(price / 6).toFixed(2)}</td>
                      <td>
                        No Cost<sup>*</sup>
                      </td>
                      <td>{price}</td>
                    </tr>
                  </tbody>
                </table>
              )}
            </div>
            <div className='modal-footer'>
              <button
                type='button'
                className='btn btn-secondary'
                data-dismiss='modal'
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProductModal

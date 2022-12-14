import React from 'react';
import { AiOutlineBulb } from 'react-icons/ai';
import Container from '../Container';

export default function Navbar() {
  return (
    <div className="bg-secondary">
      <Container className="p-2">
        <div className="flex justify-between items-center">
          <img src="./logo.png" alt="" className='h-10'/>
          <ul className='flex items-center space-x-4'>
            <li>
              <button className='bg-dark-subtle p-1 rounded'>
                <AiOutlineBulb className= 'text-secondary' size = {24}/>
              </button>
            </li>
            <li>
              <input type="text" className='border-2 border-dark-subtle p-1 bg-transperant text-xl outline-none focus: border-white transition text-white'
              placeholder='Search...'/>
            </li>
            <li className='text-white font-semibold text-lg'>
              Login
            </li>
          </ul>
        </div>
      </Container>
    </div>
  )
}

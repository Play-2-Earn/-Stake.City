import React from 'react'
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

const Loader = () => {
    const display = {display: 'flex' , alignItems: 'center' , justifyContent: 'center' , height: '100%', width:'100%'}
  return (
    <div style={display}>
        <Spin
            indicator={
            <LoadingOutlined
                style={{
                fontSize: 48,
                color: '#45BEA6',
                }}
                spin
            />
            }
        />
    </div>
  )
}

export default Loader

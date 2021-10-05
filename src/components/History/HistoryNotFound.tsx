import React, {  } from "react";
import FloatingElement from '../layout/FloatingElement';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { Col,  Row, Tooltip } from 'antd';
import {  ExclamationCircleOutlined } from '@ant-design/icons';


const RowBox = styled(Row)`
  padding-bottom: 20px;
`;

const ColError = styled(Col)`
  align-self: center;
  text-align: center
`;



export function HistoryNotFound(){
    return(
        //@ts-ignore
      <FloatingElement style={{ flex: 1, paddingTop: 10 }}>
      <RowBox  justify="space-between">
      <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
        <h1>Historial</h1>
      </div>
      <div style={{display: 'flex',  justifyContent:'flex-end', alignItems:'center'}}>
        <Tooltip 
        placement="bottomLeft"
        title="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.">
            <span style={{color: "#1ce6d2"}}>
              <FontAwesomeIcon size='lg' icon={faInfoCircle} />
            </span>
        </Tooltip>
      </div>

      <Row justify="end" >
        <Col span={18} push={6}>
          <h3>No se ha encontrado historial asociado a este wallet</h3>
        </Col>
        <ColError  span={6} pull={18}>
          <ExclamationCircleOutlined style={{ color: '#f23b69', fontSize: '250%', textAlign: 'center' }}/>
        </ColError>
      </Row>      
    </RowBox>
    </FloatingElement>
    )
}
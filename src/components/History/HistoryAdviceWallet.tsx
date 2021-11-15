import React, {  } from "react";
import FloatingElement from '../layout/FloatingElement';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { Col,  Row, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

const history_help_test = "Aquí se muestra el historial de los ejercicios realizados por el usuario. Se requiere conectar la Wallet primero"

const RowBox = styled(Row)`
  padding-bottom: 20px;
`;

const ColError = styled(Col)`
  align-self: center;
  text-align: center
`;
const RowWallet = styled(Row)`
min-width: -webkit-fill-available
`;



export function HistoryAdviceWallet(){
  //@ts-ignore
    return(<FloatingElement style={{ flex: 1, paddingTop: 10 }}>
      <RowBox  justify="space-between">
      <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
        <h1>Historial</h1>
      </div>
      <div style={{display: 'flex',  justifyContent:'flex-end', alignItems:'center'}}>
        <Tooltip 
        placement="bottomLeft"
        title={history_help_test}>
            <span style={{color: "#1ce6d2"}}>
              <FontAwesomeIcon size='lg' icon={faInfoCircle} />
            </span>
        </Tooltip>
      </div>

      <RowWallet justify="end">
        <Col span={18} push={6}>
          <h3>Por favor, conecte su wallet</h3>
        </Col>
        <ColError span={6} pull={18}>
          <InfoCircleOutlined style={{ fontSize: '250%', textAlign: 'center' }}/>
        </ColError>
      </RowWallet>      
    </RowBox>
    </FloatingElement>
  )
}
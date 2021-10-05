import React, { useCallback, useEffect, useRef, useState, useContext } from 'react';
import { Col, Row, Select, Tabs, Button, Typography, Space } from 'antd';
import styled from 'styled-components';


const TabButton = styled(Button)`
  color: #1ce6d2;
  border-width: 1px;
  margin-right: 5px;
  active {
    background-color: #DF02F1;
    color: #DF02F1;
  }
`;

const { Title } = Typography;



export function InvestmentPage() {

    return (

        <Row
            style={{
                minHeight: '620px',
                flexWrap: 'nowrap',
            }}
        >
            <Col flex="auto" style={{ width: '100%' }}>
                <Row >
                    <Title>PAGINA DE INVERSION</Title>
                </Row>
            </Col>
            <Col
                flex="400px"
                style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            >
            </Col>
        </Row>

    );
};

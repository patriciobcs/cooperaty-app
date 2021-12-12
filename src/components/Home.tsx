import React, { Fragment, useState } from "react";
import { useAlert } from "react-alert";
import { CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';

const Home = () => {
  const alert = useAlert();
  const [action, setAction] = useState("");
  return (
    <Fragment>
      <button
        onClick={() => {
          alert.success(<div style={{ color: "Green" }}>Tu respuesta fue la acertada!</div>, {
            title: <div style={{ color: "Green" }}><CheckCircleTwoTone twoToneColor="#52c41a" /> Opción correcta!</div>,
            closeCopy: "Continuar",
            type: 'success'
          });
        }}
      >
        change copy on close button
      </button>
      <button
        onClick={() => {
          alert.success(<div style={{ color: "red" }}>Tu respuesta fue la erronea!</div>, {
            title: <div style={{ color: "red" }}><CloseCircleTwoTone twoToneColor="#ff0000" /> Opción incorrecta!</div>,
            closeCopy: "Continuar",
            type: 'success'
          });
        }}
      >
        change copy on close button
      </button>
    </Fragment>
  );
};

export default Home;


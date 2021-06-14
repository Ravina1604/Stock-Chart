import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "font-awesome/css/font-awesome.min.css";



const StockForm = ({ formData }) => {
  const [show, setShow] = useState(false);
  const [stocks, setStocks] = useState({number: 0});
  const [stockList, setStockList] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    
  }, [formData]);

  const handleClose = () => {
    setShow(false);
    let currentStocks = stockList;

    let i = currentStocks.findIndex(item => item.company === stocks.company);
    if( i === -1) {
        currentStocks.push({
            ...stocks
        })
    } else {
        currentStocks[i].number = stocks.number;
    }

    let sum = currentStocks.reduce( (accumulator, currentValue) => {
        return accumulator + (currentValue.price* currentValue.number )
    }, 0)

    let totalStocks = currentStocks.reduce( (accumulator, currentValue) => {
        return accumulator + currentValue.number 
    }, 0)

    if(sum > 1000000 || totalStocks > 1000) {
        setError("You can't buy stock more than 100 stocks or price more than 1000000$");
    } else {
        setError("")
        setStockList(currentStocks);
    }
  };

  const updateStock = (e) => {
    // if (e.target.value >= 0 && e.target.value <= 1000) {
      setStocks({...stocks, number: e.target.value});
    // }
  };

  const buyStock = (data) => {
    setStocks({company: data.name,price: data.close, number: 0});
    setShow(true);
  };

  return (
    <div className="stock-form body-container-card">
      <div className="stock-form-header">
        <label>Peformance Result</label>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Company Name</th>
            <th>Close Stock Price</th>
            <th>Buy</th>
          </tr>
        </thead>
        <tbody>
          {formData.map((data, index) => (
            <tr key={data.company+index}>
              <td>{data.name}</td>
              <td>{data.close}</td>
              <td>
                {" "}
                <i className="fa fa-plus" onClick={ () => buyStock(data)}></i>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {error !== "" && <label className="error-text">{error}</label>}

      <Modal show={show} onHide={handleClose}>
        {/* <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header> */}
        <Modal.Body>
          <label className="title">Number of Stocks : </label>
          <input
            type="number"
            min="0"
            max="1000"
            value={stocks.number}
            className="form-control"
            onChange={(e) => updateStock(e)}
            name="stocks"
            placeholder="Enter Number of Stocks"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Buy
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default StockForm;

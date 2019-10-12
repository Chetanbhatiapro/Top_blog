import React from "react";
import styled from "styled-components";

function Pagination({ handleNavPage, currentPage }) {
  // Create a array of 50 elements
  let numbers = Array(50);
  //   Filling the array with integer 1
  numbers = numbers.fill(1);

  return (
    <Div className="pagination-container">
      <ul className="pagination list-container">
        {numbers.map((number, index) => (
          <button
            onClick={handleNavPage}
            key={index}
            className={
              currentPage === index ? "pag-item-btn active" : "pag-item-btn"
            }
          >
            {index + 1}
          </button>
        ))}
      </ul>
    </Div>
  );
}

export default Pagination;

const Div = styled.div`
  max-width: 1100px;
  width: 100%;
  margin: 1rem auto;
  .list-container {
    display: flex;
    flex-wrap: wrap;
    width: 80%;
  }
  .pag-item-btn {
    border: 1px solid rgba(145, 143, 129, 0.3);
    padding: 0.5rem;
    color: rgb(255, 151, 53);
    background-color: white;
    text-decoration: none;
    &:hover {
      color: white;
      background-color: tomato;
    }
  }
  .active {
    color: white;
    background-color: tomato;
  }
`;

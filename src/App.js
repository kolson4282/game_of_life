import { useState, useEffect } from "react";
import styled from "styled-components";

import Cell from "./components/Cell";

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(
    ${(props) => props.gridHeight},
    ${(props) => props.cellSize}
  );
  grid-template-columns: repeat(
    ${(props) => props.gridWidth},
    ${(props) => props.cellSize}
  );
`;
function App() {
  const [gridHeight, setGridHeight] = useState(50);
  const [gridWidth, setGridWidth] = useState(50);
  const [cellSize, setCellSize] = useState("10px");
  const [grid, setGrid] = useState(initializeGrid());
  const [isRunning, setIsRunning] = useState(false);
  const [generation, setGeneration] = useState(0);

  useEffect(handleInterval);

  function initializeGrid() {
    let grid = [];
    let k = 0;
    for (let i = 0; i < gridHeight; i++) {
      let gridColumn = [];

      for (let j = 0; j < gridWidth; j++) {
        gridColumn.push({ x: i, y: j, alive: false, id: k });
        k++;
      }
      grid.push(gridColumn);
    }

    return grid;
  }

  function updateCell(updatedCell) {
    setGrid(
      grid.map((cell, index) => {
        if (cell.id === updatedCell.id) {
          return updatedCell;
        }
        return cell;
      })
    );
  }

  function getNeighbors(cell) {
    const neighborPositions = [
      [cell.x - 1, cell.y - 1],
      [cell.x, cell.y - 1],
      [cell.x + 1, cell.y - 1],
      [cell.x - 1, cell.y],
      [cell.x + 1, cell.y],
      [cell.x - 1, cell.y + 1],
      [cell.x, cell.y + 1],
      [cell.x + 1, cell.y + 1],
    ];

    const neighborCells = neighborPositions.reduce((arr, pos) => {
      if (
        pos[0] >= 0 &&
        pos[0] < gridHeight &&
        pos[1] >= 0 &&
        pos[1] < gridWidth
      ) {
        arr.push(grid[pos[0]][pos[1]]);
      }
      return arr;
    }, []);
    const neighbors = neighborCells.reduce((total, cell) => {
      if (cell.alive) {
        return total + 1;
      }
      return total;
    }, 0);

    return neighbors;
  }

  function iterate() {
    const newGrid = initializeGrid();
    setGrid(
      newGrid.map((column, i) => {
        column.map((cell, j) => {
          const neighborCells = getNeighbors(grid[i][j]);

          if (
            (neighborCells === 2 && grid[i][j].alive) ||
            neighborCells === 3
          ) {
            cell.alive = true;
          } else cell.alive = false;
          return cell;
        }, []);
        return column;
      }, [])
    );
    setGeneration(generation + 1);
  }

  function handleInterval() {
    let interval = null;
    if (isRunning) {
      interval = setInterval(iterate, 250);
    }
    return () => clearInterval(interval);
  }
  function toggle() {
    setIsRunning(!isRunning);
  }

  function clearGrid() {
    setIsRunning(false);
    setGrid(initializeGrid());
    setGeneration(0);
  }
  return (
    <div>
      <Grid
        className="App"
        gridHeight={gridHeight}
        gridWidth={gridWidth}
        cellSize={cellSize}
      >
        {grid.map((column) =>
          column.map((cell) => (
            <Cell
              key={cell.id}
              cell={cell}
              size={cellSize}
              updateCell={updateCell}
            ></Cell>
          ))
        )}
      </Grid>
      <p>Generation: {generation}</p>
      <button onClick={iterate}>Next Generation</button>
      <button onClick={toggle}>{isRunning ? "Stop" : "Start"}</button>
      <button onClick={clearGrid}>Clear</button>
    </div>
  );
}

export default App;

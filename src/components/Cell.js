// import "./Cell.css";
function Cell({ cell, size, updateCell, getNeighbors }) {
  function clickCell() {
    let newCell = cell;
    newCell.alive = !cell.alive;
    updateCell(newCell);
  }
  return (
    <div
      className={`cell ${cell.alive ? "alive" : "dead"}`}
      onClick={clickCell}
      style={{
        backgroundColor: cell.alive ? "black" : "white",
        width: size,
        height: size,
        border: "1px solid black",
      }}
    ></div>
  );
}

export default Cell;

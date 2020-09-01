import React from 'react';
import Table from './Components/Table/Table';
import { TableData, TableColumns } from './models/models';

function App() {

  const columns: TableColumns[] =  [
    { name: 'col1', width: 100 },
    { name: 'col2', width: 300 },
    { name: 'col3',  width: 200 },
    { name: 'col4',  width: 200 },
  ];

  const data: TableData[] =
    [
        {col1: 3, col2: 'bf', col4: 'g' },
        {col1: 4, col2: 'bb', col4: 'f' },
        {col1: 1, col2: 'ca', col4: 't' },
        {col1: 9, col2: 'gg' , col4: 'a' },
        {col1: 7, col2: 'de' , col4: 'b' },
        {col1: 8, col2: 'wy' , col4: 'v' },
        {col1: 5, col2: 'xn' , col4: 'w' },
        {col1: 6, col2: 'xa' , col4: 'y' },
    ];

  return (
    <div>
      <Table columns={columns} data={data} />
    </div>
  );
}

export default App;
